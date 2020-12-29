import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ExportDetails from '../../../Componants/OptionsPanels/ExportDetails';
import SkyLight from 'react-skylight';
import * as communicationActions from "../../../store/actions/communication";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { withRouter } from "react-router-dom";
import Dataservice from '../../../Dataservice';


let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const companySchema = Yup.object().shape({
    selectedProject: Yup.string().required(Resources['projectRequired'][currentLanguage]).nullable(true),
    SelectedPaymentRequisition: Yup.string().required(Resources['paymentRequistionRequired'][currentLanguage]).nullable(true)
});


class ContractedQtyVSEarnedQty extends Component {

    constructor(props) {
        super(props)
        this.columns = [
            {
                field: "arrange",
                title: Resources["no"][currentLanguage],
                width: 4,
                groupable: true,
                fixed: true,
                sortable: true,
                hidden: false,
                type: "number"
            },
            {
                field: "boqType",
                title: Resources["boqType"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, hidden: false,
                type: "text"
            }, {
                field: "secondLevel",
                title: Resources["boqTypeChild"][currentLanguage],
                width: 13,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "text"
            }, {
                field: "itemCode",
                title: Resources["itemCode"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "text"
            }, {
                field: "subject",
                title: Resources["description"][currentLanguage],
                width: 15,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "text",
            },
            {
                field: "unit",
                title: Resources["unit"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "text"
            },
            {
                field: "unitPrice",
                title: Resources["unitPrice"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "number"
            }, {
                field: "quantity",
                title: Resources["boqQuanty"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "number"
            }, {
                field: "revisedQuantity",
                title: Resources["approvedQuantity"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "number"
            },
            {
                field: "earnedQuantity",
                title: Resources["earnedQuantity"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "number"
            },
            {
                field: "quantityComplete",
                title: Resources["quantityComplete"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "number"
            },
            {
                field: "paymentPercent",
                title: Resources["paymentPercent"][currentLanguage],
                width: 15,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "text"
            },
            {
                field: "wasAdded",
                title: Resources["status"][currentLanguage],
                width: 15,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "text"
            },
            {
                field: "totalExcutedPayment",
                title: Resources["totalAmount"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "number"
            },
            {
                field: "lastComment",
                title: Resources["comment"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "text"
            },
            {
                field: "itemStatus",
                title: Resources["itemStatus"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "text"
            }
        ];

        this.state = {
            isLoading: false,
            PaymentRequisitionList: [],
            projectsList: [],
            SelectedPaymentRequisition: { label: Resources.paymentRequistion[currentLanguage], value: "0" },
            SelectedProject: { label: Resources.projectName[currentLanguage], value: "0" },
            rows: [],
            pageSize: 1000,
            pageNumber: 0,
            totalRows: 0
        }

        if (!Config.IsAllow(10074)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

        this.fields = [
            {
                title: Resources["projectName"][currentLanguage],
                value: "",
                type: "text"
            },
            {
                title: Resources["paymentRequistion"][currentLanguage],
                value: "",
                type: "text"
            }
        ];

        this.exportData = {
            docTypeId: "121",
            docId: "",
            approvalStatus: true,
            projectId: "",
            documentName: Resources.contractQtyVsEarnedQty[currentLanguage],
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true })
        Dataservice.GetDataList(`GetAccountsProjectsByIdForList`, "projectName", "projectId").then(result => {
            //Api.get(`GetAccountsProjectsByIdForList`).then(result => {
            this.setState({
                projectsList: result,
                isLoading: false
            });
        }).catch((ex) => {
            toast.error(console.log("ex...", ex))
        })
    }

    handleProjectChange = (e) => {
        Dataservice.GetDataList(`GetContractsRequestPaymentsForList?projectId=${e.value}`, "subject", "id").then(result => {

            // Api.get(`GetContractsRequestPaymentsForList?projectId=${e.value}`).then(result => {
            this.setState({
                PaymentRequisitionList: result,
                isLoading: false
            });
        }).catch((ex) => {
            toast.error(ex);
        })
    }

    getGridRows = () => {
        this.setState({ isLoading: true })
        Object.assign(this.exportData, {
            docId: this.state.SelectedPaymentRequisition.value,
            projectId: this.state.selectedProject.value
        })
        let exportFilterObj = {
            projectName: this.fields[0].value,
            paymentRequistion: this.fields[1].value,
            projectId: this.state.selectedProject.value
        }
        Api.get(`GetRequestItemsByRequestIdForReport?requestId=${this.state.SelectedPaymentRequisition.value}&pageNumber=${this.state.pageNumber}&pageSize=${this.state.pageSize}`).then((res) => {
            this.setState({ rows: res || [], isLoading: false })
            this.props.actions.reportFilters(exportFilterObj)
            this.props.actions.ExportingReportData(res);
        }).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    GetPrevoiusData() {
        let pageNumber = this.state.pageNumber - 1;
        if (pageNumber >= 0 && this.state.SelectedPaymentRequisition.value > 0) {
            this.setState({
                isLoading: true,
                pageNumber: pageNumber
            });
            let url = `GetRequestItemsByRequestIdForReport?requestId=${this.state.SelectedPaymentRequisition.value}&pageNumber=${pageNumber}&pageSize=${this.state.pageSize}`
            Api.get(url).then(result => {
                this.setState({
                    rows: result || [], 
                    isLoading: false
                });
            })
        }
    };

    GetNextData() {
        let pageNumber = this.state.pageNumber + 1;
        let maxRows = this.state.totalRows;
        if (this.state.pageSize * pageNumber !== 0 && this.state.pageSize * pageNumber < maxRows && this.state.SelectedPaymentRequisition.value > 0) {
            this.setState({
                isLoading: true,
                pageNumber: pageNumber
            });
            let url = `GetRequestItemsByRequestIdForReport?requestId=${this.state.SelectedPaymentRequisition.value}&pageNumber=${pageNumber}&pageSize=${this.state.pageSize}`
            Api.get(url).then(result => {
                this.setState({
                    rows: result || [],
                    // rows: result.data || [],
                    // totalRows: result.total || 0,
                    isLoading: false
                });
            })
        }
    };

    Export = () => {
        this.simpleDialog.show();
        this.setState({ showModal: true })
    }

    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                gridKey="ContractedQtyVsEarnedQty"
                data={this.state.rows}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : null

        const btnExport = <button className="primaryBtn-2 btn mediumBtn" type="button" onClick={() => this.Export()}>{Resources.export[currentLanguage]}</button>


        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.contractQtyVsEarnedQty[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className="submittalFilter readOnly__disabled">
                    <div className="filterBTNS">
                        <Formik
                            initialValues={{
                            }}
                            enableReinitialize={true}
                            validationSchema={companySchema}
                            onSubmit={() => {
                                this.getGridRows()
                            }}>
                            {({ errors, touched, handleSubmit, setFieldTouched, setFieldValue }) => (
                                <Form onSubmit={handleSubmit} className='proForm reports__proForm datepickerContainer'>
                                    <div className="linebylineInput valid-input" style={{ "width": "250px" }}>
                                        <Dropdown title='projectName'
                                            data={this.state.projectsList}
                                            name='selectedProject'
                                            selectedValue={this.state.selectedProject}
                                            handleChange={e => {
                                                this.handleProjectChange(e);
                                                this.setState({ selectedProject: e })
                                                this.fields[0].value = e.label
                                            }}
                                            value={this.state.selectedProject}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.selectedProject}
                                            touched={touched.selectedProject}
                                        />
                                    </div>
                                    <div className="linebylineInput valid-input" style={{ "width": "400px" }}>
                                        <Dropdown title='paymentRequistion'
                                            data={this.state.PaymentRequisitionList}
                                            name='SelectedPaymentRequisition'
                                            selectedValue={this.state.SelectedPaymentRequisition}
                                            handleChange={e => {
                                                this.setState({ SelectedPaymentRequisition: e })
                                                this.fields[1].value = e.label

                                            }}
                                            value={this.state.SelectedPaymentRequisition}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.SelectedPaymentRequisition}
                                            touched={touched.SelectedPaymentRequisition}
                                        />
                                    </div>
                                    <button className="primaryBtn-1 btn smallBtn" type='submit'>{Resources['search'][currentLanguage]}</button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                    {/* <div className="rowsPaginations readOnly__disabled">
                        <div className="rowsPagiRange">
                            <span>{this.state.pageSize * this.state.pageNumber + 1}</span> -
                            <span>
                                {this.state.pageSize * this.state.pageNumber + this.state.pageSize}
                            </span>
                            {Resources['jqxGridLanguage'][currentLanguage].localizationobj.pagerrangestring}
                            <span> {this.state.totalRows}</span>
                        </div>
                        <button className={this.state.pageNumber == 0 ? "rowunActive" : ""} onClick={() => this.GetPrevoiusData()}><i className="angle left icon" /></button>
                        <button className={this.state.totalRows !== this.state.pageSize * this.state.pageNumber + this.state.pageSize ? "rowunActive" : ""} onClick={() => this.GetNextData()}>
                            <i className="angle right icon" />
                        </button>
                    </div> */}
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
                <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources.export[currentLanguage]}>
                        {this.props.items.length > 0 ? (ExportDetails && <ExportDetails  {...this.exportData} />) : null}
                    </SkyLight>
                </div>
                {this.state.isLoading == true ? <LoadingSection /> : null}
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        items: state.communication.items,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ContractedQtyVSEarnedQty));

