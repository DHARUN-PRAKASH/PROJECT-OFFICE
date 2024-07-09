import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, TextField, Tooltip } from '@mui/material';
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import logo from './MEC.png';
import { useNavigate } from 'react-router-dom';
import Dash from './dash';
import './bg.css';
import axios from 'axios';
import 'jspdf-autotable';
import jsPDF from 'jspdf';
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Autocomplete from '@mui/material/Autocomplete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


const Form = () => {
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [errors, setErrors] = useState({});
    const [headCategories, setHeadCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedHeadCategory, setSelectedHeadCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [receivedByOptions, setReceivedByOptions] = useState([]);
    const [selectedReceivedBy, setSelectedReceivedBy] = useState(null);

    const [vehicleOptions, setVehicleOptions] = useState([]);

    useEffect(() => {
        // Fetch vehicle options from the backend
        axios.get('http://localhost:1234/getvehicle')
            .then(response => {
                setVehicleOptions(response.data);
            })
            .catch(error => {
                console.error('Error fetching vehicle options:', error);
            });
    }, []);

    const [selectedVehicle, setSelectedVehicle] = useState(null);

    // Define a function to handle changes in the selected vehicle
    const handleVehicleChange = (event, newValue) => {
        setSelectedVehicle(newValue);
    };

    useEffect(() => {
        // Fetch head categories from the backend
        axios.get('http://localhost:1234/gethead_cat')
            .then(response => {
                setHeadCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching head categories:', error);
            });
    }, []);
    useEffect(() => {
        // Fetch received by options from the backend
        axios.get('http://localhost:1234/getreceived_by')
            .then(response => {
                setReceivedByOptions(response.data);

            })
            .catch(error => {
                console.error('Error fetching received by options:', error);
            });
    }, []);

    const handleReceivedByChange = (event, newValue) => {
        setSelectedReceivedBy(newValue);
    };

    const handleHeadCategoryChange = (event, newValue) => {
        setSelectedHeadCategory(newValue);
        console.log(newValue)
        if (newValue) {
            // Fetch subcategories based on selected head category
            axios.get('http://localhost:1234/getsub_cat')
                .then(response => {
                    const filteredSubCategories = response.data.filter(subCat => subCat.head_cat_id === newValue.head_cat_id);
                    setSubCategories(filteredSubCategories);

                })
                .catch(error => {
                    console.error('Error fetching subcategories:', error);
                });
        } else {
            setSubCategories([]);
        }
    };

    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    useEffect(() => {
        // Fetch department options from the backend
        axios.get('http://localhost:1234/getdepartment')
            .then(response => {
                setDepartmentOptions(response.data);
                console.log(JSON.stringify(response.data));
            })
            .catch(error => {
                console.error('Error fetching department options:', error);
            });
    }, []);


    const handleDepartmentChange = (event, newValue) => {
        setSelectedDepartment(newValue);
        console.log(newValue);
        console.log();

    };



    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState("");
    const [formData, setFormData] = useState({
        fy_year: '',
        month: '',
        head_cat: '',
        sub_cat: '',
        departments: [],
        vehicles: [],
        selectedDate: '',
        received_by: [],
        particulars: '',
        bill_no: '',
        amount: '',
        selectedFile: null
    });
    const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
    const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);

    const navigate = useNavigate();
    const headCatId = selectedHeadCategory ? selectedHeadCategory.head_cat_name : null;
    const subCatId = selectedSubCategory ? selectedSubCategory.sub_cat_name : null;
    const dept = selectedDepartment ? JSON.stringify(selectedDepartment.dept_short_name) : null;
    const receivedbyvalue = selectedReceivedBy ? JSON.stringify(selectedReceivedBy.emp_name) : null
    const vechileValue = selectedVehicle ? JSON.stringify(selectedVehicle.vehicle_name) : null


    const postData = {
        fy_year: formData.fy_year,
        month: formData.month,
        head_cat: headCatId,
        sub_cat: subCatId,
        selectedDate: formData.selectedDate,
        received_by: receivedbyvalue,
        particulars: formData.particulars,
        bill_no: formData.bill_no,
        amount: formData.amount,
        departments: dept,
        vehicles: vechileValue,
        selectedFile: formData.selectedFile
    };

    const handleSubmit = async () => {

        if (selectedFiles.length === 0) {
            setUploadStatus("Please select at least one PDF file.");
            return;
        }

        const formData = new FormData();
        Object.keys(postData).forEach(key => {
            formData.append(key, postData[key]);
        });
        selectedFiles.forEach((file) => {
            formData.append("pdf", file);
        });

        try {
            const response = await axios.post(
                "http://localhost:1234/submitForm",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setUploadStatus(response.data.message);
            setSelectedFiles([]);
            console.log('Selected Head Category ID:', headCatId);
            console.log('Selected Sub Category ID:', subCatId);
            setUploadStatus("File uploaded successfully!");
            navigate('/table')
            setTimeout(() => setUploadStatus(""), 2000);
        } catch (error) {
            console.error("Error uploading files:", error);
            setUploadStatus("Failed to upload files.");
            setTimeout(() => setUploadStatus(""), 3000);
        }
    };


    const handleFileChange = (event) => {
        const files = event.target.files;
        const newSelectedFiles = [];

        // Convert FileList to array and add to newSelectedFiles
        for (let i = 0; i < files.length; i++) {
            newSelectedFiles.push(files[i]);
        }

        // Update selectedFiles state with newSelectedFiles
        setSelectedFiles([...selectedFiles, ...newSelectedFiles]);
    };

    const handleClear = () => {
        setSelectedYear(null);
        setSelectedMonth(null);
        setSelectedDate(null);
        setErrors({});
        setFormData({
            fy_year: '',
            month: '',
            head_cat: '',
            sub_cat: '',
            selectedDate: '',
            received_by: [],
            particulars: '',
            bill_no: '',
            amount: '',
            departments: [],
            vehicles: [],
            selectedFile: null
        });
        setSelectedHeadCategory(null);
        setSelectedSubCategory(null);
        setSelectedDepartment(null);
        setSelectedReceivedBy(null);
        setSelectedVehicle(null);
        setSelectedFiles([]);
        setShowDepartmentDropdown(false);
        setShowVehicleDropdown(false);
    };

    const handleYearChange = (selectedYear) => {
        setSelectedYear(selectedYear);
        setFormData((prevState) => ({
            ...prevState,
            fy_year: selectedYear ? selectedYear.$y.toString() : null,
        }));
    };

    const handleMonthChange = (selectedMonth) => {
        setSelectedMonth(selectedMonth);
        setFormData((prevState) => ({
            ...prevState,
            month: selectedMonth
                ? new Date(selectedMonth).toLocaleString("en-us", {
                    month: "long",
                })
                : null,
        }));
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setFormData((prevState) => ({
            ...prevState,
            selectedDate: date ? formatDate(date) : null,
        }));
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return ${year}/${month}/${day};
    };

    const handleParticularsChange = (event) => {
        setFormData(prevState => ({
            ...prevState,
            particulars: event.target.value
        }));
    };

    const handleBillNoChange = (event) => {
        setFormData(prevState => ({
            ...prevState,
            bill_no: event.target.value
        }));
    };

    const handleAmountChange = (event) => {
        setFormData(prevState => ({
            ...prevState,
            amount: event.target.value
        }));
    };

    const handleDelete = (fileToDelete) => () => {
        setSelectedFiles((files) => files.filter((file) => file !== fileToDelete));
    };

    return (
        <div style={{ paddingTop: '70px' }}>
            <Dash />
            <Container maxWidth="sm" sx={{ marginLeft: '110px' }}>
                <Box mt={5} mb={5} p={3} boxShadow={3} borderRadius={5} style={{ backgroundColor: 'white', width: '80vw' }}>
                    <div className="mb-3 text-center">
                        <Typography variant="h4" sx={{ color: 'white', backgroundColor: '#32348c', padding: '10px', borderRadius: '5px' }}><b>FORM</b></Typography>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                            <FormControl sx={{ marginTop: 2, width: '33%' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer
                                        components={["DatePicker", "DatePicker", "DatePicker"]}
                                    >
                                        <DatePicker
                                            name="fy_year"
                                            value={selectedYear}
                                            onChange={handleYearChange}
                                            label={"Financial Year"}
                                            views={["year"]}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </FormControl>
                            <FormControl sx={{ marginTop: 2, width: '31%' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer
                                        components={["DatePicker", "DatePicker", "DatePicker"]}
                                    >
                                        <DatePicker
                                            name="month"
                                            value={selectedMonth}
                                            onChange={handleMonthChange}
                                            label={"Select the month"}
                                            views={["month"]}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </FormControl>
                            <FormControl sx={{ marginTop: 3, width: '31%' }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        sx={{ width: "100%" }}
                                        renderInput={(params) => <TextField {...params} />}
                                        label="Select Date"
                                    />
                                </LocalizationProvider>
                                <Typography variant="caption" color="error">
                                    {errors.selectedDate}
                                </Typography>
                            </FormControl>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                            <FormControl sx={{ marginTop: 2, width: '48%' }}>
                                <Autocomplete
                                    value={selectedHeadCategory}
                                    onChange={handleHeadCategoryChange}
                                    options={headCategories}
                                    getOptionLabel={(option) => option.head_cat_name}
                                    renderInput={(params) => <TextField {...params} label="Head Category" />}
                                />
                            </FormControl>

                            <FormControl sx={{ marginTop: 2, width: '48%' }}>
                                <Autocomplete
                                    value={selectedSubCategory}
                                    onChange={(event, newValue) => setSelectedSubCategory(newValue)}
                                    options={subCategories}
                                    getOptionLabel={(option) => option.sub_cat_name}
                                    renderInput={(params) => <TextField {...params} label="Sub Category" />}
                                />
                            </FormControl>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                            <FormControl sx={{ marginTop: 2, width: '48%' }}>
                                <Autocomplete
                                    value={selectedDepartment}
                                    onChange={handleDepartmentChange}
                                    options={departmentOptions}
                                    getOptionLabel={(option) => option.dept_short_name}
                                    renderInput={(params) => <TextField {...params} label="Department" />}
                                />
                            </FormControl>

                            <FormControl sx={{ marginTop: 2, width: '48%' }}>
                                <Autocomplete
                                    value={selectedVehicle}
                                    onChange={handleVehicleChange}
                                    options={vehicleOptions}
                                    getOptionLabel={(option) => option.vehicle_name}
                                    renderInput={(params) => <TextField {...params} label="Vehicle" />}
                                />
                            </FormControl>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                            <FormControl sx={{ marginTop: 2, width: '48%' }}>
                                <Autocomplete
                                    value={selectedReceivedBy}
                                    onChange={handleReceivedByChange}
                                    options={receivedByOptions}
                                    getOptionLabel={(option) => option.emp_name}
                                    renderInput={(params) => <TextField {...params} label="Received By" />}
                                />
                            </FormControl>

                            <FormControl sx={{ marginTop: 0, width: '48%' }}>
                                <TextField
                                    fullWidth
                                    id="particulars"
                                    label="Particulars"
                                    name="particulars"
                                    value={formData.particulars}
                                    onChange={handleParticularsChange}
                                    error={!!errors.particulars}
                                    helperText={errors.particulars}
                                    sx={{ marginTop: 2 }}
                                />
                            </FormControl>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                            <FormControl sx={{ marginTop: 0, width: '48%' }}>
                                <TextField
                                    fullWidth
                                    id="bill_no"
                                    label="Bill No"
                                    name="bill_no"
                                    value={formData.bill_no}
                                    onChange={handleBillNoChange}
                                    error={!!errors.bill_no}
                                    helperText={errors.bill_no}
                                    sx={{ marginTop: 2 }}
                                />
                            </FormControl>
                            <FormControl sx={{ marginTop: 0, width: '48%' }}>
                                <TextField
                                    fullWidth
                                    id="amount"
                                    label="Amount"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleAmountChange}
                                    error={!!errors.amount}
                                    helperText={errors.amount}
                                    sx={{ marginTop: 2 }}
                                />
                            </FormControl>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '80%' }}>
                                <TextField
                                    sx={{ marginTop: '20px', width: "65vw" }}
                                    label="Selected PDF Files"
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                        startAdornment: (
                                            <Stack direction="row" spacing={1}>
                                                {selectedFiles.map((file, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={file.name}
                                                        onDelete={handleDelete(file)}
                                                    />
                                                ))}
                                            </Stack>
                                        ),
                                    }}
                                />
                            </div>
                            <input
                                id="fileInput"
                                type="file"
                                multiple
                                accept=".pdf"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                            <Tooltip title="Upload Files">
                                <label htmlFor="fileInput" style={{ flex: '20%', cursor: 'pointer' }}>
                                    <Button variant="contained" component="span" sx={{ height: '5vh', marginTop: '20px', width: '10vw', marginLeft: '20px', borderRadius: '60px' }}>
                                        <CloudUploadIcon /> {/* Add CloudUploadIcon */}
                                    </Button>
                                </label>
                            </Tooltip>
                        </div>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '30px' }}>
                            <Button
                                variant="contained"
                                color="success"
                                sx={{ flex: 1, borderRadius: 10 }}
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                sx={{ flex: 1, borderRadius: 10 }}
                                onClick={handleClear}
                            >
                                Clear
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Container>
        </div>
    );
};

export default Form;