import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, TextField, Tooltip } from '@mui/material';
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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
    const [selectedDate, setSelectedDate] = useState(null);
    const [errors, setErrors] = useState({});
    const [headCategories, setHeadCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedHeadCategory, setSelectedHeadCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [receivedByOptions, setReceivedByOptions] = useState([]);
    const [selectedReceivedBy, setSelectedReceivedBy] = useState(null);




    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [vehicleOptions, setVehicleOptions] = useState([]);




    // Define a function to handle changes in the selected vehicle
    const handleVehicleChange = (event, newValue) => {
        setSelectedVehicle(newValue);
        console.log(selectedVehicle)
    };
    // Month fethcer//
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [MonthOptions, setMonthOptions] = useState([]);


    useEffect(() => {
        // Fetch received by options from the backend
        axios.get('http://localhost:1234/getmonth_form')
            .then(response => {
                setMonthOptions(response.data);

            })
            .catch(error => {
                console.error('Error fetching month options:', error);
            });
    }, []);

    const handleMonthChange = (event, newValue) => {
        setSelectedMonth(newValue);
        console.log(monthValue)
    };

    // Month fetcher //

    const [selectedFy_year, setSelectedFy_year] = useState(null);
    const [fy_yearOptions, setFy_yearOptions] = useState([]);
    // fy year fetched

    useEffect(() => {
        // Fetch received by options from the backend
        axios.get('http://localhost:1234/getfy_year_form')
            .then(response => {
                setFy_yearOptions(response.data);

            })
            .catch(error => {
                console.error('Error fetching received by options:', error);
            });
    }, []);

    const handleFy_yearChange = (event, newValue) => {
        setSelectedFy_year(newValue);
        console.log(fy_yearValue)
    };


    //


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
        console.log(receivedbyvalue)
    };

    const handleHeadCategoryChange = (event, newValue) => {
        setSelectedHeadCategory(newValue);
        setSelectedVehicle(null);
        setSelectedSubCategory(null);
        setSelectedDepartment(null);
        setVehicleOptions([])
        setDepartmentOptions([]);
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


    const handleSubCategoryChange = (event, newValue) => {
        setSelectedSubCategory(newValue);
        console.log(newValue)
        if (newValue) {
            // Fetch subcategories based on selected head category
            axios.get('http://localhost:1234/getvehicle')
                .then(response => {
                    const filteredVehicleCategories = response.data.filter(vehicle => vehicle.spl_id === newValue.spl_id);
                    setVehicleOptions(filteredVehicleCategories);
                    setSelectedDepartment(null);

                })
                .catch(error => {
                    console.error('Error fetching subcategories:', error);
                });
        }
        else {
            setVehicleOptions([]);
        }
        if (newValue) {
            // Fetch subcategories based on selected head category
            axios.get('http://localhost:1234/getdepartment')
                .then(response => {
                    const filteredDepartmentsCategories = response.data.filter(departments => departments.spl_id === newValue.spl_id);
                    setDepartmentOptions(filteredDepartmentsCategories);
                    setSelectedVehicle(null);

                })
                .catch(error => {
                    console.error('Error fetching subcategories:', error);
                });
        }
        else {
            setDepartmentOptions([]);
        }
    };


    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);






    const handleDepartmentChange = (event, newValue) => {
        setSelectedDepartment(newValue);
        console.log(newValue);
        console.log(dept);

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
    });

    const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
    const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);

    const navigate = useNavigate();
    const headCatId = selectedHeadCategory ? selectedHeadCategory.head_cat_name : '';
    const subCatId = selectedSubCategory ? selectedSubCategory.sub_cat_name : '';
    const dept = selectedDepartment ? selectedDepartment.dept_full_name : '';
    const receivedbyvalue = selectedReceivedBy ? selectedReceivedBy.emp_name : '';
    const vechileValue = selectedVehicle ? selectedVehicle.vehicle_name : '';
    const fy_yearValue = selectedFy_year ? selectedFy_year.fy_name : '';
    const monthValue = selectedMonth ? selectedMonth.month_name : '';

    const postData = {
        fy_year: fy_yearValue,
        month: monthValue,
        head_cat: headCatId,
        sub_cat: subCatId,
        selectedDate: formData.selectedDate,
        received_by: receivedbyvalue,
        particulars: formData.particulars,
        bill_no: formData.bill_no,
        amount: formData.amount,
        departments: dept,
        vehicles: vechileValue
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
        return `${year}/${month}/${day}`;
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

    const visibleChips = selectedFiles.slice(Math.max(selectedFiles.length - 6, 0));

    return (
        <div style={{ paddingTop: '80px' }}>
            <Dash />
            <Container maxWidth="sm" sx={{ marginLeft: '110px' }}>
                <Box mt={5} mb={5} p={3} boxShadow={3} borderRadius={5} style={{ backgroundColor: 'white', width: '80vw' }}>
                    <div className="mb-3 text-center">
                        <Typography variant="h4" sx={{ color: 'white', backgroundColor: '#32348c', padding: '10px', borderRadius: '5px' }}><b>FORM</b></Typography>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                            <FormControl sx={{ marginTop: 0, width: '31.5%' }}>
                                <Autocomplete
                                    value={selectedFy_year}
                                    onChange={handleFy_yearChange}
                                    options={fy_yearOptions}
                                    getOptionLabel={(option) => option.fy_name}
                                    renderInput={(params) => <TextField {...params} label="Financial Year" />}
                                />
                            </FormControl>

                            <FormControl sx={{ marginTop: 0, width: '31.5%' }}>
                                <Autocomplete
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                    options={MonthOptions}
                                    getOptionLabel={(option) => option.month_name}
                                    renderInput={(params) => <TextField {...params} label="Month" />}
                                />
                            </FormControl>
                            <FormControl sx={{ marginTop: 0, width: '31.5%' }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} >
                                    <DatePicker
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        sx={{ width: '100%' }}
                                        renderInput={(params) => <TextField {...params} />}
                                        label="Select Date"// Use renderInput to customize input
                                    />
                                </LocalizationProvider>
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
                                    onChange={handleSubCategoryChange}
                                    options={subCategories}
                                    getOptionLabel={(option) => option.sub_cat_name}
                                    renderInput={(params) => <TextField {...params} label="Sub Category" />}
                                    disabled={subCategories.length === 0} // Disable if subCategories is empty
                                />
                            </FormControl>
                            {/* {subCategories.length > 0 && (
    <FormControl sx={{ marginTop: 2, width: '48%' }}>
        <Autocomplete
            value={selectedSubCategory}
            onChange={(event, newValue) => setSelectedSubCategory(newValue)}
            options={subCategories}
            getOptionLabel={(option) => option.sub_cat_name}
            renderInput={(params) => <TextField {...params} label="Sub Category" />}
        />
    </FormControl>
)} */}


                        </div>
                        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                            <FormControl sx={{ marginTop: 2, width: '48%' }}>
                                <Autocomplete
                                    value={selectedDepartment}
                                    onChange={handleDepartmentChange}
                                    options={departmentOptions}
                                    getOptionLabel={(option) => option.dept_full_name}
                                    renderInput={(params) => <TextField {...params} label="Department" />}
                                    disabled={departmentOptions.length === 0}
                                />
                            </FormControl>

                            <FormControl sx={{ marginTop: 2, width: '48%' }}>
                                <Autocomplete
                                    value={selectedVehicle}
                                    onChange={handleVehicleChange}
                                    options={vehicleOptions}
                                    getOptionLabel={(option) => option.vehicle_name}
                                    renderInput={(params) => <TextField {...params} label="Vehicle" />}
                                    disabled={vehicleOptions.length === 0}
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
                        <div style={{ display: 'flex', alignItems: 'center' ,justifyContent:'space-evenly'}}>
    <div style={{ flex: '80%' }}>
        <TextField
            sx={{ marginTop: '20px', marginBottom: '20px', width: "65vw" }}
            label="Selected PDF Files"
            variant="outlined"
            fullWidth
            InputProps={{
                readOnly: true,
                startAdornment: (
                    <Stack direction="row" spacing={1} sx={{display:"flex",alignItems:'center',justifyContent:"space-evenly", paddingTop: '10px', paddingBottom: '10px', flexWrap: 'wrap' }}>
                        {selectedFiles.map((file, index) => (
                            <Chip
                                key={index}
                                label={file.name}
                                onDelete={handleDelete(file)}
                               style={{marginTop:'10px'}}// Reduce padding and font size
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
        accept=".pdf,.jpg,.jpeg,.png"
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

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '20px' }}>
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