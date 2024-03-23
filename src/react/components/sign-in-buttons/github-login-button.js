import { useContext, useCallback, useEffect } from "react";
import { Octokit } from "octokit";
import { getGithubPrs } from "@psw/utils/github";
import { GithubUserContext, OctokitContext } from "@psw/contexts";
import SignInButton from "@psw/components/sign-in-button/sign-in-button";

const GithubLoginButton = ({ setPrs }) => {
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
    const signinType = {
        provider: "github",
        callback: ghCallback,
        onclickHandler: ghClickHandler
    }
    return <SignInButton signinType={signinType} />
}

export default GithubLoginButton;