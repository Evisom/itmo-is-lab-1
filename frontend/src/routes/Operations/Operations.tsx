// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./../../store/store";
import { setUsername, setToken } from "./../../store/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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
  ButtonGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Paper,
  Stack,
  Table,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
} from "@mui/material";
import { Header } from "./../../components/Header";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const Operations = () => {
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
  const [limboList, setLimboList] = useState();

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
  fetchAdminStatus();

  const [action1, setAction1] = useState("");
  const [action1Result, setAction1Result] = useState("результат");
  const [action2, setAction2] = useState("");
  const [action2Result, setAction2Result] = useState("результат");
  const [action3, setAction3] = useState("");
  const [action3Result, setAction3Result] = useState([]);

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
      <Container
        maxWidth="xxl"
        style={{
          marginTop: 24,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Вернуть количество объектов, значение поля soundtrackName которых
            равно заданному.
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction={"row"} spacing={2}>
              <TextField
                value={action1}
                onChange={(e) => {
                  setAction1(e.target.value);
                }}
                label="soundTrackName"
                size="small"
              />
              <Button
                onClick={() => {
                  fetch(
                    `/humanbeings/count/soundtrackName?soundtrackName=${action1}`,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  )
                    .then((response) => response.text())
                    .then((response) => {
                      setAction1Result(response);
                    });
                }}
                variant="outlined"
              >
                запустить
              </Button>
              <Paper
                style={{
                  width: 150,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                elevation={8}
              >
                {action1Result}
              </Paper>
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            Вернуть количество объектов, значение поля weaponType которых больше
            заданного.
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction={"row"} spacing={2}>
              <TextField
                label="weaponType"
                value={action2}
                onChange={(e) => {
                  setAction2(e.target.value);
                }}
                size="small"
              />
              <Button
                onClick={() => {
                  fetch(`/humanbeings/count/weaponType?weaponType=${action2}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  })
                    .then((response) => response.text())
                    .then((response) => {
                      setAction2Result(response);
                    });
                }}
                variant="outlined"
              >
                запустить
              </Button>
              <Paper
                style={{
                  width: 150,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                elevation={8}
              >
                {action2Result}
              </Paper>
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Вернуть массив объектов, значение поля soundtrackName которых больше
            заданного.
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction={"row"} spacing={2}>
              <TextField
                value={action3}
                onChange={(e) => {
                  setAction3(e.target.value);
                }}
                label="soundTrackName"
                size="small"
              />
              <Button
                onClick={() => {
                  fetch(
                    `/humanbeings/soundtrackName?soundtrackName=${action2}`,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  )
                    .then((response) => response.json())
                    .then((response) => {
                      setAction3Result(response);
                    })
                    .catch((error) => console.log(error));
                }}
                variant="outlined"
              >
                запустить
              </Button>
            </Stack>
            {action3Result.length > 0 && (
              <TableContainer component={Paper} style={{ marginTop: 24 }}>
                <Table
                  sx={{ minWidth: 650 }}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Имя</TableCell>
                      <TableCell align="right">Саундтрек</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {action3.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.id}
                        </TableCell>
                        <TableCell align="right">{row.name}</TableCell>
                        <TableCell align="right">
                          {row.soundtrackName}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Удалить всех героев без зубочисток.
          </AccordionSummary>
          <AccordionDetails>
            <Button
              onClick={() => {
                fetch(`/humanbeings/no-toothpicks`, {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                });
              }}
              variant="outlined"
            >
              запустить
            </Button>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Пересадить всех героев, не имеющих автомобиля на красные "Lada
            Kalina".
          </AccordionSummary>
          <AccordionDetails>
            <Button
              onClick={() => {
                fetch(`/humanbeings/update/no-car`, {
                  method: "PUT",
                  headers: { Authorization: `Bearer ${token}` },
                });
              }}
              variant="outlined"
            >
              запустить
            </Button>
          </AccordionDetails>
        </Accordion>
      </Container>
    </div>
  );
};
