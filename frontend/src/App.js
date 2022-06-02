import "./App.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Home";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path="/" element={<h1>WELCOME TO FACEBOOK CLONE</h1>} />
        <Route path="/Home" element={<Dashboard />}/>
      </Routes>
    </div>
  );
}

export default App;
