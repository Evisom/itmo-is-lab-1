// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { setUsername, setToken } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Header } from "../../components/Header";
import useSWR, { mutate } from "swr";
import { BASEURL } from "../..";
import { MuiFileInput } from "mui-file-input";
import "./Import.scss";

const fetcher = (url: string, token: string) =>
  fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((res) =>
    res.json()
  );

export const Import = () => {
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

  const { data: adminData } = useSWR(`/users/${id}`, (url) =>
    fetcher(url, token)
  );

  const { data: historyData, error: historyError } = useSWR(`/history`, (url) =>
    fetcher(url, token)
  );

  const [users, setUsers] = useState<any>({});
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState(null);

  const rows = historyData
    ?.map((entry: any) => ({
      id: entry.id,
      userId: entry.userId,
      username: entry.login,
      status: entry.status,
      addedObjectsCount: entry.addedObjectsCount,
    }))
    .reverse();

  console.log(historyData);
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "userId",
      headerName: "User ID",
      flex: 1,
      renderCell: (params) => users[params.row.userId],
    },
    {
      field: "username",
      headerName: "User",
      flex: 4,
      renderCell: (params) => users[params.row.username],
    },
    { field: "status", headerName: "Status", flex: 3 },
    {
      field: "addedObjectsCount",
      headerName: "Added Objects",
      flex: 1,

      renderCell: (params) => params.row.addedObjectsCount ?? "N/A",
    },
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (alert) {
      timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [alert]);

  const handleUpload = () => {
    let formData = new FormData();
    formData.append("file", file);
    fetch(`/file/upload?userId=${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => res.text())
      .then((res) => {
        setFile(null);
        setTimeout(() => {
          mutate(`/history`);
        }, 500);

        if (res === "smth went wrong") {
          setAlert({
            text: "Ошибка чтения файла",
            error: true,
          });
        } else if (res === "access denied") {
          setAlert({
            text: "Доступ запрещен",
            error: true,
          });
        } else if (res === "Invalid data") {
          setAlert({
            text: "Некорректные данные",
            error: true,
          });
        } else if (res === "File imported successfully") {
          setAlert({
            text: "Объекты успешно добавлены",
            error: false,
          });
        }

        console.log(res);
      })
      .catch(() => {
        setAlert({
          text: "Ошибка",
          error: true,
        });
      });
  };

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
        <div className="upload-row">
          <MuiFileInput
            value={file}
            onChange={(f) => setFile(f)}
            size="large"
            variant="outlined"
            placeholder="Загрузи файл в формате json"
            InputProps={{
              inputProps: {
                accept: ".json",
              },
              startAdornment: <AttachFileIcon />,
            }}
          />
          <Button
            onClick={handleUpload}
            disabled={!file}
            variant="outlined"
            size="large"
          >
            Загрузить
          </Button>
          <Button
            disabled={!file}
            onClick={() => setFile(null)}
            variant="outlined"
            size="large"
          >
            Очистить
          </Button>
        </div>

        <div className="alert-container">
          {alert?.text && (
            <Alert
              className="alert"
              severity={alert.error ? "error" : "success"}
            >
              {alert.text}
            </Alert>
          )}
        </div>

        <div className="history">
          <div style={{ height: "100%" }}>
            <h3>История операций</h3>
            <DataGrid rows={rows} columns={columns} hideFooter />
          </div>
        </div>
      </Container>
    </div>
  );
};
