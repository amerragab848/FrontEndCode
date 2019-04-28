import React, { Component, Fragment } from "react";
import { Link, withRouter, NavLink } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Notif from "../../Styles/images/notif-icon.png";
import Img from "../../Styles/images/avatar.png";
import Chart from "../../Styles/images/icons/chart-nav.svg";
import Setting from "../../Styles/images/icons/setting-nav.svg";
import Message from "../../Styles/images/icons/message-nav.svg";
import config from "../../Services/Config";
import dataservice from "../../Dataservice";
import Select from "react-select";
import Resources from "../../resources.json";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import Logo from "../../Styles/images/logo.svg";
import iconActive from "../../Styles/images/notif-iconActive.png";
import notifIcon from "../../Styles/images/notif-icon.png";
import baseActive from "../../Styles/images/grey-baseActive.png";
import greyBase from "../../Styles/images/grey-base.png";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as dashboardComponantActions from "../../store/actions/communication";
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class HeaderMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0,
      projects: [],
      contactName: this.props.contactName,
      profilePath: this.props.profilePath ? this.props.profilePath : Img,
      activeClass: false,
      logOut: false,
      languageSelected: currentLanguage == "en" ? "en" : "ar",
      classRadio: currentLanguage == "en" ? true : false,
      selectedValue: {label: Resources.selectProjects[currentLanguage],value: "0"},
      viewNotification:false,
      notifications:[],
      taskes:[],
      totalNotification : 0 
    };
    config.contactName = this.props.contactName;
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeTemplate = this.handleChangeTemplate.bind(this);
    this.handleChangeSelectProject = this.handleChangeSelectProject.bind(this);
    this.ReportCenterMenu = this.ReportCenterMenu.bind(this);
  }

  componentWillMount = () => {
    dataservice.GetDataList("GetAccountsProjectsByIdForList", "projectName", "projectId").then(result => {
        this.setState({
          projects: result
        });
      });
    
      dataservice.GetDataGrid("GetNotificationPostit").then(result => {
        this.setState({
          notifications: result
        });
      });

      dataservice.GetDataGrid("GetMyNotifcations").then(result => {
        this.setState({
          taskes: result
        });
      });
  };

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
      classRadio: !this.state.classRadio
    });

    window.location.reload();
  }

  logOutHandler() {
    this.props.history.push("/");
    localStorage.clear();
    window.location.reload();
  }

  onCloseModal = () => {
    this.setState({ logOut: false });
  };

  handleChangeSelectProject(e) {
    localStorage.setItem("lastSelectedProject", e.value);
    localStorage.setItem("lastSelectedprojectName", e.label);
    this.props.actions.RouteToDashboardProject(e);
    this.props.history.push({ pathname: "/DashboardProject" });
  }

  handleChangeTemplate(e) {
    this.props.actions.RouteToTemplate();
  }

  ReportCenterMenu(e) {
    this.props.history.push({
      pathname: "/LeftReportMenu"
    });
  } 

  onClickTabItem(tabIndex) {  
    this.setState({
      tabIndex: tabIndex
    });
  }

  viewNotifications()
  {
    this.setState({
      viewNotification:!this.state.viewNotification
    });
  }

  render() {

    let totalNotification = this.state.notifications.length + this.state.taskes.length;

    return (
      <div>
        <div className="wrapper">
          <header className={ "main-header " + (this.props.showLeftMenu === false ? " dashboard__header" : " ")}>
            <div className="header-content">
              <ul className="nav-left">
                <div className="dashboard__selectMenu">
                  {this.props.showSelectProject === true ? (
                    <Select key="dash-selectproject" ref="dash-selectproject" options={this.state.projects} isSearchable="true"
                      defaultValue={this.state.value} value={this.state.selectedValue} isMulti={false} onChange={this.handleChangeSelectProject}/>
                  ) : null}
                </div>
                {this.props.showLeftMenu === true ? (
                  <Fragment>
                    <li className="titleproject1">
                      <a href="">{this.props.moduleName} ·</a>
                    </li>
                    <li className="titleproject2">{this.props.projectName}</li>
                  </Fragment>
                ) : null}
              </ul>
              <ul className="nav-right">
                {this.props.showSelectProject === true ? (
                  <li className="procoor__logo">
                    <NavLink to="/">
                      <img src={Logo} alt="logo" />
                    </NavLink>
                  </li>
                ) : null}
                <li>
                  <a data-modal="modal1" className="notfiUI" onClick={this.ReportCenterMenu}>
                    <img alt="" title="" src={Chart} />
                  </a>
                </li>
                <li>
                  <NavLink to="/TemplatesSettings" onClick={this.handleChangeTemplate} >
                    <img alt="" title="" src={Setting} />
                  </NavLink>
                </li>
                <li className="notifi-icon">
                  <a onClick={this.viewNotifications.bind(this)}>
                    <img alt="" title="" src={Notif} />
                    <div className="inboxNotif smallSquare">{totalNotification}</div>
                  </a>
                </li>
                <li>
                  <a>
                    <img alt="" title="" src={Message} />
                  </a>
                </li>
                <li className="UserImg ">
                  <div className={ this.state.activeClass === false ? "dropdownContent" : "dropdownContent active" } onClick={this.openProfile}>
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
                            <input type="radio" value="en" checked={this.state.languageSelected === "en"} onChange={event => this.handleChange(event)}/>
                            <label>English</label>
                          </div>
                          <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" value="ar" checked={this.state.languageSelected === "ar"} onChange={event => this.handleChange(event)}/>
                            <label>عربى</label>
                          </div>
                        </div>
                        <div className="item">
                          <div className="item-content" onClick={this.userLogOut}>
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
          <ConfirmationModal closed={this.onCloseModal} showDeleteModal={this.state.logOut} clickHandlerCancel={this.onCloseModal}
            clickHandlerContinue={() => this.logOutHandler()} title="You Will Be Missed, Are You Sure Want to Leave US?" buttonName="submit"/> ) : null}
        {this.state.viewNotification ?   <div className="notifiBar">
          <div className="smallNotifiBar">
            <div className="notifi__tabs">
              <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.onClickTabItem(tabIndex)}>
                <TabList className="zero">
                  <Tab>
                  <div className="active">
                    <span className="imgWrapper not__icon">
                      <img className="activeImg" src={iconActive} />
                      <img className="normalImg" src={notifIcon} />
                    </span>
                    <span className="tabNAme">
                      {Resources["general"][currentLanguage]}
                    </span>
                  </div>
                  </Tab>
                  <Tab>
                  <div className="active">
                    <span className="imgWrapper base__icon">
                      <img className="activeImg" src={baseActive} />
                      <img className="normalImg" src={greyBase} />
                    </span>
                    <span className="tabNAme">
                      {Resources["myTasks"][currentLanguage]}
                    </span>
                  </div>
                  </Tab>
                </TabList>
                <TabPanel>
                  <div className="notifiContent">
                    <figure className="avatarProfile smallAvatarSize">
                      <img alt="" title="" src="../images/24176695_10215314500400869_7164682088117484142_n.jpg" />
                    </figure>
                    <div className="notfiText">
                      <div className="notifiName">
                        <h3>Ahmed Gaber Galal</h3>
                        <p>· 4h ago</p>
                      </div>
                      <p className="notofoWorkflow">
                        Added you to workflow <a href="#">“Glazing work”</a>
                      </p>
                    </div>
                  </div> 
                </TabPanel>
                <TabPanel>
                  <div className="notifiContent">
                    <figure className="avatarProfile smallAvatarSize">
                      <img alt="" title="" src="../images/24176695_10215314500400869_7164682088117484142_n.jpg"/>
                    </figure>
                    <div className="notfiText">
                      <div className="notifiName">
                        <h3>Ahmed Gaber Galal</h3>
                        <p>· 4h ago</p>
                      </div>
                      <p className="notofoWorkflow">
                        Added you to workflow <a href="#">“Glazing work”</a>
                      </p>
                    </div>
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>:null} 
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    showLeftMenu: state.communication.showLeftMenu,
    showSelectProject: state.communication.showSelectProject,
    projectId: state.communication.projectId,
    projectName: state.communication.projectName,
    moduleName: state.communication.moduleName,
    showLeftReportMenu: state.communication.showLeftReportMenu
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(dashboardComponantActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(HeaderMenu));
