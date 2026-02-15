const express = require('express');
const app = express();
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

 admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
 });

const db = admin.firestore();

app.use(express.json());


app.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('test').get();
    res.send('Firestore read worked');
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});


app.listen(3000, () => {
  console.log('Server running on port 3000');
})
