import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous';
import GridCustom from 'react-customized-grid';
import dataservice from "../../../Dataservice";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
import ExportDetails from "../ExportReportCenterDetails";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    contactName: Yup.string().required(Resources['contactNameRequired'][currentLanguage]).nullable(true)
})
class EpsTimeSheet extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            dropDownList: [],
            selectedEps: { label: Resources.selectEPS[currentLanguage], value: 0 },
            rows: [],
            finishDate: moment(),
            startDate: moment(),
        }

        if (!Config.IsAllow(3717)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

        this.columns = [{
            "field": "number",
            "title": Resources.arrange[currentLanguage],
            "type": "text",
            "width": 8,
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
            "field": "subject",
            "title": Resources.subject[currentLanguage],
            "type": "text",
            "width": 20,
            "groupable": true,
            "sortable": true
        }, {
            "field": "total",
            "title": Resources.total[currentLanguage],
            "type": "text",
            "width": 8,
            "groupable": true,
            "sortable": true
        }, {
            "field": "estimatedTime",
            "title": Resources.estimatedTime[currentLanguage],
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

        this.fields = [{
            title: Resources["ContactName"][currentLanguage],
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
        dataservice.GetDataList('GetAllEPSForDrop', 'title', 'id').then(result => {
            if (Config.IsAllow(3737)) {
                this.columns.push({
                    "field": "cost",
                    "title": Resources["cost"][currentLanguage],
                    "type": "text",
                    "width": 15,
                    "groupable": true,
                    "sortable": true
                });
            }
            this.setState({
                dropDownList: result
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })
    }

    getGridRows = () => {
        this.setState({ isLoading: true })
        let obj = {
            epsId: this.state.selectedEps.value,
            startDate: moment(this.state.startDate),
            finishDate: moment(this.state.finishDate)
        }

        Api.post('GetTaskDetailByEpsId', obj).then((res) => {
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
        });
    }

    setDate = (name, value) => {
        this.setState({ [name]: value })
    }

    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.columns}
                pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = <ExportDetails fieldsItems={this.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.epsTimeSheetReport[currentLanguage]} />

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.epsTimeSheetReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className=''>
                    <Formik
                        initialValues={{ contactName: this.state.selectedEps.value }}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={(values) => {
                            this.getGridRows()
                        }}>
                        {({ errors, touched, handleSubmit, setFieldValue, setFieldTouched }) => (
                            <Form id="InspectionRequestForm" className='proForm reports__proForm datepickerContainer'noValidate="novalidate" onSubmit={handleSubmit}>

                                <div className="linebylineInput valid-input">
                                    <Dropdown title="ContactName" name="contactName" index="contactName"
                                        data={this.state.dropDownList} selectedValue={this.state.selectedEps}
                                        handleChange={event => { this.setState({ selectedEps: event }); this.fields[0].value = event.label }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.contactName}
                                        touched={touched.contactName}
                                        isClear={false}
                                        isMulti={false} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='startDate'
                                        startDate={this.state.startDate}
                                        handleChange={e => { this.setDate('startDate', e); this.fields[1].value = e }} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='finishDate'
                                        startDate={this.state.finishDate}
                                        setDate={e => { this.setDate('finishDate', e); this.fields[2].value = e }} />
                                </div>
                                <button className="primaryBtn-1 btn smallBtn"  >{Resources['search'][currentLanguage]}</button>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

} export default EpsTimeSheet;
