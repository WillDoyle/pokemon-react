import React from "react";
import siteLogo from "../assets/site__logo.webp";
import siteLogo2 from "../assets/site__logo.svg";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <>
      <nav>
        <div className="site__logo">
          <Link className="home__link" to="/" previewlistener="true">
            {/* Use the Icon component directly */}
            <img className="logo" src={siteLogo2} alt="" />
            <h2 className="logo__text">Pikapedia</h2>
          </Link>
        </div>

        <ul className="nav__links">
          <li className="nav__link">
            <Link
              className="nav__link--anchor link__hover-effect"
              to="/"
              previewlistener="true"
            >
              Home
            </Link>
          </li>
          <li className="nav__link">
            <Link
              className="nav__link--anchor link__hover-effect"
              to="/pokedex"
              previewlistener="true"
            >
              Pokedex
            </Link>
          </li>
          <li className="nav__link">
            <Link
              className="nav__link--anchor contact"
              href=""
              previewlistener="true"
            >
              CONTACT
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Nav;
