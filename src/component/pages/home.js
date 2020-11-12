import { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import userContext from "../../context/user.context";

function Home() {
  const { userData } = useContext(userContext);
  const history = useHistory();

  useEffect(() => {
    if (!userData.user) history.push("/login");
  }, []);

  return (
    <div className="page">
      Hom
    </div>
  );
}

export default Home;
