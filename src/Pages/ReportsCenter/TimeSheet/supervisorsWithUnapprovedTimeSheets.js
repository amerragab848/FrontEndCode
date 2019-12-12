import React, { Component } from 'react';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import dataservice from "../../../Dataservice";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class SupervisorsWithUnapprovedTimeSheets extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            rows: [],
            finishDate: moment(),
            startDate: moment(),
            defaultHour: ''
        }

        if (!Config.IsAllow(3713)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push("/");
        }

        this.columns = [{
            key: "empCode",
            name: Resources["employeeCode"][currentLanguage],
            width: 120,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            frozen: true,
            sortDescendingFirst: true
        }, {
            key: "contactName",
            name: Resources["ContactName"][currentLanguage],
            width: 220,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true,
        }, {
            key: "companyName",
            name: Resources["CompanyName"][currentLanguage],
            width: 250,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true
        }, {
            key: "supervisorName",
            name: Resources["Supervisor"][currentLanguage],
            width: 200,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true
        }, {
            key: "timeSheetCount",
            name: Resources["timeSheetCount"][currentLanguage],
            width: 100,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true
        }];
    }


    getGridRows = (value) => {
        this.setState({ isLoading: true });

        let obj = {
            startDate: moment(this.state.startDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
            finishDate: moment(this.state.finishDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS")
        }

        dataservice.addObject('GetSupervisorsWithUnapprovedTimeSheets', obj).then((res) => {
            if (res.length > 0) {
                this.setState({
                    rows: res, isLoading: false
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
        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                selectedCopmleteRow={true}
                columns={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []}
                columns={this.columns} fileName={Resources['supervisorsWithUnapprovedTimeSheets'][currentLanguage]} />
            : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.supervisorsWithUnapprovedTimeSheets[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div>
                    <Formik enableReinitialize={true}
                        onSubmit={(values) => {
                            this.getGridRows()
                        }}>
                        {({ errors, touched, handleSubmit, handleChange, handleBlur }) => (
                            <Form id="InspectionRequestForm" className="proForm reports__proForm" noValidate="novalidate" onSubmit={handleSubmit}>
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
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }
}

export default SupervisorsWithUnapprovedTimeSheets;
