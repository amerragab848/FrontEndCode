import React, { Component, Fragment } from "./node_modules/react";
import { Formik, Form, Field } from "./node_modules/formik";
import * as Yup from "./node_modules/yup";
import dataservice from "../../Dataservice";
import Resources from "../../resources.json";
import { withRouter } from "./node_modules/react-router-dom";
import { connect } from "./node_modules/react-redux";
import { bindActionCreators } from "./node_modules/redux";
import Config from "../../Services/Config.js";
import * as communicationActions from "../../store/actions/communication";
import Edit from "../../Styles/images/epsActions/edit.png";
import Plus from "../../Styles/images/epsActions/plus.png";
import Delete from "../../Styles/images/epsActions/delete.png";
import Rodal from "../../Styles/js/rodal";
import ConfirmationModal from "../publicComponants/ConfirmationModal";
import LoadingSection from '../publicComponants/LoadingSection';

import { toast } from "./node_modules/react-toastify";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
    codeTreeTitle: Yup.string()
        .required(Resources["subjectRequired"][currentLanguage])
        .max(450, Resources["maxLength"][currentLanguage]),
    budgetThisPeriod: Yup.number().required(
        Resources["budgetThisPeriodSelection"][currentLanguage]
    ),
    budgetAtComplete: Yup.number().required(
        Resources["budgetAtCompleteSelection"][currentLanguage]
    ),
    originalBudget: Yup.number().required(
        Resources["originalBudgetRequire"][currentLanguage]
    ),
    costForcast: Yup.number().required(
        Resources["costForcastSelection"][currentLanguage]
    )
});

class CostCodingTreeAddEdit extends Component {

    constructor(props) {

        super(props);

        this.state = {
            projectId: this.props.projectId , 
            trees: [],
            childerns: [],
            rowIndex: null,
            isEdit: false,
            parentId: "",
            isLoading: false,
            drawChilderns: false,
            docId: ""  , 
            ApiDrawTree:'GetCostCodingTreeByProjectId?projectId='
        };
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.projectId !== this.props.projectId) {

            dataservice.GetDataGrid(this.state.ApiDrawTree + nextProps.projectId).then(result => {
                this.setState({
                    trees: result
                })
            })
        }
    }

    componentWillMount() {
        let treeDocument = {
            codeTreeTitle: "",
            budgetThisPeriod: "",
            budgetAtComplete: "",
            originalBudget: "",
            costForcast: "",
            parentId: ""
        };

        this.props.actions.documentForAdding();

        dataservice.GetDataGrid(this.state.ApiDrawTree  + this.state.projectId).then(result => {
            this.setState({
                trees: result,
                document: treeDocument
            });
        });
    }

    parentCollapsed(rowIndex) {
        this.setState({
            rowIndex: rowIndex
        });
    }

    viewChild(item) {
        this.setState({
            rowIndex: item.id,
        })
        console.log(item.trees)
    }

    openChild(item) {
        let childerns = [];
        //let childern =
        return item.trees.map(result => {
            return (
                <div className="epsContent" key={result.id}>
                    <div className="epsTitle">
                        <div className="listTitle">
                            <span className="dropArrow">
                                <i className="dropdown icon" />
                            </span>
                            <span className="accordionTitle">{result.codeTreeTitle}</span>
                        </div>
                    </div>
                </div>
            )
          
        });
    }

    designParent() {
        return this.state.trees.map((item, index) => {
            return (
                <Fragment>
                    <div className={this.state.rowIndex === item.id ? "epsTitle active" : "epsTitle"} key={item.id} onClick={() => this.viewChild(item)}>
                        <div className="listTitle">
                            <span className="dropArrow">
                                <i className="dropdown icon" />
                            </span>
                            <span className="accordionTitle">{item.codeTreeTitle}</span>
                        </div>
                    </div>
                    {this.state.rowIndex === item.id ? this.openChild(item) : null}
                </Fragment>
            );
        });
    }

    clickHandlerContinueMain() {
        dataservice.addObject("DeleteCostCodeTree", this.state.docId).then(result => {

            this.setState({
                showDeleteModal: false
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);

        }).catch(ex => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    }

    render() {
        return (
            <div className="mainContainer">
                <div className="documents-stepper noTabs__document">
                    <div className="submittalHead">
                        <h2 className="zero">  {Resources.costCodingTree[currentLanguage]} </h2>
                        <div className="SubmittalHeadClose">
                            <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)" >
                                        <g id="Group-2"> <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                            <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                                                <g id="Group">
                                                    <circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28" />
                                                    <path id="Combined-Shape" fill="#858D9E" fillRule="nonzero"
                                                        d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z" />
                                                </g>
                                            </g>
                                        </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                    <div className="Eps__list">
                        {this.designParent()}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        document: state.communication.document,
        isLoading: state.communication.isLoading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(CostCodingTreeAddEdit));
