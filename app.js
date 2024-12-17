const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const url = 'mongodb://db:27017'; 
const dbName = 'testdb';

const client = new MongoClient(url);

app.get('/', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('test');

    await collection.insertOne({ message: 'Hello, it is working!!!!' });
    const result = await collection.findOne({}, { sort: { _id: -1 } }); 

    res.send(`Connected to MongoDB! Message: ${result.message}`);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error connecting to MongoDB');
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
