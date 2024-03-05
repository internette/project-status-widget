import SignInButton from "../sign-in-button/sign-in-button";

const SignInButtons = () => {
    const ghCallback = async ()=> {
        console.log("placeholder");
    }
    const ghClickHandler = async () => {
        await window.login.ghLogin();
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
    return <>{signinTypes.map(signinType => <SignInButton signinType={signinType}/> )}</>
}

export default SignInButtons;