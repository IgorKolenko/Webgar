import logo from './logo.svg';
import React from 'react';
import './App.css';
import NoviJsZad from './components/noviJsZad/noviJsZad';
import NoviHtmlZad from './components/noviHtmlZad/noviHtmlZad';
import NoviCssZad from './components/noviCssZad/noviCssZad';
import PogledZadatka from './components/pogledZadatka/pogledZadatka';
import AktivniZadaci from './components/aktivniZadaci/aktivniZadaci';
import Login from './components/login/login';
import ManageAktivni from './components/manageAktivni/manageAktivni';
import ManageStari from './components/manageStari/manageStari';
import PogledZadatkaProfesor from './components/pogledZadatkaProfesor/pogledZadatkaProfesor';
import PogledRezultata from './components/pogledRezultata/pogledRezultata';
import Register from './components/register/register';
import Navbar from './components/navbar/navbar';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn: false,
      role: "",
      responded: false
    };
    this.checkLoginStatus = this.checkLoginStatus.bind(this);
  }

  checkLoginStatus(){
    fetch('/auth/logged-in', {
      method: "GET",
      credentials: 'include',
      headers: {'Content-Type': 'application/json'}
    }).then(res => res.json()).then(res => {
      console.log("Logged in: "+res.loggedIn);
      console.log("Role: "+res.role);
      this.setState({
        loggedIn: res.loggedIn,
        role: res.role,
        responded: true
      });
    });
  }

  componentDidMount(){
    this.checkLoginStatus();
  }

  render(){
    console.log("State: "+JSON.stringify(this.state));
    if(this.state.responded){
      return (
        <Router>
          <div className="App">
            {this.state.loggedIn ? <Navbar /> : <div></div>}
            <Switch>
              <Route exact path="/">
                {this.state.loggedIn == false ? <Login /> : this.state.role == "profesor" ? <Redirect to="/manageAktivni" /> : <Redirect to="/aktivniZadaci" />}
              </Route>
              <Route exact path="/register">
                {this.state.loggedIn == false ? <Register /> : this.state.role == "profesor" ? <Redirect to="/manageAktivni" /> : <Redirect to="/aktivniZadaci" />}
              </Route>
              <Route exact path="/noviJsZad">
                {this.state.loggedIn == true && this.state.role == "profesor" ? <NoviJsZad /> : <Redirect to="/" />}
              </Route>
              <Route exact path="/noviHtmlZad">
                {this.state.loggedIn == true && this.state.role == "profesor" ? <NoviHtmlZad /> : <Redirect to="/" />}
              </Route>
              <Route exact path="/noviCssZad">
                {this.state.loggedIn == true && this.state.role == "profesor" ? <NoviCssZad /> : <Redirect to="/" />}
              </Route>
              <Route exact path="/zadatak/:taskId">
                {this.state.loggedIn == true && this.state.role == "student" ? (props) => <PogledZadatka {...props}/> : <Redirect to="/" />}
              </Route>
              <Route exact path="/aktivniZadaci">
                {this.state.loggedIn == true && this.state.role == "student" ? <AktivniZadaci /> : <Redirect to="/" />}
              </Route>
              <Route exact path="/manageAktivni">
                {this.state.loggedIn == true && this.state.role == "profesor" ? <ManageAktivni /> : <Redirect to="/" />}
              </Route>
              <Route exact path="/manageStari">
                {this.state.loggedIn == true && this.state.role == "profesor" ? <ManageStari /> : <Redirect to="/" />}
              </Route>
              <Route exact path="/rezultati/:taskId">
                {this.state.loggedIn == true && this.state.role == "profesor" ? (props) => <PogledZadatkaProfesor {...props}/> : <Redirect to="/" />}
              </Route>
              <Route exact path="/rezultat/:solutionId">
                {this.state.loggedIn == true && this.state.role == "profesor" ? (props) => <PogledRezultata {...props}/> : <Redirect to="/" />}
              </Route>
            </Switch>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" ></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.min.js" integrity="sha384-Atwg2Pkwv9vp0ygtn1JAojH0nYbwNJLPhwyoVbhoPwBhjQPR5VtM2+xf0Uwh9KtT" crossorigin="anonymous"></script>
        </Router>
      );
    }else{
      return <div></div>
    }
  }
}

export default App;
