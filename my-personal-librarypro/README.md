# My Personal Library

This full-stack JavaScript application enables users to manage a personal library of books. It supports multiple users with features such as adding, updating, and deleting books, searching by title, and adding ratings and reviews.

## Getting Started

These instructions will get your copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- Angular CLI
- Docker & Docker Compose (for containerization)

### Installing

A step-by-step series of examples that tell you how to get a development environment running.

#### Frontend

```bash
cd path-to-your-frontend
npm install
ng serve
```

Navigate to `http://localhost:4200/` to view the application.

#### Backend

```bash
cd path-to-your-backend
npm install
npm start
```

The server will start on `http://localhost:3002/`.

### Docker Setup

To run both frontend and backend with Docker:

```bash
cd path-to-your-backend
docker-compose up --build
```

The frontend will be accessible at `http://localhost:4200/`, and the backend API at `http://localhost:3002/`.

## Running the tests

Explain how to run the automated tests for this system.

### Unit tests with Karma

```bash
ng test
```

### End-to-end tests with Protractor

```bash
ng e2e
```

### Linting with ESLint

```bash
ng lint
```

## Deployment

Add additional notes about how to deploy this on a live system.

## Built With

- [Angular](https://angular.io/) - The web framework used
- [Node.js](https://nodejs.org/) - The backend runtime
- [Express](https://expressjs.com/) - Backend framework
- [MySQL](https://www.mysql.com/) - Database
- [Docker](https://www.docker.com/) - Container platform

## Authors

- **Osama AHLASA** - _Initial work_ - [YourGitHubProfile](https://github.com/YourGitHubProfile)
