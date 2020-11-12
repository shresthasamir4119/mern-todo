import { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import userContext from "../../context/user.context";

import Todo from "../layout/todo";

function Home() {
  const { userData } = useContext(userContext);
  const history = useHistory();

  useEffect(() => {
    if (!userData.user) history.push("/login");
  });

  return (
    <div className="page">
      <Todo></Todo>
    </div>
  );
}

export default Home;
