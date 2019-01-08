import React, { Component } from 'react';  

import FullDashBoard from  '../Componants/Index';

class DashBoard extends Component {
 
  render() {

    console.log('in Pages / Dashboard');
    return (    
		    <div> 
    				 <FullDashBoard />
        </div> 
      );
  }
}

export default DashBoard;