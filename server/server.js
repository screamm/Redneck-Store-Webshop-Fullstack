const express = require("express");
require("colors");
const cors = require("cors");
const DatabaseConnection = require("./DatabaseConnection");
const url = 'mongodb://localhost:27017';
const fs = require("fs").promises;
const path = require("path");
const cookieSession = require("cookie-session");

const authRouter = require("./routers/auth.router")
const usersRouter = require("./routers/users.router")
// const stripeRouter = require("./routers/stripe.router")
// const { getProducts } = require("./controllers/stripe.controller");


const app = express();

app.use(express.json());
app.use(express.urlencoded());

DatabaseConnection.getInstance().setUrl(url);

app.use(
  cors({origin: "http://localhost:5173", credentials: true}));
  

//HÄMTA ORDRAR
app.get("/orders", async (request, response) => {
    
    let orders = await DatabaseConnection.getInstance().getAllOrders();
    response.json(orders);

    }
);


//HÄMTA PRODUKTER
app.get("/products", async (request, response) => {

    let products = await DatabaseConnection.getInstance().getProducts();

    response.json(products);

    }
);


//SKAPA ORDER
app.post("/create-order", async (request, response) => {
    
    //METODO: create customer
    let orderId = await DatabaseConnection.getInstance().saveOrder(request.body.lineItems, request.body.email)
    response.json({"id": orderId});

    const ordersFilePath = path.join(__dirname, ".", "data", "orders.json");

    const orders = JSON.parse(await fs.readFile(ordersFilePath));
    orders.push(request.body);
    await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 4));
console.log("*********** Order created ************".blue.bold);
    // response.status(200).json({ verified: true });
    return; 
});

// response.status(200).json({ verified: false });


//LÄGG TILL PRODUKT
app.post("/products", async (request, response) => {
    
    let id = await DatabaseConnection.getInstance().createProduct();
    await DatabaseConnection.getInstance().updateProduct(id, request.body);

    response.json({"id": id});

});


//UPPDATERA PRODUKT
app.post("/products/:id", async (request, response) => {
    
    await DatabaseConnection.getInstance().updateProduct(request.params.id, request.body);

    response.json({"id": request.params.id});

});



//TAG BORT PRODUKT
app.delete("/products/:id", async (request, response) => {
    
    await DatabaseConnection.getInstance().updateProduct(request.params.id, request.body);

    response.json({"id": request.params.id});

});




app.use(cookieSession({
    secret: "DontTellAnyone",
    maxAge: 1000 * 60 * 60,
  }));

  app.use("/auth", authRouter)
  app.use("/users", usersRouter)
//   app.use("/payments", stripeRouter);
//   app.get("/products", getProducts);


// app.listen(3000);
app.listen(3000, () => console.log(" ***** Server  is running on port 3000 ***** ".yellow.bold));




// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const cookieSession = require("cookie-session");
// require("colors");

// const authRouter = require("./routers/auth.router")
// const usersRouter = require("./routers/users.router")
// const stripeRouter = require("./routers/stripe.router")
// const { getProducts } = require("./controllers/stripe.controller");


// const app = express();

// app.use(
//   cors({origin: "http://localhost:5173", credentials: true}));

// app.use(express.json())

// app.use(cookieSession({
//     secret: "DontTellAnyone",
//     maxAge: 1000 * 60 * 60 * 24,
//   }));

// app.use("/auth", authRouter)
// app.use("/users", usersRouter)
// app.use("/payments", stripeRouter);
// app.get("/products", getProducts);

// app.listen(3000, () => console.log("Server  is running on port 3000".yellow.bold));