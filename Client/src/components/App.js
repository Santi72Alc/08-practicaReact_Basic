import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { UserProvider, UserProfile } from './Context/UserContext';

// import logo from './logo.svg';
import "./App.css";

// Import's app
import Register from "./Register/Register";
import Adverts from './Adverts/Adverts';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      user: UserProfile,
      updateContext: this.updateContext,
      enableTags: [],
      userExist: false,
      selectedTag: "",
      errorData: []
    }
    // this.updateContext = this.updateContext.bind(this);
  }

  // UpdateContext .. allow to change the provided state!!
  updateContext = data => this.setState( data, (data) => data);

  render() {
    return (
      <>
        <UserProvider value={this.state}> 
          <Router>
            <Switch>
              <Route exact path="/register"   component={Register} />
              <Route exact path="/adverts"    component={Adverts} />
              <Redirect to="/register"        component={Register} />
            </Switch>
          </Router>
        </UserProvider>
      </ >
    );
  }
}

export default App;
