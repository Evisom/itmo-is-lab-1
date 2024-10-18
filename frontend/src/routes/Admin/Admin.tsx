// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./../../store/store";
import { setUsername, setToken } from "./../../store/userSlice";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  ButtonGroup,
  Alert,
  AlertTitle,
  Typography,
} from "@mui/material";
import { Header } from "./../../components/Header";
import { BASEURL } from "../..";

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

  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin"));
  const [limboList, setLimboList] = useState([]);

  // Fetch admin status and limbo list every 2 seconds
  const fetchData = () => {
    fetch(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((response) => {
        setIsAdmin(response.roles.includes("ADMIN"));
        if (!response.roles.includes("ADMIN")) {
          navigate(BASEURL + "/");
        }
      })
      .catch(() => {
        console.log("Ошибка проверки админа");
      });

    fetch("/limbo", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((response) => {
        setLimboList(response);
      })
      .catch(() => {
        console.log("Ошибка загрузки лимболиста");
      });
  };

  useEffect(() => {
    // Initial fetch
    fetchData();
    // Set up interval to refresh every 2 seconds
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [token, id, navigate]);

  const handleReject = (userId) => {
    fetch(`/limbo?userId=${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(fetchData)
      .catch(() => console.log("Ошибка отклонения запроса"));
  };

  const handleApprove = (userId) => {
    fetch(`/users/addAdminRole/${userId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(fetchData)
      .catch(() => console.log("Ошибка добавления прав администратора"));
  };

  return (
    <div>
      <Header
        isAdmin={isAdmin}
        username={username}
        onLogout={() => {
          localStorage.clear();
          dispatch(setToken(""));
          navigate(BASEURL + "/");
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
        {limboList.length === 0 ? (
          <Alert severity="info" style={{ padding: 20 }}>
            <AlertTitle>Нет запросов</AlertTitle>
            <Typography variant="body1">
              В данный момент нет запросов на получение прав администратора.
            </Typography>
          </Alert>
        ) : (
          limboList.map((user) => (
            <Alert
              severity="info"
              style={{ position: "relative" }}
              key={user.id}
            >
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
                aria-label="Admin request actions"
              >
                <Button onClick={() => handleReject(user.id)}>Отклонить</Button>
                <Button onClick={() => handleApprove(user.id)}>Принять</Button>
              </ButtonGroup>
            </Alert>
          ))
        )}
      </Container>
    </div>
  );
};
