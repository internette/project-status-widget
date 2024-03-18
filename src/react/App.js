import { useState } from "react";
import "./App.css";
import { OctokitContext } from "./contexts/octokit";
import SignInButtons from "@psw/components/sign-in-buttons/sign-in-buttons";
import PrList from "@psw/components/pr-list/pr-list";

function App() {
  const [authToken, setAuthToken] = useState("");
  const [octokitContext, setOctokitContext] = useState({});
  const [prs, setPrs] = useState([]);
  return (
    <div className="App">
      <OctokitContext.Provider value={[octokitContext, setOctokitContext]}>
        {authToken.length > 0 ? (
          <PrList prs={prs} />
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
