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
import Recycle from '../../Styles/images/attacheRecycle.png'
import 'react-table/react-table.css'
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal'
import Dataservice from '../../Dataservice';
import GridSetup from "../Communication/GridSetup";
import { func } from 'prop-types';

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
    days: Yup.number().required(Resources['daysRequired'][currentLanguage]),
});
const topicsValidationSchema = Yup.object().shape({
    itemDescription: Yup.string().required(Resources['descriptionRequired'][currentLanguage]),
    actionByContact: Yup.string().required(Resources['actionByContactRequired'][currentLanguage])

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

        this.topicColumns = [
            {
                key: "no",
                name: Resources["no"][currentLanguage],
                visible: true,
                width: 50,
            },
            {
                key: "description",
                name: Resources["itemDescription"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "decision",
                name: Resources["decisions"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "action",
                name: Resources["action"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "comment",
                name: Resources["comment"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ];

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
            }
        ];

        this.state = {
            showForm: false,
            docTypeId: 35,
            topic: {
                topics: [],
                itemDescription: '',
                decision: '',
                comment: '',
                requiredDate: moment(),
                id: 0
            },
            actionByContacts: [],
            selectedActionByContact: { label: Resources.toContactRequired[currentLanguage], value: 0 },
            selectedActionByCompany: { label: Resources.toCompanyRequired[currentLanguage], value: 0 },
            selectedRow: '',
            attendees: [],
            attendeesId: 0,
            attendencesContacts: [],
            currentComponent_2: 'attendeesContact',
            pageSize: 50,
            agendaId: 0,
            btnTxt: 'save',
            CurrStep: 2,
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
            btnText: 'add',



            contractId: 0,
            Companies: [],
            Disciplines: [],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedDiscipline: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
            tableItems: [],
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



            calledContacts: [],
            facilitatorContacts: [],
            noteTakerContacts: [],
            selectedTopicContact: { label: Resources.calledByContactRequired[currentLanguage], value: "0" },
            selectedTopicCompany: { label: Resources.calledByContactRequired[currentLanguage], value: "0" },
            selectedCalledByCompany: { label: Resources.calledByCompanyRequired[currentLanguage], value: "0" },
            selectedCalledByContact: { label: Resources.calledByContactRequired[currentLanguage], value: "0" },
            selectedFacilitatorCompany: { label: Resources.facilitatorCompanyRequired[currentLanguage], value: "0" },
            selectedFacilitatorContact: { label: Resources.facilitatorContactReuired[currentLanguage], value: "0" },
            selectedNoteTakerCompany: { label: Resources.noteTakerCompanyReuired[currentLanguage], value: "0" },
            selectedNoteTakerContact: { label: Resources.noteTakerContactRequired[currentLanguage], value: "0" },
            isLoading: true,
            permission: [{ name: 'sendByEmail', code: 458 }, { name: 'sendByInbox', code: 457 },
            { name: 'sendTask', code: 0 }, { name: 'distributionList', code: 967 },
            { name: 'createTransmittal', code: 3055 }, { name: 'sendToWorkFlow', code: 719 },
            { name: 'viewAttachments', code: 3324 }, { name: 'deleteAttachments', code: 838 }],
            document: {},
        }
        if (!Config.IsAllow(452) || !Config.IsAllow(453) || !Config.IsAllow(455)) {
            toast.warning(Resources['missingPermissions'][currentLanguage])
            this.props.history.push({ pathname: "/InternalMeetingMinutes/" + projectId });
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(453) || this.props.document.contractId == 0 || this.props.document.contractId == null) {
                this.setState({ isViewMode: true });
            }
            else if (this.state.isApproveMode != true && Config.IsAllow(453)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(453)) {
                    if (this.props.document.status != false && Config.IsAllow(453)) {
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

        DataService.GetDataList('GetAccountsDefaultList?listType=discipline&pageNumber=0&pageSize=10000', 'listType', 'id').then(res => {
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

        DataService.GetDataList('GetDefaultListForUnit?listType=unit', 'listType', 'id').then(res => {
            this.setState({ Units: [...res], isLoading: false })
        })

        DataService.GetDataList('GetAllBoqParentNull?projectId=' + this.state.projectId, 'title', 'id').then(res => {
            this.setState({ boqTypes: [...res], isLoading: false })
        })

        DataService.GetDataList('GetAccountsDefaultList?listType=estimationitemtype&pageNumber=0&pageSize=10000', 'title', 'id').then(res => {
            this.setState({ itemTypes: [...res], isLoading: false })
        })


        DataService.GetDataList('GetAccountsDefaultList?listType=equipmentType&pageNumber=0&pageSize=10000', 'title', 'id').then(res => {
            this.setState({ equipmentTypes: [...res], isLoading: false })
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
        if (this.state.docId > 0) {
            this.setState({ isLoading: true })
            this.props.actions.documentForEdit('GetBoqForEdit?id=' + this.state.docId).then(() => {
                this.setState({ isLoading: false, showForm: true })
                this.checkDocumentIsView();
                this.getTabelData()
            })
        } else {

            let cmi = Config.getPayload().cmi
            Api.get('GetBoqNumber?projectId=' + + this.state.projectId + '&companyId=' + cmi).then(res => {
                this.setState({ document: { ...this.state.document, arrange: res }, isLoading: false })
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
        }

    }

    getTabelData() {
        let attendeesTable = []
        this.setState({ isLoading: true })
        this.props.actions.GetAttendeesTable('GetCommunicationMeetingAgendaAttendees?agendaId=' + this.state.agendaId).then(res => {
            this.props.attendees.forEach((element, index) => {
                console.log(element)
                attendeesTable.push({
                    id: element.Id, companyId: element.companyId, contactId: element.contactId, companyName: element.companyName, contactName: element.contactName
                })
            })
            this.setState({ attendees: attendeesTable })
            setTimeout(() => { this.setState({ isLoading: false }) }, 500)
        })

        let topicstable = []
        this.setState({ isLoading: true })
        this.props.actions.GetTopicsTable('GetCommunicationMeetingAgendaTopics?agendaId=' + this.state.agendaId).then(res => {
            this.props.topics.forEach((element, index) => {
                topicstable.push({
                    id: element.Id, no: index + 1, description: element.description, decision: element.decisions, action: element.action, comment: element.comment
                    , byWhomCompanyId: element.calledByCompanyId, byWhomContactId: element.calledByContactId, requiredDate: element.requiredDate
                })
            })
            this.setState({ topics: topicstable })
            setTimeout(() => { this.setState({ isLoading: false }) }, 500)
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }
    }

    componentWillReceiveProps(props, state) {
        if (props.document && props.document.id > 0) {
            this.setState({
                document: { ...props.document },
                step_1_Validation: poqSchema
            });
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

    addPoq = () => {
        this.setState({ isLoading: true })
        let documentObj = { ...this.state.document };
        documentObj.documentDate = moment(documentObj.documentDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        DataService.addObject('AddBoq', documentObj).then(result => {
            this.setState({
                docId: result.id,
                contractId: result.contractId,
                isLoading: false,
                selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
                selected: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
                btnTxt: 'next'
            })
            toast.success(Resources["operationSuccess"][currentLanguage]);
        })
    }
    editBoq = () => {
        this.setState({
            isLoading: true,
            firstComplete: true
        });
        Api.post('EditBoq', this.state.document).then(result => {
            this.setState({
                isLoading: false,
                CurrStep: this.state.CurrStep + 1
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    }
    addEditTopics = (edit) => {
        this.setState({ isLoading: true })
        let topic = {
            requiredDate: moment(this.state.topic.requiredDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            itemDescription: this.state.topic.itemDescription,
            agendaId: this.state.agendaId,
            decisions: this.state.topic.decision,
            action: this.state.topic.action,
            byWhomCompanyId: this.state.selectedActionByCompany.value,
            byWhomContactId: this.state.selectedActionByContact.value,
            comment: this.state.topic.comment,
            id: this.state.topic.id
        }
        let url = edit ? 'EditCommunicationMeetingAgendaTopics' : 'AddCommunicationMeetingAgendaTopics'
        Api.post(url, topic).then((res) => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            if (edit) {
                let id = this.state.topic.id
                let topics = _.filter(this.state.topics, function (x) { return x.id != id; });
                topics.push({
                    id: res.id, no: this.state.topics.length + 1, description: res.itemDescription, decision: res.decisions, action: res.action,
                    comment: res.comment, byWhomCompanyId: res.byWhomCompanyId, byWhomContactId: res.byWhomContactId, requiredDate: res.requiredDate
                })
                this.setState({ showPopUp: false, topics: topics })
            }
            else {
                let data = [...this.state.topics];
                data.push({
                    id: res.id, no: this.state.topics.length + 1, description: res.itemDescription, decision: res.decisions, action: res.action,
                    comment: res.comment, byWhomCompanyId: res.byWhomCompanyId, byWhomContactId: res.byWhomContactId, requiredDate: res.requiredDate
                })
                this.setState({ topics: data })
            }
            this.setState({
                topic: { itemDescription: '', action: '', comment: '', decision: '', requiredDate: moment() },
                selectedActionByContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
                selectedActionByCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
                isLoading: false,
                showPopUp: false,
                btnText: 'add'
            });
        })
    }
    addEditItems = () => {
        this.setState({ isLoading: true })
        let item = {
            id: this.state.items.id,
            boqId: 9502, //this.state.docId,
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
            itemType: this.state.selectedItemType.value,
            itemTypeLabel: this.state.selectedItemType.label,
            days: this.state.items.days,
            equipmentType: this.state.selectedequipmentType.value > 0 ? this.state.selectedequipmentType.value : '',
            equipmentTypeLabel: this.state.selectedequipmentType.value > 0 ? this.state.selectedequipmentType.label : '',
            editable: true,
            boqSubTypeId: this.state.selectedBoqSubType.value,
            boqSubType: this.state.selectedBoqSubType.label,
            boqTypeId: this.state.selectedBoqType.value,
            boqType: this.state.selectedBoqType.label,
            boqChildTypeId: this.state.selectedBoqTypeChild.value,
            boqTypeChild: this.state.selectedBoqTypeChild.label,
        }
        let url = this.state.showPopUp ? 'EditBoqItem' : 'AddBoqItem'
        Api.post(url, item).then((res) => {
            if (this.state.showPopUp) {
                let items = Object.assign(this.state.tableItems)
                this.state.tableItems.forEach((element, index) => {
                    if (element.id == this.state.items.id) {
                        item.id = this.state.items.id;
                        items[index] = item
                        this.setState({ tableItems: items }, function () {
                            toast.success(Resources["operationSuccess"][currentLanguage]);

                        })
                    }

                })
            }
            else {
                if (this.state.items.itemCode != null) {
                    let data = [...this.state.tableItems];
                    item.id = res.id;
                    data.push({
                        ...item
                    })
                    this.setState({
                        tableItems: data,
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
                let data = [...this.state.tableItems]
                data.forEach(element => {
                    data = data.filter(item => { return item.id != element.id });
                })
                this.setState({ tableItems: data, showDeleteModal: false, isLoading: false });
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }).catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
            })
        }
        if (this.state.CurrStep == 3) {
            Api.post('CommunicationMeetingAgendaTopicsDelete?id=' + this.state.selectedRow[0]).then((res) => {
                toast.success(Resources["operationSuccess"][currentLanguage]);
                let data = this.state.topics.filter(item => item.id != this.state.selectedRow[0]);
                this.setState({ topics: data, showDeleteModal: false, isLoading: false });
            })
        }

    }

    fillSubDropDownInEdit(url, param, value, subFieldId, subFieldName, subSelectedValue, subDatasource) {
        this.setState({ isLoading: true })
        let action = url + "?" + param + "=" + value
        DataService.GetDataList(action, 'contactName', 'id').then(result => {
            if (this.props.changeStatus === true) {
                let _SubFieldId = this.state.document[subFieldId];
                let _SubFieldName = this.state.document[subFieldName];
                let targetFieldSelected = { label: _SubFieldName, value: _SubFieldId };
                this.setState({
                    [subSelectedValue]: targetFieldSelected,
                    [subDatasource]: result,
                    isLoading: false
                });
            }
        });
    }

    updateSelectedValue = (selected, label, value, targetSelected) => {
        this.setState({ isLoading: true })
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[value] = selected.value;
        updated_document[label] = selected.label;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            document: updated_document,
            [targetSelected]: selected,
            isLoading: false
        });

    }

    handleChangeDropDowns = (item, lbl, val, selected, listData, selected_subScripe, initialState) => {
        this.setState({ isLoading: true })
        DataService.GetDataList('GetContactsByCompanyId?companyId=' + item.value, 'contactName', 'id').then(res => {
            this.setState({
                [listData]: res, isLoading: false, [selected]: item,
                [selected_subScripe]: { label: Resources[initialState][currentLanguage], value: "0" },
            })
        })
        this.updateSelectedValue(item, lbl, val)
    }

    handleChange = (key, value) => {
        this.setState({ document: { ...this.state.document, [key]: value } })
    }
    NextStep = () => {
        window.scrollTo(0, 0)
        switch (this.state.CurrStep) {
            case 1:
                this.setState({
                    fromContacts: [],
                    selectedCalledByCompany: { label: Resources.calledByCompanyRequired[currentLanguage], value: "0" },
                    selectedCalledByContact: { label: Resources.calledByContactRequired[currentLanguage], value: "0" },
                    calledByContact: [],
                    CurrStep: this.state.CurrStep + 1,
                    firstComplete: true
                })
                break;
            case 2:
                this.setState({
                    CurrStep: this.state.CurrStep + 1, secondComplete: true,
                    actionByContacts: [],
                    selectedActionByContact: { label: Resources.toContactRequired[currentLanguage], value: 0 },
                    selectedActionByCompany: { label: Resources.toCompanyRequired[currentLanguage], value: 0 },
                    isLoading: false
                })
                break;
            case 3:
                this.props.history.push({ pathname: '/CommunicationMeetingAgenda/' + this.state.projectId })
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
        if (!Config.IsAllow(11)) {
            toast.warning("you don't have permission");
        }
        else if (column.key != 0) {
            this.setState({ showPopUp: true, btnText: 'save' })
            if (this.state.CurrStep == 3) {
                let actionByCompany = _.find(this.state.Companies, function (company) { return company.value == value.byWhomCompanyId })
                this.setState({ isLoading: true })
                DataService.GetDataList('GetContactsByCompanyId?companyId=' + value.byWhomCompanyId, 'contactName', 'id').then(res => {
                    let actionByContact = _.find(res, function (x) { return x.value == value.byWhomContactId })
                    this.setState({
                        topic: { itemDescription: value.description, action: value.action, decision: value.decision, comment: value.comment, id: value.id, requiredDate: moment(value.requiredDate) },
                        selectedActionByCompany: actionByCompany, selectedActionByContact: actionByContact, actionByContacts: res, isLoading: false
                    })
                })
            }
            else if (this.state.CurrStep == 2) {
                this.setState({ isLoading: true })
                DataService.GetDataList('GetAllBoqChild?parentId=' + value.boqTypeId, 'title', 'id').then(res => {
                    this.setState({
                        BoqSubTypes: res,
                        BoqTypeChilds: res,
                        items: { id: value.id, description: value.description, arrange: value.arrange, quantity: value.quantity, unitPrice: value.unitPrice, itemCode: value.itemCode, resourceCode: value.resourceCode, days: value.days },
                        selectedUnit: { label: value.unitLabel, value: value.unit },
                        selectedBoqType: { label: value.boqType, value: value.boqTypeId },
                        selectedBoqTypeChild: { label: value.boqTypeChild, value: value.boqTypeChildId },
                        selectedBoqSubType: { label: value.boqSubType, value: value.boqSubTypeId },
                        selectedItemType: { label: value.itemTypeLabel, value: value.itemType },
                        selectedequipmentType: { label: value.equipmentTypeLabel, value: value.equipmentType },
                        isLoading: false
                    })
                })
            }
            this.simpleDialog1.show()
        }
    }
    clickHandlerDeleteRowsMain = selectedRows => {
        this.setState({
            showDeleteModal: true,
            selectedRow: selectedRows
        });
    };
    _executeBeforeModalClose = () => {
        this.setState({
            showPopUp: false, btnText: 'add', topic: { requiredDate: moment() },
            selectedActionByContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
            selectedActionByCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" }
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
    render() {
        const dataGridTopic = this.state.isLoading === false ? (
            <GridSetup rows={this.state.topics}
                showCheckbox={true}
                pageSize={this.state.pageSize}
                onRowClick={this.onRowClick}
                columns={this.topicColumns}
                clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                single={true}
                key='topic'
            />) : <LoadingSection />;

        const dataGridAttendees = this.state.isLoading === false ? (
            <GridSetup
                rows={this.state.tableItems}
                showCheckbox={true}
                pageSize={this.state.pageSize}
                onRowClick={this.onRowClick}
                columns={this.itemsColumns}
                clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                key='items'
            />) : <LoadingSection />;


        const contractContent = <React.Fragment>
            <div className="document-fields">
                {this.state.isLoading ? <LoadingSection /> : null}
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        description: this.state.items.description,
                        unit: this.state.selectedUnit.value > 0 ? this.state.selectedUnit : '',
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

                            <div className="proForm first-proform letterFullWidth">
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources['subject'][currentLanguage]} </label>
                                    <div className={"inputDev ui input " + (errors.subject ? 'has-error' : !errors.subject && touched.subject ? (" has-success") : " ")}>
                                        <input name='subject'
                                            className="form-control"
                                            id="subject" placeholder={Resources['subject'][currentLanguage]} autoComplete='off'
                                            onBlur={handleBlur} value={this.props.document.subject}
                                            onChange={e => { handleChange(e); this.setState({ document: { ...this.state.document, subject: e.target.value } }) }} />
                                        {errors.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.status[currentLanguage]}</label>
                                    <div className="ui checkbox radio radioBoxBlue">
                                        <input type="radio" name="letter-status" defaultChecked={this.state.document.status === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'status')} />
                                        <label>{Resources.oppened[currentLanguage]}</label>
                                    </div>
                                    <div className="ui checkbox radio radioBoxBlue">
                                        <input type="radio" name="letter-status" defaultChecked={this.state.document.status === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'status')} />
                                        <label>{Resources.closed[currentLanguage]}</label>
                                    </div>
                                </div>
                            </div>
                            <div className="proForm datepickerContainer">
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.reference[currentLanguage]}</label>
                                    <div className="ui input inputDev"  >
                                        <input type="text" className="form-control" id="reference" readOnly
                                            value={this.state.items.reference}
                                            name="reference"
                                            placeholder={Resources.reference[currentLanguage]}
                                            onChange={(e) => this.handleChange(e, 'reference')} />
                                    </div>
                                </div>

                                <div className="linebylineInput valid-input">
                                    <DatePicker title='completionDate'
                                        format={'DD/MM/YYYY'}
                                        name="completionDate"
                                        startDate={this.state.document.completionDate}
                                        handleChange={e => this.handleChange('completionDate', e)} />
                                </div>
                                <div className="linebylineInput valid-input">
                                    <DatePicker title='docDate'
                                        format={'DD/MM/YYYY'}
                                        name="documentDate"
                                        startDate={this.state.document.documentDate}
                                        handleChange={e => this.handleChange('documentDate', e)} />
                                </div>

                                <div className="linebylineInput valid-input">
                                    <Dropdown
                                        title="currency"
                                        data={this.state.currency}
                                        selectedValue={this.state.selectedUnit}
                                        handleChange={event => {
                                            this.handleChange('currency', event.value);
                                            this.setState({ selectedUnit: event })
                                        }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.currency}
                                        touched={touched.currency}
                                        name="currency"
                                        index="currency" />
                                </div>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.tax[currentLanguage]}</label>
                                    <div className="ui input inputDev"  >
                                        <input type="text" className="form-control" id="Tax"
                                            value={this.state.items.Tax}
                                            name="Tax"
                                            placeholder={Resources.tax[currentLanguage]}
                                            onChange={(e) => this.setState({ items: { ...this.state.items, Tax: e.target.value } })} />
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.vat[currentLanguage]}</label>
                                    <div className="ui input inputDev"  >
                                        <input type="text" className="form-control" id="vat"
                                            value={this.state.items.vat}
                                            name="vat"
                                            placeholder={Resources.vat[currentLanguage]}
                                            onChange={(e) => this.setState({ items: { ...this.state.items, vat: e.target.value } })} />
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.advancedPayment[currentLanguage]}</label>
                                    <div className="ui input inputDev"  >
                                        <input type="text" className="form-control" id="advancedPayment"
                                            value={this.state.items.advancedPayment}
                                            name="advancedPayment"
                                            placeholder={Resources.advancedPayment[currentLanguage]}
                                            onChange={(e) => this.setState({ items: { ...this.state.items, advancedPayment: e.target.value } })} />
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.retainage[currentLanguage]}</label>
                                    <div className="ui input inputDev"  >
                                        <input type="text" className="form-control" id="retainage"
                                            value={this.state.items.retainage}
                                            name="retainage"
                                            placeholder={Resources.retainage[currentLanguage]}
                                            onChange={(e) => this.setState({ items: { ...this.state.items, retainage: e.target.value } })} />
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.insurance[currentLanguage]}</label>
                                    <div className="ui input inputDev"  >
                                        <input type="text" className="form-control" id="insurance"
                                            value={this.state.items.insurance}
                                            name="insurance"
                                            placeholder={Resources.insurance[currentLanguage]}
                                            onChange={(e) => this.setState({ items: { ...this.state.items, insurance: e.target.value } })} />
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.advancedPaymentAmount[currentLanguage]}</label>
                                    <div className="ui input inputDev"  >
                                        <input type="text" className="form-control" id="advancedPaymentAmount"
                                            value={this.state.items.advancedPaymentAmount}
                                            name="advancedPaymentAmount"
                                            placeholder={Resources.advancedPaymentAmount[currentLanguage]}
                                            onChange={(e) => this.setState({ items: { ...this.state.items, advancedPaymentAmount: e.target.value } })} />
                                    </div>
                                </div>

                                <div className={"slider-Btns fullWidthWrapper textLeft "}>
                                    <button className={"primaryBtn-1 btn " + (this.state.isApproveMode === true ? 'disabled' : '')} type="submit" disabled={this.state.isApproveMode} >{Resources[this.state.btnText][currentLanguage]}</button>
                                </div>
                            </div>

                        </Form>
                    )}
                </Formik>
            </div>

        </React.Fragment >
        const purchaseOrderContent = <React.Fragment>

            <div className="document-fields">
                {this.state.isLoading ? <LoadingSection /> : null}
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        description: this.state.items.description,
                        unit: this.state.selectedUnit.value > 0 ? this.state.selectedUnit : '',
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

                            <div className="proForm first-proform">
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources['subject'][currentLanguage]} </label>
                                    <div className={"inputDev ui input " + (errors.subject ? 'has-error' : !errors.subject && touched.subject ? (" has-success") : " ")}>
                                        <input name='subject'
                                            className="form-control"
                                            id="subject" placeholder={Resources['subject'][currentLanguage]} autoComplete='off'
                                            onBlur={handleBlur} value={this.props.document.subject}
                                            onChange={e => { handleChange(e); this.setState({ document: { ...this.state.document, subject: e.target.value } }) }} />
                                        {errors.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.status[currentLanguage]}</label>
                                    <div className="ui checkbox radio radioBoxBlue">
                                        <input type="radio" name="letter-status" defaultChecked={this.state.document.status === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'status')} />
                                        <label>{Resources.oppened[currentLanguage]}</label>
                                    </div>
                                    <div className="ui checkbox radio radioBoxBlue">
                                        <input type="radio" name="letter-status" defaultChecked={this.state.document.status === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'status')} />
                                        <label>{Resources.closed[currentLanguage]}</label>
                                    </div>
                                </div>
                            </div>
                            <div className="proForm datepickerContainer">
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.reference[currentLanguage]}</label>
                                    <div className="ui input inputDev"  >
                                        <input type="text" className="form-control" id="reference" readOnly
                                            value={this.state.items.reference}
                                            name="reference"
                                            placeholder={Resources.reference[currentLanguage]}
                                            onChange={(e) => this.handleChange(e, 'reference')} />
                                    </div>
                                </div>

                                <div className="linebylineInput valid-input">
                                    <DatePicker title='completionDate'
                                        format={'DD/MM/YYYY'}
                                        name="completionDate"
                                        startDate={this.state.document.completionDate}
                                        handleChange={e => this.handleChange('completionDate', e)} />
                                </div>
                                <div className="linebylineInput valid-input">
                                    <DatePicker title='docDate'
                                        format={'DD/MM/YYYY'}
                                        name="documentDate"
                                        startDate={this.state.document.documentDate}
                                        handleChange={e => this.handleChange('documentDate', e)} />
                                </div>


                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.advancedPayment[currentLanguage]}</label>
                                    <div className="ui input inputDev"  >
                                        <input type="text" className="form-control" id="advancedPayment"
                                            value={this.state.items.advancedPayment}
                                            name="advancedPayment"
                                            placeholder={Resources.advancedPayment[currentLanguage]}
                                            onChange={(e) => this.setState({ items: { ...this.state.items, advancedPayment: e.target.value } })} />
                                    </div>
                                </div>
                                <div className="fullWidthWrapper account__checkbox">
                                    <div className="proForm fullLinearInput">
                                        <div className="linebylineInput">
                                            <label className="control-label">{Resources.useItemization[currentLanguage]}</label>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio" name="useItemization" defaultChecked={this.state.document.useItemization === false ? null : 'checked'} value="true" onChange={e => this.handleChange('useItemization', 'true')} />
                                                <label>{Resources.yes[currentLanguage]}</label>
                                            </div>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio" name="useItemization" defaultChecked={this.state.document.useItemization === false ? 'checked' : null} value="false" onChange={e => this.handleChange('useItemization', 'false')} />
                                                <label>{Resources.no[currentLanguage]}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="proForm fullLinearInput">
                                        <div className="linebylineInput">
                                            <label className="control-label">{Resources.useRevised[currentLanguage]}</label>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio" name="Optemization" defaultChecked={this.state.document.useRevised === false ? null : 'checked'} value="true" onChange={e => this.handleChange('useRevised', 'true')} />
                                                <label>{Resources.yes[currentLanguage]}</label>
                                            </div>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio" name="Optemization" defaultChecked={this.state.document.useRevised === false ? 'checked' : null} value="false" onChange={e => this.handleChange('useRevised', 'false')} />
                                                <label>{Resources.no[currentLanguage]}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <Dropdown
                                        title="currency"
                                        data={this.state.currency}
                                        selectedValue={this.state.selectedUnit}
                                        handleChange={event => {
                                            this.handleChange('currency', event.value);
                                            this.setState({ selectedUnit: event })
                                        }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.currency}
                                        touched={touched.currency}
                                        name="currency"
                                        index="currency" />
                                </div>



                                <div className={"slider-Btns fullWidthWrapper textLeft "}>
                                    <button className={"primaryBtn-1 btn " + (this.state.isApproveMode === true ? 'disabled' : '')} type="submit" disabled={this.state.isApproveMode} >{Resources[this.state.btnText][currentLanguage]}</button>
                                </div>
                            </div>

                        </Form>
                    )}
                </Formik>
            </div>

        </React.Fragment >
        const itemsContent = <React.Fragment>
            <div className="document-fields">
                {this.state.isLoading ? <LoadingSection /> : null}
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        description: this.state.items.description,
                        unit: this.state.selectedUnit.value > 0 ? this.state.selectedUnit : '',
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
                                    <div className="ui input inputDev"  >
                                        <input type="text" className="form-control" id="quantity"
                                            value={this.state.items.quantity}
                                            name="quantity"
                                            placeholder={Resources.quantity[currentLanguage]}
                                            onChange={(e) => this.setState({ items: { ...this.state.items, quantity: e.target.value } })} />
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <Dropdown
                                        title="unit"
                                        data={this.state.Units}
                                        selectedValue={this.state.selectedUnit}
                                        handleChange={event => {
                                            this.handleChange('unit', event.value);
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
                                    <div className="ui input inputDev"  >
                                        <input type="text" className="form-control" id="unitPrice"
                                            value={this.state.items.unitPrice}
                                            name="unitPrice"
                                            placeholder={Resources.unitPrice[currentLanguage]}
                                            onChange={(e) => this.setState({ items: { ...this.state.items, unitPrice: e.target.value } })} />
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
                                {this.state.selectedItemType.label == 'Equipment' || this.state.selectedequipmentType.value > 0 ?
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
                                    <button className={"primaryBtn-1 btn " + (this.state.isApproveMode === true ? 'disabled' : '')} type="submit" disabled={this.state.isApproveMode} >{Resources[this.state.btnText][currentLanguage]}</button>
                                </div>
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
                                subject: this.state.document.subject,
                                fromCompany: this.state.selectedFromCompany.value > 0 ? this.state.selectedFromCompany.value : '',
                                discipline: this.state.selectedDiscipline.value > 0 ? this.state.selectedDiscipline.value : ''

                            }}
                            validationSchema={poqSchema}
                            enableReinitialize={this.props.changeStatus}
                            onSubmit={(values) => {
                                if (this.props.changeStatus === true && this.state.docId > 0) {
                                    this.editBoq();
                                } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                    this.addPoq();
                                }
                            }}  >

                            {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                <Form id="ClientSelectionForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>

                                    <div className="proForm first-proform">
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['subject'][currentLanguage]} </label>
                                            <div className={"inputDev ui input " + (errors.subject ? 'has-error' : !errors.subject && touched.subject ? (" has-success") : " ")}>
                                                <input name='subject'
                                                    className="form-control"
                                                    id="subject" placeholder={Resources['subject'][currentLanguage]} autoComplete='off'
                                                    onBlur={handleBlur} value={this.props.document.subject}
                                                    onChange={e => { handleChange(e); this.setState({ document: { ...this.state.document, subject: e.target.value } }) }} />
                                                {errors.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources.status[currentLanguage]}</label>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio" name="letter-status" defaultChecked={this.state.document.status === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'status')} />
                                                <label>{Resources.oppened[currentLanguage]}</label>
                                            </div>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio" name="letter-status" defaultChecked={this.state.document.status === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'status')} />
                                                <label>{Resources.closed[currentLanguage]}</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="proForm datepickerContainer">

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                            <div className="ui input inputDev"  >
                                                <input type="text" className="form-control" id="arrange" readOnly
                                                    value={this.state.document.arrange}
                                                    name="arrange"
                                                    placeholder={Resources.arrange[currentLanguage]}
                                                    onChange={(e) => this.handleChange(e, 'arrange')} />
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <DatePicker title='docDate'
                                                format={'DD/MM/YYYY'}
                                                name="documentDate"
                                                startDate={this.state.document.documentDate}
                                                handleChange={e => this.handleChange('documentDate', e)} />
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <Dropdown
                                                title="fromCompany"
                                                data={this.state.Companies}
                                                selectedValue={this.state.selectedFromCompany}
                                                handleChange={event => {
                                                    this.handleChange('company', event.value);
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
                                                    this.handleChange('discipline', event.value);
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
                                                        <input type="radio" name="showInSiteRequest" defaultChecked={this.state.document.showInSiteRequest === false ? null : 'checked'} value="true" onChange={e => this.handleChange('showInSiteRequest', 'true')} />
                                                        <label>{Resources.yes[currentLanguage]}</label>
                                                    </div>
                                                    <div className="ui checkbox radio radioBoxBlue">
                                                        <input type="radio" name="showInSiteRequest" defaultChecked={this.state.document.showInSiteRequest === false ? 'checked' : null} value="false" onChange={e => this.handleChange('showInSiteRequest', 'false')} />
                                                        <label>{Resources.no[currentLanguage]}</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="proForm fullLinearInput">
                                                <div className="linebylineInput">
                                                    <label className="control-label">{Resources.useRevised[currentLanguage]}</label>
                                                    <div className="ui checkbox radio radioBoxBlue">
                                                        <input type="radio" name="Optemization" defaultChecked={this.state.document.showOptemization === false ? null : 'checked'} value="true" onChange={e => this.handleChange('showOptemization', 'true')} />
                                                        <label>{Resources.yes[currentLanguage]}</label>
                                                    </div>
                                                    <div className="ui checkbox radio radioBoxBlue">
                                                        <input type="radio" name="Optemization" defaultChecked={this.state.document.showOptemization === false ? 'checked' : null} value="false" onChange={e => this.handleChange('showOptemization', 'false')} />
                                                        <label>{Resources.no[currentLanguage]}</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className={"slider-Btns fullWidthWrapper textLeft "}>
                                            <button className={"primaryBtn-1 btn " + (this.state.isApproveMode === true ? 'disabled' : '')} type="submit" disabled={this.state.isApproveMode} >{Resources[this.state.btnText][currentLanguage]}</button>
                                        </div>




                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <div className="doc-pre-cycle letterFullWidth">
                            <div>
                                {this.state.docId > 0 && this.state.isApproveMode === true ?
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

                    {
                        this.props.changeStatus === true ?
                            <div className="approveDocument">
                                <div className="approveDocumentBTNS">
                                    <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} onClick={e => this.editLetter(e)}>{Resources.save[currentLanguage]}</button>
                                    {this.state.isApproveMode === true ?

                                        <div >
                                            <button className="primaryBtn-1 btn " onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                                            <button className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>
                                        </div>
                                        : null}
                                    <button className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[1])}>{Resources.sendToWorkFlow[currentLanguage]}</button>
                                    <button className="primaryBtn-2 btn" onClick={(e) => this.handleShowAction(actions[0])}>{Resources.distributionList[currentLanguage]}</button>
                                    <span className="border"></span>
                                    <div className="document__action--menu">
                                        <OptionContainer permission={this.state.permission} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                    </div>

                                </div>
                            </div>
                            : null
                    }
                </div>
            </div>

        </React.Fragment>
        let Step_2 = <React.Fragment>
            {itemsContent}
            <div className="doc-pre-cycle letterFullWidth">
                <div className='precycle-grid'>
                    {dataGridAttendees}
                    <div class="slider-Btns">
                        <button class="primaryBtn-1 btn meduimBtn  " type="submit" onClick={this.NextStep}>{Resources.next[currentLanguage]}</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
        let Step_3 = <React.Fragment>
            {contractContent}
            <div className="doc-pre-cycle letterFullWidth">
                <div className='precycle-grid'>
                    <div class="slider-Btns">
                        <button class="primaryBtn-1 btn meduimBtn  " type="submit" onClick={this.NextStep}>{Resources.next[currentLanguage]}</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
        return (
            <React.Fragment>
                <div className="mainContainer">
                    <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
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
                                <Fragment>
                                    {/* {this.state.CurrStep == 1 ? Step_1 : (this.state.CurrStep == 2 ? Step_2 : Step_3)} */}
                                    {Step_3}
                                    {/* <div className="largePopup largeModal " style={{ display: this.state.showPopUp ? 'block' : 'none' }}>
                                        <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog1 = ref}
                                            title={Resources.editTitle[currentLanguage] + ' - ' + Resources.meetingAgendaLog[currentLanguage]}
                                            beforeClose={this._executeBeforeModalClose}>
                                            {this.state.CurrStep == 2 ? itemsContent : topicContent}
                                        </SkyLight>
                                    </div> */}

                                </Fragment>
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
        attendees: state.communication.attendees,
        topics: state.communication.topics
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