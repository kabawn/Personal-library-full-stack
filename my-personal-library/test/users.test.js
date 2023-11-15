// test/users.test.js
const app = require('../app');
const supertest = require('supertest');
const expect = require('chai').expect;
require('dotenv').config({ path: '.env.test' });

describe('Users API', function () {
  let testUserId;

  // Create a user before the tests run
before(async function () {
  const response = await supertest(app)
    .post('/api/users')
    .attach('profile_pic', 'path/to/your/test/image.jpg') // Simulate file upload
    .field('name', 'Test User')
    .field('bio', 'Test Bio')
    .field('favorite_genre', 'Fantasy')
    .expect(201); // This line will automatically check the status code

  expect(response.status).to.equal(201);
  testUserId = response.body.userId;
});

  // Test getting all users
  it('retrieves all users', async function () {
    const response = await supertest(app)
      .get('/api/users')
      .expect(200);

    expect(response.body).to.be.an('array');
  });

  // Test getting a single user by id
  it('retrieves a single user by id', async function () {
    const response = await supertest(app)
      .get(`/api/users/${testUserId}`)
      .expect(200);

    expect(response.body).to.have.property('id', testUserId);
  });

  // Test updating a user
  it('updates a user', async function () {
    const updatedInfo = {
      name: 'Updated User',
      bio: 'Updated Bio',
      favorite_genre: 'Sci-Fi'
    };

    const response = await supertest(app)
      .put(`/api/users/${testUserId}`)
      .send(updatedInfo)
      .expect(200);

    expect(response.body).to.have.property('message', 'User updated successfully');
  });

  // Test deleting a user
  it('deletes a user', async function () {
    const response = await supertest(app)
      .delete(`/api/users/${testUserId}`)
      .expect(200);

    expect(response.body).to.have.property('message', 'User deleted successfully');
  });

  // Delete the test user after the tests run if it wasn't deleted during the tests
after(async function () {
  try {
    // Attempt to retrieve the user first to see if they still exist
    const getResponse = await supertest(app).get(`/api/users/${testUserId}`);
    
    // If the user exists, the status code should be 200, then attempt to delete
    if (getResponse.status === 200) {
      await supertest(app)
        .delete(`/api/users/${testUserId}`)
        .expect(200);
    }
  } catch (error) {
    // If the user does not exist, the get request will throw an error
    // which is caught here, so there is nothing to do if the user is already deleted.
  }
});

});
