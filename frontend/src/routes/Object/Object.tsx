// @ts-nocheck
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./../../store/store";
import { setUsername, setToken } from "./../../store/userSlice";
import { useNavigate, useParams } from "react-router-dom";
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
} from "@mui/material";
import { Header } from "./../../components/Header";
import "./Object.scss";

// Mood and WeaponType options
const moods = ["SORROW", "APATHY", "CALM", "FRENZY"];
const weaponTypes = ["SHOTGUN", "RIFLE", "BAT"];

export const ObjectPage = ({ type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { objectId } = useParams();

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
  const [editMode, setEditMode] = useState(type !== "view");

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

  // Функция для загрузки статуса администратора
  useEffect(() => {
    const fetchAdminStatus = () => {
      fetch(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((response) => {
          setIsAdmin(response.roles.includes("ADMIN"));
        })
        .catch(() => {
          console.log("Ошибка проверки админа");
        });
    };

    fetchAdminStatus();
  }, [id, token]);

  // Функция для загрузки данных объекта с сервера
  useEffect(() => {
    if (objectId && type !== "new") {
      fetch(`/humanbeings/${objectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          setHumanBeing({
            name: data.name,
            coordinatesOption: "existing",
            coordinates: { x: data.coordinates.x, y: data.coordinates.y },
            coordinatesId: data.coordinates.id,
            carOption: "existing",
            car: { cool: data.car.cool },
            carId: data.car.id,
            realHero: data.realHero,
            hasToothpick: data.hasToothpick,
            mood: data.mood,
            impactSpeed: data.impactSpeed,
            soundtrackName: data.soundtrackName,
            minutesOfWaiting: data.minutesOfWaiting,
            weaponType: data.weaponType,
          });
        })
        .catch(() => {
          console.log("Ошибка загрузки данных объекта");
        });
    }
  }, [objectId, token, type]);

  const handleInputChange = useCallback((e) => {
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
  }, []);

  const handleCheckboxChange = useCallback((e) => {
    const { name, checked } = e.target;
    setHumanBeing((prev) => ({ ...prev, [name]: checked }));
  }, []);

  const handleOptionChange = useCallback((e, field) => {
    const { value } = e.target;
    setHumanBeing((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleCoordinatesChange = useCallback((e) => {
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
  }, []);

  const handleCarCoolChange = useCallback((e) => {
    const { checked } = e.target;
    setHumanBeing((prev) => ({
      ...prev,
      car: {
        ...prev.car,
        cool: checked,
      },
    }));
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    if (
      !humanBeing.name ||
      !(
        (humanBeing.coordinates.x && humanBeing.coordinates.y) ||
        humanBeing.coordinatesId
      ) ||
      !humanBeing.minutesOfWaiting ||
      !humanBeing.soundtrackName ||
      humanBeing.impactSpeed > 154
    ) {
      alert("Пожалуйста, заполните все поля правильно");
      return;
    }

    const bodyObject = { ...humanBeing };
    if (humanBeing.carId) {
      bodyObject.car.id = humanBeing.carId;
    }
    if (humanBeing.coordinatesId) {
      bodyObject.coordinates.id = humanBeing.coordinatesId;
    }

    const method = type === "new" ? "POST" : "PUT";
    const url =
      type === "new" ? `/humanbeings?userId=${id}` : `/humanbeings/${objectId}`;

    fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyObject),
    }).then((response) => {
      if (response.status === 200) {
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
          <Typography variant="h4">HumanBeing</Typography>
          {type !== "new" && (
            <div>
              <Button
                variant="outlined"
                disabled={!(id === objectId || isAdmin)}
                onClick={() => {
                  setEditMode(!editMode);
                }}
              >
                {editMode ? "выключить редактирование" : "редактировать"}
              </Button>
              <Button
                variant="outlined"
                disabled={!(id === objectId || isAdmin)}
                onClick={() => {
                  fetch(`/humanbeings/${objectId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  })
                    .then((response) => {
                      if (response.status !== 204) {
                        alert(
                          "Объект не может быть удален так как с ним связаны другие объекты"
                        );
                      }
                    })
                    .then(() => {
                      navigate("/");
                    });
                }}
              >
                удалить
              </Button>
            </div>
          )}
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
                  disabled={!editMode}
                  required
                />

                {/* Coordinates */}
                <FormControl>
                  <InputLabel>Координаты</InputLabel>
                  <Select
                    name="coordinatesOption"
                    value={humanBeing.coordinatesOption}
                    onChange={(e) => handleOptionChange(e, "coordinatesOption")}
                    disabled={!editMode}
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
                      disabled={!editMode}
                      required
                    />
                    <TextField
                      label="Y Координата"
                      name="y"
                      type="number"
                      value={humanBeing.coordinates.y}
                      onChange={handleCoordinatesChange}
                      disabled={!editMode}
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
                    disabled={!editMode}
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
                    disabled={!editMode}
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
                        disabled={!editMode}
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
                    disabled={!editMode}
                    required
                  />
                )}

                <TextField
                  label="Скорость"
                  name="impactSpeed"
                  type="number"
                  value={humanBeing.impactSpeed}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  required
                  inputProps={{ max: 154 }}
                />
                <TextField
                  label="Название саундтрека"
                  name="soundtrackName"
                  value={humanBeing.soundtrackName}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  required
                />
                <TextField
                  label="Минуты ожидания"
                  name="minutesOfWaiting"
                  type="number"
                  value={humanBeing.minutesOfWaiting}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  required
                />

                <FormControl>
                  <InputLabel>Настроение</InputLabel>
                  <Select
                    name="mood"
                    value={humanBeing.mood}
                    onChange={handleInputChange}
                    disabled={!editMode}
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
                    disabled={!editMode}
                    label={"Тип оружия"}
                  >
                    {weaponTypes.map((weapon) => (
                      <MenuItem key={weapon} value={weapon}>
                        {weapon}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Чекбоксы Real Hero и Toothpick */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={humanBeing.realHero}
                      onChange={handleCheckboxChange}
                      name="realHero"
                      disabled={!editMode}
                    />
                  }
                  label="Real Hero"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={humanBeing.hasToothpick}
                      onChange={handleCheckboxChange}
                      name="hasToothpick"
                      disabled={!editMode}
                    />
                  }
                  label="Есть зубочистка"
                />

                {type === "new" && (
                  <Button variant="outlined" color="primary" type="submit">
                    Создать
                  </Button>
                )}
                {type !== "new" && editMode && (
                  <Button variant="outlined" color="primary" type="submit">
                    Сохранить
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
