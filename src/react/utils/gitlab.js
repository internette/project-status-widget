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

export const getPrs = async ({ isUpdate = false, username, id, authToken }) => {
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
  });
  console.log(PRs);
  return PRs;
};
