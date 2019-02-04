import React, { Component } from "react";
import Api from "../../api";
import "react-table/react-table.css";
import "../../Styles/scss/en-us/layout.css"; 
import Notif from "../../Styles/images/notif-icon.png";
import Img from "../../Styles/images/avatar.png";
import Chart from "../../Styles/images/icons/chart-nav.svg";
import Setting from "../../Styles/images/icons/setting-nav.svg";
import Message from "../../Styles/images/icons/message-nav.svg";
import "../../Styles/css/font-awesome.min.css";
//import Resources from "../../resources.json";
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class LeftMenu extends Component {
  constructor(props) {
    super(props); 
  }
 

  componentWillMount = () => {};

  render() {
    return (
      <div>
        <div className="notificontainer">
          <div className="notifiAfterActions notifiActionsContainer">
            <span className="notfiSpan">Document has been deleted</span>
            <a href="" className="notifiActionBtn">
              UNDO
            </a>
          </div>
        </div>
        <div className="wrapper">
          <header className="main-header">
            <div className="header-content">
              <ul className="nav-left">
                <li className="titleproject1">
                  <a href="">Technical office ·</a>
                </li>
                <li className="titleproject2">East town (P2)</li>
              </ul>
              <ul className="nav-right">
                <li>
                  <a data-modal="modal1" className="notfiUI">
                    <img alt="" title="" src={Chart} />
                  </a>
                </li>
                <li>
                  <a
                    href="Templates_Settings.html"
                    data-modal="modal2"
                    className="notfiUI settingIcon"
                  >
                    <img alt="" title="" src={Setting} />
                  </a>
                </li>
                <li className="notifi-icon">
                  <a>
                    <img alt="" title="" src={Notif} />
                    <div className="inboxNotif smallSquare">12</div>
                  </a>
                </li>
                <li>
                  <a>
                    <img alt="" title="" src={Message} />
                  </a>
                </li>
                <li className="UserImg ">
                  <div className="dropdownContent">
                    <figure className="zero avatarProfile onlineAvatar">
                      <img alt="" title="" src={Img} />
                      <span className="avatarStatusCircle" />
                    </figure>
                    <span className="profileName">Ahmed Salah</span>
                    <div className="ui dropdown classico basic">
                      <i className="dropdown icon" />
                      <div className="menu center">
                        <div className="item">
                          <div className="item-content">Settings</div>
                        </div>
                        <div className="item">
                          <div className="item-content">Log Out</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <div className="clearfix" />
            </div>
          </header>
        </div>
      </div>
    );
  }
}

export default LeftMenu;
