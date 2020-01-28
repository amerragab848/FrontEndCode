import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import dataservice from "../../../Dataservice";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import GridCustom from 'react-customized-grid';
import GridSetup from "../../Communication/GridSetup"
import Export from "../../../Componants/OptionsPanels/Export";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import BarChartComp from '../../../Componants/ChartsWidgets/BarChartCompJS'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    CompanyName: Yup.string().required(Resources['companyRequired'][currentLanguage]).nullable(true)
})
class companyTimeSheet extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            dropDownList: [],
            selectedCompany: { label: Resources.companyRequired[currentLanguage], value: null },
            rows: [],
            showChart: false,
            finishDate: moment(),
            startDate: moment(),
            showChart: false
        }

        if (!Config.IsAllow(3711)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });

        }
        this.columns = [{
            "field": "projectName",
            "title": Resources.projectName[currentLanguage],
            "type": "text",
            "width": 15,
            "fixed": true,
            "groupable": true,
            "sortable": true
        }, {
            "field": "code",
            "title": Resources.projectCode[currentLanguage],
            "type": "text",
            "width": 15,
            "groupable": true,
            "sortable": true
        }, {
            "field": "estimateHours",
            "title": Resources.estimatedHours[currentLanguage],
            "type": "text",
            "width": 15,
            "groupable": true,
            "sortable": true
        }, {
            "field": "actualHours",
            "title": Resources.actualHours[currentLanguage],
            "type": "text",
            "width": 15,
            "groupable": true,
            "sortable": true
        }, {
            "field": "variance",
            "title": Resources.variance[currentLanguage],
            "type": "text",
            "width": 15,
            "groupable": true,
            "sortable": true
        }];
    }

    componentDidMount() {
        dataservice.GetDataList('GetCompanies?accountOwnerId=2', 'companyName', 'id').then(result => {
            this.setState({
                dropDownList: result
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })
    }

    getGridRows = () => {
        this.setState({ showChart: false, isLoading: true })
        let obj = {
            companyId: this.state.selectedCompany.value,
            startDate: moment(this.state.startDate),
            finishDate: moment(this.state.finishDate)
        }

        Api.post('GetCompanyTimeSheet', obj).then((res) => {
            if (res.length > 0) {
                this.setState({
                    rows: res, isLoading: false, showChart: true
                });
            }
            else
                this.setState({
                    rows: [], isLoading: false
                });

        }).catch(() => {
            this.setState({ isLoading: false })
        })

    }

    setDate = (name, value) => {
        this.setState({ [name]: value })
    }


    render() {

        let Chart = this.state.showChart ?
            <BarChartComp
                reports={true}
                rows={this.state.rows}
                barContent={[
                    { name: Resources['actualTotal'][currentLanguage], value: 'actualHours' },
                    { name: "Budget Expenses", value: 'estimateHours' },
                    { name: Resources['variance'][currentLanguage], value: 'variance' },

                ]}
                catagName="code"
                multiSeries="yes"
                ukey="companyTimeSheet"
                title={Resources['companyTimeSheet'][currentLanguage]}
                y="total"
                yTitle={Resources['total'][currentLanguage]} /> : null

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.columns}
                pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={Resources['companyTimeSheet'][currentLanguage]} />
            : null
        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.companyTimeSheet[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className=''>
                    <Formik
                        initialValues={{ CompanyName: this.state.selectedCompany.value }}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={() => {
                            this.getGridRows()
                        }}>
                        {({ errors, touched, handleSubmit, setFieldValue, setFieldTouched }) => (
                            <Form id="InspectionRequestForm" className="proForm reports__proForm" noValidate="novalidate" onSubmit={handleSubmit}>

                                <div className="linebylineInput valid-input">
                                    <Dropdown title="CompanyName" name="CompanyName" index="CompanyName"
                                        data={this.state.dropDownList} selectedValue={this.state.selectedCompany}
                                        handleChange={event => this.setState({ selectedCompany: event })}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.CompanyName}
                                        touched={touched.CompanyName} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='startDate'
                                        startDate={this.state.startDate}
                                        handleChange={e => this.setDate('startDate', e)} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='finishDate'
                                        startDate={this.state.finishDate}
                                        setDate={e => this.setDate('finishDate', e)} />
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

} export default companyTimeSheet;
