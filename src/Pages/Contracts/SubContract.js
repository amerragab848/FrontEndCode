import React, { Component, Fragment } from 'react';
import Dropdown from '../../Componants/OptionsPanels/DropdownMelcous';
import Api from '../../api'
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import moment from 'moment'
import Resources from '../../resources.json';
import filter from "lodash/filter";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { withRouter } from "react-router-dom";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import DataService from '../../Dataservice'
///import CryptoJS from 'crypto-js';
import { toast } from "react-toastify";
//import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import 'react-table/react-table.css'
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown'
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown'
import GridCustom from 'react-customized-grid';

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

        window.scrollTo(0, 0);

        let editQuntity = ({ value, row }) => {
            if (row) {
                return <a className="editorCell"><span style={{ padding: '0 6px', margin: '5px 0', border: '1px dashed', cursor: 'pointer' }}>{row.quantity}</span></a>;
            }
            return null;
        };

        let editUnitPrice = ({ value, row }) => {
            if (row) {
                return <a className="editorCell"><span style={{ padding: '0 6px', margin: '5px 0', border: '1px dashed', cursor: 'pointer' }}>{row.unitPrice}</span></a>;
            }
            return null;
        };

        let editDefaultQuntity = ({ value, row }) => {
            if (row) {
                return <a className="editorCell"><span style={{ padding: '0 6px', margin: '5px 0', border: '1px dashed', cursor: 'pointer' }}>{row.defaultQuantity}</span></a>;
            }
            return null;
        };
        this.itemsColumns = [
            {
                field: 'id',
                title: "",
                width: 10,
                groupable: true,
                fixed: true,
                type: "check-box"
            },
            {
                field: 'details',
                title: Resources['description'][currentLanguage],
                width: 15,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: 'resourceCode',
                title: Resources['resourceCode'][currentLanguage],
                width: 15,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: 'specsSectionName',
                title: Resources['specsSection'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'itemCode',
                title: Resources['itemCode'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'unit',
                title: Resources['unit'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'originalQuantity',
                title: Resources['originalQuantity'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "number",
                sortable: true,
            }, {
                field: 'originalUnitPrice',
                title: Resources['originalPrice'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "number",
                sortable: true,
            }, {
                field: 'unitPrice',
                title: Resources['unitPrice'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "input",
                sortable: true,
                handleChange: (e, cell) => {
                    let cellInstance = Object.assign({}, cell);
                    cellInstance.unitPrice = parseFloat(e.target.value);
                    let items = JSON.parse(JSON.stringify(this.state.rows));
                    let cellIndex = items.findIndex(c => c.id == cell.id);
                    items[cellIndex] = cellInstance;
                    this.setState({
                        rows: items,
                    });
                },
                handleBlur: (e, cell) => {
                    this._onGridUnitPriceUpdated(cell);
                }
            }, {
                field: 'quantity',
                title: Resources['originalQuantity'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "input",
                sortable: true,
                handleChange: (e, cell) => {
                    let cellInstance = Object.assign({}, cell);
                    cellInstance.quantity = parseFloat(e.target.value);
                    let items = JSON.parse(JSON.stringify(this.state.rows));
                    let cellIndex = items.findIndex(c => c.id == cell.id);
                    items[cellIndex] = cellInstance;
                    this.setState({
                        rows: items,
                    });
                },
                handleBlur: (e, cell) => {
                    this._onGridQuantityUpdated(cell);
                }
            }, {
                field: 'defaultQuantity',
                title: Resources['defaultQuantity'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "input",
                sortable: true,
                handleChange: (e, cell) => {
                    let cellInstance = Object.assign({}, cell);
                    cellInstance.defaultQuantity = parseFloat(e.target.value);
                    let items = JSON.parse(JSON.stringify(this.state.rows));
                    let cellIndex = items.findIndex(c => c.id == cell.id);
                    items[cellIndex] = cellInstance;
                    this.setState({
                        rows: items,
                    });
                },
                handleBlur: (e, cell) => {
                    this._onGridDefaultQuantityUpdated(cell);
                }
            }];

        this.state = {
            saveLoading: false,
            isLoading: false,
            companies: [],
            contracts: [],
            selectedRows: [],
            rows: [],
            fromCompany: { label: Resources.selectCompany[currentLanguage], value: -1 },
            contractTo: { label: Resources.selectContact[currentLanguage], value: -1 },
            contractWithContact: { label: Resources.selectContact[currentLanguage], value: -1 },
            itemsColumns: this.itemsColumns,
            projectId: this.props.projectId
        }

    }

    componentWillMount() {

        this.setState({ isLoading: true });

        DataService.GetDataList('GetProjectProjectsCompaniesForList?projectId=' + this.props.projectId, 'companyName', 'companyId').then(res => {
            this.setState({ companies: res, isLoading: false })
        }).catch(() => {
            this.setState({ isLoading: false })
        })

        this.setState({ isLoading: true });

        if (!this.props.items) {
            Api.get('ShowContractItemsByContractId?contractId=' + this.props.docId + '&pageNumber=0&pageSize=2000').then((res) => {
                if (res) {
                    let itemsColumns = filter(this.itemsColumns, (col) => col.key != 'defaultQuantity')
                    this.setState({ rows: res, itemsColumns, isLoading: false })
                }
            });
        } else {
            this.setState({ rows: this.props.items, isLoading: false })
        }
    }

    componentWillReceiveProps(props, state) {
    }

    onRowsSelected = selectedRow => {
        let selectedRows = this.state.selectedRows
        selectedRows.push(selectedRow[0].row)
        this.setState({ selectedRows });

    }

    onRowsDeselected = () => {
        this.setState({
            selectedRows: []
        });
    }

    addContract = (values) => {
        if (this.state.selectedRows.length > 0) {
            this.setState({ isLoading: true })
            Api.get('GetNextArrangeMainDoc?projectId=' + this.props.projectId + '&docType=9&companyId=' + this.state.fromCompany.value + '&contactId=0').then((res) => {
                if (res) {
                    let contract = {
                        projectId: this.state.projectId,
                        companyId: this.state.fromCompany.value,
                        toCompanyId: this.state.contractTo.value,
                        toContactId: this.state.contractWithContact.value,
                        subject: values.subject,
                        arrange: res,
                        reference: values.refDoc,
                        docDate: moment(values.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                        status: values.status == undefined ? true : values.status,
                        completionDate: moment(values.completionDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                        actualExceuted: 0,
                        originalContactSum: 0,
                        parentId: this.props.docId,
                        parentType: this.props.type,
                        tax: 0,
                        vat: 0,
                    }
                    DataService.addObject('AddContracts', contract).then((data) => {
                        let count = 0;
                        this.state.selectedRows.forEach(element => {
                            let item = element
                            if (values.status == undefined || values.status == false)
                                item.defaultOrOriginal = false;
                            else {
                                if (item.defaultQuantity !== 0)
                                    item.defaultOrOriginal = true;
                            }
                            item.projectId = this.props.projectId
                            item.docId = data["id"];
                            item.contractId = data["id"];
                            item.orderType = this.props.type;

                            Api.post('AddContractsOrder', item).then(() => {
                                if (count == this.state.selectedRows.length - 1) {
                                    toast.success(Resources["operationSuccess"][currentLanguage]);

                                    this.setState({ isLoading: false })
                                }
                                else
                                    count++;
                            })
                        })

                        this.props.FillTable();

                    }).catch(() => {
                        toast.error(Resources["operationCanceled"][currentLanguage]);
                        this.setState({ isLoading: false })
                    })
                }
            })
        }
        else {
            toast.info('Please Select At least One Item')
        }
    }

    // _onGridRowsUpdated = ({ fromRow, toRow, updated }) => {

    //     this.setState({ isLoading: true });

    //     this.setState(state => {
    //         const rows = state.rows.slice();
    //         for (let i = fromRow; i <= toRow; i++) {
    //             rows[i] = { ...rows[i], ...updated };
    //         }
    //         return { rows };
    //     });

    //     setTimeout(() => {
    //         this.setState({ isLoading: false })
    //     }, 300)
    // };
    _onGridDefaultQuantityUpdated = (cell) => {
        this.setState({ isLoading: true });
        setTimeout(() => {
            this.setState({ isLoading: false })
        }, 300)
    };
    _onGridQuantityUpdated = (cell) => {
        this.setState({ isLoading: true });
        setTimeout(() => {
            this.setState({ isLoading: false })
        }, 300)
    };
    _onGridUnitPriceUpdated = (cell) => {
        this.setState({ isLoading: true });
        setTimeout(() => {
            this.setState({ isLoading: false })
        }, 300)
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

    setupColumns(value) {

        this.setState({ isLoading: true });

        let itemsColumns = value == 'quantity' ? filter(this.itemsColumns, (col) => col.key != 'defaultQuantity') : filter(this.itemsColumns, (col) => col.key != 'quantity')
        setTimeout(() => {
            this.setState({ itemsColumns, isLoading: false })
        }, 200)
    }

    render() {
        const ItemsGrid = this.state.isLoading === false ? (
            <>
                <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []}
                    cells={this.itemsColumns}
                    pageSize={this.state.rows.length} actions={[]} rowActions={[]}
                    rowClick={() => { }}
                />
            </>) : <LoadingSection />;

        let Step_1 = <Fragment>
            <div id="step1" className="step-content-body">
                <div className="subiTabsContent">
                    <div className="document-fields">
                        <Formik initialValues={{
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
                                this.addContract(values)
                            }}>
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
                                                <input type="radio" name="status" defaultChecked='checked' value="false" onChange={() => setFieldValue('status', false)} />
                                                <label>{Resources.oppened[currentLanguage]}</label>
                                            </div>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio" name="status" value="true" onChange={() => setFieldValue('status', true)} />
                                                <label>{Resources.closed[currentLanguage]}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="proForm datepickerContainer">
                                        <div className="linebylineInput valid-input">
                                            <DatePicker title='docDate'
                                                name="docDate"
                                                startDate={values.docDate}
                                                handleChange={e => { handleChange(e); setFieldValue('docDate', e) }} />
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <DatePicker title='completionDate'
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
                                                        index="contractTo" styles={CompanyDropdown} classDrop="companyName1 " />
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
                                                        index="contractWithContact" classDrop=" contactName1" styles={ContactDropdown} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"slider-Btns fullWidthWrapper textLeft "}>
                                        {this.state.saveLoading === false ? (
                                            <button className={"primaryBtn-1 btn " + (this.state.isViewMode === true ? "disNone" : "")} disabled={this.state.isViewMode} type="submit"  >{Resources['save'][currentLanguage]}</button>
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
                        <header><h2 class="zero">{Resources.items[currentLanguage]}</h2></header>
                        <div className="linebylineInput pre-radioBtn">
                            <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" name="status" defaultChecked='checked' onChange={e => this.setupColumns('quantity')} />
                                <label>{Resources.origenalQuantity[currentLanguage]}</label>
                            </div>
                            <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" name="status" onChange={e => this.setupColumns('defaultQuantity')} />
                                <label>{Resources.defaultQuantity[currentLanguage]}</label>
                            </div>
                        </div>
                        {ItemsGrid}
                    </div>
                </div>
            </div>
        </Fragment>
        return (
            <Fragment>
                <div>
                    <div className="documents-stepper noTabs__document one__tab one_step" >
                        <div className="doc-pre-cycle letterFullWidth">
                            <header>
                                <h2 className="zero">{Resources['subContracts'][currentLanguage]}</h2>
                            </header>
                        </div>
                        <div className="doc-container">
                            <div className="step-content">
                                {this.state.LoadingPage ? <LoadingSection /> : Step_1}
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}
export default withRouter(SubContract)