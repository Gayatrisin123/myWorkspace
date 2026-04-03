const express = require('express');
const users = require("./MOCK_DATA.json");
const mongoose = require("mongoose");


const fs = require("fs");
const req = require('express/lib/request');

const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: false }));

mongoose
.connect("mongodb://localhost:27017/userdb")
.then(() => console.log("connected to mongodb"))
.catch((err) => console.log("error connecting to mongodb", err)); 
//connect to mongodb schema and model

/*const userSchema = new mongoose.Schema({
   firstName:{
    type : String,
    required : true,
   },
    lastName : {
        type : String,
        
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    jobTitle : {
        type : String,
    },
    gender : {
        type : String,
    }
    },{timestamps : true },
);


const User = mongoose.model("User", userSchema);
*/

//middleware

/*app.use((req, res, next) => {
  console.log("hello from middleware");
 //return res.json({mgs : "hello from middle"});
 req.myUserName = "Gayatri singh";
  next();
});



app.use((req, res, next) => {
  console.log("hello from middleware 2", req.myUserName);
  //return res.json({ msg: "hey" });
  next();
});

*/


app.use((req, res, next) => {
  fs.appendFile("log.txt", `\n ${Date.now()} : ${req.method} :  ${req.path}\n`, (err, data) => {
    next();
  });
    

});

app.get("/api/users", (req, res) => {
  //console.log("i am in get route", req.myUserName);
  return res.json(users);
});

app.get("/users", async (req, res) => {
  const allDbUsers = await User.find({});
  /*const html = ` <ul>
    ${users.map(user => `<li>${user.first_name} ${user.last_name}</li>`).join("")}
  </ul>`;*/
  const html = ` <ul>
    ${allDbUsers.map(user => `<li>${user.firstName} -  ${user.email}</li>`).join("")}
  </ul>`;
  res.send(html);
});


app.get("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((user) => user.id === id);
  return res.json(user);    
});

app.post("/api/users", async (req, res) => {
  //create new user logic here
  const body = req.body;
  //console.log("Body", body);


  
  const result = await User.create({
    firstName : body.first_name,
    lastName : body.last_name,
    email : body.email,
    gender : body.gender,
    jobTitle : body.job_title,
  });


  console.log("result", result);
  return res.status(201).json({ Status: "success"});

 /* users.push({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    gender: body.gender,
    job_title: body.job_title,
  })*/

  /*users.push({...body, id : users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ Status: "success", id : users.length });
  });*/
  
});

app.patch("/api/users/:id", (req, res) => {
  //update user logic here
 
  return res.json({ Status: "pending" });
});


app.delete("/api/users/:id", (req, res) => {
  //delete user logic here
  
  return res.json({ Status: "pending" });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});