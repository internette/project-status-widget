const SignInButton = ({ signinType }) => {
  const { provider, onclickHandler } = signinType;
  return (
    <button
      onClick={onclickHandler}
      style={{
        "-webkit-app-region": "no-drag"
      }}
    >
      {provider}
    </button>
  );
};

export default SignInButton;
