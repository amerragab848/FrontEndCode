import React, { Component } from "react";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import Api from '../../api'
import Export from "../../Componants/OptionsPanels/Export";
import { connect } from 'react-redux';
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal'
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { toast } from "react-toastify";
import Filter from "../../Componants/FilterComponent/filterComponent";
import GridCustom from "../../Componants/Templates/Grid/CustomCommonLogGrid";
import config from "../../Services/Config";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const _ = require('lodash')
class corrRecievedSentView extends Component {
    constructor(props) {
        super(props);
      
           
        this.state = {
           
        }
     
    }
    componentDidMount() {
       
    };
  


    render() {
     return(
        <span className="subUlTitle"></span>
     );
           
    }
}
function mapStateToProps(state, ownProps) {
    return {
        projectId: state.communication.projectId,
        projectName: state.communication.projectName
    }
}
export default connect(
    mapStateToProps
)(withRouter(corrRecievedSentView))