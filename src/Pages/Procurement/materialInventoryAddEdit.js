import React, { Component,Fragment } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
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
import Distribution from '../../Componants/OptionsPanels/DistributionList';
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow';
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval';
import DatePicker from '../../Componants/OptionsPanels/DatePicker';
import { toast } from "react-toastify";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument';
import BarChartComp from "../ReportsCenter/TechnicalOffice/BarChartComp";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({ 
    description: Yup.string().required(Resources['descriptionRequired'][currentLanguage]),
    disciplineId: Yup.string().required(Resources['disciplineRequired'][currentLanguage]).nullable(true),
    specsSectionId: Yup.string().required(Resources['specsSectionSelection'][currentLanguage]).nullable(true),
    approvedQuantity: Yup.number().required(Resources["approvedQuantityRequired"][currentLanguage]),
    pendingQuantity: Yup.number().required(Resources["pendingQuantityRequired"][currentLanguage]),
    rejectedQuantity: Yup.number().required(Resources["rejectedQuantityRequired"][currentLanguage]),
    resourceCode: Yup.string().required(Resources["resourceCodeRequired"][currentLanguage]),
    unitPrice: Yup.number().required(Resources["unitPriceRequired"][currentLanguage]),
})

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;

const _ = require('lodash');

const marginObject = {
    left: 40,
    right: 40,
    top: 50,
    bottom: 50
  };
  
const colorSchema = ["#39bd3d", "#dfe2e6"];

class MaterialInventoryAddEdit extends Component {

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

        const columnsPurchased = [ 
            {
              Header: Resources["subject"][currentLanguage],
              accessor: "poSubject",
              sortabel: true,
              width: 200
            },
            {
              Header: Resources["resourceCode"][currentLanguage],
              accessor: "resourceCode",
              width: 200,
              sortabel: true
            },
            {
              Header: Resources["details"][currentLanguage],
              accessor: "description",
              width: 200,
              sortabel: true
            },
            {
              Header: Resources["originalQuantity"][currentLanguage],
              accessor: "originalQuantity",
              width: 200,
              sortabel: true
            },
            {
              Header: Resources["deliveredQuantity"][currentLanguage],
              accessor: "deliveredQuantity",
              width: 200,
              sortabel: true  
            },
            {
              Header: Resources["remainingQuantity"][currentLanguage],
              accessor: "remainingQuantity",
              width: 200,
              sortabel: true  
            },
            {
              Header: Resources["poUnitPrice"][currentLanguage],
              accessor: "poUnitPrice",
              width: 200,
              sortabel: true  
            },
            {
              Header: Resources["unitPrice"][currentLanguage],
              accessor: "unitPrice",
              width: 200,
              sortabel: true  
            },
            {
              Header: Resources["lastDeliveryDate"][currentLanguage],
              accessor: "lastDeliveryDate",
              width: 200,
              sortabel: true  
            }
          ];
      
        const columnsTransfered = [ 
            {
              Header: Resources["numberAbb"][currentLanguage],
              accessor: "arrange",
              sortabel: true,
              width: 80
            },
            {
              Header: Resources["resourceCode"][currentLanguage],
              accessor: "resourceCode",
              width: 200,
              sortabel: true
            },
            {
              Header: Resources["details"][currentLanguage],
              accessor: "description",
              width: 200,
              sortabel: true
            },
            {
              Header: Resources["approvedQuantity"][currentLanguage],
              accessor: "approvedQuantity",
              width: 200,
              sortabel: true
            },
            {
              Header: Resources["rejectedQuantity"][currentLanguage],
              accessor: "rejectedQuantity",
              width: 200,
              sortabel: true  
            },
            {
              Header: Resources["pendingQuantity"][currentLanguage],
              accessor: "pendingQuantity",
              width: 200,
              sortabel: true  
            },
            {
              Header: Resources["totalQuantity"][currentLanguage],
              accessor: "quantity",
              width: 200,
              sortabel: true  
            },
            {
              Header: Resources["unitPrice"][currentLanguage],
              accessor: "unitPrice",
              width: 200,
              sortabel: true  
            },
            {
              Header: Resources["total"][currentLanguage],
              accessor: "total",
              width: 200,
              sortabel: true  
            },
            {
              Header: Resources["fromProject"][currentLanguage],
              accessor: "projectName",
              width: 200,
              sortabel: true  
            }
          ];
      
        const columnsReleased = [ 
            {
              Header: Resources["numberAbb"][currentLanguage],
              accessor: "arrange",
              sortabel: true,
              width: 80
            },
            {
              Header: Resources["resourceCode"][currentLanguage],
              accessor: "resourceCode",
              width: 200,
              sortabel: true
            },
            {
              Header: Resources["details"][currentLanguage],
              accessor: "description",
              width: 200,
              sortabel: true
            },
            {
              Header: Resources["approvedQuantity"][currentLanguage],
              accessor: "approvedQuantity",
              width: 200,
              sortabel: true
            },
            {
              Header: Resources["totalQuantity"][currentLanguage],
              accessor: "quantity",
              width: 200,
              sortabel: true  
            },
            {
              Header: Resources["unitPrice"][currentLanguage],
              accessor: "unitPrice",
              width: 200,
              sortabel: true  
            },
            {
              Header: Resources["total"][currentLanguage],
              accessor: "total",
              width: 200,
              sortabel: true  
            },
            {
              Header: Resources["lastDeliveryDate"][currentLanguage],
              accessor: "lastDeliveryDate",
              width: 200,
              sortabel: true  
            }
          ];
      
        const columnsDelivery = [ 
            {
              Header: Resources["numberAbb"][currentLanguage],
              accessor: "arrange",
              sortabel: true,
              width: 80
            },
            {
              Header: Resources["resourceCode"][currentLanguage],
              accessor: "resourceCode",
              width: 200,
              sortabel: true
            },
            {
              Header: Resources["details"][currentLanguage],
              accessor: "description",
              width: 200,
              sortabel: true
            },
            {
              Header: Resources["approvedQuantity"][currentLanguage],
              accessor: "approvedQuantity",
              width: 200,
              sortabel: true
            },
            {
              Header: Resources["rejectedQuantity"][currentLanguage],
              accessor: "rejectedQuantity",
              width: 200,
              sortabel: true  
            },
            {
              Header: Resources["pendingQuantity"][currentLanguage],
              accessor: "pendingQuantity",
              width: 200,
              sortabel: true  
            },
            {
              Header: Resources["totalQuantity"][currentLanguage],
              accessor: "quantity",
              width: 200,
              sortabel: true  
            },
            {
              Header: Resources["unitPrice"][currentLanguage],
              accessor: "unitPrice",
              width: 200,
              sortabel: true  
            },
            {
              Header: Resources["total"][currentLanguage],
              accessor: "total",
              width: 200,
              sortabel: true  
            },
            {
              Header: Resources["lastDeliveryDate"][currentLanguage],
              accessor: "lastDeliveryDate",
              width: 200,
              sortabel: true  
            }
          ];
      
        this.state = {
            columnsPurchased:columnsPurchased,
            columnsTransfered:columnsTransfered,
            columnsReleased:columnsReleased,
            columnsDelivery:columnsDelivery,
            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode, 
            status:true,
            docId: docId,
            docTypeId: 50,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            discplines: [],
            specifications: [],
            lastHistory: [],
            activeTab: 0,
            searchItemsValue:"",
            purchasedData:[],
            purchasedDataForChart:[],
            viewPurchased:false,
            transferedData:[],
            transferedDataForChart:[],
            viewTransfered:false,
            releasedData:[],
            viewReleased:false,
            deliveryData:[],
            viewDeliver:false,
            permission: [{ name: 'sendByEmail', code: 54 }, { name: 'sendByInbox', code: 53 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 956 },
            { name: 'createTransmittal', code: 3074 }, { name: 'sendToWorkFlow', code: 707 }],
            selectedDiscpline: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedSpecifications: { label: Resources.toCompanyRequired[currentLanguage], value: "0" } 
        }

        if (!Config.IsAllow(615) && !Config.IsAllow(616) && !Config.IsAllow(634)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/materialInventory/" + projectId
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
        if (nextProps.document.id !== this.props.document.id) {
            this.setState({
                document: nextProps.document,
                hasWorkflow: nextProps.hasWorkflow,
                message: nextProps.document.message
            }); 
            this.fillDropDowns(nextProps.document.id > 0 ? true : false);
            this.checkDocumentIsView();
        }
 
        if (this.state.showModal != nextProps.showModal) {
            this.setState({ showModal: nextProps.showModal });
        }
    };

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        }); 
    }

    componentDidUpdate(prevProps) { 
        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(616))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(616)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(616)) {
                    if (this.props.document.status !== false && Config.IsAllow(616)) {
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
            let url = "GetLogsMaterialInventoriesForEdit?id=" + this.state.docId
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'materialInventory');

            dataservice.GetDataGrid("GetPurchasedMaterial?materialId="+this.state.docId).then(result => {

                let setDataChart =[];

                let stacks = ["Approved Qty","Rejected Quantity","Pending Quantity"];

                result.forEach(item => { 
                    setDataChart.push({stack : stacks[0] , name :moment(item.docDate).format("DD/MM/YYYY") ,value : item.approvedQuantity}); 
                    setDataChart.push({stack : stacks[1] , name :moment(item.docDate).format("DD/MM/YYYY") ,value : item.rejectedQuantity}); 
                    setDataChart.push({stack : stacks[2] , name :moment(item.docDate).format("DD/MM/YYYY") ,value : item.pendingQuantity}); 
                });

                this.setState({
                    purchasedData: result,
                    purchasedDataForChart:setDataChart
                })
            });

            dataservice.GetDataGrid("GetTransferedMaterial?materialId="+this.state.docId).then(result => {
                let setDataChart =[];

                let stacks = ["Approved Qty","Rejected Quantity","Pending Quantity"];

                result.forEach(item => { 
                    setDataChart.push({stack : stacks[0] , name :moment(item.docDate).format("DD/MM/YYYY") ,value : item.approvedQuantity}); 
                    setDataChart.push({stack : stacks[1] , name :moment(item.docDate).format("DD/MM/YYYY") ,value : item.rejectedQuantity}); 
                    setDataChart.push({stack : stacks[2] , name :moment(item.docDate).format("DD/MM/YYYY") ,value : item.pendingQuantity}); 
                });


                this.setState({
                    transferedData: result,
                    transferedDataForChart:setDataChart 
                })
            });
            
            dataservice.GetDataGrid("GetMaterialReleased?materialId="+this.state.docId).then(result => {
                this.setState({
                    releasedData: result
                })
            });
            
            dataservice.GetDataGrid("GetMaterialDelivered?materialId="+this.state.docId).then(result => {
                this.setState({
                    deliveryData: result
                })
            });

        } else {
            let mainDoc = { 
                id: 0,
                projectId: this.state.projectId,
                arrange: '',
                description:"",
                approvedQuantity: '',
                pendingQuantity: '',
                docDate: moment(),
                rejectedQuantity: '',
                unitPrice:"",
                itemId:"",
                disciplineId:"",
                specsSectionId :"",
                resourceCode:"",
                unit:""
            };
            this.setState({ document: mainDoc });
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
        }
    };
 
    fillDropDowns(isEdit) {
    
        dataservice.GetDataList("GetAccountsDefaultList?listType=discipline&pageNumber=0&pageSize=10000", 'title', 'id').then(result => {
            if (isEdit) {
                let disciplineId = this.props.document.disciplineId;
                let discpline = {};
                if (disciplineId) {
                    discpline = _.find(result, function (i) { return i.value == disciplineId; });

                    this.setState({
                        selectedDiscpline: discpline
                    });
                }
            }
            this.setState({
                discplines: [...result]
            });
        }); 

        dataservice.GetDataList("GetAccountsDefaultList?listType=specssection&pageNumber=0&pageSize=10000", 'title', 'id').then(result => {
            if (isEdit) {
                let specsSectionId = this.props.document.specsSectionId;
                let specsSection = {};
                if (specsSectionId) {
                    specsSection = _.find(result, function (i) { return i.value == specsSectionId; });

                    this.setState({
                        selectedSpecifications: specsSection
                    });
                }
            }
            this.setState({
                specifications: [...result]
            });
        }); 

        if(!isEdit){  
        let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=" + undefined + "&contactId=" + undefined;
             
        dataservice.GetNextArrangeMainDocument(url).then(res => {
            
            let original_document = { ...this.state.document };

            let updated_document = {};

            updated_document.arrange = res;
            
            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                document: updated_document
            });
        })
      }
     
      if(!isEdit){  
            
        dataservice.GetDataGrid("GetLogsMaterialInventoryHistories").then(result => {
             
            this.setState({
                lastHistory: result
            });
        })
      }
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

    editInventory(event) {
       
        this.setState({
            isLoading: true
        });

        let saveDocument = { ...this.state.document }; 

        dataservice.addObject('EditLogsMaterialInventories', saveDocument).then(result => {
            this.setState({
                isLoading: false
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);

            this.props.history.push({
                pathname: "/materialInventory/" + this.state.projectId
            });
        });
    }

    saveInventory(event) {
        this.setState({
            isLoading: true
        });
        let saveDocument = { ...this.state.document };

        saveDocument.docDate = moment(saveDocument.docDate).format('MM/DD/YYYY');

        dataservice.addObject('AddLogsMaterialInventories', saveDocument).then(result => {
            this.setState({
                docId: result,
                isLoading: false
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.props.history.push("/materialInventory/" + this.state.projectId);
        });
    }

    saveAndExit(event) {
        this.props.history.push({
            pathname: "/materialInventory/" + this.state.projectId
        });
    }

    showBtnsSaving() {
        let btn = null;

        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0 && this.props.changeStatus === false) {
            btn = <button className="primaryBtn-1 btn mediumBtn" type="submit" >{Resources.saveAndExit[currentLanguage]}</button>
        }
        return btn;
    }
  
    handleShowAction = (item) => {
        if (item.title == "sendToWorkFlow") {
            this.props.actions.SendingWorkFlow(true);
        }
        if (item.value != "0") {
            this.props.actions.showOptionPanel(false);
            this.setState({
                currentComponantDocument: item.value,
                currentTitle: item.title,
                showModal: true
            })
            this.simpleDialog.show() 
        }
    }

    executeBeforeModalClose = (e) => {
        this.setState({ showModal: false });
    }

    AddToItems(obj){

        this.setState({
            document : obj
        });
    }

    searchItems = (e) =>{

        let value =e.target.value;
        dataservice.GetDataGrid("GetSearchMaterialInventory?projectId="+this.state.projectId+"&search="+ value).then(result => {

            this.setState({
                searchItemsValue:value,
                lastHistory : result
            });
        });
    }

    viewCurrentStep(currentView){

        currentView === 1 ? 
        this.setState({
            viewPurchased : ! this.state.viewPurchased
        }) : 
        (currentView === 2 ? 
        this.setState({
            viewTransfered : ! this.state.viewTransfered
        }) : 
        (currentView === 3 ?
            this.setState({
            viewReleased : ! this.state.viewReleased
        }):
        this.setState({
            viewDeliver : ! this.state.viewDeliver
        })))
    }

    renderDataForView = () => {
        return (
            <div className="Eps__list"> 
            <div className={this.state.viewPurchased === true ? "epsTitle  active" : "epsTitle "} onClick={() => this.viewCurrentStep(1)}>
               <div className="listTitle">
                   <span className="dropArrow">
                   <i className="dropdown icon" />
                   </span>
                   <span className="accordionTitle">{Resources["purchased"][currentLanguage]}</span>
               </div>
               </div>

               <div className="epsContent"> 
               <div className="border_bottom">
                  <ReactTable data={this.state.purchasedData} columns={this.state.columnsPurchased} defaultPageSize={5} noDataText={Resources["noData"][currentLanguage]} className="-striped -highlight" />
                 </div>
                  {
                      this.state.purchasedDataForChart.length > 0 ?   <BarChartComp
                    stack={'normal'}
                    noClicks={this.state.noClicks}
                    type={'column'}
                    isStack={true}
                    multiSeries="no"
                    series={this.state.purchasedDataForChart}
                    xAxis={this.state.xAxis}
                    title={Resources['contractorsPerformance'][currentLanguage]} yTitle={Resources['count'][currentLanguage]} />:null
                  }
                
               </div> 
            <div className={this.state.viewTransfered === true ? "epsTitle  active" : "epsTitle "} onClick={() => this.viewCurrentStep(2)}>
               <div className="listTitle">
                   <span className="dropArrow">
                   <i className="dropdown icon" />
                   </span>
                   <span className="accordionTitle">{Resources["transfered"][currentLanguage]}</span>
               </div>   
            </div>
               <div className="epsContent">
               <div className="border_bottom">
               <ReactTable data={this.state.transferedData} columns={this.state.columnsTransfered} defaultPageSize={5} noDataText={Resources["noData"][currentLanguage]} className="-striped -highlight" />
             </div>
             {this.state.transferedDataForChart.length > 0 ?   <BarChartComp
                    stack={'normal'}
                    noClicks={this.state.noClicks}
                    type={'column'}
                    isStack={true}
                    multiSeries="no"
                    series={this.state.transferedDataForChart}
                    xAxis={this.state.xAxis}
                    title={Resources['contractorsPerformance'][currentLanguage]} yTitle={Resources['count'][currentLanguage]} />:null}
             
               </div> 
            
            <div className={this.state.viewReleased === true ? "epsTitle  active" : "epsTitle "} onClick={() => this.viewCurrentStep(3)}>
               <div className="listTitle">
                   <span className="dropArrow">
                   <i className="dropdown icon" />
                   </span>
                   <span className="accordionTitle">{Resources["released"][currentLanguage]}</span>
               </div>
            </div>
               <div className="epsContent">
               <div className="border_bottom">
               <ReactTable data={this.state.releasedData} columns={this.state.columnsReleased} defaultPageSize={5} noDataText={Resources["noData"][currentLanguage]} className="-striped -highlight" />
              </div>
               </div> 
           
            <div className={this.state.viewDeliver === true ? "epsTitle  active" : "epsTitle "} onClick={() => this.viewCurrentStep(4)}>
               <div className="listTitle">
                   <span className="dropArrow">
                   <i className="dropdown icon" />
                   </span>
                   <span className="accordionTitle">{Resources["delivery"][currentLanguage]}</span>
               </div>
            </div>
               <div className="epsContent">
               <div className="border_bottom">
                <ReactTable data={this.state.deliveryData} columns={this.state.columnsDelivery} defaultPageSize={5} noDataText={Resources["noData"][currentLanguage]} className="-striped -highlight" />
               </div>
               </div> 
            </div>
        );
    }

    render() {
 
        let actions = [
            
            { title: "distributionList", value: <Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["distributionList"][currentLanguage] },
            { title: "sendToWorkFlow", value: <SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["sendToWorkFlow"][currentLanguage] },
            { title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={true} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage] },
            { title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={false} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage] } 
        ];
    
        const columns = [ 
            {
              Header: Resources["no"][currentLanguage],
              accessor: "arrange",
              sortabel: true,
              width: 80
            },
            {
              Header: Resources["resourceCode"][currentLanguage],
              accessor: "resourceCode",
              width: 200,
              sortabel: true
            },
            {
              Header: Resources["description"][currentLanguage],
              accessor: "description",
              width: 200,
              sortabel: true
            },
            {
              Header: Resources["quantity"][currentLanguage],
              accessor: "quantity",
              width: 200,
              sortabel: true
            },
            {
              Header: Resources["unit"][currentLanguage],
              accessor: "unit",
              width: 200,
              sortabel: true  
            }
          ];
       
        return (
            <div className="mainContainer" id='mainContainer'> 
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} docTitle={Resources.materialInventory[currentLanguage]} moduleTitle={Resources['procurement'][currentLanguage]} />
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
                                        <Formik initialValues={{ ...this.state.document }}
                                            validationSchema={validationSchema}
                                            enableReinitialize={true}
                                            onSubmit={(values) => { if (this.props.showModal) { return; } 
                                                if (this.props.changeStatus === true && this.state.docId > 0) {
                                                    this.editInventory();
                                                } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                                    this.saveInventory();
                                                } else {
                                                    this.saveAndExit();
                                                }
                                            }}> 
                                            {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                <Form id="letterForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                               {this.props.changeStatus === false ?
                                                    <div className="proForm first-proform letterFullWidth radio__only">
                                                        <div className="linebylineInput valid-input">
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="status" defaultChecked={this.state.status === false ? null : 'checked'} value="true" onChange={e => this.setState({ activeTab: 0 })} />
                                                                <label>New Item</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="status" defaultChecked={this.state.status === false ? 'checked' : null}  value="false" onChange={e => this.setState({ activeTab: 1 })} />
                                                                <label>Add To Item</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : null
                                                }
                                                {
                                                    this.state.activeTab === 1 ?    
                                                    <Fragment>
                                                    <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.searchMaterailInventory[currentLanguage]}</label>
                                                            <div className={"inputDev ui input"}>
                                                                <input name='description' className="form-control fsadfsadsa" id="description"
                                                                    placeholder={Resources.description[currentLanguage]}
                                                                    autoComplete='off'
                                                                    value={this.state.searchItemsValue} 
                                                                    onChange={(e) => this.searchItems(e)} /> 
                                                            </div>
                                                        </div> 
                                                        <br/>
                                                        <br/>
                                                    <ReactTable data={this.state.lastHistory} columns={columns} defaultPageSize={5} noDataText={Resources["noData"][currentLanguage]}
                                                                className="-striped -highlight"
                                                                getTrProps={(state, rowInfo, column, instance) => {
                                                                    return { onClick: e => { this.AddToItems(rowInfo.original); } };
                                                                }} />
                                                    </Fragment> : null
                                                }
                                                    <div className="proForm first-proform">
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.description[currentLanguage]}</label>
                                                            <div className={"inputDev ui input" + (errors.description && touched.description ? (" has-error") : !errors.description && touched.description ? (" has-success") : " ")} >
                                                                <input name='description' className="form-control fsadfsadsa" id="description"
                                                                    placeholder={Resources.description[currentLanguage]}
                                                                    autoComplete='off'
                                                                    value={this.state.document.description}
                                                                    onBlur={(e) => {
                                                                        handleBlur(e)
                                                                        handleChange(e)
                                                                    }}
                                                                    onChange={(e) => this.handleChange(e, 'description')} />
                                                                {touched.description ? (<em className="pError">{errors.description}</em>) : null}
                                                            </div>
                                                        </div> 
                                                    </div> 
                                                    <div className="proForm datepickerContainer"> 
                                                        
                                                    {this.props.changeStatus === false ? <Fragment>
                                                        <div className="linebylineInput valid-input alternativeDate">
                                                            <DatePicker title='docDate'
                                                                startDate={this.state.document.docDate}
                                                                handleChange={e => this.handleChangeDate(e, 'docDate')} />
                                                        </div> 
                                                        </Fragment> : null} 
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                                            <div className="ui input inputDev"> 
                                                                <input type="text" className="form-control" id="arrange" readOnly
                                                                    value={this.state.document.arrange}
                                                                    name="arrange"
                                                                    placeholder={Resources.arrange[currentLanguage]}
                                                                    onBlur={(e) => {
                                                                        handleChange(e)
                                                                        handleBlur(e)
                                                                    }}
                                                                    onChange={(e) => this.handleChange(e, 'arrange')} />
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.unit[currentLanguage]}</label>
                                                            <div className="ui input inputDev"  >
                                                                <input type="text" className="form-control" id="unit"
                                                                    value={this.state.document.unit}
                                                                    name="unit"
                                                                    placeholder={Resources.unit[currentLanguage]}
                                                                    onChange={(e) => this.handleChange(e, 'unit')} />
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.resourceCode[currentLanguage]}</label>
                                                            <div className="shareLinks">
                                                            <div className={"inputDev ui input" + (errors.resourceCode && touched.resourceCode ? (" has-error") : !errors.resourceCode && touched.resourceCode ? (" has-success") : " ")} >
                                                                    <input type="text" className="form-control" id="resourceCode"
                                                                        onChange={(e) => this.handleChange(e, 'resourceCode')}
                                                                        value={this.state.document.resourceCode}
                                                                        name="resourceCode"
                                                                        placeholder={Resources.resourceCode[currentLanguage]} />
                                                                        {errors.resourceCode && touched.resourceCode ? (<em className="pError">{errors.resourceCode}</em>) : null}
                                                                </div> 
                                                            </div>
                                                        </div>
  
                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown title="discipline"
                                                                data={this.state.discplines}
                                                                selectedValue={this.state.selectedDiscpline}
                                                                handleChange={event => this.handleChangeDropDown(event, 'disciplineId', false, '', '', '', 'selectedDiscpline')}
                                                                index="letter-disciplineId"
                                                                onChange={setFieldValue}
                                                                onBlur={setFieldTouched}
                                                                error={errors.disciplineId}
                                                                touched={touched.disciplineId}
                                                                index="disciplineId"
                                                                name="disciplineId"
                                                                id="disciplineId" 
                                                            />
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown
                                                                title="specsSection"
                                                                data={this.state.specifications}
                                                                selectedValue={this.state.selectedSpecifications}
                                                                handleChange={event => this.handleChangeDropDown(event, 'specsSectionId', false, '', '', '', 'selectedSpecifications')}
                                                                index="letter-specsSectionId"
                                                                onChange={setFieldValue}
                                                                onBlur={setFieldTouched}
                                                                error={errors.specsSectionId}
                                                                touched={touched.specsSectionId}
                                                                index="specsSectionId"
                                                                name="specsSectionId"
                                                                id="specsSectionId"  />
                                                        </div>
                                                {
                                                    this.props.changeStatus === false ? <Fragment>
                                                    <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.unitPrice[currentLanguage]}</label>
                                                            <div className="shareLinks">
                                                            <div className={"inputDev ui input" + (errors.unitPrice && touched.unitPrice ? (" has-error") : !errors.unitPrice && touched.unitPrice ? (" has-success") : " ")} >
                                                                    <input type="text" className="form-control" id="unitPrice"
                                                                        onChange={(e) => this.handleChange(e, 'unitPrice')}
                                                                        value={this.state.document.unitPrice}
                                                                        name="unitPrice"
                                                                        placeholder={Resources.unitPrice[currentLanguage]} />
                                                                        {touched.unitPrice ? (<em className="pError">{errors.unitPrice}</em>) : null}
                                                                </div> 
                                                            </div>
                                                        </div>
                                                       
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.approvedQuantity[currentLanguage]}</label>
                                                            <div className="shareLinks">
                                                            <div className={"inputDev ui input" + (errors.approvedQuantity && touched.approvedQuantity ? (" has-error") : !errors.approvedQuantity && touched.approvedQuantity ? (" has-success") : " ")} >
                                                                    <input type="text" className="form-control" id="approvedQuantity"
                                                                        onChange={(e) => this.handleChange(e, 'approvedQuantity')}
                                                                        value={this.state.document.approvedQuantity}
                                                                        name="approvedQuantity"
                                                                        placeholder={Resources.approvedQuantity[currentLanguage]} />
                                                                {touched.approvedQuantity ? (<em className="pError">{errors.approvedQuantity}</em>) : null}
                                                                </div> 
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.pendingQuantity[currentLanguage]}</label>
                                                            <div className="shareLinks">
                                                            <div className={"inputDev ui input" + (errors.pendingQuantity && touched.pendingQuantity ? (" has-error") : !errors.pendingQuantity && touched.pendingQuantity ? (" has-success") : " ")} >
                                                                    <input type="text" className="form-control" id="pendingQuantity"
                                                                        onChange={(e) => this.handleChange(e, 'pendingQuantity')}
                                                                        value={this.state.document.pendingQuantity}
                                                                        name="pendingQuantity"
                                                                        placeholder={Resources.pendingQuantity[currentLanguage]} />
                                                                        {touched.pendingQuantity ? (<em className="pError">{errors.pendingQuantity}</em>) : null}
                                                                </div> 
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.rejectedQuantity[currentLanguage]}</label>
                                                            <div className="shareLinks">
                                                            <div className={"ui input inputDev fillter-item-c " + (errors.rejectedQuantity && touched.rejectedQuantity ? "has-error" : !errors.rejectedQuantity && touched.rejectedQuantity ? "has-success" : "")} >
                                                                    <input type="text" className="form-control" id="rejectedQuantity"
                                                                        onChange={(e) => this.handleChange(e, 'rejectedQuantity')}
                                                                        value={this.state.document.rejectedQuantity}
                                                                        name="rejectedQuantity"
                                                                        placeholder={Resources.rejectedQuantity[currentLanguage]} />
                                                                   {errors.rejectedQuantity && touched.rejectedQuantity ? (<em className="pError">{errors.rejectedQuantity}</em>) : null}
                                                                </div> 
                                                            </div>
                                                        </div> 
                                              </Fragment> : null }
                                                    </div> 
                                                    <div className="slider-Btns">
                                                        {this.state.isLoading ?
                                                            <button className="primaryBtn-1 btn disabled">
                                                                <div className="spinner">
                                                                    <div className="bounce1" />
                                                                    <div className="bounce2" />
                                                                    <div className="bounce3" />
                                                                </div>
                                                            </button> :
                                                            this.showBtnsSaving()}
                                                    </div>
                                                    {
                                                        this.props.changeStatus === true ?
                                                            <div className="approveDocument">
                                                                <div className="approveDocumentBTNS">
                                                                    {this.state.isLoading ?
                                                                        <button className="primaryBtn-1 btn disabled">
                                                                            <div className="spinner">
                                                                                <div className="bounce1" />
                                                                                <div className="bounce2" />
                                                                                <div className="bounce3" />
                                                                            </div>
                                                                        </button> :
                                                                        <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} >{Resources.save[currentLanguage]}</button>
                                                                    }

                                                                    {this.state.isApproveMode === true ?
                                                                        <div >
                                                                            <button className="primaryBtn-1 btn " type="button" onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                                                                            <button className="primaryBtn-2 btn middle__btn" type="button" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>
                                                                        </div>
                                                                        : null
                                                                    }
                                                                    <button type="button" className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[1])}>{Resources.sendToWorkFlow[currentLanguage]}</button>
                                                                    <button type="button" className="primaryBtn-2 btn" onClick={(e) => this.handleShowAction(actions[0])}>{Resources.distributionList[currentLanguage]}</button>
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
                                        {
                                            this.props.changeStatus === true ?  this.renderDataForView() :null         
                                        }
                                    </div>
                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div>  
                                            { this.props.changeStatus === true ?  <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} /> : null }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }} key="opActionsLetter">
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]} beforeClose={() => { this.executeBeforeModalClose() }}>
                        {this.state.currentComponantDocument}
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
        showModal: state.communication.showModal
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(MaterialInventoryAddEdit))