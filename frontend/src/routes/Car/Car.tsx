// @ts-nocheck
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { setUsername, setToken } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Button,
  Container,
  TextField,
  IconButton,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Header } from "../../components/Header";
import useSWR from "swr";
import { BASEURL } from "../..";
import "./Car.css";

const fetcher = (url: string, token: string) =>
  fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((res) =>
    res.json()
  );

export const Car = () => {
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

  const [cool, setCool] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // SWR for admin status
  const { data: adminData } = useSWR(`/users/${id}`, (url) =>
    fetcher(url, token)
  );

  // SWR for fetching cars
  const { data: cars, mutate: mutateCars } = useSWR(
    "/cars",
    (url) => fetcher(url, token),
    { revalidateOnFocus: false }
  );

  const handleCoolChange = (event) => {
    setCool(event.target.checked);
  };

  const handleCreateCar = async () => {
    const newCar = { cool: cool };

    await fetch("/cars", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCar),
    });
    setCool(false);
    mutateCars(); // Refresh the cars after creating a new one
  };

  const handleOpenEditDialog = (row) => {
    setEditData(row);
    setIsEditOpen(true);
  };

  const handleEditCoolChange = (event) => {
    setEditData((prev) => ({ ...prev, cool: event.target.checked }));
  };

  const handleSaveEdit = async () => {
    const updatedCar = { id: editData.id, cool: editData.cool };

    await fetch(`/cars/${editData.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCar),
    });
    setIsEditOpen(false);
    mutateCars(); // Refresh the cars after editing
  };

  const handleDeleteCar = async (id) => {
    const response = await fetch(`/cars/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status !== 204) {
      alert("Объект не может быть удален так как с ним связаны другие объекты");
    } else {
      mutateCars(); // Update the table after deletion
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "cool",
      headerName: "Крутая машина",
      flex: 1,
      renderCell: (params) => (params.row.cool ? "Да" : "Нет"),
    },
    {
      field: "actions",
      headerName: "Действия",
      flex: 0.25,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleOpenEditDialog(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteCar(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header
        isAdmin={adminData?.roles.includes("ADMIN")}
        username={username}
        onLogout={() => {
          localStorage.clear();
          dispatch(setToken(""));
          navigate(BASEURL + "/");
        }}
      />
      <Container maxWidth="xxl" className="car-container">
        <div className="car-form">
          <FormControlLabel
            control={<Checkbox checked={cool} onChange={handleCoolChange} />}
            label="Крутая машина?"
          />
          <Button variant="outlined" color="primary" onClick={handleCreateCar}>
            Создать
          </Button>
        </div>

        <div className="car-table">
          <DataGrid
            rows={cars || []}
            columns={columns}
            getRowId={(row) => row.id}
          />
        </div>

        <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)}>
          <DialogTitle>Редактировать машину</DialogTitle>
          <DialogContent>
            <FormControlLabel
              control={
                <Checkbox
                  checked={editData?.cool || false}
                  onChange={handleEditCoolChange}
                />
              }
              label="Крутая машина?"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditOpen(false)} color="secondary">
              Отмена
            </Button>
            <Button onClick={handleSaveEdit} color="primary">
              Сохранить
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};
