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

class ProjectBalanceReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            selectedStatus: { label: Resources.statusTypeSelect[currentLanguage], value: "0" },
            rows: [],
            showChart: true,
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
                width: 230,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "referenceCode",
                name: Resources["referenceCode"][currentLanguage],
                width: 170,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "totalExpenses",
                name: Resources["expensesTotal"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "totalBudgeted",
                name: Resources["totalBudgeted"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            },
            {
                key: "balance",
                name: Resources["balance"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
        ];

    }

    componentDidMount() {
    }

    componentWillMount() {
    }


    getGridRows = () => {
        this.setState({ isLoading: true })
        Dataservice.GetDataGrid('GetProjectsWithNegativeAndPositiveBalanceReport?statusBalance=' + this.state.selectedStatus.value + '').then(
            res => {
                let noClicks = this.state.noClicks;
                let _Equal = 0
                let _Positive = 0
                let _Negative = 0
                res.map(i => {
                    i.balance > 0 ? _Positive = _Positive + 1 : i.balance < 0 ? _Negative = _Negative + 1 : _Equal = _Equal + 1
                })

                let seriesData = [
                    { name: Resources['equal'][currentLanguage], y: _Equal }
                    , { name: Resources['positive'][currentLanguage], y: _Positive }
                    , { name: Resources['negative'][currentLanguage], y: _Negative }
                ]

                let _catag = []
                _catag.push(Resources['equal'][currentLanguage])
                _catag.push(Resources['positive'][currentLanguage])
                _catag.push(Resources['negative'][currentLanguage])

                let series = []
                series.push({ name: Resources['balance'][currentLanguage], data: seriesData })

                let xAxis = { categories: _catag }
                this.setState({
                    series, xAxis,
                    rows: res,
                    noClicks: noClicks + 1,
                    isLoading: false
                })
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    render() {

        let Chart =
            <BarChartComp
                noClicks={this.state.noClicks}
                series={this.state.series}
                xAxis={this.state.xAxis}
                title={Resources['projectBalanceReport'][currentLanguage]}
                yTitle={Resources['total'][currentLanguage]} />

        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'projectBalanceReport'} />
            : null

        return (

            <div className='mainContainer main__fulldash'>

                <div className="documents-stepper noTabs__document">

                    <div className="submittalHead">
                        <h2 className="zero">{Resources['projectBalanceReport'][currentLanguage]}</h2>
                        <div className="SubmittalHeadClose">
                            <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnslink="http://www.w3.org/1999/xlink">
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                        <g id="Group-2">
                                            <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                                <g id="Action-icons/Close/Circulated/20pt/Grey_Normal"><g id="Group"><circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
                                                    <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z" id="Combined-Shape" fill="#858D9E" fillRule="nonzero">
                                                    </path>
                                                </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>

                    <div className="doc-container">

                        <div className="step-content">
                            <div className="document-fields">
                                <div className=" fullWidthWrapper textRight">
                                    {btnExport}
                                </div>

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
                                        <Form onSubmit={handleSubmit}>
                                            <div className="proForm datepickerContainer">
                                                <Dropdown className="fullWidthWrapper textLeft" title='statusName' data={StatusDropData}
                                                    name='selectedStatus' value={values.selectedStatus}
                                                    selectedValue={this.state.selectedStatus} onChange={setFieldValue}
                                                    handleChange={e => this.setState({ selectedStatus: e })}
                                                    onBlur={setFieldTouched}
                                                    error={errors.selectedStatus}
                                                    touched={touched.selectedStatus} />

                                            </div>

                                            <div className="fullWidthWrapper ">
                                                <button className="primaryBtn-1 btn mediumBtn" type='submit'>{Resources['search'][currentLanguage]}</button>
                                            </div>

                                        </Form>
                                    )}
                                </Formik>


                            </div>

                            <div className="doc-pre-cycle letterFullWidth">
                                {Chart}
                            </div>

                            <div className="doc-pre-cycle letterFullWidth">
                                {dataGrid}
                            </div>

                        </div>
                    </div>
                </div>

            </div >
        )
    }

}
export default withRouter(ProjectBalanceReport)
