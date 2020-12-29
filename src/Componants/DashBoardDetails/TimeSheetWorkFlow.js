import React, { Component, Fragment } from "react";
import Api from "../../api";
import NotifiMsg from "../publicComponants/NotifiMsg";
import eyeShow from "../../Styles/images/eyepw.svg";
import { Formik, Form } from "formik";
import "../../Styles/css/rodal.css";
import LoadingSection from "../publicComponants/LoadingSection";
import Export from "../OptionsPanels/Export";
import Approval from "../OptionsPanels/ApprovalRejectDocument";
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";
import Resources from "../../resources.json";
import * as Yup from "yup";
import SkyLight from "react-skylight";

const SignupSchema = Yup.object().shape({
  password: Yup.string().required("Required"),
  comment: Yup.string()
});
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
var listSelectedRows = [];
var timeSheetId = null;

class TimeSheetWorkFlow extends Component {
  constructor(props) {
    super(props);
    var columnsGrid = [
      {
        title: "",
        type: "check-box",
        fixed: true,
        field: "id",
        showTip: true
      },
      {
        field: 'projectName',
        title: Resources['projectName'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: true,
        type: "text",
        sortable: true,
      },
      {
        field: 'docDate',
        title: Resources['docDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true,
      },
      {
        field: 'taskName',
        title: Resources['taskName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      },
      {
        field: 'description',
        title: Resources['description'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      },
      {
        field: 'expenseValue',
        title: Resources['hours'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      },
      {
        field: 'total',
        title: Resources['total'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      }
    ];
    const filtersColumns = [
      {
        field: "projectName",
        name: "projectName",
        type: "string",
        isCustom: true
      },
      {
        field: "docDate",
        name: "docDate",
        type: "date",
        isCustom: true
      },
      {
        field: "taskName",
        name: "taskName",
        type: "string",
        isCustom: true
      },
      {
        field: "description",
        name: "description",
        type: "string",
        isCustom: true
      },
      {
        field: "expenseValue",
        name: "hours",
        type: "string",
        isCustom: true
      },
      {
        field: "total",
        name: "total",
        type: "string",
        isCustom: true
      }
    ];
    this.state = {
      pageTitle: Resources["requestApproval"][currentLanguage],
      viewfilter: false,
      columns: columnsGrid,
      isLoading: true,
      rows: [],
      filtersColumns: filtersColumns,
      isCustom: true,
      isApprove: false,
      type: false,
      approvalStatus: null,
      password: "",
      comment: "",
      viewMessage: false,
      Message: "",
      Ids: []
    };
    this.actions = [{
      title: '',
      handleClick: values => {
        this.selectedRows(values);
      }
    }]
    this.approveTimeSheet = this.approveTimeSheet.bind(this);
  }
  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);

    let id = null;

    for (let param of query.entries()) {
      id = param[1];
      timeSheetId = param[1];
    }

    Api.get("GetExpensesUserByContactIdType?requestFromUserId=" + id + "&type=timeSheet").then(result => {
      this.setState({
        rows: result != null ? result : [],
        isLoading: false
      });
    });
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

    Api.get("")
      .then(result => {
        if (result.length > 0) {
          this.setState({
            rows: result != null ? result : [],
            isLoading: false
          });
        } else {
          this.setState({
            isLoading: false
          });
        }
      })
      .catch(ex => {
        alert(ex);
        this.setState({
          rows: [],
          isLoading: false
        });
      });
  };
  ApproveHandler = (status) => {
    if (listSelectedRows.length > 0) {
      this.setState({
        approvalStatus: status,
        isApprove: !this.state.isApprove
      });
      this.simpleDialog.show();
    } else {
      this.setState({
        viewMessage: true
      });
    }
  }
  toggle = () => {
    const currentType = this.state.type;
    this.setState({ type: !currentType });
  };
  selectedRows(rows) {
    listSelectedRows = [];

    rows.map(item => {
      listSelectedRows.push(item);
    });
    this.setState({ Ids: listSelectedRows })
  }
  onRowsDeselected(rows) {
    listSelectedRows = [];

    rows.map(item => {
      listSelectedRows.push(item);
    });
    this.setState({ Ids: listSelectedRows })
  }
  approveTimeSheet(values) {
    if (values["password"]) {
      this.setState({
        isLoading: true
      });
      Api.getPassword("GetPassWordEncrypt", values["password"]).then(res => {
        if (res) {
          listSelectedRows.map((id, index) => {
            Api.post("ApproveRejectedTimesheet?id=" + id + "&status=" + this.state.approvalStatus + "&comment=" + values["comment"]).then(res => {
              if (index + 1 == listSelectedRows.length) {
                listSelectedRows = [];
                Api.get("GetExpensesUserByContactIdType?requestFromUserId=" + timeSheetId + "&type=timeSheet").then(result => {
                  this.setState({
                    rows: result != null ? result : [],
                    isLoading: false,
                    isApprove: false,
                    viewMessage: true
                  });

                  this.simpleDialog.hide();
                });
              }
            })
              .catch(() =>
                this.setState({
                  isLoading: false,
                  viewMessage: true
                })
              );
          });
        } else {
          this.setState({
            Message: Resources["invalidPassword"][currentLanguage],
            isLoading: false,
            viewMessage: true
          });
        }
      })
        .catch(res => {
          this.setState({
            isLoading: false
          });
        });
    }
  }
  closeModal() {
    this.setState({
      isApprove: false
    });
  }
  render() {
    const dataGrid =
      this.state.isLoading === false ? (
        <GridCustom
          ref='custom-data-grid'
          gridKey="TimeSheetWorkFlow"
          data={this.state.rows}
          pageSize={this.state.rows.length}
          groups={[]}
          actions={this.actions}
          rowActions={[]}
          cells={this.state.columns}
          rowClick={() => { }}
        />
      ) : (
          <LoadingSection />
        );

    const alert = this.state.viewMessage === true ? (<NotifiMsg statusClass="animationBlock" IsSuccess="false" Msg={this.state.Message} />) : null

    const btnExport =
      this.state.isLoading === false ? (
        <Export
          rows={this.state.isLoading === false ? this.state.rows : []}
          columns={this.state.columns}
          fileName={this.state.pageTitle}
        />
      ) : (
          <LoadingSection />
        );
    return (
      <div className="mainContainer">
        <div className="submittalFilter readOnly__disabled">
          <div className="subFilter">
            <h3 className="zero">{this.state.pageTitle}</h3>
            <span>{this.state.rows.length}</span>
          </div>
          <div className="filterBTNS">{btnExport}</div>
        </div>

        {this.state.Ids.length > 0 ? <Approval ApproveHandler={this.ApproveHandler.bind(this)} /> : null}

        <div className="filterHidden" style={{ maxHeight: this.state.viewfilter ? "" : "0px", overflow: this.state.viewfilter ? "" : "hidden" }}>
          <div className="gridfillter-container">
          </div>
        </div>
        <div>{dataGrid}</div>
        <Fragment>{alert}</Fragment>

        <SkyLight ref={ref => (this.simpleDialog = ref)}>>
            <Formik initialValues={{ password: "", comment: "" }} validationSchema={SignupSchema} onSubmit={values => this.approveTimeSheet(values)}>
            {({ errors, touched, handleBlur, handleChange }) => (
              <Form id="signupForm1" className="proForm" noValidate="novalidate">
                <div className="approvalDocument">
                  <div className="approvalWrapper">
                    <div className="approvalTitle">
                      <h3>Document Approval</h3>
                    </div>
                    <div className="inputPassContainer">
                      <div className="form-group passwordInputs showPasswordArea">
                        <label className="control-label">Password *</label>
                        <div className="inputPassContainer">
                          <div className={errors.password && touched.password ? "ui input inputDev has-error" : !errors.password && touched.password ? "ui input inputDev has-success" : "ui input inputDev"}>
                            <span className={this.state.type ? "inputsideNote togglePW active-pw" : "inputsideNote togglePW "} onClick={this.toggle}>
                              <img src={eyeShow} />
                              <span className="show"> Show</span>
                              <span className="hide"> Hide</span>
                            </span>
                            <input name="password" type={this.state.type ? "text" : "password"} className="form-control"
                              id="password"
                              placeholder="password"
                              autoComplete="off"
                              onChange={handleChange} />
                            {errors.password && touched.password ? (
                              <span className="glyphicon glyphicon-remove form-control-feedback spanError" />
                            ) : !errors.password && touched.password ? (
                              <span className="glyphicon form-control-feedback glyphicon-ok" />
                            ) : null}
                            {errors.password && touched.password ? (
                              <em className="pError">{errors.password}</em>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="textarea-group">
                      <label>Comment</label>
                      <textarea
                        name="comment"
                        className="form-control"
                        id="comment"
                        placeholder="comment"
                        autoComplete="off"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="fullWidthWrapper">
                      {this.state.isLoading != true ? (
                        <button className="primaryBtn-1 btn largeBtn" type="submit">
                          Save
                          </button>
                      ) : (
                          <button className="primaryBtn-2 btn smallBtn fillter-item-c">
                            <div className="spinner">
                              <div className="bounce1" />
                              <div className="bounce2" />
                              <div className="bounce3" />
                            </div>
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </SkyLight>

      </div>
    );
  }
}

export default TimeSheetWorkFlow;
