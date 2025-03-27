const express = require('express');
const cors = require('cors');
const fs = require('fs');
const users = require('./sample.json');
const app = express();
const port = 8000;
app.use(
   cors({
      origin: "http://localhost:5173",
      method : ["GET","POST","PATCH","DELETE"],
   })
)
app.use(express.json());

//Display all users
app.get("/users",(req,res)=>{
   return res.json(users);
})

//Add new user
app.post("/users",(req,res)=>
{
   let {name,age,city} = req.body;
   if(!name || !age || !city)
   {
      return res.status(400).json({"message":"Please provide all details"})
   }
   let id = Date.now();
   users.push({id,name,age,city});
   fs.writeFile('./sample.json',JSON.stringify(users),(err,data) =>{
      return res.json({ "message": "User detail added success" });
   });
});

//Update user
app.patch("/users/:id",(req,res)=>
   {
      let id = Number(req.params.id);
      let {name,age,city} = req.body;
      
      if(!name || !age || !city)
      {
         return res.status(400).json({"message":"Please provide all details"})
      }
      
      let index=users.findIndex((user) => user.id === id);
   
      if (index === -1) return res.status(404).json({ "message": "User not found" });

      users.splice(index, 1, { ...users[index], name, age, city });

      fs.writeFile('./sample.json',JSON.stringify(users),(err,data) =>{
         if (err) return res.status(500).json({ "message": "Error updating user" });
         return res.json({ "message": "User detail updated" });
      });
   });

app.delete("/users/:id",(req,res)=>{
   let id = Number(req.params.id);
   let filteredUsers = users.filter((user) => user.id !== id);
   fs.writeFile('./sample.json',JSON.stringify(filteredUsers),(err,data) =>{
      return res.json(filteredUsers);
   });
});

app.listen(port, () => {console.log('Server is running on port: '+ port + ' http://localhost:'+port+'/users')});