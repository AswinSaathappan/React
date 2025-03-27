import React from 'react';
import axios from 'axios';
import {useEffect,useState} from 'react';
import './App.css';

function App(){

  const[users,setUsers] = useState([]);
  const [filterUsers,setFilterUsers] = useState([]);
  const [isModalOpen,setIsModalOpen] = useState(false);
  const [userData,setUserData] = useState({name:"",age:"",city:""});


  const getAllUsers = async ()=>{
    await axios.get('http://localhost:8000/users')
    .then((res)=>{
      console.log(res.data);
      setUsers(res.data);
      setFilterUsers(res.data);});
  }
  
  useEffect(()=>{
    getAllUsers();
  },[]);

  //search function
  const handleSearchChange = (e)=>{
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter((user)=>{
      return user.name.toLowerCase().includes(searchText) || user.city.toLowerCase().includes(searchText);
    });
    setFilterUsers(filteredUsers);
  }

  //delete function
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this record?");
    if (isConfirmed){
    await axios.delete(`http://localhost:8000/users/${id}`).then((res) => {
      setUsers(res.data);
      setFilterUsers(res.data);
    });
  }
}

//Close Modal
const closeModal = () =>{
  setIsModalOpen(false);
  getAllUsers();
};


//Add user details
const handleAddRecord = () =>{
    setUserData({name:"",age:"",city:""});
    setIsModalOpen(true);

}; 


const handleData = (e)=>{
    setUserData({...userData,[e.target.name]:e.target.value});
}

const handleSubmit = async (e) =>{
  e.preventDefault();
  if(userData.id)
  {
    if(userData.name === "" || userData.age === "" || userData.city === ""){
      alert("Please enter all the details");
      return;
    }
    await axios.patch(`http://localhost:8000/users/${userData.id}`,userData)
    .then((res)=>
      {
        console.log(res);
      getAllUsers();
      })
      .catch((err)=>{
        console.log(err);
      }
      );
  }
  else{
  if(userData.name === "" || userData.age === "" || userData.city === ""){
    alert("Please enter all the details");
    return;
  }
  await axios.post('http://localhost:8000/users',userData)
  .then((res)=>
    {
      console.log(res);
      getAllUsers();
    })
    .catch((err)=>{
      console.log(err);
    }
    );
    
}
closeModal();
setUserData({name:"",age:"",city:""});
}

const handleUpdateRecord = (user) =>{
  setUserData(user);
  setIsModalOpen(true);
}




    return(
      <>
      <div className = "container">
        <h3>CRUD Application with React.js Frontend and Node.js Backend</h3>
        <div className = "input-search">
          <input type="search" placeholder="Search Text Here" onChange={handleSearchChange}></input>
          <button className="btn green" onClick = {handleAddRecord}>Add Record</button>
        </div>
        <table className = "table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filterUsers && filterUsers.map((user,index) =>{
            return(
          <tr key={user.id}>
            <td>{index + 1}</td>
            <td>{user.name}</td>
            <td>{user.age}</td>
            <td>{user.city}</td>
            <td><button className="btn green" onClick={()=>handleUpdateRecord(user)}>Edit</button></td>
            <td><button className="btn red" onClick = {()=>handleDelete(user.id)}>Delete</button></td>
            </tr>);
          })}
        </tbody>
        </table>
        {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={userData.name} onChange={handleData} />
                  <label>Age</label>
                  <input type="number" name="age" value={userData.age} onChange={handleData} />
                  <label>City</label>
                  <input type="text" name="city" value={userData.city} onChange={handleData} />
                  <button className="btn green" onClick={handleSubmit}> {userData.id ? "Update User" : "Add User"}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

export default App;