import { useEffect, useCallback, useContext } from "react";
import { getGitlabPrs, getGitlabData } from "@psw/utils/gitlab";
import { GITLAB_API_URL } from "@psw/constants";
import GitlabLoginButton from "@psw/components/sign-in-buttons/gitlab-login-button";
import GithubLoginButton from "@psw/components/sign-in-buttons/github-login-button";
import SignInButton from "@psw/components/sign-in-button/sign-in-button";

const SignInButtons = ({ setPrs }) => {
  const signinTypes = [
    {
      provider: "github",
      element: <GithubLoginButton setPrs={setPrs} />
    },
    {
      provider: "gitlab",
      element: <GitlabLoginButton setPrs={setPrs} />
    }
  ];
  return (
    <div>
      {signinTypes.map((signinType) => {
        return signinType.element
      })}
    </div>
  );
};

export default SignInButtons;
