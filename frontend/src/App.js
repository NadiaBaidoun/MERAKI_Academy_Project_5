import "./App.css";
import { Route, Routes } from "react-router-dom";
import Register from "./components/Register";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Search from "./components/Search";
import SearchResult from "./components/SearchResult";
import UserProfile from "./components/UserProfile/index.js";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search/" element={<Search />} />
        <Route path="/search/users" element={<SearchResult />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
