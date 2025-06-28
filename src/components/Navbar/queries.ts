import { gql } from '@apollo/client';

export const GET_USERS = gql`
   query ($userQuery: String!){
      search(query: $userQuery, type: USER, first: 10){
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

