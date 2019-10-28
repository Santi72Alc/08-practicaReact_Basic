import React from 'react';
import { withRouter } from 'react-router-dom';
import {UserContext} from '../Context/UserContext';

import AppNavbar from '../AppNavbar/AppNavbar';
import FormFilter from './FormFilter';

class Adverts extends React.Component {

  state = {}

  componentDidMount() {
    const state = this.context;
    this.setState( state );
  }


  render() {
    return (
      <>
        <AppNavbar />
        <FormFilter />
      </>
    )
  } // end render


}


Adverts.contextType = UserContext;
export default withRouter( Adverts );

