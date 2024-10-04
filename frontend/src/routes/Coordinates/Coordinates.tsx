// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./../../store/store";
import { setUsername, setToken } from "./../../store/userSlice";
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
import { Header } from "./../../components/Header";

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

  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin"));
  const [coordinates, setCoordinates] = useState([]);
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [editData, setEditData] = useState(null); // State for edit mode
  const [isEditOpen, setIsEditOpen] = useState(false); // Dialog open state

  // Fetch admin status
  const fetchAdminStatus = () => {
    fetch(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((response) => {
        setIsAdmin(response.roles.includes("ADMIN"));
        if (!response.roles.includes("ADMIN")) {
          navigate("/");
        }
      })
      .catch(() => {
        console.log("ошибка проверки админа");
      });
  };

  useEffect(() => {
    fetchAdminStatus();
  }, []);

  // Fetch coordinates
  const fetchCoordinates = () => {
    fetch("/coordinates", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setCoordinates(data))
      .catch(() => {
        console.log("Ошибка загрузки координат");
      });
  };

  useEffect(() => {
    fetchCoordinates();
  }, []);

  // Handle input changes for creating new coordinates
  const handleXChange = (event) => {
    setX(event.target.value);
  };

  const handleYChange = (event) => {
    setY(event.target.value);
  };

  // Handle create coordinates
  const handleCreateCoordinates = () => {
    const newCoordinates = {
      x: parseFloat(x),
      y: parseFloat(y),
    };

    fetch("/coordinates", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCoordinates),
    })
      .then((response) => response.json())
      .then(() => {
        setX("");
        setY("");
        fetchCoordinates(); // Update the table after creating new coordinates
      })
      .catch(() => {
        console.log("Ошибка создания координат");
      });
  };

  // Handle edit dialog opening
  const handleOpenEditDialog = (row) => {
    setEditData(row); // Set data for editing
    setIsEditOpen(true); // Open the dialog
  };

  // Handle edit input changes
  const handleEditXChange = (event) => {
    setEditData((prev) => ({ ...prev, x: event.target.value }));
  };

  const handleEditYChange = (event) => {
    setEditData((prev) => ({ ...prev, y: event.target.value }));
  };

  // Handle saving edited coordinates
  const handleSaveEdit = () => {
    const updatedCoordinates = {
      id: editData.id,
      x: parseFloat(editData.x),
      y: parseFloat(editData.y),
    };

    fetch(`/coordinates/${editData.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCoordinates),
    })
      .then(() => {
        setIsEditOpen(false); // Close the dialog
        fetchCoordinates(); // Refresh the table
      })
      .catch(() => {
        console.log("Ошибка обновления координат");
      });
  };

  // Handle delete coordinates
  const handleDeleteCoordinates = (id) => {
    fetch(`/coordinates/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (response.status !== 204) {
          alert(
            "Объект не может быть удален так как с ним связаны другие объекты"
          );
        }
        fetchCoordinates(); // Update the table after deletion
      })
      .catch(() => {
        console.log("Ошибка удаления координат");
      });
  };

  // Define columns for the DataGrid
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
        isAdmin={isAdmin}
        username={username}
        onLogout={() => {
          localStorage.clear();
          dispatch(setToken(""));
          navigate("/");
        }}
      />
      <Container maxWidth="xxl" style={{ marginTop: 24 }}>
        {/* Form for creating coordinates */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
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

        {/* Table with coordinates */}
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={coordinates}
            columns={columns}
            getRowId={(row) => row.id}
          />
        </div>

        {/* Dialog for editing coordinates */}
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
