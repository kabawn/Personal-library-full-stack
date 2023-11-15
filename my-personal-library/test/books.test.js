const app = require('../app');
const supertest = require('supertest');
const expect = require('chai').expect;
require('dotenv').config({ path: '.env.test' });

describe('Books API', function () {
  let testBookId;

  // Create a new book before each test
  beforeEach(async function () {
    const response = await supertest(app)
      .post('/api/books')
      .send({
        title: 'Test Book',
        author: 'Test Author',
        note: 'This is a test note',
        user_id: 2 // Ensuring user_id is consistently 2
      });
    expect(response.status).to.equal(201);
    testBookId = response.body.bookId;
  });

 

  // Tests...
  it('responds with a list of books', async function () {
    const response = await supertest(app)
      .get('/api/books?user_id=2')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).to.be.an('array');
    expect(response.body).to.have.lengthOf.at.least(1);
  });

  it('adds a new book to the list', async function () {
    const response = await supertest(app)
      .post('/api/books')
      .field('title', 'Another Test Book')
      .field('author', 'Another Test Author')
      .field('note', 'This is another test note')
      .field('user_id', 2); // Assuming user ID 1 is valid
    expect(response.status).to.equal(201);
  });

  it('edits a book\'s properties', async function () {
    const response = await supertest(app)
      .put(`/api/books/${testBookId}`)
      .field('title', 'Updated Test Book')
      .field('author', 'Updated Test Author')
      .field('note', 'This is an updated test note')
      .field('user_id', 2); // Assuming user ID 1 is valid
    expect(response.status).to.equal(200);
  });

 
   

  // Test for retrieving all books by a specific author
  it('retrieves books by a specific author', async function () {
    const author = encodeURIComponent('Test Author');
    const response = await supertest(app)
      .get(`/api/books/author/${author}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).to.be.an('array');
    expect(response.body[0]).to.have.property('author', 'Test Author');
  });

  // Test for retrieving all books for a user by their unique ID
  it('retrieves all books for a user by their unique ID', async function () {
    const uniqueId = '86ccbc4964cef2fa'; // Replace with an actual unique ID if available
    const response = await supertest(app)
      .get(`/api/users/${uniqueId}/books`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).to.be.an('array');
    // Additional checks can be performed here
  });



  // Test for retrieving a single book by ID
  it('retrieves a single book by id', async function () {
    const response = await supertest(app)
      .get(`/api/books/${testBookId}?user_id=2`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).to.have.property('id', testBookId);
  });
});

