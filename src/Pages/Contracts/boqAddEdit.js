import React, { Component, Fragment } from 'react';
import Dropdown from '../../Componants/OptionsPanels/DropdownMelcous';
import Api from '../../api'
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import moment from 'moment'
import Resources from '../../resources.json';
import _ from "lodash";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { withRouter } from "react-router-dom";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import DataService from '../../Dataservice'
import CryptoJS from 'crypto-js';
import { toast } from "react-toastify";
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval'
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import Config from "../../Services/Config.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SkyLight from 'react-skylight';
import * as communicationActions from '../../store/actions/communication';
//import Recycle from '../../Styles/images/attacheRecycle.png'
import AddItemDescription from '../../Componants/OptionsPanels/addItemDescription'

import 'react-table/react-table.css'
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal'
import GridSetup from "../Communication/GridSetup";
//import { func } from 'prop-types';
import XSLfile from '../../Componants/OptionsPanels/XSLfiel'
import IPConfig from '../../IP_Configrations'
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const poqSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    fromCompany: Yup.string().required(Resources['fromCompanyRequired'][currentLanguage]),
    discipline: Yup.string().required(Resources['disciplineRequired'][currentLanguage]),
});
const itemsValidationSchema = Yup.object().shape({
    description: Yup.string().required(Resources['descriptionRequired'][currentLanguage]),
    unit: Yup.string().required(Resources['unitSelection'][currentLanguage]),
    itemCode: Yup.string().required(Resources['itemCodeRequired'][currentLanguage]),
    resourceCode: Yup.string().required(Resources['resourceCodeRequired'][currentLanguage]),
    itemType: Yup.string().required(Resources['itemTypeSelection'][currentLanguage]),
    days: Yup.number().required(Resources['daysRequired'][currentLanguage]).min(0, Resources['onlyNumbers'][currentLanguage]),
    quantity: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).min(0, Resources['onlyNumbers'][currentLanguage]),
    unitPrice: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).min(0, Resources['onlyNumbers'][currentLanguage]),
});
const contractSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    tax: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).min(0, Resources['onlyNumbers'][currentLanguage]),
    vat: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).min(0, Resources['onlyNumbers'][currentLanguage]),
    retainage: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).min(0, Resources['onlyNumbers'][currentLanguage]),
    insurance: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).min(0, Resources['onlyNumbers'][currentLanguage]),
    advancedPayment: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).min(0, Resources['onlyNumbers'][currentLanguage]),
    advancedPaymentAmount: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).min(0, Resources['onlyNumbers'][currentLanguage]),
});
const purchaseSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    advancedPaymentPercent: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).min(0, Resources['onlyNumbers'][currentLanguage])
});
const BoqTypeSchema = Yup.object().shape({
    boqType: Yup.string().required(Resources['boqSubType'][currentLanguage]),
    boqChild: Yup.string().required(Resources['boqSubType'][currentLanguage]),
    boqSubType: Yup.string().required(Resources['boqSubType'][currentLanguage]),
});

let docId = 0;
let projectId = 0;
let projectName = "";
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
class bogAddEdit extends Component {
    constructor(props) {
        super(props)
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

        this.itemsColumns = [
            {
                key: "arrange",
                name: Resources["no"][currentLanguage],
                width: 50,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "boqType",
                name: Resources["boqType"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "boqTypeChild",
                name: Resources["boqTypeChild"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "boqSubType",
                name: Resources["boqSubType"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "itemCode",
                name: Resources["itemCode"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "description",
                name: Resources["details"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "quantity",
                name: Resources["quantity"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "revisedQuntitty",
                name: Resources["receivedQuantity"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "unit",
                name: Resources["unit"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "unitPrice",
                name: Resources["unitPrice"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                editable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "total",
                name: Resources["total"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "resourceCode",
                name: Resources["resourceCode"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ];

        this.state = {
            isCompany: Config.getPayload().uty == 'company' ? true : false,
            showForm: false,
            loadingContractPurchase: false,
            AddedPurchase: false,
            loadingContract: false,
            LoadingPage: false,
            docTypeId: 64,
            selectedRow: '',
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
            btnTxt: 'save',
            btnText: 'add',
            activeTab: '',
            contractId: 0,
            Companies: [],
            Disciplines: [],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedDiscipline: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
            rows: [],
            items: {
                parentId: 0,
                description: '',
                quantity: 0,
                arrange: 1,
                unit: '',
                unitPrice: 0,
                revisedQuantity: 0,
                resourceCode: '',
                itemCode: '',
                itemType: '',
                days: 1,
                equipmentType: '',
                editable: true,
                boqSubTypeId: 0,
                boqTypeId: 0,
                boqChildTypeId: 0,
            },
            selectedUnit: { label: Resources.unitSelection[currentLanguage], value: "0" },
            selectedBoqType: { label: Resources.boqType[currentLanguage], value: "0" },
            selectedBoqTypeChild: { label: Resources.boqTypeChild[currentLanguage], value: "0" },
            selectedBoqSubType: { label: Resources.boqSubType[currentLanguage], value: "0" },
            selectedItemType: { label: Resources.itemTypeSelection[currentLanguage], value: "0" },
            selectedequipmentType: { label: Resources.equipmentTypeSelection[currentLanguage], value: "0" },
            Units: [],
            boqTypes: [],
            BoqTypeChilds: [],
            BoqSubTypes: [],
            itemTypes: [],
            equipmentTypes: [],
            currency: [],
            selectedBoqTypeEdit: { label: Resources.boqType[currentLanguage], value: "0" },
            selectedBoqTypeChildEdit: { label: Resources.boqTypeChild[currentLanguage], value: "0" },
            selectedBoqSubTypeEdit: { label: Resources.boqSubType[currentLanguage], value: "0" },
            isLoading: true,
            permission: [{ name: 'sendByEmail', code: 622 }, { name: 'sendByInbox', code: 621 },
            { name: 'sendTask', code: 0 }, { name: 'distributionList', code: 971 },
            { name: 'createTransmittal', code: 3057 }, { name: 'sendToWorkFlow', code: 720 },
            { name: 'viewAttachments', code: 3295 }, { name: 'deleteAttachments', code: 862 }],
            document: {},
        }
        if (!Config.IsAllow(616) || !Config.IsAllow(617) || !Config.IsAllow(619)) {
            toast.warning(Resources['missingPermissions'][currentLanguage])
            this.props.history.push({ pathname: "/InternalMeetingMinutes/" + projectId });
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(617) || this.props.document.contractId !== null) {
                this.setState({ isViewMode: true });
            }
            else if (this.state.isApproveMode != true && Config.IsAllow(617)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(617)) {
                    if (this.props.document.status != false && Config.IsAllow(617)) {
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
    componentWillUnmount() {
        this.props.actions.documentForAdding()
    }
    fillDropDowns(isEdit) {
        DataService.GetDataList('GetProjectProjectsCompaniesForList?projectId=' + projectId, 'companyName', 'companyId').then(res => {
            if (isEdit) {
                let companyId = this.state.document.company;
                if (companyId) {
                    let comapny = _.find(res, function (x) { return x.value == companyId })
                    this.setState({
                        selectedFromCompany: comapny
                    });
                }
            }
            this.setState({ Companies: [...res], isLoading: false })
        })

        DataService.GetDataList('GetAccountsDefaultList?listType=discipline&pageNumber=0&pageSize=10000', 'title', 'id').then(res => {
            if (isEdit) {
                let disciplineId = this.state.document.discipline;
                if (disciplineId) {
                    let discipline = _.find(res, function (x) { return x.value == disciplineId })
                    this.setState({
                        selectedDiscipline: discipline
                    });
                }
            }

            this.setState({ Disciplines: [...res], isLoading: false })
        })
        DataService.GetDataList('GetAccountsDefaultList?listType=currency&pageNumber=0&pageSize=10000', 'title', 'id').then(res => {
            this.setState({ currency: [...res], isLoading: false })
        })

    }
    fillSubDropDown(url, param, value, subField_lbl, subField_value, subDatasource, subDatasource_2) {
        this.setState({ isLoading: true })
        let action = url + "?" + param + "=" + value
        DataService.GetDataList(action, subField_lbl, subField_value).then(result => {
            this.setState({
                [subDatasource]: result,
                [subDatasource_2]: result,
                isLoading: false
            })
        });
    }
    componentDidMount() {

    }
    componentWillMount() {
        if (this.state.docId > 0) {
            this.setState({ isLoading: true, LoadingPage: true })
            this.props.actions.documentForEdit('GetBoqForEdit?id=' + this.state.docId).then(() => {
                this.setState({ isLoading: false, showForm: true, btnTxt: 'next', LoadingPage: false })
                this.checkDocumentIsView();
                this.getTabelData()
            })
        } else {
            let cmi = Config.getPayload().cmi
            this.setState({ LoadingPage: true })
            Api.get('GetBoqNumber?projectId=' + + this.state.projectId + '&companyId=' + cmi).then(res => {
                this.setState({ document: { ...this.state.document, arrange: res }, isLoading: false, LoadingPage: false })
            })
            this.fillDropDowns(false);

            let document = {
                id: 0,
                project: this.state.projectId,
                documentDate: moment().format('DD/MM/YYYY'),
                company: '',
                discipline: '',
                status: true,
                arrange: 0,
                subject: '',
                showInCostCoding: false,
                showInSiteRequest: true,
                showOptimization: true,
            };

            this.setState({ document });
            this.props.actions.documentForAdding();
        }
    }
    getTabelData() {
        let Table = []
        this.setState({ isLoading: true, LoadingPage: true })
        Api.get('GetBoqItemsList?id=' + this.state.docId + '&pageNumber=0&pageSize=1000').then(res => {
            res.forEach((element, index) => {
                Table.push({
                    id: element.id,
                    boqId: element.boqId,
                    unitPrice: this.state.items.unitPrice,
                    itemType: element.itemType,
                    itemTypeLabel: '',
                    days: element.days,
                    equipmentType: element.equipmentType,
                    equipmentTypeLabel: '',
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
                })
            })
            this.setState({ rows: Table })
            this.props.actions.setItemDescriptions(Table);

            setTimeout(() => { this.setState({ isLoading: false, LoadingPage: false }) }, 500)
        })


    }

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }
    }

    componentWillReceiveProps(props, state) {
        if (props.document && props.document.id > 0) {
            let docDate = moment(props.document.documentDate)
            let document = Object.assign(props.document, { documentDate: docDate })
            this.setState({ document });
            this.fillDropDowns(true);
            this.checkDocumentIsView();
        }
    }
    viewAttachments() {
        return (
            this.state.docId > 0 ? (
                Config.IsAllow(3317) === true ?
                    <ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} />
                    : null)
                : null
        )
    }

    addPoq = (values) => {
        this.setState({ isLoading: true })
        let documentObj = {
            project: this.state.projectId,
            documentDate: moment(values.documentDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            company: this.state.selectedFromCompany.value,
            discipline: this.state.selectedDiscipline.value,
            status: values.status,
            arrange: this.state.document.arrange,
            subject: values.subject,
            showInCostCoding: false,
            showInSiteRequest: values.showInSiteRequest,
            showOptimization: values.showOptimization
        };
        DataService.addObject('AddBoq', documentObj).then(result => {
            this.setState({
                docId: result.id,
                isLoading: false,
                btnTxt: 'next'
            })
            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({ isLoading: false })
        })
    }
    editBoq = (values) => {
        if (this.state.isViewMode) {
            this.NextStep()

        }
        else {
            this.setState({
                isLoading: true,
                firstComplete: true
            });
            let documentObj = {
                project: this.state.projectId,
                id: this.state.docId,
                arrange: this.state.document.arrange,
                DocumentDate: moment(values.documentDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                Company: Config.getPayload().cmi,
                Discipline: this.state.selectedDiscipline.value,
                Status: values.status,
                Subject: values.subject,
                ShowInCostCoding: false,
                ShowInSiteRequest: values.showInSiteRequest,
                ShowOptimization: values.showOptimization
            };
            Api.post('EditBoq', documentObj).then(result => {
                this.setState({
                    isLoading: false,
                });
                toast.success(Resources["operationSuccess"][currentLanguage]);
                this.NextStep()
            }).catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({ isLoading: false })
            })
        }

    }

    addEditItems = () => {
        this.setState({ isLoading: true })
        let item = {
            id: this.state.items.id,
            boqId: this.state.docId,
            parentId: '',
            description: this.state.items.description,
            quantity: this.state.items.quantity,
            arrange: this.state.items.arrange,
            unit: this.state.selectedUnit.value,
            unitLabel: this.state.selectedUnit.label,
            unitPrice: this.state.items.unitPrice,
            revisedQuantity: 0,
            resourceCode: this.state.items.resourceCode,
            itemCode: this.state.items.itemCode,
            itemType: this.state.selectedItemType.value == '0' ? null : this.state.selectedItemType.value,
            itemTypeLabel: this.state.selectedItemType.label,
            days: this.state.items.days,
            equipmentType: this.state.selectedequipmentType.value > 0 ? this.state.selectedequipmentType.value : '',
            equipmentTypeLabel: this.state.selectedequipmentType.value > 0 ? this.state.selectedequipmentType.label : '',
            editable: true,
            boqSubTypeId: this.state.selectedBoqSubType.value == '0' ? null : this.state.selectedBoqSubType.value,
            boqSubType: this.state.selectedBoqSubType.label,
            boqTypeId: this.state.selectedBoqType.value == '0' ? null : this.state.selectedBoqType.value,
            boqType: this.state.selectedBoqType.label,
            boqChildTypeId: this.state.selectedBoqTypeChild.value == '0' ? null : this.state.selectedBoqTypeChild.value,
            boqTypeChild: this.state.selectedBoqTypeChild.label,
        }
        let url = this.state.showPopUp ? 'EditBoqItem' : 'AddBoqItem'
        Api.post(url, item).then((res) => {
            if (this.state.showPopUp) {
                let items = Object.assign(this.state.rows)
                this.state.rows.forEach((element, index) => {
                    if (element.id == this.state.items.id) {
                        item.id = this.state.items.id;
                        items[index] = item
                        this.setState({ rows: items, isLoading: false }, function () {
                            toast.success(Resources["operationSuccess"][currentLanguage]);
                        })
                    }
                })
            }
            else {
                if (this.state.items.itemCode != null) {
                    let data = [...this.state.rows];
                    item.id = res.id;
                    data.push({
                        ...item
                    })
                    this.setState({
                        rows: data,
                        items: { ...this.state.items, arrange: res.arrange + 1, description: '', quantity: '', itemCode: '', resourceCode: '', unitPrice: '', days: 1 }
                    }, function () {
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    })
                }
            }
            this.setState({
                selectedUnit: { label: Resources.unitSelection[currentLanguage], value: "0" },
                selectedBoqType: { label: Resources.boqType[currentLanguage], value: "0" },
                selectedBoqTypeChild: { label: Resources.boqTypeChild[currentLanguage], value: "0" },
                selectedBoqSubType: { label: Resources.boqSubType[currentLanguage], value: "0" },
                selectedItemType: { label: Resources.itemTypeSelection[currentLanguage], value: "0" },
                selectedequipmentType: { label: Resources.equipmentTypeSelection[currentLanguage], value: "0" },
                BoqTypeChilds: [],
                BoqSubTypes: [],
                isLoading: false,
                showPopUp: false,
                btnText: 'add'

            });
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({ isLoading: false })
        })
    }
    checkItemCode = (code) => {
        Api.get('GetItemCode?itemCode=' + code + '&projectId=' + this.state.projectId).then(res => {
            if (res == true) {
                toast.error(Resources["itemCodeExist"][currentLanguage])
                this.setState({ items: { ...this.state.items, itemCode: '' } })
            }
        })
    }
    onCloseModal() {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    ConfirmDelete = () => {
        this.setState({ isLoading: true })
        if (this.state.CurrStep == 2) {
            Api.post('ContractsBoqItemsMultipleDelete?', this.state.selectedRow).then((res) => {
                let data = [...this.state.rows]
                let length = data.length
                data.forEach((element, index) => {
                    data = data.filter(item => { return item.id != element.id });
                    if (index == length - 1) {
                        this.setState({ rows: data, showDeleteModal: false, isLoading: false });
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    }
                })
            }).catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({ showDeleteModal: false, isLoading: false });
            })
        }
    }
    NextStep = () => {
        window.scrollTo(0, 0)
        switch (this.state.CurrStep) {
            case 1:
                this.setState({
                    CurrStep: this.state.CurrStep + 1,
                    firstComplete: true
                })
                break;
            case 2:
                if (this.state.docId > 0) {
                    this.setState({ isLoading: true, LoadingPage: true })
                    this.props.actions.documentForEdit('GetBoqForEdit?id=' + this.state.docId).then(() => {
                        this.setState({ LoadingPage: false })
                    })
                }
                this.setState({
                    CurrStep: this.state.CurrStep + 1, secondComplete: true,
                    isLoading: false
                })
                break;
            case 3:
                this.props.history.push({ pathname: '/boq/' + this.state.projectId })
                break;
        }
    }
    PreviousStep = () => {
        window.scrollTo(0, 0)
        switch (this.state.CurrStep) {
            case 2:
                this.setState({ CurrStep: this.state.CurrStep - 1, secondComplete: false })
                break;
            case 3:
                this.setState({ CurrStep: this.state.CurrStep - 1, thirdComplete: false })
                break;
        }
    }

    handleShowAction = (item) => {
        if (item.value != "0") {

            this.setState({
                currentComponent: item.value,
                currentTitle: item.title,
                showModal: true
            })

            this.simpleDialog.show()
        }
    }

    onRowClick = (value, index, column) => {
        console.log('column.key', column.key)
        if (!Config.IsAllow(11)) {
            toast.warning("you don't have permission");
        }

        else if (column.key != 'select-row' && column.key != 'unitPrice') {
            this.setState({ showPopUp: true, btnText: 'save' })
               DataService.GetDataList('GetAccountsDefaultList?listType=estimationitemtype&pageNumber=0&pageSize=10000', 'title', 'id').then(result => {
                
                this.setState({ 
                    itemTypes: result
                })
            })

            DataService.GetDataList('GetAccountsDefaultList?listType=equipmentType&pageNumber=0&pageSize=10000', 'title', 'id').then(res => {
                this.setState({ equipmentTypes: [...res] })
            })

            this.simpleDialog1.show()

            if (this.state.CurrStep == 2) {
                this.setState({ isLoading: true })
                DataService.GetDataList('GetAllBoqChild?parentId=' + value.boqTypeId, 'title', 'id').then(res => {
                    this.setState({
                        BoqSubTypes: res,
                        BoqTypeChilds: res,
                        items: { id: value.id, description: value.description, arrange: value.arrange, quantity: value.quantity, unitPrice: value.unitPrice, itemCode: value.itemCode, resourceCode: value.resourceCode, days: value.days },
                        selectedUnit: value.unit ? { label: value.unit, value: value.unit } : { label: Resources.unitSelection[currentLanguage], value: "0" },
                        selectedBoqType: value.boqTypeId > 0 ? { label: value.boqType, value: value.boqTypeId } : { label: Resources.boqType[currentLanguage], value: "0" },
                        selectedBoqTypeChild: value.boqChildTypeId > 0 ? { label: value.boqTypeChild, value: value.boqTypeChildId } : { label: Resources.boqTypeChild[currentLanguage], value: "0" },
                        selectedBoqSubType: value.boqSubTypeId > 0 ? { label: value.boqSubType, value: value.boqSubTypeId } : { label: Resources.boqSubType[currentLanguage], value: "0" },
                        selectedequipmentType: value.equipmentType > 0 ? { label: value.equipmentTypeLabel, value: value.equipmentType } : { label: Resources.equipmentTypeSelection[currentLanguage], value: "0" },
                        selectedItemType: { label: Resources.itemTypeSelection[currentLanguage], value: "0" },
                        isLoading: false
                    })
                    if (value.itemType > 0) {
                        let itemType = _.find(this.state.itemTypes, function (e) { return e.value == value.itemType })
                        this.setState({ selectedItemType: itemType })
                    }
                })
            }

        }
    }
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
    }
    onRowsDeselected = () => {
        this.setState({
            selectedRow: []
        });
    }
    assign = () => {
        this.setState({ showBoqModal: true })
        this.boqTypeModal.show()
    }
    assignBoqType = () => {
        this.setState({ showBoqModal: true, isLoading: true })
        let itemsId = []
        this.state.selectedRow.forEach(element => {
            itemsId.push(element.row.id)
        })
        let boq = {
            boqChildTypeId: this.state.selectedBoqTypeChildEdit.value,
            boqItemId: itemsId,
            boqSubTypeId: this.state.selectedBoqSubTypeEdit.value,
        }
        Api.post('EditBoqItemForSubType', boq).then(() => {
            this.setState({ showBoqModal: false, isLoading: false })
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.getTabelData()
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({ showBoqModal: false, isLoading: false })
        })

    }
    _executeBeforeModalClose = () => {
        this.setState({
            showPopUp: false, btnText: 'add'
        })
    }
    _executeBeforeModalOpen = () => {
        this.setState({
            btnText: 'save'
        })
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

    addContract = (values) => {
        if (this.props.document.contractId != null || this.state.addedContract)
            toast.info(Resources.alreadyContract[currentLanguage])
        else {
            let contract = {
                projectId: this.state.projectId,
                boqId: this.state.docId,
                subject: values.subject,
                companyId: Config.getPayload().cmi,
                completionDate: moment(values.completionDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                status: values.status == undefined ? this.props.document.status : values.status,
                docDate: moment(values.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                reference: values.reference,
                currencyAction: this.state.selectedCurrency != undefined ? this.state.selectedCurrency.value : 0,
                tax: values.tax,
                vat: values.vat,
                advancedPayment: values.advancedPayment,
                retainage: values.retainage,
                insurance: values.insurance,
                advancedPaymentAmount: values.advancedPaymentAmount,
            }
            this.setState({ loadingContractPurchase: true })
            DataService.addObject('AddContractsForBoq', contract).then(() => {
                toast.success(Resources["operationSuccess"][currentLanguage]);
                this.setState({
                    selectedCurrency: { label: Resources.pleaseSelect[currentLanguage], value: "0" },
                    loadingContractPurchase: false,
                    addedContract: true
                })
            }).catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({ loadingContractPurchase: false })

            })
            this.changeTab()
        }
    }

    addPurchaseOrder = (values) => {
        if (this.props.document.purchaseOrderId != null || this.state.AddedPurchase)
            toast.info(Resources.alreadyContract[currentLanguage])
        else {
            let purchaseOrder = {
                projectId: this.state.projectId,
                boqId: this.state.docId,
                subject: values.subject,
                companyId: Config.getPayload().cmi,
                completionDate: moment(values.completionDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                status: values.status,
                useRevised: values.useRevised,
                useItemization: values.useItemization,
                docDate: moment(values.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                refDoc: values.reference,
                actionCurrency: this.state.selectedCurrency != undefined ? this.state.selectedCurrency.value : 0,
                advancePaymentPercent: values.advancedPaymentPercent,
            }
            this.setState({ loadingContractPurchase: true, AddedPurchase: true })
            DataService.addObject('AddContractsPurchaseOrdersForBoq', purchaseOrder).then(() => {
                toast.success(Resources["operationSuccess"][currentLanguage]);
                this.setState({ loadingContractPurchase: false })

            }).catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({ loadingContractPurchase: false })

            })
            this.changeTab()
        }
    }

    changeTab = (tabName) => {
        if (tabName == 'contract') {
            if (this.props.document.contractId != null)
                toast.info(Resources.alreadyContract[currentLanguage])
            else
                this.setState({ activeTab: tabName })
        }
        else if (tabName == 'purchase') {
            if (this.props.document.purchaseOrderId != null)
                toast.info(Resources.alreadyContract[currentLanguage])
            else
                this.setState({ activeTab: tabName })
        }
        else
            this.setState({ activeTab: '' })
    }


    _onGridRowsUpdated = ({ fromRow, toRow, updated }) => {

        let updateRow = this.state.rows[fromRow];

        this.setState(state => {
            const rows = state.rows.slice();
            for (let i = fromRow; i <= toRow; i++) {
                rows[i] = { ...rows[i], ...updated };
            }
            return { rows };
        }, function () {
            if (updateRow[Object.keys(updated)[0]] !== updated[Object.keys(updated)[0]]) {
                alert('not equal');
                updateRow[Object.keys(updated)[0]] = updated[Object.keys(updated)[0]];
                Api.post('EditBoqItemUnitPrice?id=' + this.state.rows[fromRow].id + '&unitPrice=' + updated.unitPrice).catch(() => {
                    toast.error(Resources["operationCanceled"][currentLanguage]);
                    console.log(this.state.rows);
                })
            }
        });
    };

    render() {
        const ItemsGrid = this.state.isLoading === false ? (
            <GridSetup
                rows={this.props.items}
                showCheckbox={true}
                pageSize={this.state.pageSize}
                onRowClick={this.onRowClick}
                columns={this.itemsColumns}
                clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                onRowsSelected={this.onRowsSelected}
                onRowsDeselected={this.onRowsDeselected}
                onGridRowsUpdated={this._onGridRowsUpdated}
                assign={true}
                assignFn={() => this.assign()}
                key='items'
            />) : <LoadingSection />;

        const contractContent = <React.Fragment>
            <div className="document-fields">
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        subject: this.props.changeStatus ? this.props.document.subject : '',
                        reference: 1,
                        completionDate: moment(),
                        docDate: this.props.changeStatus ? this.props.document.documentDate : moment(),
                        status: this.props.document.status ? this.props.document.status : true

                    }}
                    validationSchema={contractSchema}
                    onSubmit={(values) => {
                        this.addContract(values)
                    }}
                >
                    {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange, values }) => (
                        <Form id="signupForm1" className="proForm datepickerContainer customProform" noValidate="novalidate" >

                            <div className="proForm first-proform letterFullWidth">
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources['subject'][currentLanguage]} </label>
                                    <div className={"inputDev ui input " + (errors.subject ? 'has-error' : !errors.subject && touched.subject ? (" has-success") : " ")}>
                                        <input name='subject'
                                            className="form-control"
                                            id="subject" placeholder={Resources['subject'][currentLanguage]} autoComplete='off'
                                            onBlur={handleBlur} defaultValue={values.subject}
                                            onChange={e => handleChange(e)} />
                                        {errors.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.status[currentLanguage]}</label>
                                    <div className="ui checkbox radio radioBoxBlue">
                                        <input type="radio" name="status" defaultChecked={values.status === false ? null : 'checked'} value="true" onChange={e => setFieldValue('status', true)} />
                                        <label>{Resources.oppened[currentLanguage]}</label>
                                    </div>
                                    <div className="ui checkbox radio radioBoxBlue">
                                        <input type="radio" name="status" defaultChecked={values.status === false ? 'checked' : null} value="false" onChange={e => setFieldValue('status', false)} />
                                        <label>{Resources.closed[currentLanguage]}</label>
                                    </div>
                                </div>
                            </div>
                            <div className="proForm datepickerContainer">
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.reference[currentLanguage]}</label>
                                    <div className="ui input inputDev"  >
                                        <input type="text" className="form-control" id="reference"
                                            defaultValue={values.reference}
                                            name="reference"
                                            placeholder={Resources.reference[currentLanguage]}
                                        />
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <DatePicker title='completionDate'
                                        format={'DD/MM/YYYY'}
                                        name="completionDate"
                                        startDate={values.completionDate}
                                        handleChange={e => setFieldValue('completionDate', e)} />
                                </div>
                                <div className="linebylineInput valid-input">
                                    <DatePicker title='docDate'
                                        format={'DD/MM/YYYY'}
                                        name="documentDate"
                                        startDate={values.docDate}
                                        handleChange={e => setFieldValue('docDate', e)}
                                    />
                                </div>
                                <div className="linebylineInput valid-input">
                                    <Dropdown
                                        title="currency"
                                        data={this.state.currency}
                                        selectedValue={this.state.selectedCurrency}
                                        handleChange={event => {
                                            this.setState({ selectedCurrency: event })
                                        }}
                                        name="currency"
                                        index="currency" />
                                </div>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.tax[currentLanguage]}</label>
                                    <div className={"inputDev ui input " + (errors.tax ? 'has-error' : !errors.tax && touched.tax ? (" has-success") : " ")}>
                                        <input type="text" className="form-control" id="tax"
                                            defaultValue={0}
                                            onBlur={handleBlur}
                                            onChange={e => handleChange(e)}
                                            name="tax"
                                            placeholder={Resources.tax[currentLanguage]}
                                        />
                                        {errors.tax ? (<em className="pError">{errors.tax}</em>) : null}
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.vat[currentLanguage]}</label>
                                    <div className={"inputDev ui input " + (errors.vat ? 'has-error' : !errors.vat && touched.vat ? (" has-success") : " ")}>
                                        <input type="text" className="form-control" id="vat"
                                            defaultValue={0}
                                            onBlur={handleBlur}
                                            onChange={e => handleChange(e)}
                                            name="vat"
                                            placeholder={Resources.vat[currentLanguage]}
                                        />
                                        {errors.vat ? (<em className="pError">{errors.vat}</em>) : null}
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.advancedPayment[currentLanguage]}</label>
                                    <div className={"inputDev ui input " + (errors.advancedPayment ? 'has-error' : !errors.advancedPayment && touched.advancedPayment ? (" has-success") : " ")}>
                                        <input type="text" className="form-control" id="advancedPayment"
                                            defaultValue={0}
                                            onBlur={handleBlur}
                                            onChange={e => handleChange(e)}
                                            name="advancedPayment"
                                            placeholder={Resources.advancedPayment[currentLanguage]}
                                        />
                                        {errors.advancedPayment ? (<em className="pError">{errors.advancedPayment}</em>) : null}
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.retainage[currentLanguage]}</label>
                                    <div className={"inputDev ui input " + (errors.retainage ? 'has-error' : !errors.retainage && touched.retainage ? (" has-success") : " ")}>
                                        <input type="text" className="form-control" id="retainage"
                                            defaultValue={0}
                                            onBlur={handleBlur}
                                            onChange={e => handleChange(e)}
                                            name="retainage"
                                            placeholder={Resources.retainage[currentLanguage]}
                                        />
                                        {errors.retainage ? (<em className="pError">{errors.retainage}</em>) : null}
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.insurance[currentLanguage]}</label>
                                    <div className={"inputDev ui input " + (errors.insurance ? 'has-error' : !errors.insurance && touched.insurance ? (" has-success") : " ")}>
                                        <input type="text" className="form-control" id="insurance"
                                            defaultValue={0}
                                            name="insurance"
                                            onBlur={handleBlur}
                                            onChange={e => handleChange(e)}
                                            placeholder={Resources.insurance[currentLanguage]}
                                        />
                                        {errors.insurance ? (<em className="pError">{errors.insurance}</em>) : null}
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.advancedPaymentAmount[currentLanguage]}</label>
                                    <div className={"inputDev ui input " + (errors.advancedPaymentAmount ? 'has-error' : !errors.advancedPaymentAmount && touched.advancedPaymentAmount ? (" has-success") : " ")}>
                                        <input type="text" className="form-control" id="advancedPaymentAmount"
                                            defaultValue={0}
                                            onBlur={handleBlur}
                                            onChange={e => handleChange(e)}
                                            name="advancedPaymentAmount"
                                            placeholder={Resources.advancedPaymentAmount[currentLanguage]}
                                        />
                                        {errors.advancedPaymentAmount ? (<em className="pError">{errors.advancedPaymentAmount}</em>) : null}
                                    </div>
                                </div>
                                <div className={"slider-Btns fullWidthWrapper textLeft "}>
                                    {this.state.isLoading === false ? (
                                        <button className={"primaryBtn-1 btn " + (this.state.isApproveMode === true ? 'disabled' : '')} type="submit" disabled={this.state.isApproveMode} >{Resources.save[currentLanguage]}</button>
                                    ) :
                                        (
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

        </React.Fragment >
        const purchaseOrderContent = <React.Fragment>
            <div className="document-fields">
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        subject: this.props.changeStatus ? this.props.document.subject : '',
                        reference: 1,
                        completionDate: moment(),
                        docDate: this.props.changeStatus ? this.props.document.documentDate : moment(),
                        status: this.props.document.status ? this.props.document.status : true,
                        useItemization: false,
                        useRevised: false,
                        advancedPaymentPercent: 0
                    }}
                    validationSchema={purchaseSchema}
                    onSubmit={(values) => {
                        this.addPurchaseOrder(values)
                    }}
                >
                    {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange, values }) => (
                        <Form id="signupForm1" className="proForm datepickerContainer customProform" noValidate="novalidate" >

                            <div className="proForm first-proform">
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources['subject'][currentLanguage]} </label>
                                    <div className={"inputDev ui input " + (errors.subject ? 'has-error' : !errors.subject && touched.subject ? (" has-success") : " ")}>
                                        <input name='subject'
                                            className="form-control"
                                            id="subject" placeholder={Resources['subject'][currentLanguage]} autoComplete='off'
                                            onBlur={handleBlur} defaultValue={values.subject}
                                            onChange={e => { handleChange(e) }} />
                                        {errors.subject ? (<em className="pError">{errors.subject}</em>) : null}
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
                            <div className="proForm datepickerContainer">
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.reference[currentLanguage]}</label>
                                    <div className="ui input inputDev"  >
                                        <input type="text" className="form-control" id="reference" readOnly
                                            defaultValue={values.reference}
                                            name="reference"
                                            placeholder={Resources.reference[currentLanguage]}
                                        />
                                    </div>
                                </div>

                                <div className="linebylineInput valid-input">
                                    <DatePicker title='completionDate'
                                        format={'DD/MM/YYYY'}
                                        name="completionDate"
                                        startDate={values.completionDate}
                                        handleChange={e => setFieldValue('completionDate', e)} />
                                </div>
                                <div className="linebylineInput valid-input">
                                    <DatePicker title='docDate'
                                        format={'DD/MM/YYYY'}
                                        name="documentDate"
                                        startDate={this.state.document.documentDate}
                                        handleChange={e => setFieldValue('documentDate', e)} />
                                </div>


                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.advancedPayment[currentLanguage]}</label>
                                    <div className={"inputDev ui input " + (errors.advancedPaymentPercent ? 'has-error' : !errors.advancedPaymentPercent && touched.advancedPaymentPercent ? (" has-success") : " ")}>
                                        <input type="text" className="form-control" id="advancedPaymentPercent"
                                            defaultValue={values.advancedPaymentPercent}
                                            name="advancedPaymentPercent"
                                            placeholder={Resources.advancedPayment[currentLanguage]}
                                            onChange={(e) => { handleChange(e); setFieldValue('advancedPaymentPercent', e.target.value) }} />
                                        {errors.advancedPaymentPercent ? (<em className="pError">{errors.advancedPaymentPercent}</em>) : null}
                                    </div>
                                </div>
                                <div className="fullWidthWrapper account__checkbox">
                                    <div className="proForm fullLinearInput">
                                        <div className="linebylineInput">
                                            <label className="control-label">{Resources.useItemization[currentLanguage]}</label>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio" name="useItemization" defaultChecked={values.useItemization === false ? null : 'checked'} value="true" onChange={() => setFieldValue('useItemization', true)} />
                                                <label>{Resources.yes[currentLanguage]}</label>
                                            </div>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio" name="useItemization" defaultChecked={values.useItemization === false ? 'checked' : null} value="false" onChange={() => setFieldValue('useItemization', false)} />
                                                <label>{Resources.no[currentLanguage]}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="proForm fullLinearInput">
                                        <div className="linebylineInput">
                                            <label className="control-label">{Resources.useRevised[currentLanguage]}</label>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio" name="useRevised" defaultChecked={values.useRevised === false ? null : 'checked'} value="true" onChange={() => setFieldValue('useRevised', true)} />
                                                <label>{Resources.yes[currentLanguage]}</label>
                                            </div>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio" name="useRevised" defaultChecked={values.useRevised === false ? 'checked' : null} value="false" onChange={() => setFieldValue('useRevised', false)} />
                                                <label>{Resources.no[currentLanguage]}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <Dropdown
                                        title="currency"
                                        data={this.state.currency}
                                        selectedValue={this.state.selectedCurrency}
                                        handleChange={event => {
                                            this.setState({ selectedCurrency: event })
                                        }}
                                        name="currency"
                                        index="currency" />
                                </div>
                                <div className={"slider-Btns fullWidthWrapper textLeft "}>
                                    {this.state.isLoading === false ? (
                                        <button className={"primaryBtn-1 btn " + (this.state.isApproveMode === true ? 'disabled' : '')} type="submit" disabled={this.state.isApproveMode} >{Resources[this.state.btnText][currentLanguage]}</button>
                                    ) :
                                        (
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
        </React.Fragment >

        const addItemContent = <React.Fragment>
            <div className="document-fields">
                {this.state.isLoading ? <LoadingSection /> : null}
                <AddItemDescription docLink="/Downloads/Excel/BOQ.xlsx"
                    showImportExcel={false} docType="boq"
                    isViewMode={this.state.isViewMode}
                    mainColumn="boqId" addItemApi="AddBoqItem"
                    projectId={this.state.projectId}
                    showItemType={true} />

            </div>
        </React.Fragment >

        const itemsContent = <React.Fragment>
            <div className="document-fields">
                {this.state.isLoading ? <LoadingSection /> : null}
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        description: this.state.items.description,
                        unit: this.state.selectedUnit.value != 0 ? this.state.selectedUnit : '',
                        itemType: this.state.selectedItemType.value > 0 ? this.state.selectedItemType : '',
                        itemCode: this.state.items.itemCode,
                        resourceCode: this.state.items.resourceCode,
                        days: this.state.items.days
                    }}
                    validationSchema={itemsValidationSchema}
                    onSubmit={(values) => {
                        this.addEditItems()
                    }}
                >
                    {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                        <Form id="signupForm1" className="proForm datepickerContainer customProform" noValidate="novalidate" >

                            <div className="letterFullWidth proForm  first-proform">
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources['description'][currentLanguage]} </label>
                                    <div className={"inputDev ui input " + (errors.description ? 'has-error' : !errors.description && touched.description ? (" has-success") : " ")}>
                                        <input name='description'
                                            className="form-control"
                                            id="description" placeholder={Resources['description'][currentLanguage]} autoComplete='off'
                                            onBlur={handleBlur} value={this.state.items.description}
                                            onChange={e => { handleChange(e); this.setState({ items: { ...this.state.items, description: e.target.value } }) }} />
                                        {errors.description ? (<em className="pError">{errors.description}</em>) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="proForm datepickerContainer">
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                    <div className="ui input inputDev"  >
                                        <input type="text" className="form-control" id="arrange" readOnly
                                            value={this.state.items.arrange}
                                            name="arrange"
                                            placeholder={Resources.arrange[currentLanguage]}
                                            onChange={(e) => this.handleChange(e, 'arrange')} />
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.quantity[currentLanguage]}</label>
                                    <div className={"inputDev ui input " + (errors.quantity ? 'has-error' : !errors.quantity && touched.quantity ? (" has-success") : " ")}>
                                        <input type="text" className="form-control" id="quantity"
                                            value={this.state.items.quantity}
                                            name="quantity"
                                            placeholder={Resources.quantity[currentLanguage]}
                                            onBlur={handleBlur}
                                            onChange={(e) => { handleChange(e); this.setState({ items: { ...this.state.items, quantity: e.target.value } }) }} />
                                        {errors.quantity ? (<em className="pError">{errors.quantity}</em>) : null}
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <Dropdown
                                        title="unit"
                                        data={this.state.Units}
                                        selectedValue={this.state.selectedUnit}
                                        handleChange={event => {
                                            this.setState({ selectedUnit: event })
                                        }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.unit}
                                        touched={touched.unit}
                                        name="unit"
                                        index="unit" />
                                </div>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.unitPrice[currentLanguage]}</label>
                                    <div className={"inputDev ui input " + (errors.unitPrice ? 'has-error' : !errors.unitPrice && touched.unitPrice ? (" has-success") : " ")}>
                                        <input type="text" className="form-control" id="unitPrice"
                                            value={this.state.items.unitPrice}
                                            name="unitPrice"
                                            onBlur={handleBlur}
                                            placeholder={Resources.unitPrice[currentLanguage]}
                                            onChange={(e) => { handleChange(e); this.setState({ items: { ...this.state.items, unitPrice: e.target.value } }) }} />
                                        {errors.unitPrice ? (<em className="pError">{errors.unitPrice}</em>) : null}
                                    </div>
                                </div>
                                <div className="letterFullWidth">
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources['itemCode'][currentLanguage]} </label>
                                        <div className={"inputDev ui input " + (errors.itemCode ? 'has-error' : !errors.itemCode && touched.itemCode ? (" has-success") : " ")}>
                                            <input name='itemCode'
                                                className="form-control"
                                                id="itemCode" placeholder={Resources['itemCode'][currentLanguage]} autoComplete='off'
                                                onBlur={e => {
                                                    handleBlur(e);
                                                    this.checkItemCode(e.target.value)
                                                }}
                                                value={this.state.items.itemCode}
                                                onChange={e => {
                                                    handleChange(e);
                                                    this.setState({ items: { ...this.state.items, itemCode: e.target.value } });
                                                }} />
                                            {errors.itemCode ? (<em className="pError">{errors.itemCode}</em>) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <Dropdown
                                        title="boqType"
                                        data={this.state.boqTypes}
                                        selectedValue={this.state.selectedBoqType}
                                        handleChange={event => {
                                            this.fillSubDropDown('GetAllBoqChild', 'parentId', event.value, 'title', 'id', 'BoqSubTypes', 'BoqTypeChilds')
                                            this.setState({
                                                selectedBoqType: event,
                                                selectedBoqTypeChild: { label: Resources.boqTypeChild[currentLanguage], value: "0" },
                                                selectedBoqSubType: { label: Resources.boqSubType[currentLanguage], value: "0" },
                                            })
                                        }}
                                        name="boqType"
                                        index="boqType" />
                                </div>
                                <div className="linebylineInput valid-input">
                                    <Dropdown
                                        title="boqTypeChild"
                                        data={this.state.BoqTypeChilds}
                                        selectedValue={this.state.selectedBoqTypeChild}
                                        handleChange={event => {
                                            this.setState({ selectedBoqTypeChild: event })
                                        }}
                                        name="boqTypeChild"
                                        index="boqTypeChild" />
                                </div>
                                <div className="letterFullWidth">
                                    <div className="linebylineInput valid-input">
                                        <Dropdown
                                            title="boqSubType"
                                            data={this.state.BoqSubTypes}
                                            selectedValue={this.state.selectedBoqSubType}
                                            handleChange={event => {
                                                this.setState({ selectedBoqSubType: event })
                                            }}
                                            name="boqSubType"
                                            index="boqSubType" />
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources['resourceCode'][currentLanguage]} </label>
                                    <div className={"inputDev ui input " + (errors.resourceCode ? 'has-error' : !errors.resourceCode && touched.resourceCode ? (" has-success") : " ")}>
                                        <input name='resourceCode'
                                            className="form-control"
                                            id="resourceCode" placeholder={Resources['resourceCode'][currentLanguage]} autoComplete='off'
                                            onBlur={handleBlur} value={this.state.items.resourceCode}
                                            onChange={e => { handleChange(e); this.setState({ items: { ...this.state.items, resourceCode: e.target.value } }) }} />
                                        {errors.resourceCode ? (<em className="pError">{errors.resourceCode}</em>) : null}
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <Dropdown
                                        title="itemType"
                                        data={this.state.itemTypes}
                                        selectedValue={this.state.selectedItemType}
                                        handleChange={event => {
                                            this.setState({ selectedItemType: event })
                                        }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.itemType}
                                        touched={touched.itemType}
                                        name="itemType"
                                        index="itemType" />
                                </div>
                                {this.state.selectedItemType.label == 'Equipment' || this.state.selectedItemType.label == 'Labor' ?
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources['days'][currentLanguage]} </label>
                                        <div className={"inputDev ui input " + (errors.days ? 'has-error' : !errors.days && touched.days ? (" has-success") : " ")}>
                                            <input name='days'
                                                className="form-control"
                                                id="days" placeholder={Resources['days'][currentLanguage]} autoComplete='off'
                                                onBlur={handleBlur} value={this.state.items.days}
                                                onChange={e => { handleChange(e); this.setState({ items: { ...this.state.items, days: e.target.value } }) }} />
                                            {errors.days ? (<em className="pError">{errors.days}</em>) : null}
                                        </div>
                                    </div> : null}
                                {this.state.selectedItemType.label == 'Equipment' || (this.state.selectedequipmentType.value > 0 && this.state.showPopUp) ?
                                    <div className="linebylineInput valid-input">
                                        <Dropdown
                                            title="equipmentType"
                                            data={this.state.equipmentTypes}
                                            selectedValue={this.state.selectedequipmentType}
                                            handleChange={event => {
                                                this.setState({ selectedequipmentType: event })
                                            }}
                                            name="equipmentType"
                                            index="equipmentType" />
                                    </div> : null}
                                <div className={"slider-Btns fullWidthWrapper textLeft "}>
                                    {this.state.isLoading === false ? (
                                        <button className={this.state.isViewMode === true ? "primaryBtn-1 btn  disNone" : "primaryBtn-1 btn "} type="submit" >{Resources[this.state.btnText][currentLanguage]}</button>
                                    ) :
                                        (
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
        </React.Fragment >

        const BoqTypeContent = <React.Fragment>
            <div className="dropWrapper">
                {this.state.isLoading ? <LoadingSection /> : null}
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        boqType: '',
                        boqChild: '',
                        boqSubType: ''
                    }}
                    validationSchema={BoqTypeSchema}
                    onSubmit={(values) => {
                        this.assignBoqType()
                    }}
                >
                    {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                        <Form id="signupForm1" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                            <div className="fullWidthWrapper textLeft">
                                <Dropdown
                                    title="boqType"
                                    data={this.state.boqTypes}
                                    selectedValue={this.state.selectedBoqTypeEdit}
                                    handleChange={event => {
                                        this.fillSubDropDown('GetAllBoqChild', 'parentId', event.value, 'title', 'id', 'BoqSubTypes', 'BoqTypeChilds')
                                        this.setState({
                                            selectedBoqTypeEdit: event,
                                            selectedBoqTypeChildEdit: { label: Resources.boqTypeChild[currentLanguage], value: "0" },
                                            selectedBoqSubTypeEdit: { label: Resources.boqSubType[currentLanguage], value: "0" },
                                        })
                                    }}
                                    onChange={setFieldValue}
                                    onBlur={setFieldTouched}
                                    error={errors.boqType}
                                    touched={touched.boqType}
                                    name="boqType"
                                    index="boqType" />
                            </div>
                            <Dropdown
                                title="boqTypeChild"
                                data={this.state.BoqTypeChilds}
                                selectedValue={this.state.selectedBoqTypeChildEdit}
                                handleChange={event => {
                                    this.setState({ selectedBoqTypeChildEdit: event })
                                }}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.boqChild}
                                touched={touched.boqChild}
                                name="boqChild"
                                index="boqChild" />
                            <Dropdown
                                title="boqSubType"
                                data={this.state.BoqSubTypes}
                                selectedValue={this.state.selectedBoqSubTypeEdit}
                                handleChange={event => {
                                    this.setState({ selectedBoqSubTypeEdit: event })
                                }}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.boqSubType}
                                touched={touched.boqSubType}
                                name="boqSubType"
                                index="boqSubType" />

                            <div className={"slider-Btns fullWidthWrapper"}>
                                <button className={this.state.isViewMode === true ? "primaryBtn-1 btn  disNone" : "primaryBtn-1 btn "} type="submit" >{Resources[this.state.btnText][currentLanguage]}</button>
                            </div>

                        </Form>
                    )}
                </Formik>
            </div>
        </React.Fragment >
        let actions = [
            { title: "distributionList", value: <Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["distributionList"][currentLanguage] },
            { title: "sendToWorkFlow", value: <SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["sendToWorkFlow"][currentLanguage] },
            {
                title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={true}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]
            }, {
                title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={false}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]
            }
        ];
        let Step_1 = <React.Fragment>
            <div id="step1" className="step-content-body">
                <div className="subiTabsContent">
                    <div className="document-fields">
                        <Formik
                            initialValues={{
                                subject: this.props.changeStatus ? this.state.document.subject : '',
                                fromCompany: this.state.selectedFromCompany.value > 0 ? this.state.selectedFromCompany.value : '',
                                discipline: this.state.selectedDiscipline.value > 0 ? this.state.selectedDiscipline.value : '',
                                status: this.props.changeStatus ? this.props.document.status : true,
                                documentDate: this.props.changeStatus ? this.props.document.documentDate : moment(),
                                showInSiteRequest: this.props.changeStatus ? this.props.document.showInSiteRequest : false,
                                showOptimization: this.props.changeStatus ? this.props.document.showOptimization : false,
                            }}
                            validationSchema={poqSchema}
                            enableReinitialize={this.props.changeStatus}
                            onSubmit={(values) => {
                                if (this.props.changeStatus === true && this.state.docId > 0) {
                                    this.editBoq(values);
                                } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                    this.addPoq(values);
                                }
                                else if (this.props.changeStatus === false && this.state.docId > 0) {
                                    this.NextStep();
                                }
                            }}  >
                            {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched, values }) => (
                                <Form id="ClientSelectionForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                    <div className="proForm first-proform">
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['subject'][currentLanguage]} </label>
                                            <div className={"inputDev ui input " + (errors.subject ? 'has-error' : !errors.subject && touched.subject ? (" has-success") : " ")}>
                                                <input name='subject'
                                                    className="form-control"
                                                    id="subject" placeholder={Resources['subject'][currentLanguage]} autoComplete='off'
                                                    onBlur={handleBlur} defaultValue={values.subject}
                                                    onChange={e => { handleChange(e); }} />
                                                {errors.subject ? (<em className="pError">{errors.subject}</em>) : null}
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

                                    <div className="proForm datepickerContainer">

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                            <div className="ui input inputDev"  >
                                                <input type="text" className="form-control" id="arrange" readOnly
                                                    defaultValue={this.state.document.arrange}
                                                    name="arrange"
                                                    placeholder={Resources.arrange[currentLanguage]}
                                                />
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <DatePicker title='docDate'
                                                format={'DD/MM/YYYY'}
                                                name="documentDate"
                                                startDate={values.documentDate}
                                                handleChange={e => { handleChange(e); setFieldValue('documentDate', e) }} />
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <Dropdown
                                                title="fromCompany"
                                                data={this.state.Companies}
                                                selectedValue={this.state.selectedFromCompany}
                                                handleChange={event => {
                                                    this.setState({ selectedFromCompany: event })
                                                }}
                                                onChange={setFieldValue}
                                                onBlur={setFieldTouched}
                                                error={errors.fromCompany}
                                                touched={touched.fromCompany}
                                                name="fromCompany"
                                                index="fromCompany" />
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <Dropdown
                                                title="discipline"
                                                data={this.state.Disciplines}
                                                selectedValue={this.state.selectedDiscipline}
                                                handleChange={event => {
                                                    this.setState({ selectedDiscipline: event })
                                                }}
                                                onChange={setFieldValue}
                                                onBlur={setFieldTouched}
                                                error={errors.discipline}
                                                touched={touched.discipline}
                                                name="discipline"
                                                index="discipline" />
                                        </div>

                                        <div className="fullWidthWrapper account__checkbox">
                                            <div className="proForm fullLinearInput">
                                                <div className="linebylineInput">
                                                    <label className="control-label">{Resources.showInSiteRequest[currentLanguage]}</label>
                                                    <div className="ui checkbox radio radioBoxBlue">
                                                        <input type="radio" name="showInSiteRequest" defaultChecked={values.showInSiteRequest === false ? null : 'checked'} value="true" onChange={() => setFieldValue('showInSiteRequest', true)} />
                                                        <label>{Resources.yes[currentLanguage]}</label>
                                                    </div>
                                                    <div className="ui checkbox radio radioBoxBlue">
                                                        <input type="radio" name="showInSiteRequest" defaultChecked={values.showInSiteRequest === false ? 'checked' : null} value="false" onChange={() => setFieldValue('showInSiteRequest', false)} />
                                                        <label>{Resources.no[currentLanguage]}</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="proForm fullLinearInput">
                                                <div className="linebylineInput">
                                                    <label className="control-label">{Resources.showOptemization[currentLanguage]}</label>
                                                    <div className="ui checkbox radio radioBoxBlue">
                                                        <input type="radio" name="showOptimization" defaultChecked={values.showOptimization === false ? null : 'checked'} value="true" onChange={() => setFieldValue('showOptimization', true)} />
                                                        <label>{Resources.yes[currentLanguage]}</label>
                                                    </div>
                                                    <div className="ui checkbox radio radioBoxBlue">
                                                        <input type="radio" name="showOptimization" defaultChecked={values.showOptimization === false ? 'checked' : null} value="false" onChange={() => setFieldValue('showOptimization', false)} />
                                                        <label>{Resources.no[currentLanguage]}</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className={"slider-Btns fullWidthWrapper textLeft "}>

                                            {this.state.isLoading === false ? (
                                                <button className={"primaryBtn-1 btn " + (this.state.isApproveMode === true ? 'disNone' : '')} type="submit" disabled={this.state.isApproveMode}  >{Resources[this.state.btnTxt][currentLanguage]}</button>
                                            ) :
                                                (
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
                                {this.state.docId > 0 ?
                                    <UploadAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                    : null
                                }
                                {this.viewAttachments()}

                                {this.props.changeStatus === true ?
                                    <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                    : null
                                }
                            </div>
                        </div>
                    </div>


                </div>
            </div>

        </React.Fragment>
        let Step_2 = <React.Fragment>
            {addItemContent}
            <Fragment>
                <XSLfile key='boqImport' docId={this.state.docId} docType='boq' link={IPConfig.downloads + '/Downloads/Excel/BOQ.xlsx'} header='addManyItems'
                    disabled={this.props.changeStatus ? (this.props.document.contractId > 0 ? true : false) : false} afterUpload={() => this.getTabelData()} />
            </Fragment>
            {this.state.isCompany ?
                <Fragment>
                    <XSLfile key='boqStructure' docId={this.state.docId} docType='boq2' link={IPConfig.downloads + '/Downloads/Excel/BOQ2.xlsx'} header='addManyItems'
                        disabled={this.props.changeStatus ? (this.props.document.contractId > 0 ? true : false) : false} afterUpload={() => this.getTabelData()} />
                </Fragment> : null}
            <div className="doc-pre-cycle letterFullWidth">
                <header><h2 className="zero">{Resources.itemList[currentLanguage]}</h2></header>
                <div className='precycle-grid'>
                    <div className="grid-container">
                        {ItemsGrid}
                    </div>
                    <div className="slider-Btns">
                        <button className="primaryBtn-1 btn meduimBtn  " type="submit" onClick={this.NextStep}>{Resources.next[currentLanguage]}</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
        let Step_3 = <React.Fragment>
            {this.state.loadingContractPurchase ? <LoadingSection /> : null}
            <div className="company__total proForm">
                <div className="form-group ">
                    <label className="control-label">{Resources.company[currentLanguage]}</label>
                    <div className="ui right labeled input">
                        <input autoComplete="off" type="text" value={this.props.document.subject} readOnly data-toggle="tooltip" title="procoor Company" />
                        <span className="total_money">{Resources.total[currentLanguage]}</span>
                        <div className="ui basic label greyLabel"> {this.props.document.total}</div>
                    </div>
                </div>
                <ul id="stepper__tabs" className="data__tabs">
                    <li className={" data__tabs--list " + (this.state.activeTab == 'contract' ? "active" : '')} onClick={() => this.changeTab('contract')}>{Resources.contract[currentLanguage]}</li>
                    <li className={"data__tabs--list " + (this.state.activeTab == 'purchase' ? "active" : '')} onClick={() => this.changeTab('purchase')}>{Resources.po[currentLanguage]}</li>
                </ul>
            </div>
            {this.state.activeTab == 'purchase' ? <React.Fragment>{purchaseOrderContent}</React.Fragment> : (this.state.activeTab == 'contract' ? <React.Fragment>{contractContent}</React.Fragment> : null)}
            <div className="doc-pre-cycle letterFullWidth">
                <div className='precycle-grid'>
                    <div className="slider-Btns">
                        <button className="primaryBtn-1 btn meduimBtn  " type="submit" onClick={this.NextStep}>{Resources.next[currentLanguage]}</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
        return (
            <React.Fragment>
                <div className="mainContainer">
                    <div className={this.state.isViewMode === true && this.state.CurrStep != 3 ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                        <div className="submittalHead">
                            <h2 className="zero">{Resources.boq[currentLanguage]}
                                <span>{projectName.replace(/_/gi, ' ')} {Resources.contracts[currentLanguage]}</span>
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

                            <div className="step-content">
                                {this.state.LoadingPage ? <LoadingSection /> :
                                    <Fragment>
                                        {this.state.CurrStep == 1 ? Step_1 : (this.state.CurrStep == 2 ? Step_2 : Step_3)}
                                        <div className="largePopup largeModal " style={{ display: this.state.showPopUp ? 'block' : 'none' }}>
                                            <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog1 = ref}
                                                title={Resources.editTitle[currentLanguage] + ' - ' + Resources.edit[currentLanguage]}
                                                beforeClose={this._executeBeforeModalClose}
                                                beforeOpen={this._executeBeforeModalOpen}>
                                                {itemsContent}
                                            </SkyLight>
                                        </div>

                                        {this.props.changeStatus === true ?
                                            <div className="approveDocument">
                                                <div className="approveDocumentBTNS">
                                                    {this.state.isApproveMode === true ?

                                                        <div >
                                                            <button type='button' className="primaryBtn-1 btn " onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button >
                                                            <button type='button' className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>
                                                        </div>
                                                        : null}
                                                    <button type='button' className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[1])}>{Resources.sendToWorkFlow[currentLanguage]}</button>
                                                    <button type='button' className="primaryBtn-2 btn" onClick={(e) => this.handleShowAction(actions[0])}>{Resources.distributionList[currentLanguage]}</button>
                                                    <span className="border"></span>
                                                    <div className="document__action--menu">
                                                        <OptionContainer permission={this.state.permission} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                    </div>

                                                </div>
                                            </div>
                                            : null
                                        }
                                    </Fragment>
                                }
                            </div>
                            <div>
                                <div className="docstepper-levels">
                                    <div className="step-content-foot">
                                        <span onClick={this.PreviousStep} className={(this.props.changeStatus == true && this.state.CurrStep > 1) ? "step-content-btn-prev " :
                                            "step-content-btn-prev disabled"}><i className="fa fa-caret-left" aria-hidden="true"></i>Previous</span>
                                        <span onClick={this.NextStep} className={this.state.CurrStep < 3 && this.state.docId > 0 ? "step-content-btn-prev "
                                            : "step-content-btn-prev disabled"}>Next<i className="fa fa-caret-right" aria-hidden="true"></i>
                                        </span>
                                    </div>
                                    <div className="workflow-sliderSteps">
                                        <div className="step-slider">
                                            <div data-id="step1" className={'step-slider-item ' + (this.state.CurrStep == 1 ? 'current__step' : this.state.firstComplete ? "active" : "")} >
                                                <div className="steps-timeline">
                                                    <span>1</span>
                                                </div>
                                                <div className="steps-info">
                                                    <h6>{Resources.boq[currentLanguage]}</h6>
                                                </div>
                                            </div>
                                            <div data-id="step2 " className={'step-slider-item ' + (this.state.CurrStep == 2 ? 'current__step' : this.state.secondComplete ? "active" : "")} >
                                                <div className="steps-timeline">
                                                    <span>2</span>
                                                </div>
                                                <div className="steps-info">
                                                    <h6 >{Resources.items[currentLanguage]}</h6>
                                                </div>
                                            </div>
                                            <div data-id="step3" className={this.state.CurrStep == 3 ? "step-slider-item  current__step" : "step-slider-item"}>
                                                <div className="steps-timeline">
                                                    <span>3</span>
                                                </div>
                                                <div className="steps-info">
                                                    <h6>{Resources.changeBoqIntoContractOrPO[currentLanguage]}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={Resources['smartDeleteMessage'][currentLanguage].content}
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                        />
                    ) : null}
                    <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                        <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                            {this.state.currentComponent}
                        </SkyLight>
                    </div>

                    <div className="largePopup largeModal " style={{ display: this.state.showBoqModal ? 'block' : 'none' }}>
                        <SkyLight hideOnOverlayClicked ref={ref => this.boqTypeModal = ref} title={Resources.boqType[currentLanguage]}>
                            {BoqTypeContent}
                        </SkyLight>
                    </div>
                </div>
            </React.Fragment>
        )
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
        items: state.communication.items
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(bogAddEdit))