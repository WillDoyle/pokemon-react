import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Pokedex from "./pages/Pokedex";

import Home from "./pages/Home";
import Nav from "./components/Nav";
import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");

  function searchPokemon({ event }) {
    console.log(event);
  }
  return (
    <Router>
      <Nav />

      <div className="App">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/pokedex" element={<Pokedex />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
