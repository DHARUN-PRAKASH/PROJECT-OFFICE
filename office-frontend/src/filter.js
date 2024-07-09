import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import TuneIcon from "@mui/icons-material/Tune";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import Dash from "./dash.js";
import { callTable } from "./axios.js";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#32348c",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const FilterCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#f5f5f5",
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(1),
}));

export default function Fitable() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filterParams, setFilterParams] = useState({
    vehicleId: "",
    headCategory: "",
    subCategory: "",
    amount: "",
    financialYear: "",
    month: "",
    employeeId: "",
    particulars: "",
    date: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await callTable();
      setData(res.message);
      setOriginalData(res.message); // Update originalData state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClear = () => {
    setFilterParams({
      vehicleId: "",
      headCategory: "",
      subCategory: "",
      amount: "",
      financialYear: "",
      month: "",
      employeeId: "",
      particulars: "",
      date: "",
    });
    setData(originalData); // Reset to original data
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:1234/login", {
        params: filterParams,
        auth: {
          username: "root",
          password: "visvak@257",
        },
      });
      console.log("Filtered data:", response.data);
      setData(response.data.data); // Update data state with filtered data
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  return (
    <div style={{ paddingTop: "100px" }}>
      <Dash />
      <div style={{ paddingTop: "50px" }}>
        <FilterCard>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <IconButton
                aria-label="settings"
                style={{ color: "#32348c" }}
                onClick={() => setShowFilter(!showFilter)}
              >
                <TuneIcon />
              </IconButton>
              <h3
                style={{
                  textAlign: "center",
                  width: "100%",
                  color: "#32348c",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="report"
              >
                Your Report
              </h3>
            </Box>
            {showFilter && (
              <Box>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <Autocomplete
                    value={filterParams.vehicleId}
                    onChange={(event, value) =>
                      setFilterParams({ ...filterParams, vehicleId: value })
                    }
                    options={["Vehicle 1"]}
                    renderInput={(params) => (
                      <TextField {...params} label="Vehicle ID" />
                    )}
                  />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <Autocomplete
                    value={filterParams.headCategory}
                    onChange={(event, value) =>
                      setFilterParams({
                        ...filterParams,
                        headCategory: value,
                      })
                    }
                    options={["Category 1", "Category 2"]}
                    renderInput={(params) => (
                      <TextField {...params} label="Head Category" />
                    )}
                  />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <Autocomplete
                    value={filterParams.subCategory}
                    onChange={(event, value) =>
                      setFilterParams({
                        ...filterParams,
                        subCategory: value,
                      })
                    }
                    options={["SubCategory 1", "SubCategory 2"]}
                    renderInput={(params) => (
                      <TextField {...params} label="Sub Category" />
                    )}
                  />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <TextField
                    label="Amount"
                    value={filterParams.amount}
                    onChange={(e) =>
                      setFilterParams({
                        ...filterParams,
                        amount: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <TextField
                    label="Financial Year"
                    value={filterParams.financialYear}
                    onChange={(e) =>
                      setFilterParams({
                        ...filterParams,
                        financialYear: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <TextField
                    label="Month"
                    value={filterParams.month}
                    onChange={(e) =>
                      setFilterParams({
                        ...filterParams,
                        month: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <TextField
                    label="Employee ID"
                    value={filterParams.employeeId}
                    onChange={(e) =>
                      setFilterParams({
                        ...filterParams,
                        employeeId: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <TextField
                    label="Particulars"
                    value={filterParams.particulars}
                    onChange={(e) =>
                      setFilterParams({
                        ...filterParams,
                        particulars: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <TextField
                    label="Date"
                    type="date"
                    value={filterParams.date}
                    onChange={(e) =>
                      setFilterParams({
                        ...filterParams,
                        date: e.target.value,
                      })
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                >
                  Search
                </Button>
                <Button variant="contained" color="error" onClick={handleClear}>
                  Clear
                </Button>
              </Box>
            )}
          </CardContent>
        </FilterCard>
        <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell>S.no</StyledTableCell>
                <StyledTableCell>Vehicle ID</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Head Category</StyledTableCell>
                <StyledTableCell>Sub Category</StyledTableCell>
                <StyledTableCell>Particulars</StyledTableCell>
                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>{" "}
              </TableRow>
            </TableHead>

            <TableBody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{row.s_no}</StyledTableCell>
                    <StyledTableCell>{row.vehicles}</StyledTableCell>
                    <StyledTableCell>{row.selectedDate}</StyledTableCell>
                    <StyledTableCell>{row.head_cat}</StyledTableCell>
                    <StyledTableCell>{row.sub_cat}</StyledTableCell>
                    <StyledTableCell>{row.particulars}</StyledTableCell>
                    <StyledTableCell>{row.amount}</StyledTableCell>
                    <StyledTableCell>
                      {/* This cell for Actions */}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={8}>
                    No data available
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => navigate("/form")}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#32348c",
          }}
        >
          <AddIcon />
        </Fab>
      </div>
    </div>
  );
}