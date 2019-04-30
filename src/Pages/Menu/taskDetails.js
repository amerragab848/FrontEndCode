import React, { Component } from "react";
import dataservice from "../../Dataservice";
import Config from "../../Services/Config.js";
import Resources from "../../resources.json";
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";
import moment from "moment";
import { toast } from "react-toastify";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
 
let id = 0;
class TaskDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id:0, 
      subject: "",
      arrange: 0,
      fromCompanyName: "",
      fromContactName: "",
      actionCompanyBy: "",
      actionBy: "",
      docDate: "",
      startDate: "",
      finishDate: "",
      estimatedTime: "",
      actualTotal: "",
      docDelay: ""
    }; 

     id =this.props.location.search.split("=")[1];
    
     if (!Config.IsAllow(361)) {
        toast.warn(Resources["missingPermissions"][currentLanguage]);
        this.props.history.push({pathname: "/"});
    }
  }

  componentWillMount = () => {
    dataservice.GetDataGrid("GetTaskForEdit?id="+id).then(result => {
      this.setState({
        id: id,
        subject: result.subject,
        arrange: result.arrange,
        fromCompanyName: result.fromCompanyName,
        fromContactName: result.fromContactName,
        actionCompanyBy: result.actionCompanyBy,
        actionBy: result.actionBy,
        docDate: moment(result.docDate).format("DD/MM/YYYY"),
        startDate: moment(result.startDate).format("DD/MM/YYYY"),
        finishDate: moment(result.finishDate).format("DD/MM/YYYY"),
        estimatedTime: result.estimatedTime,
        actualTotal: result.actualTotal,
        docDelay: result.docDelay
      });
    });
  };

  render() {
    return (
      <div className="mainContainer">
        <div className={ this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document" }>
          <HeaderDocument docTitle={Resources.taskDetails[currentLanguage]} />
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
                          <input type="text" className="form-control" id="subject" value={this.state.subject} name="subject"
                            placeholder={Resources.subject[currentLanguage]} disabled />
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
                              placeholder={Resources.arrange[currentLanguage]}
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
                            placeholder={Resources.fromCompany[currentLanguage]}
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
                                Resources.actionByContact[currentLanguage]
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
                            placeholder={Resources.docDate[currentLanguage]}
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
                              placeholder={Resources.startDate[currentLanguage]}
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
                            placeholder={Resources.finishDate[currentLanguage]}
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
                                Resources.estimatedHours[currentLanguage]
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
                            placeholder={Resources.delay[currentLanguage]}
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
    );
  }
}

export default TaskDetails;
