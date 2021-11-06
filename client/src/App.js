import logo from './logo.svg';
import './App.css';
import NoviJsZad from './components/noviJsZad/noviJsZad';
import NoviHtmlZad from './components/noviHtmlZad/noviHtmlZad';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/noviJsZad" exact component={NoviJsZad} />
          <Route path="/noviHtmlZad" exact component={NoviHtmlZad} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
