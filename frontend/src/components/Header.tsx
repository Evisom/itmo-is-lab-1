import React from "react";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Определим интерфейс для пропсов компонента Header
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
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component="a"
          href="/"
          sx={{ flexGrow: 1 }}
          style={{ color: "white", textDecoration: "none" }}
        >
          IS-LAB-1
        </Typography>
        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
          }}
        >
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => {
              navigate("/new");
            }}
          >
            Создать
            <AddIcon />
          </Button>
          {isAdmin && <Button color="inherit">админка</Button>}
          <div style={{ display: "flex", gap: 8 }}>
            <AccountCircleIcon />
            <Typography>{username}</Typography>
          </div>
          <LogoutIcon onClick={onLogout} />
        </div>
      </Toolbar>
    </AppBar>
  );
};
