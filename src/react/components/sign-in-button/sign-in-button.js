const SignInButton = ({signinType}) => {
    const { provider, callback } = signinType;
    return <button onClick={()=> callback}>{provider}</button>
}

export default SignInButton;