const SignInButton = ({signinType}) => {
    console.log(signinType)
    const { provider, callback } = signinType;
    console.log(provider);
    return <button onClick={()=> callback}>{provider}</button>
}

export default SignInButton;