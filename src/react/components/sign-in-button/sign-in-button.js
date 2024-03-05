const SignInButton = ({signinType}) => {
    const { provider, callback, onclickHandler } = signinType;
    return <button onClick={ onclickHandler }>{provider}</button>
}

export default SignInButton;