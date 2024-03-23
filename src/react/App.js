import { useState, useEffect, useRef, useCallback } from "react";
import cs from "classnames";
import styles from "./App.css";
import {
  GitlabUserContext,
  GithubUserContext,
  OctokitContext
} from "@psw/contexts";
import SignInButtons from "@psw/components/sign-in-buttons/sign-in-buttons";
import AllPrsList from "@psw/components/all-prs-list/all-prs-list";

function App() {
  const [gitlabUser, setGitlabUser] = useState({});
  const [githubUser, setGithubUser] = useState({});
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
      <GithubUserContext.Provider value={[githubUser, setGithubUser]}>
        <GitlabUserContext.Provider value={[gitlabUser, setGitlabUser]}>
          <OctokitContext.Provider value={[octokitContext, setOctokitContext]}>
            {hasPrs.current ? (
              <AllPrsList prs={prs} setPrs={setPrs} />
            ) : (
              <SignInButtons setPrs={setPrs} />
            )}
          </OctokitContext.Provider>
        </GitlabUserContext.Provider>
      </GithubUserContext.Provider>
    </div>
  );
}

export default App;
