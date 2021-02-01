import React, { Component } from "react";
import Api from "../../api";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Export from "../OptionsPanels/Export";
import Resources from "../../resources.json";
import CryptoJS from 'crypto-js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";
import SkyLight from 'react-skylight';
import Dropdown from '../../Componants/OptionsPanels/DropdownMelcous';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import eyeShow from "../../Styles/images/eyepw.svg";
import { toast } from "react-toastify";


let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let action = null;

const validationSchema = Yup.object().shape({
  password: Yup.string().required(Resources["passwordRequired"][currentLanguage])
});
class DocApprovalDetails extends Component {

  constructor(props) {
    super(props);
    const query = new URLSearchParams(props.location.search);

    for (let param of query.entries()) {
      action = param[1];
    }

    const columnsGrid = [
      { title: '', type: 'check-box', fixed: true, field: 'id' },
      {
        field: "readStatusText",
        title: Resources["statusName"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 6,
        sortable: true,
        type: "text",
        hidden: false,
        conditionalClasses: obj => {
          return obj.readStatusText == "Read" ? ' gridBtns status Read' : ' gridBtns status UnRead';
        }
      },
      {
        field: "subject",
        title: Resources["subject"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 16,
        sortable: true,
        type: "text",
        hidden: false,
        href: 'link',
        onRightClick: (e, cell) => {
          if (e.readStatus != true) {
            Api.post("UpdateStatusWorkFlow?id=" + e.id);
          }
        },
        classes: 'bold'
      },
      {
        field: "creationDate",
        title: Resources["docDate"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        hidden: false,
        type: "date"
      },
      {
        field: "duration2",
        title: Resources["durationDays"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        hidden: false,
        type: "number"
      },
      {
        field: "arrange",
        title: Resources["levelNo"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 6,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "actionBy",
        title: Resources["actionByContact"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "fileNumber",
        title: Resources["fileNumber"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "companyType",
        title: Resources["companyType"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "openedBy",
        title: Resources["openedBy"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        hidden: false,
        type: "text"

      },
      {
        field: "description",
        title: Resources["description"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "projectName",
        title: Resources["projectName"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "docType",
        title: Resources["docType"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "refDoc",
        title: Resources["docNo"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 6,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "docReferance",
        title: Resources["refDoc"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 6,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "lastApprovalDate",
        title: Resources["lastApproveDate"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        hidden: false,
        type: "date"
      },
      {
        field: "delayDuration",
        title: Resources["delay"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 6,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "dueDate",
        title: Resources["dueDate"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        hidden: false,
        type: "date"
      },
      {
        field: "lastSendDate",
        title: Resources["lastSendDate"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 10,
        sortable: true,
        hidden: false,
        type: "date"
      },
      {
        field: "lastSendTime",
        title: Resources["lastSendTime"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        hidden: false,
        type: "text"
      },
      {
        field: "lastApproveTime",
        title: Resources["lastApprovedTime"][currentLanguage],
        groupable: true,
        fixed: false,
        width: 8,
        sortable: true,
        hidden: false,
        type: "text"
      }
    ];

    const filtersColumns = [
      {
        field: "readStatusText",
        name: "statusName",
        type: "toggle",
        trueLabel: "oppened",
        falseLabel: "closed",
        isCustom: true
      },
      {
        field: "subject",
        name: "subject",
        type: "string",
        isCustom: true
      },
      {
        field: "creationDate",
        name: "docDate",
        type: "date",
        isCustom: true
      },
      {
        field: "duration2",
        name: "durationDays",
        type: "string",
        isCustom: true
      },
      {
        field: "arrange",
        name: "levelNo",
        type: "string",
        isCustom: true
      },
      {
        field: "actionBy",
        name: "actionByContact",
        type: "string",
        isCustom: true
      },
      {
        field: "companyType",
        name: "companyType",
        type: "string",
        isCustom: true
      },
      {
        field: "fileNumber",
        name: "fileNumber",
        type: "string",
        isCustom: true
      },
      {
        field: "openedBy",
        name: "openedBy",
        type: "string",
        isCustom: true
      },
      {
        field: "projectName",
        name: "projectName",
        type: "string",
        isCustom: true
      },
      {
        field: "docType",
        name: "docType",
        type: "string",
        isCustom: true
      },
      {
        field: "delayDuration",
        name: "delay",
        type: "date",
        isCustom: true
      }
    ];

    let gridName = 'Doc_' + (action == "1" ? "RejectList" : "ApproveList");

    this.state = {
      action: action,
      pageTitle: "",
      viewfilter: false,
      isFilter: false,
      isCustom: true,
      gridLoader: false,
      isLoading: true,
      columns: columnsGrid,
      rows: [],
      filtersColumns: filtersColumns,
      apiFilter: "",
      groups: [],
      gridName: gridName,
      showModal: false,
      selectedRows: [],
      contactsList: [],
      selectedContact: null,
      approvalStatus: true,
      type: false,
      approvalObj: {
        contactId: "",
        password: "",
        comment: ""
      }
    };


    this.actions = [
      {
        title: 'Approve',
        handleClick: (value) => {
          this.showPopUp(value, true);
        },
        classes: "autoGridBtn"
      },
      {
        title: 'Reject',
        handleClick: (value) => {
          this.showPopUp(value, false);
        },
        classes: "autoGridBtn"
      }
    ]
  }

  componentDidMount() {

    this.props.actions.RouteToTemplate();

    var currentGP = [];

    let gridName = 'Doc_' + (action == "1" ? "RejectList" : "ApproveList");

    this.setState({
      gridName: gridName
    });

    var selectedCols = JSON.parse(localStorage.getItem(gridName)) || [];
    let itemsColumns = this.state.columns;
    if (selectedCols.length === 0) {
      var gridLocalStor = { columnsList: [], groups: [] };
      gridLocalStor.columnsList = JSON.stringify(itemsColumns);
      gridLocalStor.groups = JSON.stringify(currentGP);
      localStorage.setItem(this.state.gridName, JSON.stringify(gridLocalStor));
    }
    else {
      var parsingList = JSON.parse(selectedCols.columnsList);
      for (var item in parsingList) {
        for (var i in itemsColumns) {
          if (itemsColumns[i].field === parsingList[item].field) {
            let status = parsingList[item].hidden
            itemsColumns[i].hidden = status
            break;
          }
        }
      };
      currentGP = JSON.parse(selectedCols.groups);
    }

    this.setState({
      groups: currentGP
    });

    if (this.state.action === "1") {
      this.setState({
        pageTitle: Resources["docRejected"][currentLanguage]
      });

      localStorage.setItem("lastRoute", "/DocApprovalDetails?action=1");

      Api.get("GetRejectedRequestsDocApprove").then(result => {
        const newRows = [...result];

        newRows.forEach((row, index) => {
          let subject = "";
          if (row) {
            let obj = {
              docId: row.docId,
              projectId: row.projectId,
              projectName: row.projectName,
              arrange: row.arrange,
              docApprovalId: row.accountDocWorkFlowId,
              isApproveMode: true,
              perviousRoute: window.location.pathname + window.location.search
            };

            if (row.docLink == "addEditModificationDrawing") {
              obj.isModification = true;
            }
            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));

            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

            let doc_view = "/" + row.docLink.replace("/", "") + "?id=" + encodedPaylod;

            subject = doc_view;
          }
          row.link = subject;
        });
        this.setState({
          rows: newRows != null ? newRows : [],
          isLoading: false
        });
      });

    } else {
      this.setState({
        pageTitle: Resources["docApproval"][currentLanguage]
      });

      localStorage.setItem("lastRoute", "/DocApprovalDetails?action=2");

      Api.get("GetApprovalRequestsDocApprove").then(result => {
        const newRows = [...result];
        newRows.forEach((row, index) => {
          let subject = "";

          if (row) {
            let obj = {
              docId: row.docId,
              projectId: row.projectId,
              projectName: row.projectName,
              arrange: row.arrange,
              docApprovalId: row.accountDocWorkFlowId,
              isApproveMode: true,
              perviousRoute: window.location.pathname + window.location.search
            };

            if (row.docLink == "addEditModificationDrawing") {
              obj.isModification = true;
            }

            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
            let doc_view = "/" + row.docLink.replace("/", "") + "?id=" + encodedPaylod;
            subject = doc_view;
          }
          row.link = subject;
        });

        this.setState({
          rows: newRows != null ? newRows : [],
          isLoading: false
        });

      });
    }
  }

  hideFilter(value) {
    this.setState({ viewfilter: !this.state.viewfilter });

    return this.state.viewfilter;
  }

  filterMethodMain = (event, query, apiFilter) => {
    var stringifiedQuery = JSON.stringify(query);

    this.setState({
      isLoading: true,
      query: stringifiedQuery
    });

    this.setState({
      isLoading: false
    });

  };

  onRowClick = (obj) => {
    if (obj) {

      if (obj.readStatus != true) {
        Api.post("UpdateStatusWorkFlow?id=" + obj.id);
      }
      let objRout = {
        docId: obj.docId,
        projectId: obj.projectId,
        projectName: obj.projectName,
        arrange: obj.arrange,
        docApprovalId: obj.accountDocWorkFlowId,
        isApproveMode: true,
        perviousRoute: window.location.pathname + window.location.search
      }
      if (obj.docLink == "addEditModificationDrawing") {
        objRout.isModification = true;
      }
      let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(objRout));
      let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
      this.props.history.push({
        pathname: "/" + obj.docLink,
        search: "?id=" + encodedPaylod
      });
    }
  }

  changeValueOfProps = () => {
    this.setState({ isFilter: false });
  };

  checkedRow = (id, checked) => {

    let indexed = checked.findIndex(x => x === id);
    if (indexed > -1) {
      checked.splice(indexed, 1);
    } else {
      if (checked.length > 0) {
        let firstSelected = this.state.rows.find(x => x.id === checked[0]);
        let currentSelected = this.state.rows.find(x => x.id === id);
        if (firstSelected.workFlowId == currentSelected.workFlowId && firstSelected.arrange == currentSelected.arrange) {
          checked.push(id);
        } else {
          toast.warn('This Record Don\'t Match Prevoius Records');
        }

      } else {
        checked.push(id);
      }
    }
  }

  showPopUp = (values, approvalStatus) => {
    let paramsObj = this.state.rows.find(x => x.id == values[0]);
    Api.get(`GetWorkFlowContactsByWorkFlowIdAndArrange?arrange=${paramsObj.arrange}&workFlowId=${paramsObj.workFlowId}&approvalStatus=${approvalStatus}`).then(result => {
      this.setState({
        showModal: true,
        selectedRows: values,
        contactsList: result ? result.map(i => ({ label: i.contactName, value: i.contactId })) : [],
        approvalStatus: approvalStatus,
        selectedContact: approvalStatus == true ? { label: Resources["approveTo"][currentLanguage], value: "0" } : { label: Resources["rejectedTo"][currentLanguage], value: "0" }
      })
    });
    this.simpleDialog.show()
  }

  handleChangeDropDown = (value, field, selected) => {
    let originalDoc = { ...this.state.approvalObj };
    let newDoc = {};
    newDoc[field] = value.value;
    newDoc[selected] = value;
    Object.assign(originalDoc, newDoc);
    this.setState({ approvalObj: originalDoc })
  }

  handleChange = (value, field) => {
    let originalDoc = { ...this.state.approvalObj };
    let newDoc = {};
    newDoc[field] = value;
    Object.assign(originalDoc, newDoc);
    this.setState({ approvalObj: originalDoc })
  }

  toggle = () => {
    const currentType = this.state.type;
    this.setState({ type: !currentType });
  };

  submitApprove = () => {
    this.setState({ isLoading: true })
    Api.getPassword("GetPassWordEncrypt", this.state.approvalObj.password).then(result => {
      if (result) {
        let serverObj = [];
        this.state.selectedRows.forEach(item => {
          let row = this.state.rows.find(x => x.id == item);
          if (row) {
            serverObj.push({
              accountDocId: row.accountDocWorkFlowId,
              approvalStatus: this.state.approvalStatus,
              contacts: [this.state.approvalObj.contactId],
              currentArrange: row.arrange,
              docId: row.docId,
              docTypeId: row.docTypeId,
              projectId: row.projectId,
              comment: this.state.approvalObj.comment,
              docLink: window.location.href
            })
          }
        })
        if (serverObj.length > 0) {
          Api.post("SendMultipleWorkFlowApproval", serverObj).then(e => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.setState({
              isLoading: false,
              showModal: false,
              selectedContact: null,
              approvalObj: {
                contactId: "",
                password: "",
                comment: ""
              }
            })
          });
        }
      }
    });
  }

  render() {
    const dataGrid = this.state.isLoading === false ? (
      <GridCustom
        gridKey={this.state.gridName}
        data={this.state.rows}
        cells={this.state.columns}
        actions={this.actions}
        rowActions={[]}
        rowClick={cell => {
          if (cell) {
            if (cell.readStatus != true) {
              Api.post("UpdateStatusWorkFlow?id=" + cell.id);
            }
            let objRout = {
              docId: cell.docId,
              projectId: cell.projectId,
              projectName: cell.projectName,
              arrange: cell.arrange,
              docApprovalId: cell.accountDocWorkFlowId,
              isApproveMode: true,
              perviousRoute: window.location.pathname + window.location.search
            }
            if (cell.docLink == "addEditModificationDrawing") {
              objRout.isModification = true;
            }
            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(objRout));
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
            this.props.history.push({
              pathname: "/" + cell.docLink,
              search: "?id=" + encodedPaylod
            });
          }
        }
        }
        groups={this.state.groups}
        isFilter={this.state.isFilter}
        changeValueOfProps={this.changeValueOfProps.bind(this)}
        shouldCheck={(id, checked) => {
          this.checkedRow(id, checked);
        }}
      />
    ) : <LoadingSection />;




    const btnExport = this.state.isLoading === false ? <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={this.state.pageTitle} /> : <LoadingSection />;

    return (
      <div className="mainContainer main__withouttabs">
        <div className="submittalFilter readOnly__disabled">
          <div className="subFilter">
            <h3 className="zero">{this.state.pageTitle}</h3>
            <span>{this.state.rows.length}</span>
            <div
              className="ui labeled icon top right pointing dropdown fillter-button"
              tabIndex="0"
              onClick={() => this.hideFilter(this.state.viewfilter)} >

            </div>
          </div>
          <div className="rowsPaginations readOnly__disabled">

            <div className="linebylineInput valid-input">
              <label className="control-label">
                {Resources.readedDocs[currentLanguage]}
              </label>
              <div className="ui input inputDev" style={{ width: "100px", margin: " 10px " }}>
                <input type="text" className="form-control" id="readedDocs" value={this.state.rows.filter(x => x.readStatus === true).length}
                  readOnly name="readedDocs" placeholder={Resources.readedDocs[currentLanguage]} />
              </div>
            </div>
          </div>
          <div className="filterBTNS">
            {btnExport}
          </div>
        </div>

        <div>{dataGrid}</div>
        <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
          <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={this.state.approvalStatus == true ? Resources["approvalModalApprove"][currentLanguage] : Resources["approvalModalReject"][currentLanguage]}>

            <div className="">
              <Formik initialValues={{ ...this.state.approvalObj }}
                validationSchema={validationSchema}
                enableReinitialize={true}
                onSubmit={() => {
                  this.submitApprove();
                }}>
                {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                  <Form className="dropWrapper" onSubmit={handleSubmit}>
                    <div className=" proForm customProform">
                      <div className="fillter-status fillter-item-c ">
                        <div className="passwordInputs showPasswordArea">
                          <label className="control-label">Password *</label>
                          <div className="inputPassContainer">
                            <div className={"ui input inputDev" + (errors.password && touched.password ? " has-error" : !errors.password && touched.password ? " has-success" : " ")}>
                              <span className={this.state.type ? "inputsideNote togglePW active-pw" : "inputsideNote togglePW "} onClick={this.toggle}>
                                <img src={eyeShow} />
                                <span className="show"> Show</span>
                                <span className="hide"> Hide</span>
                              </span>
                              <input
                                type={this.state.type ? "text" : "password"}
                                name="password" className="form-control fsadfsadsa"
                                id="password"
                                placeholder={Resources.password[currentLanguage]}
                                autoComplete="off" value={this.state.approvalObj.password}
                                onBlur={e => { handleBlur(e); }}
                                onChange={e => this.handleChange(e.target.value, "password")}
                              />
                              {errors.password && touched.password ? (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) : !errors.password && touched.password ? (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                              {errors.password && touched.password ? (<em className="pError">{errors.password}</em>) : null}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Dropdown
                        title={this.state.approvalStatus == true ? "approveTo" : "rejectedTo"}
                        data={this.state.contactsList}
                        selectedValue={this.state.selectedContact}
                        handleChange={(event) => {

                          this.handleChangeDropDown(event, "contactId", "selectedContact")
                        }
                        }
                        onBlur={setFieldTouched}
                        name="contactId" id="contactId" />

                      <div className="textarea-group fullWidthWrapper textLeft">
                        <label>Comment</label>
                        <textarea className="form-control"
                          onChange={e => this.handleChange(e.target.value, "comment")}
                          value={this.state.approvalObj.comment}
                        />
                      </div>

                      <div className="slider-Btns fullWidthWrapper">
                        {this.state.isLoading == false ?
                          <button className="primaryBtn-1 btn meduimBtn" type="submit">
                            {this.state.approvalStatus == true ? Resources["approvalModalApprove"][currentLanguage] : Resources["approvalModalReject"][currentLanguage]}
                          </button> : (
                            <span className="primaryBtn-1 btn largeBtn disabled">
                              <div className="spinner">
                                <div className="bounce1" />
                                <div className="bounce2" />
                                <div className="bounce3" />
                              </div>
                            </span>
                          )}
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </SkyLight>
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

export default connect(mapStateToProps, mapDispatchToProps)(DocApprovalDetails);
