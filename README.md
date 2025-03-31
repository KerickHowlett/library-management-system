# Library Management System

## Objective

The Library Management System is a full-stack application designed to manage book
checkouts and returns. It includes a React frontend and a backend API built with
Node.js, Express, and NestJS, demonstrating system design, coding skills, and best
practices.

---

## System Design

### High-Level Overview

The system consists of three main components:

1. **Frontend**: A React application to provide a GUI for the full-stach application.
2. **Backend**: A RESTful API built with NestJS to handle business logic.
3. **Database**: A database to store information about books, users, and transactions.

### Technologies Used

- **Frontend**: React, TailwindCSS and DaisyUI for styling, and React Query for
state management since React Query is designed to streamline state management for
resource-focused applications (e.g., Todo Apps).
- **Backend**: NestJS -- a Node.js-based backend framework designed for scalability
by being modular, supporting dependency injection, and uses Express under the hood.
- **Database**: Prisma for the ORM and PostgreSQL for the database, since a
relational SQL database provides far stronger consistency, which is necessary when
handling functionality like checking out a book since you don't want someone trying
to check out a book when someone else had checked it out already.
- **Workspace**: Nx was used to host and maintain the monorepo workspace.

### Data Models

1. **Books**
   - `id`: Unique identifier for the book, generated as a UUID.
   - `title`: Title of the book (maximum 255 characters).
   - `author`: Author of the book (maximum 255 characters).
   - `edition`: Optional field for the edition of the book (maximum 50 characters).
   - `genre`: Genre of the book (maximum 50 characters).
   - `series`: Optional field for the series the book belongs to (maximum 255 characters).
   - `publisher`: Publisher of the book (maximum 255 characters).
   - `status`: Availability status (e.g., "available", "checked out").
   - `createdAt`: Timestamp when the book was added to the system.
   - `updatedAt`: Timestamp when the book was last updated.
   - `userId`: Optional field linking the book to the user who checked it out.
   - `checkedOutBy`: Relation to the `User` model for the user who checked out
   the book.
   - `Transaction`: Relation to the `Transaction` model for all transactions
   involving the book.

2. **Users**
   - `id`: Unique identifier for the user, generated as a UUID.
   - `email`: Email address of the user (unique, maximum 255 characters).
   - `fullName`: Full name of the user (maximum 255 characters).
   - `createdAt`: Timestamp when the user was added to the system.
   - `updatedAt`: Timestamp when the user was last updated.
   - `books`: Relation to the `Book` model for all books checked out by the user.
   - `Transaction`: Relation to the `Transaction` model for all transactions
   performed by the user.

3. **Transactions**
   - `id`: Unique identifier for the transaction, generated as a UUID.
   - `action`: Type of transaction (e.g., "CheckedOut", "Returned").
   - `timestamp`: Timestamp when the transaction occurred.
   - `userId`: Identifier linking the transaction to the user who performed it.
   - `user`: Relation to the `User` model for the user who performed the transaction.
   - `bookId`: Identifier linking the transaction to the book involved.
   - `book`: Relation to the `Book` model for the book involved in the transaction.

### API Endpoints

1. **Books**
   - `GET /api/books` - Retrieve a list of all books.
   - `GET /api/books/:id` - Retrieve details of a specific book by ID.
   - `POST /api/books` - Add a new book to the system.
   - `PUT /api/books/:id` - Update details of a specific book by ID.
   - `DELETE /api/books/:id` - Remove a book from the system by ID.

2. **Users**
   - `GET /api/users` - Retrieve a list of all users.
   - `GET /api/users/:id` - Retrieve details of a specific user by ID.
   - `POST /api/users` - Add a new user to the system.
   - `PUT /api/users/:id` - Update details of a specific user by ID.
   - `DELETE /api/users/:id` - Remove a user from the system by ID.

3. **Transactions**
   - `GET /api/transactions` - Retrieve a list of all transactions.
   - `GET /api/transactions/:id` - Retrieve details of a specific transaction by
   ID.
   - `POST /api/checkout` - Create a transaction for checking out a book.
   - `POST /api/return` - Create a transaction for returning a book.

## Setup Instructions

### Prerequisites

- Latest version of Node.js (LTS or Current) installed on your system.
- Docker installed and running for executing tests in a containerized environment.

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/library-management-system.git .
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run the Application**

   ```bash
   npm run start
   ```

4. **Access the Application**
   - Open your browser and navigate to `http://localhost:4200`.
   - The API backend can be reached from `http://localhost:3000/api`.

---

## Build Applications

```bash
npm run build
```

## Run Automated Unit & Integration Tests

```bash
npm run test
```

**IMPORTANT NOTE:** The database integration tests within the Prisma repository
spec files can timeout sometimes. Though, a lot has been done to improve the
performance of these tests, and Jest's timeout has been greatly extended within
the API project's `jest.config.ts` file.

## Run E2E Tests

```bash
npm run e2e
```

**IMPORTANT NOTE:** Only the API has E2E tests established. Time ran out before
the frontend E2E tests could be carried out via Playwright.

## Assumptions

- Users are pre-registered in the system.
- Books are preloaded into the database.
- A library possesses only one of each book.
