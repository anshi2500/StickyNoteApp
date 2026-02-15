const express = require('express');
const app = express();
const db = require('./config/firebase');
const accountrouter = require('./routes/accountroutes'); // functions returned here 
const stickyrouter = require('./routes/stickyroutes'); // return the functions here

// serves as a "main page " for the backend 

app.use(express.json());

// these are the different domains our backend will be under split into two encapsulations,
// stuff for accounts and the stickynote stuff 

app.use('/account', accountrouter) // defines the api url to use in the frontend , make naming conventions more simple
app.use('/notes', stickyrouter)



app.listen(3000, () => {
  console.log('Server running on port 3000');
})
