import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../../publicComponants/ConfirmationModal";
import GridSetup from "../../../../Pages/Communication/GridSetup";
import NotifiMsg from '../../../publicComponants/NotifiMsg'
import Export from "../../../../Componants/OptionsPanels/Export";
import config from "../../../../Services/Config";
import Resources from "../../../../resources.json";
import Api from '../../../../api';
import dataservice from "../../../../Dataservice";
import DropDown from '../../../OptionsPanels/DropdownMelcous'
import DatePicker from '../../../OptionsPanels/DatePicker'
import moment from 'moment';
import { SkyLightStateless } from 'react-skylight';
import { connect } from "react-redux";
// import { AddExpensesWorkFlow } from "../../../../store/actions/types";
import * as ProjectActions from "../../../../store/actions/ProjectActions";
import { bindActionCreators } from "redux";

const getPublicConfiguartion = config.getPublicConfiguartion();
const publicConfiguarion = config.getPayload();
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let CurrProject = localStorage.getItem('lastSelectedprojectName')
let MaxArrange = 1
class ExpensesWorkFlowAddEdit extends Component {

    constructor(props) {
        super(props)

        const columnsGrid = [
            {
                key: "id",
                visible: false,
                width: 50,
                frozen: true
            },
            {
                key: "arrange",
                name: Resources["numberAbb"][currentLanguage],
                width: 50,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "companyName",
                name: Resources["CompanyName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "contactName",
                name: Resources["ContactName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "description",
                name: Resources["description"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
        ]

        this.state = {
            showCheckbox: false,
            columns: columnsGrid.filter(column => column.visible !== false),
            ProjectList: [],
            CompanyData: [],
            ContactData: [],
            FirstStep: true,
            SecondStep: false,
            ThirdStep: false,
            SecondStepComplate: false,
            ThirdStepComplate: false,
            rows: [],
            selectedRows: [],
            isLoading: true,
            MultiApprovalData: [],
            CurrStep: 1,
            showPopUp: false
        }
    }

    componentWillReceiveProps() {
        console.log(this.props.ProjectReducer.expensesWorkFlowData)

    }
    NextStep = () => {
        if (this.state.CurrStep === 1) {
            this.setState({
                FirstStep: false,
                SecondStep: true,
                SecondStepComplate: true,
                ThirdStepComplate: false,
                CurrStep: this.state.CurrStep + 1,
                ThirdStep: false
            })
        }
        else {
            if (this.state.CurrStep === 2) {
                this.setState({
                    FirstStep: false,
                    SecondStep: false,
                    ThirdStep: true,
                    CurrStep: this.state.CurrStep + 1,
                    ThirdStepComplate: true
                })
                window.scrollTo(0, 0)
            }
        }
    }

    PreviousStep = () => {
        if (this.state.CurrStep === 3) {
            this.setState({
                FirstStep: false,
                SecondStep: true,
                ThirdStep: false,
                CurrStep: this.state.CurrStep - 1,
                ThirdStepComplate: false,
                SecondStepComplate: true
            })
        }
        else {
            if (this.state.CurrStep === 2) {
                this.setState({
                    FirstStep: true,
                    SecondStep: false,
                    SecondStepComplate: false,
                    ThirdStep: false,
                    CurrStep: this.state.CurrStep - 1
                })
            }
        }
    }

    componentWillMount = () => {
        const query = new URLSearchParams(this.props.location.search);
        for (let param of query.entries()) {
            MaxArrange = param[1];
        }
        console.log(MaxArrange)
    }

    componentDidMount = () => {

        dataservice.GetDataList('ProjectProjectsGetAll', 'projectName', 'id').then(
            res => {
                this.setState({
                    ProjectList: res,
                })
            }
        )

        dataservice.GetDataList('GetProjectCompanies?accountOwnerId=' + publicConfiguarion.aoi + '', 'companyName', 'id').then(
            res => {
                this.setState({
                    CompanyData: res,
                })
            }
        )

        Api.get('getExpensesWorkFlowItemsByWorkFlowId?WorkFlowId=26').then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false
                })
            }
        )
        Api.get('GetExpensesWorkFlowItemsByWorkFlowIdLevel?workFlow=35').then(
            res => {
                this.setState({
                    MultiApprovalData: res
                })


            }
        )

    }

    CompanyDatahandleChange = (e) => {
        dataservice.GetDataList('GetContactsByCompanyIdForOnlyUsers?companyId=' + e.value + '', 'contactName', 'id').then(
            res => {
                this.setState({
                    ContactData: res,
                })
            }
        )
    }

    SaveFirstStep = () => {

    }

    SaveSecondStep = () => {

    }

    SaveThirdStep = () => {

    }

    AddNewContact = () => {

    }

    DeleteContact = () => {

    }

    EditContact = () => {
        this.props.actions.AddExpensesWorkFlow('AddAccountsDefaultList', {
            abbreviation: "a"
            ,listType: "approvalstatus"
            ,title: "sadasd"
          ,  titleAr: "asdasddas"
           
        })
    }

    render() {

        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.state.columns}
                    showCheckbox={this.state.showCheckbox}
                    minHeight={350}
                    // clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                    onRowClick={() => this.setState({ showPopUp: true })}
                />
            ) : <LoadingSection />

        const renderMultiApprovalTable =
            this.state.MultiApprovalData.map((item) => {
                return (
                    <Fragment>
                        <td>{item.arrange}</td>
                        <td>
                            <DropDown data={[{ label: 'Multi', value: true }, { label: 'Single', value: false }]}
                                selectedValue={item.multiApproval ? { label: 'Multi', value: true } : { label: 'Single', value: false }} />
                        </td>
                    </Fragment>
                )
            })


        const AddContact = () => {
            return (
                <Fragment>
                    <header className="main__header">
                        <div className="main__header--div">
                            <h2 className="zero">{Resources['addContact'][currentLanguage]}</h2>
                        </div>
                    </header>
                    <div className='document-fields'>
                        <form className="proForm datepickerContainer">
                            <div className="linebylineInput valid-input">
                                <div className="inputDev ui input">
                                    <DropDown title='company' handleChange={this.CompanyDatahandleChange} data={this.state.CompanyData} />
                                </div>
                            </div>

                            <div className="linebylineInput valid-input">
                                <div className="inputDev ui input">
                                    <DropDown title='ContactName' data={this.state.ContactData} />
                                </div>
                            </div>
                            <div className="linebylineInput valid-input">
                                <label className="control-label">{Resources['numberAbb'][currentLanguage]}</label>
                                <div className="inputDev ui input">
                                    <input autoComplete="off" type="text" className="form-control" name="firstname1" placeholder={Resources['numberAbb'][currentLanguage]} />
                                </div>
                            </div>

                            <div className="linebylineInput valid-input">
                                <label className="control-label">{Resources['description'][currentLanguage]}</label>
                                <div className="inputDev ui input">
                                    <input autoComplete="off" type="text" className="form-control" id="firstname1" name="firstname1" placeholder={Resources['description'][currentLanguage]} />
                                </div>
                            </div>
                        </form>
                        <div className="slider-Btns">
                            <button className="primaryBtn-1 btn meduimBtn">ADD</button>
                        </div>
                    </div>
                </Fragment>
            )
        }

        return (

            <div className="mainContainer" >
                <div className="documents-stepper noTabs__document one__tab one_step">
                    {/* Header */}
                    <div className="submittalHead">
                        <h2 className="zero">{CurrProject + ' - ' + Resources['expensesWorkFlow'][currentLanguage]}</h2>
                        <div className="SubmittalHeadClose">
                            <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                        <g id="Group-2">
                                            <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                                <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                                                    <g id="Group">
                                                        <circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
                                                        <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z"
                                                            id="Combined-Shape" fill="#858D9E" fillRule="nonzero"></path>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>

                    <div className="doc-container">

                        {/* AddContact */}
                        <SkyLightStateless onOverlayClicked={() => this.setState({ showPopUp: false })}
                            title={Resources['editTitle'][currentLanguage]}
                            onCloseClicked={() => this.setState({ showPopUp: false })} isVisible={this.state.showPopUp}>
                            {AddContact()}
                        </SkyLightStateless>

                        {/* Render Steps */}
                        <div className="step-content">
                            {this.state.FirstStep ?
                                //  First Step 
                                < Fragment >
                                    <div className="document-fields">
                                        <form className="proForm first-proform">
                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['subject'][currentLanguage]}</label>
                                                <div className="inputDev ui input">
                                                    <input autoComplete="off" type="text" className="form-control" name="subject" placeholder={Resources['subject'][currentLanguage]} />
                                                </div>
                                            </div>

                                            <div className="linebylineInput">
                                                <label className="control-label"> {Resources['status'][currentLanguage]} </label>
                                                <div className="ui checkbox radio radioBoxBlue">
                                                    <input type="radio" name="designTeam" value="true" onChange={this.DesignTeamChange} />
                                                    <label>{Resources['oppened'][currentLanguage]}</label>
                                                </div>
                                                <div className="ui checkbox radio radioBoxBlue checked">
                                                    <input type="radio" defaultChecked name="designTeam" value="false" onChange={this.DesignTeamChange} />
                                                    <label> {Resources['closed'][currentLanguage]}</label>
                                                </div>
                                            </div>

                                        </form>

                                        <form className="proForm datepickerContainer">
                                            <div className="linebylineInput valid-input">
                                                <div className="inputDev ui input">
                                                    <DropDown data={this.state.ProjectList} title='projectName' isClear={true} />
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <div className="inputDev ui input">
                                                    <DatePicker title='docDate' startDate={moment().format('DD:MM:YYYY')} />
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['numberAbb'][currentLanguage]}</label>
                                                <div className="inputDev ui input">
                                                    <input autoComplete="off" type="text" className="form-control" name="no" placeholder={Resources['numberAbb'][currentLanguage]} />
                                                </div>
                                            </div>

                                        </form>

                                    </div>
                                    <div className="doc-pre-cycle">
                                        <div className="slider-Btns">
                                            <button className="primaryBtn-1 btn meduimBtn" onClick={this.EditContact}>NEXT STEP</button>
                                        </div>
                                    </div>
                                </Fragment>
                                :
                                <Fragment>
                                    {this.state.SecondStep ?
                                        //Second Step
                                        <div className="subiTabsContent feilds__top">

                                            {AddContact()}

                                            <header>
                                                <h2 className="zero">{Resources['contactList'][currentLanguage]}</h2>
                                            </header>

                                            <div className="doc-pre-cycle">
                                                {dataGrid}
                                            </div>

                                            <div className="doc-pre-cycle">
                                                <div className="slider-Btns">
                                                    <button className="primaryBtn-1 btn meduimBtn" onClick={this.NextStep}>NEXT STEP</button>
                                                </div>
                                                {/* <div className="slider-Btns">
                                                    <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.setState({ FirstStep: true, SecondStepComplate: false, ThirdStepComplate: false ,CurrStep:this.state.CurrStep -1 })}>Last STEP</button>
                                                </div> */}
                                            </div>
                                        </div>
                                        :
                                        //Third Step
                                        <div className='document-fields'>
                                            <table className="ui table">
                                                <thead>
                                                    <tr>
                                                        <th>No.</th>
                                                        <th>Subject</th>

                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        {renderMultiApprovalTable}
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className="doc-pre-cycle">
                                                <div className="slider-Btns">
                                                    <button className="primaryBtn-1 btn meduimBtn">Save STEP</button>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </Fragment>}
                        </div>

                        {/* Right Menu */}
                        <div className="docstepper-levels">
                            {/* Next & Previous */}
                            <div className="step-content-foot">
                                <span onClick={this.PreviousStep} className={!this.state.FirstStep ? "step-content-btn-prev " :
                                    "step-content-btn-prev disabled"}><i className="fa fa-caret-left" aria-hidden="true"></i>Previous</span>

                                <span onClick={this.NextStep} className={!this.state.ThirdStepComplate ? "step-content-btn-prev "
                                    : "step-content-btn-prev disabled"}>Next<i className="fa fa-caret-right" aria-hidden="true"></i>
                                </span>
                            </div>
                            {/* Steps Active  */}
                            <div className="workflow-sliderSteps">
                                <div className="step-slider">
                                    <div data-id="step1" className="step-slider-item  active" >
                                        <div className="steps-timeline">
                                            <span>1</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>Expenses WorkFlow</h6>

                                        </div>
                                    </div>

                                    <div data-id="step2 " className={this.state.SecondStepComplate ? "step-slider-item  active" : "step-slider-item"} >
                                        <div className="steps-timeline">
                                            <span>2</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6 >Contacts</h6>
                                        </div>
                                    </div>
                                    <div data-id="step3" className={this.state.ThirdStepComplate ? "step-slider-item  active" : "step-slider-item"}>
                                        <div className="steps-timeline">
                                            <span>3</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>Multi Approval</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    let sState = state;
    return sState;
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(ProjectActions, dispatch)
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)
    (ExpensesWorkFlowAddEdit))