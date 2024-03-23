import { useState, useEffect, useRef, useCallback } from "react";
import cs from "classnames";
import styles from "./App.css";
import { GitlabUserContext, OctokitContext } from "@psw/contexts";
import SignInButtons from "@psw/components/sign-in-buttons/sign-in-buttons";
import AllPrsList from "@psw/components/all-prs-list/all-prs-list";

function App() {
  const [authToken, setAuthToken] = useState(null);
  const [gitlabUser, setGitlabUser] = useState({});
  const [octokitContext, setOctokitContext] = useState({});
  const [prs, setPrs] = useState({});
  const checkForPrs = useCallback(
    (provider) => {
      return (
        Object.keys(prs).length > 0 &&
        prs.hasOwnProperty(provider) &&
        prs[provider].length > 0
      );
    },
    [prs]
  );
  let hasGithubPrs = useRef(false);
  let hasGitlabPrs = useRef(false);
  const hasPrs = useRef(hasGithubPrs.current || hasGitlabPrs.current);
  useEffect(() => {
    hasGithubPrs.current = checkForPrs("github");
    hasGitlabPrs.current = checkForPrs("gitlab");
    hasPrs.current = hasGithubPrs.current || hasGitlabPrs.current;
  }, [prs, checkForPrs]);
  return (
    <div className={cs(styles.App)}>
      <GitlabUserContext.Provider value={[gitlabUser, setGitlabUser]}>
        <OctokitContext.Provider value={[octokitContext, setOctokitContext]}>
          {hasPrs.current ? (
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
