import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import Home from "./component/pages/home";
import Login from "./component/auth/login";
import Header from "./component/layout/header";
import Register from "./component/auth/register";

import userContext from "./context/user.context";

import "./App.css";

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");

      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }

      const isTokenValid = await axios.post(
        "http://localhost:50000/users/tokenIsValid",
        null,
        {
          headers: { "x-auth-token": token },
        }
      );

      if (isTokenValid.data) {
        const userInfo = await axios.get("http://localhost:50000/users/", {
          headers: { "x-auth-token": token },
        });
        setUserData({
          token,
          user: userInfo.data,
        });
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <>
      <BrowserRouter>
        <userContext.Provider
          value={{
            userData,
            setUserData,
          }}
        >
          <Header></Header>
          <div className="container">
            <Switch>
              <Route path="/" exact component={Home}></Route>
              <Route path="/login" component={Login}></Route>
              <Route path="/register" component={Register}></Route>
            </Switch>
          </div>
        </userContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
