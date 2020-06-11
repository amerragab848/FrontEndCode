import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous';
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import ExportDetails from "../ExportReportCenterDetails";
import Dataservice from '../../../Dataservice';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Api from '../../../api.js';

import moment from 'moment';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')

const ValidtionSchema = Yup.object().shape({
    selectedProject: Yup.string()
        .required(Resources['projectSelection'][currentLanguage])
        .nullable(true)
});
class reqPaymInvoicesRpt extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            ProjectsData: [],
            projectIds: [],
            RequestPayment: [],
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: "0" },
            selectedRequestPayment: { label: Resources.paymentRequistionList[currentLanguage], value: "0" },
            rows: [],
            pageSize: 200,
        }

        if (!Config.IsAllow(3696)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }

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
            }, {
                field: "itemCode",
                title: Resources["itemCode"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                sortable: true, hidden: false,
                type: "number"
            }, {
                field: "details",
                title: Resources["description"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, hidden: false,
                type: "text"
            }, {
                field: "boqType",
                title: Resources["boqType"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, hidden: false,
                type: "text"
            }, {
                field: "secondLevel",
                title: Resources["boqTypeChild"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, hidden: false,
                type: "text"
            }, {
                field: "boqSubType",
                title: Resources["boqSubType"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, hidden: false,
                type: "text"
            }, {
                field: "quantity",
                title: Resources["boqQuanty"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, hidden: false,
                type: "text"
            }, {
                field: "revisedQuantity",
                title: Resources["approvedQuantity"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, hidden: false,
                type: "text"
            }, {
                field: "actualPercentage",
                title: Resources["actualPercentage"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, hidden: false,
                type: "text"
            }, {
                field: "unitPrice",
                title: Resources["unitPrice"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, hidden: false,
                type: "number"
            }, {
                field: "unit",
                title: Resources["unit"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, hidden: false,
                type: "text"
            }, {
                field: "prevoiuseQnty",
                title: Resources["previousQuantity"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, hidden: false,
                type: "number"
            }, {
                field: "currentQty",
                title: Resources["currentQuantity"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, hidden: false,
                type: "number"
            }, {
                field: "currentTotalAmount",
                title: Resources["currentTotalAmount"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, hidden: false,
                type: "number"
            }, {
                field: "prevoiuseTotalAmount",
                title: Resources["prevoiuseTotalAmount"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, hidden: false,
                type: "number"
            }, {
                field: "oldPaymentPercent",
                title: Resources["previousPaymentPercent"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, hidden: false,
                type: "number"
            }, {
                field: "sitePercentComplete",
                title: Resources["sitePercentComplete"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "number"
            }, {
                field: "siteQuantityComplete",
                title: Resources["siteQuantityComplete"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "number"
            }, {
                field: "sitePaymentPercent",
                title: Resources["contractPaymentPercent"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "number"
            }, {
                field: "percentComplete",
                title: Resources["percentComplete"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "number"
            }, {
                field: "quantityComplete",
                title: Resources["quantityComplete"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "number"
            }, {
                field: "paymentPercent",
                title: Resources["paymentPercent"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "number"
            }, {
                field: "totalExcutedPayment",
                title: Resources["totalAmount"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, hidden: false,
                type: "number"
            }, {
                field: "lastComment",
                title: Resources["comment"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, hidden: false,
                type: "text"
            }, {
                field: "itemStatus",
                title: Resources["itemStatus"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, hidden: false,
                type: "text"
            }];

        this.fields = [{
            title: Resources["Projects"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["siteRequest"][currentLanguage],
            value: "",
            type: "text"
        }];
    }

    componentDidMount() {
        Dataservice.GetDataList('ProjectProjectsForList', 'projectName', 'id').then(
            result => {
                this.setState({
                    ProjectsData: result
                })
            }).catch(() => {
                toast.error('somthing wrong')
            })
    }

    HandleChangeProject = (e) => {
        this.setState({ selectedProject: e })
        Dataservice.GetDataList('GetRequestPaymentsForList?projectId=' + e.value, 'subject', 'id').then(
            res => {
                this.setState({
                    RequestPayment: res
                })
            }).catch((e) => {
                toast.error('somthing wrong')
            })
    }
    getGridRows = () => {
        this.setState({ isLoading: true })

        Api.get('GetContractsRequestPaymentsItemsForRPT?requestId=' + this.state.selectedRequestPayment.value).then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false
                })
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                key="paymentRequisition"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />
        ) : <LoadingSection />
        const btnExport = <ExportDetails fieldsItems={this.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.paymentRequisition[currentLanguage]} />

        return (
            <div className="reports__content reports__multiDrop">
                <header>
                    <h2 className="zero">{Resources.reqPaymInvoicesRpt[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <Formik
                    initialValues={{
                        selectedProject: '',
                        selectContractor: ''
                    }}
                    enableReinitialize={true}
                    validationSchema={ValidtionSchema}
                    onSubmit={(values, actions) => {
                        this.getGridRows()
                    }}>
                    {({ errors, touched, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit} className='proForm reports__proForm'>

                            <div className="linebylineInput valid-input ">
                                <Dropdown
                                    title='Projects'
                                    data={this.state.ProjectsData}
                                    name='selectedProject'
                                    selectedValue={this.state.selectedProject}
                                    onChange={setFieldValue}
                                    handleChange={e => { this.HandleChangeProject(e); this.fields[0].value = e.label }}
                                    onBlur={setFieldTouched}
                                    error={errors.selectedProject}
                                    touched={touched.selectedProject}
                                />
                            </div>
                            <div className="linebylineInput valid-input " >
                                <Dropdown
                                    title='siteRequest'
                                    data={this.state.RequestPayment}
                                    name='selectedRequestPayment'
                                    selectedValue={this.state.selectedRequestPayment}
                                    onChange={setFieldValue}
                                    handleChange={e => { this.setState({ selectedRequestPayment: e }); this.fields[1].value = e.label }}
                                    onBlur={setFieldTouched}
                                    error={errors.selectedRequestPayment}
                                    touched={touched.selectedRequestPayment}
                                    value={values.selectedRequestPayment} />
                            </div>
                            <div className="btn__multi">
                                <button className="primaryBtn-1 btn smallBtn" type='submit'>{Resources['search'][currentLanguage]}</button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

}
export default withRouter(reqPaymInvoicesRpt)
