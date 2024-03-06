import { useEffect } from "react";
import { Octokit } from "octokit";
import SignInButton from "../sign-in-button/sign-in-button";

const SignInButtons = () => {
    useEffect(() => {
        window.ghLogin.receive((event, { accessToken })=>{
            ghCallback(accessToken);
        });
    }, [])
    const ghCallback = async (accessToken)=> {
        const octokit = new Octokit({ 
            auth: accessToken
        });
        const response = await octokit.request('GET /user/subscriptions', {
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        console.log(response);
    }
    const ghClickHandler = () => {
        window.ghLogin.send();
    }
    const glCallback = ()=> {
        console.log("placeholder");
    }
    const glClickHandler = () => {
        console.log("placeholder");
    }
    const signinTypes = [
        {
            provider: "github",
            callback: ghCallback,
            onclickHandler: ghClickHandler
        },{
            provider: "gitlab",
            callback: glCallback,
            onclickHandler: glClickHandler
        },
    ];
    return <div>
        {signinTypes.map(signinType => <SignInButton signinType={signinType}/> )}
    </div>
}

export default SignInButtons;