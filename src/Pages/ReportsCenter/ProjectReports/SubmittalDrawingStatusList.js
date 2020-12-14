import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import Config from '../../../Services/Config';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Export from "../../../Componants/OptionsPanels/Export";
import moment from "moment";
import dataService from '../../../Dataservice';
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import BarChartComp from '../TechnicalOffice/BarChartComp';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ExportDetails from "../ExportReportCenterDetails";

const sumBy = require('lodash/sumBy')
const _ = require("lodash");

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const ValidtionSchema = Yup.object().shape({
    selectedProject: Yup.string().required(Resources['projectSelection'][currentLanguage]).nullable(true)
});

class SubmittalDrawingStatusList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            projectsList: [],
            rows: [],
            projectIds: [],
            finishDate: moment(),
            startDate: moment(),
            pageSize: 200,
            columns: [
                {
                    field: "submittalRefCode",
                    title: Resources["projectName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: true,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "statusName",
                    title: Resources["docDate"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                }, {
                    field: "submittalSubject",
                    title: Resources["expenseValue"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                }, {
                    field: "submittalApprovalStatus",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "docDate",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "date",
                    sortable: true,
                },
                {
                    field: "drawingDescription",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "drawingReviewResult",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "drawingNo",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "projectName",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "lastApproveDate",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "date",
                    sortable: true,
                },
                {
                    field: "lastWorkFlow",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "contractSubject",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "durationDays",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "number",
                    sortable: true,
                },
                {
                    field: "closeDate",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "date",
                    sortable: true,
                },
                {
                    field: "cycleDate",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "date",
                    sortable: true,
                },
                {
                    field: "cycleCloseDate",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "date",
                    sortable: true,
                },
                {
                    field: "submittalType",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "cycles",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "number",
                    sortable: true,
                },
                {
                    field: "discipline",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "area",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "location",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "openedByName",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "lastSendDate",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "date",
                    sortable: true,
                },
                {
                    field: "lastSendTime",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "lastApproveTime",
                    title: Resources["expenseTypeName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                }
            ]
        }

        if (!Config.IsAllow(10137)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

        this.fields = [{
            title: Resources["Projects"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["startDate"][currentLanguage],
            value: this.state.startDate,
            type: "D"
        }, {
            title: Resources["finishDate"][currentLanguage],
            value: this.state.finishDate,
            type: "D"
        }];

    }
    componentDidMount() {
        this.setState({ isLoading: true })
        dataService.GetDataList('ProjectProjectsForList', 'projectName', 'id').then(res => {
            this.setState({ projectsList: res, isLoading: false })
        })
    }

    getGridtData = () => {
        this.setState({ currentComponent: null })
        let reportobj = {
            projectIds: this.state.projectIds,
            start: moment(this.state.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            finish: moment(this.state.finishDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
        }
        this.setState({ isLoading: true })
        Api.post('GetSubmittalsDrawingStatusListReport', reportobj).then(res => {
            this.setState({ rows :res|| [], isLoading: false })
        }).catch(() => {
            this.setState({ isLoading: false, rows: [] })
            toast.error(Resources.operationCanceled[currentLanguage])
        })


    }

    HandleChangeProject = (e) => {
        let projectIds = []
        e.forEach(project => {
            projectIds.push(project.value)
        })
        this.setState({ projectIds })
    }

    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }

    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                key="expensesDetailsOnProjectsReport"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.state.columns}
                rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = <ExportDetails fieldsItems={this.state.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.submittalDrawingStatusListReport[currentLanguage]} />

        return (

            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.submittalDrawingStatusListReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <Formik
                    initialValues={{
                        selectedProject: ''
                    }}
                    enableReinitialize={true}
                    validationSchema={ValidtionSchema}
                    onSubmit={() => {
                        this.getGridtData()
                    }}>
                    {({ errors, touched, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit} className='proForm reports__proForm datepickerContainer' >
                            <div className="reportsWithMulti">
                                {/* <div className="reports__multiDrop letterFullWidth"> */}
                                    <div className="linebylineInput multiChoice">
                                        <Dropdown title='Projects' data={this.state.projectsList}
                                            name='selectedProject'
                                            onChange={setFieldValue}
                                            isMulti={true}
                                            handleChange={e => {
                                                this.HandleChangeProject(e);
                                                let documentText = '';
                                                e.map(lable => {
                                                    return documentText = lable.label + " - " + documentText
                                                });
                                                this.fields[0].value = documentText
                                            }}
                                            onBlur={setFieldTouched}
                                            error={errors.selectedProject}
                                            touched={touched.selectedProject}
                                        />
                                    </div>
                                {/* </div> */}
                                <div className="reports__smallInputs">
                                    <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker title='startDate'
                                            startDate={this.state.startDate}
                                            handleChange={e => { this.handleChange('startDate', e); this.fields[1].value = e }} />
                                    </div>
                                    <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker title='finishDate'
                                            startDate={this.state.finishDate}
                                            handleChange={e => { this.handleChange('finishDate', e); this.fields[2].value = e }} />
                                    </div>
                                </div>
                            </div>
                             <div className="button__reports">
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


export default SubmittalDrawingStatusList
