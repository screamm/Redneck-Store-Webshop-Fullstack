// const initStripe = require("../stripe");
// const fs = require("fs").promises;
// const stripe = initStripe();
// const path = require("path");
// require("dotenv").config();




// const getProducts = async (req, res) => {
//     const stripe = initStripe();
//     if (!stripe) {
//       console.error("Stripe not online. Check API key.");
//       return res.status(500).send("Stripe init failed.");
//     }
//     try {
//       const productPriceData = await stripe.prices.list({
//         expand: ["data.product"],
//         limit: 100,
//       });
  
//       const productsWithPrice = productPriceData.data.map((priceData) => ({
//         id: priceData.product.id,
//         name: priceData.product.name,
//         price: priceData.unit_amount / 100,
//         images: priceData.product.images,
//       }));
  
//       res.status(200).json(productsWithPrice);
//     } catch (error) {
//       console.error("Error fetch products:", error);
//       res.status(500).send("Error fetching products.");
//     }
//   };
  
  

//   // const createCheckoutSession = async (req, res) => {
//   //   const cart = req.body;
  
//   //   const stripe = initStripe();
  
//   //   if (!req.session || !req.session.user) {
//   //     return res.status(401).json({ error: "Unauthorized" });
//   //   }
//   //   console.log(cart);
  
//   //   const line_items = await Promise.all(
//   //     cart.map(async (item) => {
//   //       const product = await stripe.products.retrieve(item.product);
//   //       const price = await stripe.prices.list({
//   //         product: item.product,
//   //         limit: 1,
//   //       });
//   //       return {
//   //         price_data: {
//   //           currency: "sek",
//   //           product_data: {
//   //             name: product.name,
//   //             images: [product.images[0]],
//   //           },
//   //           unit_amount: price.data[0].unit_amount,
//   //         },
//   //         quantity: item.quantity,
//   //       };
//   //     })
//   //   );
  
//   //   const session = await stripe.checkout.sessions.create({
//   //     payment_method_types: ["card"],
//   //     customer: req.session.user.id,
//   //     customer_email: req.session.user.email,
//   //     line_items: line_items,
//   //     allow_promotion_codes: true,
//   //     mode: "payment",
//   //     success_url: "http://localhost:5173/confirmation",
//   //     cancel_url: "http://localhost:5173/cancellation",
//   //   });
  
//   //   res.json({ sessionId: session.id, url: session.url });
//   // };





// const verifySession = async (req, res) => {
        

//         const stripe = initStripe();
//     const sessionId = req.body.sessionId;
//     const session = await stripe.checkout.sessions.retrieve(sessionId);
// console.log(session)
//     if (session.payment_status === "paid") {
//         const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
//         console.log(lineItems)
//         const order = {
//             orderNumber: Math.floor(Math.random() * 100000000),
//             customerName: session.customer_details.name,
//             products: lineItems.data,
//             total: session.amount_total,
//             date: new Date()
//         };

        
//         const ordersFilePath = path.join(__dirname, "..", "data", "orders.json");

//         const orders = JSON.parse(await fs.readFile(ordersFilePath));
//         orders.push(order);
//         await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 4));

//         res.status(200).json({ verified: true });
//         return; 
//     }

//     res.status(200).json({ verified: false });
// }; 


// module.exports = { createCheckoutSession, getProducts, verifySession };