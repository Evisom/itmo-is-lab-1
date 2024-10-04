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
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Header } from "./../../components/Header";

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

  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin"));
  const [cars, setCars] = useState([]);
  const [cool, setCool] = useState(false);
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

  // Fetch cars
  const fetchCars = () => {
    fetch("/cars", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setCars(data))
      .catch(() => {
        console.log("Ошибка загрузки машин");
      });
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Handle input changes for creating new car
  const handleCoolChange = (event) => {
    setCool(event.target.checked);
  };

  // Handle create car
  const handleCreateCar = () => {
    const newCar = {
      cool: cool,
    };

    fetch("/cars", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCar),
    })
      .then((response) => response.json())
      .then(() => {
        setCool(false);
        fetchCars(); // Update the table after creating new car
      })
      .catch(() => {
        console.log("Ошибка создания машины");
      });
  };

  // Handle edit dialog opening
  const handleOpenEditDialog = (row) => {
    setEditData(row); // Set data for editing
    setIsEditOpen(true); // Open the dialog
  };

  // Handle edit input changes
  const handleEditCoolChange = (event) => {
    setEditData((prev) => ({ ...prev, cool: event.target.checked }));
  };

  // Handle saving edited car
  const handleSaveEdit = () => {
    const updatedCar = {
      id: editData.id,
      cool: editData.cool,
    };

    fetch(`/cars/${editData.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCar),
    })
      .then(() => {
        setIsEditOpen(false); // Close the dialog
        fetchCars(); // Refresh the table
      })
      .catch(() => {
        console.log("Ошибка обновления машины");
      });
  };

  // Handle delete car
  const handleDeleteCar = (id) => {
    fetch(`/cars/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (response.status !== 204) {
          alert(
            "Объект не может быть удален так как с ним связаны другие объекты"
          );
        }
        fetchCars(); // Update the table after deletion
      })
      .catch(() => {
        alert(
          "Объект не может быть удален так как с ним связаны другие объекты"
        );
      });
  };

  // Define columns for the DataGrid
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
        isAdmin={isAdmin}
        username={username}
        onLogout={() => {
          localStorage.clear();
          dispatch(setToken(""));
          navigate("/");
        }}
      />
      <Container maxWidth="xxl" style={{ marginTop: 24 }}>
        {/* Form for creating car */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <FormControlLabel
            control={<Checkbox checked={cool} onChange={handleCoolChange} />}
            label="Крутая машина?"
          />
          <Button variant="outlined" color="primary" onClick={handleCreateCar}>
            Создать
          </Button>
        </div>

        {/* Table with cars */}
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid rows={cars} columns={columns} getRowId={(row) => row.id} />
        </div>

        {/* Dialog for editing car */}
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
