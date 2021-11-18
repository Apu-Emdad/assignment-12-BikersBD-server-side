const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1ikru.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("found client");
    const database = client.db("BikersBD");
    const serviceCollection = database.collection("services");
    const orderCollection = database.collection("orders");
    const usersCollection = database.collection("users");
    const reviewCollection = database.collection("reviews");

    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log(service);
      const result = await serviceCollection.insertOne(service);
      res.json(result);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      // console.log(req.body);
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      console.log(review);
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });

    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });

    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const filter = { _id: ObjectId(id) };
      const updatedStatus = req.body;
      const option = { upsert: true };
      console.log(updatedStatus);
      const updateDoc = {
        $set: {
          status: updatedStatus.status,
        },
      };
      const result = await orderCollection.updateOne(filter, updateDoc, option);
      res.json(result);
    });
    app.get("/services", async (req, res) => {
      const query = serviceCollection.find({});
      const services = await query.toArray();
      res.send(services);
    });
    app.get("/users", async (req, res) => {
      const query = usersCollection.find({});
      const services = await query.toArray();
      res.send(services);
    });
    app.get("/orders", async (req, res) => {
      const query = orderCollection.find({});
      const orders = await query.toArray();
      res.send(orders);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(filter);
      res.send(service);
    });

    /*--saving user data to database start --*/
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });
    /*--saving user data to database end --*/
    /*--saving user from google start---*/
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    /*--saving user from google end ---*/
    //updating shipment

    /*--admin start --*/
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      // console.log("put", req.decodedEmail);
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    /* admin end */
    //delete product
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const filter = { _id: ObjectId(id) };
      const result = await serviceCollection.deleteOne(filter);
      res.json(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello from my first ever node");
});

app.listen(port, () => {
  console.log("listening to port", port);
});
