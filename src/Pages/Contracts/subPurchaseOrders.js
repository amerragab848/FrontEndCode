import React, { Component } from "react"; 
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup'; 
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous"; 
import Resources from "../../resources.json";
import ModernDatepicker from 'react-modern-datepicker';
import { withRouter } from "react-router-dom";
import RichTextEditor from 'react-rte';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import moment from "moment"; 
import * as communicationActions from '../../store/actions/communication'; 
import { toast } from "react-toastify";
import ReactTable from "react-table";
import "react-table/react-table.css";

import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]).max(450, Resources['maxLength'][currentLanguage]),
    refDoc: Yup.string().required(Resources['selectRefNo'][currentLanguage]),
    companyId: Yup.string().required(Resources['pleaseSelectYourCompany'][currentLanguage]).nullable(true),
    toCompanyId: Yup.string().required(Resources['toCompany'][currentLanguage]).nullable(true),
    toContactId: Yup.string().required(Resources['ToContact'][currentLanguage]).nullable(true) 
});
   
let originalData = [];

class SubPurchaseOrders extends Component {

    constructor(props) {

        super(props);
  
        this.state = {
            isLoading:false,
            currentTitle: "sendToWorkFlow", 
            contractId: this.props.contractId, 
            projectId: this.props.projectId,  
            document:   {},
            companies: [],
            contacts: [], 
            purchaseOrderData:[],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedContract: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" }, 
            selectedContractWithContact: { label: Resources.toContactRequired[currentLanguage], value: "0" }
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
    };

    componentWillUnmount() { 
        this.props.actions.clearCashDocument();
    }
  
    componentWillMount() {
      
            const objDocument = {
                //field
                id: 0,
                projectId:this.state.projectId,
                arrange: "1",
                companyId: null,
                toCompanyId: null, 
                toContactId: null,
                subject: "",
                completionDate: moment(),
                docDate: moment(),
                status: "true",
                refDoc: "",  
                parentId:this.state.contractId,
                parentType:"Contract"
            };

            this.setState({
                document: objDocument
            });

            this.fillDropDowns(false);


        dataservice.GetDataGrid("GetSubPOsByContractId?contractId=" + this.state.contractId).then(data => {
            this.setState({
                purchaseOrderData: data
            });
        }).catch(ex => {
            this.setState({purchaseOrderData:[]});
            toast.error(Resources["failError"][currentLanguage])});

        this.props.actions.documentForAdding();
    }
 
    fillDropDowns(isEdit) {
        //from Companies
        dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" +this.state.projectId, "companyName", "companyId").then(result => {

            if (isEdit) {

                let companyId = this.props.document.fromCompanyId;

                if (companyId) {
                    this.setState({
                        selectedFromCompany: { label: this.props.document.fromCompanyName, value: companyId }
                    });
                }

                let toCompanyId = this.props.document.toCompanyId;

                if (toCompanyId) {

                    this.setState({
                        selectedToCompany: { label: this.props.document.toCompanyName, value: toCompanyId }
                    });
                }
            }
            this.setState({
                companies: [...result]
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
 
        if (isSubscrib) {
            let action = url + event.value
            dataservice.GetDataList(action, 'contactName', 'id').then(result => {
                this.setState({
                    [targetState]: result
                });
            });
        }
    } 
 
    savePO() {

        let saveDocument = {
            ...this.state.document,
            isLoading:true 
        };

        saveDocument.docDate = moment(saveDocument.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.completionDate = moment(saveDocument.completionDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        dataservice.addObject('AddContractsPurchaseOrders', saveDocument).then(result => {

            originalData = this.state.purchaseOrderData;
            
            originalData.push(result);

            const objDocument = {
              //field
              id: 0,
              projectId:this.state.projectId,
              arrange: "1",
              companyId: null,
              toCompanyId: null, 
              toContactId: null,
              subject: "",
              completionDate: moment(),
              docDate: moment(),
              status: "true",
              refDoc: "",  
              parentId:this.state.contractId,
              parentType:"Contract"
          };

            this.setState({
                purchaseOrderData : originalData,
                document: objDocument,
                selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
                selectedContract: { label: Resources.toContactRequired[currentLanguage], value: "0" } ,
                selectedContractWithContact: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" }, 
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    }
 
    render() { 
 
    const columns  = [
        {
          Header: Resources["numberAbb"][currentLanguage],
          accessor: "arrange",
          sortabel: true,
          width: 80
        }, 
        {
          Header: Resources["subject"][currentLanguage],
          accessor: "subject",
          width: 200,
          sortabel: true
        },
        {
          Header: Resources["CompanyName"][currentLanguage],
          accessor: "companyName",
          width: 200,
          sortabel: true 
        },
        {
          Header: Resources["contractTo"][currentLanguage],
          accessor: "toCompanyName",
          width: 200,
          sortabel: true 
        },
        {
          Header: Resources["attention"][currentLanguage],
          accessor: "toContactName",
          width: 200,
          sortabel: true
        },
        {
          Header: Resources["docDate"][currentLanguage],
          accessor: "docDate",
          width: 200,
          sortabel: true,
          Cell: row => (
            <span>
              <span>{moment(row.value).format("DD/MM/YYYY")}</span>
            </span>
          )
        },
        {
          Header: Resources["completionDate"][currentLanguage],
          accessor: "completionDate",
          width: 200,
          sortabel: true,
          Cell: row => (
            <span>
              <span>{moment(row.value).format("DD/MM/YYYY")}</span>
            </span>
          )
        },
        {
          Header: Resources["actualExecuted"][currentLanguage],
          accessor: "actualExceuted",
          width: 200,
          sortabel: true
        },
        {
          Header: Resources["docClosedate"][currentLanguage],
          accessor: "docCloseDate",
          width: 200,
          sortabel: true,
          Cell: row => (
            <span>
              <span>{moment(row.value).format("DD/MM/YYYY")}</span>
            </span>
          )
        }
      ];
 
        return ( 
        <div className={this.props.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>
        <div className="doc-pre-cycle letterFullWidth">
          <header>
            <h2 className="zero">{Resources['subPOs'][currentLanguage]}</h2>
          </header>
        </div>
            <div className="doc-container"> 
               <div className="step-content">
               <div id="step1" className="step-content-body">
               <div className="subiTabsContent">
               <div className="document-fields">
               <Formik initialValues={{  ...this.state.document }}
                                validationSchema={validationSchema}
                                onSubmit={values => {
                                if (this.state.contractId > 0 ) {
                                    this.savePO();
                                 } 
                                }}>
                {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched, values }) => (
                  <Form id="ContractForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                    <div className="proForm first-proform">
                      <div className="linebylineInput valid-input">
                        <label className="control-label">
                          {Resources["subject"][currentLanguage]}
                        </label>
                        <div className={"inputDev ui input " +(errors.subject? "has-error": !errors.subject && touched.subject? " has-success": " ")}>
                          <input name="subject" className="form-control" id="subject" placeholder={Resources["subject"][currentLanguage]}
                                 autoComplete="off" onBlur={handleBlur}  
                                 value={this.state.document.subject}
                                 onBlur={e => { handleBlur(e); handleChange(e); }}
                                 onChange={e => { this.handleChange(e,"subject"); }} />
                          {errors.subject ? (<em className="pError">{errors.subject}</em>) : null}  
                        </div>
                      </div>
                         <div className="linebylineInput valid-input">
                            <label className="control-label">
                                {Resources.status[currentLanguage]}
                            </label>
                                <div className="ui checkbox radio radioBoxBlue">
                                  <input type="radio" name="status" defaultChecked={this.state.document.status === false ? null : "checked"}
                                    value="true" onChange={e => this.handleChange(e, "status")} />
                                  <label>
                                    {Resources.oppened[currentLanguage]}
                                  </label>
                                </div>
                                <div className="ui checkbox radio radioBoxBlue">
                                  <input type="radio" name="status" defaultChecked={this.state.document.status === false ? "checked" : null}
                                    value="false"
                                    onChange={e => this.handleChange(e, "status")} />
                                  <label>
                                    {Resources.closed[currentLanguage]}
                                  </label>
                                </div>
                              </div>
                       </div>
               
                      <div className="linebylineInput valid-input">
                        <div className="inputDev ui input input-group date NormalInputDate">
                            <div className="customDatepicker fillter-status fillter-item-c ">
                            <div className="proForm datepickerContainer">
                                <label className="control-label">
                                {Resources.docDate[currentLanguage]}
                                </label>
                                <div className="linebylineInput">
                                <div className="inputDev ui input input-group date NormalInputDate">
                                    <ModernDatepicker date={this.state.document.docDate} format={"DD/MM/YYYY"} showBorder
                                    onChange={e => this.handleChangeDate(e, "docDate")} placeholder={"Select a date"} />
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>  
                    <div className="proForm datepickerContainer">
                      <div className="linebylineInput valid-input">
                        <label className="control-label">
                          {Resources.arrange[currentLanguage]}
                        </label>
                        <div className="ui input inputDev">
                          <input type="text" className="form-control" id="arrange" readOnly
                                 value={this.state.document.arrange}
                                 onChange={e => { this.handleChange(e,"arrange"); }} 
                                 name="arrange" placeholder={Resources.arrange[currentLanguage]}/>
                        </div>
                      </div>

                      <div className="linebylineInput valid-input">
                        <label className="control-label">
                          {Resources["refDoc"][currentLanguage]}
                        </label>
                        <div className={"inputDev ui input " +(errors.refDoc? "has-error": !errors.refDoc && touched.refDoc? " has-success": " ")}>
                          <input name="refDoc" className="form-control" id="refDoc" placeholder={Resources["refDoc"][currentLanguage]}
                                 autoComplete="off"  onBlur={handleBlur}  
                                 onBlur={e => { handleBlur(e); handleChange(e); }}
                                 value={this.state.document.refDoc} 
                                 onChange={e => { this.handleChange(e,"refDoc"); }} />
                          {errors.refDoc ? ( <em className="pError">{errors.refDoc}</em> ) : null} 
                        </div>
                      </div> 
                      <div className="linebylineInput valid-input">
                        <div className="inputDev ui input input-group date NormalInputDate">
                            <div className="customDatepicker fillter-status fillter-item-c ">
                            <div className="proForm datepickerContainer">
                                <label className="control-label">
                                {Resources.completionDate[currentLanguage]}
                                </label>
                                <div className="linebylineInput">
                                <div className="inputDev ui input input-group date NormalInputDate">
                                    <ModernDatepicker date={this.state.document.completionDate} format={"DD/MM/YYYY"} showBorder
                                    onChange={e => this.handleChangeDate(e, "completionDate")} placeholder={"Select a date"} />
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div> 
                      <div className="linebylineInput valid-input"> 
                        <Dropdown title="CompanyName"
                            data={this.state.companies}
                            selectedValue={this.state.selectedFromCompany}
                            handleChange={event => this.handleChangeDropDown(event, "companyId", false, "", "", "", "selectedFromCompany")}
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            error={errors.companyId}
                            touched={touched.companyId}
                            name="companyId" id="companyId" />
                      </div>

                      <div className="linebylineInput valid-input">
                        <Dropdown title="toCompany" data={this.state.companies} selectedValue={this.state.selectedContract}
                                  handleChange={event => { this.setState({ selectedContract: event }); }}
                                  onChange={setFieldValue} onBlur={setFieldTouched} error={errors.toCompanyId}
                                  handleChange={event => this.handleChangeDropDown(event, "toCompanyId", true, "contacts", "GetContactsByCompanyId?companyId=", "", "selectedContract")}
                                  touched={touched.toCompanyId} name="toCompanyId" index="toCompanyId" />
                      </div>

                      <div className="linebylineInput valid-input">
                      <Dropdown title="ToContact"
                            data={this.state.contacts}
                            selectedValue={this.state.selectedContractWithContact}
                            handleChange={event => this.handleChangeDropDown(event, "toContactId", false, "", "", "", "selectedContractWithContact")}
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            error={errors.toContactId}
                            touched={touched.toContactId}
                            name="toContactId" id="toContactId" /> 
                      </div>
 
                      <div className="linebylineInput valid-input">
                        <label className="control-label">
                          {Resources.advancePaymentPercent[currentLanguage]}
                        </label>
                        <div className="ui input inputDev">
                          <input type="text" className="form-control" id="advancePaymentPercent"
                                onChange={e => { this.handleChange(e,"advancePaymentPercent"); }} onBlur={handleBlur}
                                 defaultValue={this.state.document.advancePaymentPercent}
                                 name="advancePaymentPercent" placeholder={ Resources.advancePaymentPercent[currentLanguage]}/>
                        </div>
                      </div> 
                      <div className={"slider-Btns fullWidthWrapper textLeft "}>
                        {this.state.isLoading === false ? (
                          <button className={ "primaryBtn-1 btn " + (this.props.isViewMode === true ? "disNone" : "") } type="submit" disabled={this.props.isViewMode}>
                            {Resources["save"][currentLanguage]}
                          </button>
                        ) : (
                          <button className="primaryBtn-1 btn  disabled" disabled="disabled">
                            <div className="spinner">
                              <div className="bounce1" />
                              <div className="bounce2" />
                              <div className="bounce3" />
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  </Form>
                )}
              </Formik> 
            </div> 
            <header className="main__header">
                <div className="main__header--div">
                <h2 className="zero">
                    {Resources["subPOsList"][currentLanguage]}
                </h2>
                </div>
            </header>
           <ReactTable data={this.state.purchaseOrderData}
                       columns={columns}
                       defaultPageSize={5}
                       noDataText={Resources["noData"][currentLanguage]}
                       className="-striped -highlight" />
          </div>
        </div> 
      </div>
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
        file: state.communication.file,
        files: state.communication.files,
        hasWorkflow: state.communication.hasWorkflow,
        viewModel: state.communication.viewModel
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SubPurchaseOrders))