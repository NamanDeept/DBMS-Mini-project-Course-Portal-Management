
var mysql = require('mysql');

var connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Naman@11",
      database: "Student_portal",
      multipleStatements: true
	});

connection.connect(function(err){
//	var sql = "alter user 'root'@'localhost' identified with mysql_native_password by 'Naman@11';";
if(err){
		console.log("Couldn't connect to the database");
}
else{
		console.log("Connection Successful");
}
});

module.exports= connection;