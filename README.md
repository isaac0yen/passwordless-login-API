# Apollo Server Application

This is a Node.js application using Apollo Server, MySQL, and other dependencies for handling user authentication with tokens.

## Project Structure
```
├── Helpers
│   ├── AuthHelpers.js
│   ├── mySQL.js
│   ├── Replacer.js
│   ├── SendMail.js
│   ├── ThrowError.js
│   ├── TokenGenerator.js
│   └── Validate.js
├── resolvers
│   ├── index.js
│   ├── token.js
│   └── user.js
├── Template
│   └── email.html
├── .gitignore
├── index.js
├── package.json
├── package-lock.json
└── typedefs.js
```

## Getting Started

### Prerequisites

Before running the application, ensure you have the following dependencies installed:

- [Node.js](https://nodejs.org/)
- [MySQL](https://dev.mysql.com/downloads/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/isaac0yen/passwordless-login-API.git
   cd apollo-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your MySQL database and update the connection details in `Helpers/mySQL.js`.

4. Start the application:

   ```bash
   npm start
   ```

## Usage

- The GraphQL server will be running at `http://localhost:4000`.

## Features

1. **User CRUD Operations:**
   - Create, read, update, and delete user information.

2. **Token Generation:**
   - Generate a token and mail it to the provided email using the `generateToken` mutation.

3. **User Login:**
   - Check the last token in the token table and validate the email and token using the `login` mutation.
   - If correct, set JWT and return access and refresh tokens.

## Technologies Used

- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [MySQL](https://www.mysql.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [GraphQL](https://graphql.org/)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [nodemailer](https://nodemailer.com/)
- [luxon](https://moment.github.io/luxon/)

## Contributing

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.