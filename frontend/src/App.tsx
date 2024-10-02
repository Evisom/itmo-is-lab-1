import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store/store"; // Import the RootState type
import { setUsername } from "./store/userSlice"; // Import your actions
import "./App.scss";
import { redirect, useNavigate } from "react-router-dom";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state: RootState) => state.user.username);

  useEffect(() => {
    if (!token) {
      // navigate("/login");
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

  return <div className="App">hello</div>;
};

export default App;
