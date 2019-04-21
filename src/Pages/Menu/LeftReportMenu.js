import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../Styles/images/logo.svg";
import Router from "../../URLRoutes";
import Resources from "../../resources.json"; 
import Config from "../../Services/Config";

import { connect } from 'react-redux';
import {
  bindActionCreators
} from 'redux';

import * as dashboardComponantActions from '../../store/actions/communication';


let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

var viewModules = true;

class LeftReportMenu extends Component {
  constructor(props) {
    super(props);

    let inventory = [];
    let OtherReports = [];
    let technicalOffice = [];
    let contractPoMenu = [];
    let ProjectReports = [];

    //initialize of link
    Router.map(route => {
      if (route.settings) {
        if (route.settings.OtherReports === true) {
          if (Config.IsAllow(route.settings.permission)) {
            OtherReports.push(route);
          }
        }
        else if (route.settings.technicalOffice === true) {
          if (Config.IsAllow(route.settings.permission)) {
            technicalOffice.push(route);
          }
        }
        else if (route.settings.ContractsPo === true) {
          if (Config.IsAllow(route.settings.permission)) {
            contractPoMenu.push(route);
          }
        }
        else if (route.settings.inventory === true) {
          if (Config.IsAllow(route.settings.permission)) {
            inventory.push(route);
          }
        }
        else if (route.settings.ProjectReports === true) {
          if (Config.IsAllow(route.settings.permission)) {
            ProjectReports.push(route);
          }
        }
      }
    });

    this.state = {
      moduleName: "General",
      hover: false,
      viewEps: false,
      viewModules: true,
      accordion: true,
      viewSubMenu: false,
      rowIndex: 0,
      ActivePanal: 0,
      titleProject: "",
      currentIndex: 0,
      inventory: inventory,
      contractPoMenu: contractPoMenu,
      OtherReports: OtherReports,
      technicalOffice: technicalOffice,
      ProjectReports: ProjectReports
    };
  }

  hoverOn = () => {
    this.setState({ hover: true });
  };

  hoverOff = () => {
    this.setState({
      hover: false
    });

    if (this.state.ActivePanal != 0) {
      if (this.state.ActivePanal === 1) {
        this.setState(state => {
          return {
            viewEps: true,
            viewModules: false,
            viewProjects: false
          };
        });
        viewModules = false;
      } else {
        this.setState(state => {
          return {
            viewModules: true
          };
        });
        viewModules = true;
      }
    }
  };

  OpenSubMenu = (id, moduleName) => {
    if (this.state.rowIndex != id) {
      this.setState({ rowIndex: id, moduleName: moduleName });
    } else {
      this.setState({ rowIndex: 0, moduleName: moduleName });
    }

  };

  componentWillMount = () => {
    this.props.actions.ReportCenterMenuClick();

  };

  activeLi = (index, length) => {

    for (var i = 0; i < length; i++) {
      if (i == index)
        this.setState({ [i]: true });
      if (i != index)
        this.setState({ [i]: false });
    }
  }

  render() {
    return (
      <div>
        {this.props.showLeftReportMenu === true ?
          <div className="mainSide" id="sidebar" onMouseEnter={() => this.hoverOn()} onMouseLeave={() => this.hoverOff()}>
            <div className="header-logo-menu">
              <div className={this.state.hover ? "header-logocontent hover" : "header-logocontent"}>
                <div className="content-collapse">
                  <div className="procoorLogo">
                    <NavLink to="/" >
                      <img src={Logo} alt="logo" title="logo" />
                    </NavLink>
                  </div>
                  <div className="clearfix" />
                </div>
              </div>
            </div>
            <div className="sidebar__inner">
              <aside className="mainSideNav">
                <div className={this.state.hover ? "mainSidenavContent hover" : "mainSidenavContent"} >
                  <div className="sidenavinner">

                    <div className={(viewModules) ? "modulesMenuIcons active " : "modulesMenuIcons  hidden "}>

                      <ul className="ui accordion MenuUl PM-color zero">

                        <li className={this.state.rowIndex === 2 ? "ActiveSubLi" : ""}>
                          <a className={this.state.rowIndex === 2 ? "title active" : "title"} onClick={() => this.OpenSubMenu(2, Resources["technicalOffice"][currentLanguage])}>
                            <span className="ULimg">
                              <svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"                              >
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"                              >
                                  <g id="Action-icons/Navigation/Communication/Line/36px/Grey_base">
                                    <g id="comnctn"><rect id="bg" fill="#80CBC4" opacity="0" x="0" y="0" width="36" height="36" />
                                      <path d="M29,13.9870844 C29,17.788841 29,20.2375244 29,21.3331345 C29,22.9765498 28.0396374,23.9853881 25.8425647,23.9853881 C24.3778495,23.9853881 20.2839999,23.9853881 13.5610158,23.9853881 L8.89955569,26.8064699 C8.52492723,27.042532 8.04495174,27.0643051 7.64875134,26.8626215 C7.25375517,26.6609379 7.00359093,26.2678677 7,25.838157 L7,11.9335791 C7,10.313246 8.37171748,9 10.0641949,9 L25.9358051,9 C26.7485215,9 27.5289413,9.30940458 28.1034779,9.85945065 C28.6780144,10.4094967 29,11.1555059 29,11.9335791 L29,13.9870844 Z M9.41427723,11.9335791 L9.41566386,23.6679833 L12.246526,21.9078358 C12.4460576,21.7772006 12.6816674,21.706152 12.923284,21.7027141 L25.9703854,21.7027141 C26.1338789,21.7027141 26.2901468,21.6408332 26.4055453,21.530824 C26.5209437,21.4208148 26.5858561,21.2706859 26.5858561,21.1159866 L26.5858561,11.9335908 C26.5858561,11.7777327 26.5209437,11.6287626 26.4055453,11.5187534 C26.2901468,11.4087442 26.1338666,11.3468632 25.9703854,11.3468632 L10.0309376,11.3468632 C9.6907522,11.3468632 9.41547922,11.6092719 9.41427723,11.9335791 Z M19.9069681,16.1425023 C19.9069681,17.1795811 19.0424359,18.0195235 17.9750633,18.0195235 C16.9076906,18.0195235 16.0431584,17.1795518 16.0431584,16.1425023 C16.0431584,15.1054527 16.9076906,14.265481 17.9750633,14.265481 C19.0424359,14.265481 19.9069681,15.1054527 19.9069681,16.1425023 Z M15.2113808,16.1425023 C15.2113808,17.1795811 14.3468485,18.0195235 13.2794759,18.0195235 C12.2121033,18.0195235 11.347571,17.1795518 11.347571,16.1425023 C11.347571,15.1054527 12.2121033,14.265481 13.2794759,14.265481 C14.3468485,14.265481 15.2113808,15.1054527 15.2113808,16.1425023 Z M24.5964409,16.1425023 C24.5964409,17.1795811 23.7319087,18.0195235 22.6645361,18.0195235 C21.5971634,18.0195235 20.7326312,17.1795518 20.7326312,16.1425023 C20.7326312,15.1054527 21.5971634,14.265481 22.6645361,14.265481 C23.7319087,14.265481 24.5964409,15.1054527 24.5964409,16.1425023 Z"
                                        id="Combined-Shape" fill="#A8B0BF" fillRule="nonzero" />
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            </span>
                            <span className="UlName">{Resources["technicalOffice"][currentLanguage]}</span>
                          </a>
                          <ul className={this.state.rowIndex === 2 ? "content subBigMenuUl active" : "content subBigMenuUl"}>
                            {this.state.technicalOffice.map((r, index) => {
                              return (
                                <li key={index} className={(this.state[index] === true && this.state.rowIndex === 2) ? "active" : " "} onClick={() => this.activeLi(index, this.state.technicalOffice.length)}>
                                  <NavLink to={"/" + r.route} >
                                    {Resources[r.title][currentLanguage]}
                                  </NavLink>
                                </li>
                              )
                            })
                            }
                          </ul>
                        </li>

                        <li className={this.state.rowIndex === 4 ? "ActiveSubLi" : ""}>
                          <a className={this.state.rowIndex === 4 ? "title active" : "title"} onClick={() => this.OpenSubMenu(4, Resources["otherReports"][currentLanguage])}>
                            <span className="ULimg"> <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"                            >
                              <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="Components/Nav/Side-left/Closed/Base" transform="translate(-32.000000, -451.000000)">
                                  <g id="Group-3">
                                    <g id="Group-2" transform="translate(0.000000, 160.000000)">
                                      <g id="Group-14" transform="translate(0.000000, 272.000000)">
                                        <g id="Action-icons/Navigation/Technical-office/Line/36px/Grey_base" transform="translate(26.000000, 13.000000)"                                        >
                                          <g id="tcncl-ofc"><rect id="bg" fill="#80CBC4" opacity="0" x="0" y="0" width="36" height="36" />
                                            <path
                                              d="M20.8386058,14.4397103 L20.8386058,16.8715936 L20.8285105,16.8715936 L20.8285105,27.5681292 L25.7294128,27.5681292 L25.7294128,17.218559 C25.7294128,17.0271398 25.5702444,16.8715936 25.3743677,16.8715936 L22.1820198,16.8715936 L22.1820198,14.4397103 L25.3743677,14.4397103 C26.1281491,14.4397103 26.8516805,14.7327173 27.3848896,15.2537842 C27.9181045,15.7748568 28.2179273,16.4819019 28.2179273,17.218559 L28.2179273,27.5681268 L28.7557427,27.5681167 C29.4432151,27.5681167 30,28.1122308 30,28.7840583 C30,29.4558877 29.4432228,30 28.7557427,30 L7.24425727,30 C6.55678492,30 6,29.4558859 6,28.7840583 C6,28.112229 6.55677724,27.5681167 7.24425727,27.5681167 L7.78458734,27.5681167 L7.78458734,10.6543371 C7.78458734,9.98275009 8.34236314,9.43839542 9.0288446,9.43839542 L9.86368046,9.43839542 L9.86368046,8.46626726 C9.86368046,7.10456322 10.9939656,6 12.3873796,6 L16.2257054,6 C17.6199969,6 18.7494046,7.10420142 18.7494046,8.46626726 L18.7494046,9.43839542 L19.5842404,9.43839542 C19.91444,9.43839542 20.2306554,9.56652382 20.4640269,9.79458448 C20.6973962,10.022643 20.8285105,10.3316739 20.8285105,10.6543496 L20.8285105,14.4397103 L20.8386058,14.4397103 Z M10.2731147,11.8702912 L10.2731147,27.5681292 L18.339996,27.5681292 L18.339996,11.8702912 L10.2731147,11.8702912 Z M16.2609156,9.43842042 L16.2609156,8.46629226 C16.2609156,8.45712656 16.2572966,8.44859676 16.2505612,8.44201463 C16.2438302,8.43543688 16.2350909,8.43189581 16.2257182,8.43189581 L12.3873924,8.43189581 C12.3683038,8.43189581 12.3522078,8.44760411 12.3522078,8.46627976 L12.3522078,9.43842042 L16.2609156,9.43842042 Z M11.3003658,14.4678302 L17.2113876,14.4678302 L17.2113876,16.5683772 L11.3003658,16.5683772 L11.3003658,14.4678302 Z M11.3003658,17.7499349 L17.2113876,17.7499349 L17.2113876,19.8504819 L11.3003658,19.8504819 L11.3003658,17.7499349 Z M11.3003658,21.0320396 L17.2113876,21.0320396 L17.2113876,23.1325866 L11.3003658,23.1325866 L11.3003658,21.0320396 Z"
                                              id="Combined-Shape" fill="#858D9E" fillRule="nonzero" />
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </svg>
                            </span>
                            <span className="UlName"> {Resources["otherReports"][currentLanguage]} </span>
                          </a>
                          <ul className={this.state.rowIndex === 4 ? "content subBigMenuUl active" : "content subBigMenuUl"}>
                            {this.state.OtherReports.map((r, index) => {
                              return (
                                <li key={index} className={(this.state[index] === true && this.state.rowIndex === 2) ? "active" : " "} onClick={() => this.activeLi(index, this.state.OtherReports.length)}>
                                  <NavLink to={"/" + r.route} >
                                    {Resources[r.title][currentLanguage]}
                                  </NavLink>
                                </li>
                              )
                            })
                            } 
                          </ul>
                        </li>


                        <li className={this.state.rowIndex === 3 ? "ActiveSubLi" : ""}>
                          <a className={this.state.rowIndex === 3 ? "title active" : "title"} onClick={() => this.OpenSubMenu(3, Resources["otherReports"][currentLanguage])}>
                            <span className="ULimg"> <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"                            >
                              <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="Components/Nav/Side-left/Closed/Base" transform="translate(-32.000000, -451.000000)">
                                  <g id="Group-3">
                                    <g id="Group-2" transform="translate(0.000000, 160.000000)">
                                      <g id="Group-14" transform="translate(0.000000, 272.000000)">
                                        <g id="Action-icons/Navigation/Technical-office/Line/36px/Grey_base" transform="translate(26.000000, 13.000000)"                                        >
                                          <g id="tcncl-ofc"><rect id="bg" fill="#80CBC4" opacity="0" x="0" y="0" width="36" height="36" />
                                            <path
                                              d="M20.8386058,14.4397103 L20.8386058,16.8715936 L20.8285105,16.8715936 L20.8285105,27.5681292 L25.7294128,27.5681292 L25.7294128,17.218559 C25.7294128,17.0271398 25.5702444,16.8715936 25.3743677,16.8715936 L22.1820198,16.8715936 L22.1820198,14.4397103 L25.3743677,14.4397103 C26.1281491,14.4397103 26.8516805,14.7327173 27.3848896,15.2537842 C27.9181045,15.7748568 28.2179273,16.4819019 28.2179273,17.218559 L28.2179273,27.5681268 L28.7557427,27.5681167 C29.4432151,27.5681167 30,28.1122308 30,28.7840583 C30,29.4558877 29.4432228,30 28.7557427,30 L7.24425727,30 C6.55678492,30 6,29.4558859 6,28.7840583 C6,28.112229 6.55677724,27.5681167 7.24425727,27.5681167 L7.78458734,27.5681167 L7.78458734,10.6543371 C7.78458734,9.98275009 8.34236314,9.43839542 9.0288446,9.43839542 L9.86368046,9.43839542 L9.86368046,8.46626726 C9.86368046,7.10456322 10.9939656,6 12.3873796,6 L16.2257054,6 C17.6199969,6 18.7494046,7.10420142 18.7494046,8.46626726 L18.7494046,9.43839542 L19.5842404,9.43839542 C19.91444,9.43839542 20.2306554,9.56652382 20.4640269,9.79458448 C20.6973962,10.022643 20.8285105,10.3316739 20.8285105,10.6543496 L20.8285105,14.4397103 L20.8386058,14.4397103 Z M10.2731147,11.8702912 L10.2731147,27.5681292 L18.339996,27.5681292 L18.339996,11.8702912 L10.2731147,11.8702912 Z M16.2609156,9.43842042 L16.2609156,8.46629226 C16.2609156,8.45712656 16.2572966,8.44859676 16.2505612,8.44201463 C16.2438302,8.43543688 16.2350909,8.43189581 16.2257182,8.43189581 L12.3873924,8.43189581 C12.3683038,8.43189581 12.3522078,8.44760411 12.3522078,8.46627976 L12.3522078,9.43842042 L16.2609156,9.43842042 Z M11.3003658,14.4678302 L17.2113876,14.4678302 L17.2113876,16.5683772 L11.3003658,16.5683772 L11.3003658,14.4678302 Z M11.3003658,17.7499349 L17.2113876,17.7499349 L17.2113876,19.8504819 L11.3003658,19.8504819 L11.3003658,17.7499349 Z M11.3003658,21.0320396 L17.2113876,21.0320396 L17.2113876,23.1325866 L11.3003658,23.1325866 L11.3003658,21.0320396 Z"
                                              id="Combined-Shape" fill="#858D9E" fillRule="nonzero" />
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </svg>
                            </span>
                            <span className="UlName"> {Resources["contractPo"][currentLanguage]} </span>
                          </a>
                          <ul className={this.state.rowIndex === 3 ? "content subBigMenuUl active" : "content subBigMenuUl"}>
                            {this.state.contractPoMenu.map((r, index) => {
                              return (
                                <li key={index} className={(this.state[index] === true && this.state.rowIndex === 2) ? "active" : " "} onClick={() => this.activeLi(index, this.state.contractPoMenu.length)}>
                                  <NavLink to={"/" + r.route} >
                                    {Resources[r.title][currentLanguage]}
                                  </NavLink>
                                </li>
                              )
                            })
                            } 
                          </ul>
                        </li>
                        

                        

                        <li className={this.state.rowIndex === 5 ? "ActiveSubLi" : ""}>
                          <a className={this.state.rowIndex === 5 ? "title active" : "title"} onClick={() => this.OpenSubMenu(5, Resources["otherReports"][currentLanguage])}>
                            <span className="ULimg"> <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"                            >
                              <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="Components/Nav/Side-left/Closed/Base" transform="translate(-32.000000, -451.000000)">
                                  <g id="Group-3">
                                    <g id="Group-2" transform="translate(0.000000, 160.000000)">
                                      <g id="Group-14" transform="translate(0.000000, 272.000000)">
                                        <g id="Action-icons/Navigation/Technical-office/Line/36px/Grey_base" transform="translate(26.000000, 13.000000)"                                        >
                                          <g id="tcncl-ofc"><rect id="bg" fill="#80CBC4" opacity="0" x="0" y="0" width="36" height="36" />
                                            <path
                                              d="M20.8386058,14.4397103 L20.8386058,16.8715936 L20.8285105,16.8715936 L20.8285105,27.5681292 L25.7294128,27.5681292 L25.7294128,17.218559 C25.7294128,17.0271398 25.5702444,16.8715936 25.3743677,16.8715936 L22.1820198,16.8715936 L22.1820198,14.4397103 L25.3743677,14.4397103 C26.1281491,14.4397103 26.8516805,14.7327173 27.3848896,15.2537842 C27.9181045,15.7748568 28.2179273,16.4819019 28.2179273,17.218559 L28.2179273,27.5681268 L28.7557427,27.5681167 C29.4432151,27.5681167 30,28.1122308 30,28.7840583 C30,29.4558877 29.4432228,30 28.7557427,30 L7.24425727,30 C6.55678492,30 6,29.4558859 6,28.7840583 C6,28.112229 6.55677724,27.5681167 7.24425727,27.5681167 L7.78458734,27.5681167 L7.78458734,10.6543371 C7.78458734,9.98275009 8.34236314,9.43839542 9.0288446,9.43839542 L9.86368046,9.43839542 L9.86368046,8.46626726 C9.86368046,7.10456322 10.9939656,6 12.3873796,6 L16.2257054,6 C17.6199969,6 18.7494046,7.10420142 18.7494046,8.46626726 L18.7494046,9.43839542 L19.5842404,9.43839542 C19.91444,9.43839542 20.2306554,9.56652382 20.4640269,9.79458448 C20.6973962,10.022643 20.8285105,10.3316739 20.8285105,10.6543496 L20.8285105,14.4397103 L20.8386058,14.4397103 Z M10.2731147,11.8702912 L10.2731147,27.5681292 L18.339996,27.5681292 L18.339996,11.8702912 L10.2731147,11.8702912 Z M16.2609156,9.43842042 L16.2609156,8.46629226 C16.2609156,8.45712656 16.2572966,8.44859676 16.2505612,8.44201463 C16.2438302,8.43543688 16.2350909,8.43189581 16.2257182,8.43189581 L12.3873924,8.43189581 C12.3683038,8.43189581 12.3522078,8.44760411 12.3522078,8.46627976 L12.3522078,9.43842042 L16.2609156,9.43842042 Z M11.3003658,14.4678302 L17.2113876,14.4678302 L17.2113876,16.5683772 L11.3003658,16.5683772 L11.3003658,14.4678302 Z M11.3003658,17.7499349 L17.2113876,17.7499349 L17.2113876,19.8504819 L11.3003658,19.8504819 L11.3003658,17.7499349 Z M11.3003658,21.0320396 L17.2113876,21.0320396 L17.2113876,23.1325866 L11.3003658,23.1325866 L11.3003658,21.0320396 Z"
                                              id="Combined-Shape" fill="#858D9E" fillRule="nonzero" />
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </svg>
                            </span>
                            <span className="UlName"> {Resources["projectReports"][currentLanguage]} </span>
                          </a>
                          <ul className={this.state.rowIndex === 5 ? "content subBigMenuUl active" : "content subBigMenuUl"}>
                            {this.state.ProjectReports.map((r, index) => {
                              return (
                                <li key={index} className={(this.state[index] === true && this.state.rowIndex === 2) ? "active" : " "} onClick={() => this.activeLi(index, this.state.contractPoMenu.length)}>
                                  <NavLink to={"/" + r.route} >
                                    {Resources[r.title][currentLanguage]}
                                  </NavLink>
                                </li>
                              )
                            })
                            } 
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
          : null
        }
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    showLeftMenu: state.communication.showLeftMenu,
    showLeftReportMenu: state.communication.showLeftReportMenu,
    projectId: state.communication.projectId,
    projectName: state.communication.projectName
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(dashboardComponantActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftReportMenu);
