import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import moment from "moment";
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
    return value ? value.toFixed(2)  : '';
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
        }

        if (!Config.IsAllow(3676)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }

        this.columns = [
            {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "referenceCode",
                name: Resources["referenceCode"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "totalExpenses",
                name: Resources["expensesTotal"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true ,
                formatter:FixedNumber
            }, {
                key: "totalBudgeted",
                name: Resources["totalBudgeted"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter:FixedNumber
            },
            {
                key: "balance",
                name: Resources["balance"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter:FixedNumber
            },
        ];

    }
    getGridRows = () => {
        this.setState({ isLoading: true })
        Dataservice.GetDataGrid('GetProjectsWithNegativeAndPositiveBalanceReport?statusBalance=' + this.state.selectedStatus.value + '').then(
            res => {

                this.setState({showChart:true});
                
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
                    series:seriesData, xAxis,
                    rows: res,
                    showChart:true,
                    noClicks: noClicks + 1,
                    isLoading: false
                })
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    render() {
        let Chart =this.state.showChart ?
            (<BarChartComp
                noClicks={this.state.noClicks}
                series={this.state.series}
                xAxis={this.state.xAxis}
                multiSeries="no"
                title={Resources['projectBalanceReport'][currentLanguage]}
                yTitle={Resources['total'][currentLanguage]} />):null

        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'projectBalanceReport'} />
            : null

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
                            <Form className="proForm reports__proForm" onSubmit={handleSubmit}>
                               
                                <div className="linebylineInput valid-input">
                                    <Dropdown
                                     title='statusName' data={StatusDropData}
                                        name='selectedStatus' value={values.selectedStatus}
                                        selectedValue={this.state.selectedStatus} onChange={setFieldValue}
                                        handleChange={e => this.setState({ selectedStatus: e })}
                                        onBlur={setFieldTouched}
                                        error={errors.selectedStatus}
                                        touched={touched.selectedStatus} />
                                </div>
                                    <button className="primaryBtn-1 btn smallBtn" type='submit'>{Resources['search'][currentLanguage]}</button>
                            </Form>
                        )}
                    </Formik>
                    {this.state.showChart==true?
                    <div className="row">
                        {Chart}
                    </div>:null}
                    <div className="doc-pre-cycle letterFullWidth">
                        {dataGrid}
                    </div>
            </div>
        )
    }

}
export default withRouter(ProjectBalanceReport)
