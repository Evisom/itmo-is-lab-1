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
import "./Register.scss"; // Renamed to .css for consistency
import { setUsername, setToken, setId } from "../../store/userSlice";
import { BASEURL } from "./../../index";

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const [username, setUsernameInput] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const [password, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [confirmPassword, setConfirmPasswordInput] = useState("");

  const [isAdminRequest, setIsAdminRequest] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = () => {
    let isValid = true;

    if (!isPasswordsMatch()) {
      setPasswordError("Пароли не совпадают");
      isValid = false;
    }

    if (password.length < 4) {
      setPasswordError("Пароль слишком короткий");
      isValid = false;
    }

    if (username.length < 4) {
      setUsernameError("Имя пользователя слишком короткое");
      isValid = false;
    }

    if (isValid) {
      fetch(`/api/auth/registration?wantBeAdmin=${isAdminRequest}`, {
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
        .then((data) => {
          dispatch(setUsername(username));
          dispatch(setToken(data.accessToken));
          dispatch(setId(data.userId));
          localStorage.setItem("id", data.userId);
          localStorage.setItem("username", username);
          localStorage.setItem("token", data.accessToken);
          navigate(BASEURL + "/");
        })
        .catch(() => {
          setUsernameError("Имя пользователя занято");
        });
    }
  };

  const isPasswordsMatch = () => {
    return password === confirmPassword;
  };

  useEffect(() => {
    if (passwordError && isPasswordsMatch()) {
      setPasswordError("");
    }
  }, [password, confirmPassword]);

  return (
    <div className="register-wrapper">
      <div className="register">
        <Typography variant="h4" component="h2">
          Регистрация
        </Typography>
        <TextField
          error={!!usernameError}
          label="Имя пользователя"
          variant="outlined"
          value={username}
          onChange={(e) => {
            setUsernameInput(e.target.value);
            setUsernameError("");
          }}
          helperText={usernameError}
        />
        <FormControl variant="outlined">
          <InputLabel htmlFor="password">Пароль</InputLabel>
          <OutlinedInput
            error={!!passwordError}
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPasswordInput(e.target.value);
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
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
          <InputLabel htmlFor="confirm-password">Повторите пароль</InputLabel>
          <OutlinedInput
            error={!!passwordError}
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPasswordInput(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Повторите пароль"
          />
        </FormControl>
        <InputLabel error>{passwordError}</InputLabel>
        <FormControlLabel
          control={
            <Checkbox
              checked={isAdminRequest}
              onChange={() => setIsAdminRequest(!isAdminRequest)}
            />
          }
          label="Хочу стать админом"
        />
        <Button
          variant="outlined"
          disabled={!(password && confirmPassword && username)}
          onClick={handleRegister}
        >
          Создать аккаунт
        </Button>
        <Link
          className="register-link"
          underline="hover"
          href={BASEURL + "/login"}
        >
          Уже есть аккаунт
        </Link>
      </div>
    </div>
  );
};
