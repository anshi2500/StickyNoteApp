const express = require('express');
const app = express();
const db = require('./config/firebase');
const accountstuff = require('./accountstuff');
const stickystuff = require('./stickytuff'); 

// serves as a "main page " for the backend 

app.use(express.json());

// app.get('/', async (req, res) => { // root route confirmation message 
//   try {
//     const snapshot = await db.collection('test').get(); // this should return nothing because we dont have anything 
//     res.send('Backend is runninhg');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error.message);
//   }
// });




app.listen(3000, () => {
  console.log('Server running on port 3000');
})
