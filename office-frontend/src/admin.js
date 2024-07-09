import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Typography, Container, Box, Card, CardContent, Button, FormControl, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Dash from './dash';

export const Admin = () => {
  const [selectedFy_year, setSelectedFy_year] = useState(null);
  const [fy_yearOptions, setFy_yearOptions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthOptions, setMonthOptions] = useState([]);
  const [cardsData, setCardsData] = useState([]);

  

  useEffect(() => {
    axios.get('http://localhost:1234/getfy_month_admin')
      .then(response => {
        setMonthOptions(response.data);
        setCardsData(response.data);
      })
      .catch(error => {
        console.error('Error fetching received by options:', error);
      });

    axios.get('http://localhost:1234/getfy_year_admin')
      .then(response => {
        setFy_yearOptions(response.data);
      })
      .catch(error => {
        console.error('Error fetching received by options:', error);
      });
  }, []);

  const handleMonthChange = (event, newValue) => {
    setSelectedMonth(newValue);
  };

  const handleActivateMonth = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1234/activateMonth",
        { month_name: selectedMonth?.month_name || '' }
        
      );
      console.log(response.data.message);
      window.location.reload();
      
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLockMonth = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1234/lockMonth",
        { month_name: selectedMonth?.month_name || '' }
      );
      console.log(response.data.message);
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFy_yearChange = (event, newValue) => {
    setSelectedFy_year(newValue);
  };

  const handleActivateYear = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1234/activateYear",
        { fy_name: selectedFy_year?.fy_name || '' }
      );
      console.log(response.data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLockYear = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1234/lockYear",
        { fy_name: selectedFy_year?.fy_name || '' }
      );
      console.log(response.data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>    <Dash />
    <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', marginBottom: '50px' }}>

      <Box mt={5} p={3} boxShadow={3} borderRadius={5} style={{ backgroundColor: 'white', width: '80vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ color: 'white', backgroundColor: '#32348c', padding: '10px', borderRadius: '5px',textAlign :'center',width:'100%'}}><b>ADMIN</b></Typography>

        <Box style={{ width: '100%', marginBottom: '20px', display: 'flex', justifyContent: 'space-between',marginTop:'10px' }}>
          <Card style={{ width: '48%' }}>
            <CardContent>
              <FormControl sx={{ marginTop: 0, width: '100%' }}>
                <Autocomplete
                  value={selectedFy_year}
                  onChange={handleFy_yearChange}
                  options={fy_yearOptions}
                  getOptionLabel={(option) => option.fy_name}
                  renderInput={(params) => <TextField {...params} label="Financial Year" />}
                />
              </FormControl>
              <Button
                variant="contained"
                onClick={handleActivateYear}
                sx={{ backgroundColor: '#00a67d', color: 'white', width: '100%', marginTop: '10px' }}
              >
                Activate
              </Button>
              <Button
                variant="contained"
                onClick={handleLockYear}
                sx={{ backgroundColor: '#e91e63', color: 'white', width: '100%', marginTop: '10px' }}
              >
                Lock
              </Button>
            </CardContent>
          </Card>
          <Card style={{ width: '48%' }}>
            <CardContent>
              <FormControl sx={{ marginTop: 0, width: '100%' }}>
                <Autocomplete
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  options={monthOptions}
                  getOptionLabel={(option) => option.month_name}
                  renderInput={(params) => <TextField {...params} label="Month" />}
                />
              </FormControl>
              <Button
                variant="contained"
                onClick={handleActivateMonth}
                sx={{ backgroundColor: '#00a67d', color: 'white', width: '100%', marginTop: '10px' }}
              >
                Activate
              </Button>
              <Button
                variant="contained"
                onClick={handleLockMonth}
                sx={{ backgroundColor: '#e91e63', color: 'white', width: '100%', marginTop: '10px' }}
              >
                Lock
              </Button>
            </CardContent>
          </Card>
        </Box>
        <Box style={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {cardsData.map((month, index) => (
            <Card key={index} style={{ width: '12%', marginBottom: '20px', marginLeft: '20px', marginRight: '10px', height: "5vh", textAlign: 'center', backgroundColor: month.month_id === 0 ? '#e91e63' : month.month_id === 1 ? '#00a67d' : 'white' }}>
              <CardContent style={{  display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' ,color:'white'}}>{month.month_name}</CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
    </div>

  );
};
