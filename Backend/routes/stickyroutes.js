const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// sticky notes are created and deleted within one person's account 

// create a sticky note, this sticky note will have a user account attached to it too
router.post('/addnote', async (req, res) => {
  try {
    const { username, title, body, tags, category, xcoord, ycoord, prompt, visibility } = req.body;

    if (!username || !title || !body || !category || !xcoord || !ycoord || !visibility) {
      return res.status(400).json({
        error: "Incomplete sticky note"
      });
    }

    const snapshot = await db.collection('Users').where('Username', '==', username).get();

    if (snapshot.empty) {
      return res.status(401).json({
        error: "Invalid user"
      });
    }

    const userId = snapshot.docs[0].id;

    const data = {
      userId: userId, // store the user id as each sticky is attributed to one user 
      Title: title,
      Body: body,
      Timestamp: new Date(),
      Tags: tags || [],
      Category: category,
      XCoord: xcoord,
      YCoord: ycoord
    };

    const note = await db.collection('Notes').add(data);

    res.status(201).json({
      message: "Note added successfully",
      noteId: note.id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Creating sticky failed"
    });
  }
});




// delete a sticky note









// fetch all sticky notes in the data that are within a certain distance range 

// router.get('/fetchAll'), async (req, res) => {
//     try{
//         const {  xcoord, ycoord } = req.body; // input is just user location and then we can query all the stickies in that area

//         const snapshot = 





//     }

//     catch(error){
//        console.error(error);
//         res.status(500).json({
//        error: "Error fetching stickies in your area"

//     });


// }


// fetch all sticky notes from a user
router.get('/fetchUsersNotes', async (req, res) => {
  // Retreive the user ID from req body
  const {userID} = req.body;

  const notesRef = db.collection('Notes'); // reference to Notes collection
  // query sticky notes from userID
  const snapshot = await notesRef.where('userId','==',userID).get(); // snapshot is Promise object
  if (snapshot.empty) {
    console.log('No matching documents.');
    return;
  }  
  // Prints query results to console
  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
  });

  res.send(snapshot); // send query results

});











module.exports = router; 