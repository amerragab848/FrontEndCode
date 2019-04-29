import React, { Component, Fragment } from "react";
import dataservice from "../../Dataservice";
import Resources from "../../resources.json";
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";
import moment from "moment";
import SkyLight from "react-skylight";
import { toast } from "react-toastify";
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const _ = require("lodash");

class MyTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskData: [],
      originalData: [],
      currentId: 0,
      showModal: false,
      status: true,
      docDate: "",
      bicCompanyName: "",
      bicContactName: "",
      subject: "",
      startDate: "",
      finishDate: "",
      estimatedTime: "",
      description: ""
    };
  }

  componentWillMount = () => {
    dataservice.GetDataGrid("GetMyTasksTimeSheet").then(data => {
      let result = _(data)
        .groupBy(x => x.priorityName)
        .map((value, key) => ({ Group: key, GroupData: value }))
        .value();
      this.setState({
        originalData: data,
        taskData: result
      });
    });
  };

  editStatus(e, id) {
    e.preventDefault();
    dataservice.GetDataGrid("GetTaskForEdit?id=" + id).then(data => {
      this.setState({
        currentId: id,
        showModal: true,
        docDate: data.docDate,
        bicCompanyName: data.bicCompanyName,
        bicContactName: data.bicContactName,
        subject: data.subject,
        startDate: moment(data.startDate).format("DD/MM/YYYY"),
        finishDate: moment(data.finishDate).format("DD/MM/YYYY"),
        estimatedTime: data.estimateTimeComplete,
        description: data.description
      });
      this.simpleDialog.show();
    });
  }

  editRow() {
    this.setState({
      showModal: false
    });

    toast.success(Resources["operationSuccess"][currentLanguage]);

    let obj = {};

    obj.id = this.state.currentId;
    obj.docDate = this.state.docDate;
    obj.bicCompanyName = this.state.bicCompanyName;
    obj.bicContactName = this.state.bicContactName;
    obj.subject = this.state.subject;

    dataservice.addObject("EditTaskStatus", obj).then(result => {
      this.state.originalData.forEach(item => {
        if (this.state.currentId === item.id) {
          item.status = result["status"];
          item.statusName = result["statusName"];
        }
      });

      let data = _(this.state.originalData)
        .groupBy(x => x.priorityName)
        .map((value, key) => ({ Group: key, GroupData: value }))
        .value();
      this.setState({
        taskData: data
      });
    });
  }

  render() {
    return (
      <div className="mainContainer">
        <div className="documents-stepper noTabs__document">
          <HeaderDocument
            docTitle={
              Resources.Reports[currentLanguage] +
              "  " +
              Resources.myTasks[currentLanguage]
            }
          />
          <div className="doc-container">
            <div className="step-content">
              <div id="step1" className="step-content-body">
                <div className="subiTabsContent">
                  <div className="document-fields">
                    <form className="proForm datepickerContainer">
                      {this.state.taskData.map(item => {
                        return (
                          <div
                            className="workingHours__cycle fullWidthWrapper textLeft"
                            style={{ overflow: "auto" }}
                            key={item.id}
                          >
                            <header>
                              <h3 className="zero">{item.Group}</h3>
                            </header>
                            <table className="attachmentTable tableReports">
                              <thead>
                                <tr>
                                  <th>
                                    <div className="headCell tableCell-1">
                                      <span>
                                        {Resources["arrange"][currentLanguage]}
                                      </span>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="headCell tableCell-2">
                                      <span>
                                        {Resources["View"][currentLanguage]}
                                      </span>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="headCell tableCell-3">
                                      <span>
                                        {Resources["status"][currentLanguage]}
                                      </span>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="headCell tableCell-4">
                                      <span>
                                        {
                                          Resources["suspeneded"][
                                            currentLanguage
                                          ]
                                        }
                                      </span>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="headCell tableCell-4">
                                      <span>
                                        {Resources["subject"][currentLanguage]}
                                      </span>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="headCell tableCell-4">
                                      <span>
                                        {
                                          Resources["actionByContact"][
                                            currentLanguage
                                          ]
                                        }
                                      </span>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="headCell tableCell-4">
                                      <span>
                                        {
                                          Resources["estimateTime"][
                                            currentLanguage
                                          ]
                                        }
                                      </span>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="headCell tableCell-4">
                                      <span>
                                        {Resources["docDate"][currentLanguage]}
                                      </span>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="headCell tableCell-4">
                                      <span>
                                        {
                                          Resources["startDate"][
                                            currentLanguage
                                          ]
                                        }
                                      </span>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="headCell tableCell-4">
                                      <span>
                                        {
                                          Resources["finishDate"][
                                            currentLanguage
                                          ]
                                        }
                                      </span>
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <Fragment>
                                  {item.GroupData.map(data => {
                                    return (
                                      <tr key={data.id}>
                                        <td>
                                          <div className="contentCell tableCell-1">
                                            <span>{data.id}</span>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="contentCell tableCell-1">
                                            <button
                                              className={!data.status ?"primaryBtn-2 btn smallBtn gridBtn disabled" :"primaryBtn-2 btn smallBtn gridBtn"}
                                              onClick={e =>
                                                this.editStatus(e, data.id)
                                              }
                                              disabled={!data.status}
                                            >
                                              Edit
                                            </button>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="contentCell tableCell-3">
                                            <span>{data.statusName}</span>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="contentCell tableCell-3">
                                            <span>{data.suspendedText}</span>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="contentCell tableCell-4">
                                            <span>{data.subject}</span>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="contentCell tableCell-3">
                                            <span>{data.actionBy}</span>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="contentCell tableCell-3">
                                            <span>{data.estimatedTime}</span>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="contentCell tableCell-3">
                                            <span>
                                              {moment(data.docDate).format(
                                                "DD/MM/YYYY"
                                              )}
                                            </span>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="contentCell tableCell-3">
                                            <span>
                                              {moment(data.startDate).format(
                                                "DD/MM/YYYY"
                                              )}
                                            </span>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="contentCell tableCell-3">
                                            <span>
                                              {moment(data.finishDate).format(
                                                "DD/MM/YYYY"
                                              )}
                                            </span>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </Fragment>
                              </tbody>
                            </table>
                          </div>
                        );
                      })}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="largePopup largeModal "
            style={{ display: this.state.showModal ? "block" : "none" }}
          >
            <SkyLight
              hideOnOverlayClicked
              ref={ref => (this.simpleDialog = ref)}
              title={Resources["goEdit"][currentLanguage]}
            >
              <div className="dropWrapper">
                  <div className="fillter-status fillter-item-c fullInputWidth">
                    <label className="control-label">
                      {Resources.status[currentLanguage]}
                    </label>
                    <div className="ui checkbox radio radioBoxBlue">
                      <input
                        type="radio"
                        name="letter-status"
                        value="true"
                        defaultChecked={
                          this.state.status === false ? null : "checked"
                        }
                        onChange={e =>
                          this.setState({ status: e.target.value })
                        }
                      />
                      <label>{Resources.oppened[currentLanguage]}</label>
                    </div>
                    <div className="ui checkbox radio radioBoxBlue">
                      <input
                        type="radio"
                        name="letter-status"
                        value="false"
                        defaultChecked={
                          this.state.status === false ? "checked" : null
                        }
                        onChange={e =>
                          this.setState({ status: e.target.value })
                        }
                      />
                      <label>{Resources.closed[currentLanguage]}</label>
                    </div>
                  </div>

                  <div className="fillter-status fillter-item-c fullInputWidth">
                    <label className="control-label">
                      {Resources.docDate[currentLanguage]}
                    </label>
                    <div className="shareLinks">
                      <div className="inputDev ui input">
                        <input
                          type="text"
                          className="form-control"
                          id="docDate"
                          value={moment(this.state.docDate).format(
                            "DD/MM/YYYY"
                          )}
                          name="docDate"
                          placeholder={Resources.docDate[currentLanguage]}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="fillter-status fillter-item-c fullInputWidth">
                    <label className="control-label">
                      {Resources.toCompany[currentLanguage]}
                    </label>
                    <div className="ui input inputDev">
                      <input
                        type="text"
                        className="form-control"
                        id="fromCompany"
                        value={this.state.bicCompanyName}
                        name="bicCompanyName"
                        placeholder={Resources.toCompany[currentLanguage]}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="fillter-status fillter-item-c fullInputWidth">
                    <label className="control-label">
                      {Resources.ContactName[currentLanguage]}
                    </label>
                    <div className="shareLinks">
                      <div className="inputDev ui input">
                        <input
                          type="text"
                          className="form-control"
                          id="ContactName"
                          value={this.state.bicContactName}
                          name="ContactName"
                          placeholder={Resources.ContactName[currentLanguage]}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="fillter-status fillter-item-c fullInputWidth">
                    <label className="control-label">
                      {Resources.subject[currentLanguage]}
                    </label>
                    <div className="ui input inputDev">
                      <input
                        type="text"
                        className="form-control"
                        id="subject"
                        value={this.state.subject}
                        name="subject"
                        placeholder={Resources.subject[currentLanguage]}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="fillter-status fillter-item-c fullInputWidth">
                    <label className="control-label">
                      {Resources.startDate[currentLanguage]}
                    </label>
                    <div className="shareLinks">
                      <div className="inputDev ui input">
                        <input
                          type="text"
                          className="form-control"
                          id="startDate"
                          value={this.state.startDate}
                          name="startDate"
                          placeholder={Resources.startDate[currentLanguage]}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="fillter-status fillter-item-c fullInputWidth">
                    <label className="control-label">
                      {Resources.finishDate[currentLanguage]}
                    </label>
                    <div className="ui input inputDev">
                      <input
                        type="text"
                        className="form-control"
                        id="finishDate"
                        value={this.state.finishDate}
                        name="finishDate"
                        placeholder={Resources.finishDate[currentLanguage]}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="fillter-status fillter-item-c fullInputWidth">
                    <label className="control-label">
                      {Resources.estimateTime[currentLanguage]}
                    </label>
                    <div className="shareLinks">
                      <div className="inputDev ui input">
                        <input
                          type="text"
                          className="form-control"
                          id="estimateTime"
                          value={this.state.estimatedTime}
                          name="estimateTime"
                          placeholder={Resources.estimateTime[currentLanguage]}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="fillter-status fillter-item-c fullInputWidth">
                    <label className="control-label">
                      {Resources.description[currentLanguage]}
                    </label>
                    <div className="ui input inputDev">
                      <input
                        type="text"
                        className="form-control"
                        id="description"
                        value={this.state.description}
                        name="description"
                        placeholder={Resources.description[currentLanguage]}
                        disabled
                      />
                    </div>
                  </div>
                  <div class="slider-Btns fullWidthWrapper">
                    <button
                      class="primaryBtn-1 btn meduimBtn"
                      onClick={this.editRow.bind(this)}
                      type="button"
                    >
                      Save
                    </button>
                  </div>
                </div>
            </SkyLight>
          </div>
        </div>
      </div>
    );
  }
}

export default MyTasks;
