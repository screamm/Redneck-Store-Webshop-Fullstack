const mongodb = require("mongodb");
const bcrypt = require('bcrypt');


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
              "totalPrice": lineItem["totalPrice"], 
              "order": new mongodb.ObjectId(orderId),
              "product": new mongodb.ObjectId(lineItem["product"]),
          }
      });
  
      let lineItemsCollection = db.collection("lineItems");
      await lineItemsCollection.insertMany(encodedLineItems);
  
      return orderId;
  }


    async createProduct(productData) {
      await this.connect();
      const db = this.client.db("shop");
      const collection = db.collection("products");
      
      let result = await collection.insertOne({
          status: "active",
          name: productData.name || "",
          description: productData.description || "",
          image: productData.image || "",
          amountInStock: parseFloat(productData.amountInStock) || 0,
          price: parseFloat(productData.price) || 0, 
          category: productData.category || null
      }
      );
      

      console.log("Type of price after saving:", typeof productData.price
      );



    
      
      
      return result.insertedId;
  }

  async findUserByEmail(email) {
    await this.connect();
    const db = this.client.db("shop");
    const collection = db.collection("customers");
    return await collection.findOne({ email: email });
}


    async updateProduct(id, productData) {
        await this.connect();

        let db = this.client.db("shop");
        let collection = db.collection("products");

        await collection.updateOne({"_id": new mongodb.ObjectId(id)}, {"$set": {
            "name": productData["name"],
            "description": productData["description"],
            "amountInStock": productData["amountInStock"],
            "image": productData["image"] || "",
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
              linkedCustomerEmail: "$customer",  
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




    async createUser(userData) {
        await this.connect();
        const db = this.client.db("shop");
        const collection = db.collection("customers");
    
        const hashedPassword = await bcrypt.hash(userData.password, 10);
    
        const result = await collection.insertOne({
            _id: userData.email,  
            name: userData.name,
            email: userData.email,
            password: hashedPassword,  
        
        });
    
        return result.insertedId; 
    }
    




async deleteProduct(productId) {
  await this.connect();
  const db = this.client.db("shop");
  const collection = db.collection("products");
  const result = await collection.deleteOne({ _id: new mongodb.ObjectId(productId) });
  return result;
}

async deleteOrder(orderId) {
  await this.connect();
  const db = this.client.db("shop");
  const ordersCollection = db.collection("orders");
  const result = await ordersCollection.deleteOne({ _id: new mongodb.ObjectId(orderId) });
  return result;
}


}

module.exports = DatabaseConnection;