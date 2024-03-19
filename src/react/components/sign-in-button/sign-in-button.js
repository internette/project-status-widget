import cs from "classnames";
import styles from "./sign-in-button.module.scss";

const SignInButton = ({ signinType }) => {
  const { provider, onclickHandler, displayName } = signinType;
  return <button className={cs(styles.buttonReset, styles.buttonBase, styles[`button${displayName}`])} onClick={onclickHandler}>Login with <i className={cs('fa-solid', 'fa-brands', `fa-${provider}`, styles.buttonProviderIcon)}></i><span className={cs(styles.buttonProviderName)}>{displayName}</span></button>;
};

export default SignInButton;
