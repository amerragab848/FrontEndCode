import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import ExportDetails from "../ExportReportCenterDetails";
import Dataservice from '../../../Dataservice';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import BarChartComp from '../TechnicalOffice/BarChartComp';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')
const ValidtionSchema = Yup.object().shape({
    selectedProject: Yup.string()
        .required(Resources['projectSelection'][currentLanguage])
        .nullable(true),
    selectedMaterialRequest: Yup.string()
        .required(Resources['siteRequestSelection'][currentLanguage])
        .nullable(true),
});

class SiteRequestReleasedQnt extends Component {

    constructor(props) {
        super(props)
        this.state = {
            noClicks: 0,
            isLoading: false,
            ProjectsData: [],
            MaterialRequest: [],
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: "0" },
            selectedMaterialRequest: { label: Resources.siteRequestSelection[currentLanguage], value: "0" },
            rows: [],
            showChart: false,
            series: [],
            xAxis: { type: 'category' },
            pageSize: 200,
        }

        if (!Config.IsAllow(3693)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }
        this.columns = [
            {
                field: "details",
                title: Resources["description"][currentLanguage],
                width: 50,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: "requestedQuantity",
                title: Resources["requestedQuantity"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            }, {
                field: "releasedQuantity",
                title: Resources["releasedQuantity"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            }
        ];

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
        Dataservice.GetDataList('ProjectProjectsGetAll', 'projectName', 'projectId').then(
            result => {
                this.setState({
                    ProjectsData: result
                })
            }).catch(() => {
                toast.error('somthing wrong')
            })
    }

    getGridRows = () => {
        this.setState({ isLoading: true })
        let noClicks = this.state.noClicks;
        Dataservice.GetDataGrid('GetSiteRequestItemsForReport?RequestId=' + this.state.selectedMaterialRequest.value + '').then(
            res => {

                this.setState({
                    showChart: true,
                    rows: res,
                    isLoading: false
                })

                let totalRequested = 0
                let totalReleased = 0

                res.forEach(element => {
                    totalRequested += element['requestedQuantity']
                    totalReleased += element['releasedQuantity']
                });
                let seriesData = [{ name: Resources['requestedQuantity'][currentLanguage], value: totalRequested },
                { name: Resources['releasedQuantity'][currentLanguage], value: totalReleased }]

                let series = []
                series.push({ name: Resources['total'][currentLanguage], data: seriesData })

                this.setState({
                    series: seriesData,
                    rows: res,
                    noClicks: noClicks + 1,
                    isLoading: false,
                    showChart: true
                })
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    HandleChangeProject = (e) => {
        this.setState({ selectedProject: e })
        Dataservice.GetDataList('GetContractsSiteRequestList?projectId=' + e.value + '&pageNumber=0&pageSize=1000', 'subject', 'id').then(
            res => {
                this.setState({
                    MaterialRequest: res
                })
            }).catch((e) => {
                toast.error('somthing wrong')
            })
    }

    render() {
        let Chart = this.state.showChart ?
            (<BarChartComp
                noClicks={this.state.noClicks}
                series={this.state.series}
                multiSeries="no"
                xAxis={this.state.xAxis}
                title='Payment Requisition Quantities'
                yTitle={Resources['total'][currentLanguage]} />) : null

        const dataGrid = this.state.isLoading === false ? (

            <GridCustom
                ref='custom-data-grid'
                gridKey="SiteReqReleasedQnt"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = <ExportDetails fieldsItems={this.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.siteRequestReleasedQntReport[currentLanguage]} />

        return (


            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.siteRequestReleasedQntReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <Formik
                    initialValues={{
                        selectedProject: '',
                        selectedMaterialRequest: ''
                    }}
                    enableReinitialize={true}
                    validationSchema={ValidtionSchema}
                    onSubmit={(values, actions) => {
                        this.getGridRows()
                    }}>
                    {({ errors, touched, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit} className='proForm reports__proForm datepickerContainer'>
                            <div className="linebylineInput valid-input">
                                <Dropdown title='Projects' data={this.state.ProjectsData} name='selectedProject'
                                    selectedValue={this.state.selectedProject} onChange={setFieldValue}
                                    handleChange={e => { this.HandleChangeProject(e); this.fields[0].value = e.label }}
                                    onBlur={setFieldTouched}
                                    error={errors.selectedProject}
                                    touched={touched.selectedProject}
                                    value={values.selectedProject} />
                            </div>
                            <div className="linebylineInput valid-input " >
                                <Dropdown title='siteRequest' data={this.state.MaterialRequest} name='selectedMaterialRequest'
                                    selectedValue={this.state.selectedMaterialRequest} onChange={setFieldValue}
                                    handleChange={e => { this.setState({ selectedMaterialRequest: e }); this.fields[1].value = e.label }}
                                    onBlur={setFieldTouched}
                                    error={errors.selectedMaterialRequest}
                                    touched={touched.selectedMaterialRequest}
                                    value={values.selectedMaterialRequest} />
                            </div>

                            <button className="primaryBtn-1 btn smallBtn" type='submit'>{Resources['search'][currentLanguage]}</button>
                        </Form>
                    )}
                </Formik>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
                {this.state.showChart == true ?
                    <div className="row">
                        {Chart}
                    </div> : null}
            </div>


        )
    }

}
export default withRouter(SiteRequestReleasedQnt)
