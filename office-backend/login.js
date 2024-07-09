const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());

// Connect to your MySQL database.
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Vetree@1209',
  database: 'accounts', 
  port:"3306",
  user:"root"
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database.');
});

app.post('/api/post', async (req, res) => {
    const {
      username,
      password
    } = req.body;
  
    const sql =
      'INSERT INTO student_motivation(username,password) VALUES(?,?) ';
  
    base.query(
      sql,
      [
        username,
        password
      ],
      (err, ack) => {
        if (err) res.status(500).json({ error: `${err} is occurred` });
        else if (ack.affectedRows === 0)
          res.status(201).json({ error: `Record not inserted` });
        else res.status(200).json({ message: `App has published` });
      }
    );
  });

