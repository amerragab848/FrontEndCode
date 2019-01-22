import React, { Component } from "react"; 
import Modales from "./modal";
import Api from "../../api";
import "../../Styles/css/rodal.css";
import language from "../../resources.json";
import Navigate from "../../Navigate";

let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class ApprovedWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      dataList: [],
      isModal: this.props.props.isModal,
      action: 0
    };
  }

  componentDidMount() {
    Api.get(this.props.props.api).then(result => {
      this.setState({
        dataList: result
      });
    });
  }

  onOpenModal = (action, value, id) => {
    if (value > 0) {
      if (id === "wt-AssessmentSummary-1") {
        if (action === 1) {
          Navigate({
            pathname: "timeSheetDetails"
          });
        } else if (action === 2) {
          Navigate({
            pathname: "docApprovalDetails",
            search: "?action=" + action
          });
        } else {
          Navigate({
            pathname: "pendingExpensesDetails"
          });
        }
      }  else if (id === "wt-RejecerdItem-7") {
        if (action === 1) {
          Navigate({
            pathname: "docApprovalDetails",
            search: "?action=" + action
          });
        } else if (action === 2) {
          Navigate({
            pathname: "docNotifyLogDetails"
          });
        }
      } else {

        let pathname = this.props.props.route + action;

        Navigate({
          pathname: pathname
        });
      }
    }
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  drawThreeCard() {
    let widgetes = [];

    if (this.state.dataList.length > 0) {
      widgetes = this.state.dataList;

      var high = widgetes.find(function(i) {
        return i.action === 1;
      });

      var normal = widgetes.find(function(i) {
        return i.action === 2;
      });

      var low = widgetes.find(function(i) {
        return i.action === 3;
      });

      return (
        <div className="summerisItem">
          <div className="content">
            <h4 className="title">{this.props.title}</h4>
            <p
              className="number"
              onClick={() =>
                this.onOpenModal(
                  high.action,
                  high[this.props.value],
                  this.props.id
                )
              }
            >
              {high ? high[this.props.value] : 0}
            </p>
            <p className="status">
              {high ? language[high[this.props.text]][currentLanguage] : ""}
            </p>
            <ul className="satusBarUL">
              <li className="num-1" />
              <li className="num-2" />
              <li className="num-3" />
            </ul>
            <div className="summerisList">
              <div className="first">
                <span
                  className="mediumModal"
                  onClick={() =>
                    this.onOpenModal(
                      normal.action,
                      normal[this.props.value],
                      this.props.id
                    )
                  }
                >
                  {normal ? normal[this.props.value] : 0}
                </span>
                {normal
                  ? language[normal[this.props.text]][currentLanguage]
                  : ""}
              </div>
              <div>
                <span
                  className="mediumModal"
                  onClick={() =>
                    this.onOpenModal(
                      low.action,
                      low[this.props.value],
                      this.props.id
                    )
                  }
                >
                  {low ? low[this.props.value] : ""}
                </span>
                {low ? language[low[this.props.text]][currentLanguage] : ""}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <div>{this.drawThreeCard()}</div>
        <div>
          {this.state.open ? (
            <Modales
              title={this.props.title}
              opened={this.state.open}
              closed={this.onCloseModal}
              id={this.props.id}
              key={this.props.id}
              apiDetails={this.props.props.apiDetails}
              action={this.state.action}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default ApprovedWidget;
