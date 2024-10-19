// @ts-nocheck
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { DataGrid, GridColDef, GridFilterOperator } from "@mui/x-data-grid";
import { Container, IconButton, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import { BASEURL } from ".";
import "./App.scss";

// SWR fetcher function
const fetcher = (url) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  }).then((res) => res.json());

const buildQueryParams = (params) => {
  const query = Object.entries(params)
    .filter(([key, value]) => value !== undefined && value !== "") // Убираем пустые параметры
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  return query ? `?${query}` : "";
};

const equalsOnlyOperator: GridFilterOperator[] = [
  {
    label: "equals",
    value: "equals",
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.value) {
        return null;
      }
      return ({ value }) => value === filterItem.value;
    },
    InputComponent: ({ item, applyValue }) => (
      <TextField
        size="small"
        type="text"
        value={item.value || ""}
        onChange={(e) => applyValue({ ...item, value: e.target.value })}
        placeholder="Equals"
        style={{ width: "100%" }}
      />
    ),
    InputComponentProps: { type: "text" },
  },
];

const App = () => {
  const navigate = useNavigate();
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  const { data: adminData } = useSWR(
    `/users/${localStorage.getItem("id")}`,
    fetcher
  );

  // Функция для корректного формирования фильтров для API на основе модели фильтров DataGrid
  const buildFilterQuery = (items) => {
    const filters = {};
    items.forEach((filterItem) => {
      if (
        filterItem.field &&
        filterItem.value !== undefined &&
        filterItem.value !== ""
      ) {
        filters[filterItem.field] = filterItem.value;
      }
    });
    return filters;
  };

  // Пересобираем URL при изменении фильтров или сортировки
  useEffect(() => {
    const filters = buildFilterQuery(filterModel.items);

    const queryParams = buildQueryParams({
      ...filters, // Добавляем фильтры из каждого столбца
      filterField: sortModel[0]?.field,
      sortOrder: sortModel[0]?.sort,
    });

    setApiUrl(`/humanbeings${queryParams}`);
  }, [filterModel, sortModel]);

  const [apiUrl, setApiUrl] = useState("/humanbeings");

  // SWR для получения данных с бэкенда
  const { data: tableData, mutate } = useSWR(apiUrl, fetcher);

  const handleDeleteHuman = (id) => {
    fetch(`/humanbeings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((response) => {
      if (response.status === 204) {
        mutate(); // Обновляем данные после удаления
      } else {
        alert(
          "Объект не может быть удален так как с ним связаны другие объекты"
        );
      }
    });
  };

  // Определение колонок для таблицы с возможностью сортировки и фильтрации с оператором 'equals'
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      sortable: true,
      filterable: true,
      flex: 1,
      filterOperators: equalsOnlyOperator,
    },
    {
      field: "name",
      headerName: "Имя",
      sortable: true,
      filterable: true,
      flex: 3,
      filterOperators: equalsOnlyOperator,
    },
    {
      field: "coordinatesId",
      headerName: "Координаты",
      flex: 3,
      renderCell: (params) =>
        `id: ${params.row.coordinates.id} X: ${params.row.coordinates.x}, Y: ${params.row.coordinates.y}`,
      filterOperators: equalsOnlyOperator,
    },
    {
      field: "creationDate",
      headerName: "Дата создания",
      sortable: true,
      filterable: true,
      flex: 3,
      filterOperators: equalsOnlyOperator,
    },
    {
      field: "realHero",
      headerName: "Real hero?",
      sortable: true,
      filterable: true,
      flex: 1,
      renderCell: (params) =>
        params.row.realHero ? (
          <CheckIcon className="app-table-icon" />
        ) : (
          <ClearIcon className="app-table-icon" />
        ),
      filterOperators: equalsOnlyOperator,
    },
    {
      field: "hasToothpick",
      headerName: "Зубочистка",
      sortable: true,
      filterable: true,
      flex: 1,
      renderCell: (params) =>
        params.row.hasToothpick ? (
          <CheckIcon className="app-table-icon" />
        ) : (
          <ClearIcon className="app-table-icon" />
        ),
      filterOperators: equalsOnlyOperator,
    },
    {
      field: "carId",
      headerName: "Машина",
      flex: 2,
      renderCell: (params) =>
        `id: ${params.row.car.id}, ${
          params.row.car.cool ? "cool" : "not cool"
        }`,
      filterOperators: equalsOnlyOperator,
    },
    {
      field: "mood",
      headerName: "Настроение",
      sortable: true,
      filterable: true,
      flex: 2,
      filterOperators: equalsOnlyOperator,
    },
    {
      field: "impactSpeed",
      headerName: "Скорость",
      sortable: true,
      filterable: true,
      flex: 1,
      filterOperators: equalsOnlyOperator,
    },
    {
      field: "soundtrackName",
      headerName: "Саундтрек",
      sortable: true,
      filterable: true,
      flex: 2,
      filterOperators: equalsOnlyOperator,
    },
    {
      field: "minutesOfWaiting",
      headerName: "Минуты ожидания",
      sortable: true,
      filterable: true,
      flex: 1,
      filterOperators: equalsOnlyOperator,
    },
    {
      field: "weaponType",
      headerName: "Оружие",
      sortable: true,
      filterable: true,
      flex: 2,
      filterOperators: equalsOnlyOperator,
    },
    {
      field: "actions",
      headerName: "Действия",
      flex: 2,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleDeleteHuman(params.row.id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={() => navigate(BASEURL + `/edit/${params.row.id}`)}
          >
            <EditIcon />
          </IconButton>
        </>
      ),
    },
  ];

  useEffect(() => {
    localStorage.setItem("admin", adminData?.roles.includes("ADMIN"));
  }, [adminData]);

  return (
    <div className="App">
      <Header
        username={localStorage.getItem("username")}
        isAdmin={adminData?.roles.includes("ADMIN")}
        onLogout={() => {
          localStorage.clear();
          navigate(BASEURL + "/");
        }}
      />
      <Container maxWidth="xxl" style={{ marginTop: 24 }}>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={tableData || []}
            columns={columns}
            getRowId={(row) => row.id}
            sortingMode="server" // Включаем серверную сортировку
            sortModel={sortModel}
            onSortModelChange={(model) => setSortModel(model)}
            filterMode="server" // Включаем серверную фильтрацию
            filterModel={filterModel} // Модель фильтрации
            onFilterModelChange={(model) => setFilterModel(model)} // Изменение фильтрации
          />
        </div>
      </Container>
    </div>
  );
};

export default App;
