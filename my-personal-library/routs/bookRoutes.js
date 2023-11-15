const express = require("express");
const multer = require("multer");
const pool = require("../database");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// Setup multer for file handling
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "uploads/");
   },
   filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
   },
});
const upload = multer({ storage });

// Validation rules for book data including user_id
const bookValidationRules = [
   body("title").trim().notEmpty().withMessage("Title is required."),
   body("author").trim().notEmpty().withMessage("Author is required."),
   body("note").trim().optional().escape(),
   body("image_url").optional().trim().isURL().withMessage("Image URL must be a valid URL."),
   body("user_id")
      .notEmpty()
      .withMessage("User ID is required.")
      .isInt()
      .withMessage("User ID must be an integer."),
];

// Validation rules for reviews
const reviewValidationRules = [
   body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be an integer between 1 and 5."),
   body("review").trim().optional().escape(),
   body("user_id")
      .notEmpty()
      .withMessage("User ID is required.")
      .isInt()
      .withMessage("User ID must be an integer."),
];

// Middleware to check for validation errors
const checkValidation = (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }
   next();
};

// Retrieve all books or books for a specific user if user_id is provided
router.get("/books", async (req, res) => {
   const userId = req.query.user_id;

   let query = `
      SELECT books.*, JSON_ARRAYAGG(JSON_OBJECT('rating', reviews.rating, 'review', reviews.review, 'userId', reviews.user_id)) AS reviews
      FROM books
      LEFT JOIN reviews ON books.id = reviews.book_id
    `;

   let queryParams = [];

   if (userId) {
      query += " WHERE books.user_id = ?";
      queryParams.push(userId);
   }

   query += " GROUP BY books.id";

   try {
      const [results] = await pool.promise().query(query, queryParams);
      res.status(200).json(results);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});






// Add a new book with image and user_id
router.post(
   "/books",
   upload.single("image"),
   bookValidationRules,
   checkValidation,
   async (req, res) => {
      const { title, author, note, user_id } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      const insertQuery =
         "INSERT INTO books (title, author, note, image_url, user_id) VALUES (?, ?, ?, ?, ?)";

      try {
         const [results] = await pool
            .promise()
            .query(insertQuery, [title, author, note, imageUrl, user_id]);
         res.status(201).json({ message: "Book added successfully", bookId: results.insertId });
      } catch (err) {
         res.status(500).json({ error: err.message });
      }
   }
);


 

// Update a book's details with image and user_id
router.put(
   "/books/:id",
   upload.single("image"),
   bookValidationRules,
   checkValidation,
   async (req, res) => {
      const { title, author, note, user_id } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;
      const updateQuery =
         "UPDATE books SET title = ?, author = ?, note = ?, image_url = ? WHERE id = ? AND user_id = ?";

      try {
         const [results] = await pool
            .promise()
            .query(updateQuery, [title, author, note, imageUrl, req.params.id, user_id]);
         if (results.affectedRows === 0) {
            res.status(404).json({ message: "Book not found or data unchanged" });
         } else {
            res.status(200).json({ message: "Book updated successfully" });
         }
      } catch (err) {
         res.status(500).json({ error: err.message });
      }
   }
);

// Delete a book with user_id
router.delete("/books/:id", async (req, res) => {
   const userId = req.query.user_id; // Expect user_id to be sent as a query parameter
   const deleteQuery = "DELETE FROM books WHERE id = ? AND user_id = ?";

   try {
      const [results] = await pool.promise().query(deleteQuery, [req.params.id, userId]);
      if (results.affectedRows === 0) {
         res.status(404).json({ message: "Book not found or not owned by user" });
      } else {
         res.status(200).json({ message: "Book deleted successfully" });
      }
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// Search for a book by title for all users
router.get("/books/search", async (req, res) => {
   const { searchTerm, user_id } = req.query;
   console.log('Received searchTerm:', searchTerm, 'user_id:', user_id);
   
   const searchValue = `%${searchTerm}%`;
   const query = "SELECT * FROM books WHERE title LIKE ? AND user_id = ?";
   
   try {
      console.log('Executing query:', query, 'with values:', searchValue, user_id);
      const [results] = await pool.promise().query(query, [searchValue, user_id]);
      console.log('Query results:', results);
      
      if (results.length) {
         res.status(200).json(results);
      } else {
         res.status(404).json({ message: "Book not foundmmm" });
      }
   } catch (err) {
      console.error('Query error:', err);
      res.status(500).json({ error: err.message });
   }
});




// Route to add a review for a book
router.post("/books/:bookId/reviews", reviewValidationRules, checkValidation, async (req, res) => {
  const { bookId } = req.params;
  const { user_id, rating, review } = req.body;

  const insertReviewQuery = `
     INSERT INTO reviews (book_id, user_id, rating, review)
     VALUES (?, ?, ?, ?)
   `;

  try {
     const [result] = await pool.promise().query(insertReviewQuery, [bookId, user_id, rating, review]);
     const reviewId = result.insertId; // This captures the new ID
     res.status(201).json({ message: "Review added successfully", reviewId }); // Include the reviewId in the response
  } catch (err) {
     res.status(500).json({ error: err.message });
  }
});

// Route to get all reviews for a specific book
router.get("/books/:bookId/reviews", async (req, res) => {
   const { bookId } = req.params;
 
   try {
     const query = `
       SELECT * FROM reviews WHERE book_id = ?
     `;
     const [reviews] = await pool.promise().query(query, [bookId]);
 
     if (reviews.length) {
       res.status(200).json(reviews);
     } else {
       res.status(404).json({ message: "No reviews found for this book" });
     }
   } catch (err) {
     res.status(500).json({ error: err.message });
   }
 });
 


// Route to update a review
router.put(
   "/books/:bookId/reviews/:reviewId",
   reviewValidationRules,
   checkValidation,
   async (req, res) => {
      const { reviewId } = req.params;
      const { rating, review } = req.body;

      const updateReviewQuery = `
      UPDATE reviews
      SET rating = ?, review = ?
      WHERE id = ?
    `;

      try {
         await pool.promise().query(updateReviewQuery, [rating, review, reviewId]);
         res.status(200).json({ message: "Review updated successfully" });
      } catch (err) {
         res.status(500).json({ error: err.message });
      }
   }
);

// Route to delete a review
router.delete("/books/:bookId/reviews/:reviewId", async (req, res) => {
  const { reviewId } = req.params;

  const deleteReviewQuery = `DELETE FROM reviews WHERE id = ?`;

  try {
     const [result] = await pool.promise().query(deleteReviewQuery, [reviewId]);
     if (result.affectedRows === 0) {
       // No review was deleted, which means it was not found
       res.status(404).json({ message: "Review not found" });
     } else {
       res.status(200).json({ message: "Review deleted successfully" });
     }
  } catch (err) {
     res.status(500).json({ error: err.message });
  }
});

// Route to get all books by a specific author

router.get('/books/author/:author', async (req, res) => {
  // Decode URI component in case the author's name is encoded
  const author = decodeURIComponent(req.params.author);
  console.log('Decoded author:', author);

  try {
    // Use placeholders '?' to prevent SQL injection
    const [books] = await pool.promise().query('SELECT * FROM books WHERE LOWER(author) LIKE ?', [`%${author.toLowerCase()}%`]);
    console.log('Query:', 'SELECT * FROM books WHERE author LIKE ?', `%${author}%`);
    
    if (books.length > 0) {
      res.json(books);
    } else {
      res.status(404).send('No books found for this author');
    }
  } catch (err) {
    // Log the error to the console for debugging
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get all books for a user by their unique ID
router.get("/users/:uniqueId/books", async (req, res) => {
   const { uniqueId } = req.params;
   
   try {
     // First, retrieve the user's ID using the unique ID provided
     const [user] = await pool.promise().query("SELECT id FROM users WHERE unique_id = ?", [uniqueId]);
     
     if (user.length) {
       // If the user is found, use their ID to get the books
       const [books] = await pool.promise().query("SELECT * FROM books WHERE user_id = ?", [user[0].id]);
       res.json(books);
     } else {
       res.status(404).json({ message: "No user found for this unique ID." });
     }
   } catch (err) {
     console.error('Error fetching books for user:', err);
     res.status(500).json({ error: "Internal server error" });
   }
 });


 // Get a single book by id
router.get("/books/:id", async (req, res) => {
   const { id } = req.params;
   
   try {
     const [book] = await pool.promise().query("SELECT * FROM books WHERE id = ?", [id]);
     if (book.length) {
       res.json(book[0]);
     } else {
       res.status(404).json({ message: "Book not foundkllll" });
     }
   } catch (err) {
     res.status(500).json({ error: err.message });
   }
 });

module.exports = router;
