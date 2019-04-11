import React, { Component, Fragment } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Config from "../../Services/Config.js";
import * as communicationActions from "../../store/actions/communication";
import Edit from "../../Styles/images/epsActions/edit.png";
import Plus from "../../Styles/images/epsActions/plus.png";
import Delete from "../../Styles/images/epsActions/delete.png";
import Rodal from "../../Styles/js/rodal";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import Tree from "../../Componants/OptionsPanels/Tree";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';


let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
class rptCostCodingTree extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        projectId: props.match.params.projectId,
      }
    }
      render()
      {
          return(
            <div>
                 <Tree projectId={this.state.projectId}/>
                </div>
          )
      }
    }

    function mapStateToProps(state, ownProps) {
        return {
          document: state.communication.document,
          isLoading: state.communication.isLoading
        };
      }
      
      function mapDispatchToProps(dispatch) {
        return {
          actions: bindActionCreators(communicationActions, dispatch)
        };
      }
      
      export default connect(
        mapStateToProps,
        mapDispatchToProps
      )(withRouter(rptCostCodingTree));