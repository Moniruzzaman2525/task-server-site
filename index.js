const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hfl6b.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const servicesCollection = client.db("task").collection("service");

        // TASK API
        app.get('/tasks', async (req, res) => {
            const cursor = servicesCollection.find()
            const services = await cursor.toArray();
            res.send(services)
        });

        //Add Api
        app.post('/add', async (req, res) => {
            const newItem = req.body;
            const result = await servicesCollection.insertOne(newItem);
            res.send({ result: 'success' });
        });

        //ITEM DELETE API
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.send(result);
        });


        //update task
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const task = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    selected: task.newSelected
                }
            }
            const result = await servicesCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });


    }
    finally {

    }
}

run().catch(console.dir())



app.get('/', (req, res) => {
    res.send('Running My node server !!')
})

app.listen(port, () => {
    console.log('Listing', port);
})