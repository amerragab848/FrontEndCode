import React, { Component, Fragment } from "react";
import dataservice from "../../Dataservice";
import Resources from "../../resources.json";
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";
import moment from "moment";
import { toast } from "react-toastify";
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const _ = require("lodash");

class MyTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskData: []
    };
  }

  componentWillMount = () => {
    dataservice.GetDataGrid("GetMyTasksTimeSheet").then(data => {
      let result = _(data)
        .groupBy(x => x.priorityName)
        .map((value, key) => ({ Group: key, GroupData: value }))
        .value();

      this.setState({
        taskData: result
      });
    });
  };

  editStatus(id) {}

  editRow() {
    let obj = {};
    obj.id = id;

    dataservice.addObject("EditTaskStatus").then(result => {});
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
                              <h3 class="zero">{item.Group}</h3>
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
                                              className="primaryBtn-2 btn smallBtn gridBtn"
                                              disabled={!data.status}
                                              onClick={() =>
                                                this.editStatus(item.id)
                                              }
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
              title={Resources[this.state.currentTitle][currentLanguage]}
            >
              <div className="mainContainer">
                <div
                  className={
                    this.state.isViewMode === true
                      ? "documents-stepper noTabs__document readOnly_inputs"
                      : "documents-stepper noTabs__document"
                  }
                >
                  <HeaderDocument
                    docTitle={Resources.taskDetails[currentLanguage]}
                  />
                  <div className="doc-container">
                    <div className="step-content">
                      <div id="step1" className="step-content-body">
                        <div className="subiTabsContent">
                          <div className="document-fields">
                            <form className="proForm datepickerContainer">
                              <div className="linebylineInput valid-input fullInputWidth">
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
                                    placeholder={
                                      Resources.subject[currentLanguage]
                                    }
                                    disabled
                                  />
                                </div>
                              </div>

                              <div className="linebylineInput valid-input fullInputWidth">
                                <label className="control-label">
                                  {Resources.arrange[currentLanguage]}
                                </label>
                                <div className="shareLinks">
                                  <div className="inputDev ui input">
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="arrange"
                                      value={this.state.arrange}
                                      name="arrange"
                                      placeholder={
                                        Resources.arrange[currentLanguage]
                                      }
                                      disabled
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="linebylineInput valid-input fullInputWidth">
                                <label className="control-label">
                                  {Resources.fromCompany[currentLanguage]}
                                </label>
                                <div className="ui input inputDev">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="fromCompany"
                                    value={this.state.fromCompanyName}
                                    name="refDoc"
                                    placeholder={
                                      Resources.fromCompany[currentLanguage]
                                    }
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="linebylineInput valid-input fullInputWidth">
                                <label className="control-label">
                                  {Resources.fromContact[currentLanguage]}
                                </label>
                                <div className="shareLinks">
                                  <div className="inputDev ui input">
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="fromContact"
                                      value={this.state.fromContactName}
                                      name="fromContact"
                                      placeholder={
                                        Resources.fromContact[currentLanguage]
                                      }
                                      disabled
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="linebylineInput valid-input fullInputWidth">
                                <label className="control-label">
                                  {Resources.actionByCompany[currentLanguage]}
                                </label>
                                <div className="ui input inputDev">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="actionByCompany"
                                    value={this.state.actionCompanyBy}
                                    name="actionByCompany"
                                    placeholder={
                                      Resources.actionByCompany[currentLanguage]
                                    }
                                    disabled
                                  />
                                </div>
                              </div>

                              <div className="linebylineInput valid-input fullInputWidth">
                                <label className="control-label">
                                  {Resources.actionByContact[currentLanguage]}
                                </label>
                                <div className="shareLinks">
                                  <div className="inputDev ui input">
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="actionByContact"
                                      value={this.state.actionBy}
                                      name="actionByContact"
                                      placeholder={
                                        Resources.actionByContact[
                                          currentLanguage
                                        ]
                                      }
                                      disabled
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="linebylineInput valid-input fullInputWidth">
                                <label className="control-label">
                                  {Resources.docDate[currentLanguage]}
                                </label>
                                <div className="ui input inputDev">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="refDoc"
                                    value={this.state.docDate}
                                    name="docDate"
                                    placeholder={
                                      Resources.docDate[currentLanguage]
                                    }
                                    disabled
                                  />
                                </div>
                              </div>

                              <div className="linebylineInput valid-input fullInputWidth">
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
                                      placeholder={
                                        Resources.startDate[currentLanguage]
                                      }
                                      disabled
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="linebylineInput valid-input fullInputWidth">
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
                                    placeholder={
                                      Resources.finishDate[currentLanguage]
                                    }
                                    disabled
                                  />
                                </div>
                              </div>

                              <div className="linebylineInput valid-input fullInputWidth">
                                <label className="control-label">
                                  {Resources.estimatedHours[currentLanguage]}
                                </label>
                                <div className="shareLinks">
                                  <div className="inputDev ui input">
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="estimatedHours"
                                      value={this.state.estimatedTime}
                                      name="estimatedHours"
                                      placeholder={
                                        Resources.estimatedHours[
                                          currentLanguage
                                        ]
                                      }
                                      disabled
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="linebylineInput valid-input fullInputWidth">
                                <label className="control-label">
                                  {Resources.delay[currentLanguage]}
                                </label>
                                <div className="ui input inputDev">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="delay"
                                    value={this.state.docDelay}
                                    name="delay"
                                    placeholder={
                                      Resources.delay[currentLanguage]
                                    }
                                    disabled
                                  />
                                </div>
                              </div>

                              <div className="linebylineInput valid-input fullInputWidth">
                                <label className="control-label">
                                  {Resources.actualTotal[currentLanguage]}
                                </label>
                                <div className="shareLinks">
                                  <div className="inputDev ui input">
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="actualTotal"
                                      value={this.state.actualTotal}
                                      name="actualTotal"
                                      placeholder={
                                        Resources.actualTotal[currentLanguage]
                                      }
                                      disabled
                                    />
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
