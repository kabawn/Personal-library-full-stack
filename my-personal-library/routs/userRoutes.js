const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const pool = require("../database");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// Set up multer for file handling
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "uploads/");
   },
   filename: (req, file, cb) => {
      cb(null, `user-${Date.now()}-${file.originalname}`);
   },
});

const upload = multer({ storage });

// Validation rules for user data
const userValidationRules = [
   body("name").trim().notEmpty().withMessage("Name is required."),
   body("bio").trim().optional().escape(),
   body("favorite_genre").trim().optional().escape(),
];

// Middleware to check for validation errors
const checkValidation = (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }
   next();
};

// Helper function to generate a unique ID
const generateUniqueId = (name) => {
   return crypto.randomBytes(8).toString("hex");
};

// Route to create a new user with more details and profile picture
router.post(
   "/users",
   upload.single("profile_pic"),
   async (req, res) => {
      console.log(req.body); // Log form text fields
      console.log(req.file); // Log file details

      if (!req.file) {
         return res.status(400).send('No file uploaded.');
      }

      const { name, bio, favorite_genre } = req.body;
      const profilePicUrl = `/uploads/${req.file.filename}`;

      // Generate a unique ID
      const uniqueId = generateUniqueId(name);

      const insertUserQuery = `
      INSERT INTO users (unique_id, name, bio, profile_pic_url, favorite_genre)
      VALUES (?, ?, ?, ?, ?)
  `;

      try {
         const [results] = await pool
            .promise()
            .query(insertUserQuery, [uniqueId, name, bio, profilePicUrl, favorite_genre]);
         res.status(201).json({
            message: "User created successfully",
            userId: results.insertId,
            uniqueId: uniqueId,
         });
      } catch (err) {
         console.error(err); // Log the error for more info
         res.status(500).json({ error: err.message });
      }
   }
);


// Route to get a single user by id
router.get("/users/:id", (req, res) => {
   const { id } = req.params;

   const getUserQuery = "SELECT * FROM users WHERE id = ?";

   pool.query(getUserQuery, [id], (err, results) => {
      if (err) {
         return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
         return res.status(404).json({ message: "User not found" });
      }
      res.json(results[0]);
   });
});

// Route to get all users
router.get("/users", (req, res) => {
   const getAllUsersQuery = "SELECT * FROM users";

   pool.query(getAllUsersQuery, (err, results) => {
      if (err) {
         return res.status(500).json({ error: err.message });
      }
      res.json(results);
   });
});

// Route to update an existing user
router.put("/users/:id", userValidationRules, checkValidation, (req, res) => {
   const { id } = req.params;
   const { name, bio, favorite_genre } = req.body;

   const updateUserQuery = `
    UPDATE users SET name = ?, bio = ?, favorite_genre = ?
    WHERE id = ?
  `;

   pool.query(updateUserQuery, [name, bio, favorite_genre, id], (err, results) => {
      if (err) {
         return res.status(500).json({ error: err.message });
      }
      if (results.affectedRows === 0) {
         return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User updated successfully" });
   });
});

// Route to delete a user
router.delete("/users/:id", (req, res) => {
   const { id } = req.params;

   const deleteUserQuery = "DELETE FROM users WHERE id = ?";

   pool.query(deleteUserQuery, [id], (err, results) => {
      if (err) {
         return res.status(500).json({ error: err.message });
      }
      if (results.affectedRows === 0) {
         return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
   });
});



// Helper function to retrieve a user's data based on the unique ID
async function getUserDataByUniqueId(uniqueId) {
   try {
     // Log the uniqueId for debugging
     console.log("Retrieving user data for uniqueId:", uniqueId);
 
     // Query the 'users' table for the user data associated with the unique_id
     const sqlQuery = "SELECT * FROM users WHERE unique_id = ?";
     console.log("SQL Query:", sqlQuery);
     const [rows] = await pool.promise().query(sqlQuery, [uniqueId]);
 
     // Log the result for debugging
     console.log("Query result:", rows);
 
     return rows.length ? rows[0] : null; // Return the user data if found, otherwise null
   } catch (err) {
     // Log the error to the console for debugging purposes
     console.error('Failed to retrieve user data:', err);
     throw err; // Rethrow the error so it can be caught by the calling function
   }
 }
 
 // Route to get a user's data by their unique ID
 router.get('/users/:uniqueId', async (req, res) => {
   const { uniqueId } = req.params;
   try {
     const userData = await getUserDataByUniqueId(uniqueId);
     if (userData) {
       res.json(userData);
     } else {
       res.status(404).send('User not found.');
     }
   } catch (err) {
     res.status(500).json({ error: 'Internal server error' });
   }
 });




 // Add this route to your server-side routes
router.get('/users/resolve/:uniqueId', async (req, res) => {
   const { uniqueId } = req.params;
   try {
     const [users] = await pool.promise().query("SELECT id FROM users WHERE unique_id = ?", [uniqueId]);
     if (users.length) {
       res.json({ id: users[0].id });
     } else {
       res.status(404).json({ message: "User not found" });
     }
   } catch (error) {
     res.status(500).json({ error: "Internal server error" });
   }
 });
 


module.exports = {
   router: router,
   userValidationRules: userValidationRules,
};