import { gql } from '@apollo/client';

export const GET_USERS = gql`
   query GetUsers($searchQuery: String!){
      search(query: $searchQuery, type: USER, first: 5){
          nodes{
            ... on User {
              avatarUrl
              id
              name
              login
            }
          }
        }
    }
  `


export const GET_REPOSITORIES = gql`
  query GetRepositories ($searchQuery: String!){
    search(query: $searchQuery, type: REPOSITORY, first: 5){
      nodes {
        ... on Repository {
          name
          owner {
            login
            avatarUrl
          }
          description
          url
          stargazerCount
        }
      }
    }
  }
`


