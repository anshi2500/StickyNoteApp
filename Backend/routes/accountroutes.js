const express = require('express');
const router = express.Router(); // mini app that lives in the main application 
const db = require('../config/firebase');
const bcrypt = require('bcrypt'); 

// create an account
// Account contains username and password 

router.post('/register', async (req, res) => {

 try{ // wrap whole code in try and catch block 
    console.log('Creating New Account')

    // Retreive the username and password from the req body as parameters
    const { username, password } = req.body;
    // edge cases, make sure there is both a username and password
    // otherwise return a client error response 
    if (!username || !password){
         return res.status(400).json({error: "Need a username and password"});

    }
    // usernames cannot be the same return an error if it already exists in the server 
    // query a snapshot from the server where the inputted username is one of the usernames in the firebase 
    const snapshot = await db.collection('Users').where('Username', '==', username).get();

    if (!snapshot.empty){
        return res.status(400).json({error: "Username is already taken"});
    }

    const hashedpassword = await bcrypt.hash(password, 10);// using the bcrypt to hash the password  we will use bcrypt compare for the log in 

    const data = {
            Username: username, 
            Password: hashedpassword  
        }

     const new_data = await db.collection('Users').add(data); // add automcatically generates a unique identifier 

     console.log('Added document with ID: ', new_data.id);

     // res status, addition to database is successful

     res.status(201).json({
     message: "Registration successful",
     userId: new_data.id  // user id is returned to the frontend as we can associate the stickers with the specific user 
    });

    }

    catch(error){
        console.error(error);
        res.status(500).json({error: "Registration failed"}); // 500 is an http status code for internal server errror 
    }
   
}); 



// authenticate account, login is always post 
router.post('/login', async (req, res) => {
    try{
        const { username, password } = req.body;

        // no username or password
        if (!username || !password){
         return res.status(400).json({error: "Need a username and password"});
        }
        
        // username doesnt exist 
        const snapshot = await db.collection('Users').where('Username', '==', username).get(); // snapshot should only be one row 
        
         if (snapshot.empty){
             return res.status(401).json({error: "Username or Password is wrong"});
         }

        // wrong password
        const username_match = snapshot.docs[0].data() // get the first row that matches the snapshot query, there should only be one username anyway

        const password_match = await bcrypt.compare(password, username_match.Password)

        if (!password_match){
            return res.status(401).json({error: "Username or Password is wrong"});
        }

        res.status(200).json({
        message: "Login successful",
        userId: snapshot.docs[0].id
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({error: "Log in failed"}); // 500 is an http status code for internal server errror 
    }

});


// delete account 
router.delete('/deleteAccount', async (req, res) => {
    try{
        // extend on user authentication 
         const { username, password } = req.body;

        // no username or password
        if (!username || !password){
         return res.status(400).json({error: "Need a username and password"});
        }
        
        // username doesnt exist 
        const snapshot = await db.collection('Users').where('Username', '==', username).get(); // snapshot should only be one row 
        
         if (snapshot.empty){
             return res.status(401).json({error: "Username or Password is wrong"});
         }

        // wrong password
        const username_match = snapshot.docs[0].data() // get the first row that matches the snapshot query, there should only be one username anyway

        const password_match = await bcrypt.compare(password, username_match.Password)

        if (!password_match){
            return res.status(401).json({error: "Username or Password is wrong"});
        }

        await db.collection('Users').doc(snapshot.docs[0].id).delete();

        res.status(200).json({
        message: "Deletion was successful"
        });

   
    }
    catch(error){
        console.error(error);
        res.status(500).json({error: "Account Deletion Failed"});

     }

}); 







module.exports = router; 