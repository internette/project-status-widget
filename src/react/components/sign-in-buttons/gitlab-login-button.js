import { useEffect, useCallback, useContext } from "react";
import { GitlabUserContext } from "@psw/contexts";
import { getGitlabPrs, getGitlabData } from "@psw/utils/gitlab";
import { GITLAB_API_URL } from "@psw/constants";
import SignInButton from "@psw/components/sign-in-button/sign-in-button";

const GitlabLoginButton = ({ prs, classes = "" }) => {
  const [gitlabUser, setGitlabUser] = useContext(GitlabUserContext);
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
        const newPrsObj = { ...prs.current, gitlab: gitlabPrs };
        prs.current = newPrsObj;
      }
      const gitlabUser = {
        authToken: access_token,
        refreshToken: refresh_token,
        username,
        id
      };
      setGitlabUser(gitlabUser);
    },
    [setGitlabUser, prs]
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

  const signinType = {
    provider: "gitlab",
    callback: glCallback,
    onclickHandler: glClickHandler
  };
  return <SignInButton signinType={signinType} classes={classes} />;
};

export default GitlabLoginButton;
