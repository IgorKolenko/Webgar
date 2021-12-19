import logo from './logo.svg';
import './App.css';
import NoviJsZad from './components/noviJsZad/noviJsZad';
import NoviHtmlZad from './components/noviHtmlZad/noviHtmlZad';
import NoviCssZad from './components/noviCssZad/noviCssZad';
import PogledZadatka from './components/pogledZadatka/pogledZadatka';
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
          <Route path="/noviCssZad" exact component={NoviCssZad} />
          <Route path="/zadatak/:taskId" exact component={PogledZadatka} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
