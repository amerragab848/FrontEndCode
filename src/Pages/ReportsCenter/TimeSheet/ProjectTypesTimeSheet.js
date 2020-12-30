import React, { Component } from 'react';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import ExportDetails from "../ExportReportCenterDetails";
import dataservice from "../../../Dataservice";
import PieChartComp from '../../../Componants/ChartsWidgets/PieChartComp';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    companyName: Yup.string().required(Resources['CompanyName'][currentLanguage]).nullable(true),
    projectTypeId: Yup.string().required(Resources['projectType'][currentLanguage]).nullable(true)
})
class ProjectTypesTimeSheet extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            companies: [],
            projectType: [],
            selectedCompany: { label: Resources.CompanyName[currentLanguage], value: 0 },
            selectedProjectType: { label: Resources.projectType[currentLanguage], value: 0 },
            rows: [],
            showChart: false,
            finishDate: moment(),
            startDate: moment(),
        }

        if (!Config.IsAllow(3707)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push("/");
        }

        this.columns = [{
            "field": "job",
            "title": Resources.job[currentLanguage],
            "type": "text",
            "width": 15,
            "fixed": true,
            "groupable": true,
            "sortable": true
        }, {
            "field": "projectName",
            "title": Resources.projectName[currentLanguage],
            "type": "text",
            "width": 15,
            "groupable": true,
            "sortable": true
        }, {
            "field": "companyName",
            "title": Resources.CompanyName[currentLanguage],
            "type": "text",
            "width": 15,
            "groupable": true,
            "sortable": true
        }, {
            "field": "totalHours",
            "title": Resources.totalHours[currentLanguage],
            "type": "text",
            "width": 15,
            "groupable": true,
            "sortable": true
        }];

        this.fields = [{
            title: Resources["CompanyName"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["projectType"][currentLanguage],
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
        dataservice.GetDataList('GetCompanies?accountOwnerId=2', 'companyName', 'id').then(result => {
            this.setState({
                companies: result
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })

        dataservice.GetDataList('GetAccountsDefaultList?listType=project_Type&pageNumber=0&pageSize=10000', 'title', 'id').then(result => {
            this.setState({
                projectType: result
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })
    }

    getGridRows = () => {
        this.setState({ showChart: false, isLoading: true })
        let obj = {
            companyId: this.state.selectedCompany.value,
            projectTypeId: this.state.selectedProjectType.value,
            startDate: moment(this.state.startDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
            endDate: moment(this.state.finishDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS")
        }

        dataservice.addObject('GetProjectTypesTimeSheet', obj).then((res) => {
            if (res.length > 0) {
                this.setState({
                    rows: res, isLoading: false, showChart: true
                });
            }
            else
                this.setState({
                    rows: [], isLoading: false, showChart: false
                });

        }).catch(() => {
            this.setState({ isLoading: false })
        })

    }

    setDate = (name, value) => {
        this.setState({ [name]: value })
    }

    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridCustom ref='custom-data-grid' gridKey="ProjectTypesTimeSheet" groups={[]} data={this.state.rows || []} cells={this.columns}
                pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = <ExportDetails fieldsItems={this.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.projectTypesTimeSheet[currentLanguage]} />

        let Chart = this.state.showChart ?
            <PieChartComp
                key="taskSheet_02"
                api={null}
                y='totalHours'
                name='projectName'
                title={''}
                reports={true}
                rows={this.state.rows}
            /> : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.projectTypesTimeSheet[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div>
                    <Formik initialValues={{ companyName: '', projectTypeId: '' }}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={(values) => {
                            this.getGridRows()
                        }}>
                        {({ errors, touched, handleSubmit, setFieldValue, setFieldTouched }) => (
                            <Form id="InspectionRequestForm" className='proForm reports__proForm datepickerContainer'noValidate="novalidate" onSubmit={handleSubmit}>

                                <div className="linebylineInput valid-input">
                                    <Dropdown title="CompanyName" name="companyName" index="companyName"
                                        data={this.state.companies} selectedValue={this.state.selectedCompany}
                                        handleChange={event => { this.setState({ selectedCompany: event }); this.fields[0].value = event.label }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.companyName}
                                        touched={touched.companyName}
                                        isClear={false}
                                        isMulti={false} />
                                </div>
                                <div className="linebylineInput valid-input">
                                    <Dropdown title="projectType" name="projectTypeId" index="projectTypeId"
                                        data={this.state.projectType} selectedValue={this.state.selectedProjectType}
                                        handleChange={event => { this.setState({ selectedProjectType: event }); this.fields[1].value = event.label }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.projectTypeId}
                                        touched={touched.projectTypeId}
                                        isClear={false}
                                        isMulti={false} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='startDate'
                                        startDate={this.state.startDate}
                                        handleChange={e => { this.setDate('startDate', e); this.fields[2].value = e }} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='finishDate'
                                        startDate={this.state.finishDate}
                                        setDate={e => { this.setDate('finishDate', e); this.fields[3].value = e }} />
                                </div>
                                <button className="primaryBtn-1 btn smallBtn"  >{Resources['search'][currentLanguage]}</button>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="row">
                    {Chart}
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

} export default ProjectTypesTimeSheet;
