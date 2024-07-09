import axios from 'axios'


export const callTable = async () => {
    try {
      const response = await axios.get(
        "http://localhost:1234/getform"
      );
      // Add this line
      return response.data;
    } catch (err) {
      console.error(err);
      return "An error occurred while fetching data.";
    }
  };
  

  export const callFilteredData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:1234/login",
        {
          auth: {
            username: 'root',
            password: 'Vetree@1209'
          }
        }
      );
      return response.data;
    } catch (err) {
      console.error(err);
      return "An error occurred while fetching data.";
    }
  };
  
  
{/* export const callpdf = async () => {
    try {
      const response = await axios.get("http://localhost:1234/getpdfs");
      // Add this line
      return response.data;
    } catch (err) {
      console.error(err);
      return "An error occurred while fetching data.";
    }
  };
  
  export const getPDF = async (pdfFileName) => {
    try {
      const response = await axios.get(
        `http://localhost:1234/getpdf?pdfFileName=${pdfFileName}`,
        { responseType: "arraybuffer" } // Receive binary data
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      throw new Error("An error occurred while fetching PDF.");
    }
  };*/}