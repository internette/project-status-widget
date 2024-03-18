export const getAdditionalPrDetails = async ({ octokit, prNumber, repository }) => {
    const prDataResponse = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}",
      {
        owner: repository.owner,
        repo: repository.name,
        pull_number: prNumber,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const prData = prDataResponse.data;
    return {
        mergeableState: prData.mergeable_state,
        prId: prData.id
    }
};

export const getPrs = async ({ username, octokit })=> {
    const searchQueryParams = `is:open is:pr involves:${username}`;
    const searchQuery = "?q=" + encodeURIComponent(searchQueryParams);
    const fullSearch = "GET /search/issues" + searchQuery;
    const response = await octokit.request(
        fullSearch,
        {
        headers: {
            "X-GitHub-Api-Version": "2022-11-28",
        },
        }
    );
    const prs = response.data.items;
    const prsWithRepoInfo = Promise.all(prs.map(async (pr)=> {
        const prDetails = pr;
        let repo = prDetails.repository_url.replace(".git", "");
        repo = repo.split("/repos/")[1];
        const repoName = repo.substring(
        repo.lastIndexOf("/") + 1,
        repo.length
        );
        const repoOwner = repo.substring(0, repo.indexOf("/"));
        prDetails["repository"] = {
            url: prDetails.repository_url,
            name: repoName,
            owner: repoOwner,
        };
        const additionalPrDetails = await getAdditionalPrDetails({ octokit, prNumber: pr.number, repository: prDetails.repository });
        prDetails['mergeableState'] = additionalPrDetails.mergeableState;
        prDetails['prId'] = additionalPrDetails.prId;
        return prDetails;
    }));
    return prsWithRepoInfo;
}