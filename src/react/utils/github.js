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

export const getPrNotifications = async ({ octokit, prNumber, repository }) => {
    const allNotifications = await octokit.paginate(octokit.rest.activity.listNotificationsForAuthenticatedUser).then(notifications => notifications);
    const notificationsForPr = allNotifications.filter(notification => {
        const matchesPr = notification.subject.url.indexOf(`${repository.owner}/${repository.name}/pulls/${prNumber}`) >= 0;
        const isUnread = notification.unread;
        return matchesPr && isUnread;
    });
    return notificationsForPr;
}

export const getPrs = async ({ username, octokit, isUpdate = false })=> {
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
        if(isUpdate){
            const notifications = await getPrNotifications({ octokit, prNumber: pr.number, repository: prDetails.repository });
            prDetails["nofitications"] = notifications;
        } else {
            prDetails["notifications"] = [];
        }
        const additionalPrDetails = await getAdditionalPrDetails({ octokit, prNumber: pr.number, repository: prDetails.repository });
        prDetails['mergeableState'] = additionalPrDetails.mergeableState;
        prDetails['prId'] = additionalPrDetails.prId;
        return prDetails;
    }));
    return prsWithRepoInfo;
}