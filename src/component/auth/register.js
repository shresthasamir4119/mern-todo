import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import "./auth.css";

import userContext from "../../context/user.context";

import axios from "axios";
import ErrorNotice from "../misc/errorNotice";

function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [verifyPassword, setVerifyPassword] = useState();
  const [displayName, setDisplayName] = useState();
  const [error, setError] = useState();

  const { setUserData } = useContext(userContext);

  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const newUser = {
        email,
        password,
        passwordCheck: verifyPassword,
        displayName,
      };

      await axios.post(
        "/users/register",
        newUser
      );

      const loginResponse = await axios.post(
        "/users/login",
        { email, password }
      );

      setUserData({
        token: loginResponse.data.token,
        user: loginResponse.data.user,
      });
      localStorage.setItem("auth-token", loginResponse.data.token);

      history.push("/");
    } catch (err) {    
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  return (
    <div className="page">
      <h2>Register</h2>

      {error && (
        <ErrorNotice
          message={error}
          clearError={() => {
            setError(undefined);
          }}
        />
      )}

      <form className="form">
        <label htmlFor="register-email"> Email</label>
        <input
          id="register-email"
          onChange={(e) => setEmail(e.target.value)}
        ></input>

        <label htmlFor="password"> Password</label>
        <input
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>

        <label htmlFor="verify-password"> Verify Password</label>
        <input
          id="verify-password"
          type="password"
          onChange={(e) => setVerifyPassword(e.target.value)}
        ></input>

        <label htmlFor="display-name"> Display Name</label>
        <input
          id="display-name"
          onChange={(e) => setDisplayName(e.target.value)}
        ></input>

        <input type="submit" value="Register" onClick={submit}></input>
      </form>
    </div>
  );
}

export default Register;
