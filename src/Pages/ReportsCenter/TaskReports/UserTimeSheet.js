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
import PieChartComp from '../../../Componants/ChartsWidgets/PieChartComp';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    CompanyName: Yup.string().required(Resources['companyRequired'][currentLanguage]).nullable(true)
})

class UserTimeSheet extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            dropDownList: [],
            selectedTask: { label: Resources.companyRequired[currentLanguage], value: null },
            rows: [],
            showChart: false,
            finishDate: moment(),
            startDate: moment(),
        }

        if (!Config.IsAllow(3704)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });

        }
        this.columns = [
            {
                key: "contactName",
                name: Resources["ContactName"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                frozen: true,
                sortDescendingFirst: true
            }, {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                frozen: true,
                sortDescendingFirst: true
            }, {
                key: "taskName",
                name: Resources["taskName"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                frozen: true,
                sortDescendingFirst: true
            }, {
                key: "hours",
                name: Resources["hours"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ];
    }

    componentDidMount() {
        dataservice.GetDataList('GetUsersTask', 'subject', 'id').then(result => {
            if (Config.IsAllow(3737)) {
                this.columns.push({
                    key: "cost",
                    name: Resources["cost"][currentLanguage],
                    width: 50,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                })
            }
            this.setState({
                dropDownList: result,
                isLoading: false
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })

    }

    getGridRows = () => {
        this.setState({ showChart: false, isLoading: true })
        let obj = {
            taskId: this.state.selectedTask.value,
            startDate: moment(this.state.startDate),
            finishDate: moment(this.state.finishDate)
        }

        Api.post('GetUsersTimesheetTasks', obj).then((res) => {
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


    render() {

        let Chart = this.state.showChart ?
            <PieChartComp
                key="userTimeSheet"
                api={null}
                y='hours'
                name='contactName'
                title={''}
                reports={true}
                rows={this.state.rows}
            /> : null

        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                selectedCopmleteRow={true} selectedRows={rows => this.selectedRows(rows)}
                pageSize={this.state.pageSize} columns={this.columns} onRowClick={(value, index, column) => this.onRowClick(value, index, column)} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={Resources['userTimeSheet'][currentLanguage]} />
            : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.userTimeSheet[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className=''>
                    <Formik
                        initialValues={{ CompanyName: this.state.selectedTask.value }}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={(values) => {
                            this.getGridRows()
                        }}>
                        {({ errors, touched, handleSubmit, setFieldValue, setFieldTouched }) => (
                            <Form id="InspectionRequestForm" className="proForm reports__proForm" noValidate="novalidate" onSubmit={handleSubmit}>

                                <div className="linebylineInput valid-input">
                                    <Dropdown title="taskName" name="taskName" index="taskName"
                                        data={this.state.dropDownList} selectedValue={this.state.selectedTask}
                                        handleChange={event => this.setState({ selectedTask: event })}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.taskName}
                                        touched={touched.taskName}
                                        isClear={false}
                                        isMulti={false} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='startDate'
                                        startDate={this.state.startDate}
                                        handleChange={e => this.setDate('startDate', e)} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='finishDate'
                                        startDate={this.state.finishDate}
                                        handleChange={e => this.setDate('finishDate', e)} />
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

} export default UserTimeSheet;
