var express = require('express');
var mysql = require('mysql');
var api = express.Router();

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

api.route('/notes')
  .post(function(req, res) {
    // Create
    
  })
  .get(function(req, res) {
    // List
  });
  
api.route('/notes/:node_id')
  .get(function(req, res) {
    // Read single
  })
  .put(function(req, res) {
    // Update single
  })
  .delete(function(req, res){
    // Delete single
  });

module.exports = api;
