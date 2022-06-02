import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Home";

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path="/" element={<h1>WELCOME TO FACEBOOK CLONE</h1>} />
        <Route path="/home" element={<Dashboard/>}/>
      </Routes>
    </div>
  );
}

export default App;
