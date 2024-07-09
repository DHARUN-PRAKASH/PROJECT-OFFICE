const express = require('express');
const cors = require('cors'); // Import cors middleware
const { MongoClient } = require('mongodb');
const multer =  require('multer')
const fs = require('fs'); 
const { ObjectId } = require('mongodb'); 
const { v4: uuidv4 } = require('uuid');
const path = require('path'); 

const app = express();
app.use(express.json()); // Parse JSON bodies

// Use cors middleware to enable CORS
app.use(cors());

const uri = 'mongodb+srv://vetrikanth:vetree1209@cluster0.vf6xd7d.mongodb.net/';
const client = new MongoClient(uri);

  app.post('/users', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      await client.connect();
      const database = client.db('office');
      const collection = database.collection('signin');

      const user = await collection.findOne({ username, password });

      if (user) {
        if (user.designation === 1) { // Assuming the designation field is called 'designation'
          const message = 'Credentials matched. Login successful.';
          // Include username in the response
          res.status(200).json({ message, status: 'success', redirectToAdmin: true, username: username });
        } else {
          const message = 'Credentials matched. Login successful.';
          // Include username in the response
          res.status(200).json({ message, status: 'success', redirectToAdmin: false, username: username });
        }
      } else {
        const error = 'Invalid credentials. Login failed.';
        res.status(401).json({ message: 'failed', error: 'Invalid credentials', status: 'failed login' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    } 
  });

// Add a new endpoint to fetch the logged-in username





const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,  'E:/PROJECT/OFFICE/office - og - Copy/src/pdfs'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use original file name
  }
});

const upload = multer({ storage: storage });

let autoIncrement_form = 1; // Initialize auto-increment counter

app.post('/submitForm', upload.array('pdf', 100), async (req, res) => {
  try {
    await client.connect(); 
    const database = client.db('office');
    const collection = database.collection('form');
    const formData = req.body;

    // Generate a UUID for this collection of PDF files
    const collectionUUID = uuidv4();

    // Initialize result variable
    let result;

    // Insert the form data into the collection
    const files = req.files;

    // Initialize array to store PDF file information
    const pdfFiles = [];

    for (const file of files) {
      const { originalname, path } = file; // Destructure originalname and path from file object

      // Extract bill number and date from form data
      const { bill_no, selectedDate } = formData;

      // Format the date without time
      const formattedDate = selectedDate? selectedDate.replace(/[\W_]+/g, '-') : '-';
      // Parse received by data into an array of JSON objects
      formData.received_by = Array.isArray(formData.received_by)? formData.received_by : [formData.received_by];

      // Generate a random number
      const randomNum = Math.floor(Math.random() * 1000);

      const formatedName = originalname.split('.').pop().toLowerCase();

      // Create PDF name with bill number, formatted date, and random number
      const pdfName = `${bill_no}_${formattedDate}_${randomNum}.${formatedName}`  ;

      // Rename the uploaded file with the generated PDF name
      const newPath = path.replace(originalname, pdfName);

      // Move the file to the new path
      fs.renameSync(path, newPath);

      // Push an object containing file name, path, and generated PDF name
      pdfFiles.push({
        pdfFileName: pdfName,
        pdfFilepath: newPath // Use the new path for the renamed file
      });
    }

    // Add the pdfFiles array to the formData
    formData.pdfFiles = pdfFiles;

    // Add the collection UUID to the formData
    formData.collectionUUID = collectionUUID;
    formData.id = autoIncrement_form++;

    // Insert the form data into the collection
    result = await collection.insertOne(formData);

    // Send response after the data is inserted
    res.status(200).json({ message: "Form submitted successfully", result });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});








app.get("/getform", async (req, res) => {
  try {
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('form');

    // Retrieve data from the collection and sort in reverse order by _id
    const results = await collection.find().sort({_id: -1}).toArray();
    
    if (results.length === 0) {
      res.status(404).json({ error: "No data found" });
    } else {
      res.status(200).json({ message: results });
    }
  } catch (error) {
    console.error('Error retrieving form data:', error);
    res.status(500).json({ error: 'Internal server error' });
  } 
});



app.get("/table", async (req, res) => {
  try {
    // Get filter parameters from query
    const {
      headCategory,
      subCategory,
      amount,
      financialYear,
      month,
      emp_id,
      particulars,
      date,
      vehicleId,
      filename,
    } = req.query;

    // Construct filter object
    const filter = {};

    if (headCategory) {
      filter.head_cat = headCategory;
    }
    if (subCategory) {
      filter.sub_cat = subCategory;
    }
    if (amount) {
      filter.amount = amount;
    }
    if (financialYear) {
      filter.fy_year = financialYear;
    }
    if (month) {
      filter.month = month;
    }
    if (emp_id) { // Change employeeId to emp_id
      filter.recevied_by = emp_id; // Change received_by to the appropriate field in your collection
    }
    if (particulars) {
      filter.particulars = particulars;
    }
    if (date) {
      filter.selectedDate = date;
    }
    if (vehicleId) {
      filter.vehicles = vehicleId;
    }
    if (filename) {
      filter.file_name = filename;
    }

    // Connect to MongoDB
    await client.connect();
    const database = client.db("office");
    const collection = database.collection("form");

    // Find documents based on filter
    const results = await collection.find(filter).toArray();

    if (results.length === 0) {
      res.status(404).json({ error: "No matching records found" });
    } else {
      res.status(200).json({ message: "Filtered data found", data: results });
    }
  } catch (error) {
    console.error("Error filtering data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/getPDF/:id/:collectionUUID", async (req, res) => {
  try {
    const { id, collectionUUID } = req.params;
    console.log("Request received for id:", id, "and collectionUUID:", collectionUUID);

    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db('office');
    const collection = database.collection('form');

    // Find the document with the given id and collectionUUID
    const document = await collection.findOne({ id: parseInt(id), collectionUUID });
    console.log("Retrieved document:", document);

    if (!document) {
      console.log("Document not found");
      res.status(404).json({ error: "Document not found" });
      return;
    }

    // Extract PDF files from the document
    const pdfFiles = document.pdfFiles;

    if (!pdfFiles || pdfFiles.length === 0) {
      console.log("PDF files not found");
      res.status(404).json({ error: "PDF files not found" });
      return;
    }

    // Extract pdfFileName and pdfFilepath from each object in pdfFiles array
    const pdfDetails = pdfFiles.map(({ pdfFileName, pdfFilepath }) => ({
      pdfFileName,
      pdfFilepath
    }));

    // Send PDF details to the frontend
    console.log("PDF details found");
    res.status(200).json({ message: "PDF details found", data: pdfDetails });
  } catch (error) {
    console.error('Error fetching PDF files:', error);
    res.status(500).json({ error: "Internal server error" });
  } 
});

// Add express.static middleware to serve static files (PDFs)


app.get('/pdfs/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join('E:/PROJECT/OFFICE/office - og - Copy/src/pdfs', filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('PDF file not found:', err);
      res.status(404).json({ error: 'PDF file not found' });
      return;
    }

    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
});


app.get('/gethead_cat', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('head_cat');
    // Retrieve head categories from the collection where head_cat_status is true
    const categories = await collection.find({ head_cat_status: true }, { head_cat_id: 1, head_cat_name: 1, head_cat_status: 1 }).toArray();
    // Map the MongoDB result to an array of objects with required properties
    const formattedCategories = categories.map(category => ({
      head_cat_id: category.head_cat_id,
      head_cat_name: category.head_cat_name,
      head_cat_status: category.head_cat_status
    }));
    // Send the formatted categories as an array response
    res.send(formattedCategories);
  } catch (error) {
    console.error('Error fetching head categories:', error);
    res.status(500).send('Internal server error');
  } 
});


app.get('/gethead_cat_form', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('form');
    // Retrieve distinct head categories from the collection
    const distinctHeadCategories = await collection.distinct('head_cat');
    // Filter out empty strings
    const nonEmptyCategories = distinctHeadCategories.filter(headCat => headCat !== '');
    // Map the non-empty head categories to an array of objects with required properties
    const formattedCategories = nonEmptyCategories.map(headCat => ({
      head_cat: headCat
    }));
    // Send the formatted categories as an array response
    res.send(formattedCategories);
  } catch (error) {
    console.error('Error fetching head categories:', error);
    res.status(500).send('Internal server error');
  } 
});





app.get('/getsub_cat', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('sub_cat');
    // Retrieve sub categories from the collection where sub_cat_status is true
    const categories = await collection.find({ sub_cat_status: true }, { sub_cat_name: 1, sub_cat_id: 1, head_cat_id: 1, _id: 0 }).toArray();
    // Send the categories as an array response
    const formattedCategories = categories.map(category => ({
      sub_cat_id: category.sub_cat_id,
      sub_cat_name: category.sub_cat_name,
      sub_cat_status: category.sub_cat_status
    }));
    res.send(categories);
  } catch (error) {
    console.error('Error fetching sub categories:', error);
    res.status(500).send('Internal server error');
  }
});


app.get('/getsub_cat_form', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('form');
    // Retrieve distinct sub-categories from the collection
    let distinctSubCategories = await collection.distinct('sub_cat');
    // Filter out empty strings
    distinctSubCategories = distinctSubCategories.filter(subCat => subCat !== '');
    // Map the distinct sub-categories to an array of objects with required properties
    const formattedCategories = distinctSubCategories.map(subCat => ({
      sub_cat: subCat
    }));
    // Send the formatted categories as an array response
    res.send(formattedCategories);
  } catch (error) {
    console.error('Error fetching sub categories:', error);
    res.status(500).send('Internal server error');
  } 
});




// filter amount 

app.get('/getamount_form', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('form');
    // Retrieve distinct amount categories from the collection
    let distinctAmounts = await collection.distinct('amount');
    // Filter out empty strings
    distinctAmounts = distinctAmounts.filter(amount => amount !== '');
    // Map the distinct amounts to an array of objects with required properties
    const formattedCategories = distinctAmounts.map(amount => ({
      amount
    }));
    // Send the formatted categories as an array response
    res.send(formattedCategories);
  } catch (error) {
    console.error('Error fetching amount categories:', error);
    res.status(500).send('Internal server error');
  } 
});



// Empid
app.get('/getemp_id_form', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('employees');
    // Retrieve distinct emp_id categories from the collection
    const distinctEmp_id = await collection.distinct('emp_name');
    // Map the distinct emp_id to an array of objects with required properties
    const formattedCategories = distinctEmp_id.map(emp_id => ({
      emp_id
    }));
    // Send the formatted categories as an array response
    res.send(formattedCategories);
  } catch (error) {
    console.error('Error fetching emp_id categories:', error);
    res.status(500).send('Internal server error');
  } 
});


app.get('/getreceived_by', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('employees');
    // Retrieve head categories from the collection
    const categories = await collection.find({}, { emp_id: 1, emp_name: 1, emp_status: 1, _id: 0 }).toArray();
    // Send the categories as an array response 
    res.send(categories);
  } catch (error) {
    console.error('Error fetching received by categories:', error);
    res.status(500).send('Internal server error');
  } 
});

app.get('/getdepartment', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('department');
    // Retrieve head categories from the collection
    const categories = await collection.find({}, { dept_id: 1, dept_full_name: 1, dept_short_name: 1 }).toArray();
    // Send the categories as an array response 
    res.send(categories);
  } catch (error) {
    console.error('Error fetching received by categories:', error);
    res.status(500).send('Internal server error');
  } 
});


app.get('/getvehicle', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('vehicle');
    // Retrieve head categories from the collection
    const categories = await collection.find({}).toArray();
    // Send the categories as an array response 
    res.send(categories);
  } catch (error) {
    console.error('Error fetching received by categories:', error);
    res.status(500).send('Internal server error');
  } 
});



//filter vehicles
app.get('/getvehicles_form', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('form');
    // Retrieve distinct vehicle categories from the collection
    let distinctVehicles = await collection.distinct('vehicles');
    // Filter out empty strings
    distinctVehicles = distinctVehicles.filter(vehicle => vehicle !== '');
    // Map the distinct vehicles to an array of objects with required properties
    const formattedCategories = distinctVehicles.map(vehicle => ({
      vehicles: vehicle
    }));
    // Send the formatted categories as an array response
    res.send(formattedCategories);
  } catch (error) {
    console.error('Error fetching vehicle categories:', error);
    res.status(500).send('Internal server error');
  } 
});

// 

// Particulars

app.get('/getparticulars_form', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('form');
    // Retrieve distinct particular categories from the collection
    let distinctParticulars = await collection.distinct('particulars');
    // Filter out empty strings
    distinctParticulars = distinctParticulars.filter(particular => particular.trim() !== '');
    // Map the distinct particulars to an array of objects with required properties
    const formattedCategories = distinctParticulars.map(particular => ({
      particulars: particular
    }));
    // Send the formatted categories as an array response
    res.send(formattedCategories);
  } catch (error) {
    console.error('Error fetching particular categories:', error);
    res.status(500).send('Internal server error');
  } 
});

// 



app.get('/getformmonth', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('form');
    // Retrieve only the month field from the collection
    let months = await collection.distinct('month');
    // Filter out empty strings
    months = months.filter(month => month.trim() !== '');
    // Define a custom sorting function for months
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    months.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
    // Send the sorted and filtered months as an array response 
    res.send(months);
  } catch (error) {
    console.error('Error fetching months from form collection:', error);
    res.status(500).send('Internal server error');
  } finally {
    // Close the MongoDB connection
  } 
});



app.get('/getformyear', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('form');
    // Retrieve only the fiscal year field from the collection
    let years = await collection.distinct('fy_year');
    // Filter out empty strings
    years = years.filter(year => year.trim() !== '');
    // Send the non-empty years as an array response 
    res.send(years);
  } catch (error) {
    console.error('Error fetching fiscal years from form collection:', error);
    res.status(500).send('Internal server error');
  } finally {
    // Close the MongoDB connection
  } 
});


// Route to store the selected year in the MongoDB collection


// FORMS DROP DOWN FY YEAR
app.get('/getfy_year_form', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('fy_year');
    
    // Retrieve fy year data from the collection
    const categories = await collection.find({fy_id:1}, { projection: { _id: 0, fy_id: 1, fy_name: 1 } }).toArray();
    
    // Sort the categories based on fy_name in ascending order
    categories.sort((a, b) => parseInt(a.fy_name) - parseInt(b.fy_name));
    
    // Send the sorted categories as an array response 
    res.json(categories);
  } catch (error) {
    console.error('Error fetching fy years:', error);
    res.status(500).send('Internal server error');
  } 
});



// FOORMS DROP DOWN MONTH
app.get('/getmonth_form', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('month');
    
    // Retrieve month data from the collection
    const months = await collection.find({month_id:1}, { projection: { month_id: 1, month_name: 1, _id: 0,fy_id:1 } }).toArray();
    
    // Define a custom sorting function for months
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    months.sort((a, b) => monthOrder.indexOf(a.month_name) - monthOrder.indexOf(b.month_name));
    
    // Send the sorted months as an array response 
    res.json(months);
  } catch (error) {
    console.error('Error fetching months:', error);
    res.status(500).send('Internal server error');
  } 
});


// //

// FILTERS //

// VECHILE FILTER //

// Get all vehicle IDs from the vehicle collection

app.get('/getvehicle_filter', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('vehicle');
    
    // Retrieve distinct vehicle_name values from the collection
    let distinctVehicleNames = await collection.distinct('vehicle_name');
    
    // Filter out empty strings
    distinctVehicleNames = distinctVehicleNames.filter(vehicleName => vehicleName !== '');
    
    // Map the distinct vehicle_names to an array of objects with required properties
    const formattedVehicleNames = distinctVehicleNames.map(vehicleName => ({
      vehicle_name: vehicleName
    }));
    
    // Send the formatted vehicle_names as an array response
    res.send(formattedVehicleNames);
  } catch (error) {
    console.error('Error fetching vehicle_names:', error);
    res.status(500).send('Internal server error');
  } 
});


// //

// HEAD CAT FILTER //

app.get('/gethead_cat_filter', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('head_cat'); // Replace 'your_collection_name' with the actual name of your collection
    // Retrieve distinct head_cat_name values from the collection
    let distinctHeadCatNames = await collection.distinct('head_cat_name');
    // Filter out empty strings
    distinctHeadCatNames = distinctHeadCatNames.filter(headCatName => headCatName !== '');
    // Map the distinct head_cat_names to an array of objects with required properties
    const formattedHeadCatNames = distinctHeadCatNames.map(headCatName => ({
      head_cat_name: headCatName
    }));
    // Send the formatted head_cat_names as an array response
    res.send(formattedHeadCatNames);
  } catch (error) {
    console.error('Error fetching head_cat_names:', error);
    res.status(500).send('Internal server error');
  } 
});

//  //

// SUB CAT FILTER //

  app.get('/getsub_cat_filter', async (req, res) => {
    try {
      // Connect to MongoDB
      await client.connect();
      const database = client.db('office');
      const collection = database.collection('sub_cat'); // Replace 'your_collection_name' with the actual name of your collection
      // Retrieve distinct sub_cat_name values from the collection
      let distinctSubCatNames = await collection.distinct('sub_cat_name');
      // Filter out empty strings
      distinctSubCatNames = distinctSubCatNames.filter(subCatName => subCatName !== '');
      // Map the distinct sub_cat_names to an array of objects with required properties
      const formattedSubCatNames = distinctSubCatNames.map(subCatName => ({
        sub_cat_name: subCatName
      }));
      // Send the formatted sub_cat_names as an array response
      res.send(formattedSubCatNames);
    } catch (error) {
      console.error('Error fetching sub_cat_names:', error);
      res.status(500).send('Internal server error');
    } 
  });

// EMP ID FILTER //
app.get('/getemployee_filter', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('employees');
    
    // Retrieve only the emp_name field from the collection
    let emp_names = await collection.distinct('emp_name');
    
    // Filter out empty strings
    emp_names = emp_names.filter(emp_name => emp_name !== '');
    
    // Sort the emp_names alphabetically
    emp_names.sort();
    
    // Map the emp_names to an array of objects with keys
    const formattedEmpNames = emp_names.map(emp_name => ({ emp_name }));
    
    // Send the formatted emp_names as a JSON response 
    res.json(formattedEmpNames);
  } catch (error) {
    console.error('Error fetching emp_name from form collection:', error);
    res.status(500).json({ error: 'Internal server error' });
  } 
});

// MONTH FILTER //

app.get('/getmonth_filter', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('month');
    // Retrieve only the month field from the collection
    let months = await collection.distinct('month_name');
    // Filter out empty strings
    months = months.filter(month => month.trim() !== '');
    // Define a custom sorting function for months
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    months.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
    // Send the sorted and filtered months as an array response 
    res.send(months);
  } catch (error) {
    console.error('Error fetching months from form collection:', error);
    res.status(500).send('Internal server error');
  } finally {
    // Close the MongoDB connection
  } 
});
// //

// YEAR FILTER //

app.get('/getyear_filter', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('fy_year');
    // Retrieve only the month field from the collection
    let year = await collection.distinct('fy_name');
    // Filter out empty strings
    year = year.filter(year => year !== '');
    // Sort the years based on fy_name in ascending order
    year.sort((a, b) => a - b);
    // Send the sorted and filtered years as an array response 
    res.send(year);
  } catch (error) {
    console.error('Error fetching year from form collection:', error);
    res.status(500).send('Internal server error');
  } 
});






// ADMIN YEAR //
app.get('/getfy_year_admin', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('fy_year');
    
    // Retrieve fy year data from the collection
    const categories = await collection.find({ }, { projection: {  } }).toArray();
    
    // Sort the categories based on fy_name in ascending order
    categories.sort((a, b) => parseInt(a.fy_name) - parseInt(b.fy_name));
    
    // Send the sorted categories as an array response 
    res.json(categories);
  } catch (error) {
    console.error('Error fetching fy years:', error);
    res.status(500).send('Internal server error');
  } 
});
// admin year//

// ADMIN YEAR //
app.get('/getfy_month_admin', async (req, res) => {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('office');
    const collection = database.collection('month');
    
    // Retrieve fy year data from the collection
    const categories = await collection.find({}, { projection: {} }).toArray();
    
    // Define an array of month names in order
    const monthOrder = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Sort the categories based on the index of month name in monthOrder array
    categories.sort((a, b) => monthOrder.indexOf(a.month_name) - monthOrder.indexOf(b.month_name));
    
    // Send the sorted categories as an array response 
    res.json(categories);
  } catch (error) {
    console.error('Error fetching month:', error);
    res.status(500).send('Internal server error');
  } 
});


// admin year//

// admin year store
app.post('/activateYear', async (req, res) => {
  try {
    const { fy_name} = req.body;

    // Access the year collection
    const database = client.db('office');
    const collection = database.collection('fy_year');

    // Check if a year with the same fy_name already exists
    const existingYear = await collection.findOne({ fy_name });

    if (existingYear) {
      // Update the existing document
      await collection.updateOne({ fy_name }, { $set: { fy_id:1 } });
    } else {
      // Insert a new document
      await collection.insertOne({ fy_name });
    }
    
    
  } catch (error) {
    console.error('Error storing year:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/lockYear', async (req, res) => {
  try {
    const { fy_name} = req.body;

    // Access the year collection
    const database = client.db('office');
    const collection = database.collection('fy_year');

    // Check if a year with the same fy_name already exists
    const existingYear = await collection.findOne({ fy_name });

    if (existingYear) {
      // Update the existing document
      await collection.updateOne({ fy_name }, { $set: { fy_id:0 } });
    } else {
      // Insert a new document
      await collection.insertOne({ fy_name });
    }
    
    
  } catch (error) {
    console.error('Error storing year:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/activateMonth', async (req, res) => {
  try {
    const { month_name} = req.body;

    // Access the year collection
    const database = client.db('office');
    const collection = database.collection('month');

    // Check if a year with the same month_name already exists
    const existingMonth = await collection.findOne({ month_name });

    if (existingMonth) {
      // Update the existing document
      await collection.updateOne({ month_name }, { $set: { month_id:1 } });
    } else {
      // Insert a new document
      await collection.insertOne({ month_name });
    }
    
    
  } catch (error) {
    console.error('Error storing year:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/lockMonth', async (req, res) => {
  try {
    const { month_name} = req.body;

    // Access the year collection
    const database = client.db('office');
    const collection = database.collection('month');

    // Check if a year with the same month_name already exists
    const existingMonth = await collection.findOne({ month_name });

    if (existingMonth) {
      // Update the existing document
      await collection.updateOne({ month_name }, { $set: { month_id:0} });
    } else {
      // Insert a new document
      await collection.insertOne({ month_name });
    }
    
    
  } catch (error) {
    console.error('Error storing year:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', () => {
  client.close().then(() => {
    console.log('MongoDB connection closed');
    server.close();
  });
});