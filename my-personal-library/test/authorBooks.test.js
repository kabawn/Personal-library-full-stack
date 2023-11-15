// test/authorBooks.test.js
const app = require('../app');
const supertest = require('supertest');
const expect = require('chai').expect;
require('dotenv').config({ path: '.env.test' });

describe('Author Books API', function () {
  it('retrieves books by a specific author', async function () {
    const authorName = encodeURIComponent('Olivia wilson'); // Replace with an author in your database
    const response = await supertest(app)
      .get(`/api/books/author/${authorName}`)
      .expect('Content-Type', /json/);

    // Check if the status code is 200 OK and the body is an array with at least one book
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array').that.is.not.empty;

    // Check if the author of each book includes the searched author's name
    response.body.forEach(book => {
      expect(book.author.toLowerCase()).to.include(decodeURIComponent(authorName).toLowerCase());
    });
  });

  it('returns 404 if no books are found for a non-existent author', async function () {
    const authorName = encodeURIComponent('Non Existent Author');
    const response = await supertest(app)
      .get(`/api/books/author/${authorName}`)
      .expect(404);

    // Check if the response body contains the expected error message
    expect(response.text).to.equal('No books found for this author');
  });

  // Add more tests as necessary
});
