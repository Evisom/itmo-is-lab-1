import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store/store"; // Import the RootState type
import { setUsername, setToken } from "./store/userSlice"; // Import your actions
import "./App.scss";
import { redirect, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  AppBar,
  Button,
  Container,
  Icon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username = useSelector((state: RootState) => state.user.username);
  const token = useSelector((state: RootState) => state.user.token);

  const isAdmin = true;

  useEffect(() => {
    const lsToken = localStorage.getItem("token");
    const lsUsername = localStorage.getItem("username");
    if (!(token || lsToken)) {
      navigate("/login");
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
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            IS-LAB-1
          </Typography>
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "center",
            }}
          >
            <Button color="inherit" variant="outlined">
              Создать
              <AddIcon />
            </Button>
            {isAdmin && <Button color="inherit">админка</Button>}
            <div style={{ display: "flex", gap: 8 }}>
              <AccountCircleIcon />
              <Typography>{username}</Typography>
            </div>
            <LogoutIcon
              onClick={() => {
                localStorage.clear();
                dispatch(setToken(""));
              }}
            />
          </div>
        </Toolbar>
      </AppBar>
      hello, {username}, token: {token}
    </div>
  );
};

export default App;
