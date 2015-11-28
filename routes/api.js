var express = require('express');
var mysql = require('mysql');
var api = express.Router();
var bodyParser = require('body-parser');
api.use(bodyParser.json());

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'i035707',
  database        : 'ntd'
});

api.route('/note')
  .post(function(req, res) {
    console.log("Entering API/NOTE CREATING...");
    // Create
    var newNote = {
      NAME: req.body['Name'],
      CONTENT: req.body['Content'],
      PARID: req.body['ParentID']
    };
   
    // Now do the DB updates
    pool.getConnection(function(err, connection) {
      if (err) {
        console.error('CONNECTION error: ', err);
          res.statusCode = 503;
          res.send({
              result: 'error',
              err:    err.code
          });
      }
      
      // Use the connection       
      var localquery = connection.query( 'INSERT INTO t_note SET ?', newNote, function(err, rows) {
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
      console.log(localquery.sql); // get raw query
    });
  })
  .get(function(req, res) {
    // List
    console.log("Entering API/NOTE LISTING...");
   
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
    console.log("Entering API/NOTE READING...");
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
      connection.query( 'SELECT * FROM t_note WHERE ID = ?', req.params.node_id, function(err, rows) {
        if (err) {
          console.error('DB error: ',err);
          console.error(err);
          res.statusCode = 500;
          res.send({
              result: 'error',
              err:    err.code
          });
        } else {
          var newNote = { };
          if (rows.length === 1) {
            newNote = {
              Name: rows[0].NAME,
              Content: rows[0].CONTENT,
              ParentID: rows[0].PARID
            } ; 
          }
          res.send({
              result: 'success',
              err:    '',
              json:   newNote,
              length: rows.length
           });
        }
        connection.release();
    });
  });
  })
  .put(function(req, res) {
    console.log("Entering API/NOTE Updating...");
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
      var localquery = connection.query( 'SELECT * FROM t_note WHERE ID = ? FOR UPDATE;', req.params.node_id, function(err, rows) {
        if (err) {
          console.error('DB error: ',err);
          console.error(err);
          res.statusCode = 500;
          res.send({
              result: 'error',
              err:    err.code
          });
        } else {
          if (rows.length === 1) {
            var updNote = {
              NAME: req.body['Name'],
              CONTENT: req.body['Content'],
              PARID: req.body['ParentID']
            };
            var localquery2 = connection.query( 'UPDATE t_note SET ? WHERE ID = ?', [updNote, req.params.node_id], function(err2, rows2) {
              if (err2) {
                console.error('DB error: ',err);
                console.error(err2);
                res.statusCode = 500;
                res.send({
                    result: 'error',
                    err:    err2.code
                });
              } else {
                res.send({
                    result: 'success',
                    err:    ''
                });
              }
            });
            console.log(localquery2.sql); // get raw query 
          }
        }
        connection.release();
    });
    
    console.log(localquery.sql); // get raw query
  });    
  })
  .delete(function(req, res){
    console.log("Entering API/NOTE Deleting...");
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
      connection.query( 'DELETE FROM t_note WHERE ID = ?', req.params.node_id, function(err, rows) {
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
              err:    ''
           });
        }
        
        connection.release();
      });
    });
    
  });

module.exports = api;
