// @ts-nocheck
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { setToken } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Button,
  Container,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Header } from "../../components/Header";
import useSWR from "swr";
import { BASEURL } from "../..";
import "./Coordinates.css";

const fetcher = (url: string, token: string) =>
  fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((res) =>
    res.json()
  );

export const Coordinates = () => {
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

  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [editData, setEditData] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // SWR for fetching admin status
  const { data: adminData } = useSWR(`/users/${id}`, (url) =>
    fetcher(url, token)
  );

  // SWR for fetching coordinates
  const { data: coordinates, mutate: mutateCoordinates } = useSWR(
    "/coordinates",
    (url) => fetcher(url, token),
    { revalidateOnFocus: false }
  );

  if (!adminData?.roles.includes("ADMIN")) {
    navigate(BASEURL + "/");
  }

  const handleXChange = (event) => {
    setX(event.target.value);
  };

  const handleYChange = (event) => {
    setY(event.target.value);
  };

  const handleCreateCoordinates = async () => {
    const newCoordinates = { x: parseFloat(x), y: parseFloat(y) };

    await fetch("/coordinates", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCoordinates),
    });
    setX("");
    setY("");
    mutateCoordinates(); // Refresh the coordinates list
  };

  const handleOpenEditDialog = (row) => {
    setEditData(row);
    setIsEditOpen(true);
  };

  const handleEditXChange = (event) => {
    setEditData((prev) => ({ ...prev, x: event.target.value }));
  };

  const handleEditYChange = (event) => {
    setEditData((prev) => ({ ...prev, y: event.target.value }));
  };

  const handleSaveEdit = async () => {
    const updatedCoordinates = {
      id: editData.id,
      x: parseFloat(editData.x),
      y: parseFloat(editData.y),
    };

    await fetch(`/coordinates/${editData.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCoordinates),
    });
    setIsEditOpen(false);
    mutateCoordinates(); // Refresh the table after editing
  };

  const handleDeleteCoordinates = async (id) => {
    const response = await fetch(`/coordinates/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status !== 204) {
      alert("Объект не может быть удален так как с ним связаны другие объекты");
    } else {
      mutateCoordinates(); // Update the table after deletion
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "x", headerName: "X", flex: 1 },
    { field: "y", headerName: "Y", flex: 1 },
    {
      field: "actions",
      headerName: "Действия",
      flex: 0.25,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleOpenEditDialog(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteCoordinates(params.row.id)}>
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
      <Container maxWidth="xxl" className="coordinates-container">
        <div className="coordinates-form">
          <TextField
            label="X Координата"
            value={x}
            onChange={handleXChange}
            type="number"
            required
            size="small"
          />
          <TextField
            label="Y Координата"
            value={y}
            onChange={handleYChange}
            type="number"
            size="small"
            required
            inputProps={{ min: -926 }}
          />
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleCreateCoordinates}
          >
            Создать
          </Button>
        </div>

        <div className="coordinates-table">
          <DataGrid
            rows={coordinates || []}
            columns={columns}
            getRowId={(row) => row.id}
          />
        </div>

        <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)}>
          <DialogTitle>Редактировать координаты</DialogTitle>
          <DialogContent>
            <TextField
              label="X Координата"
              value={editData?.x || ""}
              onChange={handleEditXChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Y Координата"
              value={editData?.y || ""}
              onChange={handleEditYChange}
              type="number"
              fullWidth
              margin="normal"
              inputProps={{ min: -926 }}
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
