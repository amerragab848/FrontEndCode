import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import Config from '../../../Services/Config';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import moment from "moment";
import dataService from '../../../Dataservice';
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import { Formik, Form } from 'formik';
import ExportDetails from "../ExportReportCenterDetails";
import CryptoJS from "crypto-js";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class SubmittalDrawingStatusList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            projectsList: [],
            SubmittalTypes: [],
            rows: [],
            submittalTypeList: [],
            projectList: [],
            finishDate: moment(),
            startDate: moment(),
            pageSize: 200,
            columns: [
                {
                    field: "submittalRefCode",
                    title: Resources["submittalRefNo"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: true,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "statusName",
                    title: Resources["status"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                }, {
                    field: "submittalSubject",
                    title: Resources["submittalSubject"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                    href: 'link',
                    classes: 'bold'
                }, {
                    field: "submittalApprovalStatus",
                    title: Resources["submittalApprovalStatus"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "docDate",
                    title: Resources["docDate"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "date",
                    sortable: true,
                },
                {
                    field: "drawingDescription",
                    title: Resources["drawingDescription"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "drawingReviewResult",
                    title: Resources["drawingReviewResult"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "drawingNo",
                    title: Resources["drawingNo"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "projectName",
                    title: Resources["projectName"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "lastApproveDate",
                    title: Resources["lastApproveDate"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "date",
                    sortable: true,
                },
                {
                    field: "lastWorkFlow",
                    title: Resources["lastWorkFlow"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "contractSubject",
                    title: Resources["contractSubject"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "durationDays",
                    title: Resources["durationDays"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "number",
                    sortable: true,
                },
                {
                    field: "closeDate",
                    title: Resources["closeDate"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "date",
                    sortable: true,
                },
                {
                    field: "cycleDate",
                    title: Resources["cycleDate"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "date",
                    sortable: true,
                },
                {
                    field: "cycleCloseDate",
                    title: Resources["cycleCloseDate"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "date",
                    sortable: true,
                },
                {
                    field: "submittalType",
                    title: Resources["submittalType"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "cycles",
                    title: Resources["cyclesCount"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "number",
                    sortable: true,
                },
                {
                    field: "discipline",
                    title: Resources["descipline"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "area",
                    title: Resources["area"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "location",
                    title: Resources["location"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "openedByName",
                    title: Resources["openedBy"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "lastSendDate",
                    title: Resources["lastSendDate"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "date",
                    sortable: true,
                },
                {
                    field: "lastSendTime",
                    title: Resources["lastSendTime"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "lastApproveTime",
                    title: Resources["lastApproveTime"][currentLanguage],
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
            this.props.history.push({ pathname: "/" });
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
        });
        //SubmittalTypes
        dataService.GetDataListCached("GetaccountsDefaultListForList?listType=SubmittalTypes", "title", "id", 'defaultLists', "SubmittalTypes", "listType").then(result => {
            this.setState({
                SubmittalTypes: [...result]
            });
        });

    }

    getGridtData = () => {
        this.setState({ currentComponent: null })

        let reportobj = {
            projectList: this.state.projectList,
            submittalTypeList: this.state.submittalTypeList,
            start: moment(this.state.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            end: moment(this.state.finishDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
        }

        this.setState({ isLoading: true })

        Api.post('GetSubmittalsDrawingStatusListReport', reportobj).then(res => {
            res.forEach(row => {
                let subject = "";
                if (row) {
                    let obj = {
                        docId: row.id,
                        projectId: row.projectId,
                        projectName: row.projectName,
                        arrange: 0,
                        docApprovalId: 0,
                        isApproveMode: false,
                        perviousRoute: window.location.pathname + window.location.search
                    };

                    let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj)); 
                    let encodedPaylod = CryptoJS.enc.Base64.stringify(parms); 
                    subject = "/SubmittalAddEdit?id=" + encodedPaylod;
                }
                if (Config.IsAllow(223) || Config.IsAllow(221)) {
                    row.link = subject;
                }
            });
            this.setState({ rows: res || [], isLoading: false })
        }).catch(() => {
            this.setState({ isLoading: false, rows: [] })
            toast.error(Resources.operationCanceled[currentLanguage])
        }) 
    }

    HandleChangeProject = (e) => {
        let projectList = []
        e.forEach(project => {
            projectList.push(project.value)
        })
        this.setState({ projectList })
    }

    HandleChangeSubmittalType = (e) => {
        let submittalTypeList = []
        e.forEach(project => {
            submittalTypeList.push(project.value)
        })
        this.setState({ submittalTypeList })
    }

    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }

    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                gridKey="submittalDrawingStatusOnProjectsReport"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.state.columns}
                rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = <ExportDetails
            fieldsItems={this.state.columns}
            rows={this.state.rows}
            fields={this.fields}
            fileName={Resources.submittalDrawingStatusListReport[currentLanguage]} />

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
                    onSubmit={() => {
                        this.getGridtData()
                    }}>
                    {({ errors, touched, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit} className='proForm reports__proForm datepickerContainer' >
                            <div className="reportsWithMulti">
                                <div className="linebylineInput multiChoice fullWidthWrapper">
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

                                <div className="linebylineInput multiChoice fullWidthWrapper">
                                    <Dropdown title="submittalType"
                                        onChange={setFieldValue}
                                        isMulti={true}
                                        data={this.state.SubmittalTypes} 
                                        handleChange={e => {
                                            this.HandleChangeSubmittalType(e);
                                            let documentText = '';
                                            e.map(lable => {
                                                return documentText = lable.label + " - " + documentText
                                            });
                                            this.fields[0].value = documentText
                                        }}
                                        onBlur={setFieldTouched} />
                                </div>

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
