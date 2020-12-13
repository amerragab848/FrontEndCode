import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Export from "../../../Componants/OptionsPanels/Export";
import GridCustom from 'react-customized-grid';
import Api from '../../../api';
import { Formik, Form } from "formik";
import moment from "moment";
import * as Yup from "yup";
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker';
import dataservice from "../../../Dataservice";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')
const validationSchema = Yup.object().shape({
    contactName: Yup.string().required(Resources['contactNameRequired'][currentLanguage]).nullable(true)
})

class LoginHistoryReport extends Component {

    constructor(props) {

        super(props)
        this.state = {
            isLoading: false,
            dropDownList: [],
            selectedContact: { label: Resources.selectContact[currentLanguage], value: 0 },
            rows: [],
            showChart: false,
            finishDate: moment(),
            startDate: moment(),
            checkForGetAll: false
        }

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

        if (!Config.IsAllow(3770)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }

        this.columns = [
            {
                "field": "contactName",
                "title": Resources.ContactName[currentLanguage],
                "type": "text",
                "width": 15,
                "fixed": true,
                "groupable": true,
                "sortable": true
            }, {
                "field": "publicIP",
                "title": Resources.publicIP[currentLanguage],
                "type": "text",
                "width": 15,
                "fixed": true,
                "groupable": true,
                "sortable": true
            }, {
                "field": "browserName",
                "title": Resources.browserinfo[currentLanguage],
                "type": "text",
                "width": 25,
                "groupable": true,
                "sortable": true,
                "showTip": true
            }, {
                "field": "date",
                "title": Resources.date[currentLanguage],
                "type": "date",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "time",
                "title": Resources.time[currentLanguage],
                "width": 16,
                "groupable": true,
                "fixed": false,
                "type": "text",
                "sortable": true,
            }, {
                "field": "operatingSystem",
                "title": Resources.os[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true,
                "showTip": true
            }, {
                "field": "macAddress",
                "title": Resources.location[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }
        ];
    } 
    componentDidMount() {  
        let accountId = Config.getPayload().aci;

        dataservice.GetDataList('SelectAllAccountsActive?id=' + accountId, 'userName', 'id').then(result => {
            if (result) {
                this.setState({ dropDownList: result });
            }
        }).catch(() => {
            toast.error('somthing wrong')
        });
    }; 
    handleChange = (fieldValue) => {

        this.setState({ checkForGetAll: fieldValue })
    }
 
    setDate = (name, value) => {
        this.setState({ [name]: value })
    };

    getGridRows = () => {
        this.setState({ showChart: false, isLoading: true })
        let obj = {
            accountId: this.state.selectedContact.value == 0 ? null : this.state.selectedContact.value,
            startDate: moment(this.state.startDate),
            finishDate: moment(this.state.finishDate),
            selectAll : this.state.checkForGetAll
        }

        Api.post('GetLoginHistoryReport', obj).then((res) => {
            if (res.length > 0) {
                this.setState({
                    rows: res || [],
                    isLoading: false
                });
            }
            else
                this.setState({
                    rows: [],
                    isLoading: false
                });

        }).catch(() => {
            this.setState({ isLoading: false })
        })
    };

    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                groups={[]}
                data={this.state.rows || []}
                cells={this.columns}
                pageSize={this.state.rows.length}
                actions={[]}
                rowActions={[]}
                rowClick={() => { }}
            />
        ) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export
                rows={this.state.isLoading === false ? this.state.rows : []}
                columns={this.columns}
                fileName={'loginHistoryReport'} />
            : null

        return (

            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.loginHistoryReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm datepickerContainer'>
                    <div className=''>
                        <Formik
                            initialValues={{ contactName: this.state.selectedContact.value }}
                            validationSchema={validationSchema}
                            enableReinitialize={true}
                            onSubmit={(values) => {
                                this.getGridRows()
                            }}>
                            {({ errors, touched, handleSubmit, setFieldValue, setFieldTouched }) => (
                                <Form id="InspectionRequestForm" className='proForm reports__proForm datepickerContainer' noValidate="novalidate" onSubmit={handleSubmit}>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown
                                            title="ContactName"
                                            name="contactName"
                                            index="contactName"
                                            data={this.state.dropDownList}
                                            selectedValue={this.state.selectedContact}
                                            handleChange={event => { this.setState({ selectedContact: event }); this.fields[0].value = event.label }}
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
                                            handleChange={e => { this.setDate('finishDate', e); this.fields[2].value = e }} />
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <div className="ui checkbox checkBoxGray300 checked" >
                                            <input type="checkbox"
                                                id="checkForGetAll"
                                                name="checkForGetAll"
                                                value={this.state.checkForGetAll}
                                                checked={this.state.checkForGetAll}
                                                onChange={(e) => { this.handleChange(e.target.checked) }}
                                            />
                                            <label>{Resources.selectAll[currentLanguage]}</label>
                                        </div>
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
            </div>
        )
    }

}
export default withRouter(LoginHistoryReport)
