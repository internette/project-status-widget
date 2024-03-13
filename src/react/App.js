import { useState } from "react";
import "./App.css";
import SignInButtons from "@psw/components/sign-in-buttons/sign-in-buttons";
import PrList from "@psw/components/pr-list/pr-list";

function App() {
  const [authToken, setAuthToken] = useState("");
  const [prs, setPrs] = useState([]);
  return (
    <div className="App">
      {authToken.length > 0 ? (
        <PrList prs={prs} />
      ) : (
        <SignInButtons setAuthToken={setAuthToken} setPrs={setPrs} />
      )}
    </div>
  );
}

export default App;
