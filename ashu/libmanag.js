// Library Management CRUD using Express and MongoDB
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db;
const mongoUrl = 'mongodb://127.0.0.1:27017';

MongoClient.connect(mongoUrl)
  .then(client => {
    console.log("mongodb connected");
    db = client.db('library_db');
    app.listen(port, () => {
      console.log(`Library server is running at ${port}`);
    });
  })
  .catch(err => {
    console.log("Cant connect to mongodb");
  });

app.get('/', (req, res) => {
  res.send(`
    <h1>Library Management</h1>
    <h2>Add Book</h2>
    <form action="/inserting" method="POST">
      Title: <input type="text" name="title" required><br><br>
      Author: <input type="text" name="author" required><br><br>
      <button type="submit">Add Book</button>
    </form>
    <h2>Update Book</h2>
    <form action="/updating" method="POST">
      Book Title to Update: <input type="text" name="title" required><br><br>
      New Author: <input type="text" name="author" required><br><br>
      <button type="submit">Update</button>
    </form>
    <h2>Delete Book</h2>
    <form action="/deleting" method="POST">
      Book Title to Delete: <input type="text" name="title" required><br><br>
      <button type="submit">Delete</button>
    </form>
    <br>
    <a href="/getting">View All Books</a>
  `);
});

app.post('/inserting', async (req, res) => {
  try {
    const { title, author } = req.body;
    await db.collection('books').insertOne({ 
      title: title, 
      author: author 
    });
    res.send("Insertion successful!<br><a href='/'>Back</a>");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/getting', async (req, res) => {
  try {
    const results = await db.collection('books').find({}).toArray();
    let html = '<h1>All Books</h1>';
    results.forEach(value => {
      html += `<p>${value.title} - Author: ${value.author}</p>`;
    });
    html += '<a href="/">Back</a>';
    res.send(html);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/deleting', async (req, res) => {
  try {
    const { title } = req.body;
    const result = await db.collection('books').deleteMany({ title: title });
    res.send(`Deleted ${result.deletedCount} entries<br><a href="/">Back</a>`);
  } catch (err) {
    res.send('Failed to delete<br><a href="/">Back</a>');
  }
});

app.post('/updating', async (req, res) => {
  try {
    const { title, author } = req.body;
    const result = await db.collection('books').updateOne(
      { title: title }, 
      { $set: { author: author } }
    );
    if (result.modifiedCount > 0) {
      res.send(`Successfully updated<br><a href="/">Back</a>`);
    } else {
      res.send(`Data not found<br><a href="/">Back</a>`);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
