import logo from './logo.svg';
import React from 'react';
import './App.css';
import NoviJsZad from './components/noviJsZad/noviJsZad';
import NoviHtmlZad from './components/noviHtmlZad/noviHtmlZad';
import NoviCssZad from './components/noviCssZad/noviCssZad';
import PogledZadatka from './components/pogledZadatka/pogledZadatka';
import AktivniZadaci from './components/aktivniZadaci/aktivniZadaci';
import Login from './components/login/login';
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
            <Switch>
              <Route exact path="/">
                {this.state.loggedIn == false ? <Login /> : this.state.role == "profesor" ? <Redirect to="/manageAktivni" /> : <Redirect to="/aktivniZadaci" />}
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
                {this.state.loggedIn == true && this.state.role == "profesor" ? <p>Manage aktivni placeholder</p> : <Redirect to="/" />}
              </Route>
            </Switch>
          </div>
        </Router>
      );
    }else{
      return <div></div>
    }
  }
}

export default App;
