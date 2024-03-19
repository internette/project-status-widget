import { useState } from "react";
import "./App.css";
import { OctokitContext } from "@psw/contexts/github";
import AllPrsList from "@psw/components/all-prs-list/all-prs-list";
import LoginContainer from "./components/login-container/login-container";

function App() {
  const [authToken, setAuthToken] = useState("");
  const [octokitContext, setOctokitContext] = useState({});
  const [prs, setPrs] = useState([]);
  return (
    <div className="App">
      <OctokitContext.Provider value={[octokitContext, setOctokitContext]}>
          {authToken.length > 0 ? (
            <AllPrsList prs={prs} setPrs={setPrs}/>
          ) : (
            <LoginContainer
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
