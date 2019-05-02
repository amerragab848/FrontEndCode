import React, { Component, Fragment } from "react";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import Api from "../../api";
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import moment from "moment";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Resources from "../../resources.json";
import _ from "lodash";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import DataService from "../../Dataservice";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import Distribution from "../../Componants/OptionsPanels/DistributionList";
import SendToWorkflow from "../../Componants/OptionsPanels/SendWorkFlow";
import DocumentApproval from "../../Componants/OptionsPanels/wfApproval";
import UploadAttachment from "../../Componants/OptionsPanels/UploadAttachment";
import ViewAttachment from "../../Componants/OptionsPanels/ViewAttachmments";
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import Config from "../../Services/Config.js";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import SkyLight from "react-skylight";
import * as communicationActions from "../../store/actions/communication";
import AddItemDescription from "../../Componants/OptionsPanels/addItemDescription";
import EditItemDescription from "../../Componants/OptionsPanels/editItemDescription";
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";  
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import GridSetup from "../Communication/GridSetup"; 
import SubPurchaseOrders from "../Contracts/subPurchaseOrders";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const contractInfoSchema = Yup.object().shape({
  subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]), 
  tax: Yup.number().required(Resources["tax"][currentLanguage]),
  vat: Yup.number().required(Resources["vat"][currentLanguage]),
  retainage: Yup.number().required(Resources["retainage"][currentLanguage]),
  insurance: Yup.number().required(Resources["insurance"][currentLanguage]),
  fromCompany: Yup.string().required(Resources["fromCompanyRequired"][currentLanguage]),
  contractTo: Yup.string().required(Resources["selectContract"][currentLanguage]),
  contact: Yup.string().required(Resources["selectContract"][currentLanguage])
});

const variationOrdersSchema = Yup.object().shape({
  changeOrder: Yup.string().required(Resources["selectChangeOrder"][currentLanguage])
});

const contractSchema = Yup.object().shape({
  subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]),
  tax: Yup.number()
    .typeError(Resources["onlyNumbers"][currentLanguage])
    .min(0, Resources["onlyNumbers"][currentLanguage]),
  vat: Yup.number()
    .typeError(Resources["onlyNumbers"][currentLanguage])
    .min(0, Resources["onlyNumbers"][currentLanguage]),
  retainage: Yup.number()
    .typeError(Resources["onlyNumbers"][currentLanguage])
    .min(0, Resources["onlyNumbers"][currentLanguage]),
  insurance: Yup.number()
    .typeError(Resources["onlyNumbers"][currentLanguage])
    .min(0, Resources["onlyNumbers"][currentLanguage]),
  advancedPayment: Yup.number()
    .typeError(Resources["onlyNumbers"][currentLanguage])
    .min(0, Resources["onlyNumbers"][currentLanguage]),
  advancedPaymentAmount: Yup.number()
    .typeError(Resources["onlyNumbers"][currentLanguage])
    .min(0, Resources["onlyNumbers"][currentLanguage])
});

const purchaseSchema = Yup.object().shape({
  subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]),
  advancedPaymentPercent: Yup.number()
    .typeError(Resources["onlyNumbers"][currentLanguage])
    .min(0, Resources["onlyNumbers"][currentLanguage])
});

const BoqTypeSchema = Yup.object().shape({
  boqType: Yup.string().required(Resources["boqSubType"][currentLanguage]),
  boqChild: Yup.string().required(Resources["boqSubType"][currentLanguage]),
  boqSubType: Yup.string().required(Resources["boqSubType"][currentLanguage])
});

let docId = 0;
let projectId = 0;
let projectName = "";
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;

const statusButton = ({ value, row }) => {
  let doc_view = "";
    if(row){
      if (row.readStatus === true) {
        doc_view = <div style={{textAlign:'center',margin:'4px auto',padding:'4px 10px',borderRadius:'26px',backgroundColor:'#5FD45F',width:'100%',color:'#fff', fontSize: '12px'}}>{Resources["read"][currentLanguage]}</div>
      }else{
        doc_view = <div style={{textAlign:'center',padding:'4px 10px',margin:'4px auto',borderRadius:'26px',backgroundColor:'#E74C3C',width:'100%',color:'#FFF', fontSize: '12px'}}>{Resources["unRead"][currentLanguage]}</div>
      } 
        return doc_view; 
    }
    return null;
};

let columnsGrid =[];

class ContractInfoAddEdit extends Component {
  constructor(props) {
    super(props);
    const query = new URLSearchParams(this.props.location.search);
    let index = 0;
    for (let param of query.entries()) {
      if (index == 0) {
        try {
          let obj = JSON.parse(
            CryptoJS.enc.Base64.parse(param[1]).toString(CryptoJS.enc.Utf8)
          );
          docId = obj.docId;
          projectId = obj.projectId;
          projectName = obj.projectName;
          isApproveMode = obj.isApproveMode;
          docApprovalId = obj.docApprovalId;
          arrange = obj.arrange;
        } catch {
          this.props.history.goBack();
        }
      }
      index++;
    } 
 
    this.state = {
      isCompany: Config.getPayload().uty == "company" ? true : false,
      showForm: false,
      loadingContractPurchase: false,
      AddedPurchase: false,
      loadingContract: false,
      LoadingPage: false,
      docTypeId: 9,
      selectedRow: {},
      pageSize: 50,
      CurrStep: 1,
      firstComplete: false,
      secondComplete: false,
      thirdComplete: false,
      currentTitle: "sendToWorkFlow",
      showModal: false,
      isViewMode: false,
      isApproveMode: isApproveMode,
      isView: false,
      docId: docId,
      projectId: projectId,
      docApprovalId: docApprovalId,
      arrange: arrange,
      showPopUp: false,
      btnTxt: "save",
      btnText: "add",
      activeTab: "",
      contractId: 0,
      Companies: [],
      Contracts: [],
      contacts:[],
      variationOrders:[],
      variationOrdersData:[],
      selectedFromCompany: {label: Resources.fromCompanyRequired[currentLanguage],value: "0"},
      selectedContract: {label: Resources.selectContract[currentLanguage],value: "0"},
      selectedContractWithContact: {label: Resources.selectContract[currentLanguage],value: "0"},
      selectedVariationOrders :{label : Resources.selectChangeOrder[currentLanguage],value: "0"},
      arrange:1,
      showDeleteModal:false,
      rows: [], 
      currentId:0,
      isLoading: true,
      permission: [
        { name: "sendByEmail", code: 145 },
        { name: "sendByInbox", code: 144 },
        { name: "sendTask", code: 0 },
        { name: "distributionList", code: 975 },
        { name: "createTransmittal", code: 3061 },
        { name: "sendToWorkFlow", code: 723 },
        { name: "viewAttachments", code: 3297 },
        { name: "deleteAttachments", code: 860 }
      ],
      document: {}
    };

    let editRevQuantity = ({ value, row }) => {
      if (row) {
          return <a className="editorCell"><span style={{ padding: '0 6px', margin: '5px 0', border: '1px dashed', cursor: 'pointer' }}>{row.revisedQuantity}</span></a>;
      }
      return null;
  };

   columnsGrid = [
    {
      key: "id",
      name: Resources["actions"][currentLanguage],
      width: 100,
      draggable: true,
      sortable: true,
      resizable: true,
      filterable: true,
      sortDescendingFirst: true, 
      formatter:statusButton
    },
    {
      key: "details",
      name: Resources["description"][currentLanguage],
      width: 150,
      draggable: true,
      sortable: true,
      resizable: true,
      filterable: true,
      sortDescendingFirst: true 
    },
    {
      key: "itemCode",
      name: Resources["itemCode"][currentLanguage],
      width: 150,
      draggable: true,
      sortable: true,
      resizable: true,
      filterable: true,
      sortDescendingFirst: true 
    },
    {
      key: "resourceCode",
      name: Resources["resourceCode"][currentLanguage],
      width: 150,
      draggable: true,
      sortable: true,
      resizable: true,
      filterable: true,
      sortDescendingFirst: true 
    },
    {
      key: "boqType",
      name: Resources["boqType"][currentLanguage],
      width: 150,
      draggable: true,
      sortable: true,
      resizable: true,
      filterable: true,
      sortDescendingFirst: true 
    },
    {
      key: "boqTypeChild",
      name: Resources["boqTypeChild"][currentLanguage],
      width: 150,
      draggable: true,
      sortable: true,
      resizable: true,
      filterable: true,
      sortDescendingFirst: true 
    },
    {
      key: "boqSubType",
      name: Resources["boqSubType"][currentLanguage],
      width: 150,
      draggable: true,
      sortable: true,
      resizable: true,
      filterable: true,
      sortDescendingFirst: true 
    },
    {
      key: "originalQuantity",
      name: Resources["originalQuantity"][currentLanguage],
      width: 150,
      draggable: true,
      sortable: true,
      resizable: true,
      filterable: true,
      sortDescendingFirst: true 
    },
    {
      key: "excutionQuantity",
      name: Resources["excutionQuantity"][currentLanguage],
      width: 150,
      draggable: true,
      sortable: true,
      resizable: true,
      filterable: true,
      sortDescendingFirst: true 
    },
    {
      key: "quantity",
      name: Resources["remainingQuantity"][currentLanguage],
      width: 150,
      draggable: true,
      sortable: true,
      resizable: true,
      filterable: true,
      sortDescendingFirst: true 
    },
    {
      key: "unit",
      name: Resources["unit"][currentLanguage],
      width:150,
      draggable: true,
      sortable: true,
      resizable: true,
      filterable: true,
      sortDescendingFirst: true 
    },
    {
      key: "originalUnitPrice",
      name: Resources["unitPrice"][currentLanguage],
      width: 150,
      draggable: true,
      sortable: true,
      resizable: true,
      filterable: true,
      sortDescendingFirst: true
    },
    {
      key: "total",
      name: Resources["total"][currentLanguage],
      width: 150,
      draggable: true,
      sortable: true,
      resizable: true,
      filterable: true,
      sortDescendingFirst: true 
    } 
  ];

  if(Config.IsAllow(3739)){
    columnsGrid.push( 
      {
        key: "revisedQuantity",
        name: Resources["revQuantity"][currentLanguage],
        width: 120,
        draggable: true,
        sortable: true,
        resizable: true,
        filterable: true,
        sortDescendingFirst: true,
        formatter: editRevQuantity,
        editable: true 
    });
  }

    if (!Config.IsAllow(139) && !Config.IsAllow(140) && !Config.IsAllow(142)) {
      toast.warning(Resources["missingPermissions"][currentLanguage]);
      this.props.history.push({
        pathname: "/contractInfo/" + projectId
      });
    }
  }
 

  customButton = () => {
    return (
      <button className="companies_icon" style={{ cursor: "pointer" }}>
        <i class="fa fa-folder-open" />
      </button>
    );
  };

  checkDocumentIsView() {
    if (this.props.changeStatus === true) {
      if (!Config.IsAllow(140) || this.props.document.contractId !== null) {
        this.setState({ isViewMode: true });
      } else if (this.state.isApproveMode != true && Config.IsAllow(140)) {
        if (this.props.hasWorkflow == false && Config.IsAllow(140)) {
          if (this.props.document.status != false && Config.IsAllow(140)) {
            this.setState({ isViewMode: false });
          } else {
            this.setState({ isViewMode: true });
          }
        } else {
          this.setState({ isViewMode: true });
        }
      }
    } else {
      this.setState({ isViewMode: false });
    }
  }

  componentWillUnmount() {
    this.props.actions.clearCashDocument();
    this.props.actions.documentForAdding();
  }

  fillDropDowns(isEdit) {
   
    DataService.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + projectId,"companyName","companyId").then(res => {
      if (isEdit) {

        let getCompanyId = this.state.document.companyId;
        let toCompanyId = this.state.document.toCompanyId;
      
   
          let comapny = _.find(res, function(x) {
            return x.value == getCompanyId;
          });
          
          let getToCompanyId = _.find(res, function(x) {
            return x.value == toCompanyId;
          });

          if(toCompanyId){
          this.fillSubDropDown("GetContactsByCompanyId?companyId=", "companyId", toCompanyId, "bicContactId", "selectedContractWithContact", "contacts");
          } 

          this.setState({
            selectedFromCompany: comapny != undefined ? comapny : {label: Resources.fromCompanyRequired[currentLanguage],value: "0"},
            selectedContract: getToCompanyId  != undefined ? getToCompanyId : {label: Resources.selectContract[currentLanguage],value: "0"}
          }); 
      }
      this.setState({ Companies: [...res], isLoading: false });
    }); 

    DataService.GetDataList("GetContractsChangeOrderWithoutContractId?projectId=" + projectId,"subject","id").then(res => {
      this.setState({ variationOrders: res });
    }); 
  }

  fillSubDropDown(url,param,value,subField_lbl,subField_value,subDatasource,subDatasource_2) {
    this.setState({ isLoading: true });
    let action = url +  value;
    DataService.GetDataList(action, "contactName", "id").then(result => {

        let toContactId = this.state.document.toContactId;

        let getToContactId = _.find(result, function(x) {
          return x.value == toContactId;
        });
  
        this.setState({
          selectedContractWithContact:getToContactId != undefined ? getToContactId : {label: Resources.selectContract[currentLanguage],value: "0"},
          contacts: result, 
          isLoading: false
        });
      }
    );
  }

  componentDidMount() {}

  componentWillMount() {
    if (this.state.docId > 0) {
      this.setState({ isLoading: true, LoadingPage: true });
      this.props.actions.documentForEdit("GetContractsForEdit?id=" + this.state.docId,this.state.docTypeId,"boq").then(() => {
          this.setState({
            isLoading: false,
            showForm: true,
            btnTxt: "next",
            LoadingPage: false
          });
          this.checkDocumentIsView(); 
        });
        DataService.GetDataGrid("GetContractOrderByContractId?ContractId=" + this.state.docId).then(result => {
          this.setState({
              rows: [...result]
          });  
      });

      DataService.GetDataGrid("GetContractsChangeOrderByContractId?contractId=" + this.state.docId).then(result => {
          this.setState({
            variationOrdersData:  result != null ? result : []
          });  
      });

      this.fillDropDowns(true);

    } else {
      this.fillDropDowns(false);

      let document = {
        id: 0,
        subject: "",
        status: true,
        project: this.state.projectId,
        docDate: moment().format('DD/MM/YYYY'),
        arrange: 0,
        refDoc: "",
        completionDate: moment().format('DD/MM/YYYY'),
        companyId: "",
        toCompanyId: "",
        toContactId: "",
        tax: "",
        vat: "",
        advancedPayment: "",
        retainage: "",
        insurance: "",
        advancedPaymentAmount: "",
        parentType :"Contract"
      };

      this.setState({ document });
      this.props.actions.documentForAdding();
    }
  }

  getTabelData() {
    let Table = [];
    this.setState({ isLoading: true, LoadingPage: true });
    Api.get(
      "GetBoqItemsList?id=" + this.state.docId + "&pageNumber=0&pageSize=1000"
    ).then(res => {
      let data = { items: res };
      this.props.actions.ExportingData(data);

      res.forEach((element, index) => {
        Table.push({
          id: element.id,
          boqId: element.boqId,
          unitPrice: this.state.items.unitPrice,
          itemType: element.itemType,
          itemTypeLabel: "",
          days: element.days,
          equipmentType: element.equipmentType,
          equipmentTypeLabel: "",
          editable: true,
          boqSubTypeId: element.boqSubTypeId,
          boqTypeId: element.boqTypeId,
          boqChildTypeId: element.boqChildTypeId,
          arrange: element.arrange,
          boqType: element.boqType,
          boqTypeChild: element.boqTypeChild,
          boqSubType: element.boqSubType,
          itemCode: element.itemCode,
          description: element.description,
          quantity: element.quantity,
          revisedQuntitty: element.revisedQuantity,
          unit: element.unit,
          unitPrice: element.unitPrice,
          total: element.total,
          resourceCode: element.resourceCode
        });
      });
      this.setState({ rows: Table });
      this.props.actions.setItemDescriptions(Table);

      setTimeout(() => {
        this.setState({ isLoading: false, LoadingPage: false });
      }, 500);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
      this.checkDocumentIsView();
    }
    if (prevProps.showModal != this.props.showModal) {
      this.setState({ showModal: this.props.showModal });
    }
  }

  componentWillReceiveProps(props, state) {
    if (props.document && props.document.id > 0) {
  
      let docDate = moment(props.document.documentDate);
      props.document.statusName = props.document.status ? "Opened" : "Closed";
      let document = Object.assign(props.document, { documentDate: docDate });
      this.setState({ document });

      let items = props.items;
      if (items) {
        this.setState({ isLoading: true });
        this.setState({ items }, () => this.setState({ isLoading: false }));
      } 
 
      this.checkDocumentIsView();
    }
  }

  viewAttachments() {
    return this.state.docId > 0 ? (
      Config.IsAllow(3297) === true ? (
        <ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={860}/>
      ) : null
    ) : null;
  }

  addContract = values => {
    
    this.setState({ isLoading: true });

    let documentObj = {
      projectId: projectId, 
      subject: values.subject,
      status: values.status != undefined ?  values.status : true, 
      docDate: moment(values.docDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
      arrange: this.state.document.arrange,
      refDoc: values.refDoc,
      completionDate:moment(values.completionDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
      companyId: this.state.selectedFromCompany.value,
      toCompanyId: this.state.selectedContract.value,
      toContactId: this.state.selectedContractWithContact.value,
      tax: values.tax,
      vat: values.vat,
      advancedPayment: values.advancedPayment,
      retainage: values.retainage,
      insurance: values.insurance,
      advancedPaymentAmount: values.advancedPaymentAmount,
      parentType:this.state.document.parentType
    };

    DataService.addObject("AddContracts", documentObj).then(result => {
        this.setState({
          docId: result.id,
          isLoading: false,
          btnTxt: "next"
        });
        toast.success(Resources["operationSuccess"][currentLanguage]);
      }).catch(() => {
        toast.error(Resources["operationCanceled"][currentLanguage]);
        this.setState({ isLoading: false });
      });
  };

  editContract = values => {
    if (this.state.isViewMode) {
      this.NextStep();
    } else {
      this.setState({
        isLoading: true,
        firstComplete: true
      });
      let documentObj = {
        projectId: projectId, 
        subject: values.subject,
        status: values.status != undefined ?  values.status : true, 
        docDate: moment(values.docDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
        arrange: this.state.document.arrange,
        refDoc: values.refDoc,
        completionDate:moment(values.completionDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
        companyId: this.state.selectedFromCompany.value,
        toCompanyId: this.state.selectedContract.value,
        toContactId: this.state.selectedContractWithContact.value,
        tax: values.tax,
        vat: values.vat,
        advancedPayment: values.advancedPayment,
        retainage: values.retainage,
        insurance: values.insurance,
        advancedPaymentAmount: values.advancedPaymentAmount,
        parentType:this.state.document.parentType
      };

      Api.post("EditContractById", documentObj).then(result => {
          this.setState({
            isLoading: false
          });
          toast.success(Resources["operationSuccess"][currentLanguage]);
          this.NextStep();
        })
        .catch(() => {
          toast.error(Resources["operationCanceled"][currentLanguage]);
          this.setState({ isLoading: false });
        });
    }
  };

  addEditItems = () => {
    this.setState({ isLoading: true });
    let item = {
      id: this.state.items.id,
      boqId: this.state.docId,
      parentId: "",
      description: this.state.items.description,
      quantity: this.state.items.quantity,
      arrange: this.state.items.arrange,
      unit: this.state.selectedUnit.value,
      unitLabel: this.state.selectedUnit.label,
      unitPrice: this.state.items.unitPrice,
      revisedQuantity: 0,
      resourceCode: this.state.items.resourceCode,
      itemCode: this.state.items.itemCode,
      itemType:
        this.state.selectedItemType.value == "0"
          ? null
          : this.state.selectedItemType.value,
      itemTypeLabel: this.state.selectedItemType.label,
      days: this.state.items.days,
      equipmentType:
        this.state.selectedequipmentType.value > 0
          ? this.state.selectedequipmentType.value
          : "",
      equipmentTypeLabel:
        this.state.selectedequipmentType.value > 0
          ? this.state.selectedequipmentType.label
          : "",
      editable: true,
      boqSubTypeId:
        this.state.selectedBoqSubType.value == "0"
          ? null
          : this.state.selectedBoqSubType.value,
      boqSubType: this.state.selectedBoqSubType.label,
      boqTypeId:
        this.state.selectedBoqType.value == "0"
          ? null
          : this.state.selectedBoqType.value,
      boqType: this.state.selectedBoqType.label,
      boqChildTypeId:
        this.state.selectedBoqTypeChild.value == "0"
          ? null
          : this.state.selectedBoqTypeChild.value,
      boqTypeChild: this.state.selectedBoqTypeChild.label
    };
    let url = this.state.showPopUp ? "EditBoqItem" : "AddBoqItem";
    Api.post(url, item)
      .then(res => {
        if (this.state.showPopUp) {
          let items = Object.assign(this.state.rows);
          this.state.rows.forEach((element, index) => {
            if (element.id == this.state.items.id) {
              item.id = this.state.items.id;
              items[index] = item;
              this.setState({ rows: items, isLoading: false }, function() {
                toast.success(Resources["operationSuccess"][currentLanguage]);
              });
            }
          });
        } else {
          if (this.state.items.itemCode != null) {
            let data = [...this.state.rows];
            item.id = res.id;
            data.push({
              ...item
            });
            this.setState(
              {
                rows: data,
                items: {
                  ...this.state.items,
                  arrange: res.arrange + 1,
                  description: "",
                  quantity: "",
                  itemCode: "",
                  resourceCode: "",
                  unitPrice: "",
                  days: 1
                }
              },
              function() {
                toast.success(Resources["operationSuccess"][currentLanguage]);
              }
            );
          }
        }
        this.setState({
          selectedUnit: {
            label: Resources.unitSelection[currentLanguage],
            value: "0"
          },
          selectedBoqType: {
            label: Resources.boqType[currentLanguage],
            value: "0"
          },
          selectedBoqTypeChild: {
            label: Resources.boqTypeChild[currentLanguage],
            value: "0"
          },
          selectedBoqSubType: {
            label: Resources.boqSubType[currentLanguage],
            value: "0"
          },
          selectedItemType: {
            label: Resources.itemTypeSelection[currentLanguage],
            value: "0"
          },
          selectedequipmentType: {
            label: Resources.equipmentTypeSelection[currentLanguage],
            value: "0"
          },
          BoqTypeChilds: [],
          BoqSubTypes: [],
          isLoading: false,
          showPopUp: false,
          btnText: "add"
        });
      })
      .catch(() => {
        toast.error(Resources["operationCanceled"][currentLanguage]);
        this.setState({ isLoading: false });
      });
  };

  checkItemCode = code => {
    Api.get(
      "GetItemCode?itemCode=" + code + "&projectId=" + this.state.projectId
    ).then(res => {
      if (res == true) {
        toast.error(Resources["itemCodeExist"][currentLanguage]);
        this.setState({ items: { ...this.state.items, itemCode: "" } });
      }
    });
  };

  onCloseModal() {
    this.setState({ showDeleteModal: false });
  }

  clickHandlerCancelMain = () => {
    this.setState({ showDeleteModal: false });
  };

  ConfirmDelete = (id) => {
    this.setState({ showDeleteModal: true ,currentId :id});  
  };

  NextStep = () => {
    window.scrollTo(0, 0);
    switch (this.state.CurrStep) {
      case 1:
        this.setState({
          CurrStep: this.state.CurrStep + 1,
          firstComplete: true
        });
        break; 
      case 2:
        this.props.history.push({
          pathname: "/contractInfo/" + this.state.projectId
        });
        break;
    }
  };

  PreviousStep = () => {
    window.scrollTo(0, 0);
    switch (this.state.CurrStep) {
      case 2:
        this.setState({
          CurrStep: this.state.CurrStep - 1,
          secondComplete: false
        });
        break;
      case 3:
        this.setState({
          CurrStep: this.state.CurrStep - 1,
          thirdComplete: false
        });
        break;
    }
  };

  handleShowAction = item => {
    if (item.title == "sendToWorkFlow") {
      this.props.actions.SendingWorkFlow(true);
    }
    if (item.value != "0") {
      this.setState({
        currentComponent: item.value,
        currentTitle: item.title,
        showModal: true
      });

      this.simpleDialog.show();
    }
  };

  onRowClick = (value, index, column) => {
    console.log("column.key", column.key);
    // if (!Config.IsAllow(11)) {
    //   toast.warning("you don't have permission");
    // } else if (column.key == "customBtn") {
    //   this.itemization(value);
    // } else if (column.key != "select-row" && column.key != "unitPrice") {
    //   if (this.state.CurrStep == 2) {
    //     this.setState({ showPopUp: true, btnText: "save", selectedRow: value });
    //     this.simpleDialog1.show();
    //   }
    // }
  };

  clickHandlerDeleteRowsMain = selectedRows => {
    this.setState({
      showDeleteModal: true,
      selectedRow: selectedRows
    });
  };

  onRowsSelected = selectedRows => {
    this.setState({
      selectedRow: selectedRows
    });
  };

  onRowsDeselected = () => {
    this.setState({
      selectedRow: []
    });
  };

  assign = () => {
    this.setState({ showBoqModal: true });
    this.boqTypeModal.show();
  };

  assignBoqType = () => {
    this.setState({ showBoqModal: true, isLoading: true });
    let itemsId = [];
    this.state.selectedRow.forEach(element => {
      itemsId.push(element.row.id);
    });
    let boq = {
      boqChildTypeId: this.state.selectedBoqTypeChildEdit.value,
      boqItemId: itemsId,
      boqSubTypeId: this.state.selectedBoqSubTypeEdit.value
    };
    Api.post("EditBoqItemForSubType", boq)
      .then(() => {
        this.setState({ showBoqModal: false, isLoading: false });
        toast.success(Resources["operationSuccess"][currentLanguage]);
        //this.getTabelData();
      })
      .catch(() => {
        toast.error(Resources["operationCanceled"][currentLanguage]);
        this.setState({ showBoqModal: false, isLoading: false });
      });
  };

  _executeBeforeModalClose = () => {
    this.setState({
      showPopUp: false,
      btnText: "add",
      showBoqModal: false
    });
  };

  _executeBeforeModalOpen = () => {
    this.setState({
      btnText: "save"
    });
  };

  showBtnsSaving() {
    let btn = null;

    if (this.state.docId === 0) {
      btn = (
        <button className="primaryBtn-1 btn meduimBtn" type="submit">
          {Resources.save[currentLanguage]}
        </button>
      );
    } else if (this.state.docId > 0 && this.props.changeStatus === false) {
      btn = (
        <button className="primaryBtn-1 btn mediumBtn" type="submit">
          {Resources.saveAndExit[currentLanguage]}
        </button>
      );
    }
    return btn;
  }
  
  addPurchaseOrder = values => {
    if (this.props.document.purchaseOrderId != null || this.state.AddedPurchase)
      toast.info(Resources.alreadyContract[currentLanguage]);
    else {
      let purchaseOrder = {
        projectId: this.state.projectId,
        boqId: this.state.docId,
        subject: values.subject,
        companyId: Config.getPayload().cmi,
        completionDate: moment(values.completionDate, "DD/MM/YYYY").format(
          "YYYY-MM-DD[T]HH:mm:ss.SSS"
        ),
        status: values.status,
        useRevised: values.useRevised,
        useItemization: values.useItemization,
        docDate: moment(values.docDate, "DD/MM/YYYY").format(
          "YYYY-MM-DD[T]HH:mm:ss.SSS"
        ),
        refDoc: values.reference,
        actionCurrency:
          this.state.selectedCurrency != undefined
            ? this.state.selectedCurrency.value
            : 0,
        advancePaymentPercent: values.advancedPaymentPercent
      };
      this.setState({ loadingContractPurchase: true, AddedPurchase: true });
      DataService.addObject("AddContractsPurchaseOrdersForBoq", purchaseOrder)
        .then(() => {
          toast.success(Resources["operationSuccess"][currentLanguage]);
          this.setState({ loadingContractPurchase: false });
        })
        .catch(() => {
          toast.error(Resources["operationCanceled"][currentLanguage]);
          this.setState({ loadingContractPurchase: false });
        });
      this.changeTab();
    }
  };

  changeTab = tabName => { 
    this.setState({ activeTab: tabName }); 
  };

  _onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    this.setState({ isLoading: true });

    let updateRow = this.state.rows[fromRow];

    this.setState(
      state => {
        const rows = state.rows.slice();
        for (let i = fromRow; i <= toRow; i++) {
          rows[i] = { ...rows[i], ...updated };
        }
        return { rows };
      },
      function() {
        if (
          updateRow[Object.keys(updated)[0]] !==
          updated[Object.keys(updated)[0]]
        ) {
          updateRow[Object.keys(updated)[0]] = updated[Object.keys(updated)[0]];
          Api.post(
            "EditBoqItemUnitPrice?id=" +
              this.state.rows[fromRow].id +
              "&unitPrice=" +
              updated.unitPrice
          )
            .then(() => {
              toast.success(Resources["operationSuccess"][currentLanguage]);
              this.setState({ isLoading: false });
            })
            .catch(() => {
              toast.error(Resources["operationCanceled"][currentLanguage]);
              this.setState({ isLoading: false });
            });
        }
      }
    );
  };

  StepOneLink = () => {
    if (docId !== 0) {
      this.setState({
        firstComplete: true,
        secondComplete: false,
        CurrStep: 1,
        thirdComplete: false
      });
    }
  };

  StepTwoLink = () => {
    if (docId !== 0) {
      this.setState({
        firstComplete: true,
        secondComplete: true,
        CurrStep: 2,
        thirdComplete: false
      });
    }
  };

  StepThreeLink = () => {
    if (docId !== 0) {
      this.setState({
        thirdComplete: true,
        CurrStep: 3,
        firstComplete: true,
        secondComplete: true
      });
    }
  };

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

    if (field == "fromCompany") {
      let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=" + event.value + "&contactId=" + null;

      Api.get(url).then(res => {

        updated_document.arrange = res;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
          document: updated_document
        });
      });
    } 

    if (isSubscrib) {
        let action = url +  event.value;
        DataService.GetDataList(action, "contactName", "id").then(result => {
          this.setState({
            [targetState]: result
          });
        });
      }
  }

  addChangeOrder(values)
  {
    this.setState({ isLoading: true });

    let documentObj = { 
      arrange: this.state.arrange,
      contractId: this.state.docId,
      changeOrderId:this.state.selectedVariationOrders.value
    };

    DataService.addObject("AddContractsChangeOrderByContractId", documentObj).then(result => {
        this.setState({
          variationOrdersData:result,
          arrange : (this.state.arrange +1),
          selectedVariationOrders :{label : Resources.selectChangeOrder[currentLanguage],value: "0"},
          isLoading:false 
        });
        toast.success(Resources["operationSuccess"][currentLanguage]);
      }).catch(() => {
        toast.error(Resources["operationCanceled"][currentLanguage]);
        this.setState({ isLoading: false });
      });
  }

  clickHandlerContinueMain()
  {
    this.setState({
      isLoading : true,
      showDeleteModal:false
    });

    let originalData = this.state.variationOrdersData;

    DataService.addObject("DeleteChangeOrderByContractId?id="+ this.state.currentId).then(result => {

      let getIndex = originalData.findIndex(x => x.id === this.state.currentId);

      originalData.splice(getIndex, 1);

      this.setState({ 
        isLoading: false ,
        variationOrdersData:originalData
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
        Header: Resources["arrange"][currentLanguage],
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
        Header: Resources["subject"][currentLanguage],
        accessor: "subject",
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
        Header: Resources["dateApproved"][currentLanguage],
        accessor: "dateApproved",
        width: 200,
        sortabel: true,
        Cell: row => (
          <span>
            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
          </span>
        )
      },
      {
        Header: Resources["timeExtension"][currentLanguage],
        accessor: "timeExtensionRequired",
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
        Header: Resources["pco"][currentLanguage],
        accessor: "pcoId",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["executed"][currentLanguage],
        accessor: "executed",
        width: 200,
        sortabel: true
      }
    ];

    const ItemsGrid =
      this.state.isLoading === false ? (
        <GridSetup
                rows={this.state.rows}
                showCheckbox={false}
                pageSize={this.state.pageSize}
                onRowClick={this.onRowClick}
                columns={columnsGrid}
                onGridRowsUpdated={this._onGridRowsUpdated}
                getCellActions={this.GetCellActions}
                key='rows'
            /> 
      ) : (
        <LoadingSection />
      );

    const pricedItemContent = (
      <React.Fragment>
        <div className="document-fields">
            {ItemsGrid}
        </div>
      </React.Fragment>
    );

    const variationOrders = (
      <React.Fragment>
        <div className="document-fields">
          <Formik enableReinitialize={this.props.changeStatus}
            initialValues={{changeOrder: this.state.selectedVariationOrders.value > 0 ? this.state.selectedVariationOrders.value : ""}}
            validationSchema={variationOrdersSchema}
            onSubmit={values => {this.addChangeOrder(values); }}>
            {({errors,touched,setFieldTouched,setFieldValue,handleBlur,handleChange,values}) => (
              <Form id="signupForm1" className="proForm datepickerContainer customProform" noValidate="novalidate">
                <div className="proForm datepickerContainer"> 
                  <div className="linebylineInput valid-input">
                    <Dropdown title="changeOrder" 
                              data={this.state.variationOrders} 
                              selectedValue={this.state.selectedVariationOrders}
                              handleChange={event => { this.setState({ selectedVariationOrders: event }); }}
                              onChange={setFieldValue}
                              onBlur={setFieldTouched}
                              error={errors.changeOrder}
                              touched={touched.changeOrder}
                              name="changeOrder" index="changeOrder" /> 
                  </div> 
                  <div className="linebylineInput valid-input">
                        <label className="control-label">
                          {Resources.arrange[currentLanguage]}
                        </label>
                        <div className="ui input inputDev">
                          <input type="text" className="form-control" id="arrange" readOnly
                                 value={this.state.arrange}
                                 onChange={e => { handleChange(e); }}
                                 name="arrange" placeholder={Resources.arrange[currentLanguage]}/>
                        </div>
                      </div>   

                  <div className={"slider-Btns fullWidthWrapper textLeft "}>
                    {this.state.isLoading === false ? (
                      <button className={"primaryBtn-1 btn " +(this.state.isApproveMode === true ? "disabled" : "")} type="submit" disabled={this.state.isApproveMode}>
                        {Resources.save[currentLanguage]}
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
          <div>
           <ReactTable data={this.state.variationOrdersData}
                       columns={columns}
                       defaultPageSize={5}
                       noDataText={Resources["noData"][currentLanguage]}
                       className="-striped -highlight" />
          </div>
        </div>
      </React.Fragment>
    );
    
    let actions = [
      {
        title: "distributionList",
        value: (<Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId}/>),
        label: Resources["distributionList"][currentLanguage]
      },
      {
        title: "sendToWorkFlow",
        value: (<SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId}/>),
        label: Resources["sendToWorkFlow"][currentLanguage]
      },
      {
        title: "documentApproval",
        value: (<DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={true} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />),
        label: Resources["documentApproval"][currentLanguage]
      },
      {
        title: "documentApproval",
        value: (<DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={false} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} /> ),
        label: Resources["documentApproval"][currentLanguage]
      }
    ];

    let Step_1 = (
      <React.Fragment>
        <div id="step1" className="step-content-body">
          <div className="subiTabsContent">
            <div className="document-fields">
              <Formik initialValues={{ subject: this.props.changeStatus ? this.state.document.subject : "", 
                                       fromCompany: this.state.selectedFromCompany.value > 0 ? this.state.selectedFromCompany.value : "",
                                       contractTo: this.state.selectedContract.value > 0 ? this.state.selectedContract.value : "",
                                       contact: this.state.selectedContractWithContact.value > 0 ? this.state.selectedContractWithContact.value : "",
                                       tax: this.props.changeStatus ? this.props.document.tax : "",
                                       vat: this.props.changeStatus ? this.props.document.vat : "",
                                       retainage: this.props.changeStatus ? this.props.document.retainage : "",
                                       insurance: this.props.changeStatus ? this.props.document.insurance : "",
                                       docDate:moment(),
                                       completionDate:moment()
                             }}
                                validationSchema={contractInfoSchema}
                                enableReinitialize={this.props.changeStatus}
                                onSubmit={values => {
                                if (this.props.changeStatus === true && this.state.docId > 0 ) {
                                    this.editContract(values);
                                } else if (this.props.changeStatus === false && this.state.docId === 0 ) {
                                    this.addContract(values);
                                } else if (this.props.changeStatus === false && this.state.docId > 0 ) {
                                    this.NextStep();
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
                                 autoComplete="off" onBlur={handleBlur} defaultValue={values.subject}
                                 onChange={e => { handleChange(e); }} />
                          {errors.subject ? ( <em className="pError">{errors.subject}</em> ) : null} 
                        </div>
                      </div>
                      <div className="linebylineInput valid-input">
                        <label className="control-label">{Resources.status[currentLanguage]}</label>
                        <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" name="status" defaultChecked={values.status === false ? null : 'checked'} value="true" onChange={() => setFieldValue('status', true)} />
                            <label>{Resources.oppened[currentLanguage]}</label>
                        </div>
                        <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" name="status" defaultChecked={values.status === false ? 'checked' : null} value="false" onChange={() => setFieldValue('status', false)} />
                            <label>{Resources.closed[currentLanguage]}</label>
                        </div>
                    </div>
                    </div>
                    <div className="letterFullWidth">
                        <div className="linebylineInput valid-input"> 
                          <DatePicker title="docDate" format={"DD/MM/YYYY"} name="docDate"
                                      startDate={values.docDate} handleChange={e => { handleChange(e); setFieldValue("docDate", e);}}/>
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
                                 onChange={e => { handleChange(e); }}
                                 name="arrange" placeholder={Resources.arrange[currentLanguage]}/>
                        </div>
                      </div>

                      <div className="linebylineInput valid-input">
                        <label className="control-label">
                          {Resources.refDoc[currentLanguage]}
                        </label>
                        <div className="ui input inputDev">
                          <input type="text" className="form-control" id="refDoc" defaultValue={this.state.document.refDoc}
                                 onChange={e => { handleChange(e); }}
                                 name="refDoc" placeholder={Resources.refDoc[currentLanguage]}/>
                        </div>
                      </div>
                      <div className="letterFullWidth">
                        <div className="linebylineInput valid-input">
                          <DatePicker title="completionDate" format={"DD/MM/YYYY"} name="completionDate"
                                      startDate={values.completionDate} handleChange={e => { handleChange(e); setFieldValue("completionDate", e);}}/>
                        </div>
                      </div>
                      <div className="linebylineInput valid-input"> 
                        <Dropdown title="fromCompany"
                            data={this.state.Companies}
                            selectedValue={this.state.selectedFromCompany}
                            handleChange={event => this.handleChangeDropDown(event, "fromCompany", false, "", "", "", "selectedFromCompany")}
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            error={errors.fromCompany}
                            touched={touched.fromCompany}
                            name="fromCompany" id="fromCompany" />
                      </div>

                      <div className="linebylineInput valid-input">
                        <Dropdown title="contractTo" data={this.state.Companies} selectedValue={this.state.selectedContract}
                                  handleChange={event => { this.setState({ selectedContract: event }); }}
                                  onChange={setFieldValue} onBlur={setFieldTouched} error={errors.contractTo}
                                  handleChange={event => this.handleChangeDropDown(event, "contractTo", true, "contacts", "GetContactsByCompanyId?companyId=", "", "selectedContract")}
                                  touched={touched.contractTo} name="contractTo" index="contractTo" />
                      </div>

                      <div className="linebylineInput valid-input">
                        <Dropdown title="contractWithContact" data={this.state.contacts}
                                  selectedValue={this.state.selectedContractWithContact}
                                  handleChange={event => {
                                    this.setState({selectedContractWithContact: event});
                                }}
                                onChange={setFieldValue} onBlur={setFieldTouched} error={errors.contact}
                                touched={touched.contact} name="contact" index="contact" />
                      </div>

                      <div className="linebylineInput valid-input">
                        <label className="control-label">
                          {Resources["tax"][currentLanguage]}
                        </label>
                        <div className={ "inputDev ui input " + (errors.tax ? "has-error" : !errors.tax && touched.tax ? " has-success" : " ") }>
                          <input type="text" className="form-control" id="tax" onChange={handleChange} onBlur={handleBlur}
                                 defaultValue={this.state.document.tax} name="tax" placeholder={Resources.tax[currentLanguage]} />
                          {errors.tax ? (<em className="pError">{errors.tax}</em>) : null}
                        </div>
                      </div>

                      <div className="linebylineInput valid-input">
                        <label className="control-label">
                          {Resources["vat"][currentLanguage]}
                        </label>
                        <div className={ "inputDev ui input " + (errors.vat ? "has-error" : !errors.vat && touched.vat ? " has-success" : " ") }>
                          <input type="text" className="form-control" id="vat" onChange={handleChange} onBlur={handleBlur}
                                 defaultValue={this.state.document.vat} name="vat" placeholder={Resources.vat[currentLanguage]} />
                          {errors.vat ? ( <em className="pError">{errors.vat}</em> ) : null}
                        </div>
                      </div>
                      <div className="linebylineInput valid-input">
                        <label className="control-label">
                          {Resources.advancedPayment[currentLanguage]}
                        </label>
                        <div className="ui input inputDev">
                          <input type="text" className="form-control" id="advancedPayment"
                                 onChange={handleChange} onBlur={handleBlur}
                                 defaultValue={this.state.document.advancedPayment} name="advancedPayment"
                                 placeholder={ Resources.advancedPayment[currentLanguage] } />
                        </div>
                      </div>
                      <div className="linebylineInput valid-input">
                        <label className="control-label">
                          {Resources["retainage"][currentLanguage]}
                        </label>
                        <div className={ "inputDev ui input " + (errors.retainage ? "has-error" : !errors.retainage && touched.retainage ? " has-success" : " ") }>
                          <input type="text" className="form-control" id="retainage" onChange={handleChange} onBlur={handleBlur}
                                 defaultValue={this.state.document.retainage} name="retainage" placeholder={Resources.retainage[currentLanguage]}/>
                          {errors.retainage ? ( <em className="pError">{errors.retainage}</em> ) : null}
                        </div>
                      </div>
                      <div className="linebylineInput valid-input">
                        <label className="control-label">
                          {Resources["insurance"][currentLanguage]}
                        </label>
                        <div className={ "inputDev ui input " + (errors.insurance ? "has-error" : !errors.insurance && touched.insurance ? " has-success" : " ") }>
                          <input type="text" className="form-control" id="insurance" onChange={handleChange} onBlur={handleBlur} 
                                 defaultValue={this.state.document.insurance} name="insurance" placeholder={Resources.insurance[currentLanguage]}/>
                          {errors.insurance ? ( <em className="pError">{errors.insurance}</em> ) : null}
                        </div>
                      </div>
                      <div className="linebylineInput valid-input">
                        <label className="control-label">
                          {Resources.advancedPaymentAmount[currentLanguage]}
                        </label>
                        <div className="ui input inputDev">
                          <input type="text" className="form-control" id="advancedPaymentAmount"
                                 onChange={handleChange} onBlur={handleBlur}
                                 defaultValue={this.state.document.advancedPaymentAmount}
                                 name="advancedPaymentAmount" placeholder={ Resources.advancedPaymentAmount[currentLanguage]}/>
                        </div>
                      </div>

                      <div className={"slider-Btns fullWidthWrapper textLeft "}>
                        {this.state.isLoading === false ? (
                          <button className={ "primaryBtn-1 btn " + (this.state.isApproveMode === true ? "disNone" : "") } type="submit" disabled={this.state.isApproveMode}>
                            {Resources[this.state.btnTxt][currentLanguage]}
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
              <div className="doc-pre-cycle letterFullWidth">
                <div>
                  {this.state.docId > 0 ? (
                    <UploadAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId}/>
                  ) : null}
                  {this.viewAttachments()}

                  {this.props.changeStatus === true ? (
                    <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    ); 

    let Step_2 = (
      <React.Fragment>
        {this.state.loadingContractPurchase ? <LoadingSection /> : null}
        <div className="company__total proForm"> 
          <ul id="stepper__tabs" className="data__tabs">
            <li className={ " data__tabs--list " + (this.state.activeTab == "pricedItem" ? "active" : "") } onClick={() => this.changeTab("pricedItem")}>
              {Resources.pricedItem[currentLanguage]}
            </li>
            <li className={ "data__tabs--list " + (this.state.activeTab == "cos" ? "active" : "") } onClick={() => this.changeTab("cos")}>
              {Resources.cos[currentLanguage]}
            </li>
            <li className={ " data__tabs--list " + (this.state.activeTab == "paymentRequisitions" ? "active" : "") } onClick={() => this.changeTab("paymentRequisitions")}>
              {Resources.paymentRequisitions[currentLanguage]}
            </li>
            <li className={ "data__tabs--list " + (this.state.activeTab == "contractsDeductions" ? "active" : "") } onClick={() => this.changeTab("contractsDeductions")}>
              {Resources.contractsDeductions[currentLanguage]}
            </li>
            <li className={ " data__tabs--list " + (this.state.activeTab == "conditions" ? "active" : "") } onClick={() => this.changeTab("conditions")}>
              {Resources.conditions[currentLanguage]}
            </li>
            <li className={ "data__tabs--list " + (this.state.activeTab == "schedule" ? "active" : "") } onClick={() => this.changeTab("schedule")}>
              {Resources.schedule[currentLanguage]}
            </li>
            <li className={ " data__tabs--list " + (this.state.activeTab == "insurance" ? "active" : "") } onClick={() => this.changeTab("insurance")}>
              {Resources.insurance[currentLanguage]}
            </li>
            <li className={ "data__tabs--list " + (this.state.activeTab == "amendment" ? "active" : "") } onClick={() => this.changeTab("amendment")}>
              {Resources.amendment[currentLanguage]}
            </li>
            <li className={ " data__tabs--list " + (this.state.activeTab == "subContracts" ? "active" : "") } onClick={() => this.changeTab("subContracts")}>
              {Resources.subContracts[currentLanguage]}
            </li>
            <li className={ "data__tabs--list " + (this.state.activeTab == "subPOs" ? "active" : "") } onClick={() => this.changeTab("subPOs")}>
              {Resources.subPOs[currentLanguage]}
            </li>
          </ul>
        </div>
        {this.state.activeTab == "pricedItem" ? (<React.Fragment>{pricedItemContent}</React.Fragment>) : null }
        {this.state.activeTab == "cos" ? (<React.Fragment>{variationOrders}</React.Fragment>) : null}
        {this.state.activeTab == "subPOs" ? (<SubPurchaseOrders contractId={this.state.docId} projectId={projectId} isViewMode={this.state.isViewMode} subject={this.state.document.subject}/>) : null}
        <div className="doc-pre-cycle letterFullWidth">
          <div className="precycle-grid">
            <div className="slider-Btns">
              <button className="primaryBtn-1 btn meduimBtn " type="submit" onClick={this.NextStep}>
                {Resources.next[currentLanguage]}
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <div className="mainContainer">
          <div className={ this.state.isViewMode === true && this.state.CurrStep != 3 ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
            <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} docTitle={Resources.contract[currentLanguage]}
                            moduleTitle={Resources["contracts"][currentLanguage]}/>
            <div className="doc-container">
              <div className="step-content withManyTabs">
                {this.state.LoadingPage ? (<LoadingSection />) : 
                (
                  <Fragment>
                    {this.state.CurrStep == 1 ? Step_1 : this.state.CurrStep == 2 ? Step_2 : null}
                    {this.props.changeStatus === true ? (
                      <div className="approveDocument">
                        <div className="approveDocumentBTNS">
                          {this.state.isApproveMode === true ? (
                            <div>
                              <button type="button" className="primaryBtn-1 btn " onClick={e => this.handleShowAction(actions[2])}>
                                {
                                  Resources.approvalModalApprove[currentLanguage]
                                }
                              </button>
                              <button type="button" className="primaryBtn-2 btn middle__btn" onClick={e => this.handleShowAction(actions[3])}>
                                {Resources.approvalModalReject[currentLanguage]}
                              </button>
                            </div>
                          ) : null}
                          <button type="button" className="primaryBtn-2 btn middle__btn" onClick={e => this.handleShowAction(actions[1])}>
                            {Resources.sendToWorkFlow[currentLanguage]}
                          </button>
                          <button type="button" className="primaryBtn-2 btn" onClick={e => this.handleShowAction(actions[0])}>
                            {Resources.distributionList[currentLanguage]}
                          </button>
                          <span className="border" />
                          <div className="document__action--menu">
                            <OptionContainer
                              permission={this.state.permission}
                              docTypeId={this.state.docTypeId}
                              docId={this.state.docId}
                              projectId={this.state.projectId}
                            />
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </Fragment>
                )}
              </div>
              <div>
                <div className="docstepper-levels">
                  <div className="step-content-foot">
                    <span onClick={this.PreviousStep} className={ this.props.changeStatus == true && this.state.CurrStep > 1 ? "step-content-btn-prev " : "step-content-btn-prev disabled"}>
                      <i className="fa fa-caret-left" aria-hidden="true" />
                      Previous
                    </span>
                    <span onClick={this.NextStep} className={ this.state.docId > 0 ? "step-content-btn-prev " : "step-content-btn-prev disabled"}>
                      Next
                      <i className="fa fa-caret-right" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="workflow-sliderSteps">
                    <div className="step-slider">
                      <div onClick={this.StepOneLink} data-id="step1"
                           className={"step-slider-item " +(this.state.CurrStep == 1? "current__step": this.state.firstComplete? "active": "")}>
                        <div className="steps-timeline">
                          <span>1</span>
                        </div>
                        <div className="steps-info">
                          <h6>{Resources.contract[currentLanguage]}</h6>
                        </div>
                      </div>
                      <div onClick={this.StepTwoLink} data-id="step3" className={ this.state.CurrStep == 2 ? "step-slider-item  current__step" : "step-slider-item"}>
                        <div className="steps-timeline">
                          <span>2</span>
                        </div>
                        <div className="steps-info">
                          <h6>{Resources.details[currentLanguage]}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {this.state.showDeleteModal == true ? (
            <ConfirmationModal title={Resources["smartDeleteMessage"][currentLanguage].content} closed={this.onCloseModal}
                               showDeleteModal={this.state.showDeleteModal} clickHandlerCancel={this.clickHandlerCancelMain}
                               buttonName="delete" clickHandlerContinue={this.clickHandlerContinueMain.bind(this)}/>
          ) : null}
          <div className="largePopup largeModal " style={{ display: this.state.showModal ? "block" : "none" }}>
            <SkyLight hideOnOverlayClicked ref={ref => (this.simpleDialog = ref)} title={Resources[this.state.currentTitle][currentLanguage]}>
              {this.state.currentComponent}
            </SkyLight>
          </div> 
        </div>
      </React.Fragment>
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
    items: state.communication.items,
    projectId: state.communication.projectId,
    showModal: state.communication.showModal
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(ContractInfoAddEdit));
