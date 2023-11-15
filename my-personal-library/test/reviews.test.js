// test/reviews.test.js
const app = require("../app"); // make sure this path is correct
const supertest = require("supertest");
const expect = require("chai").expect;
require("dotenv").config({ path: ".env.test" });

describe("Reviews API", function () {
   let testBookId;
   let testReviewId;
   const testUserId = 2; // Replace with a valid test user ID

   // Setup a test book and review before running tests
   before(async function () {
      // Add a test book
      const bookResponse = await supertest(app).post("/api/books").send({
         title: "Test Book for Reviews",
         author: "Test Author",
         note: "This is a test note for book reviews",
         user_id: testUserId,
      });

      expect(bookResponse.status).to.equal(201);
      testBookId = bookResponse.body.bookId;

      // Add a test review
      const reviewResponse = await supertest(app).post(`/api/books/${testBookId}/reviews`).send({
         user_id: testUserId,
         rating: 5,
         review: "Excellent test book!",
      });

      expect(reviewResponse.status).to.equal(201);
      testReviewId = reviewResponse.body.reviewId;
   });

   // Clean up after tests run
   after(async function () {
    // Clean up after tests run
    if (testReviewId) {
      console.log(`Cleaning up: Deleting review with ID ${testReviewId}`);
      const deleteReviewResponse = await supertest(app)
        .delete(`/api/books/${testBookId}/reviews/${testReviewId}`);
      console.log(deleteReviewResponse.status); // Log the status for debugging
    }
    if (testBookId) {
      console.log(`Cleaning up: Deleting book with ID ${testBookId}`);
      const deleteBookResponse = await supertest(app)
        .delete(`/api/books/${testBookId}`);
      console.log(deleteBookResponse.status); // Log the status for debugging
    }
  });
  
   it("adds a review to a book", async function () {
      const reviewResponse = await supertest(app).post(`/api/books/${testBookId}/reviews`).send({
         user_id: testUserId,
         rating: 5,
         review: "Excellent test book!",
      });

      expect(reviewResponse.status).to.equal(201);
      expect(reviewResponse.body).to.have.property("reviewId"); // Make sure the reviewId is returned
      testReviewId = reviewResponse.body.reviewId; // Save the reviewId for later use
   });

   it("updates a book review", async function () {
      const response = await supertest(app)
         .put(`/api/books/${testBookId}/reviews/${testReviewId}`)
         .send({
            user_id: testUserId,
            rating: 3,
            review: "Good test book, but not perfect.",
         });
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Review updated successfully");
   });

   it('deletes a book review', async function () {
    console.log(`Deleting review with ID: ${testReviewId}`); // Log for debugging
    const response = await supertest(app)
      .delete(`/api/books/${testBookId}/reviews/${testReviewId}`);
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Review deleted successfully');
  });

   // Add more tests as necessary
});
