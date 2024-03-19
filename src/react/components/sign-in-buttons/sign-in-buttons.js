import { useEffect, useCallback, useContext } from "react";
import { Octokit } from "octokit";
import { OctokitContext } from "@psw/contexts/github";
import { getPrs } from "@psw/utils/github";
import SignInButton from "@psw/components/sign-in-button/sign-in-button";
import cs from "classnames";
import styles from "./sign-in-buttons.module.scss";

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
      displayName: "Github",
      callback: ghCallback,
      onclickHandler: ghClickHandler,
    },
    {
      provider: "gitlab",
      displayName: "Gitlab",
      callback: glCallback,
      onclickHandler: glClickHandler,
    },
  ];
  return (
    <div className={cs(styles.buttonsContainer)}>
      {signinTypes.map((signinType) => (
        <p className={cs(styles.buttonContainer)}>
          <SignInButton signinType={signinType} />
        </p>
      ))}
    </div>
  );
};

export default SignInButtons;
