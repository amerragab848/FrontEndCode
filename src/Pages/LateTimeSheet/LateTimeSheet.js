import React, { Component, Fragment } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup'; 

import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import ReactTable from "react-table";
import { withRouter } from "react-router-dom";
import TextEditor from '../../Componants/OptionsPanels/TextEditor'

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";

import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";
import AddDocAttachment from "../../Componants/publicComponants/AddDocAttachment";
import Steps from "../../Componants/publicComponants/Steps";
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown'
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown';
import Late from '../../Componants/DashBoardDetails/LateTimeSheetAddEdit';
import GridSetupWithFilter from "../Communication/GridSetupWithFilter";
import find from "lodash/find";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class LateTimeSheet extends Component{
  constructor(){
    super()
    let editUnitPrice = ({ value, row }) => {
      if (row) {
          return (
              <a className="editorCell">
                  <span
                      style={{
                          padding: "0 6px",
                          margin: "5px 0",
                          border: "1px dashed",
                          cursor: "pointer"
                      }}>
                      {row.unitPrice}
                  </span>
              </a>
          );
      }
      return null;
  };
    this.itemsColumns = [
      {
          name: Resources["itemize"][currentLanguage],
          formatter: this.customButton,
          width: 70,
          key: "customBtn"
      },
      {
          key: "arrange",
          name: Resources["no"][currentLanguage],
          width: 50,
          draggable: true,
          sortable: true,
          resizable: true,
          filterable: true,
          sortDescendingFirst: true,
          type: "number"
      },
      {
          key: "boqType",
          name: Resources["boqType"][currentLanguage],
          width: 100,
          draggable: true,
          sortable: true,
          resizable: true,
          filterable: true,
          sortDescendingFirst: true,
          type: "string"
      },
      {
          key: "boqTypeChild",
          name: Resources["boqSubType"][currentLanguage],
          width: 120,
          draggable: true,
          sortable: true,
          resizable: true,
          filterable: false,
          sortDescendingFirst: true,
          type: "string"
      },
      {
          key: "boqSubType",
          name: Resources["boqTypeChild"][currentLanguage],
          width: 100,
          draggable: true,
          sortable: true,
          resizable: true,
          filterable: true,
          sortDescendingFirst: true,
          type: "string"
      },
      {
          key: "itemCode",
          name: Resources["itemCode"][currentLanguage],
          width: 100,
          draggable: true,
          sortable: true,
          resizable: true,
          filterable: true,
          sortDescendingFirst: true,
          type: "string"
      },
      {
          key: "description",
          name: Resources["details"][currentLanguage],
          width: 100,
          draggable: true,
          sortable: true,
          resizable: true,
          filterable: true,
          sortDescendingFirst: true,
          type: "string"
      },
      {
          key: "quantity",
          name: Resources["quantity"][currentLanguage],
          width: 100,
          draggable: true,
          sortable: true,
          resizable: true,
          filterable: true,
          sortDescendingFirst: true,
          type: "number"
      },
      {
          key: "revisedQuantity",
          name: Resources["revisedQuantity"][currentLanguage],
          width: 100,
          draggable: true,
          sortable: true,
          resizable: true,
          filterable: false,
          sortDescendingFirst: true,
          type: "number"
      },
      {
          key: "unit",
          name: Resources["unit"][currentLanguage],
          width: 100,
          draggable: true,
          sortable: true,
          resizable: true,
          filterable: false,
          sortDescendingFirst: true,
          type: "string"
      },
      {
          key: "unitPrice",
          name: Resources["unitPrice"][currentLanguage],
          width: 100,
          draggable: true,
          sortable: true,
          editable: true,
          resizable: true,
          filterable: false,
          sortDescendingFirst: true,
          formatter: editUnitPrice,
          type: "number"
      },
      {
          key: "total",
          name: Resources["total"][currentLanguage],
          width: 100,
          draggable: true,
          sortable: true,
          resizable: true,
          filterable: false,
          sortDescendingFirst: true,
          type: "number"
      },
      {
          key: "resourceCode",
          name: Resources["resourceCode"][currentLanguage],
          width: 200,
          draggable: true,
          sortable: true,
          resizable: true,
          filterable: true,
          sortDescendingFirst: true,
          type: "string"
      }
  ];
    this.state={
      _items: []
    }
  }
    componentDidMount() {
        this.props.actions.RouteToTemplate();
      }
    render(){
    return(
        <div className="mainContainer">
             <Late />
             <div>
           
             </div>
        </div>
   
    );

    }
}

function mapStateToProps(state, ownProps) {
    return {
      showModal: state.communication.showModal
    };
  }
function mapDispatchToProps(dispatch)
{
  return{
      actions:bindActionCreators(communicationActions,dispatch)
  };
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(LateTimeSheet));

