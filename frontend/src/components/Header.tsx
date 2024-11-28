import React, { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BASEURL } from "..";
import useSWR from "swr";
import "./Header.css";

interface HeaderProps {
  isAdmin: boolean;
  username: string;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAdmin,
  username,
  onLogout,
}) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate(BASEURL + "/login");
    }
  });
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component="a"
          href={BASEURL + "/"}
          className="header-title"
        >
          IS-LAB-1
        </Typography>
        <div className="header-actions">
          {(isAdmin || localStorage.getItem("admin") === "true") && (
            <Typography component="a" href={BASEURL + "/admin"}>
              АДМИНКА
            </Typography>
          )}
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => navigate(BASEURL + "/new")}
          >
            Создать
            <AddIcon />
          </Button>
          <Typography component="a" href={BASEURL + "/operations"}>
            ОПЕРАЦИИ
          </Typography>
          <Typography component="a" href={BASEURL + "/coordinates"}>
            КООРДИНАТЫ
          </Typography>
          <Typography component="a" href={BASEURL + "/car"}>
            МАШИНЫ
          </Typography>
          <Typography component="a" href={BASEURL + "/import"}>
            ИМПОРТ
          </Typography>

          <div className="header-user">
            <AccountCircleIcon />
            <Typography>{username}</Typography>
          </div>
          <LogoutIcon
            onClick={() => {
              localStorage.clear();
              navigate(BASEURL + "/login");
            }}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};

// Использование SWR для получения данных
const fetcher = (url: string) => fetch(url).then((res) => res.json());
