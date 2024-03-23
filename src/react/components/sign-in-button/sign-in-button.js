const SignInButton = ({ signinType, classes='' }) => {
  const { provider, onclickHandler } = signinType;
  return (
    <button
      onClick={onclickHandler}
      className={classes}
      style={{
        "-webkit-app-region": "no-drag"
      }}
    >
      {provider}
    </button>
  );
};

export default SignInButton;
