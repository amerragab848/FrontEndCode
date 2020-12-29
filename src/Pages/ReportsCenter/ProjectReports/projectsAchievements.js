import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import ExportDetails from "../ExportReportCenterDetails";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config'; 
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import moment from "moment";
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import Api from '../../../api';
import BarChartComp from '../TechnicalOffice/BarChartComp'
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')

const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
}

const ValidtionSchema = Yup.object().shape({
    selectedYear: Yup.string()
        .required(Resources['selectYear'][currentLanguage])
        .nullable(true),
});

class projectsAchievements extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            noClicks: 0,
            ProjectsData: [],
            selectedYear: { label: Resources['selectYear'][currentLanguage], value: "0" },
            rows: [],
            showChart: false,
            yearList: [
                { label: '2010', value: "2010" },
                { label: '2011', value: "2011" },
                { label: '2012', value: "2012" },
                { label: '2013', value: "2013" },
                { label: '2014', value: "2014" },
                { label: '2015', value: "2015" },
                { label: '2016', value: "2016" },
                { label: '2017', value: "2017" },
                { label: '2018', value: "2018" },
                { label: '2019', value: "2019" },
                { label: '2020', value: "2020" },
                { label: '2021', value: "2021" }
            ],
            pageSize: 200,
        }

        if (!Config.IsAllow(3680)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }

        this.columns = [
            {
                field: "total",
                title: Resources["total"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: "quarter",
                title: Resources["quarter"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
        ];

        this.fields = [{
            title: Resources["year"][currentLanguage],
            value: "",
            type: "text"
        }];
    }
    getData = () => {
        this.setState({ isLoading: true })

        let noClicks = this.state.noClicks;
        Api.get('ProjectsAchievementsRpt?year=' + this.state.selectedYear.value).then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false,
                    showChart: true
                })
                let _data = []
                let _catag = []
                let seriesData = []
                res.map((item, index) => {
                    _data.push(item.total)
                    _catag.push(item.quarter)
                    seriesData.push({ name: item.quarter, value: item.total, stack: index })
                })
                let xAxis = { categories: _catag }
                this.setState({ series: seriesData, xAxis, noClicks: noClicks + 1, showChart: true });
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }

    render() {
        const Chart = this.state.showChart ?
            (<BarChartComp
                multiSeries="no"
                noClicks={this.state.noClicks}
                series={this.state.series}
                xAxis={this.state.xAxis}
                title={'INCREASES IN PROJECTS'} yTitle={Resources['total'][currentLanguage]} />) : null

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                gridKey="projectAchievements"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <ExportDetails fieldsItems={this.columns}
                rows={this.state.rows} fields={this.fields} fileName={Resources.projectsAchievments[currentLanguage]} /> : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.projectsAchievments[currentLanguage]}</h2>
                    {btnExport}
                </header>

                <Formik
                    initialValues={{
                        selectedYear: this.state.selectedYear.value == '0' ? '' : this.state.selectedYear.value,
                    }}
                    enableReinitialize={true}
                    validationSchema={ValidtionSchema}
                    onSubmit={(values, actions) => {
                        this.getData()
                    }}>
                    {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form className='proForm reports__proForm datepickerContainer'onSubmit={handleSubmit}>
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="year"
                                    data={this.state.yearList}
                                    selectedValue={this.state.selectedYear}
                                    handleChange={event => { this.setState({ selectedYear: event }); this.fields[0].value = event.label }}
                                    onBlur={setFieldTouched}
                                    error={errors.selectedYear}
                                    touched={touched.selectedYear}
                                    value={values.selectedYear}
                                    onChange={setFieldValue}
                                    name="selectedYear"
                                    index="selectedYear"
                                />
                            </div>
                            <button className="primaryBtn-1 btn smallBtn" type='submit'>{Resources['search'][currentLanguage]} </button>
                        </Form>
                    )}
                </Formik>
                {this.state.showChart == true ?
                    <div className="row">
                        {Chart}
                    </div> : null}
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>

        )
    }

}
export default withRouter(projectsAchievements)
