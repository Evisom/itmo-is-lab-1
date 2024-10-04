import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  OutlinedInput,
  Button,
  Link,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import "./Login.scss";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUsername, setToken } from "../../store/userSlice";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const [username, setInputUsername] = useState("");
  const [password, setInputPassword] = useState("");

  const [usernameErrorText, setUsernameErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");

  const handleLogin = () => {
    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);

        dispatch(setUsername(username));
        dispatch(setToken(response.accessToken)); // запишем при успешном логине в стор токен и юзернейм
        navigate("/");
      })
      .then((response) => {})
      .catch(() => {
        setPasswordErrorText("Неправильный пароль");
      });
  };

  return (
    <div className="login-wrapper">
      <div className="login">
        <Typography variant="h4" component="h2">
          Вход
        </Typography>
        <TextField
          error={!!usernameErrorText}
          value={username}
          id="outlined-basic"
          label="Имя пользователя"
          variant="outlined"
          helperText={usernameErrorText}
          onChange={(e) => {
            setUsernameErrorText("");
            setInputUsername(e.target.value);
          }}
        />
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
          <OutlinedInput
            value={password}
            onChange={(e) => {
              setInputPassword(e.target.value);
              setPasswordErrorText("");
            }}
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            error={!!passwordErrorText}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Пароль"
          />
        </FormControl>
        <InputLabel error>{passwordErrorText}</InputLabel>
        <Button
          variant="outlined"
          disabled={!(password && username)}
          onClick={handleLogin}
        >
          Войти
        </Button>
        <Link
          style={{ textAlign: "center" }}
          underline="hover"
          href="/register"
        >
          Нет аккаунта
        </Link>
      </div>
    </div>
  );
};
