import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom"; 
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as dashboardComponantActions from "../../store/actions/communication";
class HeaderDocument extends Component {
    constructor(props) {
        super(props);
    }
    routeToPrevious=()=>{
        this.props.actions.RouteToTemplate();
        this.props.history.push( 
            this.props.perviousRoute
          );
    }

    render() {
        return (
            <Fragment>
                <div className="submittalHead">
                    <h2 className="zero">{this.props.docTitle}
                        <span>{this.props.projectName} · {this.props.moduleTitle}</span>
                    </h2>
                    <div className="SubmittalHeadClose" onClick={ ()=>this.routeToPrevious()}>
                        <svg  width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                    <g id="Group-2">
                                        <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                            <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                                                <g id="Group">
                                                    <circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28" ></circle>
                                                    <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z" id="Combined-Shape" fill="#858D9E" fillRule="nonzero"></path>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                </div>
                {this.props.isViewMode === true ?

                    <div className="edit__sign">
                        <div className="notifiError notifiActionsContainer">
                            <span className="notfiSpan">Sorry, You can't edit this document</span>
                        </div>
                    </div>

                    : null

                }
            </Fragment>

        )
    }
}
function mapStateToProps(state, ownProps) {
    return {
      showLeftMenu: state.communication.showLeftMenu,
      showSelectProject: state.communication.showSelectProject,
      showLeftReportMenu: state.communication.showLeftReportMenu
    };
  }
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(dashboardComponantActions, dispatch)
    };
  }
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderDocument));