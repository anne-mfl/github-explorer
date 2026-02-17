import { gql } from "@apollo/client";

export const GET_USER_STARRED_REPOSITORIES = gql`
  query GetUserStarredRepositories(
    $userId: String!
    $first: Int = 100
    $after: String
    $orderBy: StarOrderField = STARRED_AT
    $direction: OrderDirection = DESC
  ) {
    user(login: $userId) {
      login
      starredRepositories(
        first: $first
        after: $after
        orderBy: { field: $orderBy, direction: $direction }
      ) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          name
          description
          url
          pushedAt
          stargazerCount
          forkCount
          isPrivate
          isFork
          parent {
            nameWithOwner
            url
          }
          owner {
            login
          }
          primaryLanguage {
            name
            color
          }
          fundingLinks {
            platform
            url
          }
        }
      }
    }
  }
`;