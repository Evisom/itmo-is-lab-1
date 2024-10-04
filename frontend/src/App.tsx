// @ts-nocheck
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store/store";
import { setUsername, setToken } from "./store/userSlice";
import "./App.scss";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { Header } from "./components/Header";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const App = () => {
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
  const [tableData, setTableData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  // Функция для получения статуса админа
  const fetchAdminStatus = useCallback(() => {
    fetch(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((response) => {
        setIsAdmin(response.roles.includes("ADMIN"));
        localStorage.setItem("isAdmin", response.roles.includes("ADMIN") + "");
      })
      .catch(() => {
        console.log("Ошибка проверки админа");
      });
  }, [id, token]);

  // Функция для получения данных с сервера
  const fetchData = useCallback(() => {
    fetch("/humanbeings", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((response) => {
        setTableData(Array.isArray(response) ? response : []);
      })
      .catch(() => {
        console.log("Ошибка загрузки таблицы");
      });
  }, [token]);

  useEffect(() => {
    // Один раз при монтировании проверяем статус админа
    fetchAdminStatus();

    // Начальное получение данных
    fetchData();

    // Устанавливаем интервал для обновления данных каждые 2 секунды
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
  }, [fetchAdminStatus, fetchData]);

  useEffect(() => {
    const lsToken = localStorage.getItem("token");
    const lsUsername = localStorage.getItem("username");
    if (!(token || lsToken)) {
      navigate("/login");
    }
    if (lsToken && !token) {
      dispatch(setToken(lsToken));
      dispatch(setUsername(lsUsername));
    }
  }, [token, navigate, dispatch]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleDeleteHuman = (id) => {
    fetch(`/humanbeings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      if (response.status === 204) {
        fetchData(); // Обновляем данные после удаления
      } else {
        alert(
          "Объект не может быть удален так как с ним связаны другие объекты"
        );
      }
    });
  };

  // Фильтрация данных
  const filteredData =
    tableData?.filter((row) => {
      return Object.values(row)
        .flatMap((val) => (typeof val === "object" ? Object.values(val) : val))
        .some((field) => field.toString().toLowerCase().includes(searchQuery));
    }) || [];

  // Определение колонок для таблицы
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      renderCell: (params) => (
        <a style={{ color: "white" }} href={`/view/${params.row.id}`}>
          {params.row.id}
        </a>
      ),
      flex: 1,
    },
    { field: "name", headerName: "Имя", flex: 3 },
    {
      field: "coordinates",
      headerName: "Координаты",
      renderCell: (params) =>
        `id: ${params.row.coordinates.id} X: ${params.row.coordinates.x}, Y: ${params.row.coordinates.y}`,
      flex: 3,
    },
    { field: "creationDate", headerName: "Дата создания", flex: 3 },
    {
      field: "realHero",
      headerName: "Real hero?",
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {params.row.realHero ? <CheckIcon /> : <ClearIcon />}
        </div>
      ),
      flex: 1,
    },
    {
      field: "hasToothpick",
      headerName: "Зубочистка",
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {params.row.hasToothpick ? <CheckIcon /> : <ClearIcon />}
        </div>
      ),
      flex: 1,
    },
    {
      field: "car",
      headerName: "Машина",
      renderCell: (params) =>
        `id: ${params.row.car.id}, ${
          params.row.car.cool ? "cool" : "not cool"
        }`,
      flex: 2,
    },
    { field: "mood", headerName: "Настроение", flex: 2 },
    { field: "impactSpeed", headerName: "Скорость", flex: 1 },
    { field: "soundtrackName", headerName: "Саундтрек", flex: 2 },
    { field: "minutesOfWaiting", headerName: "Минуты ожидания", flex: 1 },
    { field: "weaponType", headerName: "Оружие", flex: 2 },
    {
      field: "actions",
      headerName: "Действия",
      flex: 2,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            height: "100%",
          }}
        >
          {Number(params.row.userId) === id || isAdmin ? (
            <>
              <IconButton onClick={() => handleDeleteHuman(params.row.id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={() => navigate(`/edit/${params.row.id}`)}>
                <EditIcon />
              </IconButton>
            </>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="App">
      <Header
        isAdmin={isAdmin}
        username={username}
        onLogout={() => {
          localStorage.clear();
          dispatch(setToken(""));
          navigate("/");
        }}
      />
      <Container maxWidth="xxl" style={{ marginTop: 24 }}>
        <TextField
          label="Поиск"
          variant="outlined"
          onChange={handleSearch}
          style={{ marginBottom: 20 }}
        />
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={filteredData}
            columns={columns}
            pagination
            pageSizeOptions={[5, 10, 20]}
            rowCount={filteredData.length}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            getRowId={(row) => row.id}
          />
        </div>
      </Container>
    </div>
  );
};

export default App;
