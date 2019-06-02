import React, { Component } from "react"; 
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup'; 
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous"; 
import Resources from "../../resources.json";
import ModernDatepicker from 'react-modern-datepicker';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import moment from "moment"; 
import * as communicationActions from '../../store/actions/communication'; 
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import { toast } from "react-toastify";
import ReactTable from "react-table";
import "react-table/react-table.css";
 

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    policyType: Yup.string().required(Resources['policyType'][currentLanguage]).max(450, Resources['maxLength'][currentLanguage]),
    companyId: Yup.string().required(Resources['pleaseSelectYourCompany'][currentLanguage]).nullable(true) 
});
   
let originalData = [];

class ContractInsurance extends Component {

    constructor(props) {

        super(props);
  
        this.state = {
            isLoading:false, 
            Api:this.props.Api,
            ApiGet:this.props.ApiGet,
            ApiDelete :this.props.ApiDelete,
            contractId: this.props.contractId, 
            projectId: this.props.projectId,  
            document:   {},
            companies: [], 
            insuranceData:[],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            showDeleteModal:false,
            currentId:0
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
      
           let typeColumn =this.props.type;

            const objDocument = {
                //field
                id: 0, 
                companyId: null,  
                [typeColumn] :this.state.contractId,
                arrange: "1",
                policyType:"",
                policyLimit:"",
                effectiveDate:moment(),
                expirationDate:moment() 
            };

            this.setState({
                document: objDocument
            });

            this.fillDropDowns(false);

        dataservice.GetDataGrid(this.state.ApiGet + this.state.contractId).then(data => {
           
          let maxArrange =Math.max(...data.map(s => s.arrange));

          let originalData = this.state.document;

          originalData.arrange = data.length > 0 ? (maxArrange + 1) : 1;
 
            this.setState({
                insuranceData: data,
                document :originalData
            });
        }).catch(ex => {
            this.setState({insuranceData:[]});
            toast.error(Resources["failError"][currentLanguage])});

        this.props.actions.documentForAdding();
    }
 
    fillDropDowns(isEdit) {
        //from Companies 

        dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" +this.state.projectId, "companyName", "companyId").then(result => {
 
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
    } 
 
    saveInsurance() {

      this.setState({isLoading:true });
        let saveDocument = {
            ...this.state.document  
        };

        saveDocument.effectiveDate = moment(saveDocument.effectiveDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.expirationDate = moment(saveDocument.expirationDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        dataservice.addObject(this.state.Api, saveDocument).then(result => {
  
          let typeColumn =this.props.type;

            const objDocument = {
                //field
                id: 0, 
                companyId: null,  
                [typeColumn]:this.state.contractId,
                arrange: this.state.document.arrange + 1,
                policyType:"",
                policyLimit:"",
                effectiveDate:moment(),
                expirationDate:moment() 
            };

            this.setState({
                insuranceData : result != null ? result : [],
                document: objDocument,
                isLoading:false, 
                selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    }
 
    ConfirmDelete = (id) => {
        this.setState({ showDeleteModal: true ,currentId :id});  
    };
   
  clickHandlerCancelMain = () => {
    this.setState({ showDeleteModal: false });
    };

  
  clickHandlerContinueMain()
  { 
     this.setState({
      isLoading : true,
      showDeleteModal:false
    });

    let id= this.state.currentId;
 
    dataservice.addObject(this.state.ApiDelete + id ).then(result => {
 
      let originalData = this.state.insuranceData;

      let getIndex = originalData.findIndex(x => x.id === id);

      originalData.splice(getIndex, 1);
 
      this.setState({  
        isLoading: false,
        insuranceData:originalData,
        selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" }
      });
      toast.success(Resources["operationSuccess"][currentLanguage]);
    }).catch(() => {
      toast.error(Resources["operationCanceled"][currentLanguage]);
      this.setState({ isLoading: false });
    });
  }  

    render() { 
 
        const columns  = [
            {
              Header: Resources["numberAbb"][currentLanguage],
              accessor: "arrange",
              sortabel: true,
              width: 80
            }
            ,{
              Header: Resources["delete"][currentLanguage],
              accessor: "id",
              Cell: ({ row }) => {
                return (
                  <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.ConfirmDelete(row.id)}>
                    <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
                  </div>
                );
              },
              width: 70
            }, 
            {
              Header: Resources["CompanyName"][currentLanguage],
              accessor: "companyName",
              width: 200,
              sortabel: true
            },
            {
              Header: Resources["effectiveDate"][currentLanguage],
              accessor: "effectiveDate",
              width: 200,
              sortabel: true,
              Cell: row => (
                <span>
                  <span>{moment(row.value).format("DD/MM/YYYY")}</span>
                </span>
              )
            },
            {
              Header: Resources["expirationDate"][currentLanguage],
              accessor: "expirationDate",
              width: 200,
              sortabel: true,
              Cell: row => (
                <span>
                  <span>{moment(row.value).format("DD/MM/YYYY")}</span>
                </span>
              )
            },
            {
              Header: Resources["policyType"][currentLanguage],
              accessor: "policyType",
              width: 200,
              sortabel: true
            },
            {
              Header: Resources["policyLimit"][currentLanguage],
              accessor: "policyLimit",
              width: 200,
              sortabel: true
            } 
          ];
      
        return ( 
        <div className={this.props.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>
          <div className="doc-pre-cycle letterFullWidth">
            <header>
              <h2 className="zero">{Resources['addInsurance'][currentLanguage]}</h2>
            </header>
            </div>
            <div className="doc-container"> 
               <div className="step-content">
               <div id="step1" className="step-content-body">
               <div className="subiTabsContent">
               <div className="document-fields">
               <Formik initialValues={{  ...this.state.document }}
                                enableReinitialize={true}
                                validationSchema={validationSchema}
                                onSubmit={values => {
                                if (this.state.contractId > 0 ) {
                                    this.saveInsurance();
                                 } 
                                }}>
                {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched, values }) => (
                  <Form id="ContractForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                  <div className="proForm datepickerContainer"> 
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
                        <label className="control-label">
                          {Resources["policyType"][currentLanguage]}
                        </label>
                        <div className={"inputDev ui input " +(errors.policyType? "has-error": !errors.policyType && touched.policyType? " has-success": " ")}>
                          <input name="policyType" className="form-control" id="policyType" placeholder={Resources["policyType"][currentLanguage]}
                                 autoComplete="off" onBlur={handleBlur}  
                                 value={this.state.document.policyType}
                                 onBlur={e => { handleBlur(e); handleChange(e); }}
                                 onChange={e => { this.handleChange(e,"policyType"); }} />
                          {errors.policyType ? (<em className="pError">{errors.policyType}</em>) : null}
                        </div>
                      </div>

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
                          {Resources.policyLimit[currentLanguage]}
                        </label>
                        <div className="ui input inputDev">
                          <input type="text" className="form-control" id="arrange"  
                                 value={this.state.document.policyLimit}
                                 onChange={e => { this.handleChange(e,"policyLimit"); }} 
                                 name="policyLimit" placeholder={Resources.policyLimit[currentLanguage]}/>
                        </div>
                      </div> 
                      <div className="linebylineInput valid-input">
                        <div className="inputDev ui input input-group date NormalInputDate">
                            <div className="customDatepicker fillter-status fillter-item-c ">
                            <div className="proForm datepickerContainer">
                                <label className="control-label">
                                {Resources.effectiveDate[currentLanguage]}
                                </label>
                                <div className="linebylineInput">
                                <div className="inputDev ui input input-group date NormalInputDate">
                                    <ModernDatepicker date={this.state.document.effectiveDate} format={"DD/MM/YYYY"} showBorder
                                    onChange={e => this.handleChangeDate(e, "effectiveDate")} placeholder={"Select a date"} />
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>  
                      <div className="linebylineInput valid-input">
                        <div className="inputDev ui input input-group date NormalInputDate">
                            <div className="customDatepicker fillter-status fillter-item-c ">
                            <div className="proForm datepickerContainer">
                                <label className="control-label">
                                {Resources.expirationDate[currentLanguage]}
                                </label>
                                <div className="linebylineInput">
                                <div className="inputDev ui input input-group date NormalInputDate">
                                    <ModernDatepicker date={this.state.document.expirationDate} format={"DD/MM/YYYY"} showBorder
                                    onChange={e => this.handleChangeDate(e, "expirationDate")} placeholder={"Select a date"} />
                                </div>
                                </div>
                            </div>
                          </div>
                         </div>
                        </div>   
                    </div>
                    <div className="slider-Btns">
                        { 
                            (this.state.isLoading === false ?
                            (<button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? 'disNone' : '')} type="submit" >
                                {Resources["goAdd"][currentLanguage]}
                            </button>
                            ) : (
                                <button className="primaryBtn-1 btn disabled">
                                <div className="spinner">
                                    <div className="bounce1" />
                                    <div className="bounce2" />
                                    <div className="bounce3" />
                                </div>
                                </button>
                            ))}
                    </div>
                  </Form>
                )}
              </Formik> 
            </div> 
            <header className="main__header">
                <div className="main__header--div">
                <h2 className="zero">
                    {Resources["insuranceList"][currentLanguage]}
                </h2>
                </div>
            </header>
           <ReactTable data={this.state.insuranceData}
                       columns={columns} filterable
                       defaultPageSize={5}
                       noDataText={Resources["noData"][currentLanguage]}
                       className="-striped -highlight" />
          </div>

          {this.state.showDeleteModal == true ? (
            <ConfirmationModal title={Resources["smartDeleteMessage"][currentLanguage].content} closed={this.onCloseModal}
                               showDeleteModal={this.state.showDeleteModal} clickHandlerCancel={this.clickHandlerCancelMain}
                               buttonName="delete" clickHandlerContinue={this.clickHandlerContinueMain.bind(this)}/>
          ) : null} 
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ContractInsurance))