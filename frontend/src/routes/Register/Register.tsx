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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Register.scss";
import { setUsername, setToken } from "../../store/userSlice";
export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [username, setInputUsername] = useState("");
  const [usernameErrorText, setUsernameErrorText] = useState("");

  const [password, setPassword] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");

  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [wantToBeAdmin, setWantToBeAdmin] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = () => {
    let valid = true;
    if (!isPasswordMatch()) {
      setPasswordErrorText("Пароли не совпадают");
      valid = false;
    }
    if (password.length < 4) {
      setPasswordErrorText("Пароль слишком короткий");
      valid = false;
    }

    if (username.length < 4) {
      setUsernameErrorText("Имя пользователя короткое");
      valid = false;
    }

    if (valid) {
      fetch("/api/auth/registration?wantBeAdmin=" + wantToBeAdmin, {
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
          dispatch(setUsername(username));
          dispatch(setToken(response.accessToken)); // запишем при успешном логине в стор токен и юзернейм
          navigate("/");
        })
        .catch(() => {
          setUsernameErrorText("Имя занято");
        });
    }
  };

  const isPasswordMatch = () => {
    return password === passwordConfirmation;
  };

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

  useEffect(() => {
    if (passwordErrorText && isPasswordMatch()) {
      setPasswordErrorText("");
    }
  }, [password, passwordConfirmation]);

  return (
    <div className="register-wrapper">
      <div className="register">
        <Typography variant="h4" component="h2">
          Регистрация
        </Typography>
        <TextField
          error={!!usernameErrorText}
          id="outlined-basic"
          label="Имя пользователя"
          variant="outlined"
          value={username}
          onChange={(e) => {
            setInputUsername(e.target.value);
            setUsernameErrorText("");
          }}
          helperText={usernameErrorText}
        />
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
          <OutlinedInput
            error={!!passwordErrorText}
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
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
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Повторите пароль
          </InputLabel>
          <OutlinedInput
            error={!!passwordErrorText}
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            value={passwordConfirmation}
            onChange={(e) => {
              setPasswordConfirmation(e.target.value);
            }}
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
            label="Повторите пароль"
          />
        </FormControl>
        <InputLabel error>{passwordErrorText}</InputLabel>
        <FormControlLabel
          control={
            <Checkbox
              value={wantToBeAdmin}
              onChange={(e) => setWantToBeAdmin(!wantToBeAdmin)}
            />
          }
          label="Хочу стать админом"
        />
        <Button
          variant="outlined"
          disabled={!(password && passwordConfirmation && username)}
          onClick={handleRegister}
        >
          создать аккаунт
        </Button>
        <Link style={{ textAlign: "center" }} underline="hover" href="/login">
          Уже есть аккаунт
        </Link>
      </div>
    </div>
  );
};
