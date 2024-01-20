import React, { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";
import { selectPokemon } from "../pages/Pokedex.jsx";

function RenderPokemon({ data, selectPokemon }) {
  const [loading, isLoading] = useState(true);

  const [pokemonId, setPokemonId] = useState("");

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (Array.isArray(data)) {
    return (
      <>
        {data.map((pokemon, index) => (
          <div key={index} className="pokemon__wrapper">
            {renderPokemonDetails(pokemon)}
          </div>
        ))}
      </>
    );
  } else if (typeof data === "object") {
    return <div className="pokemon__wrapper">{renderPokemonDetails(data)}</div>;
  } else {
    return null;
  }
}

export default RenderPokemon;
