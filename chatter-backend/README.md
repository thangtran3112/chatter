## Install nest config and Mongo DB connection:

`npm i @nestjs/config @nestjs/mongoose mongoose`

### Schema validation:

`npm i joi`

### Installing local Mongo DB

https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/

`brew tap mongodb/brew`
`brew update`
`brew install mongodb-community@7.0`

### Using Mongo DB

- kill MongoDB process: https://stackoverflow.com/questions/11774887/how-to-stop-mongo-db-in-one-command
  `mkdir -p ~/data/db`
  `chmod 777 ~/data/db`
  `mongod --dbpath ~/data/db`

  - Normally MongoDb will be started on 127.0.0.1:27017
  - Connection string should be `mongodb://127.0.0.1:27017/chatter`

## Installing NestJs GraphQL

https://www.udemy.com/course/build-a-real-time-chat-app-with-react-nestjs-graphql/learn/lecture/39410136#overview

`npm i @nestjs/graphql @nestjs/apollo @apollo/server graphql`

- Understand NestJS GraphQL:
  https://docs.nestjs.com/graphql/quick-start

### Create users resource graphql boilterplate codes

`nest g resource users`
`nest g resource chats/messages`

- Check the new GraphQL local UI interface at http://localhost:3000/graphql

### Running MongoDB Compass to view the MongoDB

https://www.mongodb.com/try/download/compass
https://www.mongodb.com/docs/compass/current/query/filter/?utm_source=compass&utm_medium=product

### Using `migrate-mongo` package to manage DB migration

`npm i migrate-mongo`
`npm i --save-dev @types/migrate-mongo`

## Install auth module with @nest/passport

`nest g module auth`
`nest g service auth`

## Decoding the retrieved Authentication cookie from jwt.io

## Install common practices Field Validation and annotate email and password

`npm i --save class-validator class-transformer`
[ValidationPipe](https://docs.nestjs.com/techniques/validation)
