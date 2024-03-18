import { useEffect, useCallback, useContext } from "react";
import { Octokit } from "octokit";
import { OctokitContext } from "@psw/contexts/github";
import { getPrs } from "@psw/utils/github";
import SignInButton from "@psw/components/sign-in-button/sign-in-button";

const SignInButtons = ({ authToken, setAuthToken, setPrs }) => {
  const [octokitContext, setOctokitContext] = useContext(OctokitContext);
  const ghCallback = useCallback(
    async ({ access_token }) => {
      const octokit = new Octokit({
        auth: access_token,
      });
      const userResp = await octokit.request("GET /user", {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
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
