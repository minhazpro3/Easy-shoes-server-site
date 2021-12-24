const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
const fileUpload= require('express-fileupload');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
require('dotenv').config()
app.use(fileUpload())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z45ex.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




async function run() {
 
  try{
    await client.connect();
    const database = client.db("ShoesBazar");
    const allProducts = database.collection("allProducts");
    const allOrderInfo = database.collection("allOrderInfo");


    app.post('/allProduct', async (req,res)=>{
      const gender= req.body.gender;
      const price = req.body.price;
      const priceOffer = req.body.priceOffer;
      const title = req.body.title;
      const description = req.body.description;
      const picture = req.files.image;
      const pictureData = picture.data;
      const encodedPicture = pictureData.toString('base64')
      const imageBuffer = Buffer.from(encodedPicture, 'base64')
      const services = {
        gender,
        priceOffer,
          price,
          title,
          description,
          image: imageBuffer
      }
      const result = await allProducts.insertOne(services)
      
      res.json(result)
  })

      // all products on home page
    app.get('/allProduct', async (req,res)=>{
      const result = await allProducts.find({}).toArray()
      res.send(result)
    })

    // every order post
    app.post('/orderInfo', async (req,res)=>{
      const query = req.body;
      const result= await allOrderInfo.insertOne(query)
      res.send(result)
    })

    // get one product
    app.get(`/product/:id`, async (req,res)=>{
      const id =req.params.id;
      const query = {_id: ObjectId(id)}
      const result = await allProducts.findOne(query);
      res.send(result)
  })

//   get all product
    app.get('/allData', async (req,res)=>{
        const result = await allOrderInfo.find({}).toArray()
        res.send(result)
    })

  }
  finally{
    // await client.close();
}

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.listen(port, () => {
    console.log(`database connected success`)
  })


