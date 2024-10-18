// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./../../store/store";
import { setToken } from "./../../store/userSlice";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
import { BASEURL } from "../..";

export const Operations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username =
    useSelector((state: RootState) => state.user.username) ||
    localStorage.getItem("username");
  const token =
    useSelector((state: RootState) => state.user.token) ||
    localStorage.getItem("token");

  const userId = Number(
    useSelector((state: RootState) => state.user.id) ||
      localStorage.getItem("id")
  );

  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin"));
  const [soundtrackName, setSoundtrackName] = useState("");
  const [soundtrackNameCount, setSoundtrackNameCount] = useState("результат");
  const [weaponType, setWeaponType] = useState("");
  const [weaponTypeCount, setWeaponTypeCount] = useState("результат");
  const [soundtrackNameList, setSoundtrackNameList] = useState([]);
  const [limboList, setLimboList] = useState();

  // Fetch admin status
  const fetchAdminStatus = () => {
    fetch(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((response) => {
        setIsAdmin(response.roles.includes("ADMIN"));
        if (!response.roles.includes("ADMIN")) {
          navigate(BASEURL + "/");
        }
      })
      .catch(() => {
        console.log("Ошибка проверки админа");
      });
  };

  useEffect(() => {
    fetchAdminStatus();
  }, [userId, token]);

  return (
    <div>
      <Header
        isAdmin={isAdmin}
        username={username}
        onLogout={() => {
          localStorage.clear();
          dispatch(setToken(""));
          navigate(BASEURL + "/");
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
        {/* Soundtrack Name Count */}
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
                value={soundtrackName}
                onChange={(e) => setSoundtrackName(e.target.value)}
                label="soundTrackName"
                size="small"
              />
              <Button
                onClick={() => {
                  fetch(
                    `/humanbeings/count/soundtrackName?soundtrackName=${soundtrackName}`,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  )
                    .then((response) => response.text())
                    .then((response) => {
                      setSoundtrackNameCount(response);
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
                {soundtrackNameCount}
              </Paper>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Weapon Type Count */}
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
                value={weaponType}
                onChange={(e) => setWeaponType(e.target.value)}
                size="small"
              />
              <Button
                onClick={() => {
                  fetch(
                    `/humanbeings/count/weaponType?weaponType=${weaponType}`,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  )
                    .then((response) => response.text())
                    .then((response) => {
                      setWeaponTypeCount(response);
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
                {weaponTypeCount}
              </Paper>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Soundtrack Name List */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            Вернуть массив объектов, значение поля soundtrackName которых больше
            заданного.
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction={"row"} spacing={2}>
              <TextField
                value={soundtrackName}
                onChange={(e) => setSoundtrackName(e.target.value)}
                label="soundTrackName"
                size="small"
              />
              <Button
                onClick={() => {
                  fetch(
                    `/humanbeings/soundtrackName?soundtrackName=${soundtrackName}`,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  )
                    .then((response) => response.json())
                    .then((response) => {
                      setSoundtrackNameList(response);
                    })
                    .catch((error) => console.log(error));
                }}
                variant="outlined"
              >
                запустить
              </Button>
            </Stack>
            {soundtrackNameList.length > 0 && (
              <TableContainer component={Paper} style={{ marginTop: 24 }}>
                <Table
                  sx={{ minWidth: 650 }}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell align="right">Имя</TableCell>
                      <TableCell align="right">Саундтрек</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {soundtrackNameList.map((row) => (
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

        {/* Delete heroes without toothpicks */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4-content"
            id="panel4-header"
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

        {/* Update heroes without cars */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel5-content"
            id="panel5-header"
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
