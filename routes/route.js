module.exports = function(app, passport, connection) {

	app.post('/api/signup', passport.authenticate('local-signup'),function(req,res,data){
   console.log("testing")
    // console.log('data:',data)
    // if(data){
    //   res.json(data)
    // }
    res.json(data)
  });

// process the login form
app.post('/api/login', passport.authenticate('local-login'),
function(req, res) {
  console.log("hello");

  if (req.body.remember) {
    req.session.cookie.maxAge = 1000 * 60 * 3;
  } else {
    req.session.cookie.expires = false;
  }
  res.json({success:true})
});

app.get('/api/logout', function(req, res) {
  req.logout();
  res.json({success:true})
});



app.get('/api', (req, res) => {
  // simple query 2
connection.query(
  //'SELECT * FROM t_list_locations;',
  'SELECT * FROM t_list_locations;',
  function(error, results, fields) {
    // console.log(results); // results contains rows returned by server
    // console.log(fields); // fields contains extra meta data about results, if available
    //test item go
    if (error) return res.json({ error: error });
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
  //"call 01_newprovider_totbymedctr();",
  function(error, results, fields) {
    //console.log(results); // results contains rows returned by server
    //console.log(fields); // fields contains extra meta data about results, if available
    if (error) return res.json({ error: error });
    res.json(results[0])
  }
);
})

app.get('/api/provmed/:cityname', (req, res) => {
  // simple query
  //console.log(req.params.cityname)
  // console.log(`SELECT * FROM t_newprovider WHERE MedCtr like '${req.params.cityname}'`)
connection.query(
  // `SELECT * FROM q_newprovider_mtgdata WHERE MedCtr like '${req.params.cityname}';`,
  `SELECT * FROM q_newprovider_mtgdata WHERE MedCtr like '${req.params.cityname}';`,
  function(error, results, fields) {
    // console.log(results); // results contains rows returned by server
    //console.log(fields); // fields contains extra meta data about results, if available
    if (error) return res.json({ error: error });
    res.json(results)

  }
);
})

app.get('/api/provmed2/:ID_newprov', (req, res) => {
connection.query(
  //`SELECT * FROM q_newprovider_phasesbyprovider WHERE ID_newprov = '${req.params.ID_newprov}';`,
  `SELECT * FROM q_newprovider_phasesbyprovider WHERE ID_newprov = '${req.params.ID_newprov}';`,
  function(error, results, fields) {
    // console.log(results); // results contains rows returned by server
    //console.log(fields); // fields contains extra meta data about results, if available
    if (error) return res.json({ error: error });
    res.json(results)

  }
);
})

app.get('/api/provmed3Status', (req, res) => {
  connection.query(
    `SELECT t_list_newprov_statustype.statusDesc FROM t_list_newprov_statustype 
     WHERE t_list_newprov_statustype.active = 1 
     AND t_list_newprov_statustype.module = 'New Provider';`,
    function(error, results, fields) {
      // console.log(results); // results contains rows returned by server
      //console.log(fields); // fields contains extra meta data about results, if available
      if (error) return res.json({ error: error });
      res.json(results)
  
    }
  );
  })

app.get('/api/provmed3/:idnewprov/:idphase', (req, res) => {
  connection.query(
    `SELECT * FROM q_newprovider_phasesbyprovider WHERE ID_newprov = '${req.params.ID_newprov}';`,
    function(error, results, fields) {
      // console.log(results); // results contains rows returned by server
      //console.log(fields); // fields contains extra meta data about results, if available
      if (error) return res.json({ error: error });
      res.json(results)
  
    }
  );
  })

  app.put('/api/provmed2/edit', (req, res) => {
    //console.log(req.body)
    connection.query(
      `UPDATE t_newprovider_trngphases  
        SET status='${req.body.status}', status_date=CURDATE(), comments='${req.body.comments}', reviewer='${req.body.reviewer}' 
        WHERE ID_phase='${req.body.ID_phase}';`,
      function(error, results, fields) {
        // console.log(results); // results contains rows returned by server
        // console.log(fields); // fields contains extra meta data about results, if available
        //console.log("inserted, ID: " + result.insertId);
        if (error) return res.json({ error: error });
        res.json(req.body)
      }
    );
    })

    app.put('/api/provmed2/completed', (req, res) => {
      // console.log("status:",req.body.ID_newprov, req.body.status)
      connection.query(
        `UPDATE t_newprovider_mtgdata  
          SET OverallStatus='${req.body.status}' 
          WHERE ID_newprov='${req.body.ID_newprov}';`,
        function(error, results, fields) {
          if (error) return res.json({ error: error });
          res.json(req.body)
        }
      );
      })


app.get('/api/edulist', (req, res) => {
  // simple query
connection.query(
  'SELECT * FROM t_list_specialty',
  function(error, results, fields) {
    // console.log(results); // results contains rows returned by server
    // console.log(fields); // fields contains extra meta data about results, if available
    if (error) return res.json({ error: error });
    res.json(results)
  }
);
  // res.send('Hello World!')

})

   app.get('/api/providers', (req, res) => {
    // simple query
  connection.query(
    // "SELECT 0 as ID_newprov, 'na' as CPMID, 'na' as NUID, '2021-12-31' as HireDate, 'Please make a Selection' as ProvName, 'na' as ProvType,   'na' as ProvRole, 'na' as MedCtr, 'na' as MedOffice, 'na' as Specialty, 'na' as Dept, 'na' as OverStatus, '2021-12-31' as OverallStatusDate, 0 as ManuallyCreated FROM t_newprovider_mtgdata Union SELECT * FROM t_newprovider_mtgdata;",
    //"SELECT * FROM t_list_newprov_providers;",
    "SELECT * FROM t_list_newprov_providers;",
    function(error, results, fields) {
      // console.log(results); // results contains rows returned by server
      // console.log(fields); // fields contains extra meta data about results, if available
      if (error) return res.json({ error: error });
      res.json(results)
    }
  );
    // res.send('Hello World!')
  
  })

  app.post('/api/addmtg', (req, res) => {
     console.log('api/addmtg', req.body)
     connection.query(
      `call 01_newprovider_createnewmeeting('${req.body.ProvName}','${req.body.reviewer}');`,

      function(error, results, fields) {
        console.log('INSERT ID:',results.insertId);
        if (error) return res.json({ error: error });
        res.json(req.body)
      }
    );
})


app.delete('/api/deletemtg', (req, res) => {
  console.log(req.body)
connection.query(
  `call 01_newprovider_deletemtg('${req.body.idnewprov}');`,
  function(error, results, fields) {
    if (error) return res.json({ error: error });
    res.json(results)
  }
);
  
})

}

function isLoggedIn(req, res, next) {
  console.log("isAuthenticated ", req.isAuthenticated())
// if user is authenticated in the session, carry on
if (req.isAuthenticated())
  return next();

// if they aren't redirect them to the home page
res.redirect('/');
}