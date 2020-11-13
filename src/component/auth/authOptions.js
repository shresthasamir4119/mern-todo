import { useHistory } from "react-router-dom";
import { useContext } from "react";
import userContext from "../../context/user.context";

import "./authOptions.css";

function AuthOptions() {
  const { userData, setUserData } = useContext(userContext);

  const history = useHistory();

  const register = () => history.push("/register");
  const login = () => history.push("/login");
  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-token", "");
    history.push("/login");
  };

  return (
    <div id="authOptions">
      {userData.user ? (
        <>
          <span className="username">{userData.user.displayName}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={register}>Register</button>
          <button onClick={login}>Login</button>
        </>
      )}
    </div>
  );
}

export default AuthOptions;
