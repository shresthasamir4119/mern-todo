import { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

import "./auth.css";

import axios from "axios";
import ErrorNotice from "../misc/errorNotice";
import userContext from "../../context/user.context";

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  const { setUserData } = useContext(userContext);

  const history = useHistory();

  const { userData } = useContext(userContext);

  useEffect(() => {
    //If user already logged in
    if (userData.user) history.push("/");
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      const loginResponse = await axios.post(
        "http://localhost:50000/users/login",
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
      <h2>Login</h2>

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

        <input type="submit" value="Login" onClick={submit}></input>
      </form>
    </div>
  );
}

export default Login;
