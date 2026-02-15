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
      Prompt: prompt || "",  // if there is prompt store it, otherwise an empty string 
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



// fetch all sticky notes in the data that are within a certain distance range 

router.get('/fetchAll', async (req, res) => {
    try{
        const { userx,usery } = req.query; // input is just user location and then we can query all the stickies in that area
       
        const x = parseFloat(userx); // convert these to floats 
        const y = parseFloat(usery);

        if (isNaN(x)|| isNaN(y)){
           return res.status(400).json({
            error: "Incomplete or Invalid Coordinates"
         });

        }
        
        // define logitude and latitiude ranges the sticky must satify both ranges 
        const xrange_min = x - 0.00025;
        const xrange_max = x + 0.00025;

        const yrange_min = y - 0.00025;
        const yrange_max = y + 0.00025; 

        const snapshot = await db.collection('Notes')
        .where('XCoord', '>=', xrange_min) // can only filter on one attribute in firestore 
        .where('XCoord', '<=', xrange_max)
        .get();

        const stickers = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(note =>
            note.YCoord >= yrange_min &&
            note.YCoord <= yrange_max
        );

      
        return res.status(200).json(stickers) // status message for successfully pulled stickers 
    }

    catch(error){
       console.error(error);
        res.status(500).json({
        error: "Error fetching stickies in your area"

    });


 }

});


// fetch all sticky notes from a user
router.get('/fetchUsersNotes', async (req, res) => {
  try{
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

    // convert to array of data of all elements
    const userNotes = snapshot.docs.map((doc) => doc.data());
    res.json(userNotes); // send query results

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Retrieving sticky notes failed"
    });
  }
    
});

module.exports = router; 
