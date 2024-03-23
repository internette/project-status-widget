import { useEffect, useCallback, useContext } from "react";
import { getGitlabPrs, getGitlabData } from "@psw/utils/gitlab";
import { GITLAB_API_URL } from "@psw/constants";
import GitlabLoginButton from "@psw/components/sign-in-buttons/gitlab-login-button";
import GithubLoginButton from "@psw/components/sign-in-buttons/github-login-button";
import SignInButton from "@psw/components/sign-in-button/sign-in-button";

const SignInButtons = ({ prs }) => {
  const signinTypes = [
    {
      provider: "github",
      displayName: "Github",
      element: <GithubLoginButton prs={prs} />
    },
    {
      provider: "gitlab",
      displayName: "Gitlab",
      element: <GitlabLoginButton prs={prs} />
    }
  ];
  return (
    <div>
      {signinTypes.map((signinType) => {
        return signinType.element;
      })}
    </div>
  );
};

export default SignInButtons;
