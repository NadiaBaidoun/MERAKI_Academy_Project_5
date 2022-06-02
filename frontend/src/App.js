import "./App.css";
import { Route, Routes } from "react-router-dom";
import CreatPost from "./components/Createpost";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<h1>WELCOME TO FACEBOOK CLONE</h1>} />
        <Route path="/create/post" element={<CreatPost />} />
      </Routes>
    </div>
  );
}

export default App;
