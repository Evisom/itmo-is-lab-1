import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store/store"; // Import the RootState type
import { setUsername, setToken } from "./store/userSlice"; // Import your actions
import "./App.scss";
import { redirect, useNavigate } from "react-router-dom";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username = useSelector((state: RootState) => state.user.username);
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    const lsToken = localStorage.getItem("token");
    const lsUsername = localStorage.getItem("username");
    if (!(token || lsToken)) {
      // navigate("/login");
    }
    if (lsToken && !token) {
      dispatch(setToken(lsToken + ""));
      dispatch(setUsername(lsUsername + ""));
    }
  }, [token, navigate]);

  fetch("/hello", {
    mode: "cors",
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.text())
    .then((data) => console.log(data));

  return (
    <div className="App">
      hello, {username}, token: {token}
    </div>
  );
};

export default App;
