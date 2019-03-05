import React, { Component } from "react";
import { Link,withRouter,NavLink } from "react-router-dom";
import Api from "../../api"; 
import "../../Styles/css/rodal.css";
import "react-table/react-table.css";
import "../../Styles/scss/en-us/layout.css";
import Notif from "../../Styles/images/notif-icon.png";
import Img from "../../Styles/images/avatar.png";
import Chart from "../../Styles/images/icons/chart-nav.svg";
import Setting from "../../Styles/images/icons/setting-nav.svg";
import Message from "../../Styles/images/icons/message-nav.svg";
import config from "../../Services/Config";
import "../../Styles/css/font-awesome.min.css";
import Resources from "../../resources.json";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class HeaderMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contactName: this.props.contactName,
      profilePath: this.props.profilePath?this.props.profilePath: Img,
      activeClass: false,
      logOut: false,
      languageSelected: currentLanguage == "en" ?  "en" : "ar" ,
      classRadio: currentLanguage == "en" ? true:false
    };
  }

  componentWillMount = () => {};

  openProfile = () => {
    this.setState({
      activeClass: !this.state.activeClass
    });
  };
  userLogOut = () => {
    this.setState({
      logOut: true
    });
  }; 

  handleChange(event) {
    localStorage.setItem("lang", event.target.value);

    this.setState({
      languageSelected: event.target.value,
      classRadio:!this.state.classRadio
    });

    window.location.reload();
  }

  logOutHandler(){ 
    this.props.history.push('/'); 
    localStorage.clear();
    window.location.reload();
  }

  onCloseModal = () => {
    this.setState({ logOut: false });
  };

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
              <ul className="nav-right">
                <li>
                  <a data-modal="modal1" className="notfiUI">
                    <img alt="" title="" src={Chart} />
                  </a>
                </li>
                <li>
                <NavLink to='/TemplatesSettings' >
                  <img alt="" title="" src={Setting} />
                
                                  
                 </NavLink>
                  {/* <a
                    href="/TemplatesSettings"
                    data-modal="modal2"
                    className="notfiUI settingIcon"
                  >
                    <img alt="" title="" src={Setting} />
                  </a> */}

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
                  <div className={ this.state.activeClass === false ? "dropdownContent" : "dropdownContent active"} onClick={this.openProfile}>
                    <figure className="zero avatarProfile onlineAvatar">
                      <img alt="" title="" src={this.state.profilePath} />
                      <span className="avatarStatusCircle" />
                    </figure>
                    <span className="profileName">
                      {this.state.contactName}
                    </span>
                    <div className="ui dropdown classico basic">
                      <i className="dropdown icon" />
                      <div className="menu center left">
                        <div className="item"> 
                          <Link to="/ProfileSetting" className="item-content">
                            {Resources["profile"][currentLanguage]}
                          </Link>
                        </div>
                        <div className="item"> 
                          <Link to="/PrivacySetting" className="item-content">
                            {Resources["privacySettings"][currentLanguage]}
                          </Link> 
                        </div>
                        <div className="item">
                          <div className="item-content">
                            {Resources["clearSettings"][currentLanguage]}
                          </div>
                        </div>
                        <div className="item">
                          <div className="item-content">
                            {Resources["clearCach"][currentLanguage]}
                          </div>
                        </div>
                        <div className="item">
                          <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" value="en" checked={this.state.languageSelected === "en"}
                              onChange={event => this.handleChange(event)}/>
                            <label>English</label>
                          </div>
                          <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" value="ar" checked={this.state.languageSelected === "ar"}
                              onChange={event => this.handleChange(event)}/>
                            <label>عربى</label>
                          </div>
                        </div>
                        <div className="item">
                          <div
                            className="item-content"
                            onClick={this.userLogOut}
                          >
                            {Resources["logout"][currentLanguage]}
                          </div>
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
        {this.state.logOut ? (
          <ConfirmationModal 
              closed={this.onCloseModal} 
              showDeleteModal={this.state.logOut}
              clickHandlerCancel={this.onCloseModal}
              clickHandlerContinue={()=> this.logOutHandler()}
              title="You Will Be Missed, Are You Sure Want to Leave US?"
              buttonName="submit"
            />
        ) : null}
      </div>
    );
  }
}

export default  withRouter(HeaderMenu);
