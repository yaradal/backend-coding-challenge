# Movie Rating System API

A RESTful API for rating movies and managing user profiles built with NestJS.

## Description

This is a movie rating system that allows users to:

- Register and authenticate
- Create, update, and search movies
- Rate movies (1-10 scale)
- View public user profiles with all their rated movies

## Requirements

- [x] The backend should expose RESTful endpoints to handle user input and return movie ratings.
- [x] The system should store data in a database. You can use any existing dataset or API to populate the initial database.
- [x] Implement user endpoints to create and view user information.
- [x] Implement movie endpoints to create and view movie information.
- [x] Implement a rating system to rate the entertainment value of a movie.
- [x] Implement a basic profile where users can view their rated movies.
- [x] Include unit tests to ensure the reliability of your code.
- [x] Ensure proper error handling and validation of user inputs.

## Bonus points

- [x] Implement authentication and authorization mechanisms for users.
- [x] Provide documentation for your API endpoints using tools like Swagger.
- [x] Implement logging to record errors and debug information.
- [x] Implement caching mechanisms to improve the rating system's performance.
- [x] Implement CI/CD quality gates.

## Environment setup

Before running the application, you need to set up your environment variables:

1. **Copy the example environment file:**

   ```bash
   cp .env.example .env
   ```

2. **Database Setup:**

   ```bash
   # Start PostgreSQL database (if using Docker)
   npm run db:reset

   # Run database migrations
   npm run db:migrate
   ```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/api
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Security Notes

- **Never commit your `.env` file** - it's already in `.gitignore`
- **Use a strong JWT secret** - at least 64 characters long
- **Rotate secrets regularly** in production

## Decisions and next steps

- We decided to go with domain driven design and have a controller/service/repository separation.
- We used a simple authentication with password/email for the test. A next step would be to add email validation for example.
- For logging, we decided to go with handling errors in a centralized manner in Nest.js. We catch 5xx and log them. We added some debug on write operations in the services that we would probably hide in production.
- For the rating caching system, we decided to go with some simple recalculation of the value in the Movie entity, at every rating update.
- We used GitHub Actions for CI/CD. We run ESLint and the unit tests on every branch. We didn't Dockerize the app yet but it would be something to add to our CD setup.
- We decided to not go for a "100% coverage" approach here because our services are mainly only doing CRUD operations. We only decided to test the authentication service for the excercise. As next steps, we could think about integration testing.
- We made sure to index properly all the potentially expensive database operations. We used a GIN index with trigrams to speedup the movie name lookup.
