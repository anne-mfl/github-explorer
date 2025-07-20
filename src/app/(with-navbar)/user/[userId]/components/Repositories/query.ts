import { gql } from "@apollo/client";

export const GET_USER_REPOSITORIES = gql`
  query(
  $login: String!
  $first: Int = 20
  $after: String
  $orderBy: RepositoryOrderField = UPDATED_AT
  $direction: OrderDirection = DESC
  $ownerAffiliations: [RepositoryAffiliation] = [OWNER]
  $privacy: RepositoryPrivacy
  $isFork: Boolean
  $isArchived: Boolean
  $language: String
)  {
    user(login: $userId) {
  # Basic user info for the page header
    login
    name
    avatarUrl
    
    # Repository counts for different categories
    repositories(ownerAffiliations: OWNER, privacy: PUBLIC) {
      totalCount
    }
    
    repositoriesContributedTo(
      first: 1
      includeUserRepositories: false
      contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]
    ) {
      totalCount
    }
    
    # Main repositories query with all filters
    repositories(
      first: $first
      after: $after
      orderBy: { field: $orderBy, direction: $direction }
      ownerAffiliations: $ownerAffiliations
      privacy: $privacy
      isFork: $isFork
      isArchived: $isArchived
    ) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      
      nodes {
        # Basic repository information
        id
        name
        description
        url
        homepageUrl
        
        # Repository metadata
        createdAt
        updatedAt
        pushedAt
        
        # Repository stats
        stargazerCount
        forkCount
        watchers { totalCount }
        issues(states: OPEN) { totalCount }
        pullRequests(states: OPEN) { totalCount }
        
        # Repository properties
        isPrivate
        isFork
        isArchived
        isTemplate
        isDisabled
        isEmpty
        
        # Fork information (if it's a fork)
        parent {
          name
          nameWithOwner
          owner {
            login
          }
          url
        }
        
        # Language information
        primaryLanguage {
          name
          color
        }
        
        languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
          totalSize
          edges {
            size
            node {
              name
              color
            }
          }
        }
        
        # License information
        licenseInfo {
          name
          nickname
          spdxId
        }
        
        # Topics/tags
        repositoryTopics(first: 10) {
          nodes {
            topic {
              name
            }
          }
        }
        
        # Latest commit info for last update
        defaultBranchRef {
          name
          target {
            ... on Commit {
              oid
              messageHeadline
              committedDate
              author {
                name
                user {
                  login
                }
              }
            }
          }
        }
        
        # Deployment status (if any)
        deployments(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) {
          nodes {
            state
            environment
            latestStatus {
              state
              environmentUrl
            }
          }
        }
        
        # Recent release info
        releases(first: 1, orderBy: { field: CREATED_AT, direction: DESC }) {
          nodes {
            name
            tagName
            createdAt
            isPrerelease
            isDraft
          }
        }
        
        # Security alerts count
        vulnerabilityAlerts(first: 1, states: OPEN) {
          totalCount
        }
        
        # Code of conduct
        codeOfConduct {
          name
        }
        
        # Funding
        fundingLinks {
          platform
        }
        
        # Discussions (if enabled)
        hasDiscussionsEnabled
        discussions(first: 1) {
          totalCount
        }
        
        # Projects
        projects(first: 1) {
          totalCount
        }
        
        # Wiki
        hasWikiEnabled
        
        # Issues and PR settings
        hasIssuesEnabled
        
        # Package info (if any)
        packages(first: 1) {
          totalCount
        }
      }
    }
    
    # Get available languages for filtering (separate query might be better for this)
    repositories(first: 100, ownerAffiliations: OWNER) {
      nodes {
        primaryLanguage {
          name
        }
        languages(first: 10) {
          nodes {
            name
          }
        }
      }
    }
  }
}

# Separate query for getting language filter options
query GetUserLanguages($login: String!) {
  user(login: $login) {
    repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC) {
      nodes {
        primaryLanguage {
          name
        }
        languages(first: 20) {
          nodes {
            name
          }
        }
      }
    }
  }
}

# Query for contributed repositories (separate tab)
query GetUserContributedRepositories(
  $login: String!
  $first: Int = 20
  $after: String
  $orderBy: RepositoryOrderField = UPDATED_AT
  $direction: OrderDirection = DESC
) {
  user(login: $login) {
    login
    name
    avatarUrl
    
    repositoriesContributedTo(
      first: $first
      after: $after
      orderBy: { field: $orderBy, direction: $direction }
      includeUserRepositories: false
      contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]
    ) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      
      nodes {
        id
        name
        nameWithOwner
        description
        url
        
        owner {
          login
          avatarUrl
        }
        
        createdAt
        updatedAt
        pushedAt
        
        stargazerCount
        forkCount
        
        isPrivate
        isFork
        isArchived
        
        primaryLanguage {
          name
          color
        }
        
        licenseInfo {
          name
          nickname
        }
        
        repositoryTopics(first: 5) {
          nodes {
            topic {
              name
            }
          }
        }
      }
    }
  }
}
`