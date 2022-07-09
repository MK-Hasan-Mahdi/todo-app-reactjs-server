const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://todo_user:V5rG871jWDCPvA6X@cluster0.4km4i.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     console.log('db connected');
//     // perform actions on the collection object
//     client.close();
// });

async function run() {
    try {
        await client.connect();
        console.log('db connected');
        const taskCollection = client.db('todoApp').collection('tasks');

        // const task = { taskName: "Please insert task", isComplete: false };
        // const result = await taskCollection.insertOne(task);

        app.post('/addTask', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        });

        app.get('/tasks', async (req, res) => {
            const tasks = await taskCollection.find({ isComplete: false }).toArray();
            res.send(tasks);
        });

        // all completed task
        app.get('/completedTask', async (req, res) => {
            const completedTask = await taskCollection.find({ isComplete: true }).toArray();
            res.send(completedTask);
        })

        // completed task by task id update
        app.put('/completeTask/:id', async (req, res) => {
            const taskId = req.params.id;
            const completeTask = req.body;
            // if (!id) { return };
            const filter = { _id: ObjectId(taskId) };
            const updateDoc = { $set: completeTask };
            const result = await taskCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        // delete task 
        app.delete('/deleteTask/:id', async (req, res) => {
            const deletedTaskId = req.params.id;

            const query = { _id: ObjectId(deletedTaskId) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running todo server');
});

app.listen(port, () => {
    console.log('Alhamdulillah todo server running');
})