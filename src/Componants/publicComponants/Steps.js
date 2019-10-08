import React, { Component, Fragment } from "react";
import * as StepsActions from "../../store/actions/Steps";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import Resources from "../../resources.json";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
class Steps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            completedTabs: [],
            stepNo: 0
        };
    }

    componentWillReceiveProps(props) {
        if (props.stepNo && props.stepNo != this.state.stepNo)
            this.setCurrentStep(props.stepNo);
    }

    /// click over steps in edit mode
    /// params: stepNo to specify the desired step
    setCurrentStep = stepNo => {
        if (this.props.changeStatus == true || this.props.docId > 0 || this.props.isEdit == true) {
            let length = this.props.steps_defination.length;
            if (stepNo == length)
                this.props.history.push({
                    pathname: this.props.exist_link + this.props.projectId + ""
                });
            else if (stepNo >= 0 && stepNo < length) {
                if (this.props.steps_defination[stepNo].callBackFn) {
                    this.props.steps_defination[stepNo].callBackFn();
                }
                this.props.changeCurrentStep(stepNo);
                let completedTabs = [];
                for (let index = 0; index < stepNo; index++) {
                    completedTabs[index] = true;
                }
                for (let index = stepNo; index < length; index++) {
                    completedTabs[index] = false;
                }
                this.setState({
                    completedTabs,
                    stepNo,
                    docId: this.props.docId
                });
            }
        }
    };

    /// traverse over steps in edit mode using next , previous btn top of steps panel
    /// params: flag to specify next or previous [+1] for right , [-1] for previous
    nxt_prev = flag => {
        let length = this.props.steps_defination.length;
        let stepNo = this.state.stepNo + flag;
        this.setCurrentStep(stepNo);
    };

    componentWillUnmount() {
        this.props.actions.Set_Step(0);
    }

    toggleNextStep(e, step, index) {

        if (step.callBackFn) {
            step.callBackFn();
        }
        this.setCurrentStep(index);

    }

    render() {
        let renderSteps = this.props.steps_defination.map((step, index) => {
            return (
                this.props.changeStatus == true || this.props.isEdit == true ?
                    <Fragment key={"index-" + index}>
                        <div onClick={e => { this.toggleNextStep(e, step, index); }} className={'editView__tabs--title ' + (this.state.completedTabs[index] ? " " : this.state.stepNo == index ? " active" : "")}>
                            <p>{Resources[step.name][currentLanguage]}</p>
                        </div>
                    </Fragment>
                    :
                    <Fragment key={"index-" + index}>
                        <div className={'StepNumber ' + (this.state.completedTabs[index] ? " activea" : this.state.stepNo == index ? "current__step active" : "")}>
                            <div className="StepNum">
                                <p className="StepN zero" >{index + 1}</p>
                                <p className="StepTrue zero">✔</p>
                            </div>
                            <div className="stepWord">{Resources[step.name][currentLanguage]}</div>
                        </div>
                        <span className="Step-Line"></span>
                    </Fragment>
            );
        });


        return (
            <Fragment>
                {/* Next & Previous */}

                {/* Steps Active  */}
                {this.props.changeStatus == true || this.props.isEdit == true ?
                    <div className="editView__tabs">
                        <div className="editView__tabs">
                            {renderSteps}
                        </div>
                    </div>
                    :
                    <div className="docstepper-levels" style={{ width: '100%', background: '#fff', zIndex: '14' }}>
                        <div className="StepperNum1 StepperNum" style={{ justifyContent: 'center', marginTop: '40px' }}>
                            {renderSteps}
                        </div>
                    </div>
                }
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        //   changeStatus: state.communication.changeStatus,
        projectId: state.communication.projectId
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(StepsActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Steps));
