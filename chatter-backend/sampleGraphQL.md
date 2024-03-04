### createUser mutation

```
mutation {
  createUser(createUserInput: {
    email: "testuser@test.com",
    password: "TestPassword123!"
  }) {
    _id
    email
  }
}
```

### get all users or get a single user

```
query {
  users {
    _id
    email
  }
}
```

```
query {
  user(_id: "65d3e14581c836658ad266a3") {
    _id
    email
  }
}
```

### Update a user email and password

```
mutation {
  updateUser(updateUserInput: {
    _id: "65d3e14581c836658ad266a3",
    email: "someotheremail@test.com",
    password: "someotherpassword"
  }) {
    _id
    email
  }
}
```
