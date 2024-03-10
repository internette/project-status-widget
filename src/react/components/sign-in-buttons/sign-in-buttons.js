import { useEffect } from "react";
import { Octokit } from "octokit";
import SignInButton from "../sign-in-button/sign-in-button";

const SignInButtons = ({ setAuthToken, authToken, setPrs }) => {
  useEffect(() => {
    window.ghLogin.receive((event, args) => {
      ghCallback(args);
    });
  }, []);
  const ghCallback = async ({ access_token }) => {
    const octokit = new Octokit({
      auth: access_token,
    });
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
      const currentPrs = [].concat(response.data.items);
      setPrs(currentPrs);
    }
    setAuthToken(access_token);
  };
  const ghClickHandler = () => {
    window.ghLogin.send();
  };
  const glCallback = () => {
    console.log("placeholder");
  };
  const glClickHandler = () => {
    console.log("placeholder");
  };
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
