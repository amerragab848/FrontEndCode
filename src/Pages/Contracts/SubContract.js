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
import AddItemDescription from '../../Componants/OptionsPanels/addItemDescription'
import EditItemDescription from '../../Componants/OptionsPanels/editItemDescription'
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import 'react-table/react-table.css'
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal'
import GridSetupWithFilter from "../Communication/GridSetupWithFilter";
import XSLfile from '../../Componants/OptionsPanels/XSLfiel'
import IPConfig from '../../IP_Configrations'
import flashAuto from 'material-ui/svg-icons/image/flash-auto';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const poqSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    fromCompany: Yup.string().required(Resources['fromCompanyRequired'][currentLanguage]),
    contractWithContact: Yup.string().required(Resources['toContactNameRequired'][currentLanguage]),
    refDoc: Yup.string().required(Resources['selectRefNo'][currentLanguage])
});


let docId = 0;
let projectId = 0;
let projectName = "";
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;


class SubContract extends Component {

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
        let editUnitPrice = ({ value, row }) => {
            if (row) {
                return <a className="editorCell"><span style={{ padding: '0 6px', margin: '5px 0', border: '1px dashed', cursor: 'pointer' }}>{row.unitPrice}</span></a>;
            }
            return null;
        };

        this.itemsColumns = [
            {
                formatter: this.customButton,
                key: 'customBtn'

            },
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
                sortDescendingFirst: true,
                formatter: editUnitPrice
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
            saveLoading: false,
            isLoading: false,
            companies: [],
            contracts: [],
            formCompany: { label: Resources.selectCompany[currentLanguage], value: -1 },
            contractTo: { label: Resources.selectContact[currentLanguage], value: -1 },
            contractWithContact: { label: Resources.selectContact[currentLanguage], value: -1 },
        }

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
        this.setState({ isLoading: true })
        DataService.GetDataList('GetProjectProjectsCompaniesForList?projectId=2', 'companyName', 'companyId').then(res => {
            this.setState({ companies: res, isLoading: false })
        }).catch(() => {
            this.setState({ isLoading: false })
        })

    }
    getTabelData() {
        let Table = []
        this.setState({ isLoading: true, LoadingPage: true })
        Api.get('GetBoqItemsList?id=' + this.state.docId + '&pageNumber=0&pageSize=1000').then(res => {
            let data = { items: res };
            this.props.actions.ExportingData(data);

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

    componentWillReceiveProps(props, state) {
    }

    onRowClick = (value, index, column) => {
        console.log('column.key', column.key)
        if (!Config.IsAllow(11)) {
            toast.warning("you don't have permission");
        }
        else if (column.key == 'customBtn') {
            this.itemization(value)
        }
        else if (column.key != 'select-row' && column.key != 'unitPrice') {

            if (this.state.CurrStep == 2) {
                this.setState({ showPopUp: true, btnText: 'save', selectedRow: value })
                this.simpleDialog1.show()
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

    _onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        this.setState({ isLoading: true })

        let updateRow = this.state.rows[fromRow];

        this.setState(state => {
            const rows = state.rows.slice();
            for (let i = fromRow; i <= toRow; i++) {
                rows[i] = { ...rows[i], ...updated };
            }
            return { rows };
        }, function () {
            if (updateRow[Object.keys(updated)[0]] !== updated[Object.keys(updated)[0]]) {

                updateRow[Object.keys(updated)[0]] = updated[Object.keys(updated)[0]];
                Api.post('EditBoqItemUnitPrice?id=' + this.state.rows[fromRow].id + '&unitPrice=' + updated.unitPrice)
                    .then(() => {
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                        this.setState({ isLoading: false })
                    })
                    .catch(() => {
                        toast.error(Resources["operationCanceled"][currentLanguage]);
                        this.setState({ isLoading: false })
                    })
            }
        });
    };

    ChangeContract = (event) => {
        this.setState({ contractTo: event, isLoading: true })
        DataService.GetDataList('GetContactsByCompanyId?companyId=' + event.value, 'contactName', 'id').then(res => {
            this.setState({
                contracts: res, isLoading: false,
                contractWithContact: { label: Resources.selectContact[currentLanguage], value: -1 }
            })
        }).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    render() {
        const ItemsGrid = this.state.isLoading === false ? (
            <GridSetupWithFilter
                rows={this.state._items}
                onRowClick={this.onRowClick}
                columns={this.itemsColumns}
                clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                onRowsSelected={this.onRowsSelected}
                onRowsDeselected={this.onRowsDeselected}
                onGridRowsUpdated={this._onGridRowsUpdated}
                key='items'
            />) : <LoadingSection />;
        let Step_1 = <React.Fragment>
            <div id="step1" className="step-content-body">
                <div className="subiTabsContent">
                    <div className="document-fields">
                        <Formik
                            initialValues={{
                                subject: '',
                                fromCompany: '',
                                contractWithContact: '',
                                status: true,
                                refDoc: '',
                                docDate: moment(),
                                completionDate: moment()
                            }}
                            validationSchema={poqSchema}
                            onSubmit={(values) => {
                                console.log('values', values)
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
                                            <DatePicker title='docDate'
                                                format={'DD/MM/YYYY'}
                                                name="docDate"
                                                startDate={values.docDate}
                                                handleChange={e => { handleChange(e); setFieldValue('docDate', e) }} />
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <DatePicker title='completionDate'
                                                format={'DD/MM/YYYY'}
                                                name="completionDate"
                                                startDate={values.completionDate}
                                                handleChange={e => { handleChange(e); setFieldValue('completionDate', e) }} />
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <Dropdown
                                                title="fromCompany"
                                                data={this.state.companies}
                                                selectedValue={this.state.fromCompany}
                                                handleChange={event => { this.setState({ fromCompany: event }) }}
                                                onChange={setFieldValue}
                                                onBlur={setFieldTouched}
                                                error={errors.fromCompany}
                                                touched={touched.fromCompany}
                                                name="fromCompany"
                                                index="fromCompany" />
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['refDoc'][currentLanguage]} </label>
                                            <div className={"inputDev ui input " + (errors.refDoc ? 'has-error' : !errors.refDoc && touched.refDoc ? (" has-success") : " ")}>
                                                <input name='refDoc'
                                                    className="form-control"
                                                    id="refDoc" placeholder={Resources['refDoc'][currentLanguage]} autoComplete='off'
                                                    onBlur={handleBlur} defaultValue={values.refDoc}
                                                    onChange={e => { handleChange(e); }} />
                                                {errors.refDoc ? (<em className="pError">{errors.refDoc}</em>) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input mix_dropdown">
                                            <label className="control-label">{Resources.contractTo[currentLanguage]}</label>
                                            <div className="supervisor__company">
                                                <div className="super_name">
                                                    <Dropdown
                                                        data={this.state.companies}
                                                        selectedValue={this.state.contractTo}
                                                        handleChange={event => { this.ChangeContract(event) }}
                                                        name="contractTo"
                                                        index="contractTo" />
                                                </div>
                                                <div className="super_company">
                                                    <Dropdown
                                                        data={this.state.contracts}
                                                        selectedValue={this.state.contractWithContact}
                                                        handleChange={event => {
                                                            this.setState({ contractWithContact: event })
                                                        }}
                                                        onChange={setFieldValue}
                                                        onBlur={setFieldTouched}
                                                        error={errors.contractWithContact}
                                                        touched={touched.contractWithContact}
                                                        name="contractWithContact"
                                                        index="contractWithContact" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"slider-Btns fullWidthWrapper textLeft "}>
                                        {this.state.saveLoading === false ? (
                                            <button className="primaryBtn-1 btn " type="submit"  >{Resources['save'][currentLanguage]}</button>
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
                                </Form>
                            )}
                        </Formik>
                    </div>
                    <div className="doc-pre-cycle">
                        <header><h2 class="zero">Contact List</h2></header>
                        <div className="linebylineInput pre-radioBtn">
                            <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" name="status" defaultChecked='checked' />
                                <label>{Resources.oppened[currentLanguage]}</label>
                            </div>
                            <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" name="status" />
                                <label>{Resources.closed[currentLanguage]}</label>
                            </div>
                        </div>
                        {ItemsGrid}
                    </div>
                </div>
            </div>
        </React.Fragment >
        return (
            <React.Fragment>
                <div className="mainContainer">
                    <div className="documents-stepper noTabs__document one__tab one_step" >
                        <HeaderDocument projectName={projectName} isViewMode={false} docTitle={Resources.boq[currentLanguage]} moduleTitle={Resources['contracts'][currentLanguage]} />
                        <div className="doc-container">
                            <div className="step-content">
                                {this.state.LoadingPage ? <LoadingSection /> : Step_1}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
export default withRouter(SubContract)