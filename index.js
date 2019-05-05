
const express =    require('express');
const app =        express();
const bodyParser = require('body-parser');
const session =    require('express-session');
var path =         require('path');
var db =           require('./database');
//var popup =        require('popup');
//import alert from 'alert-node';

app.set("view engine","ejs");

app.use(session({
	cookie: {
    path    : '/',
    httpOnly: false
    },
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(bodyParser.json());


app.post("/addStudent",function(req,res){
	var name =         req.body.Name;
    var enrollment =   req.body.Enrollment;
    var password =     req.body.pass;
    var email =        req.body.EmailStudent;
    var department =   req.body.dept;
    var gender =       req.body.gender;
	var sql =          "Insert into Student values('"+name+"','"+enrollment+"','"+email+"','"+department+"','"+gender+"','"+password+"');";
	db.query(sql,function(err,result){
		if(err){
			console.log("Unable to append to the database");
		}
		else{
			console.log('Success');
		}
	});
	res.render("SuccessfullAuth");
});

app.post('/addFaculty',function(req,res){
	var FacName =      req.body.facName;
	var FacCode =      req.body.facCode;
	var FacPassword =  req.body.facPassword;
	var FacMail =      req.body.facMail;
	var department =   req.body.dept;
	var gender =       req.body.gender;
	var sql =          "Insert into Faculty values('"+FacName+"','"+FacCode+"','"+FacMail+"','"+department+"','"+gender+"','"+FacPassword+"');";
	db.query(sql,function(err,result){
		if(err){
			console.log("Faculty couldn't be added due to network issues");
		}
		else
		{
			console.log("Faculty successfully added");
		}
	});
	res.render("successfullAuth"); 
});



app.post('/authStudent',function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	if(username && password){
		db.query('Select * from Student where Enrollment=? and Password=?',[username,password],function(err,result,fields){
			//console.log(result.length);
             if(result.length>0){	
               req.session.loggedin = true;
               req.session.username = username;
               res.redirect('/loginStudent/viewStudent');	
             }
             else{
             	console.log('Incorrect Username or Password');
             }
             res.end();
		});
	}
	
	else{
		console.log('Please Enter username and password');
		res.end();
	}	
});

app.post('/authFaculty',function(req,res){
	var username = req.body.facname;
	var password = req.body.facpassword;
	if(username && password){
		db.query('Select * from Faculty where Code=? and FacPassword=?',[username,password],function(err,result,fields){
			console.log(result.length);
			if(result.length>0){
				req.session.loggedin = true;
				req.session.username = username;
				//console.log(username);
				res.redirect('/loginFaculty/viewFaculty');
			}
			else{
				res.send('Incorrect Faculty Id or password')
			}
			res.end();
		});
	}
	else{
		res.send('Please fill out all the fields in the login');
		res.end();
	}
});

app.post("/addCourse",function(req,res){
	if(req.session.loggedin){
	//console.log(req.body.courseID);
	var coursecode = req.body.courseID;
	var username =   req.session.username;
	//console.log(username+" "+coursecode);
	var sql ="Insert into CourseStudent values('"+coursecode+"','"+username+"');"
	db.query(sql,function(err,result){
		if(err){
			console.log("Unable to append to the database");
		}
		else{
		console.log("successfuly enrolled");
	   }
	});
	res.redirect('/loginStudent/viewStudent');
	}
});

app.post("/addCourseFaculty",function(req,res){
	if(req.session.loggedin){
		var courseCode = req.body.courseID;
		var username =   req.session.username;
		console.log(courseCode+" "+username);
		var sql ="Insert into CourseTeacher values('"+username+"','"+courseCode+"');";
		db.query(sql,function(err,result){
			if(err){
				console.log("Could't add");
			}
			else{
				console.log("successfuly added to teaching Course");
			}
		});
		res.redirect("/loginFaculty/viewFaculty");
	}
});

app.post("/deleteCourseStudent",function(req,res){
	if(req.session.loggedin){
		var coursecode = req.body.courseID;
		var username =   req.session.username;
		db.query("Delete from CourseStudent where CourseCode =? and Enrollment=?",[coursecode,username],function(err,result){
			if(err)
			{
			    console.log("Can't delete from the database..Try again");
			    res.redirect(req.originalUrl);
			}
			else
			{
				console.log("The data entry successfuly deleted");
			}
		});
	}
});

app.post("/deleteCourseFaculty",function(req,res){
	if(req.session.loggedin){
		var coursecode = req.body.courseID;
		var username =   req.session.username;
		db.query("Delete from CourseTeacher where teacherID =? and CourseCode=?",[username,coursecode],function(err,result){
			if(err)
			{
			    console.log("Can't delete from the database..Try again");
			    res.redirect(req.originalUrl);
			}
			else
			{
				console.log("The data entry successfuly deleted");
			}
		});
	}
});

app.post("/addtoChat",function(req,response){
    var message = req.body.messageForm;
    if(req.session.loggedin){
    	var username = req.session.username;
    	var sql = "Insert into DiscussionForm values('"+username+"','"+message+"');";
    	db.query(sql,function(err,result){
    		if(err)
    		{
    			console.log("Discussion Form portal is currently not working try again later..")
    		}
    		else{
    			console.log("Message entry successfuly inserted"); 	
    			}
    	});
    }
});

app.post("/getResponses",function(req,response){
   if(req.session.loggedin){
      var username   =  req.session.username;
      var courseCode =  req.body.btn;
      var response1  =  req.body.solQ1;
      var response2  =  req.body.solQ2;
      var response3  =  req.body.solQ3;
      var response4  =  req.body.solQ4;
      var response5  =  req.body.solQ5;
      var sql        = "Insert into ResponseStudent values('"+username+"','"+courseCode+"','"+response1+"','"+response2+"','"+response3+"','"+response4+"','"+response5+"');";
      db.query(sql,function(error,results){
      	if(error){
      		console.log("Cannot append to the database correction required in answers!!!");
      	}
      	else{
      		response.send("Your Solutions has been submitted");
      	}
      });
    }
   else{
   	response.send("Please login to give this quiz");
   }
});

app.get("/getSolution",function(req,response){
	var enrollment = req.body.enrollCheck;
	var coursecode = req.body.codeCheck;
	console.log(enrollment+" "+coursecode);
    db.query("Select * from ResponseStudent where Enrollment=? and courseCode=?;Select * from QuizQuestions where courseCode=?;",[enrollment,coursecode,coursecode],function(err,results){
         res.render("QuizSolutions",{Enrollment:enrollment,Coursecode:CourseCode,response:results[0],questions:results[0]});
    });
});

app.get("/loginStudent/viewStudent",function(req,response){
    if(req.session.loggedin){
    	var username = req.session.username;
    	//console.log(username);
    	var sqlResult="";
	    db.query("Select * from DiscussionForm; Select * from Student where Enrollment=?;\
	    	Select Courses.CourseCode as CourseCode,Courses.Name,Courses.Description from Courses join CourseStudent on Courses.CourseCode = \
	        CourseStudent.CourseCode and CourseStudent.Enrollment =?;\
	    	Select * from Courses;",[username,username],function(err,result,fields){
        //      console.log(result[0]);
	    	 response.render('viewStudent',{form:result[0],user:result[1],sql:result[2],info:result[3]});
    	});
    }
    else{
    	response.render("errorPage");//Error page needs to be created here...
    }
});


app.get('/loginFaculty/viewFaculty',function(req,response){
	if(req.session.loggedin){
		var user = req.session.username;
        db.query('Select * from DiscussionForm;Select * from faculty where Code =?;\
        	Select Courses.CourseCode,Courses.Name,Courses.Description from Courses join CourseTeacher on Courses.CourseCode=CourseTeacher.CourseCode and\
        	 CourseTeacher.teacherID=?; Select * from Courses;Select * from ',[user,user],function(err,result,fields){
        	 	//console.log(result[1]);
        	 	response.render('viewFaculty',{form:result[0],user:result[1],CourseTaught:result[2],info:result[3]});
        	 });
	}
	else{
		response.render("errorPage");
	}	
});

app.get("/submit",function(req,res){
	res.send("Submitted Successfuly");
});

app.get("/quiz/:id",function(req,res){
	if(req.session.loggedin){
		var username =   req.session.username;
		var coursecode = req.params.id;
		
		db.query("select * from QuizQuestions where courseCode=?",[coursecode],function(err,result){
                res.render('quizApp',{username:username,courseInfo:coursecode,res:result});
		});
	}
	else{
		res.render("errorPage");
	}
});

app.get("/logout",function(req,res){
	req.session.loggedin = false;
	res.redirect("/");
});

app.get("/",function(req,res){
	res.render('home');
	
});

app.get("/loginStudent",function(req,res){
	res.render('loginStudent');
});

app.get("/loginTeacher",function(req,res){
	res.render('loginFaculty');
});

app.get("/registerStudent",function(req,res){
	res.render('registerStudent');
});

app.get("/registerTeacher",function(req,res){
	res.render('registerTeacher');
});

app.listen(8000,function(){
	console.log("Server Connection Successful");
});
