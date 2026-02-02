export const fetchCommitActivity = async (
  owner: string,
  repo: string,
  retries = 2
): Promise<number[] | null> => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    // GitHub is still computing stats - retry after a short delay
    if (response.status === 202) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return fetchCommitActivity(owner, repo, retries - 1);
      }
      return null;
    }

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    // Return all 52 weeks
    return data.map((week: any) => week.total);
  } catch (error) {
    console.error(`Error fetching commit activity for ${owner}/${repo}:`, error);
    return null;
  }
};