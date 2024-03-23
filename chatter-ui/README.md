## Install required Material UI libraries

NodeJS v20X
`npm i --save @mui/material @emotion/react @emotion/styled @fontsource/roboto @mui/icons-materi
al`

## Install eslint for typescript

https://andrebnassis.medium.com/setting-eslint-on-a-react-typescript-project-2021-1190a43ffba
https://dev.to/quizzes4u/how-to-set-up-eslint-and-prettier-in-react-typescript-5-project-2023-hd6

`npx eslint --init`

## Install NestJs CLI:

`npm i -g @nestjs/cli@latest`
`nest new chatter-backend`

## Material UI libraries

- [Snackbar](https://mui.com/material-ui/react-snackbar/)
- [AppBar](https://mui.com/material-ui/app-bar/)
- [List](https://mui.com/material-ui/react-list/)
- [Divider](https://mui.com/material-ui/react-divider/)
- [Grid](https://mui.com/material-ui/react-grid/)
- [Toolbar Api](https://mui.com/material-ui/api/toolbar/)
- [Typography](https://mui.com/material-ui/react-typography/)
- [Modal](https://mui.com/material-ui/react-modal/)
- [Switch](https://mui.com/material-ui/react-switch/) with [FormGroup](https://mui.com/material-ui/api/form-group/)
- [Stack](https://mui.com/material-ui/react-stack/)
- [CSSBaseline](https://mui.com/material-ui/react-css-baseline/)
- [Material Icons](https://mui.com/material-ui/material-icons/)
- [Container](https://mui.com/material-ui/react-container/)
- [Box](https://mui.com/material-ui/react-box/)
- [IconButton](https://mui.com/material-ui/api/icon-button/)
- [TextField and InputBase](https://mui.com/material-ui/react-text-field/)
- [Paper](https://mui.com/material-ui/react-paper/)

## Install GraphQL Codegen libraries

- `@graphql-codegen/cli` and `@parcel/watcher`. [Instructions](https://the-guild.dev/graphql/codegen/docs/getting-started/installation)

`npm i -D @graphql-codegen/cli @parcel/watcher`
`npx run graphql-code-generator init`
`npm run codegen`

- Using `concurrently` in package.json to start web server along with watching codegen together:

`npm i -D concurrently`

```
"scripts": {
    "start": "concurrently \"react-scripts start\" \"npm run codegen --watch\"",
}
```

- [GraphQL Syntax Highlight VS Code](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql-syntax)

## Apollo Client Usages

- [useReactiveVar() hook and makeVar()](https://www.apollographql.com/docs/react/local-state/reactive-variables/)
- Mutation will not trigger cache update on non-primitive response. We can either use `refetchQueries` or `update` cache on successful mutation. [Instructions](https://www.apollographql.com/docs/react/data/mutations/)

## React infinite scroller

- `npm i react-infinite-scroller` to help scrolling for Chat component
- `npm i -save-dev @types/react-infinite-scroller`
