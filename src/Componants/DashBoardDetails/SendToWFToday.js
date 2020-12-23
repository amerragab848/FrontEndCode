import React, { Component } from "react";
import Api from "../../api";
import LoadingSection from "../publicComponants/LoadingSection";
import Export from "../OptionsPanels/Export";
import Resources from "../../resources.json";
import CryptoJS from 'crypto-js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import GridCustom from "../Templates/Grid/CustomGrid";
import moment from "moment";
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { Formik, Form } from 'formik';

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
class SendToWFToday extends Component {

  constructor(props) {
    super(props);
    const columnGrid = [
      {
        field: 'arrange',
        title: Resources['arrange'][currentLanguage],
        width: 4,
        groupable: true,
        fixed: true,
        type: "number",
        sortable: true,
      },
      {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 25,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
        classes: 'bold',
        href: 'link'
      },
      {
        field: 'projectName',
        title: Resources['projectName'][currentLanguage],
        width: 15,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      }, {
        field: 'actionByContactName',
        title: Resources['actionByContact'][currentLanguage],
        width: 15,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'docTypeName',
        title: Resources['docType'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true
      },
      {
        field: 'sendDate',
        title: Resources['sendDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
      },
      {
        field: 'lastApprovalDate',
        title: Resources['lastApproveDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true
      }
    ];

    this.state = {
      pageTitle: Resources["SendToWFToday"][currentLanguage],
      viewfilter: false,
      columns: columnGrid,
      isLoading: true,
      rows: [],
      finishDate: moment(),
      startDate: moment(),
      isCustom: true
    };
  }

  componentDidMount() {

    this.props.actions.RouteToTemplate();

    Api.get("GetSendToWFTodayDetails").then(result => {
      result.forEach(row => {
        if (row) {
          let obj = {
            docId: row.docId,
            projectId: row.projectId,
            projectName: row.projectName,
            arrange: 0,
            docApprovalId: 0,
            isApproveMode: false,
            perviousRoute: window.location.pathname + window.location.search
          };

          let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
          let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
          row.link = "/" + (row.docLink !== null ? row.docLink.replace('/', '') : row.docLink) + "?id=" + encodedPaylod
        }
      })
      this.setState({
        rows: result != null ? result : [],
        isLoading: false
      });
    });
  };
  cellClick = (rowId, colID) => {

    if (colID != 0 && colID != 1) {
      let rowData = this.state.rows[rowId];
      if (this.state.columns[colID].key !== "subject") {
        let obj = {
          docId: rowData.docId,
          projectId: rowData.projectId,
          projectName: rowData.projectName,
          arrange: 0,
          docApprovalId: 0,
          isApproveMode: false,
          perviousRoute: window.location.pathname + window.location.search
        };

        if (rowData.docType === 37 || rowData.docType === 114) {
          obj.isModification = rowData.docTyp === 114 ? true : false;
        }

        let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));

        let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

        this.props.history.push({ pathname: "/" + rowData.docLink, search: "?id=" + encodedPaylod });
      }
    }
  }; 
  onRowClick = (obj) => {
    if (this.state.RouteEdit !== '') {
      let objRout = {
        docId: obj.docId,
        projectId: obj.projectId,
        projectName: obj.projectName,
        arrange: 0,
        docApprovalId: 0,
        isApproveMode: false,
        perviousRoute: window.location.pathname + window.location.search
      }
      let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(objRout));
      let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
      this.props.history.push({
        pathname: "/" + obj.docLink,
        search: "?id=" + encodedPaylod
      });
    }
  };
  handleChange = (name, value) => {
    this.setState({ [name]: value })
  };
  getSearchData = () => {
    this.setState({ isLoading: true })

    let fromDate = moment(this.state.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
    let toDate = moment(this.state.finishDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

    Api.get("GetSendToWFTodayDetails?fromDate=" + fromDate + "&toDate=" + toDate).then(res => {
      this.setState({rows: res != null ? res : [], isLoading: false })
    })
  };
  render() {
    const dataGrid = this.state.isLoading === false ? (
      <GridCustom
        ref='custom-data-grid'
        gridKey="SendToWFToday"
        data={this.state.rows}
        groups={[]}
        actions={[]}
        rowActions={[]}
        cells={this.state.columns}
        rowClick={(cell) => { this.onRowClick(cell) }}
      />
    ) : <LoadingSection />;

    const btnExport = this.state.isLoading === false ?
      <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={this.state.pageTitle} />
      : <LoadingSection />;
    return (
      <div className="mainContainer">
        <div className="submittalFilter readOnly__disabled">
          <div className="subFilter">
            <h3 className="zero">{this.state.pageTitle}</h3>
            <span>{this.state.rows.length}</span>
          </div>
          <div className="filterBTNS">
            {btnExport}
          </div>
        </div>
        <Formik
          initialValues={{
            selectedProject: '',
            selectContractor: ''
          }}
          enableReinitialize={true}
        >
          {({ errors, touched, values, handleSubmit, setFieldTouched, setFieldValue }) => (
            <Form onSubmit={handleSubmit} className='proForm reports__proForm datepickerContainer'>
              <div className="linebylineInput valid-input alternativeDate">
                <DatePicker title='startDate'
                  startDate={this.state.startDate}
                  handleChange={e => this.handleChange('startDate', e)} />
              </div>
              <div className="linebylineInput valid-input alternativeDate">
                <DatePicker title='finishDate'
                  startDate={this.state.finishDate}
                  handleChange={e => this.handleChange('finishDate', e)} />
              </div>
              <div className="btn__multi">
                <button className="primaryBtn-1 btn smallBtn" onClick={() => this.getSearchData()}>{Resources['search'][currentLanguage]}</button>
              </div>
            </Form>
          )}
        </Formik>
        <div className="doc-pre-cycle letterFullWidth">
          {dataGrid}
        </div>

      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    showLeftMenu: state.communication.showLeftMenu
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SendToWFToday);
