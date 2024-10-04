// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./../../store/store";
import { setUsername, setToken } from "./../../store/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControlLabel,
  ButtonGroup,
} from "@mui/material";
import { Header } from "./../../components/Header";

export const Admin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username =
    useSelector((state: RootState) => state.user.username) ||
    localStorage.getItem("username");
  const token =
    useSelector((state: RootState) => state.user.token) ||
    localStorage.getItem("token");

  const id = Number(
    useSelector((state: RootState) => state.user.id) ||
      localStorage.getItem("id")
  );

  const [isAdmin, setIsAdmin] = useState(false);
  const [limboList, setLimboList] = useState();

  const fetchAdminStatus = () => {
    fetch(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((response) => {
        setIsAdmin(response.roles.includes("ADMIN"));
        if (!response.roles.includes("ADMIN")) {
          navigate("/");
        }
      })
      .catch(() => {
        console.log("ошибка проверки админа");
      });
  };
  fetchAdminStatus();

  useEffect(() => {
    fetch("/limbo", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        setLimboList(response);
      })
      .catch((response) => {
        console.log("ошибка загрузки лимболиста");
      });
  });

  return (
    <div>
      <Header
        isAdmin={isAdmin}
        username={username}
        onLogout={() => {
          localStorage.clear();
          dispatch(setToken(""));
          navigate("/");
        }}
      />
      <Container
        maxWidth="xxl"
        style={{
          marginTop: 24,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {limboList?.map((user) => {
          return (
            <Alert severity="info" style={{ position: "relative" }}>
              <AlertTitle>Запрос на получение прав администратора</AlertTitle>
              {user.login} (id: {user.id}) запрашивает права администратора
              <ButtonGroup
                style={{
                  position: "absolute",
                  right: 16,
                  top: 20,
                }}
                disableElevation
                variant="outlined"
                aria-label="Disabled button group"
              >
                <Button
                  onClick={() => {
                    fetch(`/limbo?userId=${user.id}`, {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` },
                    });
                  }}
                >
                  отклонить
                </Button>
                <Button
                  onClick={() => {
                    fetch(`/users/addAdminRole/${user.id}`, {
                      method: "PUT",
                      headers: { Authorization: `Bearer ${token}` },
                    });
                  }}
                >
                  принять
                </Button>
              </ButtonGroup>
            </Alert>
          );
        })}
      </Container>
    </div>
  );
};
