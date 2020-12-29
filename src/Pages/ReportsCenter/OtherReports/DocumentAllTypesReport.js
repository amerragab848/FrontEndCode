import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import ExportDetails from "../ExportReportCenterDetails";
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import Dataservice from '../../../Dataservice';
import { Formik, Form } from 'formik';
import DatePicker from "../../../Componants/OptionsPanels/DatePicker";
import moment from "moment";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')

class DocumentAllTypesReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            docTypeSelect: { label: Resources.docTypeSelect[currentLanguage], value: "0" },
            pageSize: 200,
            rows: [],
            startDate: moment().format("YYYY-MM-DD"),
            finishDate: moment().format("YYYY-MM-DD")
        }

        if (!Config.IsAllow(3743)) {

            toast.success(Resources["missingPermissions"][currentLanguage]);

            this.props.history.push("/");
        }

        this.columns = [
            {
                field: "arrange",
                title: Resources["arrange"][currentLanguage],
                width: 8,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true
            }, {
                field: "statusName",
                title: Resources["status"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true
            }, {
                field: "projectName",
                title: Resources["projectName"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true
            }, {
                field: "subject",
                title: Resources["subject"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true
            },
            {
                field: "docTypeName",
                title: Resources["docType"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true
            }, {
                field: "fromCompany",
                title: Resources["fromCompany"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true
            }, {
                field: "sendDate",
                title: Resources["sendDate"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true
            }, {
                field: "lastApprovalDate",
                title: Resources["lastApprovalDate"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true
            }, {
                field: "duration2",
                title: Resources["duration"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true
            }, {
                field: "openedBy",
                title: Resources["openedBy"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true
            }, {
                field: "closedBy",
                title: Resources["closedBy"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true
            }, {
                field: "actionByContactName",
                title: Resources["actionByContact"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true
            }, {
                field: "workFlowName",
                title: Resources["workFlowName"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true
            }, {
                field: "lastApprovalByContactName",
                title: Resources["lastApproval"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true
            }, {
                field: "epsName",
                title: Resources["epsName"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true
            }, {
                field: "docStatus",
                title: Resources["docStatus"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true
            }
        ];
         this.fields = [
         {
            title: Resources["startDate"][currentLanguage],
            value: this.state.startDate,
            type: "D"
        }, {
            title: Resources["finishDate"][currentLanguage],
            value: this.state.finishDate,
            type: "D"
        }];

    }

    getGridRows = () => {

        this.setState({ isLoading: true })

        let obj = {
            docType: this.state.docTypeSelect.value,
            startDate: moment(this.state.startDate, "YYYY-MM-DD").format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
            finishDate: moment(this.state.finishDate, "YYYY-MM-DD").format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
            pageNumber: 0,
            pageSize: 20000
        }

        Dataservice.addObject('GetWfForDocTypeReportV5', obj).then(
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

    handleChangeDate(e, field) {
        this.setState({
            [field]: e
        });
    }

    render() {

        const DataGridParent = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                gridKey="BudgetCashFlowReport"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                rowClick={() => { }}
                cells={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
               <ExportDetails fieldsItems={this.columns}
               rows={this.state.rows}
               fields={this.fields} fileName={Resources.WorkFlowWithDocumentAllTypesDetails[currentLanguage]} />  
            : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.WorkFlowWithDocumentAllTypesDetails[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <Formik
                    initialValues={{
                        docTypeSelect: '',
                    }}
                    enableReinitialize={true}
                    onSubmit={() => {
                        this.getGridRows()
                    }}>

                    {({ handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit} className="proForm reports__proForm">
                            <div className="linebylineInput valid-input alternativeDate">
                                <DatePicker title="startDate"
                                    startDate={this.state.startDate}
                                    handleChange={e => { this.handleChangeDate(e, "startDate"); this.fields[0].value = e }} />
                            </div>
                            <div className="linebylineInput valid-input alternativeDate">
                                <DatePicker title="finishDate"
                                    startDate={this.state.finishDate}
                                    handleChange={e => { this.handleChangeDate(e, "finishDate"); this.fields[1].value = e }} />
                            </div>
                            <button className="primaryBtn-1 btn smallBtn" type='submit'>{Resources['search'][currentLanguage]}</button>
                        </Form>
                    )}
                </Formik>
                <div className="doc-pre-cycle letterFullWidth">
                    {DataGridParent}
                </div>
            </div>
        )
    }
}

export default withRouter(DocumentAllTypesReport)




