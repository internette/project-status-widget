import { useEffect, useCallback, useContext } from "react";
import { Octokit } from "octokit";
import { OctokitContext } from "../../contexts/octokit";
import SignInButton from "@psw/components/sign-in-button/sign-in-button";

const SignInButtons = ({ authToken, setAuthToken, setPrs }) => {
  const [octokitContext, setOctokitContext] = useContext(OctokitContext);
  const ghCallback = useCallback(
    async ({ access_token }) => {
      const octokit = new Octokit({
        auth: access_token,
      });
      setOctokitContext(octokit);
      const userResp = await octokit.request("GET /user", {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
      const username = await userResp.data.login;
      if (username) {
        const searchQueryParams = `is:open is:pr involves:${username}`;
        const searchQuery = "?q=" + encodeURIComponent(searchQueryParams);
        const response = await octokit.request(
          "GET /search/issues" + searchQuery,
          {
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        const prsWithRepoInfo = response.data.items;
        await prsWithRepoInfo.map((pr) => {
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
          return prDetails;
        });
        const currentPrs = prsWithRepoInfo;
        setPrs({ github: currentPrs });
      }
      setAuthToken(access_token);
    },
    [setAuthToken, setPrs, setOctokitContext]
  );
  const ghClickHandler = () => {
    window.ghLogin.send();
  };
  const glCallback = () => {
    console.log("placeholder");
  };
  const glClickHandler = () => {
    console.log("placeholder");
  };

  useEffect(() => {
    if (window && window.ghLogin && authToken.length <= 0) {
      window.ghLogin.receive((event, args) => {
        ghCallback(args);
      });
    }
  }, [ghCallback, authToken]);

  const signinTypes = [
    {
      provider: "github",
      callback: ghCallback,
      onclickHandler: ghClickHandler,
    },
    {
      provider: "gitlab",
      callback: glCallback,
      onclickHandler: glClickHandler,
    },
  ];
  return (
    <div>
      {signinTypes.map((signinType) => (
        <SignInButton signinType={signinType} />
      ))}
    </div>
  );
};

export default SignInButtons;
