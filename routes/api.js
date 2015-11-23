var express = require('express');
var mysql = require('mysql');
var api = express.Router();

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'i035707',
  database        : 'ntd'
});

// Database connection here.
// Following codes tested successfully 
// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//     host : 'localhost',
//     port : 3306,
//     user : 'root',
//     password : '123456',
//     database : 'test',
//     charset : 'UTF8_GENERAL_CI',
//     debug : false
// });
//  
// connection.connect();
// connection.query('USE hih', function(error, rows, fields) {
//         if(error) throw error;
//     });
// connection.query('SELECT * FROM t_user', function selectCb(error, results, fields) {
//       if (error) throw error;
//       // Uncomment these if you want lots of feedback
//       //console.log('Results:');
//       //console.log(results);
//       //console.log('Field metadata:');
//       //console.log(fields);
//       //console.log(sys.inspect(results));
//        
//       if(results.length > 0)
//       {   
//         for(var i = 0; i < results.length; i ++) {
//           console.log(' === ' + i.toString() + ' === ');
//           console.log('User ID: ' + results[i]['UserID']);
//           console.log('Display As: ' + results[i]['DISPLAYAS']);
//         }       
//         //var firstResult = results[0];
//         
//       }
//     });
// connection.end();

api.route('/note')
  .post(function(req, res) {
    // Create
    
  })
  .get(function(req, res) {
    // List
    console.log("GET on API.NOTE");
    //console.log(req);
    //res.setHeader({ 'Content-Type': 'application/json' });
    
    pool.getConnection(function(err, connection) {
      if (err) {
        console.error('CONNECTION error: ',err);
          res.statusCode = 503;
            res.send({
                result: 'error',
                err:    err.code
            });
      }
      
      // Use the connection
      connection.query( 'SELECT * FROM t_note', function(err, rows) {
        if (err) {
          console.error('DB error: ',err);
          console.error(err);
          res.statusCode = 500;
          res.send({
              result: 'error',
              err:    err.code
          });
        } else {
           res.send({
              result: 'success',
              err:    '',
              json:   rows,
               length: rows.length
           });
        }
        connection.release();
    });
  });
 })
 ;
 
api.route('/note/:node_id')
  .get(function(req, res) {
    // Read single
    res.setHeader({ 'Content-Type': 'application/json' });
  })
  .put(function(req, res) {
    // Update single
    res.setHeader({ 'Content-Type': 'application/json' });
  })
  .delete(function(req, res){
    // Delete single
    res.setHeader({ 'Content-Type': 'application/json' });
  });

module.exports = api;
