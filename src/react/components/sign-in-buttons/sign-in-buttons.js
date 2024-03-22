import { useEffect, useCallback, useContext } from "react";
import { Octokit } from "octokit";
import { OctokitContext, GitlabUserContext } from "@psw/contexts";
import { getPrs } from "@psw/utils/github";
import { getPrs as getGitlabPrs, getGitlabData } from "@psw/utils/gitlab";
import { GITLAB_API_URL } from "@psw/constants";
import SignInButton from "@psw/components/sign-in-button/sign-in-button";

const SignInButtons = ({ authToken, setAuthToken, setPrs }) => {
  const [octokitContext, setOctokitContext] = useContext(OctokitContext);
  const [gitlabUser, setGitlabUser] = useContext(GitlabUserContext);
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
      const username = await userResp.data.login;
      setOctokitContext({ context: octokit, username });
      if (username) {
        const currentPrs = await getPrs({ octokit, username });
        setPrs({ github: currentPrs });
      }
      setAuthToken(access_token);
    },
    [setAuthToken, setPrs, setOctokitContext]
  );

  const ghClickHandler = () => {
    window.ghLogin.send();
  };

  useEffect(() => {
    if (window && window.ghLogin && authToken.length <= 0) {
      window.ghLogin.receive((event, args) => {
        ghCallback(args);
      });
    }
  }, [ghCallback, authToken]);

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
        console.log(gitlabPrs);
      }
      const gitlabUser = {
        authToken: access_token,
        refreshToken: refresh_token,
        username,
        id
      };
      setGitlabUser(gitlabUser);
    },
    [setGitlabUser]
  );

  const glClickHandler = () => {
    window.glLogin.send();
  };
  useEffect(() => {
    if (
      window &&
      window.glLogin &&
      (!gitlabUser.authToken || gitlabUser.authToken <= 0)
    ) {
      window.glLogin.receive((event, args) => {
        glCallback(args);
      });
    }
  }, [glCallback, gitlabUser.authToken]);

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
