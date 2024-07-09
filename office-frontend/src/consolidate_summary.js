import {Typography, Box, Button, TextField, Autocomplete, FormControl } from "@mui/material";
import Dash from "./dash";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';



export default function Cs() {
  const [fy_year, setFinancialYear] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);
  const [fy_year1, setFinancialYear1] = useState("");
  const [month1, setMonth1] = useState("");

  const Navigate = useNavigate();

  


  const [year1Options, setYear1Options] = useState([]);

  useEffect(() => {
    // Fetch vehicle options from the backend
    axios.get('http://localhost:1234/getformyear')
      .then(response => {
        setYear1Options(response.data);
      })
      .catch(error => {
        console.error('Error fetching vehicle options:', error);
      });
  }, []);

  const [selectedYear1, setSelectedYear1] = useState(null);

  // Define a function to handle changes in the selected vehicle
  const handleYear1Change = (event, newValue) => {
    setSelectedYear1(newValue);
    console.log("Selected Year:", newValue);
  };
  const year1Value = selectedYear1 ? JSON.stringify(selectedYear1) : null

//YEAR 1 


  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    // Fetch vehicle options from the backend
    axios.get('http://localhost:1234/getformyear')
      .then(response => {
        setYearOptions(response.data);
      })
      .catch(error => {
        console.error('Error fetching vehicle options:', error);
      });
  }, []);

  const [selectedYear, setSelectedYear] = useState(null);

  // Define a function to handle changes in the selected vehicle
  const handleYearChange = (event, newValue) => {
    setSelectedYear(newValue);
    console.log("Selected Year:", newValue);
  };
  const yearValue = selectedYear ? JSON.stringify(selectedYear) : null


  // YEAR 

  const [monthOptions, setMonthOptions] = useState([]);

  useEffect(() => {
    // Fetch available months
    axios.get(`http://localhost:1234/getformmonth?year=${selectedYear}`)
      .then(response => {
        setMonthOptions(response.data);
      })
      .catch(error => {
        console.error('Error fetching months:', error);
      });
  }, [selectedYear]);

  const [selectedMonth, setSelectedMonth] = useState(null);

  // Define a function to handle changes in the selected vehicle
  const handleMonthChange = (event, newValue) => {
    setSelectedMonth(newValue);
    console.log("Selected Month:", newValue);
  };
  const monthValue = selectedMonth ? JSON.stringify(selectedMonth) : null

// MONTH 1 

const [month1Options, setMonth1Options] = useState([]);

useEffect(() => {
  // Fetch vehicle options from the backend
  axios.get('http://localhost:1234/getformmonth')
    .then(response => {
      setMonth1Options(response.data);
    })
    .catch(error => {
      console.error('Error fetching vehicle options:', error);
    });
}, []);

const [selectedMonth1, setSelectedMonth1] = useState(null);

// Define a function to handle changes in the selected vehicle
const handleMonth1Change = (event, newValue) => {
  setSelectedMonth1(newValue);
  console.log("Selected Month:", newValue);
};
const month1Value = selectedMonth1 ? JSON.stringify(selectedMonth1) : null


  const handleClear = () => {
    // Reset all state values to initial state
    setSelectedYear("");
    setSelectedMonth("");
    setFilteredData([]);
    setFilterApplied(false);
    setSelectedYear("");
    setSelectedMonth("");
  };

  const handleClear1 = () => {
    // Reset all state values to initial state
    setSelectedYear1("");
    setSelectedMonth1("");
    setFilteredData([]);
    setFilterApplied(false);
    setSelectedYear1("");
    setSelectedMonth1("");
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:1234/table`, {
        params: {
          financialYear: selectedYear ? selectedYear.toString() : '',
          month: selectedMonth ? selectedMonth.toString() : '' // Add null check
        }
      });
      console.log("Filtered data:", response.data);
      setFilteredData(response.data.data); // Set filtered data
      setFilterApplied(true); // Set filter applied to true

      // Generate PDF and open in new tab
      generatePDF(response.data.data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  const handleSearch1 = async () => {
    try {
      const response = await axios.get(`http://localhost:1234/table`, {
        params: {
          financialYear: selectedYear1 ? selectedYear1.toString() : '',
          month: selectedMonth1 ? selectedMonth1.toString() : '' // Add null check
        }
      });
      console.log("Filtered data:", response.data);
      setFilteredData(response.data.data); // Set filtered data
      setFilterApplied(true); // Set filter applied to true

      // Generate PDF and open in new tab
      generatePDF1(response.data.data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };


  const generatePDF = async (data) => {
    const doc = new jsPDF();
    const headers = [['Date', 'Particulars', 'Amount']]; // Adjust according to your data structure
    let tableData = []; // Initialize empty array for table data

    for (let index = 0; index < data.length; index++) {
      const item = data[index];

      // Add data for each matching value to the tableData array
      tableData.push([item.selectedDate, item.particulars, item.amount]); // Adjust according to your data structure
    }

    // Generate the table after all matching values have been added to tableData
    doc.autoTable({
      head: headers,
      body: tableData,
      startY: 20, // Adjust vertical position if necessary
    });

    for (let index = 0; index < data.length; index++) {
      const item = data[index];

      // Add page break if not the first matching value
      if (index > 0) {
        doc.addPage();
      }

      // Generate box container

      // Fetch PDF files for the current item and embed them into the generated PDF
      try {
        const response = await axios.get(`http://localhost:1234/getPDF/${item.id}/${item.collectionUUID}`);
        const pdfFiles = response.data.data;

        if (pdfFiles && pdfFiles.length > 0) {
          // Iterate over pdfFiles and embed each PDF file into the generated PDF
          for (let i = 0; i < pdfFiles.length; i++) {
            const file = pdfFiles[i];
            const pdfResponse = await axios.get(`http://localhost:1234/pdfs/${encodeURIComponent(file.pdfFileName)}`, {
              responseType: 'arraybuffer'
            });
            const pdfData = new Uint8Array(pdfResponse.data);
            const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

            for (let j = 1; j <= pdf.numPages; j++) {
              const page = await pdf.getPage(j);
              const viewport = page.getViewport({ scale: 1 });
              const canvas = document.createElement('canvas');
              const canvasContext = canvas.getContext('2d');
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              const renderContext = {
                canvasContext,
                viewport
              };
              await page.render(renderContext).promise;
              const imgData = canvas.toDataURL('image/jpeg');

              // Add a new page for each image
              doc.addPage();
              doc.addImage(imgData, 'JPEG', 10, 10, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 20); // Adjust position and size as needed
            }
          }
        } else {
          console.error('No PDF files found in the response data');
        }
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    }

    // Convert PDF to data URI
    const pdfDataUri = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfDataUri);

    // Open PDF in a new tab
    window.open(pdfUrl, '_blank');
  };




  const generatePDF1 = async (data) => {
    const doc = new jsPDF();
    const headers = [['Date', 'Particulars', 'Amount']];
    let tableData = [];
  
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      tableData.push([item.selectedDate, item.particulars, item.amount]);
    }
  
    doc.autoTable({
      head: headers,
      body: tableData,
      startY: 20,
    });
  
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
  
      if (index > 0) {
        doc.addPage();
      }
  
      const boxData = [
        ['Particulars:', item.particulars],
        ['Amount:', item.amount],
        ['Head Cat:', item.head_cat],
        ['Sub Cat:', item.sub_cat],
      ];
      doc.rect(10, 100, 190, 40);
      doc.autoTable({
        body: boxData,
        startY: 102,
        theme: 'grid',
        styles: { cellWidth: 'wrap' },
        margin: { left: 12 },
      });
  
      try {
        const response = await axios.get(`http://localhost:1234/getPDF/${item.id}/${item.collectionUUID}`);
        const files = response.data.data;
  
        if (files && files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileResponse = await axios.get(`http://localhost:1234/pdfs/${encodeURIComponent(file.pdfFileName)}`, {
              responseType: 'arraybuffer'
            });
            const fileData = new Uint8Array(fileResponse.data);
  
            const fileExtension = file.pdfFileName.split('.').pop().toLowerCase();
  
            if (fileExtension === 'pdf') {
              const pdf = await pdfjsLib.getDocument({ data: fileData }).promise;
  
              for (let j = 1; j <= pdf.numPages; j++) {
                const page = await pdf.getPage(j);
                const viewport = page.getViewport({ scale: 1 });
                const canvas = document.createElement('canvas');
                const canvasContext = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const renderContext = {
                  canvasContext,
                  viewport
                };
                await page.render(renderContext).promise;
                const imgData = canvas.toDataURL('image/jpeg');
  
                doc.addPage();
                doc.addImage(imgData, 'JPEG', 10, 10, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 20);
              }
            } else if (fileExtension === 'jpeg' || fileExtension === 'jpg' || fileExtension === 'png') {
              const img = new Image();
              img.src = URL.createObjectURL(new Blob([fileData], { type: 'image/jpeg' }));
              await new Promise((resolve) => img.onload = resolve);
              doc.addPage();
              doc.addImage(img, 'JPEG', 10, 10, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 20);
            }
          }
        } else {
          console.error('No files found in the response data');
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    }
  
    const pdfDataUri = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfDataUri);
  
    window.open(pdfUrl, '_blank');
  };


  const handleFilter = async () => {
    handleSearch();
    console.log(selectedMonth)
  };

  const handleFilter1 = async () => {
    handleSearch1();
  };



  return (
    <div style={{ width: '50vw', marginLeft: '350px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', paddingTop: '100px' }}>
        <Box p={3}>
          <Dash />
          <Box p={2} bgcolor="background.paper" borderRadius= '10px' sx={{ height: '60vh' }}>
          <Typography variant="h4" sx={{ color: 'white', backgroundColor: '#32348c', padding: '10px', borderRadius: '5px',textAlign :'center' }}><b>SUMMARY</b></Typography>
            <div>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center',paddingTop:'20px' }}>
                  <FormControl sx={{ minWidth: 350 }}>
                  <Autocomplete
                    value={selectedYear}
                    onChange={handleYearChange}
                    options={yearOptions}
                    renderInput={(params) => <TextField {...params} label="Year" />}
                  />
                </FormControl>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center',paddingTop:'20px' }}>
                  <FormControl sx={{ minWidth: 350 }}>
                  <Autocomplete
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    options={monthOptions}
                    renderInput={(params) => <TextField {...params} label="Month" />}
                  />
                </FormControl>
              </div>
              <div style={{ marginTop: '30px', marginLeft: '20px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <Button variant="contained"
                    color="primary" onClick={handleFilter} sx={{ marginTop: '10px', borderRadius: '50px', width: '27vw' }}>SUMMARY</Button>
                </div>
                <div>
                  <Button variant="contained"
                    color="warning" sx={{ marginTop: '10px', width: '27vw', borderRadius: '50px' }} onClick={handleClear} >Clear</Button>
                </div>
              </div>
            </div>
          </Box>
        </Box>
        <div style={{ paddingTop: '10px', width: '50vw', marginLeft: '0px', marginBottom: '8px' }}>
          <Box p={4}>
            <Dash />
            <Box p={2} bgcolor="background.paper" borderRadius= '10px' sx={{ height: '60vh' }}>
            <Typography variant="h4" sx={{ color: 'white', backgroundColor: '#32348c', padding: '10px', borderRadius: '5px',textAlign :'center' }}><b>CONSOLIDATE</b></Typography>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 350 ,paddingTop:'20px'}}>
                  <Autocomplete
                    value={selectedYear1}
                    onChange={handleYear1Change}
                    options={year1Options}
                    renderInput={(params) => <TextField {...params} label="Year" />}
                  />
                </FormControl>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center',paddingTop:'20px' }}>
                  <FormControl sx={{ minWidth: 350 }}>
                  <Autocomplete
                    value={selectedMonth1}
                    onChange={handleMonth1Change}
                    options={month1Options}
                    renderInput={(params) => <TextField {...params} label="Month" />}
                  />
                </FormControl>
                </div>
                <div style={{ marginTop: '30px', marginLeft: '20px' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <Button variant="contained"
                      color="primary" onClick={handleFilter1} sx={{ marginTop: '10px', borderRadius: '50px', width: '27vw' }}>CONSOLIDATE</Button>
                  </div>
                  <div>
                    <Button variant="contained"
                      color="warning" sx={{ marginTop: '10px', width: '27vw', borderRadius: '50px' }} onClick={handleClear1} >Clear</Button>
                  </div>
                </div>
              </div>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
}