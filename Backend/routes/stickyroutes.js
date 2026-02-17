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
      YCoord: ycoord,
      Visibility: visibility
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



router.get("/fetchAll", async (req, res) => {
  try {
    const { userx, usery } = req.query;

    const x = parseFloat(userx);
    const y = parseFloat(usery);

    if (isNaN(x) || isNaN(y)) {
      return res.status(400).json({ error: "Incomplete or Invalid Coordinates" });
    }

    const xrange_min = x - 0.00025;
    const xrange_max = x + 0.00025;
    const yrange_min = y - 0.00025;
    const yrange_max = y + 0.00025;

    const snapshot = await db
      .collection("Notes")
      .where("XCoord", ">=", xrange_min)
      .where("XCoord", "<=", xrange_max)
      .get();

    const notesInX = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const stickers = notesInX.filter(
      (note) => note.YCoord >= yrange_min && note.YCoord <= yrange_max
    );

    // Build unique list of user doc IDs (your Notes store userId as the Users doc id)
    const userDocIds = [...new Set(stickers.map((s) => s.userId).filter(Boolean))];

    // Fetch user docs in parallel
    const userDocs = await Promise.all(
      userDocIds.map((id) => db.collection("Users").doc(id).get())
    );

    // Map: userId -> Username
    const userMap = {};
    userDocs.forEach((d) => {
      if (d.exists) {
        const u = d.data();
        userMap[d.id] = u?.Username || u?.username || "anon";
      }
    });

    // Attach Username onto each note
    const enriched = stickers.map((s) => ({
      ...s,
      Username: userMap[s.userId] || "anon",
    }));

    return res.status(200).json({ stickies: enriched });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching stickies in your area" });
  }
});



// fetch all sticky notes from a user
router.get("/fetchUsersNotes", async (req, res) => {
  try {
    const { username } = req.query;

    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "Missing username" });
    }

    const cleanUsername = username.trim();

    // find user by Username
    const userSnap = await db
      .collection("Users")
      .where("Username", "==", cleanUsername)
      .get();

    if (userSnap.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    // IMPORTANT: use Firestore doc id as the userId
    const userId = userSnap.docs[0].id;

    // query notes by userId
    const notesSnap = await db
      .collection("Notes")
      .where("userId", "==", userId)
      .get();

    const userNotes = notesSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({ stickies: userNotes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Retrieving sticky notes failed" });
  }
});











module.exports = router; 