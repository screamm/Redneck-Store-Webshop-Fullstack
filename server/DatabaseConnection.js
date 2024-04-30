const mongodb = require("mongodb");

let instance = null;

class DatabaseConnection {
    constructor() {
        this.url = null;
    }

    setUrl(url) {
        this.url = url;
    }

    async connect() {
        if(this.client) {
            return;
        }
        this.client = new mongodb.MongoClient(this.url);

        await this.client.connect();
    }

    async saveOrder(lineItems, customer, status, orderTotalPrice) {
      await this.connect();
  
      let db = this.client.db("shop");
      let collection = db.collection("orders");
  
      // Beräkna totalt pris för ordern om det inte redan är givet
      if (!orderTotalPrice) {
          orderTotalPrice = lineItems.reduce((total, item) => total + item.totalPrice, 0);
      }
  
      let result = await collection.insertOne({
          "customer": customer,
          "orderDate": new Date(),
          "status": status,
          "totalPrice": orderTotalPrice,
          "paymentId": null
      });
  
      let orderId = result.insertedId;
      let encodedLineItems = lineItems.map((lineItem) => {
          return {
              "amount": lineItem["amount"],
              "totalPrice": lineItem["totalPrice"], // Använd det faktiska totalpriset från klienten
              "order": new mongodb.ObjectId(orderId),
              "product": new mongodb.ObjectId(lineItem["product"]),
          }
      });
  
      let lineItemsCollection = db.collection("lineItems");
      await lineItemsCollection.insertMany(encodedLineItems);
  
      return orderId;
  }
    // async saveOrder(lineItems, customer) {

    //     await this.connect();

    //     let db = this.client.db("shop");
    //     let collection = db.collection("orders");

    //     let result = await collection.insertOne({"customer": customer, "orderDate": new Date(), "status": "unpaid", "totalPrice": 0, "paymentId": null}); //METODO: calculate total price

    //     let orderId = result.insertedId;
    //     let encodedLineItems = lineItems.map((lineItem) => {
    //         return {
    //             "amount": lineItem["amount"],
    //             "totalPrice": 0 /* METODO: calculate */,
    //             "order": new mongodb.ObjectId(orderId),
    //             "product": new mongodb.ObjectId(lineItem["product"]),
    //         }
    //     })
        
    //     let lineItemsCollection = db.collection("lineItems");
    //     await lineItemsCollection.insertMany(encodedLineItems)

    //     return result.insertedId;
    // }

    async createProduct() {
        await this.connect();

        let db = this.client.db("shop");
        let collection = db.collection("products");

        let result = await collection.insertOne({"status": "draft", "name": null, "description": null, "image": null, "amountInStock": 0, "price": 0, "category": null});

        return result.insertedId;
    }

    async updateProduct(id, productData) {
        await this.connect();

        let db = this.client.db("shop");
        let collection = db.collection("products");

        await collection.updateOne({"_id": new mongodb.ObjectId(id)}, {"$set": {
            "name": productData["name"],
            "description": productData["description"],
            "amountInStock": productData["amountInStock"],
            "price": productData["price"],
            "category": productData["category"] ? new mongodb.ObjectId(productData["category"]) : null
        }});
    }

    async save(aCollection, aId, aData) {
      await this.connect();

      let db = this.client.db("shop");
      let collection = db.collection(aCollection);

      await collection.updateOne({"_id": aId}, {"$set": aData});
    }

    async getProducts() {
        await this.connect();

        let db = this.client.db("shop");
        let collection = db.collection("products");

        let pipeline = [
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
              },
            },
            {
              $addFields: {
                category: {
                  $first: "$category",
                },
              },
            },
          ];

        let documents = collection.aggregate(pipeline);
        let returnArray = [];

        for await(let document of documents) {
            returnArray.push(document);
        }

        return returnArray;
    }

  

    async getAllOrders() {
      await this.connect();
      let db = this.client.db("shop");
      let collection = db.collection("orders");
  
      let pipeline = [
          {
            $lookup: {
              from: "lineItems",
              localField: "_id",
              foreignField: "order",
              as: "lineItems",
              pipeline: [
                {
                  $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "product",
                  },
                },
                {
                  $addFields: {
                    product: {
                      $first: "$product",
                    },
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              linkedCustomerEmail: "$customer",  // Directly use customer as it's the email
            },
          },
        ];
  
      let documents = collection.aggregate(pipeline);
      let returnArray = [];
      for await(let document of documents) {
          returnArray.push(document);
      }
      return returnArray;
  }
  


    static getInstance() {
        if(instance === null) {
            instance = new DatabaseConnection();
        }
        return instance;
    }

// In DatabaseConnection.js

async deleteProduct(productId) {
  await this.connect();
  const db = this.client.db("shop");
  const collection = db.collection("products");
  const result = await collection.deleteOne({ _id: new mongodb.ObjectId(productId) });
  return result;
}



}

module.exports = DatabaseConnection;