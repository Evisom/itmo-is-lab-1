// @ts-nocheck
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store/store";
import { setUsername, setToken } from "./store/userSlice";
import "./App.scss";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  AppBar,
  Button,
  Checkbox,
  Container,
  Icon,
  Menu,
  MenuItem,
  Paper,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
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

  const [isAdmin, setIsAdmin] = useState(false);

  const [tableData, setTableData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const fetchData = useCallback(() => {
    fetch("/humanbeings", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.json())
      .then((response) => {
        setTableData((prevData) => {
          if (JSON.stringify(prevData) !== JSON.stringify(response)) {
            return response;
          }
          return prevData; // No change
        });
      })
      .catch(() => {
        console.log("Ошибка загрузки таблицы");
      });
  }, []);
  fetchData();
  useEffect(() => {
    const interval = setInterval(fetchData, 3000); // Update every 3 seconds
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [fetchData]);

  useEffect(() => {
    const lsToken = localStorage.getItem("token");
    const lsUsername = localStorage.getItem("username");
    if (!(token || lsToken)) {
      navigate("/login");
    }
    if (lsToken && !token) {
      dispatch(setToken(lsToken + ""));
      dispatch(setUsername(lsUsername + ""));
    }
  }, [token, navigate]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleDeleteHuman = (id) => {
    fetch(`/humanbeings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
    console.log(id);
  };

  const filteredData = tableData.filter((row) => {
    return Object.values(row)
      .flatMap((val) => (typeof val === "object" ? Object.values(val) : val))
      .some((field) => field.toString().toLowerCase().includes(searchQuery));
  });

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Имя", width: 150 },
    {
      field: "coordinates",
      headerName: "Координаты",
      renderCell: (params) =>
        `X: ${params.row.coordinates.x}, Y: ${params.row.coordinates.y}`,
      width: 180,
    },
    { field: "creationDate", headerName: "Дата создания", width: 180 },
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
      width: 120,
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

      width: 120,
    },
    {
      field: "car",
      headerName: "Машина",
      renderCell: (params) =>
        `id: ${params.row.car.id}, ${
          params.row.car.cool ? "cool" : "not cool"
        }`,
      width: 180,
    },
    { field: "mood", headerName: "Настроение", width: 120 },
    { field: "impactSpeed", headerName: "Скорость", width: 150 },
    { field: "soundtrackName", headerName: "Саундтрек", width: 180 },
    { field: "minutesOfWaiting", headerName: "Минуты ожидания", width: 150 },
    { field: "weaponType", headerName: "Оружие", width: 150 },
    {
      field: "actions",
      headerName: "Действия",
      width: 150,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              height: "100%",
            }}
          >
            {Number(params.row.userId) === id ? (
              <>
                <DeleteIcon
                  onClick={() => {
                    handleDeleteHuman(params.row.id);
                  }}
                />
                <EditIcon />
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
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
      <Container>
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
