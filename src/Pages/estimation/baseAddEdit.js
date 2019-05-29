import React, { Component } from "react"; 
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import ModernDatepicker from "react-modern-datepicker";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous"; 
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json"; 
import { withRouter } from "react-router-dom";  
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication'; 
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment"; 
import SkyLight from 'react-skylight';
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval' 
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({ 
    description: Yup.string().required(Resources['descriptionRequired'][currentLanguage]), 
    resourceCode: Yup.string().required(Resources['resourceCodeRequired'][currentLanguage]),
    unit: Yup.string().required(Resources['selecApartNumber'][currentLanguage]),
    unitPrice: Yup.number().required(Resources['selecApartNumber'][currentLanguage]),
    estimationItemTypeId: Yup.string().required(Resources['toContactRequired'][currentLanguage]).nullable(true),
    specsSectionId: Yup.string().required(Resources['toContactRequired'][currentLanguage]).nullable(true),
})

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
const _ = require('lodash');

class BaseAddEdit extends Component {

    constructor(props) {

        super(props);
      
        const query = new URLSearchParams(this.props.location.search);
      
        let index = 0;
      
        for (let param of query.entries()) {
            if (index == 0) {
                try {
                    let obj = JSON.parse(CryptoJS.enc.Base64.parse(param[1]).toString(CryptoJS.enc.Utf8));

                    docId = obj.docId;
                    projectId = obj.projectId;
                    projectName = obj.projectName;
                    isApproveMode = obj.isApproveMode;
                    docApprovalId = obj.docApprovalId;
                    arrange = obj.arrange;
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.state = {
            isLoading:false,
            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode, 
            docId: docId,
            docTypeId: 84,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            itemsType: [],
            specsSections: [], 
            permission: [{ name: 'sendByEmail', code: 3790 },
                         { name: 'sendByInbox', code: 3789 },
                         { name: 'sendTask', code: 0 },
                         { name: 'distributionList', code: 3794 },
                         { name: 'createTransmittal', code: 3795 }, 
                         { name: 'sendToWorkFlow', code: 3793 }
                        ],
            selecteditemType: { label: Resources.itemTypeSelection[currentLanguage], value: "0" },
            selectedspecsSection: { label: Resources.specsSectionSelection[currentLanguage], value: "0" } 
        }

        if (!Config.IsAllow(578) || !Config.IsAllow(579) || !Config.IsAllow(3725)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/base/" + projectId
            });
        }
    }

    componentDidMount() {
        var links = document.querySelectorAll(".noTabs__document .doc-container .linebylineInput");
        for (var i = 0; i < links.length; i++) {
            if ((i + 1) % 2 == 0) {
                links[i].classList.add('even');
            }
            else {
                links[i].classList.add('odd');
            }
        }
        this.checkDocumentIsView();
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id) {

            nextProps.document.docDate =nextProps.document.docDate != null ? moment(nextProps.document.docDate).format('DD/MM/YYYY') : moment();

            this.setState({
                document: nextProps.document,
                hasWorkflow: nextProps.hasWorkflow,
             });
             
            this.fillDropDowns(nextProps.document.id > 0 ? true : false);
            this.checkDocumentIsView();
        }
    };

    componentWillUnmount() {  
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }
        
        if (prevProps.showModal != this.props.showModal) {
            this.setState({ showModal: this.props.showModal });  
        } 
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(579))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(579)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(579)) {
                    if (this.props.document.status !== false && Config.IsAllow(579)) {
                        this.setState({ isViewMode: false });
                    } else {
                        this.setState({ isViewMode: true });
                    }
                } else {
                    this.setState({ isViewMode: true });
                }
            }
        }
        else {
            this.setState({ isViewMode: false });
        }
    }

    componentWillMount() {
        if (this.state.docId > 0) {
            let url = "GetEstimationBaseForEdit?id=" + this.state.docId
            this.props.actions.documentForEdit(url);

        } else {
            let base = {
                description: '', 
                arrange: '',
                docDate: moment(),
                resourceCode :'',
                estimationItemTypeId:'',
                specsSectionId:'',
                unit:'',
                unitPrice:'', 
                projectId: projectId
            };
            this.setState({ document: base });
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
        }
    }; 

    fillDropDowns(isEdit) { 
        //maxArrange
        if (isEdit === false) {

            let original_document = { ...this.state.document };
            let updated_document = {};
         
            updated_document = Object.assign(original_document, updated_document);

            let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId+"&companyId=undefined&contactId=undefined";
            
            dataservice.GetNextArrangeMainDocument(url).then(res => {
                updated_document.arrange = res;
                updated_document = Object.assign(original_document, updated_document);

                this.setState({
                    document: updated_document
                });
            }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
         }

        //specsSection
        dataservice.GetDataList("GetaccountsDefaultListForList?listType=specsSection", 'title', 'id').then(result => {
            if (isEdit) { 
                this.setState({
                    selectedspecsSection: { label: this.props.document.specsSectionName, value: this.props.document.specsSectionId } 
                }); 
            }
            this.setState({
                specsSections: [...result]
            });
        });
 
        //estimationitemtype
        dataservice.GetDataList("GetaccountsDefaultListForList?listType=estimationitemtype", 'title', 'id').then(result => {
           
            if (isEdit) { 
                this.setState({
                    selecteditemType: { label: this.props.document.estimationItemTypeName, value: this.props.document.estimationItemTypeId}
                }); 
            }

            this.setState({
                itemsType: [...result]
            });
        }); 
    }
 
    handleChange(e, field) {
        
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document
        });
    }

    handleChangeDate(e, field) {
      
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document
        });
    }

    handleChangeDropDown(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource) {

        if (event == null) return;
        
        let original_document = { ...this.state.document };
        
        let updated_document = {};
        
        updated_document[field] = event.value;
        
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document,
            [selectedValue]: event
        }); 
    }

    editBase(event) {

        this.setState({
            isLoading: true
        });

        let saveDocument = { ...this.state.document };

        saveDocument.docDate = moment(saveDocument.docDate).format('MM/DD/YYYY');
 
        saveDocument.projectId = this.state.projectId;

        dataservice.addObject('EditEstimationBase', this.state.document).then(result => {
            this.setState({
                isLoading: true
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);

            this.props.history.push({
                pathname: "/base/" + this.state.projectId
            });
        });
    }

    saveBase(event) {
        
        let saveDocument = { ...this.state.document };

        saveDocument.projectId = this.state.projectId;

        saveDocument.docDate = moment(saveDocument.docDate).format('MM/DD/YYYY');

        dataservice.addObject('AddEstimationBase', saveDocument).then(result => {
            this.setState({
                docId: result.id
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    }

    saveAndExit(event) { 

        this.props.history.push("/base/" + this.state.projectId);
    }

    showBtnsSaving() {
        let btn = null;

        if (this.state.docId === 0 && this.state.isViewMode === false) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0 && this.props.changeStatus === false) {
            btn = <button className="primaryBtn-1 btn mediumBtn" type="submit" >{Resources.saveAndExit[currentLanguage]}</button>
        }
        return btn;
    } 

    handleShowAction = (item) => { 
        if (item.title == "sendToWorkFlow") { this.props.actions.SendingWorkFlow(true); }
        console.log(item);
        if (item.value != "0") { this.props.actions.showOptionPanel(false); 

            this.setState({
                currentComponent: item.value,
                currentTitle: item.title,
                showModal: true
            })

            this.simpleDialog.show()
        }
    }

    render() {
        let actions = [
            { title: "distributionList", value: <Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["distributionList"][currentLanguage] },
            { title: "sendToWorkFlow", value: <SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["sendToWorkFlow"][currentLanguage] },
            { title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={true} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage] }, 
            { title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={false} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]}
        ];
        return (
            <div className="mainContainer"> 
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>
                    <div className="submittalHead">
                        <h2 className="zero">{Resources.estimationBaseLog[currentLanguage]}
                            <span>{projectName.replace(/_/gi, ' ')} · {Resources['projectEstimation'][currentLanguage]}</span>
                        </h2>
                        <div className="SubmittalHeadClose">
                            <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                        <g id="Group-2">
                                            <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                                <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                                                    <g id="Group">
                                                        <circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
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
                    <div className="doc-container">
                        {
                            this.props.changeStatus == true ?
                                <header className="main__header">
                                    <div className="main__header--div">
                                        <h2 className="zero">
                                            {Resources.goEdit[currentLanguage]}
                                        </h2>
                                        <p className="doc-infohead"><span> {this.state.document.refDoc}</span> - <span> {this.state.document.arrange}</span> - <span>{moment(this.state.document.docDate).format('DD/MM/YYYY')}</span></p>
                                    </div>
                                </header>
                                : null
                        }
                        <div className="step-content">
                            <div id="step1" className="step-content-body">
                                <div className="subiTabsContent">
                                    <div className="document-fields">
                                        <Formik initialValues={{ ...this.state.document }} validationSchema={validationSchema}
                                                enableReinitialize={this.props.changeStatus}
                                                onSubmit={(values) => {
                                                    if (this.props.showModal) { return; }
                                  
                                                    if (this.props.changeStatus === true && this.state.docId > 0) {
                                                        this.editBase();
                                                    } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                                        this.saveBase();
                                                    } else {
                                                        this.saveAndExit();
                                                    }
                                            }}>
                                            {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                <Form id="letterForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                                    <div className="proForm first-proform">
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.description[currentLanguage]}</label>
                                                            <div className={"inputDev ui input" + (errors.description && touched.description ? (" has-error") : !errors.description && touched.description ? (" has-success") : " ")} >
                                                                <input name='description' className="form-control fsadfsadsa" id="description"
                                                                       placeholder={Resources.description[currentLanguage]} autoComplete='off'
                                                                       value={this.state.document.description}
                                                                       onBlur={(e) => { handleBlur(e); handleChange(e);}}
                                                                       onChange={(e) => this.handleChange(e, 'description')} />
                                                                {touched.description ? (<em className="pError">{errors.description}</em>) : null}
                                                            </div>
                                                        </div> 
                                                    </div> 
                                                    <div className="proForm datepickerContainer"> 
                                                    <div className="linebylineInput valid-input">
                                                        <div className="inputDev ui input input-group date NormalInputDate">
                                                        <div className="customDatepicker fillter-status fillter-item-c ">
                                                            <div className="proForm datepickerContainer">
                                                            <label className="control-label">
                                                                {Resources.docDate[currentLanguage]}
                                                            </label>
                                                            <div className="linebylineInput">
                                                                <div className="inputDev ui input input-group date NormalInputDate">
                                                                <ModernDatepicker date={this.state.document.docDate} format={'DD/MM/YYYY'}  showBorder
                                                                                  onChange={e => this.handleChangeDate(e, 'docDate')} placeholder={'Select a date'} />
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    </div>  
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                                            <div className={"ui input inputDev" + (errors.arrange && touched.arrange ? (" has-error") : "ui input inputDev")} >
                                                                <input type="text" className="form-control" id="arrange" value={this.state.document.arrange} name="arrange"
                                                                       placeholder={Resources.arrange[currentLanguage]}
                                                                       onBlur={(e) => { handleChange(e); handleBlur(e); }}
                                                                       onChange={(e) => this.handleChange(e, 'arrange')} />
                                                                {touched.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.resourceCode[currentLanguage]}</label>
                                                            <div className={"ui input inputDev" + (errors.resourceCode && touched.resourceCode ? (" has-error") : "ui input inputDev")} >
                                                                <input type="text" className="form-control" id="resourceCode" value={this.state.document.resourceCode}
                                                                       name="resourceCode" placeholder={Resources.resourceCode[currentLanguage]}
                                                                       onBlur={(e) => { handleChange(e); handleBlur(e); }}
                                                                       onChange={(e) => this.handleChange(e, 'resourceCode')} />
                                                                {touched.resourceCode ? (<em className="pError">{errors.resourceCode}</em>) : null}
                                                            </div>
                                                        </div> 
                                                        <div className="linebylineInput valid-input">
                                                             <Dropdown title="itemType" data={this.state.itemsType} selectedValue={this.state.selecteditemType}
                                                                       handleChange={event => this.handleChangeDropDown(event, 'estimationItemTypeId', false, '', '', '', 'selecteditemType')}
                                                                       onChange={setFieldValue} onBlur={setFieldTouched} error={errors.estimationItemTypeId}
                                                                       touched={touched.estimationItemTypeId}  name="estimationItemTypeId" id="estimationItemTypeId" />
                                                        </div> 
                                                        <div className="linebylineInput valid-input">
                                                             <Dropdown title="specsSection"  data={this.state.specsSections} selectedValue={this.state.selectedspecsSection}
                                                                       handleChange={event => this.handleChangeDropDown(event, 'specsSectionId', false, '', '', '', 'selectedspecsSection')}
                                                                       onChange={setFieldValue} onBlur={setFieldTouched} error={errors.specsSectionId}
                                                                       touched={touched.specsSectionId}  name="specsSectionId" id="specsSectionId" />
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.unit[currentLanguage]}</label>
                                                            <div className={"ui input inputDev" + (errors.unit && touched.unit ? (" has-error") : "ui input inputDev")} >
                                                                <input type="text" className="form-control" id="unit" value={this.state.document.unit}
                                                                       name="unit" placeholder={Resources.unit[currentLanguage]}
                                                                       onBlur={(e) => { handleChange(e); handleBlur(e)}}
                                                                       onChange={(e) => this.handleChange(e, 'unit')} />
                                                                {touched.unit ? (<em className="pError">{errors.unit}</em>) : null}
                                                            </div>
                                                        </div> 
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.unitPrice[currentLanguage]}</label>
                                                            <div className={"ui input inputDev" + (errors.unitPrice && touched.unitPrice ? (" has-error") : "ui input inputDev")} >
                                                                <input type="text" className="form-control" id="unitPrice" value={this.state.document.unitPrice}
                                                                       name="unitPrice" placeholder={Resources.unitPrice[currentLanguage]}
                                                                       onBlur={(e) => { handleChange(e); handleBlur(e); }}
                                                                       onChange={(e) => this.handleChange(e, 'unitPrice')} /> 
                                                                {touched.unitPrice ? (<em className="pError">{errors.unitPrice}</em>) : null}
                                                            </div>
                                                        </div>   
                                                    </div>
                                                    <div className="slider-Btns">
                                                        { this.state.isLoading === false ?
                                                            this.showBtnsSaving():
                                                        (<button className="primaryBtn-1 btn disabled">
                                                            <div className="spinner">
                                                                <div className="bounce1" />
                                                                <div className="bounce2" />
                                                                <div className="bounce3" />
                                                            </div>
                                                          </button>
                                                        )}
                                                    </div>
                                                    {
                                                        this.props.changeStatus === true ?
                                                            <div className="approveDocument">
                                                                <div className="approveDocumentBTNS">
                                                                    <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"}>{Resources.save[currentLanguage]}</button>
                                                                    {this.state.isApproveMode === true ?
                                                                        <div >
                                                                            <button className="primaryBtn-1 btn " type="button" onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                                                                            <button className="primaryBtn-2 btn middle__btn" type="button" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>
                                                                        </div>
                                                                        : null
                                                                    }
                                                                    <button className="primaryBtn-2 btn middle__btn" type="button" onClick={(e) => this.handleShowAction(actions[1])}>{Resources.sendToWorkFlow[currentLanguage]}</button>
                                                                    <button className="primaryBtn-2 btn" type="button" onClick={(e) => this.handleShowAction(actions[0])}>{Resources.distributionList[currentLanguage]}</button>
                                                                    <span className="border"></span>
                                                                    <div className="document__action--menu">
                                                                        <OptionContainer permission={this.state.permission} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            : null
                                                    }
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div>  
                                            {this.props.changeStatus === true ? <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} /> : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>
                <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                        {this.state.currentComponent}
                    </SkyLight>
                </div>
            </div> 
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        document: state.communication.document,
        isLoading: state.communication.isLoading,
        changeStatus: state.communication.changeStatus, 
        hasWorkflow: state.communication.hasWorkflow,
        projectId: state.communication.projectId,
        showModal:  state.communication.showModal 
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(BaseAddEdit))