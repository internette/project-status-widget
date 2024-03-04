import SignInButton from "../sign-in-button/sign-in-button";
const SignInButtons = () => {
    const ghCallback = ()=> {
        console.log("placeholder");
    }
    const glCallback = ()=> {
        console.log("placeholder");
    }
    const signinTypes = [
        {
            provider: "github",
            callback: ghCallback
        },{
            provider: "gitlab",
            callback: glCallback
        },
    ];
    return signinTypes.map(signinType => <SignInButton signinType={signinType}/> )
}

export default SignInButtons;