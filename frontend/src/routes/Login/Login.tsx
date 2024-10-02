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
export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

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

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameErrorText, setUsernameErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");

  const handleLogin = () => {
    console.log(username, password);

    if (username.length <= 3) {
      setUsernameErrorText("Слишком короткое имя пользователя");
    }
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
            setUsername(e.target.value);
          }}
        />
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
          <OutlinedInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
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
