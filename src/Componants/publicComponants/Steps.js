import React, { Component } from "react";
import * as StepsActions from "../../store/actions/Steps";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import Resources from "../../resources.json";
let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
class Steps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            completedTabs: [],
            stepNo: 0
        };
    }

    componentWillReceiveProps(props) {
        if (props.stepNo != this.state.stepNo)
            this.setCurrentStep(props.stepNo);
    }

    /// click over steps in edit mode
    /// params: stepNo to specify the desired step
    setCurrentStep = stepNo => {
        if (this.props.changeStatus == true || this.props.docId > 0) {
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
                <div
                    key={"index-" + index}
                    onClick={e => {
                        this.toggleNextStep(e, step, index);
                    }}
                    className={
                        "step-slider-item " +
                        (this.state.completedTabs[index]
                            ? "active"
                            : this.state.stepNo == index
                            ? "current__step"
                            : "")
                    }>
                    <div className="steps-timeline">
                        <span>{index + 1}</span>
                    </div>
                    <div className="steps-info">
                        <h6>{Resources[step.name][currentLanguage]}</h6>
                    </div>
                </div>
            );
        });

        return (
            <div className="docstepper-levels">
                {/* Next & Previous */}
                <div className="step-content-foot">
                    <span
                        onClick={e => this.nxt_prev(-1)}
                        className={
                            this.props.changeStatus == true
                                ? "step-content-btn-prev "
                                : "step-content-btn-prev disabled"
                        }>
                        <i className="fa fa-caret-left" aria-hidden="true" />
                        {Resources["previous"][currentLanguage]}
                    </span>
                    <span
                        onClick={e => this.nxt_prev(1)}
                        className={
                            this.props.changeStatus == true
                                ? "step-content-btn-prev "
                                : "step-content-btn-prev disabled"
                        }>
                        {Resources["next"][currentLanguage]}{" "}
                        <i className="fa fa-caret-right" aria-hidden="true" />
                    </span>
                </div>
                {/* Steps Active  */}
                <div className="workflow-sliderSteps">
                    <div className="step-slider">{renderSteps}</div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        changeStatus: state.communication.changeStatus,
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
