import cs from "classnames";
import styles from "./sign-in-button.module.scss";

const SignInButton = ({ signinType, classes = "" }) => {
  const { provider, onclickHandler } = signinType;
  return (
    <button
      onClick={onclickHandler}
      className={classes}
      style={{
        "-webkit-app-region": "no-drag"
      }}
    >
      <i className={cs("fa-brands", `fa-${provider}`, styles.providerIcon)}></i>
      Login with {provider}
    </button>
  );
};

export default SignInButton;
