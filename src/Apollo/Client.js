// import ApolloClient, { InMemoryCache } from 'apollo-boost';
// const Client = new ApolloClient({
//   uri: 'http://api.pds.com:3000/api/v1/graphql',
//   cache: new InMemoryCache(),
//   credentials: 'include',
//   headers: {
//     Authorization: `Bearer ${sessionStorage.getItem('token')}`
//   }
// });

// export default Client;

import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  from
} from '@apollo/client';


const httpLink = new HttpLink({
  uri: `${process.env.REACT_APP_API_GW_URL}/api/v1/graphql`,
  // uri: 'http://192.168.219.108:1000/api/v1/graphql',
  credentials: 'include'
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: `Bearer ${sessionStorage.getItem("token")}` || null
    }
  }));

  return forward(operation);
});

const Client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getNotice: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          getUser: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          getArea: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          getDealerTree: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          getShop: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          getCode: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    }
  }),

  link: from([authMiddleware, httpLink])
});

export default Client;
