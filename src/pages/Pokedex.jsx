import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styling/Pokedex.css";

import { useLocation } from "react-router-dom";

import pokeballLogo from "../assets/pokeball-logo.png";

const Pokedex = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const [singlePokemon, setSinglePokemon] = useState({});
  const [pokemonArray, setPokemonArray] = useState([]);
  const [typeNames, setTypeNames] = useState([]);
  const [pokemonStats, setStats] = useState([]);

  const [selectedPokemon, setSelectedPokemon] = useState([]);
  const [pokemonId, setPokemonId] = useState();

  useEffect(() => {
    const query = location.search.replace("?query=", "");
    setSearchQuery(query);

    if (query.length > 0) {
      console.log(searchQuery);
      fetchPokemon(query.toLowerCase());
    } else {
      getPokemonList();
    }
  }, []);

  useEffect(() => {
    findItemById(pokemonArray, pokemonId);
  }, [pokemonId, pokemonArray]);

  useEffect(() => {
    // Clear the typeNames array whenever a new Pokemon is selected
    setTypeNames([]);
    setStats([]);

    // Update typeNames based on the current Pokemon's types
    if (selectedPokemon.types && selectedPokemon.types.length > 0) {
      setTypeNames(selectedPokemon.types.map((item) => item.type.name));
      setStats(
        selectedPokemon.stats.map((stat) => [stat.stat.name, stat.base_stat])
      );
    }
    console.log(typeNames);
    console.log(pokemonStats);
  }, [selectedPokemon]);

  useEffect(() => {
    renderPokemonDetails(singlePokemon);
    console.log(singlePokemon);
  }, [singlePokemon]);

  useEffect(() => {
    renderSelectedPokemonById(selectedPokemon);
  }, [selectedPokemon]);

  function selectPokemon(e) {
    const pokemonId = e.target.parentNode
      .querySelector(".pokemon__id")
      .textContent.replace("#", "");

    setPokemonId(parseInt(pokemonId));
  }

  const findItemById = (pokemonList, targetId) => {
    for (let i = 0; i < pokemonList.length; i++) {
      if (pokemonList[i].id === targetId) {
        return setSelectedPokemon(pokemonList[i]);
      }
    }
    return null;
  };

  const renderSelectedPokemonById = (pokemon) => {
    const statLabels = ["HP", "ATK", "DEF", "SpA", "SpD", "SPD"];

    return (
      <>
        <div className="pokemon__name">
          <h1 className="pokemon__header">
            {pokemon.name &&
              pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </h1>
        </div>
        <div className="pokemon__img--wrapper pixel-corners--wrapper">
          {pokemon.name && (
            <img
              src={pokemon.sprites.front_default}
              alt={`${pokemon.name} img`}
              className="pokemon__img pixel-corners"
            />
          )}
        </div>

        <div className="pokemon__id">
          <h1 className="pokemon__id">#{pokemon.id}</h1>
        </div>

        <div className="pokemon__type--wrapper">
          {pokemon.name &&
            typeNames.map((type) => (
              <div key={type} className={`type__style ${type}__style`}>
                {type.toUpperCase()}
              </div>
            ))}
        </div>

        <div className="stats__wrapper">
          {pokemon.name &&
            pokemonStats.map((stat, index) => (
              <div
                className={`stats__item ${stat[0]}`}
                key={stat}
                data-stat={statLabels[index]}
              >
                {stat[1]}
              </div>
            ))}
        </div>

        <h4>Weight</h4>
        <div className="pokemon__weight">{pokemon.weight}lbs</div>
      </>
    );
  };

  async function fetchPokemon(pokemon) {
    try {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemon}/`
      );

      // Assuming setSinglePokemon is a function to handle the fetched data
      setSinglePokemon(data);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching Pokemon:", error);
    }
  }

  async function getPokemonList() {
    const pokemonList = new Array(21).fill(1).map((_, index) => index + 1);

    try {
      const data = await Promise.all(
        pokemonList.map((pokemon) =>
          axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`)
        )
      );

      const transformedData = data.map((item) => item.data);
      setPokemonArray(transformedData);
    } catch (error) {
      console.log(error.response);
    }
  }

  async function getSelectedPokemon(pokemonId) {
    console.log(pokemonId);
    try {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );

      return data;
    } catch (error) {
      // Handle errors here
      console.error("Error fetching Pokemon:", error);
    }
  }

  function renderPokemonDetails(pokemon) {
    return (
      <>
        <button
          className="pokemon__button"
          onClick={(e) => selectPokemon(e)}
        ></button>
        <div className="pokemon__name">
          <h1 className="pokemon__header">
            {pokemon.name &&
              pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </h1>
        </div>

        <div className="pokemon__img--wrapper pixel-corners--wrapper">
          <img
            className="pixel-corners"
            src={pokemon.name && pokemon.sprites.front_default}
            alt=""
          />
        </div>

        <h1 className="pokemon__id">#{pokemon.id}</h1>
      </>
    );
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />
      <div>
        <div id="search">
          <form autoComplete="off" className="searchbar__wrapper">
            <div className="search">
              <img src={pokeballLogo} className="search__icon" alt="" />

              <input
                className="player__input"
                type="text"
                name="q"
                id="q"
                placeholder="Search for pokemon"
                contentEditable="true"
                onKeyUp={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
            </div>
            <button className="btn search__btn" type="submit">
              <span className="material-symbols-outlined brown"> search </span>
            </button>
          </form>
        </div>

        <div id="pokedex">
          <div className="pokedex__wrapper">
            {pokemonArray.map((pokemon) => (
              <div className="pokemon__wrapper" key={pokemon.id}>
                <div className="pokemon__name">
                  <h1 className="pokemon__header">
                    {pokemon.name.charAt(0).toUpperCase() +
                      pokemon.name.slice(1)}
                  </h1>
                </div>
                <button
                  className="pokemon__button"
                  onClick={(e) => selectPokemon(e)}
                ></button>
                <div className="pokemon__img--wrapper pixel-corners--wrapper">
                  <img
                    src={pokemon.sprites.front_default}
                    alt=""
                    className="pokemon__img pixel-corners"
                  />
                </div>
                <div className="pokemon__id">
                  <h1 className="pokemon__id">#{pokemon.id}</h1>
                </div>
              </div>
            ))}
          </div>

          <div className="selected__wrapper">
            <div className="selected__pokemon">
              {renderSelectedPokemonById(selectedPokemon)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pokedex;
