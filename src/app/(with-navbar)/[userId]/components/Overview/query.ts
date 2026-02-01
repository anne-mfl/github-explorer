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
            avatarUrl
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
