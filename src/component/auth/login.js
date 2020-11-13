import { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

import "./auth.css";

import userContext from "../../context/user.context";

import axios from "axios";

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const { setUserData } = useContext(userContext);

  const history = useHistory();

  const { userData } = useContext(userContext);

  useEffect(() => {
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
      err.response.data.msg && alert(err.response.data.msg);
    }
  };

  return (
    <div className="page">
      <h2>Login</h2>

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
