## Real time Chat App

- Handle Authentication with NestJs Passport, JWT Strategy, Local Strategy
- Real-time message with GraphQL subscription API and Apollo Client

## For Development environment

- `.env` file will be needed for both `chatter-ui` and `chatter-backend`
- Start the Mongod local server, and passing the connection string to `chatter-backend`
- Start the backend with `npm start`
- Frontend may need to generate graphQL types from backend with `npm run codegen`
- Start the local Frontend with `npm start`

## Backend tech stacks:

- NestJS, GraphQL, Mongoose
- `@nestjs/graphql`, `@nestjs/jwt`, `@nestjs/mongoose`,`@nestjs/passport`
- Database: MongDB local, MongoAtlas on AWS

## Frontend tech stacks:

- Material UI `@mui/material`, Apollo Client with Caching, Emotion react
