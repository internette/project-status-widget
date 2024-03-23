import { useContext, useCallback, useEffect } from "react";
import { Octokit } from "octokit";
import { getGithubPrs } from "@psw/utils/github";
import { GithubUserContext, OctokitContext } from "@psw/contexts";
import SignInButton from "@psw/components/sign-in-button/sign-in-button";

const GithubLoginButton = ({ prs, classes = "" }) => {
  const [octokitContext, setOctokitContext] = useContext(OctokitContext);
  const [githubUser, setGithubUser] = useContext(GithubUserContext);
  const ghCallback = useCallback(
    async ({ access_token }) => {
      const octokit = new Octokit({
        auth: access_token
      });
      const userResp = await octokit.request("GET /user", {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28"
        }
      });
      const { login, id } = await userResp.data;
      setOctokitContext({ context: octokit, username: login });
      if (login) {
        const currentPrs = await getGithubPrs({ octokit, username: login });
        const newPrsObj = { ...prs.current, github: currentPrs };
        prs.current = newPrsObj;
      }
      setGithubUser({
        authToken: access_token,
        username: login,
        id
      });
    },
    [setGithubUser, prs, setOctokitContext]
  );
  const ghClickHandler = () => {
    window.ghLogin.send();
  };
  useEffect(() => {
    if (window && window.ghLogin) {
      window.ghLogin.receive((event, args) => {
        ghCallback(args);
      });
    }
  }, [ghCallback]);
  const signinType = {
    provider: "github",
    callback: ghCallback,
    onclickHandler: ghClickHandler
  };
  return <SignInButton signinType={signinType} classes={classes} />;
};

export default GithubLoginButton;
