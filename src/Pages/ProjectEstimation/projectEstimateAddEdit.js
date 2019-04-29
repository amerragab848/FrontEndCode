import React, { Component, Fragment } from "react";
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SkyLightStateless } from 'react-skylight';
import * as communicationActions from '../../store/actions/communication';
import GridSetup from "../Communication/GridSetup";
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import SkyLight from 'react-skylight';
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval'
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Api from "../../api";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
const _ = require('lodash')

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    boqId: Yup.string().required(Resources['selectBoq'][currentLanguage])
        .nullable(true),
    bicContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage])
        .nullable(true),
})

class projectEstimateAddEdit extends Component {

    constructor(props) {

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
                key: "description",
                name: Resources["description"][currentLanguage],
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
                key: "boqSubType",
                name: Resources["boqSubType"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "unit",
                name: Resources["unit"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "estimationItemTypeName",
                name: Resources["itemType"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "unitPrice",
                name: Resources["unitPrice"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "newUnitPrice",
                name: Resources["newUnitPrice"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "quantity",
                name: Resources["quantity"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },

            {
                key: "days",
                name: Resources["days"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "total",
                name: Resources["total"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "tax",
                name: Resources["factors"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "totalWithTax",
                name: Resources["totalAfterTax"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "currencyName",
                name: Resources["currency"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "ratio",
                name: Resources["currencyRates"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "currencyTotal",
                name: Resources["currencyTotal"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ]
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

        this.state = {
            showCheckbox: true,
            columns: columnsGrid.filter(column => column.visible !== false),
            rows: [],
            FirstStep: true,
            SecondStep: false,
            SecondStepComplate: false,
            isLoading: true,
            CurrStep: 1,
            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            isView: false,
            docId: docId,
            docTypeId: 85,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            companies: [],
            fromContacts: [],
            permission: [{ name: 'sendByEmail', code: 597 }, { name: 'sendByInbox', code: 596 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 3016 },
            { name: 'createTransmittal', code: 3102 }, { name: 'sendToWorkFlow', code: 762 },
            { name: 'viewAttachments', code: 3304 }, { name: 'deleteAttachments', code: 3306 }],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            IsEditMode: false,
            showPopUp: false,
            IsAddModel: false,
            BOQDropData: [],
            SelectedBOQDrop: { label: Resources.selectBoq[currentLanguage], value: "0" },
            EstimationTaxesData: [],
            TotalFactors: 0,
            IsAddModel: false,
            IsCurrencyShow: false,
            CurrencyDropData: [],
            ShowPopupCurrency: false,
            rowSelectedId: [],
            SelectedCurrency: { label: Resources.pleaseSelectCurrency[currentLanguage], value: "0" },
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(592))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(592)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(592)) {
                    if (this.props.document.status !== false && Config.IsAllow(592)) {
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id) {
            let ProjectEstiDoc = nextProps.document
            ProjectEstiDoc.docDate = moment(ProjectEstiDoc.docDate).format('DD/MM/YYYY')
            ProjectEstiDoc.dueDate = moment(ProjectEstiDoc.dueDate).format('DD/MM/YYYY')
            this.setState({
                document: ProjectEstiDoc,
                hasWorkflow: nextProps.hasWorkflow,
            });
            this.checkDocumentIsView();
        }
    }

    handleChange(e, field) {

        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = e.target.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            document: updated_document
        })

    }

    NextStep = () => {

        if (this.state.CurrStep === 1) {
            if (this.state.rows.length) {
                window.scrollTo(0, 0)
                this.setState({
                    FirstStep: false,
                    SecondStep: true,
                    SecondStepComplate: true,
                    CurrStep: this.state.CurrStep + 1,
                })
            }
            else{
                toast.error('This boq not have items choice another boq')
            }
        }
        else if (this.state.CurrStep === 2) {
            this.saveAndExit()
        }

    }

    PreviousStep = () => {

        if (this.state.IsEditMode) {
            if (this.state.CurrStep === 2) {
                window.scrollTo(0, 0)
                this.setState({
                    FirstStep: true,
                    SecondStep: false,
                    SecondStepComplate: false,
                    CurrStep: this.state.CurrStep - 1
                })
            }
        }

    }

    componentWillMount() {
        if (docId > 0) {

            let url = "GetProjectEstimateForEdit?id=" + this.state.docId
            this.props.actions.documentForEdit(url);
            this.setState({
                IsEditMode: true
            })

            this.FillDrowDowns()

            dataservice.GetDataGrid('GetProjectEstimationItemsTaxes?estimationId=' + this.state.docId + '').then(
                resTaxes => {
                    let toatalValues = []
                    resTaxes.map(s => {
                        toatalValues.push(s.value)
                    })
                    let sumValues = _.sum(toatalValues)
                    this.setState({
                        EstimationTaxesData: resTaxes,
                        TotalFactors: sumValues
                    })
                }
            )

            dataservice.GetDataGrid('GetProjectEstimateItemsByProjectEstimateId?projectEstimateId=' + this.state.docId + '').then(
                data => {
                    this.setState({
                        rows: data,
                    })
                })

        } else {
            ///Is Add Mode
            dataservice.GetNextArrangeMainDocument('GetNextArrangeMainDoc?projectId=' + projectId + '&docType=' + this.state.docTypeId + '&companyId=undefined&contactId=undefined').then
                (
                    res => {
                        let ProjectEstiDoc = {
                            arrange: res, bicCompanyId: '', bicContactId: '',
                            boqId: '', docDate: moment(), dueDate: moment(),
                            projectId: projectId, status: true, subject: '',
                        }
                        this.setState({
                            document: ProjectEstiDoc,

                        })
                    }
                )

            dataservice.GetDataGrid('GetAccountsDefaultList?listType=estimationType&pageNumber=0&pageSize=10000').then(
                resTaxes => {
                    let toatalValues = []
                    resTaxes.map(s => {
                        toatalValues.push(s.value)
                    })
                    let sumValues = _.sum(toatalValues)
                    this.setState({
                        EstimationTaxesData: resTaxes,
                        TotalFactors: sumValues
                    })
                }
            )

            this.FillDrowDowns()
        }


    }

    FillDrowDowns = () => {

        dataservice.GetDataList('GetProjectProjectsCompaniesForList?projectId=' + projectId + '', 'companyName', 'companyId').then(
            res => {
                this.setState({
                    companies: res
                })
                if (docId !== 0) {
                    let elementID = this.state.document.bicCompanyId;
                    let SelectedValue = _.find(res, function (i) { return i.value == elementID });
                    this.setState({
                        selectedFromCompany: SelectedValue,
                    })
                    dataservice.GetDataList('GetContactsByCompanyId?companyId=' + this.state.document.bicCompanyId + '', 'contactName', 'id').then(result => {
                        let elementIDContact = this.state.document.bicContactId;
                        let SelectedValueContact = _.find(result, function (i) { return i.value == elementIDContact });
                        this.setState({
                            fromContacts: result,
                            selectedFromContact: SelectedValueContact
                        });
                    });
                }
            }

        )

        dataservice.GetDataList('GetContractsBoqForDropEstimation?projectId=' + projectId + '', 'subject', 'id').then(
            resultBoq => {
                this.setState({
                    BOQDropData: resultBoq,
                    isLoading: false
                })
                if (docId !== 0) {
                    let elementID = this.state.document.boqId;
                    let SelectedBOQDrop = _.find(resultBoq, function (i) { return i.value == elementID; });
                    this.setState({
                        SelectedBOQDrop,
                        isLoading: false
                    })
                }
            }
        )
    }

    componentWillUnmount() {   this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }

    componentDidMount = () => {

        dataservice.GetDataList('GetAccountsDefaultList?listType=currency&pageNumber=0&pageSize=10000', 'title', 'id').then(
            data => {
                this.setState({
                    CurrencyDropData: data,
                })
            })
    }

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }
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

    handleShowAction = (item) => { 
        if (item.title == "sendToWorkFlow") { this.props.actions.SendingWorkFlow(true); }

        if (item.value != "0") {
            this.setState({
                currentComponent: item.value,
                currentTitle: item.title,
                showModal: true
            })
            this.simpleDialog.show()
        }
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
            let action = url + "?" + param + "=" + event.value
            dataservice.GetDataList(action, 'contactName', 'id').then(result => {
                this.setState({
                    [targetState]: result
                });
            });
        }
    }

    viewAttachments() {
        return (
            this.state.docId !== 0 ? (
                Config.IsAllow(3304) === true ?
                    <ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} />
                    : null)
                : null
        )
    }

    saveAndExit = () => {
        this.props.history.push({
            pathname: '/projectEstimate/' + projectId + '',
        })
    }

    showBtnsSaving() {
        let btn = null;

        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{this.state.IsAddModel ? Resources.next[currentLanguage] : Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0) {
            btn = <button className="primaryBtn-1 btn mediumBtn" >{Resources.next[currentLanguage]}</button>
        }
        return btn;
    }

    AddEditProjectEstimation = () => {
        if (this.state.IsAddModel) {
            this.NextStep()
        }
        else {
            this.setState({
                isLoading: true
            })

            let ProjectEstiDoc = { ...this.state.document }
            ProjectEstiDoc.docDate = moment(ProjectEstiDoc.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
            ProjectEstiDoc.dueDate = moment(ProjectEstiDoc.dueDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')

            if (this.state.docId > 0) {
                dataservice.addObject('EditProjectEstimate', ProjectEstiDoc).then(
                    res => {
                        this.setState({
                            isLoading: false
                        })
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    }).catch(ex => {
                        toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                    })
                this.NextStep()

            }
            else {

                dataservice.addObject('AddProjectEstimate', ProjectEstiDoc).then(
                    res => {
                        this.setState({
                            docId: res.id,
                            isLoading: false,
                            IsAddModel: true
                        })

                        dataservice.GetDataGrid('GetProjectEstimateItemsByProjectEstimateId?projectEstimateId=' + res.id + '').then(
                            Data => {
                                this.setState({
                                    rows: Data,
                                })
                            })

                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    }).catch(ex => {
                        toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                    })
            }
        }
    }

    HandleChangeTaxesValue = (e, index) => {
        let EstimationTaxesData = this.state.EstimationTaxesData
        if (parseInt(e.target.value)) {
            if (parseInt(e.target.value) > 0) {
                EstimationTaxesData[index]['value'] = e.target.value
                let toatalValues = []
                EstimationTaxesData.map(s => {
                    toatalValues.push(parseInt(s.value))
                })
                let sumValues = _.sum(toatalValues)
                this.setState({
                    EstimationTaxesData,
                    TotalFactors: sumValues
                })
            }
            else {
                e.target.value = EstimationTaxesData[index]['value']
            }
        }
        else {
            if (e.target.value !== '0') {
                e.target.value = EstimationTaxesData[index]['value']
            }
            else {
                EstimationTaxesData[index]['value'] = e.target.value
                let toatalValues = []
                EstimationTaxesData.map(s => {
                    toatalValues.push(parseInt(s.value))
                })
                let sumValues = _.sum(toatalValues)
                this.setState({
                    EstimationTaxesData,
                    TotalFactors: sumValues
                })
            }
        }
    }

    OnBlurTaxesValue = (e, index) => {

        this.setState({
            isLoading: true
        })

        let Original_Rows = this.state.rows
        let TotalFactors = this.state.TotalFactors
        let NewData = []
        let Index = 0
        Original_Rows.forEach(function (i) {
            let obj = Original_Rows[Index]
            obj.tax = parseFloat(TotalFactors)
            obj.totalWithTax = (i.total) + parseFloat(TotalFactors / 100) * i.total
            obj.newUnitPrice = parseFloat(obj.totalWithTax / i.quantity)
            NewData.push(obj)
            Index++
        })
        setTimeout(() => {
            this.setState({
                rows: NewData,
                isLoading: false
            })
        }, 300);
    }

    SaveEstimationItem = () => {
        if (this.state.IsEditMode) {
            let objItemAdd = { 'dtoDocument': [...this.state.rows], 'estimationTypeItems': [...this.state.EstimationTaxesData] }
            dataservice.addObject('UpdateProjectEstimationItems', objItemAdd).then(
                res => {
                    this.saveAndExit()
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                });
        }
        else {
            let NewData = []
            let Index = 0
            let Original_Rows = this.state.EstimationTaxesData
            let projectEstimateId = this.state.docId

            Original_Rows.forEach(function (i) {

                let newobj = {}
                let obj = Original_Rows[Index]
                obj.id = i.id
                obj.title = i.title
                obj.value = i.value

                newobj.id = obj.id
                newobj.projectEstimateId = projectEstimateId
                newobj.title = obj.title
                newobj.value = obj.value
                NewData.push(newobj)
                Index++
            })

            let objItemAdd = { 'dtoDocument': [...this.state.rows], 'estimationTypeItems': [...NewData] }
            dataservice.addObject('UpdateProjectEstimationItems', objItemAdd).then(
                res => {
                    this.saveAndExit()
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                });

        }
    }

    CurrencyShowBtn = (selectedRows) => {
        this.setState({
            ShowPopupCurrency: true,
            rowSelectedId: selectedRows
        })
    }

    UpdateItemCurrency = () => {
        this.setState({
            ShowPopupCurrency: false
        })
    }

    handleChangeCurrencyDrop = (e) => {
        this.setState({
            SelectedCurrency: e,
            isLoading: true
        })
        Api.post('GetCurrencyRatio?CurrencyId=' + e.value + '&EstimationDate=' + moment().format('YYYY-MM-DD[T]HH:mm:ss.SSS') + '&projectEstimateId=' + this.state.docId + '').then(
            res => {
                let Original_Rows = this.state.rows
                let rate = res.rate
                let currencyId = e.value
                let currencyName = e.label
                let currencyDate = res.addedDate
                let rowSelectedId = this.state.rowSelectedId
                let NewData = []

                rowSelectedId.map(seletedId => {
                    let id = seletedId
                    let rowsel = Original_Rows.filter(seletedId => seletedId.id === id)
                    NewData = Original_Rows.filter(seletedId => seletedId.id !== id)
                    rowsel.forEach(function (i) {
                        let obj = rowsel[0]
                        obj.currencyDate = currencyDate
                        obj.currencyId = currencyId
                        obj.currencyName = currencyName
                        obj.currencyTotal = i.total * rate
                        obj.ratio = rate
                        NewData.push(obj)
                    })
                })
                setTimeout(() => {
                    this.setState({
                        rows: NewData,
                        isLoading: false
                    })
                }, 100)
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }).catch(ex => {
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            });
    }

    render() {

        let EstimationTaxesData = this.state.EstimationTaxesData
        let RenderEstimationTaxesTable =
            EstimationTaxesData.map((item, index) => {
                return (
                    <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>
                            <div className="contentCell tableCell-1">
                                <div className='ui input inputDev linebylineInput'>
                                    <input type="number" onBlur={(e) => this.OnBlurTaxesValue(e, index)} className="form-control" defaultValue={item.value} onChange={(e) => this.HandleChangeTaxesValue(e, index)} />
                                </div>
                            </div>
                        </td>
                    </tr>
                )
            })

        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.state.columns}
                    showCheckbox={this.state.showCheckbox} minHeight={350}
                    NoShowDeletedBar={true} onRowClick={this.ShowPopUp}
                    clickHandlerDeleteRows={this.CurrencyShowBtn} />
            ) : <LoadingSection />

        let SecondStepItems = () => {
            return (
                < div className="subiTabsContent feilds__top">

                    <div className='document-fields'>
                        <div className="proForm datepickerContainer">
                            <div className="proForm first-proform fullWidthWrapper textLeft">
                                <div className='ui input inputDev linebylineInput '>
                                    <label className="control-label">{Resources['totalFactors'][currentLanguage]}</label>
                                    <div className="inputDev ui input">
                                        <input autoComplete="off" className="form-control" readOnly value={this.state.TotalFactors}
                                            name="arrangeItem" placeholder={Resources['totalFactors'][currentLanguage]} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="doc-pre-cycle">
                        <div className="filterBTNS">
                        </div>
                        {dataGrid}
                    </div>

                    <div className='document-fields'>
                        <table className="ui table">
                            <thead>
                                <tr>
                                    <th>{Resources['subject'][currentLanguage]}</th>
                                    <th>{Resources['value'][currentLanguage]}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {RenderEstimationTaxesTable}
                            </tbody>
                        </table>
                    </div>

                    <div className="slider-Btns">
                        <button className="primaryBtn-1 btn meduimBtn" onClick={this.SaveEstimationItem}>{Resources['next'][currentLanguage]}</button>
                    </div>
                </div>
            )
        }

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

        ]

        return (

            <div className="mainContainer">

                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={this.UpdateItemCurrency}
                        title={Resources['currencyRates'][currentLanguage]}
                        onCloseClicked={this.UpdateItemCurrency} isVisible={this.state.ShowPopupCurrency}>

                        <div className='dropWrapper'>
                            <Dropdown title='currency' data={this.state.CurrencyDropData}
                                selectedValue={this.state.SelectedCurrency}
                                handleChange={(e) => this.handleChangeCurrencyDrop(e)}
                            />
                        </div>
                    </SkyLightStateless>
                </div>

                {this.state.isLoading ? <LoadingSection /> : null}

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>

                    <div className="submittalHead">
                        <h2 className="zero">{Resources.projectEstimation[currentLanguage]}
                            <span>{projectName.replace(/_/gi, ' ')} · {Resources.projectEstimation[currentLanguage]}</span>
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
                            {this.state.FirstStep ?
                                <div className="subiTabsContent">
                                    <div className="document-fields">
                                        <Formik
                                            initialValues={
                                                { ...this.state.document }
                                            }
                                            validationSchema={validationSchema}
                                            enableReinitialize={true}
                                            onSubmit={(values) => {
                                                this.AddEditProjectEstimation();
                                            }}  >

                                            {({ errors, touched, handleBlur, values, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                <Form id="InspectionRequestForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>

                                                    <div className="proForm first-proform">

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                                            <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                                <input name='subject' className="form-control fsadfsadsa" id="subject"
                                                                    placeholder={Resources.subject[currentLanguage]} autoComplete='off'
                                                                    value={this.state.document.subject}
                                                                    onChange={(e) => this.handleChange(e, 'subject')}
                                                                    onBlur={(e) => {
                                                                        handleBlur(e)
                                                                        handleChange(e)
                                                                    }}
                                                                />
                                                                {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
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
                                                        <div className="linebylineInput valid-input alternativeDate">
                                                            <DatePicker title='docDate' startDate={this.state.document.docDate}
                                                                handleChange={e => this.handleChangeDate(e, 'docDate')} />
                                                        </div>

                                                        <div className="linebylineInput valid-input alternativeDate">
                                                            <DatePicker title='dueDate' startDate={this.state.document.dueDate}
                                                                handleChange={e => this.handleChangeDate(e, 'dueDate')} />
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources['numberAbb'][currentLanguage]}</label>
                                                            <div className="inputDev ui input" >
                                                                <input autoComplete="off" className="form-control" readOnly
                                                                    onChange={(e) => this.handleChange(e, 'arrange')}
                                                                    value={this.state.document.arrange} name="arrange" placeholder={Resources['numberAbb'][currentLanguage]} />
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <div className="inputDev ui input">
                                                                <Dropdown title="boq" data={this.state.BOQDropData} name="boqId"
                                                                    selectedValue={this.state.SelectedBOQDrop}
                                                                    onChange={setFieldValue}
                                                                    handleChange={event => this.handleChangeDropDown(event, 'boqId', false, '', '', '', 'SelectedBOQDrop')}
                                                                    onBlur={setFieldTouched}
                                                                    error={errors.boqId}
                                                                    touched={touched.boqId}
                                                                    value={values.boqId} />
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input mix_dropdown">
                                                            <label className="control-label">{Resources.fromCompany[currentLanguage]}</label>
                                                            <div className="supervisor__company">
                                                                <div className="super_name">
                                                                    <Dropdown data={this.state.fromContacts} onChange={setFieldValue} name="bicContactId"
                                                                        onBlur={setFieldTouched} error={errors.bicContactId} id="bicContactId"
                                                                        touched={touched.bicContactId} index="IR-bicContactId"
                                                                        selectedValue={this.state.selectedFromContact}
                                                                        handleChange={event => this.handleChangeDropDown(event, 'bicContactId', false, '', '', '', 'selectedFromContact')}
                                                                    />
                                                                </div>

                                                                <div className="super_company">
                                                                    <Dropdown data={this.state.companies} name="bicCompanyId"
                                                                        selectedValue={this.state.selectedFromCompany}
                                                                        handleChange={event => {
                                                                            this.handleChangeDropDown(event, 'bicCompanyId', true, 'fromContacts', 'GetContactsByCompanyId', 'companyId', 'selectedFromCompany', 'selectedFromContact')
                                                                        }} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="slider-Btns">
                                                        {this.showBtnsSaving()}
                                                    </div>
                                                    {this.state.IsEditMode === true && docId !== 0 ?
                                                        <div className="approveDocument">
                                                            <div className="approveDocumentBTNS">
                                                                <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} onClick={this.saveNCR}>{Resources.save[currentLanguage]}</button>

                                                                {this.state.isApproveMode === true ?
                                                                    <div >
                                                                        <button className="primaryBtn-1 btn " type="button"  onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                                                                        <button className="primaryBtn-2 btn middle__btn"  type="button" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>


                                                                    </div>
                                                                    : null
                                                                }
                                                                <button type="button" className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[1])}>{Resources.sendToWorkFlow[currentLanguage]}</button>
                                                               <button  type="button"     className="primaryBtn-2 btn" onClick={(e) => this.handleShowAction(actions[0])}>{Resources.distributionList[currentLanguage]}</button>
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
                                            {this.state.docId !== 0 ?
                                                <UploadAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                : null
                                            }
                                            {this.viewAttachments()}

                                            {this.props.changeStatus === true && docId !== 0 ?
                                                <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                : null
                                            }
                                        </div>
                                    </div>
                                </div>
                                :
                                <Fragment>
                                    {SecondStepItems()}
                                </Fragment>
                            }
                        </div>
                        {/* Right Menu */}
                        <div className="docstepper-levels">
                            {/* Next & Previous */}
                            <div className="step-content-foot">
                                <span onClick={this.PreviousStep} className={!this.state.FirstStep && this.state.IsEditMode ? "step-content-btn-prev " :
                                    "step-content-btn-prev disabled"}>{Resources['previous'][currentLanguage]}<i className="fa fa-caret-left" aria-hidden="true"></i></span>

                                <span onClick={this.NextStep} className={this.state.IsEditMode ? "step-content-btn-prev "
                                    : "step-content-btn-prev disabled"}>{Resources['next'][currentLanguage]} <i className="fa fa-caret-right" aria-hidden="true"></i>
                                </span>
                            </div>
                            {/* Steps Active  */}
                            <div className="workflow-sliderSteps">
                                <div className="step-slider">
                                    <div data-id="step1" className={'step-slider-item ' + (this.state.SecondStepComplate ? "active" : 'current__step')} >
                                        <div className="steps-timeline">
                                            <span>1</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>{Resources['projectEstimation'][currentLanguage]}</h6>
                                        </div>
                                    </div>

                                    <div data-id="step2 " className={'step-slider-item ' + (this.state.ThirdStepComplate ? 'active' : this.state.SecondStepComplate ? "current__step" : "")} >
                                        <div className="steps-timeline">
                                            <span>2</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6 >{Resources['items'][currentLanguage]}</h6>
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
        )
    }
}

function mapStateToProps(state) {
    return {
        document: state.communication.document,
        isLoading: state.communication.isLoading,
        changeStatus: state.communication.changeStatus,
        file: state.communication.file,
        files: state.communication.files,
        hasWorkflow: state.communication.hasWorkflow,
        projectId: state.communication.projectId
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
)(withRouter(projectEstimateAddEdit))

