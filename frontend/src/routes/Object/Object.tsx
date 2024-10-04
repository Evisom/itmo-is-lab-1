// @ts-nocheck
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./../../store/store";
import { setUsername, setToken } from "./../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  AppBar,
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
} from "@mui/material";
import { Header } from "./../../components/Header";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "./Object.scss";

// Mood and WeaponType options
const moods = ["SORROW", "APATHY", "CALM", "FRENZY"];
const weaponTypes = ["SHOTGUN", "RIFLE", "BAT"];

export const ObjectPage = ({ type }) => {
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
  const [editMode, setEditMode] = useState(false || type === "new");

  const [humanBeing, setHumanBeing] = useState({
    name: "",
    coordinatesOption: "create",
    coordinates: { x: "", y: "" },
    coordinatesId: "",
    carOption: "create",
    car: { cool: false },
    carId: "",
    realHero: false,
    hasToothpick: false,
    mood: "CALM",
    impactSpeed: "",
    soundtrackName: "",
    minutesOfWaiting: "",
    weaponType: "SHOTGUN",
  });

  const fetchAdminStatus = () => {
    fetch(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((response) => {
        setIsAdmin(response.roles.includes("ADMIN"));
      })
      .catch(() => {
        console.log("ошибка проверки админа");
      });
  };
  fetchAdminStatus();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHumanBeing((prev) => ({
      ...prev,
      [name]:
        name === "minutesOfWaiting" ||
        name === "impactSpeed" ||
        name.endsWith("Id")
          ? Number(value) // Приведение к числу для ID и числовых полей
          : value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setHumanBeing((prev) => ({ ...prev, [name]: checked }));
  };

  const handleOptionChange = (e, field) => {
    const { value } = e.target;
    setHumanBeing((prev) => ({ ...prev, [field]: value }));
  };

  // Для обновления координат (вложенного объекта)
  const handleCoordinatesChange = (e) => {
    const { name, value } = e.target;
    const numValue = Number(value);
    if (name === "y" && numValue < -927) return; // Ограничение для Y
    setHumanBeing((prev) => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [name]: numValue, // Приведение к числу для координат x и y
      },
    }));
  };

  // Для обновления состояния чекбокса "cool" для автомобиля
  const handleCarCoolChange = (e) => {
    const { checked } = e.target;
    setHumanBeing((prev) => ({
      ...prev,
      car: {
        ...prev.car,
        cool: checked,
      },
    }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    // Полная проверка заполненности формы
    if (
      !humanBeing.name ||
      !humanBeing.coordinates.x ||
      !humanBeing.coordinates.y ||
      !humanBeing.minutesOfWaiting ||
      !humanBeing.soundtrackName ||
      humanBeing.impactSpeed > 154
    ) {
      alert("Пожалуйста, заполните все поля правильно");
      return;
    }

    console.log(JSON.stringify(humanBeing));

    fetch(`/humanbeings?userId=${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(humanBeing),
    }).then((response) => {
      if (response.status === 200) {
        console.log("добавлен");
        navigate("/");
      }
    });
  };

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
      <Container maxWidth="xxl">
        <div className="object-controls">
          <Typography variant="h4">Создать нового HumanBeing</Typography>
        </div>
        <div className="object">
          <div className="object-form">
            <form onSubmit={handleCreate}>
              <FormGroup>
                <TextField
                  label="Имя"
                  name="name"
                  value={humanBeing.name}
                  onChange={handleInputChange}
                  disabled={type === "view"}
                  required
                />

                {/* Coordinates */}
                <FormControl>
                  <InputLabel>Координаты</InputLabel>
                  <Select
                    name="coordinatesOption"
                    value={humanBeing.coordinatesOption}
                    onChange={(e) => handleOptionChange(e, "coordinatesOption")}
                    disabled={type === "view"}
                    label="Координаты"
                  >
                    <MenuItem value="create">Создать новые</MenuItem>
                    <MenuItem value="existing">
                      Использовать существующие
                    </MenuItem>
                  </Select>
                </FormControl>
                {humanBeing.coordinatesOption === "create" ? (
                  <>
                    <TextField
                      label="X Координата"
                      name="x"
                      type="number"
                      value={humanBeing.coordinates.x}
                      onChange={handleCoordinatesChange}
                      disabled={type === "view"}
                      required
                    />
                    <TextField
                      label="Y Координата"
                      name="y"
                      type="number"
                      value={humanBeing.coordinates.y}
                      onChange={handleCoordinatesChange}
                      disabled={type === "view"}
                      required
                      inputProps={{ min: -927 }}
                    />
                  </>
                ) : (
                  <TextField
                    label="ID Координаты"
                    name="coordinatesId"
                    value={humanBeing.coordinatesId}
                    onChange={handleInputChange}
                    disabled={type === "view"}
                    required
                  />
                )}

                {/* Car */}
                <FormControl>
                  <InputLabel>Машина</InputLabel>
                  <Select
                    name="carOption"
                    value={humanBeing.carOption}
                    onChange={(e) => handleOptionChange(e, "carOption")}
                    disabled={type === "view"}
                    label="Машина"
                  >
                    <MenuItem value="create">Создать новую</MenuItem>
                    <MenuItem value="existing">
                      Использовать существующую
                    </MenuItem>
                  </Select>
                </FormControl>
                {humanBeing.carOption === "create" ? (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={humanBeing.car.cool}
                        onChange={handleCarCoolChange}
                        name="carCool"
                        disabled={type === "view"}
                      />
                    }
                    label="Крутая машина"
                  />
                ) : (
                  <TextField
                    label="ID Машины"
                    name="carId"
                    value={humanBeing.carId}
                    onChange={handleInputChange}
                    disabled={type === "view"}
                    required
                  />
                )}

                <TextField
                  label="Скорость"
                  name="impactSpeed"
                  type="number"
                  value={humanBeing.impactSpeed}
                  onChange={handleInputChange}
                  disabled={type === "view"}
                  required
                  inputProps={{ max: 154 }}
                />
                <TextField
                  label="Название саундтрека"
                  name="soundtrackName"
                  value={humanBeing.soundtrackName}
                  onChange={handleInputChange}
                  disabled={type === "view"}
                  required
                />
                <TextField
                  label="Минуты ожидания"
                  name="minutesOfWaiting"
                  type="number"
                  value={humanBeing.minutesOfWaiting}
                  onChange={handleInputChange}
                  disabled={type === "view"}
                  required
                />

                <FormControl>
                  <InputLabel>Настроение</InputLabel>
                  <Select
                    name="mood"
                    value={humanBeing.mood}
                    onChange={handleInputChange}
                    disabled={type === "view"}
                    label="Настроение"
                  >
                    {moods.map((mood) => (
                      <MenuItem key={mood} value={mood}>
                        {mood}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <InputLabel>Тип оружия</InputLabel>
                  <Select
                    name="weaponType"
                    value={humanBeing.weaponType}
                    onChange={handleInputChange}
                    disabled={type === "view"}
                    label={"Тип оружия"}
                  >
                    {weaponTypes.map((weapon) => (
                      <MenuItem key={weapon} value={weapon}>
                        {weapon}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {type === "new" && (
                  <Button variant="outlined" color="primary" type="submit">
                    Создать
                  </Button>
                )}
              </FormGroup>
            </form>
          </div>
          <div className="object-visual"></div>
        </div>
      </Container>
    </div>
  );
};
