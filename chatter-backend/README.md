## Install nest config and Mongo DB connection:

NodeJS v20X
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

  - How to use [MongoDB Model](https://mongoosejs.com/docs/api/model.html)
  - How to use [MongoDb method](https://www.mongodb.com/docs/manual/reference/method/)
  - [MongoDB aggregate commands](https://www.mongodb.com/docs/manual/reference/operator/aggregation/sort/)

## NestJs GraphQL

- Installing: `npm i @nestjs/graphql @nestjs/apollo @apollo/server graphql`
- Playground GraphQL server, after starting backend: `http://localhost:3001/graphql`
- Understand NestJS GraphQL:
  https://docs.nestjs.com/graphql/quick-start

### Create users resource graphql boilterplate codes

`nest g resource users`
`nest g resource chats/messages`

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
