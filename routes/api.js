var express = require('express');
var mysql = require('mysql');
var api = express.Router();
var bodyParser = require('body-parser');
var crypt = require('crypto');
api.use(bodyParser.json());

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'i035707',
  database        : 'ntd'
});


//////////////////////////////////////////////////////////////
// Functions
var updateUserLog = function(connection, usr, res, logType) {
    // Log type:
    // A: Create/Register
    // B: Login
    // C: Logout
    // D: Password change
    // E: RESERVED
    // F: RESERVED
    // G: RESERVED 
    
    var localquery2 = connection.query( 'SELECT max(SEQNO) as SEQNO FROM t_user_log WHERE USER = ?', usr, 
      function(err, rows) {
        if (err) {
          console.error('DB error: ',err);
          console.error(err);
          
          res.statusCode = 500;
          res.send({
              result: 'error',
              err:    err.code
          });
        } else {
          var maxSeq = parseInt(rows[0].SEQNO);
          maxSeq = maxSeq + 1;
          var localquery3 = connection.query( 'INSERT INTO t_user_log SET ?', 
              {
                USER: usr,
                SEQNO: maxSeq,
                LOGTYPE: 'B',
                STARTPOINT: new Date(),
                ENDPOINT: new Date()
              }, 
              function(err, rows) {
                if (err) {
                  console.error('DB error: ',err);
                  console.error(err);
                  
                  res.statusCode = 500;
                  res.send({
                      result: 'error',
                      err:    err.code
                  });
                  
                } else {
                  res.statusCode = 200;
                  var txt = null;
                  if (logType === 'A') txt = 'User registered successfully!';
                  else if(logType === 'B') txt = 'Login successfully!';
                  else if (logType === 'C') txt = 'Logout successfully!';
                  else if (logType === 'D') txt = 'Password changed!';
                  
                  res.send({
                      result: 'success',
                      err:    txt
                  });
                }
              });
          console.log(localquery3.sql); // get raw query
        }
    });
    console.log(localquery2.sql); // get raw query
}
function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
 
    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;
 
      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
 
      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
 
    return uuid.join('');
}

var sess = null;
// Object for session
// {
//  CurrentUser
//  Login date
// }

api.route('/register')
  .post(function(req, res) {
    // Validate the inputting!
    var usr = req.body['Name'];
    var aas = req.body['Alias'];
    var pwd = req.body['Password'];
    if (!usr) {
      res.statusCode = 500;
      res.send({
        result: 'error',
        err:    'User is manadatory!'
      });
      return;
    } else {
      if (usr.length <= 0 || usr.length > 30) {
        res.statusCode = 500;
        res.send({
          result: 'error',
          err:    'User is invalid!'
        });
        return;        
      }
    }
    if (!pwd) {
      res.statusCode = 500;
      res.send({
        result: 'error',
        err:    'Password is manadatory!'
      });
      return;      
    } else {
      if (pwd.length <= 0 || pwd.length > 30) {
        res.statusCode = 500;
        res.send({
          result: 'error',
          err:    'Password is invalid!'
        });
        return;        
      }      
    }
    
    var shasum = crypt.createHash('sha1');
    shasum.update(pwd, 'utf8');
    var dstr = shasum.digest('base64');
    console.log(dstr.toString());

    // Now do the DB updates
    pool.getConnection(function(err, connection) {
      if (err) {
        console.error('CONNECTION error: ', err);
        res.statusCode = 503;
        res.send({
            result: 'error',
            err:    err.code
        });
        return;
      }
      
      // Use the connection
      var localquery = connection.query( 'INSERT INTO t_user SET ?', {
          USER: usr,
          PASSWORD: dstr.toString(),
          ALIAS: aas,
          OTHER: ''
        }, function(err, rows) {
          if (err) {
            console.error('DB error: ',err);
            console.error(err);
            
            res.statusCode = 500;
            res.send({
                result: 'error',
                err:    err.code
            });
          } else {
            // Update the log!
            updateUserLog(connection, usr, res, 'A');
          }
        
          connection.release();
      });
      console.log(localquery.sql); // get raw query
    });
  });
  
api.route('/login')
  .post(function(req, res) {
    sess = req.session;
    if (sess.CurrentUser) {
      res.statusCode = 503;
      res.send({
          result: 'error',
          err:    'Already login!'
      });
    } else {
      // Verify the codes
      var usr = req.body['Name'];
      var pwd = req.body['Password'];
      if (!usr) {
        res.statusCode = 500;
        res.send({
          result: 'error',
          err:    'User is manadatory!'
        });
        return;
      } else {
        if (usr.length <= 0 || usr.length > 30) {
          res.statusCode = 500;
          res.send({
            result: 'error',
            err:    'User is invalid!'
          });
          return;        
        }
      }
      if (!pwd) {
        res.statusCode = 500;
        res.send({
          result: 'error',
          err:    'Password is manadatory!'
        });
        return;      
      } else {
        if (pwd.length <= 0 || pwd.length > 30) {
          res.statusCode = 500;
          res.send({
            result: 'error',
            err:    'Password is invalid!'
          });
          return;        
        }      
      }
      
      var shasum = crypt.createHash('sha1');
      shasum.update(pwd, 'utf8');
      var dstr = shasum.digest('base64');
      console.log(dstr.toString());
      
      pool.getConnection(function(err, connection) {
        if (err) {
          console.error('CONNECTION error: ', err);
            res.statusCode = 503;
            res.send({
              result: 'error',
              err:    err.code
            });
            return;
        }
        
        // Use the connection
        var localquery = connection.query( 'SELECT * FROM t_user WHERE USER = ? AND PASSWORD = ?', 
          [usr, dstr.toString() ],
          function(err, rows) {
            if (err) {
              console.error('DB error: ',err);
              console.error(err);
              
              res.statusCode = 500;
              res.send({
                  result: 'error',
                  err:    err.code
              });
            } else {
              if (rows.length !== 1) {
                res.statusCode = 500;
                res.send({
                    result: 'error',
                    err:    'Name/Password not match!'
                });
                return;
              }
              
              updateUserLog(connection, usr, res, 'B');
              
              req.session.CurrentUser = usr;              
            }
          
            connection.release();
        });
        
        console.log(localquery.sql); // get raw query
      });
    }
  });
  
api.route('/logout')
  .post(function(req, res) {
     // We will destroy the session now.
     sess = req.session;
     if (!sess || !sess.CurrentUser) {
        res.statusCode = 500;
        res.send({
            result: 'error',
            err:    'No login!'
        });
        return;
     }
     
     req.session.destroy(function(err) {
         if(err)
         {
             console.log(err);
         }
         else
         { 
             // Do nothing!
             pool.getConnection(function(err, connection) {
                 if (err) {
                    console.error('CONNECTION error: ', err);
                        res.statusCode = 503;
                        res.send({
                          result: 'error',
                          err:    err.code
                        });
                        return;
                  } else {
                    updateUserLog(connection, sess.CurrentUser, res, 'C');
                    connection.release();
                  }
            });
         }
      });
   });
    
api.route('/note')
  .post(function(req, res) {
     console.log("Entering API/NOTE CREATING...");
     sess = req.session;
     if (!sess || !sess.CurrentUser) {
        res.statusCode = 500;
        res.send({
            result: 'error',
            err:    'No login!'
        });
        return;
     }
    
    // Create
    var newNote = {
      ID: uuid(32, 16),
      NAME: req.body['Name'],
      CONTENT: req.body['Content'],
      PARID: req.body['ParentID'],
      TAGS: req.body['Tags']
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
      } else {
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
          });
          console.log(localquery.sql); // get raw query
      }
      connection.release();
    });
  })
  .get(function(req, res) {
    // List
    console.log("Entering API/NOTE LISTING...");
    sess = req.session;
    if (!sess || !sess.CurrentUser) {
        res.statusCode = 500;
        res.send({
            result: 'error',
            err:    'No login!'
        });
        return;
    }
     
    pool.getConnection(function(err, connection) {
      if (err) {
        console.error('CONNECTION error: ',err);
        res.statusCode = 503;
        res.send({
           result: 'error',
           err:    err.code
        });
        return;
      } else {
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
        });
      }
      connection.release();
    });
 })
 ;
 
api.route('/note/:node_id')
  .get(function(req, res) {
    console.log("Entering API/NOTE READING...");
    sess = req.session;
    if (!sess || !sess.CurrentUser) {
        res.statusCode = 500;
        res.send({
            result: 'error',
            err:    'No login!'
        });
        return;
    }
    
    pool.getConnection(function(err, connection) {
      if (err) {
        console.error('CONNECTION error: ',err);
        res.statusCode = 503;
        res.send({
           result: 'error',
           err:    err.code
        });
      } else {
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
        });
      }
      connection.release(); 
    });
  })
  
  .put(function(req, res) {
    console.log("Entering API/NOTE Updating...");
    sess = req.session;
    if (!sess || !sess.CurrentUser) {
        res.statusCode = 500;
        res.send({
            result: 'error',
            err:    'No login!'
        });
        return;
    }

    pool.getConnection(function(err, connection) {
      if (err) {
        console.error('CONNECTION error: ',err);
          res.statusCode = 503;
          res.send({
            result: 'error',
            err:    err.code
          });
          return;
      } else {
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
      }
    });    
  })
  
  .delete(function(req, res){
    console.log("Entering API/NOTE Deleting...");
    sess = req.session;
    if (!sess || !sess.CurrentUser) {
        res.statusCode = 500;
        res.send({
            result: 'error',
            err:    'No login!'
        });
        return;
    }

    pool.getConnection(function(err, connection) {
      if (err) {
        console.error('CONNECTION error: ',err);
          res.statusCode = 503;
          res.send({
              result: 'error',
              err:    err.code
          });
      } else {
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
        }
    });     
  });

module.exports = api;