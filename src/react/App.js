import { useState } from "react";
import cs from "classnames";
import styles from "./App.css";
import { OctokitContext } from "@psw/contexts/github";
import SignInButtons from "@psw/components/sign-in-buttons/sign-in-buttons";
import AllPrsList from "@psw/components/all-prs-list/all-prs-list";

function App() {
  const [authToken, setAuthToken] = useState("");
  const [octokitContext, setOctokitContext] = useState({});
  const [prs, setPrs] = useState([]);
  return (
    <div className={cs(styles.App)}>
      <OctokitContext.Provider value={[octokitContext, setOctokitContext]}>
          {authToken.length > 0 ? (
            <AllPrsList prs={prs} setPrs={setPrs}/>
          ) : (
            <SignInButtons
              setAuthToken={setAuthToken}
              authToken={authToken}
              setPrs={setPrs}
            />
          )}
      </OctokitContext.Provider>
    </div>
  );
}

export default App;
