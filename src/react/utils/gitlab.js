import { GITLAB_API_URL } from "@psw/constants";

export const getGitlabData = async ({ authToken, path }) => {
  const response = await fetch(`${GITLAB_API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });
  const responseAsJson = await response.json();
  return responseAsJson;
};

const getProjectData = async ({ authToken, projectId }) => {
  const projectDetailsData = await getGitlabData({
    authToken,
    path: `/projects/${projectId}`
  });
  const projectDetails = {
    url: projectDetailsData.http_url_to_repo,
    name: projectDetailsData.path,
    owner: projectDetailsData.namespace.path
  };
  return projectDetails;
};

export const getToDosForPr = async ({ authToken, prId }) => {
  const toDosData = await getGitlabData({
    authToken,
    path: '/todos?type=MergeRequest&state=pending'
  });
  const filteredToDosData = toDosData.filter(toDo => toDo.target.id === prId && toDo.target.state !== 'merged');
  const gitlabToGithubReasonMap = {
    assigned: "review_requested",
    mentioned: "mentioned",
    build_failed: "state_change",
    unmergeable: "state_change",
    approval_required: "approval_requested",
    directly_addressed: "mentioned"
  }
  const formattedToDosData = filteredToDosData.map(toDo => {
    return {
      reason: gitlabToGithubReasonMap[toDosData.action_name],
      id: `gitlab-todo-${toDosData.id}`
    }
  });
  return formattedToDosData;
}

const formatPrStatus = (detailed_merge_status) => {
  const githubToGitlabStatusMap = {
    cannot_be_merged_recheck: "unstable",
    blocked_status: "blocked",
    checking: "unstable",
    unchecked: "unstable",
    ci_must_pass: "blocked",
    ci_still_running: "unstable",
    discussions_not_resolved: "blocked",
    draft_status: "blocked",
    external_status_checks: "blocked",
    mergeable: "clean",
    not_approved: "blocked",
    needs_rebase: "dirty",
    conflict: "dirty"
  };
  return githubToGitlabStatusMap[detailed_merge_status];
};

export const getGitlabPrs = async ({
  isUpdate = false,
  username,
  authToken
}) => {
  let PRs = [];
  const authoredPrs = await getGitlabData({
    authToken,
    path: `/merge_requests?state=opened&author_username=${username}`
  });
  PRs = PRs.concat(authoredPrs);
  const reviewerPrs = await getGitlabData({
    authToken,
    path: `/merge_requests?state=opened&reviewer_username=${username}&scope=all`
  });
  reviewerPrs.forEach((reviewerPr) => {
    const notAuthored =
      authoredPrs.filter((authoredPr) => authoredPr.id === reviewerPr.id)
        .length <= 0;
    if (notAuthored) {
      PRs.push(reviewerPr);
    }
    return;
  });
  const prsWithRepoInfo = Promise.all(
    PRs.map(async (pr) => {
      const formattedPr = pr;
      if(isUpdate){
        const notifications = await getToDosForPr({ authToken, prId: pr.id });
        formattedPr["notifications"] = notifications;
        console.log(notifications);
      } else {
        formattedPr["notifications"] = [];
      }
      formattedPr["mergeableState"] = formatPrStatus(pr.detailed_merge_status);
      formattedPr["html_url"] = pr.web_url;
      formattedPr["id"] = pr.id;
      formattedPr["number"] = pr.iid;
      const prUser = {
        login: pr.author.username,
        html_url: pr.author.web_url
      };
      formattedPr["user"] = prUser;
      const projectDetails = await getProjectData({
        authToken,
        projectId: pr.project_id
      });
      formattedPr["repository"] = {
        url: projectDetails.url,
        name: projectDetails.name,
        owner: projectDetails.owner,
        id: pr.project_id
      };
      return formattedPr;
    })
  );
  return prsWithRepoInfo;
};
