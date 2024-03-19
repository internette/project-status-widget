import cs from "classnames";
import SignInButtons from "@psw/components/sign-in-buttons/sign-in-buttons";
import styles from "./login-container.module.scss";

const LoginContainer = ({ setAuthToken, authToken, setPrs }) => {
    return <div className={cs(styles.loginContainer)}>
        <SignInButtons
            setAuthToken={setAuthToken}
            authToken={authToken}
            setPrs={setPrs}
        />
    </div>
};

export default LoginContainer;
