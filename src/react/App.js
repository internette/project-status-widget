import { useState } from "react";
import "./App.css";
import { OctokitContext } from "./contexts/octokit";
import SignInButtons from "@psw/components/sign-in-buttons/sign-in-buttons";
import AllPrsList from "./components/all-prs-list/all-prs-list";

function App() {
  const [authToken, setAuthToken] = useState("");
  const [octokitContext, setOctokitContext] = useState({});
  const [prs, setPrs] = useState([]);
  return (
    <div className="App">
      <OctokitContext.Provider value={[octokitContext, setOctokitContext]}>
        {authToken.length > 0 ? (
          <AllPrsList prs={prs} />
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
