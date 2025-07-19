import { gql } from "@apollo/client";

export const GET_USER = gql`
  query($userId: String!) {
    user(login: $userId) {
      id
      login
      name
      avatarUrl
      bio
      location
      email
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(first: 10) {
        nodes {
          name
          description
          url
          stargazerCount
        }
      }
    }
  }
`;
