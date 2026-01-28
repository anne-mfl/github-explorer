import { gql } from "@apollo/client";

export const GET_CONTRIBUTION_FOR_SPECIFIC_YEAR = gql`
query GetContributionForSpecificYear(
    $userId: String!
    $from: DateTime
    $to: DateTime
  ) {
    user(login: $userId) {
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        totalRepositoryContributions

        # Repositories you're most active in
      commitContributionsByRepository(maxRepositories: 100) {
        repository {
          name
          owner{
            login
          }
          nameWithOwner
          url
        }
        contributions {
          totalCount
        }
      }
      
      # Contribution calendar (the heatmap graph)
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`


export const GET_USER_OVERVIEW = gql`
  query GetUserOverview(
    $userId: String!
  ) {
    user(login: $userId) {
      # Basic profile information
      id
      login
      name
      bio
      email
      location
      websiteUrl
      twitterUsername
      avatarUrl
      createdAt
      updatedAt
      
      # Profile stats
      followers {
        totalCount
      }
      following {
        totalCount
      }
      
      # Repository information
      repositories(
        first: 20
        orderBy: { field: UPDATED_AT, direction: DESC }
        ownerAffiliations: OWNER
        privacy: PUBLIC
      ) {
        totalCount
        nodes {
          id
          name
          description
          url
          isPrivate
          isFork
          isArchived
          createdAt
          updatedAt
          pushedAt
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
          languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
          licenseInfo {
            name
            spdxId
          }
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
        }
      }
      
      # Pinned repositories
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            id
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
            isPrivate
          }
        }
      }

    # Contribution statistics
    contributionsCollection {
      totalCommitContributions
      totalIssueContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
      totalRepositoryContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            color
          }
        }
      }
    }
      
      # Organizations
      organizations(first: 10) {
        nodes {
          id
          login
          name
          avatarUrl
          url
        }
      } 

      # Recent activity (issues and pull requests)
      issues(first: 5, orderBy: { field: UPDATED_AT, direction: DESC }, states: [OPEN, CLOSED]) {
        nodes {
          id
          title
          url
          state
          createdAt
          updatedAt
          repository {
            name
            owner {
              login
            }
          }
        }
      }
      
      pullRequests(first: 5, orderBy: { field: UPDATED_AT, direction: DESC }, states: [OPEN, CLOSED, MERGED]) {
        nodes {
          id
          title
          url
          state
          createdAt
          updatedAt
          repository {
            name
            owner {
              login
            }
          }
        }
      }
      
      # Starred repositories
      starredRepositories(first: 10, orderBy: { field: STARRED_AT, direction: DESC }) {
        totalCount
        nodes {
          id
          name
          description
          url
          owner {
            login
          }
          stargazerCount
          primaryLanguage {
            name
            color
          }
        }
      }
      
      # Watching repositories
      watching(first: 10) {
        totalCount
      }
      
      # Additional profile information
      company
      isHireable
      isDeveloperProgramMember
      isEmployee
      isGitHubStar
      isSiteAdmin
      status {
        message
        emoji
        indicatesLimitedAvailability
      }
    }
  }
`;
