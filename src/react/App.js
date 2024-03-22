import { useState } from "react";
import cs from "classnames";
import styles from "./App.css";
import { GitlabUserContext, OctokitContext } from "@psw/contexts";
import SignInButtons from "@psw/components/sign-in-buttons/sign-in-buttons";
import AllPrsList from "@psw/components/all-prs-list/all-prs-list";

function App() {
  const [authToken, setAuthToken] = useState("");
  const [gitlabUser, setGitlabUser] = useState({});
  const [octokitContext, setOctokitContext] = useState({});
  const [prs, setPrs] = useState([]);
  return (
    <div className={cs(styles.App)}>
      <GitlabUserContext.Provider value={[gitlabUser, setGitlabUser]}>
        <OctokitContext.Provider value={[octokitContext, setOctokitContext]}>
          {authToken.length > 0 ? (
            <AllPrsList prs={prs} setPrs={setPrs} />
          ) : (
            <SignInButtons
              setAuthToken={setAuthToken}
              authToken={authToken}
              setPrs={setPrs}
            />
          )}
        </OctokitContext.Provider>
      </GitlabUserContext.Provider>
    </div>
  );
}

export default App;
