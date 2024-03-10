const SignInButton = ({ signinType }) => {
  const { provider, onclickHandler } = signinType;
  return <button onClick={onclickHandler}>{provider}</button>;
};

export default SignInButton;
