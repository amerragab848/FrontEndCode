import React, { Component } from "react";
import Api from "../../api"; 
import "../../Styles/scss/en-us/layout.css";

class TimeSheetDetails extends Component {
  componentDidMount() {
    Api.get("GetApprovalRequestsGroupByUserId?requestType=timeSheet").then(
      result => {
        console.log(result);
      }
    );
  }

  render() {
    return (
      <div className="mainContainer">
        <div className="submittalFilter">
          <div className="subFilter">
            <h3 className="zero">TimeSheet</h3>
          </div>
        </div>
        <div className="gridfillter-container">
          <div className="fillter-status-container">
           <div className="form-group fillterinput fillter-item-c">
            <label className="control-label">Report to</label>
              <div className="inputDev ui input">
                    <input autoComplete="off" type="text" className="form-control" id="lastname1" name="firstname1" placeholder="eg. Gamal wahdan"/>
              </div>
           </div>
           <div className="fillter-status fillter-item-c">
                <label className="control-label">Status</label> 
                <div className="ui fluid selection dropdown singleDropDown" tabIndex="0"> 
                    <input type="hidden" name="country"/>
                    <i className="dropdown icon"></i>
                    <div className="default text">
                        Select status
                    </div>
                    <div className="menu" tabIndex="-1" style={{overflow: 'hidden', outline: 'none'}}>
                        <div className="item">
                            Offline
                        </div>
                        <div className="item">
                            Opend
                        </div>
                        <div className="item">
                            Closed
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

export default TimeSheetDetails;
