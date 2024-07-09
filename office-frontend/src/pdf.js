import React, { useState } from "react";
import { Box, Container, Typography, Button, FormControl } from "@mui/material";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const PDF = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("pdf", selectedFile);
        const response = await axios.post(
          "http://localhost:1234/upload",
          formData
        );
        setFormData((prevState) => ({
          ...prevState,
          pdf: response.data.filePath,
        }));
        setUploadStatus("File uploaded successfully!");
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadStatus("Failed to upload file.");
      }
    } else {
      setUploadStatus("Please select a file to upload.");
    }
  };

 
  return (
    <div style={{ paddingTop: "30px",marginBottom:'30px' }}>
            <Button fullWidth  variant="contained" component="label" color="primary">
              Choose file
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </Button>
            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <Button
                onClick={handleFileUpload}
                component="label"
                color="primary"
                variant="contained"
              >
                Upload
              </Button>
              <p>{uploadStatus}</p>
            </FormControl>
    </div>
  );
};

export default PDF;