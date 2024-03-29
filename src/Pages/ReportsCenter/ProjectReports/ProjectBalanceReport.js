import React, { Component } from 'react'
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
import BarChartComp from '../TechnicalOffice/BarChartComp'
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')
const ValidtionSchema = Yup.object().shape({
    selectedStatus: Yup.string()
        .required(Resources['projectSelection'][currentLanguage])
        .nullable(true),
});
const StatusDropData = [
    { label: Resources.equal[currentLanguage], value: 0 },
    { label: Resources.positive[currentLanguage], value: 1 },
    { label: Resources.negative[currentLanguage], value: 2 },
]

const FixedNumber = ({ value }) => {
    return value ? value.toFixed(2) : '';
}
class ProjectBalanceReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            selectedStatus: { label: Resources.statusTypeSelect[currentLanguage], value: "0" },
            rows: [],
            showChart: false,
            series: [],
            xAxis: {},
            noClicks: 0,
            pageSize: 200,
        }

        if (!Config.IsAllow(3676)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }

        this.columns = [
            {
                field: "projectName",
                title: Resources["projectName"][currentLanguage],
                width: 25,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: "referenceCode",
                title: Resources["referenceCode"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "totalExpenses",
                title: Resources["expensesTotal"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "totalBudgeted",
                title: Resources["totalBudgeted"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "balance",
                title: Resources["balance"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
        ];

        this.fields = [{
            title: Resources["statusName"][currentLanguage],
            value: "",
            type: "text"
        }];
    }
    getGridRows = () => {
        this.setState({ isLoading: true })
        Dataservice.GetDataGrid('GetProjectsWithNegativeAndPositiveBalanceReport?statusBalance=' + this.state.selectedStatus.value + '').then(
            res => {

                this.setState({ showChart: true });

                let noClicks = this.state.noClicks;
                let _Equal = 0
                let _Positive = 0
                let _Negative = 0
                res.map(i => {
                    i.balance > 0 ? _Positive = _Positive + 1 : i.balance < 0 ? _Negative = _Negative + 1 : _Equal = _Equal + 1
                })
                let seriesData = [
                    { name: Resources['equal'][currentLanguage], value: _Equal }
                    , { name: Resources['positive'][currentLanguage], value: _Positive }
                    , { name: Resources['negative'][currentLanguage], value: _Negative }
                ]
                let _catag = []
                _catag.push(Resources['equal'][currentLanguage])
                _catag.push(Resources['positive'][currentLanguage])
                _catag.push(Resources['negative'][currentLanguage])
                let series = []
                series.push({ name: Resources['balance'][currentLanguage], data: seriesData })
                let xAxis = { categories: _catag }
                this.setState({
                    series: seriesData, xAxis,
                    rows: res,
                    showChart: true,
                    noClicks: noClicks + 1,
                    isLoading: false
                })
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    render() {
        let Chart = this.state.showChart ?
            (<BarChartComp
                noClicks={this.state.noClicks}
                series={this.state.series}
                xAxis={this.state.xAxis}
                multiSeries="no"
                title={Resources['projectBalanceReport'][currentLanguage]}
                yTitle={Resources['total'][currentLanguage]} />) : null

        const dataGrid = this.state.isLoading === false ? (

            <GridCustom
                ref='custom-data-grid'
                gridKey="projectBalanceReport"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />
        const btnExport =
            <ExportDetails fieldsItems={this.columns}
                rows={this.state.rows} fields={this.fields} fileName={Resources.projectBalanceReport[currentLanguage]} />


        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.projectBalanceReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <Formik
                    initialValues={{
                        selectedStatus: '',
                    }}
                    enableReinitialize={true}
                    validationSchema={ValidtionSchema}
                    onSubmit={(values, actions) => {

                        this.getGridRows()
                    }}>
                    {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form className='proForm reports__proForm datepickerContainer'onSubmit={handleSubmit}>
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title='statusName' data={StatusDropData}
                                    name='selectedStatus' value={values.selectedStatus}
                                    selectedValue={this.state.selectedStatus} onChange={setFieldValue}
                                    handleChange={e => { this.setState({ selectedStatus: e }); this.fields[0].value = e.label }}
                                    onBlur={setFieldTouched}
                                    error={errors.selectedStatus}
                                    touched={touched.selectedStatus} />
                            </div>
                            <button className="primaryBtn-1 btn smallBtn" type='submit'>{Resources['search'][currentLanguage]}</button>
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
export default withRouter(ProjectBalanceReport)
