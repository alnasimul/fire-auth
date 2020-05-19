import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase-config';

firebase.initializeApp(firebaseConfig);
const provider = new firebase.auth.GoogleAuthProvider();

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    error: '',
    existingUser: false,
    isValid: false
  })
  const handelSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, email, photoURL } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }

        setUser(signedInUser);
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }

  const handelSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        existingUser:true
      }

      setUser(signedOutUser);
      console.log(res);
    }).catch(err => {

    })
    console.log("SignOut Clicked");
  }
const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
const hasNumber = password => /\d/.test(password);

  const handelChange = e =>{
    const userInfo = {
      ...user
    }

    //perform validation 
    let isValid = true;


    if(e.target.name === "email"){
      isValid = is_valid_email(e.target.value);
    }else if(e.target.name === "password"){
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }

    userInfo[e.target.name] = e.target.value;
    userInfo.isValid = isValid;
    setUser(userInfo);
   
  }
  const createAccount = (event) => {
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email,user.password)
      .then(res =>{
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
        
    
    }
    else {
      console.log("form is not valid",user.email,user.password);
    }
    event.preventDefault();
    event.target.reset();
}
const switchUser = e => {
    console.log(e.target.checked);
    const createdUser = {...user}
    createdUser.existingUser = e.target.checked;
    setUser(createdUser);
}
const signInUser = e =>{
  if(user.isValid){
    firebase.auth().signInWithEmailAndPassword(user.email,user.password)
    .then(res =>{
      console.log(res);
      const createdUser = {...user};
      createdUser.isSignedIn = true;
      createdUser.error = '';
      setUser(createdUser);
    })
    .catch(err => {
      console.log(err.message);
      const createdUser = {...user};
      createdUser.isSignedIn = false;
      createdUser.error = err.message;
      setUser(createdUser);
    })
  }
    e.preventDefault();
    e.target.reset();
}
  return (
    <div className="App">{
      user.isSignedIn ? <button onClick={handelSignOut}>Sign Out</button> : <button onClick={handelSignIn}>Sign In</button>
    }
     
    {user.isSignedIn && <div>
        <p>Welcome, {user.name}</p>
        <p>Your Email : {user.email}</p>
        <img src={user.photo} alt="" />
      </div>}
      <h1>Our own Authentication </h1>
      <br/>
        <input type="checkbox" name="switchForm" id="switchForm" onChange={switchUser}/>
        <label htmlFor="switchForm">Returning User</label>
        <form onSubmit={signInUser} style={{display: user.existingUser ? 'block' : 'none' }}>
        <input type="text" name="email" onBlur={handelChange}placeholder="Your Email" required/>
        <br/>
        <input type="password" name="password" onBlur={handelChange} placeholder="Your Password" required/>
        <br/>
        <input type="submit" value="Sign In"/>
        {/* <button onClick={createAccount}> Create Account</button> */}
      </form>
      <form onSubmit={createAccount} style={{display: user.existingUser ? 'none' : 'block'}}>
        <input type="text" name="name" onBlur={handelChange}placeholder="Your Name" required/>
        <br/>
        <input type="text" name="email" onBlur={handelChange}placeholder="Your Email" required/>
        <br/>
        <input type="password" name="password" onBlur={handelChange} placeholder="Your Password" required/>
        <br/>
        <input type="submit" value="Create Account"/>
        {/* <button onClick={createAccount}> Create Account</button> */}
      </form>
      {
        user.error && <p style={{color:'red'}}>{user.error}</p>
      }
    </div>
  );
}

export default App;
