import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Api from "../../api";
import Logo from "../../Styles/images/logo.svg";
import Router from "../../URLRoutes";
import Resources from "../../resources.json";
import General from '../ProjectSetup/ProjectSetupRoutes';
import Config from "../../Services/Config";

import { connect } from 'react-redux';
import {
  bindActionCreators
} from 'redux';

import * as dashboardComponantActions from '../../store/actions/communication';


let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let currentProjectId = localStorage.getItem("lastSelectedProject") == null ? 0 : localStorage.getItem("lastSelectedProject");
let currentProjectName = localStorage.getItem("lastSelectedprojectName") == null ? null : localStorage.getItem("lastSelectedprojectName");

var viewModules = true;
var viewEps = false;
var viewProjects = false;
var accordion = true;
var viewSubMenu = false;
var ActivePanal = 0;

class LeftMenu extends Component {
  constructor(props) {
    super(props);

    let generalMenu = [];
    let communication = [];
    let procurementMenu = [];
    let siteMenu = [];
    let contractMenu = [];
    let designMenu = [];
    let timeMenu = [];
    let estimationMenu = [];
    let qualityControlMenu = [];
    let costControlMenu = [];
    let reportsMenu = [];

    General.map(route => {
      if (route.settings) {
        if (route.settings.General === true) {
          if (Config.IsAllow(route.settings.permission)) {
            generalMenu.push(route);
          }
        }
      }
    }
    );

    //initialize of link
    Router.map(route => {
      if (route.settings) {
        if (route.settings.Communication === true) {
          communication.push(route);
        }
        else if (route.settings.Procurement === true) {
          procurementMenu.push(route);
        }
        else if (route.settings.Site === true) {
          siteMenu.push(route);
        }
        else if (route.settings.Contracts === true) {
          contractMenu.push(route);
        }
        else if (route.settings.Design === true) {
          designMenu.push(route);
        }
        else if (route.settings.Time === true) {
          timeMenu.push(route);
        }
        else if (route.settings.Estimation === true) {
          estimationMenu.push(route);
        }
        else if (route.settings.QualityControl === true) {
          qualityControlMenu.push(route);
        }
        else if (route.settings.CostControl === true) {
          costControlMenu.push(route);
        }
        else if (route.settings.Reports === true) {
          reportsMenu.push(route);
        }
      }
    });

    this.state = {
      moduleName: "General",
      hover: false,
      projectId: currentProjectId,
      ListEps: [],
      viewEps: false,
      viewModules: true,
      accordion: true,
      viewProjects: false,
      viewSubMenu: false,
      rowIndex: 0,
      ActivePanal: 0,
      titleProject: "",
      currentIndex: 0,
      GeneralMenu: [],
      AppComponants: [],
      generalMenu: generalMenu,
      timeMenu: timeMenu,
      procurementMenu: procurementMenu,
      contractMenu: contractMenu,
      siteMenu: siteMenu,
      designMenu: designMenu,
      estimationMenu: estimationMenu,
      qualityControlMenu: qualityControlMenu,
      costControlMenu: costControlMenu,
      reportsMenu: reportsMenu,
      communication: communication
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

        viewEps = true;
        viewModules = false;
        viewProjects = false;

      } else {
        this.setState(state => {
          return {
            viewEps: false,
            viewModules: true,
            viewProjects: false
          };
        });

        viewEps = false;
        viewModules = true;
        viewProjects = false;
      }

    }
  };

  ProjectHandler = () => {
    if (this.state.viewProjects === false) {

      this.setState(state => {
        return {
          viewEps: false,
          viewModules: false,
          viewProjects: true
        };
      });

      viewEps = false;
      viewModules = false;
      viewProjects = true;

    } else {

      if (this.state.ActivePanal != 0) {

        if (this.state.ActivePanal === 1) {

          this.setState(state => {
            return {
              viewEps: true,
              viewModules: false,
              viewProjects: false
            };
          });

          viewEps = true;
          viewModules = false;
          viewProjects = false;

        } else {
          this.setState(state => {
            return {
              viewEps: false,
              viewModules: true,
              viewProjects: false
            };
          });

          viewEps = false;
          viewModules = true;
          viewProjects = false;
        }
      } else {
        this.setState(state => {
          return {
            viewProjects: false,
            viewEps: true
          };
        });
        viewProjects = false;
        viewEps = true;
      }
    }

    this.setState(state => {
      return {
        projectId: state.projectId
      };
    });

  };

  EpsHandler = (id, index) => {
    if (this.state.accordion === true) {
      accordion = false;
      this.setState(state => {
        return {
          accordion: false,
          currentIndex: index
        };
      });
    } else {
      this.setState(state => {
        return {
          accordion: true,
          currentIndex: index
        };
      });
      accordion = true;
    }

    this.setState({ accordion: !this.state.accordion });
  };

  ModuleHandler = () => {
    if (this.state.projectId > 0) {

      if (this.state.ActivePanal === 1) {
        accordion = false;
        this.setState(state => {
          return {
            viewEps: false,
            viewModules: true,
            ActivePanal: 2
          };
        });

        viewEps = false;
        viewModules = true;
        ActivePanal = 2;
      } else {
        this.setState(state => {
          return {
            viewEps: true,
            viewModules: false,
            ActivePanal: 1
          };
        });
        viewEps = true;
        viewModules = false;
        ActivePanal = 1;
      }
    } else {
      accordion = false;
      this.setState(state => {
        return {
          viewEps: false,
          viewModules: true,
          ActivePanal: 2
        };
      });

      viewEps = true;
      viewModules = false;
      ActivePanal = 2;
    }

    this.setState(state => {
      return {
        projectId: state.projectId
      };
    });
  };

  OpenSubMenu = (id, moduleName) => {
    if (this.state.rowIndex != id) {
      this.setState({ rowIndex: id, moduleName: moduleName });
    } else {
      this.setState({ rowIndex: 0, moduleName: moduleName });
    }

    var e = { label: this.state.titleProject, value: this.state.projectId };
    localStorage.setItem('moduleName', moduleName)
    this.props.actions.LeftMenuClick(e, moduleName);

  };

  componentWillMount = () => {
    Api.get("GetProjectsForMenue?id=2").then(result => {
      this.setState(state => {
        return { ListEps: result };
      });
    });
  };

  selectProjectHandler = (projectId, titleProject) => {

    this.setState(state => {
      return {
        viewEps: false,
        viewModules: true,
        viewProjects: false,
        ActivePanal: state.viewModules === true ? 2 : 1
      };
    });

    viewEps = false;
    viewModules = true;
    viewProjects = false;
    ActivePanal = viewModules === true ? 2 : 1;

    this.setState(state => {
      return {
        projectId: projectId,
        titleProject: titleProject
      };
    });

    var e = { label: titleProject, value: projectId };
    let moduleName = this.state.moduleName;

    this.props.actions.LeftMenuClick(e, moduleName);
    localStorage.setItem("lastSelectedProject", projectId);
    localStorage.setItem("lastSelectedprojectName", titleProject);

  };

  EpsComponent() {
    const Eps = this.state.ListEps.map((eps, index) => {
      return (
        <div key={eps.id}>
          <ul className="MainProjectsMenuUL zero">
            <li className="EastWestProject PM-color">
              <span onClick={() => this.EpsHandler(eps.id, index)} className="EastMainLi">
                {eps.name}
              </span>
              <ul className={this.state.currentIndex === index ? "zero" : "zero closeAccordion"}>
                {eps.projects.map(project => {
                  return (
                    <li className="active" key={project.id} onClick={event => this.selectProjectHandler(project.id, project.name)}>
                      <a>{project.name}</a>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </div>
      );
    });

    return Eps;
  }

  ComponentName() {
    let ComponentModule = this.props.appComponants.map((app, index) => {
      if (app.compaonantName === "PM" && app.canView) {
        return (
          <li className="projectMange-li activeMainPlist" key={index}>
            <a href="/PM">
              <span className="mainProjectblock">PM</span>
              <p className="zero">{Resources["pm"][currentLanguage]}</p>
            </a>
          </li>
        );
      } else if (app.compaonantName === "FM" && app.canView) {
        return (
          <li className="facilityMange-li" key={index}>
            <a href="/FM">
              <span className="mainProjectblock">FM</span>
              <p className="zero">{Resources["fm"][currentLanguage]}</p>
            </a>
          </li>
        );
      } else if (app.compaonantName === "HR" && app.canView) {
        return (
          <li className="humanResources-li" key={index}>
            <a href="">
              <span className="mainProjectblock">HR</span>
              <p className="zero">
                {Resources["humanResource"][currentLanguage]}
              </p>
            </a>
          </li>
        );
      } else if (app.compaonantName === "AC" && app.canView) {
        return (
          <li className="accounting-li" key={index}>
            <a href="">
              <span className="mainProjectblock">AC</span>
              <p className="zero">{Resources["accounting"][currentLanguage]}</p>
            </a>
          </li>
        );
      } else {
        return (
          <li className="realEstate-li" key={index}>
            <a href="">
              <span className="mainProjectblock">RE</span>
              <p className="zero">{Resources["realState"][currentLanguage]}</p>
            </a>
          </li>
        );
      }
    });

    return ComponentModule;
  }

  activeLi = (index, length) => {

    for (var i = 0; i < length; i++) {
      if (i == index)
        this.setState({ [i]: true });
      if (i != index)
        this.setState({ [i]: false });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.projectId != this.state.projectId) {
      this.setState({ projectId: nextProps.projectId, titleProject: nextProps.projectName, moduleName: nextProps.moduleName });
      viewModules = true;
      viewEps = false;
    }
  };

  render() {
    return (
      <div>
        {this.props.showLeftMenu === true ?
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
                    <div className={(viewEps) ? "MainProjectsMenu active " : "MainProjectsMenu hidden"} >
                      <div className="backToModules" onClick={this.ModuleHandler}>
                        {this.state.projectId ? (
                          <a >
                            <i className="fa fa-angle-left" aria-hidden="true" />
                            <span>
                              {Resources["backtoModules"][currentLanguage]}
                            </span>
                          </a>
                        ) : null}
                      </div>
                      <div>{this.EpsComponent()}</div>
                    </div>

                    <div className={(viewModules) ? "modulesMenuIcons active " : "modulesMenuIcons  hidden "}>
                      <div className="backtoProjects" onClick={this.ModuleHandler}>
                        <div className="backtoProjectsOne" >
                          <span>
                            <svg viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                              <title />
                              <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="Action-icons/Navigation/Projects/Line/36px/Grey_base">
                                  <g id="projects">
                                    <rect id="bg" fill="#80CBC4" opacity="0" x="0" y="0" width="36" height="36" />
                                    <path
                                      d="M24.9230769,11.956044 C26.6650862,11.956044 28,13.2909577 28,15.032967 L28,18.989011 C28,19.7047695 27.603346,20.4081559 27.010989,20.7366039 L27.010989,24.9230769 C27.010989,26.6650862 25.6760752,28 23.9340659,28 L12.0659341,28 C10.3239248,28 8.98901099,26.6650862 8.98901099,24.9230769 L8.98901099,20.7366039 C8.39665397,20.4081559 8,19.7047695 8,18.989011 L8,15.032967 C8,13.2909577 9.33491376,11.956044 11.0769231,11.956044 L13.9340659,11.956044 L13.9340659,10.0879121 C13.9340659,8.93930937 14.8733753,8 16.021978,8 L19.978022,8 C21.1266247,8 22.0659341,8.93930937 22.0659341,10.0879121 L22.0659341,11.956044 L24.9230769,11.956044 Z M16.1318681,11.956044 L19.8681319,11.956044 L19.8681319,10.1978022 L16.1318681,10.1978022 L16.1318681,11.956044 Z M25.8021978,15.032967 C25.8021978,14.5002511 25.4557929,14.1538462 24.9230769,14.1538462 L11.0769231,14.1538462 C10.5442071,14.1538462 10.1978022,14.5002511 10.1978022,15.032967 L10.1978022,18.8791209 L25.8021978,18.8791209 L25.8021978,15.032967 Z M11.1868132,24.9230769 C11.1868132,25.4557929 11.5332181,25.8021978 12.0659341,25.8021978 L23.9340659,25.8021978 C24.4667819,25.8021978 24.8131868,25.4557929 24.8131868,24.9230769 L24.8131868,21.0769231 L23.0549451,21.0769231 L23.0549451,22.9450549 L22.9450549,23.0549451 L20.967033,23.0549451 L20.8571429,22.9450549 L20.8571429,21.0769231 L15.1428571,21.0769231 L15.1428571,22.9450549 L15.032967,23.0549451 L13.0549451,23.0549451 L12.9450549,22.9450549 L12.9450549,21.0769231 L11.1868132,21.0769231 L11.1868132,24.9230769 Z"
                                      id="Shape"
                                      fill="#A8B0BF"
                                      fillRule="nonzero"
                                    />
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </span>
                          <span className="backToModulesBK">
                            <i className="fa fa-angle-left" aria-hidden="true" />
                            {Resources["backtoprojects"][currentLanguage]}
                          </span>
                        </div>
                        <div className="backToModulesName">
                          <h2 className="zero">{this.state.titleProject}</h2>
                        </div>
                      </div>
                      <ul className="ui accordion MenuUl PM-color zero">
                        <li>
                          <a>
                            <span className="ULimg">
                              <svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" >
                                  <g id="Action-icons/Navigation/Workspace/Line/36px/Grey_base">
                                    <g id="work-space">
                                      <rect id="bg" fill="#80CBC4" opacity="0" x="0" y="0" width="36" height="36" />
                                      <path
                                        d="M10,8 L11.5555556,8 C12.6601251,8 13.5555556,8.8954305 13.5555556,10 L13.5555556,11.5555556 C13.5555556,12.6601251 12.6601251,13.5555556 11.5555556,13.5555556 L10,13.5555556 C8.8954305,13.5555556 8,12.6601251 8,11.5555556 L8,10 C8,8.8954305 8.8954305,8 10,8 Z M17.2222222,8 L18.7777778,8 C19.8823473,8 20.7777778,8.8954305 20.7777778,10 L20.7777778,11.5555556 C20.7777778,12.6601251 19.8823473,13.5555556 18.7777778,13.5555556 L17.2222222,13.5555556 C16.1176527,13.5555556 15.2222222,12.6601251 15.2222222,11.5555556 L15.2222222,10 C15.2222222,8.8954305 16.1176527,8 17.2222222,8 Z M24.4444444,8 L26,8 C27.1045695,8 28,8.8954305 28,10 L28,11.5555556 C28,12.6601251 27.1045695,13.5555556 26,13.5555556 L24.4444444,13.5555556 C23.3398749,13.5555556 22.4444444,12.6601251 22.4444444,11.5555556 L22.4444444,10 C22.4444444,8.8954305 23.3398749,8 24.4444444,8 Z M10,15.2222222 L11.5555556,15.2222222 C12.6601251,15.2222222 13.5555556,16.1176527 13.5555556,17.2222222 L13.5555556,18.7777778 C13.5555556,19.8823473 12.6601251,20.7777778 11.5555556,20.7777778 L10,20.7777778 C8.8954305,20.7777778 8,19.8823473 8,18.7777778 L8,17.2222222 C8,16.1176527 8.8954305,15.2222222 10,15.2222222 Z M17.2222222,15.2222222 L18.7777778,15.2222222 C19.8823473,15.2222222 20.7777778,16.1176527 20.7777778,17.2222222 L20.7777778,18.7777778 C20.7777778,19.8823473 19.8823473,20.7777778 18.7777778,20.7777778 L17.2222222,20.7777778 C16.1176527,20.7777778 15.2222222,19.8823473 15.2222222,18.7777778 L15.2222222,17.2222222 C15.2222222,16.1176527 16.1176527,15.2222222 17.2222222,15.2222222 Z M24.4444444,15.2222222 L26,15.2222222 C27.1045695,15.2222222 28,16.1176527 28,17.2222222 L28,18.7777778 C28,19.8823473 27.1045695,20.7777778 26,20.7777778 L24.4444444,20.7777778 C23.3398749,20.7777778 22.4444444,19.8823473 22.4444444,18.7777778 L22.4444444,17.2222222 C22.4444444,16.1176527 23.3398749,15.2222222 24.4444444,15.2222222 Z M10,22.4444444 L11.5555556,22.4444444 C12.6601251,22.4444444 13.5555556,23.3398749 13.5555556,24.4444444 L13.5555556,26 C13.5555556,27.1045695 12.6601251,28 11.5555556,28 L10,28 C8.8954305,28 8,27.1045695 8,26 L8,24.4444444 C8,23.3398749 8.8954305,22.4444444 10,22.4444444 Z M17.2222222,22.4444444 L18.7777778,22.4444444 C19.8823473,22.4444444 20.7777778,23.3398749 20.7777778,24.4444444 L20.7777778,26 C20.7777778,27.1045695 19.8823473,28 18.7777778,28 L17.2222222,28 C16.1176527,28 15.2222222,27.1045695 15.2222222,26 L15.2222222,24.4444444 C15.2222222,23.3398749 16.1176527,22.4444444 17.2222222,22.4444444 Z M24.4444444,22.4444444 L26,22.4444444 C27.1045695,22.4444444 28,23.3398749 28,24.4444444 L28,26 C28,27.1045695 27.1045695,28 26,28 L24.4444444,28 C23.3398749,28 22.4444444,27.1045695 22.4444444,26 L22.4444444,24.4444444 C22.4444444,23.3398749 23.3398749,22.4444444 24.4444444,22.4444444 Z"
                                        id="Combined-Shape"
                                        fill="#A8B0BF"
                                      />
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            </span>
                            <span className="UlName">{Resources["workplace"][currentLanguage]}</span>
                          </a>
                        </li>
                        <li className={this.state.rowIndex === 1 ? "ActiveSubLi" : ""}>
                          <a className={this.state.rowIndex === 1 ? "title active" : "title"} onClick={() => this.OpenSubMenu(1, Resources["generalCoordination"][currentLanguage])} >
                            <span className="ULimg">
                              <svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                  <g id="Action-icons/Navigation/Project-setup/Line/36px/Grey_base">
                                    <g id="prjct-stp">
                                      <rect id="bg" fill="#80CBC4" opacity="0" x="0" y="0" width="36" height="36" />
                                      <path
                                        d="M17.3149046,8.20742828 L8.46880331,14.5040125 C8.17733966,14.7109071 7.99703688,15.058149 8.00003686,15.4068316 L8.00003686,26.8888381 C8.00003686,27.4704573 8.54991821,28 9.15387616,28 L15.3076858,28 C15.9116437,28 16.4615251,27.4704573 16.4615251,26.8888381 L16.4615251,22.0738031 C16.4615251,21.2332091 17.127098,20.5922539 17.9999775,20.5922539 C18.8728569,20.5922539 19.5384299,21.2332091 19.5384299,22.0738031 L19.5384299,26.8888381 C19.5384299,27.4704573 20.0883112,28 20.6922692,28 L26.8460788,28 C27.4500367,28 27.9999181,27.4704573 27.9999181,26.8888381 L27.9999181,15.4068316 C28.0044254,15.0581452 27.8226345,14.7109109 27.5311516,14.5040125 L18.6850503,8.20742828 C18.1892456,7.91517048 17.7760942,7.94700156 17.3148662,8.20742828 L17.3149046,8.20742828 Z M17.9999775,10.4876066 L25.6922395,15.9623014 L25.6922395,25.777565 L21.8461085,25.777565 L21.8461085,22.073692 C21.8461085,20.0408953 20.1108495,18.3698189 17.9999775,18.3698189 C15.8891054,18.3698189 14.1538465,20.0408953 14.1538465,22.073692 L14.1538465,25.777565 L10.3077155,25.777565 L10.3077155,15.9623014 L17.9999775,10.4876066 Z"
                                        id="Shape"
                                        fill="#A8B0BF"
                                        fillRule="nonzero"
                                      />
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            </span>
                            <span className="UlName">{Resources["generalCoordination"][currentLanguage]}</span>
                          </a>
                          <ul className={this.state.rowIndex === 1 ? "content subBigMenuUl active" : "content subBigMenuUl"}>
                            {this.state.generalMenu.map((r, index) => {
                              return (
                                <li key={index} className={(this.state[index] === true && this.state.rowIndex === 1) ? "active" : " "} onClick={() => this.activeLi(index, this.state.generalMenu.length)} >
                                  <NavLink to={"/" + r.route + "/" + this.state.projectId} activeClassName="active">
                                    {Resources[r.title][currentLanguage]}
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        </li>

                        <li className={this.state.rowIndex === 2 ? "ActiveSubLi" : ""}>
                          <a className={this.state.rowIndex === 2 ? "title active" : "title"} onClick={() => this.OpenSubMenu(2, Resources["communication"][currentLanguage])}>
                            <span className="ULimg">
                              <svg
                                width="36px"
                                height="36px"
                                viewBox="0 0 36 36"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                              >
                                <g
                                  id="Symbols"
                                  stroke="none"
                                  strokeWidth="1"
                                  fill="none"
                                  fillRule="evenodd"
                                >
                                  <g id="Action-icons/Navigation/Communication/Line/36px/Grey_base">
                                    <g id="comnctn">
                                      <rect
                                        id="bg"
                                        fill="#80CBC4"
                                        opacity="0"
                                        x="0"
                                        y="0"
                                        width="36"
                                        height="36"
                                      />
                                      <path
                                        d="M29,13.9870844 C29,17.788841 29,20.2375244 29,21.3331345 C29,22.9765498 28.0396374,23.9853881 25.8425647,23.9853881 C24.3778495,23.9853881 20.2839999,23.9853881 13.5610158,23.9853881 L8.89955569,26.8064699 C8.52492723,27.042532 8.04495174,27.0643051 7.64875134,26.8626215 C7.25375517,26.6609379 7.00359093,26.2678677 7,25.838157 L7,11.9335791 C7,10.313246 8.37171748,9 10.0641949,9 L25.9358051,9 C26.7485215,9 27.5289413,9.30940458 28.1034779,9.85945065 C28.6780144,10.4094967 29,11.1555059 29,11.9335791 L29,13.9870844 Z M9.41427723,11.9335791 L9.41566386,23.6679833 L12.246526,21.9078358 C12.4460576,21.7772006 12.6816674,21.706152 12.923284,21.7027141 L25.9703854,21.7027141 C26.1338789,21.7027141 26.2901468,21.6408332 26.4055453,21.530824 C26.5209437,21.4208148 26.5858561,21.2706859 26.5858561,21.1159866 L26.5858561,11.9335908 C26.5858561,11.7777327 26.5209437,11.6287626 26.4055453,11.5187534 C26.2901468,11.4087442 26.1338666,11.3468632 25.9703854,11.3468632 L10.0309376,11.3468632 C9.6907522,11.3468632 9.41547922,11.6092719 9.41427723,11.9335791 Z M19.9069681,16.1425023 C19.9069681,17.1795811 19.0424359,18.0195235 17.9750633,18.0195235 C16.9076906,18.0195235 16.0431584,17.1795518 16.0431584,16.1425023 C16.0431584,15.1054527 16.9076906,14.265481 17.9750633,14.265481 C19.0424359,14.265481 19.9069681,15.1054527 19.9069681,16.1425023 Z M15.2113808,16.1425023 C15.2113808,17.1795811 14.3468485,18.0195235 13.2794759,18.0195235 C12.2121033,18.0195235 11.347571,17.1795518 11.347571,16.1425023 C11.347571,15.1054527 12.2121033,14.265481 13.2794759,14.265481 C14.3468485,14.265481 15.2113808,15.1054527 15.2113808,16.1425023 Z M24.5964409,16.1425023 C24.5964409,17.1795811 23.7319087,18.0195235 22.6645361,18.0195235 C21.5971634,18.0195235 20.7326312,17.1795518 20.7326312,16.1425023 C20.7326312,15.1054527 21.5971634,14.265481 22.6645361,14.265481 C23.7319087,14.265481 24.5964409,15.1054527 24.5964409,16.1425023 Z"
                                        id="Combined-Shape"
                                        fill="#A8B0BF"
                                        fillRule="nonzero"
                                      />
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            </span>
                            <span className="UlName">
                              {Resources["communication"][currentLanguage]}
                            </span>
                          </a>
                          <ul className={this.state.rowIndex === 2 ? "content subBigMenuUl active" : "content subBigMenuUl"}>

                            {this.state.communication.map((r, index) => {
                              return (
                                <li key={index} className={(this.state[index] === true && this.state.rowIndex === 2) ? "active" : " "} onClick={() => this.activeLi(index, this.state.communication.length)}>
                                  <NavLink to={"/" + r.route + "/" + this.state.projectId} >
                                    {Resources[r.title][currentLanguage]}
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                        {/* <li className={this.state.rowIndex === 3 ? "ActiveSubLi" : ""}>
                          <a className={this.state.rowIndex === 3 ? "title active" : "title"} onClick={() => this.OpenSubMenu(3, Resources["procurement"][currentLanguage])}>
                            <span className="ULimg">
                              <svg
                                width="36px"
                                height="36px"
                                viewBox="0 0 36 36"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                              >
                                <g
                                  id="Symbols"
                                  stroke="none"
                                  strokeWidth="1"
                                  fill="none"
                                  fillRule="evenodd"
                                >
                                  <g id="Action-icons/Navigation/Procurement/Line/36px/Grey_base">
                                    <g id="purchase-orders">
                                      <rect
                                        id="bg"
                                        fill="#80CBC4"
                                        opacity="0"
                                        x="0"
                                        y="0"
                                        width="36"
                                        height="36"
                                      />
                                      <path
                                        d="M20.8700419,14.960578 C21.7857271,14.9597904 22.6643482,14.618204 23.3110523,14.0115674 C23.9578027,13.4049681 24.3202275,12.5830496 24.3185411,11.7261668 C24.3176994,10.8695059 23.9526423,10.0484711 23.3034815,9.44347368 C22.6548831,8.83892299 21.7762045,8.49996951 20.8614689,8.50154554 C19.9442438,8.50391001 19.0673915,8.84569508 18.4210096,9.45281659 C17.7748214,10.0605272 17.4134316,10.8825569 17.4159618,11.7409294 L17.4159618,25.7362925 L20.8854433,22.490219 C21.4068035,22.0010021 22.254767,22.0010021 22.7756176,22.4897415 C23.297909,22.9784014 23.297909,23.7704942 22.7758198,24.2575375 L17.0394266,29.6307341 C16.9784711,29.6891917 16.9109051,29.7409766 16.7986943,29.8101643 L16.7367183,29.8423769 C16.6881629,29.8676443 16.6530714,29.8847616 16.5647479,29.9181801 L16.4595711,29.9493584 L16.3563505,29.9748211 C16.1791971,30.0094107 15.9962001,30.0094107 15.7884951,29.9682916 L15.692954,29.9434255 L15.5336187,29.8887825 L15.436845,29.84172 L15.3420742,29.790732 C15.2686954,29.7449629 15.2011282,29.6931755 15.1388461,29.6349038 L9.39159096,24.2614197 C8.86938466,23.7728393 8.86938466,22.9811146 9.39210126,22.4920575 C9.91427542,22.0049335 10.7600965,22.0049335 11.2816445,22.4928984 L14.7485335,25.7437886 L14.7485382,11.7039319 C14.7558595,10.1849088 15.4082235,8.73048192 16.5618694,7.65996411 C17.7157021,6.59127222 19.2759942,5.99415871 20.8996412,6.00004308 C22.5240218,6.00689642 24.0782419,6.61598338 25.2225968,7.69450715 C26.3660346,8.7731779 27.0052084,10.2321506 26.999968,11.7520423 C26.9936911,13.2716687 26.3430547,14.7266835 25.1911304,15.7975542 C24.03911,16.8685142 22.4795576,17.4674805 20.8556407,17.4625791 C20.4507887,17.4616044 20.0445471,17.4238166 19.6401828,17.349523 C18.9169301,17.2110138 18.4499556,16.5512519 18.5966791,15.8734444 C18.7446576,15.1970531 19.4492868,14.7602324 20.172415,14.8967674 C20.3989685,14.9387881 20.632654,14.9599598 20.8700419,14.960578 Z"
                                        id="Shape"
                                        fill="#A8B0BF"
                                        fillRule="nonzero"
                                      />
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            </span>
                            <span className="UlName"> {Resources["procurement"][currentLanguage]} </span>
                          </a>
                          <ul className={this.state.rowIndex === 3 ? "content subBigMenuUl active" : "content subBigMenuUl"}>
                            {this.state.procurementMenu.map((r, index) => {
                              return (
                                <li key={index} className={(this.state[index] === true && this.state.rowIndex === 3) ? "active" : " "} onClick={() => this.activeLi(index, this.state.procurementMenu.length)}>
                                  <NavLink to={"/" + r.route + "/" + this.state.projectId} activeClassName="active">
                                    {Resources[r.title][currentLanguage]}
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        </li> */}
                        <li className={this.state.rowIndex === 4 ? "ActiveSubLi" : ""}>
                          <a className={this.state.rowIndex === 4 ? "title active" : "title"} onClick={() => this.OpenSubMenu(4, Resources["technicalOffice"][currentLanguage])}>
                            <span className="ULimg">
                              <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"                              >
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                  <g id="Components/Nav/Side-left/Closed/Base" transform="translate(-32.000000, -451.000000)">
                                    <g id="Group-3">
                                      <g id="Group-2" transform="translate(0.000000, 160.000000)">
                                        <g id="Group-14" transform="translate(0.000000, 272.000000)">
                                          <g id="Action-icons/Navigation/Technical-office/Line/36px/Grey_base" transform="translate(26.000000, 13.000000)"                                          >
                                            <g id="tcncl-ofc">
                                              <rect id="bg" fill="#80CBC4" opacity="0" x="0" y="0" width="36" height="36" />
                                              <path d="M20.8386058,14.4397103 L20.8386058,16.8715936 L20.8285105,16.8715936 L20.8285105,27.5681292 L25.7294128,27.5681292 L25.7294128,17.218559 C25.7294128,17.0271398 25.5702444,16.8715936 25.3743677,16.8715936 L22.1820198,16.8715936 L22.1820198,14.4397103 L25.3743677,14.4397103 C26.1281491,14.4397103 26.8516805,14.7327173 27.3848896,15.2537842 C27.9181045,15.7748568 28.2179273,16.4819019 28.2179273,17.218559 L28.2179273,27.5681268 L28.7557427,27.5681167 C29.4432151,27.5681167 30,28.1122308 30,28.7840583 C30,29.4558877 29.4432228,30 28.7557427,30 L7.24425727,30 C6.55678492,30 6,29.4558859 6,28.7840583 C6,28.112229 6.55677724,27.5681167 7.24425727,27.5681167 L7.78458734,27.5681167 L7.78458734,10.6543371 C7.78458734,9.98275009 8.34236314,9.43839542 9.0288446,9.43839542 L9.86368046,9.43839542 L9.86368046,8.46626726 C9.86368046,7.10456322 10.9939656,6 12.3873796,6 L16.2257054,6 C17.6199969,6 18.7494046,7.10420142 18.7494046,8.46626726 L18.7494046,9.43839542 L19.5842404,9.43839542 C19.91444,9.43839542 20.2306554,9.56652382 20.4640269,9.79458448 C20.6973962,10.022643 20.8285105,10.3316739 20.8285105,10.6543496 L20.8285105,14.4397103 L20.8386058,14.4397103 Z M10.2731147,11.8702912 L10.2731147,27.5681292 L18.339996,27.5681292 L18.339996,11.8702912 L10.2731147,11.8702912 Z M16.2609156,9.43842042 L16.2609156,8.46629226 C16.2609156,8.45712656 16.2572966,8.44859676 16.2505612,8.44201463 C16.2438302,8.43543688 16.2350909,8.43189581 16.2257182,8.43189581 L12.3873924,8.43189581 C12.3683038,8.43189581 12.3522078,8.44760411 12.3522078,8.46627976 L12.3522078,9.43842042 L16.2609156,9.43842042 Z M11.3003658,14.4678302 L17.2113876,14.4678302 L17.2113876,16.5683772 L11.3003658,16.5683772 L11.3003658,14.4678302 Z M11.3003658,17.7499349 L17.2113876,17.7499349 L17.2113876,19.8504819 L11.3003658,19.8504819 L11.3003658,17.7499349 Z M11.3003658,21.0320396 L17.2113876,21.0320396 L17.2113876,23.1325866 L11.3003658,23.1325866 L11.3003658,21.0320396 Z"
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
                            <span className="UlName"> {Resources["technicalOffice"][currentLanguage]} </span>
                          </a>
                          <ul className={this.state.rowIndex === 4 ? "content subBigMenuUl active" : "content subBigMenuUl"}>
                            {this.state.siteMenu.map((r, index) => {
                              return (
                                <li key={index} className={(this.state[index] === true && this.state.rowIndex === 4) ? "active" : " "} onClick={() => this.activeLi(index, this.state.siteMenu.length)}>
                                  <NavLink to={"/" + r.route + "/" + this.state.projectId} activeClassName="active">
                                    {Resources[r.title][currentLanguage]}
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                        <li className={this.state.rowIndex === 5 ? "ActiveSubLi" : ""}>
                          <a className={this.state.rowIndex === 5 ? "title active" : "title"} onClick={() => this.OpenSubMenu(5, Resources["contractCoordination"][currentLanguage])}>
                            <span className="ULimg">
                              <svg
                                width="36px"
                                height="36px"
                                viewBox="0 0 36 36"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                              >
                                <g
                                  id="Symbols"
                                  stroke="none"
                                  strokeWidth="1"
                                  fill="none"
                                  fillRule="evenodd"
                                >
                                  <g id="Action-icons/Navigation/Contracts-mgmt/Line/36px/Grey_base">
                                    <g id="contracts">
                                      <rect
                                        id="bg"
                                        fill="#80CBC4"
                                        opacity="0"
                                        x="0"
                                        y="0"
                                        width="36"
                                        height="36"
                                      />
                                      <path
                                        d="M27.6816459,13.3129747 C27.9242014,13.5034509 28.0281538,13.7574192 27.993503,14.0431334 L28,26.5555556 C28,27.6987216 27.0855943,29 25.5,29 L10.5,29 C8.97842842,29 8,27.8001305 8,26.5555556 L8,9.44444444 C8,7.85446802 9.42219543,7 10.5,7 L20.7215318,7 C21.0333888,7 21.3105951,7.0952381 21.5184998,7.28571429 L27.6816459,13.3129747 Z M18.0426282,11.4499549 C18.0426282,10.3531914 17.1005599,9.44444444 15.9635811,9.44444444 L10.5,9.44444444 L10.5,26.5555556 L25.5,26.5555556 C25.5,21.9858264 25.5,19.4133916 25.5,18.8382511 C25.5,17.9755405 24.8222825,16.7777778 23.4101896,16.7777778 C22.4037325,16.7777778 20.9610532,16.7777778 19.0821517,16.7777778 C18.4974197,16.7777778 18.0426282,16.3390724 18.0426282,15.7750226 L18.0426282,11.4499549 Z M13,21.6666667 L20.5,21.6666667 L20.5,24.1111111 L13,24.1111111 L13,21.6666667 Z"
                                        id="Combined-Shape"
                                        fill="#A8B0BF"
                                        fillRule="nonzero"
                                      />
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            </span>
                            <span className="UlName">{Resources["contractCoordination"][currentLanguage]}</span>
                          </a>
                          <ul className={this.state.rowIndex === 5 ? "content subBigMenuUl active" : "content subBigMenuUl"}>
                            {this.state.contractMenu.map((r, index) => {
                              return (
                                <li key={index} className={(this.state[index] === true && this.state.rowIndex === 5) ? "active" : " "} onClick={() => this.activeLi(index, this.state.contractMenu.length)}>
                                  <NavLink to={"/" + r.route + "/" + this.state.projectId} activeClassName="active" >
                                    {Resources[r.title][currentLanguage]}
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                        <li className={this.state.rowIndex === 6 ? "ActiveSubLi" : ""}>
                          <a className={this.state.rowIndex === 6 ? "title active" : "title"} onClick={() => this.OpenSubMenu(6, Resources["timeCordination"][currentLanguage])}>
                            <span className="ULimg">
                              <svg
                                width="36px"
                                height="36px"
                                viewBox="0 0 36 36"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                              >
                                <g
                                  id="Symbols"
                                  stroke="none"
                                  strokeWidth="1"
                                  fill="none"
                                  fillRule="evenodd"
                                >
                                  <g id="Action-icons/Navigation/Time-mgmt/Line/36px/Grey_base">
                                    <g id="time-mgmt">
                                      <rect
                                        id="bg"
                                        fill="#80CBC4"
                                        opacity="0"
                                        x="0"
                                        y="0"
                                        width="36"
                                        height="36"
                                      />
                                      <path
                                        d="M18,7 C20.9168755,7.00311455 23.7133559,8.16312118 25.7745748,10.225352 C27.8369321,12.2865417 28.9969583,15.0830932 29,18 C29,20.9178191 27.8411285,23.7152304 25.7776996,25.7776475 C23.7149853,27.8411921 20.9177656,29 18,29 C15.0821809,29 12.2847696,27.8411285 10.2223525,25.7776996 C8.15880793,23.7149853 7,20.9177656 7,18 C7,15.0821809 8.15887146,12.2847696 10.2223004,10.2223525 C12.2849488,8.15887387 15.0823963,7 18,7 Z M24.0724945,24.0729387 C25.6835013,22.4627562 26.589665,20.2786812 26.5925938,18.000175 C26.5935932,15.7210842 25.688805,13.5349511 24.0775248,11.9236709 C22.4661689,10.3113155 20.280953,9.40562004 18.0019612,9.40562002 C15.7228704,9.40462053 13.5367373,10.3094088 11.9254571,11.920689 C10.3132757,13.531871 9.40740626,15.7180355 9.40740626,17.9971931 C9.40740626,20.2763995 10.3122582,22.4615189 11.9234548,24.0727156 C13.5355319,25.6847677 15.7206399,26.5897868 18,26.5897868 C20.2805193,26.5891601 22.4633479,25.6830589 24.0724945,24.0729387 Z M23.6897402,17.2658444 L23.9960177,17.5280167 L23.9960177,19.4157063 L23.6897402,19.6729955 L16.7630748,19.6729955 L16.4644417,19.4157063 L16.4644417,11.5740699 L16.7630748,11.2901557 L18.5712542,11.2901557 L18.8715928,11.5740699 L18.8715928,17.2658444 L23.6897402,17.2658444 Z"
                                        id="Combined-Shape"
                                        fill="#A8B0BF"
                                        fillRule="nonzero"
                                      />
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            </span>
                            <span className="UlName">{Resources["timeCordination"][currentLanguage]}</span>
                          </a>
                          <ul className={this.state.rowIndex === 6 ? "content subBigMenuUl active" : "content subBigMenuUl"}>
                            {this.state.timeMenu.map((r, index) => {
                              return (
                                <li key={index} className={(this.state[index] === true && this.state.rowIndex === 6) ? "active" : " "} onClick={() => this.activeLi(index, this.state.timeMenu.length)}>
                                  <NavLink to={"/" + r.route + "/" + this.state.projectId} activeClassName="active" >
                                    {Resources[r.title][currentLanguage]}
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                        <li className={this.state.rowIndex === 7 ? "ActiveSubLi" : ""}>
                          <a className={this.state.rowIndex === 7 ? "title active" : "title"} onClick={() => this.OpenSubMenu(7, Resources["costControl"][currentLanguage])}>
                            <span className="ULimg">
                              <svg
                                width="36px"
                                height="36px"
                                viewBox="0 0 36 36"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                              >
                                <g
                                  id="Symbols"
                                  stroke="none"
                                  strokeWidth="1"
                                  fill="none"
                                  fillRule="evenodd"
                                >
                                  <g id="Action-icons/Navigation/Cost-control/Line/36px/Grey_base">
                                    <g id="cost-control">
                                      <rect
                                        id="bg"
                                        fill="#80CBC4"
                                        opacity="0"
                                        x="0"
                                        y="0"
                                        width="36"
                                        height="36"
                                      />
                                      <path
                                        d="M23.3645433,9.51905089 L25.6406903,8.17436777 C25.9008186,7.98853545 26.2423642,7.88468413 26.5888815,7.88468413 C27.510641,7.8920915 28.2018727,8.68820877 27.942949,9.38916292 L27.942949,29.3882929 C28.1134165,29.8551922 27.8929743,30.3916133 27.4005093,30.6753963 C26.8769445,30.9771005 26.1313877,30.9452639 25.6796687,30.627255 L23.3643071,29.2573772 L21.5751108,30.5541246 C21.0486433,30.9375828 20.1973707,30.9375828 19.672557,30.5553243 L17.9715066,29.3264683 L16.2721112,30.5541246 C15.7456436,30.9375828 14.894371,30.9375828 14.3689004,30.5548489 L12.578687,29.2573628 L10.2750548,30.6201296 C9.24164097,31.2668041 8.00343552,30.5230626 8.00006533,29.4536244 L8.00011104,9.09628739 C7.99060518,8.50010942 8.59267775,7.96641359 9.33299265,7.92280454 C9.66651429,7.9076561 10.002102,7.98999819 10.2633456,8.14900215 L12.5787072,9.51887995 L14.3679035,8.22213261 C14.894371,7.83867435 15.7456436,7.83867435 16.2704573,8.22093288 L17.9715077,9.4497889 L19.6709031,8.22213261 C20.1973707,7.83867435 21.0486433,7.83867435 21.5741139,8.22140828 L23.3645433,9.51905089 Z M15.1883009,10.8480978 L13.4013504,12.0473385 C12.8880296,12.3916974 12.0835472,12.4220833 11.5261074,12.1178846 L10.4985675,11.5551324 L10.4985675,27.2141848 L11.5251692,26.6519471 C11.7483559,26.5291917 12.014961,26.4553304 12.2936322,26.4389123 C12.6952182,26.4167169 13.1010865,26.5203584 13.401434,26.7220344 L15.1883016,27.9212194 L16.9734305,26.7232051 C17.5264581,26.3490056 18.420677,26.3490056 18.9719672,26.7220344 L20.7588342,27.921219 L22.5457848,26.7219783 C23.0591055,26.3776193 23.8635879,26.3472334 24.4210277,26.6514322 L25.4485676,27.2141843 L25.4485676,11.5551321 L24.420238,12.1183163 C23.8635879,12.4220833 23.0591055,12.3916974 22.5457012,12.0472824 L20.7588336,10.8480974 L18.9737046,12.0461116 C18.420677,12.4203112 17.5264581,12.4203112 16.9751679,12.0472824 L15.1883009,10.8480978 Z M18.1652461,14.2911332 C18.2272484,14.2843893 18.2904895,14.2800265 18.3644036,14.2767729 C18.4259452,14.2743111 18.4259452,14.2743111 18.4832854,14.2724681 C19.2710951,14.2541163 20.0294703,14.4749274 20.6550939,14.9284404 C21.433326,15.4935696 21.9473986,16.4071224 22.0497049,17.4621751 C22.114647,18.1513632 21.6083537,18.7636211 20.9186198,18.8287439 C20.2303624,18.8920857 19.6203227,18.3854642 19.5555035,17.6978303 C19.5176486,17.3057974 19.4056659,17.1025006 19.1943362,16.9494233 C19.0063215,16.8132342 18.7270697,16.7471072 18.4374557,16.779071 C17.7447201,16.8547409 17.3677193,17.24523 17.4116825,18.0470566 C17.4148086,18.0883155 17.4160013,18.1068295 17.4183154,18.1431934 L18.9980719,18.1431934 C19.6878478,18.1431934 19.5555035,18.7031277 19.5555035,19.3934646 C19.5555035,20.0838015 19.6878478,20.6437357 18.9980719,20.6437357 L17.6306527,20.6437357 C17.6355848,20.753626 17.6376673,20.8542548 17.637266,20.9594612 C17.6358927,21.3029336 17.6306527,21.6606175 17.6306527,22.0131087 L21.5443732,22.0131087 C21.9461394,22.0131087 22.0508275,22.1476887 22.0508275,22.4109333 C22.0508275,22.546829 22.0508275,23.9942747 22.0508275,24.2359402 C22.0508275,24.4776058 21.7414976,24.513651 21.5443732,24.513651 L15.6582519,24.513639 C15.1940148,24.5169359 15.1363596,24.4263027 15.1363596,23.8135508 C15.1363596,23.2007989 15.1438879,21.5754645 15.1467451,20.9464087 C15.1471391,20.8565826 15.1438827,20.7604446 15.1363596,20.642752 C14.6793812,20.6416992 14.2535851,20.6963893 14.2535851,20.4145621 C14.2535851,20.132735 14.2535851,18.7099276 14.2535851,18.5962598 C14.2535851,18.2581633 14.3628961,18.1626019 14.9134694,18.1626019 C14.7969864,16.1203684 16.2872579,14.4974213 18.1652461,14.2911332 Z"
                                        id="Shape"
                                        fill="#A8B0BF"
                                        fillRule="nonzero"
                                      />
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            </span>
                            <span className="UlName">{Resources["costControl"][currentLanguage]} </span>
                          </a>
                          <ul className={this.state.rowIndex === 7 ? "content subBigMenuUl active" : "content subBigMenuUl"}>
                            {this.state.costControlMenu.map((r, index) => {
                              return (
                                <li key={index} className={(this.state[index] === true && this.state.rowIndex === 7) ? "active" : " "} onClick={() => this.activeLi(index, this.state.costControlMenu.length)}>
                                  <NavLink to={"/" + r.route + "/" + this.state.projectId} activeClassName="active" >
                                    {Resources[r.title][currentLanguage]}
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        </li>

                        {/* <li className={this.state.rowIndex === 8 ? "ActiveSubLi" : ""}>
                          <a className={this.state.rowIndex === 8 ? "title active" : "title"} onClick={() => this.OpenSubMenu(8, Resources["projectEstimation"][currentLanguage])}>
                            <span className="ULimg">
                              <svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"                              >
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                  <g id="Action-icons/Navigation/Estimation/Line/36px/Grey_base">
                                    <g id="estimation">
                                      <rect id="bg" fill="#80CBC4" opacity="0" x="0" y="0" width="36" height="36" />
                                      <path
                                        d="M29.9184939,10.147091 C30.0992128,10.8750576 29.9771806,11.6277153 29.5745841,12.2661402 C29.1717713,12.9049347 28.5358195,13.3538753 27.7849055,13.5291977 C27.5605611,13.5807146 27.3331227,13.6071804 27.1086045,13.6071804 C27.0111617,13.6071804 26.9134705,13.6020045 26.8149257,13.5918368 L22.3296801,21.7803001 C22.623118,22.2256714 22.7826384,22.7423044 22.7826384,23.2809556 C22.7826384,24.8266646 21.4864069,26.0841007 19.8930084,26.0841007 C18.2996099,26.0841007 17.0033784,24.8266646 17.0033784,23.2809556 C17.0033784,22.9250131 17.0740383,22.5769872 17.2087962,22.2489689 L14.0446267,18.3093319 C13.8087932,18.3690416 13.5659728,18.3996666 13.3194379,18.3996666 C13.2467559,18.3996666 13.1735725,18.3964686 13.0980625,18.3902143 L10.900511,23.1881149 C11.4567002,23.7117817 11.77926,24.4295027 11.77926,25.1968549 C11.77926,26.7425639 10.4830285,28 8.88963,28 C7.29623152,28 6,26.7425639 6,25.1968549 C6,23.7262525 7.1756206,22.5139591 8.66912882,22.4040133 L11.0142706,17.2847089 C10.6380935,16.8015964 10.4298079,16.2146159 10.4298079,15.5976054 C10.4298079,14.0518963 11.7260394,12.7944603 13.3194379,12.7944603 C14.9128363,12.7944603 16.2090679,14.0518963 16.2090679,15.5976054 C16.2090679,16.0458591 16.0982628,16.4792552 15.890122,16.87186 L18.9188497,20.6439085 C19.2301289,20.5354779 19.5584009,20.4789017 19.8930387,20.4789017 C20.0434556,20.4789017 20.1935677,20.4909505 20.3434375,20.5144412 L24.7644033,12.4418715 C24.5461436,12.1472897 24.3879419,11.8156647 24.2994298,11.4587947 C24.1198596,10.73066 24.2421469,9.97816402 24.6446152,9.33994254 C25.0479934,8.70129306 25.6844565,8.25199087 26.4331595,8.07822515 C26.6549672,8.02625194 26.882822,8 27.1105056,8 C28.4494523,8 29.6046392,8.88347111 29.9184939,10.147091 Z M19.891977,24.2447665 C20.4406038,24.2447665 20.8856531,23.8130372 20.8856531,23.2808305 C20.8856531,22.7495802 20.4396179,22.3168946 19.891977,22.3168946 C19.3443361,22.3168946 18.8983009,22.7495802 18.8983009,23.2808305 C18.8983009,23.8120808 19.3443361,24.2447665 19.891977,24.2447665 Z M27.9568932,11.3062541 C28.0955463,11.0862706 28.1376744,10.826576 28.0746089,10.5756252 C27.9674106,10.1422183 27.5705262,9.83817013 27.1103286,9.83817013 C27.030814,9.83817013 26.95152,9.84738783 26.8745294,9.8660591 C26.6180489,9.9273145 26.3995118,10.0813809 26.261793,10.2998787 C26.1235243,10.5192555 26.0809466,10.7796288 26.1429556,11.0290124 C26.2708326,11.5416703 26.8101786,11.8642362 27.3419301,11.7405864 C27.5995091,11.6803209 27.8187149,11.5254534 27.9568932,11.3062541 Z"
                                        id="Shape" stroke="#A8B0BF" strokeWidth="0.2" fill="#A8B0BF" fillRule="nonzero" />
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            </span>
                            <span className="UlName">{Resources["projectEstimation"][currentLanguage]} </span>
                          </a>
                          <ul className={this.state.rowIndex === 8 ? "content subBigMenuUl active" : "content subBigMenuUl"}>
                            {this.state.estimationMenu.map((r, index) => {
                              return (
                                <li key={index} className={(this.state[index] === true && this.state.rowIndex === 8) ? "active" : " "} onClick={() => this.activeLi(index, this.state.estimationMenu.length)}>
                                  <NavLink to={"/" + r.route + "/" + this.state.projectId} activeClassName="active">
                                    {Resources[r.title][currentLanguage]}
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        </li> */}
                        <li className={this.state.rowIndex === 9 ? "ActiveSubLi" : ""}>
                          <a className={this.state.rowIndex === 9 ? "title active" : "title"} onClick={() => this.OpenSubMenu(9, Resources["qualityControlList"][currentLanguage])}>
                            <span className="ULimg">
                              <svg
                                width="36px"
                                height="36px"
                                viewBox="0 0 36 36"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                              >
                                <g
                                  id="Symbols"
                                  stroke="none"
                                  strokeWidth="1"
                                  fill="none"
                                  fillRule="evenodd"
                                >
                                  <g id="Action-icons/Navigation/Quality-control/Line/36px/Grey_base">
                                    <g id="q-cntrl">
                                      <rect
                                        id="bg"
                                        fill="#80CBC4"
                                        opacity="0"
                                        x="0"
                                        y="0"
                                        width="36"
                                        height="36"
                                      />
                                      <path
                                        d="M24.6928321,6 C27.1416392,6 28,7.30572928 28,8.5482828 C28,9.79083631 28,16.7917687 28,19.9839799 C28,23.1761911 27.49179,23.9612981 26.0419657,25.0335113 C24.3137527,26.311606 22.3787964,27.6981208 20.2370968,29.1930558 C18.0953972,30.6879907 16.5768606,29.7408211 15.8875427,29.2456352 C15.1982248,28.7504493 12.2282445,26.5791918 10.1815857,25.0335113 C8.65411401,23.879932 8,22.9401991 8,19.9839799 C8,17.0277607 8,9.83937474 8,8.5482828 C8,7.25719085 8.98347289,6 11.4827171,6 C13.9819613,6 22.2440249,6 24.6928321,6 Z M23.8943414,8.63161287 C22.3953759,8.63161287 13.434379,8.60867046 12.2654087,8.63161287 C11.0964383,8.65455529 10.6053035,8.87951708 10.6053035,10.3866925 C10.6053035,11.8938679 10.6053035,19.0546042 10.6053035,20.3570769 C10.6053035,21.6595496 10.6172212,21.9798171 11.7604639,22.8584197 C12.4153102,23.3616809 15.9002322,25.9148341 16.6432149,26.4858345 C17.3861975,27.0568349 18.5564074,27.1246911 19.2937187,26.5548246 C20.03103,25.984958 23.8235528,23.2465435 24.2860896,22.8239065 C25.0784323,22.0999137 25.3648682,21.5117944 25.3946965,20.3570769 C25.4245248,19.2023594 25.3946965,11.9689695 25.3946965,10.4997221 C25.3946965,9.03047468 25.3933068,8.63161287 23.8943414,8.63161287 Z M23.3375,15.4907473 L17.9630837,20.7032474 L14.33007,17.0419546 L16.2140989,15.0793655 L17.9630837,16.8374086 L21.372028,13.4639041 L23.3375,15.4907473 Z"
                                        id="Combined-Shape"
                                        fill="#A8B0BF"
                                        fillRule="nonzero"
                                      />
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            </span>
                            <span className="UlName">{Resources["qualityControlList"][currentLanguage]} </span>
                          </a>
                          <ul className={this.state.rowIndex === 9 ? "content subBigMenuUl active" : "content subBigMenuUl"}>
                            {this.state.qualityControlMenu.map((r, index) => {
                              return (
                                <li key={index} className={(this.state[index] === true && this.state.rowIndex === 9) ? "active" : " "} onClick={() => this.activeLi(index, this.state.qualityControlMenu.length)}>
                                  <NavLink to={"/" + r.route + "/" + this.state.projectId} activeClassName="active" >
                                    {Resources[r.title][currentLanguage]}
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                        <li className={this.state.rowIndex === 10 ? "ActiveSubLi" : ""}>
                          <a className={this.state.rowIndex === 10 ? "title active" : "title"} onClick={() => this.OpenSubMenu(10, Resources["designCoordination"][currentLanguage])}>
                            <span className="ULimg">
                              <svg
                                width="22px"
                                height="22px"
                                viewBox="0 0 22 22"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                              >
                                <g
                                  id="Symbols"
                                  stroke="none"
                                  strokeWidth="1"
                                  fill="none"
                                  fillRule="evenodd"
                                >
                                  <g
                                    id="Components/Nav/Side-left/Closed/Base"
                                    transform="translate(-33.000000, -836.000000)"
                                  >
                                    <g id="Group-3">
                                      <g
                                        id="Group-2"
                                        transform="translate(0.000000, 160.000000)"
                                      >
                                        <g
                                          id="Group-13"
                                          transform="translate(0.000000, 656.000000)"
                                        >
                                          <g
                                            id="Action-icons/Navigation/Design/Line/36px/Grey_base"
                                            transform="translate(26.000000, 13.000000)"
                                          >
                                            <g id="drwngs">
                                              <rect
                                                id="bg"
                                                fill="#80CBC4"
                                                opacity="0"
                                                x="0"
                                                y="0"
                                                width="36"
                                                height="36"
                                              />
                                              <path
                                                d="M27.9561012,9.12936216 C29.3401057,10.5366195 29.3482728,12.7994561 27.9785087,14.2184876 L15.0794701,27.0894 C14.6026386,27.5393586 14.0211768,27.8494829 13.3928818,27.9801785 L8.63195018,28.9473872 C8.50573847,28.9899114 8.41629768,29 8.29320073,29 C7.96103356,29 7.61768874,28.8502419 7.37762462,28.6106929 C7.06959142,28.3018117 6.94338287,27.871501 7.02352863,27.4301327 L8.01195139,22.6082816 C8.14801272,21.9570296 8.45045585,21.3799212 8.91547963,20.9158999 L21.7990315,8.06016 C23.1881165,6.64726909 25.4686457,6.64726909 26.8806502,8.05622958 L27.9561012,9.12936216 Z M27.1334992,9.94258039 L26.0617928,8.87332169 C25.1033437,7.91693885 23.5620961,7.91693885 22.6217903,8.87332169 L9.73433704,21.732992 C9.43275883,22.0339201 9.23674084,22.4079528 9.14605871,22.841979 L8.16058003,27.6487357 C8.14903002,27.7124645 8.16296933,27.7599909 8.19748535,27.7946044 C8.22480134,27.8218615 8.27660583,27.8444573 8.29320073,27.8444573 C8.29861419,27.8444573 9.92044042,27.5124769 13.1586794,26.8485161 C13.5711339,26.7627161 13.9601127,26.5552531 14.272198,26.2610659 L27.152029,13.4091456 C28.0797246,12.4479833 28.0741343,10.8991143 27.1334992,9.94258039 Z M10.7909137,22.189277 L11.5204233,22.9172139 L22.8205889,11.6414093 L22.0806572,10.9030728 L10.7909137,22.189277 Z M24.4583037,11.6414093 L11.5204233,24.5513981 L9.27660152,22.3124136 L9.46770739,21.9383486 C9.50122755,21.8727373 9.54018249,21.8180631 9.58553785,21.7648351 C9.63267626,21.7121171 9.63267626,21.7121171 9.66123235,21.683053 L22.0798992,9.26813217 L24.4583037,11.6414093 Z M10.1504645,26.3716812 L11.579299,26.0795919 L9.89489779,24.3988219 L9.60217744,25.8245761 L10.1504645,26.3716812 Z M9.19226546,22.0635202 L13.9196461,26.7807095 L8.17103959,27.9992991 L7.98595431,27.7206999 L9.19226546,22.0635202 Z M25.1246212,13.9199776 L24.3846919,13.1816435 L13.0845263,24.457448 L13.8139665,25.1853157 L25.1246212,13.9199776 Z M14.2275284,26.4000223 C14.1752003,26.4434221 14.1199322,26.4791949 14.0573956,26.509785 L13.6857618,26.6915716 L11.4468115,24.457448 L24.3846919,11.5474592 L26.7630964,13.9207364 L14.3217051,26.3122808 C14.287189,26.3470816 14.2871724,26.3470962 14.2275284,26.4000223 Z M26.3912078,10.6909696 L25.3152805,9.61736121 C25.0588298,9.36086696 24.7047698,9.21710851 24.3418354,9.21710851 C24.1127389,9.21710851 23.886673,9.27478313 23.6863883,9.38210985 L26.6321708,12.3215419 C26.9153983,11.8080854 26.8361962,11.1354935 26.3912078,10.6909696 Z M26.6685632,13.9920399 L22.0075546,9.34107961 L22.5490567,8.80074488 C23.0251221,8.32570577 23.6749324,8.06156576 24.3418354,8.06156576 C25.0095678,8.06156576 25.6593439,8.32539334 26.1346142,8.80074488 L27.2102932,9.87410502 C28.2055859,10.8683588 28.2055859,12.4871991 27.204022,13.4577354 L26.6685632,13.9920399 Z"
                                                id="Shape"
                                                fill="#A8B0BF"
                                                fillRule="nonzero"
                                              />
                                            </g>
                                          </g>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            </span>
                            <span className="UlName">{Resources["designCoordination"][currentLanguage]}</span>
                          </a>
                          <ul className={this.state.rowIndex === 10 ? "content subBigMenuUl active" : "content subBigMenuUl"}>
                            {this.state.designMenu.map((r, index) => {
                              return (
                                <li key={index} className={(this.state[index] === true && this.state.rowIndex === 10) ? "active" : " "} onClick={() => this.activeLi(index, this.state.designMenu.length)}>
                                  <NavLink to={"/" + r.route + "/" + this.state.projectId} activeClassName="active" >
                                    {Resources[r.title][currentLanguage]}
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                        {/* <li className={this.state.rowIndex === 11 ? "ActiveSubLi" : ""}>
                          <a className={this.state.rowIndex === 11 ? "title active" : "title"} onClick={() => this.OpenSubMenu(11, Resources["reportsCenter"][currentLanguage])}>
                            <span className="ULimg">
                              <svg
                                width="36px"
                                height="36px"
                                viewBox="0 0 36 36"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                              >
                                <g
                                  id="Symbols"
                                  stroke="none"
                                  strokeWidth="1"
                                  fill="none"
                                  fillRule="evenodd"
                                >
                                  <g id="Action-icons/Navigation/Reports-center/Line/36px/Grey_base">
                                    <g id="rprts-cntr">
                                      <rect
                                        id="bg"
                                        fill="#80CBC4"
                                        opacity="0"
                                        x="0"
                                        y="0"
                                        width="36"
                                        height="36"
                                      />
                                      <path
                                        d="M15.9149956,9.00045801 L20.0661139,9.00082766 C20.1172758,8.99945983 20.1172758,8.99945983 20.2019742,9.00337206 C20.7787962,9.06804477 21.2152889,9.5917809 21.2123597,10.2120593 L21.2123597,26.7883987 C21.2123597,27.4574011 20.7073528,28 20.0846999,28 L15.9149956,28 C15.2923427,28 14.7873358,27.4574011 14.7873358,26.7883987 L14.7873358,10.2120593 C14.7873358,9.54305693 15.2923427,9.00045801 15.9149956,9.00045801 Z M17.0426553,25.5767974 L18.9570402,25.5767974 L18.9570402,11.4236606 L17.0426553,11.4236606 L17.0426553,25.5767974 Z M23.5853745,13.4834624 L23.6188983,13.4809194 C23.6700601,13.4795516 23.6700601,13.4795516 23.7026359,13.4805497 L27.8723402,13.4805497 C28.4949931,13.4805497 29,14.0231487 29,14.692151 L29,26.7883987 C29,27.4574011 28.4949931,28 27.8723402,28 L23.7026359,28 C23.079983,28 22.5749761,27.4574011 22.5749761,26.7883987 L22.5749826,14.6948787 C22.5720514,14.0718659 23.0085473,13.5481195 23.5853745,13.4834624 Z M24.8302956,25.5767974 L26.7446805,25.5767974 L26.7446805,15.9037523 L24.8302956,15.9037523 L24.8302956,25.5767974 Z M8.01040666,17.9635541 L8.04393038,17.9610111 C8.09509219,17.9596433 8.09509219,17.9596433 8.12766801,17.9606415 L12.2973724,17.9606415 C12.9200252,17.9606415 13.4250321,18.5032404 13.4250321,19.1722428 L13.4250321,26.7883987 C13.4250321,27.4574011 12.9200252,28 12.2973724,28 L8.12766801,28 C7.50501513,28 7.00000826,27.4574011 7.00000826,26.7883987 L7.00001468,19.1749704 C6.99708349,18.5519576 7.43357936,18.0282112 8.01040666,17.9635541 Z M9.25532776,25.5767974 L11.1697126,25.5767974 L11.1697126,20.383844 L9.25532776,20.383844 L9.25532776,25.5767974 Z"
                                        id="Shape"
                                        fill="#A8B0BF"
                                        fillRule="nonzero"
                                      />
                                    </g>
                                  </g>
                                </g>
                              </svg>
                            </span>
                            <span className="UlName">{Resources["reportsCenter"][currentLanguage]}</span>
                          </a>
                          <ul className={this.state.rowIndex === 11 ? "content subBigMenuUl active" : "content subBigMenuUl"}>
                            {this.state.reportsMenu.map((r, index) => {
                              return (
                                <li key={index} className={(this.state[index] === true && this.state.rowIndex === 11) ? "active" : " "} onClick={() => this.activeLi(index, this.state.reportsMenu.length)}>
                                  <NavLink to={"/" + r.route + "/" + this.state.projectId} activeClassName="active" >
                                    {Resources[r.title][currentLanguage]}
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        </li> */}
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
)(LeftMenu);
