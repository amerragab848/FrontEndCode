import React, { Component } from 'react';
import { withRouter } from "react-router-dom";   

import LeftReportMenu from "../../Pages/Menu/LeftReportMenu";  

class ReportsMenu extends Component {
    constructor(props) {
        super(props); 
    } 

    render() {
        return (<LeftReportMenu />)
    }
}
 
export default withRouter(ReportsMenu);
