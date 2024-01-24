import React, { useState } from "react";
import "../styling/Home.css";
import pikachuModel from "../assets/pikachu-3d.svg";
import App from "../App";
import { Link, useNavigate } from "react-router-dom";

import pokeballLogo from "../assets/pokeball-logo.png";
import StatsSection from "../components/StatsSection";
import silhouetteImg from "../assets/silhouette.svg";
import restAPI from "../assets/rest-api.svg";
import usersImg from "../assets/user-icon.svg";
import { search_terms } from "../components/searchterms";

function Home() {
  const [query, setQuery] = useState("");
  const [terms, setTerms] = useState([]);

  let navigate = useNavigate();
  function searchPokemonAndChangePage(event) {
    event.preventDefault();
    navigate(`/pokedex?q=${encodeURIComponent(query)}`);
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

  function updateInput(value) {
    document.getElementById("q").value = value;
    setTerms([]); // Clear the terms when selecting a suggestion
  }

  function showResults(val) {
    let terms = autocompleteMatch(val);

    // Limit the number of results to the first 5
    setTerms(terms.slice(0, 5));
  }

  function handleResultClick(value) {
    updateInput(value);
    setQuery(value);
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />
      <section id="landing">
        <div className="container">
          <div className="row">
            <h1 className="landing__h1">Hi,</h1>
            <h1 className="landing__h1">Start a search</h1>

            <div className="search__wrapper">
              <form
                autoComplete="off"
                className="searchbar__wrapper"
                onSubmit={(event) => searchPokemonAndChangePage(event)}
              >
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
                      setQuery(e.target.value);
                      showResults(e.target.value);
                    }}
                  />

                  {terms.length > 0 && (
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
                  )}
                </div>
                <button className="btn search__btn" type="submit">
                  <span className="material-symbols-outlined brown">
                    {" "}
                    search{" "}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>

        <img src={pikachuModel} alt="" className="pikachu__model" />
        <img className="background" src="./assets/pokeball.svg" alt="" />
      </section>

      <section id="stats">
        <div className="stats__wrapper--home">
          <StatsSection
            targetCount={1017}
            subheader={"accessible Pokemon"}
            img={silhouetteImg}
          />
          <StatsSection
            targetCount={300}
            subheader={"API calls each day"}
            img={restAPI}
          />
          <StatsSection
            targetCount={200000}
            subheader={"users served"}
            img={usersImg}
          />
        </div>
        <a href="https://pokeapi.co/" target="_blank">
          <p className="small__p link__hover-effect">
            requests served by PokeAPI
          </p>
        </a>
      </section>
    </>
  );
}

export default Home;
