import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styling/Pokedex.css";

import { useLocation } from "react-router-dom";

import pokeballLogo from "../assets/pokeball-logo.png";
import loadingPokeball from "../assets/pokeball.svg";
import { search_terms } from "./Home.jsx";

const Pokedex = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const [singlePokemon, setSinglePokemon] = useState({});
  const [pokemonArray, setPokemonArray] = useState([]);
  const [typeNames, setTypeNames] = useState([]);
  const [pokemonStats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedPokemon, setSelectedPokemon] = useState([]);
  const [pokemonId, setPokemonId] = useState();
  const [filterMenu, setFilterMenu] = useState(false);
  const [pokemonRange, setPokemonRange] = useState([]);
  const [rangeValue, setRangeValue] = useState({ min: 1, max: 21 });
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    const query = location.search.replace("?q=", "");
    setSearchQuery(query);

    if (query.length > 0) {
      console.log(searchQuery);
      fetchPokemon(query.toLowerCase());
    } else {
      getPokemonList();
    }
  }, [searchQuery]);

  useEffect(() => {
    getPokemonList();
  }, [pokemonRange]);

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
  }, [selectedPokemon]);

  useEffect(() => {
    setPokemonArray([]);
    renderPokemonDetails(singlePokemon);
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
      setLoading(false);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching Pokemon:", error);
    }
  }

  async function getPokemonList() {
    var pokemonList = [];
    setLoading(true);

    if (pokemonRange.length > 0) {
      pokemonList = pokemonRange;
    } else {
      pokemonList = new Array(21).fill(1).map((_, index) => index + 1);
    }

    try {
      const data = await Promise.all(
        pokemonList.map((pokemon) =>
          axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`)
        )
      );

      const transformedData = data.map((item) => item.data);
      setPokemonArray(transformedData);
      setLoading(false);
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

  function toggleDropMenu(filterMenu) {
    setFilterMenu(!filterMenu);
  }

  async function filterPokemon(filter) {
    if (filter === "LOW_TO_HIGH") {
      sortPokemonById(pokemonArray, "asc");
    } else if (filter === "HIGH_TO_LOW") {
      sortPokemonById(pokemonArray, "desc");
    } else if (filter === "A-Z") {
      const sortedPokemonList = sortPokemonAlphabetically(pokemonArray, filter);
      setPokemonArray(sortedPokemonList);
    } else if (filter === "Z-A") {
      const sortedPokemonList = sortPokemonAlphabetically(pokemonArray, filter);
      setPokemonArray(sortedPokemonList);
    }
  }

  function sortPokemonAlphabetically(results, order) {
    // Create a shallow copy of the array before sorting
    const copy = [...results];

    if (order === "A-Z") {
      return copy.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        return nameA.localeCompare(nameB);
      });
    } else {
      return copy.sort((b, a) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        return nameA.localeCompare(nameB);
      });
    }
  }

  async function sortPokemonById(results, order) {
    // Sort the array based on "id"
    const sortedPokemonList = results.sort((a, b) => {
      if (order === "asc") {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });

    return sortedPokemonList;
  }

  const updateRange = (e) => {
    setSinglePokemon({});
    setSearchQuery("");
    const newValue = parseInt(e.target.value, 10);

    // Ensure the difference between min and max is at most 20
    const newMaxValue = Math.min(newValue + 20, 1017); // Assuming a maximum value of 100 (adjust as needed)

    setRangeValue({ min: newValue, max: newMaxValue });
  };

  const setRange = () => {
    const newPokemonRange = Array.from(
      { length: rangeValue.max - rangeValue.min + 1 },
      (_, index) => rangeValue.min + index
    );

    setPokemonRange(newPokemonRange);
  };

  function refreshResults() {
    setSearchQuery("");
    setPokemonArray([]);
    setSinglePokemon([]);
    getPokemonList();
    setPokemonRange([]);
    setRangeValue({ min: 0, max: 21 });
  }
  function showResults(val) {
    let terms = autocompleteMatch(val);

    // Limit the number of results to the first 5
    setTerms(terms.slice(0, 5));
  }

  function autocompleteMatch(input) {
    if (input === "") {
      return [];
    }

    var reg = new RegExp(input.toLowerCase());

    return search_terms
      .filter(function (term) {
        return (
          term.toLowerCase().match(reg) &&
          term.toLowerCase() !== input.toLowerCase()
        );
      })
      .sort(function (a, b) {
        return a.toLowerCase().startsWith(input.toLowerCase()) ? -1 : 1;
      });
  }

  function handleResultClick(value) {
    updateInput(value);
  }

  function updateInput(value) {
    document.getElementById("q").value = value;
    setTerms([]); // Clear the terms when selecting a suggestion
  }

  function renderPokemonDetails(pokemon) {
    return (
      <div className="pokemon__wrapper">
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
            src={pokemon.sprites && pokemon.sprites.front_default}
            alt=""
          />
        </div>

        <h1 className="pokemon__id">#{pokemon.id}</h1>
      </div>
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
                onKeyUp={(e) => showResults(e.target.value)}
                onSubmit={(e) => {
                  setLoading(true);
                  e.preventDefault();
                  fetchPokemon(e.target.value.toLowerCase());
                }}
              />
              <div id="result">
                {terms.length > 0 && (
                  <ul>
                    {terms.map((term, i) => (
                      <li key={i} onClick={() => handleResultClick(term)}>
                        {term}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <button className="btn search__btn" type="submit">
              <span className="material-symbols-outlined brown"> search </span>
            </button>
          </form>
          <img className="background" src={pokeballLogo} alt="" />
        </div>

        <div className="sort__wrapper">
          <div className="sortby__filter">
            <button
              className="select__filter"
              onClick={() => toggleDropMenu(filterMenu)}
            >
              <span className="material-symbols-outlined filter__icon">
                filter_alt
              </span>{" "}
              Select filter
            </button>
            {filterMenu && (
              <ul className="filter__dropdown">
                <li
                  className="filter__item"
                  onClick={() => {
                    filterPokemon("LOW_TO_HIGH");
                    toggleDropMenu(filterMenu);
                  }}
                >
                  {" "}
                  <span className="material-symbols-outlined filtered__icon reverse">
                    sort{" "}
                  </span>{" "}
                  Ascending
                </li>
                <li
                  className="filter__item"
                  onClick={() => {
                    filterPokemon("HIGH_TO_LOW");
                    toggleDropMenu(filterMenu);
                  }}
                >
                  {" "}
                  <span className="material-symbols-outlined filtered__icon">
                    sort{" "}
                  </span>{" "}
                  Descending
                </li>
                <li
                  className="filter__item"
                  onClick={() => {
                    filterPokemon("A-Z");
                    toggleDropMenu(filterMenu);
                  }}
                >
                  <span className="material-symbols-outlined">
                    sort_by_alpha
                  </span>{" "}
                  Alphabetical
                </li>
                <li
                  className="filter__item"
                  onClick={() => {
                    filterPokemon("Z-A");
                    toggleDropMenu(filterMenu);
                  }}
                >
                  {" "}
                  <span className="material-symbols-outlined flip">
                    sort_by_alpha
                  </span>
                  Reverse Alphabetical
                </li>
              </ul>
            )}

            <div className="range__filter">
              <input
                type="range"
                className="range__input"
                min={1}
                max={1017}
                onChange={updateRange}
                onMouseUp={setRange}
              />
              <div className="ranges">
                <p className="range__value">{rangeValue.min}</p>
                <p className="range__value">{rangeValue.max}</p>
              </div>
            </div>
          </div>
          <button onClick={() => refreshResults()} className="refresh__button">
            <span className="material-symbols-outlined white"> refresh </span>
          </button>
        </div>
        <div id="pokemon__row">
          <div id="pokedex">
            <div className="results">
              {searchQuery && <h2>Showing results for: "{searchQuery}"</h2>}
            </div>

            <div className="pokedex__wrapper">
              {loading ? (
                <div className="loading--spinner">
                  <img className="spinner__img" src={loadingPokeball} alt="" />
                  <h1>Loading...</h1>
                </div>
              ) : Object.keys(singlePokemon).length > 0 ? (
                renderPokemonDetails(singlePokemon)
              ) : (
                pokemonArray.map((pokemon) => (
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
                ))
              )}
            </div>
          </div>
          <div className="selected__wrapper">
            <div className="selected__pokemon">
              {Object.keys(selectedPokemon).length > 0 ? (
                renderSelectedPokemonById(selectedPokemon)
              ) : (
                <p className="empty__select">
                  Click any pokemon to view statistics
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pokedex;
