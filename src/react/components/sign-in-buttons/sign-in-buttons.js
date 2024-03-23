import { useEffect, useCallback, useContext } from "react";
import { Octokit } from "octokit";
import {
  OctokitContext,
  GithubUserContext,
  GitlabUserContext
} from "@psw/contexts";
import { getGithubPrs } from "@psw/utils/github";
import { getGitlabPrs, getGitlabData } from "@psw/utils/gitlab";
import { GITLAB_API_URL } from "@psw/constants";
import SignInButton from "@psw/components/sign-in-button/sign-in-button";

const SignInButtons = ({ setPrs }) => {
  const [octokitContext, setOctokitContext] = useContext(OctokitContext);
  const [gitlabUser, setGitlabUser] = useContext(GitlabUserContext);
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
        setPrs({ github: currentPrs });
      }
      setGithubUser({
        authToken: access_token,
        username: login,
        id
      });
    },
    [setGithubUser, setPrs, setOctokitContext]
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

  const glCallback = useCallback(
    async ({ access_token, refresh_token }) => {
      const { username, id } = await getGitlabData({
        authToken: access_token,
        path: "/user"
      });
      if (username) {
        const gitlabPrs = await getGitlabPrs({
          isUpdate: false,
          username,
          id,
          authToken: access_token
        });
        setPrs({ gitlab: gitlabPrs });
      }
      const gitlabUser = {
        authToken: access_token,
        refreshToken: refresh_token,
        username,
        id
      };
      setGitlabUser(gitlabUser);
    },
    [setGitlabUser, setPrs]
  );

  const glClickHandler = () => {
    window.glLogin.send();
  };
  useEffect(() => {
    if (window && window.glLogin) {
      window.glLogin.receive((event, args) => {
        glCallback(args);
      });
    }
  }, [glCallback]);

  const signinTypes = [
    {
      provider: "github",
      callback: ghCallback,
      onclickHandler: ghClickHandler
    },
    {
      provider: "gitlab",
      callback: glCallback,
      onclickHandler: glClickHandler
    }
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
