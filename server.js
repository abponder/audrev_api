const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
require('dotenv').config();
const mysql = require('mysql2');
app.use(express.json());

// create the connection to database
const connection = mysql.createConnection({
  host:process.env.host,
  user:process.env.user,
  database:process.env.database,
  password:process.env.password
});

app.get('/api', (req, res) => {
  // simple query
connection.query(
  'SELECT * FROM t_list_locations;',
  function(err, results, fields) {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
    res.json(results)
  }
);
  // res.send('Hello World!')

})

app.get('/api/provlist', (req, res) => {
  // simple query
  //console.log(req.params.cityname)
  // console.log(`SELECT * FROM t_newprovider WHERE MedCtr like '${req.params.cityname}'`)
connection.query(
  // "SELECT * FROM t_newprovider WHERE MedCtr like 'Los Angeles'",
  //"SELECT * FROM q_newprovider_mtgdata;",
  "call 01_newprovider_totbymedctr();",
  function(err, results, fields) {
    //console.log(results); // results contains rows returned by server
    //console.log(fields); // fields contains extra meta data about results, if available
    res.json(results[0])
  }
);
})

app.get('/api/provmed/:cityname', (req, res) => {
  // simple query
  //console.log(req.params.cityname)
  // console.log(`SELECT * FROM t_newprovider WHERE MedCtr like '${req.params.cityname}'`)
connection.query(
  `SELECT * FROM audrev.q_newprovider_mtgdata WHERE MedCtr like '${req.params.cityname}';`,
  function(err, results, fields) {
    console.log(results); // results contains rows returned by server
    //console.log(fields); // fields contains extra meta data about results, if available
    res.json(results)

  }
);
})

app.get('/api/provmed2/:ID_newprov', (req, res) => {
connection.query(
  `SELECT * FROM audrev.q_newprovider_phasesbyprovider WHERE ID_newprov = '${req.params.ID_newprov}';`,
  function(err, results, fields) {
    console.log(results); // results contains rows returned by server
    //console.log(fields); // fields contains extra meta data about results, if available
    res.json(results)

  }
);
})

app.get('/api/provmed3Status', (req, res) => {
  connection.query(
    `SELECT audrev.t_list_newprov_statustype.statusDesc FROM audrev.t_list_newprov_statustype 
     WHERE audrev.t_list_newprov_statustype.active = 1 
     AND audrev.t_list_newprov_statustype.module = 'New Provider';`,
    function(err, results, fields) {
      console.log(results); // results contains rows returned by server
      //console.log(fields); // fields contains extra meta data about results, if available
      res.json(results)
  
    }
  );
  })

app.get('/api/provmed3/:idnewprov/:idphase', (req, res) => {
  connection.query(
    `SELECT * FROM audrev.q_newprovider_phasesbyprovider WHERE ID_newprov = '${req.params.ID_newprov}';`,
    function(err, results, fields) {
      console.log(results); // results contains rows returned by server
      //console.log(fields); // fields contains extra meta data about results, if available
      res.json(results)
  
    }
  );
  })

  app.put('/api/provmed2/edit', (req, res) => {
    // console.log(req.body)
    connection.query(
      `UPDATE audrev.t_newprovider_trngphases  
        SET status='${req.body.status}', status_date=CURDATE(), comments='${req.body.comments}' 
        WHERE ID_phase='${req.body.ID_phase}';`,
      function(error, results, fields) {
        // console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        if (error) return res.json({ error: error });
        res.json(req.body)
      }
    );
    })



app.get('/api/edulist', (req, res) => {
  // simple query
connection.query(
  'SELECT * FROM t_list_specialty;',
  function(err, results, fields) {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
    res.json(results)
  }
);
  // res.send('Hello World!')

})

app.listen(PORT, () => console.log(`server listening on ${PORT}`));


