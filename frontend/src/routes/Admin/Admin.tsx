// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { setUsername, setToken } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  ButtonGroup,
  Alert,
  AlertTitle,
  Typography,
} from "@mui/material";
import { Header } from "../../components/Header";
import { BASEURL } from "../..";
import limboaudio from "../../limbo.mp3";
import useSWR from "swr";
import "./Admin.css";

const fetcher = (url: string, token: string) =>
  fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((res) =>
    res.json()
  );

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

  const { data: userData, error: userError } = useSWR(
    `/users/${id}`,
    (url) => fetcher(url, token),
    { refreshInterval: 2000 }
  );

  const { data: limboList, error: limboError } = useSWR(
    "/limbo",
    (url) => fetcher(url, token),
    { refreshInterval: 2000 }
  );

  // State to control screamer visibility
  const [isScreamerVisible, setIsScreamerVisible] = useState(false);

  useEffect(() => {
    if (userData && !userData.roles.includes("ADMIN")) {
      navigate(BASEURL + "/");
    }

    // Randomly show the screamer
    const randomTimeout = Math.random() * (3000 - 2000) + 4000; // Random time between 2000ms and 3000ms

    const timeout = setTimeout(() => {
      setIsScreamerVisible(true);
      setTimeout(() => {
        setIsScreamerVisible(false);
      }, 500); // Show screamer for 1 second
    }, randomTimeout);

    return () => clearTimeout(timeout);
  }, [userData, navigate]);

  const handleReject = (userId: number) => {
    fetch(`/limbo?userId=${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => mutate("/limbo")) // revalidate SWR
      .catch(() => console.log("Ошибка отклонения запроса"));
  };

  const handleApprove = (userId: number) => {
    fetch(`/users/addAdminRole/${userId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => mutate("/limbo")) // revalidate SWR
      .catch(() => console.log("Ошибка добавления прав администратора"));
  };

  return (
    <div className="admin-wallpaper">
      {isScreamerVisible && (
        <div className="screamer">
          <img
            src="https://steamuserimages-a.akamaihd.net/ugc/541895114146917959/0401863718C70373FAC6579A8ACA70C9F2C11562/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false"
            alt="Screamer"
            className="screamer-image"
          />
        </div>
      )}
      <div className="admin-container">
        <Header
          isAdmin={userData?.roles.includes("ADMIN")}
          username={username}
          onLogout={() => {
            localStorage.clear();
            dispatch(setToken(""));
            navigate(BASEURL + "/");
          }}
        />
        <Container maxWidth="xxl" className="admin-content">
          {limboList?.length === 0 ? (
            <Alert severity="info" className="admin-alert">
              <AlertTitle>Нет запросов</AlertTitle>
              <Typography variant="body1">
                В данный момент нет запросов на получение прав администратора.
              </Typography>
            </Alert>
          ) : (
            limboList?.map((user) => (
              <Alert severity="info" className="admin-alert" key={user.id}>
                <AlertTitle>Запрос на получение прав администратора</AlertTitle>
                {user.login} (id: {user.id}) запрашивает права администратора
                <ButtonGroup
                  className="admin-button-group"
                  disableElevation
                  variant="outlined"
                  aria-label="Admin request actions"
                >
                  <Button onClick={() => handleReject(user.id)}>
                    Отклонить
                  </Button>
                  <Button onClick={() => handleApprove(user.id)}>
                    Принять
                  </Button>
                </ButtonGroup>
              </Alert>
            ))
          )}
        </Container>
        <audio id="background-music" autoPlay src={limboaudio} loop />
      </div>
    </div>
  );
};
