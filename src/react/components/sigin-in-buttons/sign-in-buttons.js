import SignInButton from "../sign-in-button/sign-in-button";
const SignInButtons = () => {
    const ghCallback = ()=> {
        console.log("placeholder");
    }
    const signinTypes = [
        {
            provider: "github",
            callback: ghCallback
        },
    ];
    return signinTypes.map(signinType => <SignInButton signinType={signinType}/> )
}

export default SignInButtons;