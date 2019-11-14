import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import dataservice from "../../../Dataservice";
import BarChartComp from '../../../Componants/ChartsWidgets/BarChartCompJS';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    CompanyName: Yup.string().required(Resources['companyRequired'][currentLanguage]).nullable(true)
})
class WorkingHours extends Component {

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
        }

        if (!Config.IsAllow(3702)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });

        }
    }

    componentDidMount() {
        dataservice.GetDataList('GetCompanyList', 'companyName', 'id').then(result => {
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

        Api.post('GetAllWorkingHours', obj).then((res) => {
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

    comapareDate = (startDate, finishDate, name, value) => {
        var a = moment(startDate);
        var b = moment(finishDate);
        var res = b.diff(a, 'years', true);
        if (res >= 0 && res <= 1) {
            this.setState({ [name]: value })
        }
        else {
            toast.warn("Date Range Must Be less than one year");

        }
    }

    render() {

        let Chart = this.state.showChart ?
            <BarChartComp
                multiSeries='no'
                key="estimate_01"
                api={null}
                y='expensesSum'
                catagName='month'
                title={''}
                reports={true}
                rows={this.state.rows}
            /> : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.workHours[currentLanguage]}</h2>
                </header>
                <div className=''>
                    <Formik
                        initialValues={{ CompanyName: this.state.selectedCompany.value }}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={(values) => {
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
                                        touched={touched.CompanyName}
                                        isClear={false}
                                        isMulti={false} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='startDate'
                                        startDate={this.state.startDate}
                                        handleChange={e => this.comapareDate(e, this.state.finishDate, 'startDate', e)} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='finishDate'
                                        startDate={this.state.finishDate}
                                        setDate={e => this.comapareDate(this.state.startDate, e, 'finishDate', e)} />
                                </div>
                                <button className="primaryBtn-1 btn smallBtn"  >{Resources['search'][currentLanguage]}</button>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="row">
                    {Chart}
                </div>
            </div>
        )
    }

} export default WorkingHours;
