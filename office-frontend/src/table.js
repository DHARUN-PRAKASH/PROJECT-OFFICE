import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { Tooltip, Typography } from '@mui/material';
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
import { Box, FormControl, Autocomplete, TextField, Button, CardContent } from "@mui/material";
import axios from 'axios';
import Dash from "./dash.js";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { callTable } from "./axios.js"; // Import functions from axios.js
import jsPDF from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';
import 'pdfjs-dist/build/pdf.worker';


import { Pagination } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PreviewRoundedIcon from '@mui/icons-material/PreviewRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';








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

export default function Ftable() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [filterParams, setFilterParams] = useState({
    dd: "",
    vehiclesOptions: "",
    headCategory: "",
    subCategory: "",
    amount: "",
    financialYear: "",
    month: "",
    employeeId: "", // Initialize employeeId here
    particulars: "",
    date: "",
  });

  


  // Emp id

  const [emp_id, setEmp_id] = useState([]);
  useEffect(() => {
    // Fetch employee IDs from the backend
    axios.get('http://localhost:1234/getemployee_filter')
      .then(response => {
        setEmp_id(response.data);
      })
      .catch(error => {
        console.error('Error fetching emp_id categories:', error);
      });
  }, []);

  // 
  // MONTH

  const [monthOptions, setMonthOptions] = useState([]);

  useEffect(() => {
    // Fetch available months
    axios.get(`http://localhost:1234/getmonth_filter`)
      .then(response => {
        setMonthOptions(response.data);
      })
      .catch(error => {
        console.error('Error fetching months:', error);
      });
  },);

  const [selectedMonth, setSelectedMonth] = useState(null);

  // 
  // particulars

  const [particulars, setParticulars] = useState([]);
  useEffect(() => {
    // Fetch head categories from the backend
    axios.get('http://localhost:1234/getparticulars_form')
      .then(response => {
        setParticulars(response.data);
      })
      .catch(error => {
        console.error('Error fetching particulars categories:', error);
      });
  }, []);


  //amount
  // Year

  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    // Fetch vehicle options from the backend
    axios.get('http://localhost:1234/getyear_filter')
      .then(response => {
        setYearOptions(response.data);
      })
      .catch(error => {
        console.error('Error fetching vehicle options:', error);
      });
  }, []);


  ////
  const [amount, setAmount] = useState([]);
  useEffect(() => {
    // Fetch head categories from the backend
    axios.get('http://localhost:1234/getamount_form')
      .then(response => {
        setAmount(response.data);
      })
      .catch(error => {
        console.error('Error fetching amount categories:', error);
      });
  }, []);


  //amount
  const [subCategories, setSubCategories] = useState([]);
  useEffect(() => {
    // Fetch head categories from the backend
    axios.get('http://localhost:1234/getsub_cat_filter')
      .then(response => {
        setSubCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching sub categories:', error);
      });
  }, []);

  const [headCategories, setHeadCategories] = useState([]); useEffect(() => {
    // Fetch head categories from the backend
    axios.get('http://localhost:1234/gethead_cat_filter')
      .then(response => {
        setHeadCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching head categories:', error);
      });
  }, []);

  ///head cat

  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // Fetch head categories from the backend
    axios.get('http://localhost:1234/getvehicle_filter')
      .then(response => {
        setVehicles(response.data);
      })
      .catch(error => {
        console.error('Error fetching Vehicle:', error);
      });
  }, []);

  //vehcile fetch 

  const [isLoading, setIsLoading] = useState(false); // State for amount filter
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true); // Set loading state to true before fetching data
    try {
      const res = await callTable();
      setData(res.message);
      setOriginalData(res.message);
      console.log("Data sent to backend:", res);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetching data (whether successful or not)
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    if (isNaN(date.getTime())) {
      return null;
    }
    // Format date to yyyy/mm/dd
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const handleClear = () => {
    setFilterParams({
      dd: "",
      vehiclesOptions: "",
      headCategory: "",
      subCategory: "",
      amount: "",
      financialYear: "",
      month: "",
      employeeId: "",
      particulars: "",
      date: "",
    });
    setData(originalData);
  };

  const handleSearch = async () => {
    setIsLoading(true); // Set loading state to true before searching
    try {
      const formattedDate = formatDate(filterParams.date);
      const response = await axios.get("http://localhost:1234/table", {
        params: { ...filterParams, date: formattedDate },
      });
      console.log("Filtered data:", response.data);
      
      // Filter data based on employee ID
      const filteredData = response.data.data.filter(row => row.received_by === filterParams.employeeId);
      setData(filteredData);
      console.log("Filter Params:", filterParams);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      setData([]); // Set data to empty array in case of error
    } finally {
      setIsLoading(false); // Set loading state to false after searching
    }
  };
  


  const generatePDF = async (rowData) => {
    const doc = new jsPDF();
    let yOffset = 10; // Initial Y position for details

    const addDetail = (text) => {
      if (yOffset > 280) { // Check if we've exceeded the page height
        doc.addPage(); // Add a new page
        yOffset = 10; // Reset the Y offset for the new page
      }
      doc.text(10, yOffset, text);
      yOffset += 10; // Increment the Y offset for the next detail
    };


    // Define the table data
    const tableData = [
      ["Vehicle ID", rowData.vehicles],
      ["Date", rowData.selectedDate],
      ["Head Category", rowData.head_cat],
      ["Sub Category", rowData.sub_cat],
      ["Particulars", rowData.particulars],
      ["Amount", rowData.amount],
      ["Financial Year", rowData.fy_year],
      ["Month", rowData.month],
      ["Bill Number", rowData.bill_no],
      ["Departments", rowData.departments],
      ["Emplyee ID", rowData.received_by]
    ];

    // Generate the table
    doc.autoTable({
      startY: yOffset + 5,
      head: [['Field', 'Value']],
      body: tableData,
      theme: 'grid',
      margin: { top: 10 }
    });

    const pdfBlob = doc.output('blob');

    // Create a URL for the blob
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Open the PDF URL in a new browser tab
    window.open(pdfUrl, '_blank');
  };


  const fetchPDF = async (rowData) => {
    try {
      const response = await axios.get(`http://localhost:1234/getPDF/${rowData.id}/${rowData.collectionUUID}`);
      const pdfFiles = response.data.data;

      if (pdfFiles && pdfFiles.length > 0) {
        // Iterate over pdfFiles and open each PDF file in a new tab
        pdfFiles.forEach((file, index) => {
          console.log("PDF File Path:", file.pdfFilepath); // Log the PDF file path

          // Open PDF file in a new tab
          window.open(`http://localhost:1234/pdfs/${encodeURIComponent(file.pdfFileName)}`, '_blank');
        });
      } else {
        console.error('No PDF files found in the response data');
      }
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };

  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const theme = createTheme({
    typography: {
      fontFamily: 'Calibri, Arial, sans-serif',
    },
    overrides: {
      MuiTableCell: {
        root: {
          fontSize: '14px', // Adjust font size as needed
        },
      },
    },
  });


  return (
    <ThemeProvider theme={theme}>
      <div style={{ paddingTop: '100px' }}>
        <Box p={3} style={{ paddingTop: '50px' }}>
          <Dash />
          <Box p={3} bgcolor="background.paper" borderRadius={3} >

            <Typography variant="h4" align="center" sx={{ backgroundColor: '#32348c', color: 'white', borderRadius: '5px' }}><b>Your Report</b></Typography>


            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/consolidate_summary')}
                sx={{
                  height: '5vh',
                  marginTop: '20px',
                  marginRight: '0px' // Add margin to the right
                }}
              >
                <SummarizeRoundedIcon sx={{ marginRight: '5px' }} />
                <b>Consolidate & Summary</b>
              </Button>
            </div>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <>
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                  </Box>

                  <Box>
                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                      <Autocomplete
                        value={vehicles.find(option => option.vehicle_name === filterParams.vehicleId) || null}
                        onChange={(event, value) =>
                          setFilterParams({
                            ...filterParams,
                            vehicleId: value ? value.vehicle_name : '' // Ensure to set vehicleId to '' if value is null
                          })
                        }
                        options={vehicles}
                        getOptionLabel={(option) => option.vehicle_name}
                        renderInput={(params) => (
                          <TextField {...params} label="Vehicle ID" />
                        )}
                      />
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                      <Autocomplete
                        value={headCategories.find(option => option.head_cat_name === filterParams.headCategory) || null}
                        onChange={(event, value) =>
                          setFilterParams({
                            ...filterParams,
                            headCategory: value ? value.head_cat_name : '' // Ensure to set headCategory to '' if value is null
                          })
                        }
                        options={headCategories}
                        getOptionLabel={(option) => option.head_cat_name}
                        renderInput={(params) => (
                          <TextField {...params} label="Head Category" />
                        )}
                      />
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                      <Autocomplete
                        value={subCategories.find(option => option.sub_cat_name === filterParams.subCategory) || null}
                        onChange={(event, value) =>
                          setFilterParams({
                            ...filterParams,
                            subCategory: value ? value.sub_cat_name : '' // Ensure to set subCategory to '' if value is null
                          })
                        }
                        options={subCategories}
                        getOptionLabel={(option) => option.sub_cat_name}
                        renderInput={(params) => (
                          <TextField {...params} label="Sub Category" />
                        )}
                      />
                    </FormControl>

                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                      <Autocomplete
                        value={amount.find(option => option.amount === filterParams.amount) || null}
                        onChange={(event, value) =>
                          setFilterParams({
                            ...filterParams,
                            amount: value ? value.amount : '' // Ensure to set amount to '' if value is null
                          })
                        }
                        options={amount}
                        getOptionLabel={(option) => option.amount}
                        renderInput={(params) => (
                          <TextField {...params} label="Amount" />
                        )}
                      />
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                      <Autocomplete
                        value={filterParams.financialYear}
                        onChange={(event, value) =>
                          setFilterParams({ ...filterParams, financialYear: value })
                        }
                        options={yearOptions}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => <TextField {...params} label="Financial Year" />}
                      />

                    </FormControl>



                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                      <Autocomplete
                        value={filterParams.month}
                        onChange={(event, value) =>
                          setFilterParams({ ...filterParams, month: value })
                        }
                        options={monthOptions}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => <TextField {...params} label="Month" />}
                      />
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                      <Autocomplete
                        value={emp_id.find(option => option.emp_name=== filterParams.employeeId) || null}
                        onChange={(event, value) =>
                          setFilterParams({
                            ...filterParams,
                            employeeId: value ? value.emp_name : '' // Ensure to set employeeId to '' if value is null
                          })
                        }
                        options={emp_id}
                        getOptionLabel={(option) => option.emp_name} // Display emp_name in the options list
                        renderInput={(params) => (
                          <TextField {...params} label="Employee ID" />
                        )}
                      />
                    </FormControl>



                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                      <Autocomplete
                        value={particulars.find(option => option.particulars === filterParams.particulars) || null}
                        onChange={(event, value) =>
                          setFilterParams({
                            ...filterParams,
                            particulars: value ? value.particulars : '' // Ensure to set particulars to '' if value is null
                          })
                        }
                        options={particulars}
                        getOptionLabel={(option) => option.particulars}
                        renderInput={(params) => (
                          <TextField {...params} label="Particulars" />
                        )}
                      />
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <FormControl sx={{ m: 1, minWidth: 200 }}>
                        <DatePicker
                          value={filterParams.date ? new Date(filterParams.date) : null}
                          onChange={(date) =>
                            setFilterParams({
                              ...filterParams,
                              date: formatDate(date) // Format the date before storing it
                            })
                          }
                          renderInput={(params) => <TextField {...params} />}
                          label="Date"
                        />
                      </FormControl>
                    </LocalizationProvider>

                    <Tooltip title="Search">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                        sx={{ marginTop: '15px' }}
                      >
                        <SearchIcon />

                      </Button>
                    </Tooltip>
                    <Tooltip title="Clear">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleClear}
                        sx={{ marginTop: '15px', marginLeft: '5px' }}
                      >
                        <HighlightOffIcon />

                      </Button>
                    </Tooltip>
                  </Box>
                </CardContent>
              </>

            </Box>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell><b>S.No</b></StyledTableCell>
                    <StyledTableCell><b>VEHICLE ID</b></StyledTableCell>
                    <StyledTableCell><b>DATE</b></StyledTableCell>
                    <StyledTableCell><b>HEAD CATEGORY</b></StyledTableCell>
                    <StyledTableCell><b>SUB CATEGORY</b></StyledTableCell>
                    <StyledTableCell><b>PARTICULARS</b></StyledTableCell>
                    <StyledTableCell><b>AMOUNT</b></StyledTableCell>
                    <StyledTableCell><b>GEN PDF</b></StyledTableCell>
                    <StyledTableCell><b>SUB PDF</b></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                  {/* Table Body */}
                  {isLoading ? (
                    <StyledTableRow>
                      <StyledTableCell colSpan={8}>Loading...</StyledTableCell>
                    </StyledTableRow>
                  ) : !Array.isArray(data) || data.length === 0 ? (
                    <StyledTableRow>
                      <StyledTableCell colSpan={8}>
                        No matching data
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    data.slice(indexOfFirstItem, indexOfLastItem).map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{(currentPage - 1) * itemsPerPage + index + 1}</StyledTableCell>
                        <StyledTableCell>{row.vehicles}</StyledTableCell>
                        <StyledTableCell>{row.selectedDate}</StyledTableCell>
                        <StyledTableCell>{row.head_cat}</StyledTableCell>
                        <StyledTableCell>{row.sub_cat}</StyledTableCell>
                        <StyledTableCell>{row.particulars}</StyledTableCell>
                        <StyledTableCell>{row.amount}</StyledTableCell>
                        <StyledTableCell>
                          <IconButton
                            aria-label="view"
                            onClick={() => generatePDF(row)}
                          >
                            <Tooltip title="Preview Details" PopperProps={{ style: { padding: '5px' } }}>

                              <PreviewRoundedIcon /> {/* Replace "View" with PreviewRoundedIcon */}
                            </Tooltip>
                          </IconButton>

                        </StyledTableCell>
                        <StyledTableCell>
                          <IconButton
                            aria-label="view"
                            onClick={() => fetchPDF(row)} // Call fetchPDF function with row data
                          >
                            <Tooltip title="Preview Pdf" PopperProps={{ style: { padding: '5px' } }}>

                              <PictureAsPdfRoundedIcon />
                            </Tooltip>
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Pagination */}
            <Box mt={4} display="flex" justifyContent="center">
              {data.length > itemsPerPage && (
                <Pagination
                  count={Math.ceil(data.length / itemsPerPage)}
                  page={currentPage}
                  onChange={(event, page) => paginate(page)}
                  color="primary"
                  size="large"
                />
              )}
            </Box>
            <Box mt={4} display="flex" justifyContent="center">
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => navigate("/form")}
                style={{ position: "fixed", bottom: "20px", right: "20px", backgroundColor: "#32348c" }}
              >
                <Tooltip title="Add File" PopperProps={{ style: { padding: '5px' } }}>
                  <AddIcon />
                </Tooltip>
              </Fab>
            </Box>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}