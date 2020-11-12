import { Link } from "react-router-dom";

import AuthOptions from "../auth/authOptions";

import "./header.css";

function Header() {
  return (
    <div id="header">
      <Link to="/">
        <h1>MERN To Do</h1>
      </Link>
      <AuthOptions />
    </div>
  );
}

export default Header;
