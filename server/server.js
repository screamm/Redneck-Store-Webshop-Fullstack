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
    try {
        let { lineItems, email, status, totalPrice } = request.body;
        let orderId = await DatabaseConnection.getInstance().saveOrder(lineItems, email, status, totalPrice);

        response.status(200).json({ "id": orderId });
        console.log("*********** Order created ************".blue.bold);
    } catch (error) {
        console.error("Failed to create order:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});



// DELETE ORDER
app.delete("/orders/:id", async (request, response) => {
    try {
        const result = await DatabaseConnection.getInstance().deleteOrder(request.params.id);
        if (result.deletedCount === 0) {
            return response.status(404).json({ message: "Order not found" });
        }
        response.json({ message: "Order deleted successfully", id: request.params.id });
    } catch (error) {
        console.error("Failed to delete order:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});



//LÄGG TILL PRODUKT
app.post("/products", async (request, response) => {
    console.log("Received product data:", request.body);

    let id = await DatabaseConnection.getInstance().createProduct(request.body);
    await DatabaseConnection.getInstance().updateProduct(id, request.body);

    response.json({"id": id});

});


//UPPDATERA PRODUKT
app.post("/products/:id", async (request, response) => {
    console.log("Received product data:", request.body);

    await DatabaseConnection.getInstance().updateProduct(request.params.id, request.body);

    response.json({"id": request.params.id});

});



//TAG BORT PRODUKT
app.delete("/products/:id", async (request, response) => {
    try {
        const result = await DatabaseConnection.getInstance().deleteProduct(request.params.id);
        if (result.deletedCount === 0) {
            return response.status(404).json({ message: "Product not found" });
        }
        response.json({ message: "Product deleted successfully", id: request.params.id });
    } catch (error) {
        console.error("Failed to delete product:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});




app.use(cookieSession({
    secret: "DontTellAnyone",
    maxAge: 1000 * 60 * 60,
  }));

  app.use("/auth", authRouter)
  app.use("/users", usersRouter)

  
app.listen(3000, () => console.log(" ***** Server  is running on port 3000 ***** ".yellow.bold));