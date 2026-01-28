import { gql } from "@apollo/client";

export const GET_USER_REPOSITORIES = gql`
  query GetUserRepositories(
  $userId: String!
  $first: Int = 20
  $after: String
  $orderBy: RepositoryOrderField = UPDATED_AT
  $direction: OrderDirection = DESC
  $ownerAffiliations: [RepositoryAffiliation] = [OWNER]
  $privacy: RepositoryPrivacy
  $isFork: Boolean
  $isArchived: Boolean
)  {
 user(login: $userId) {
    # Basic user info for the page header
    login
    name
    avatarUrl
    
    # Repository counts for different categories - using aliases
    ownedRepositories: repositories(ownerAffiliations: OWNER, privacy: PUBLIC) {
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
        
        topLanguages: languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
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
  }
}
`