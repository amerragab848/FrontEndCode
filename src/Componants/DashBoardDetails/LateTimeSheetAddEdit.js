import React, { Component, Fragment } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import Resources from "../../resources.json";
import moment from "moment";
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import HeaderDocument from "../OptionsPanels/HeaderDocument";
import "./LateTimeSheet.css";
import { toast } from "react-toastify";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
    project: Yup.string().required(Resources['projectSelection'][currentLanguage]).nullable(true),
    task: Yup.string().required(Resources['selectTask'][currentLanguage]).nullable(),
    country: Yup.string().required(Resources['pleaseSelectCountry'][currentLanguage]).nullable(),
    location: Yup.string().required(Resources['pleaseSelectlocation'][currentLanguage]).nullable(),
    hours: Yup.string().required(Resources["hoursRequired"][currentLanguage])
});
let table = [];

class LateTimeSheetAddEdit extends Component {
    constructor() {
        super()
        this.state = {
            projects: [],
            tasks: [],
            countries: [],
            locations: [],

            searchParams: {
                date: new Date().toLocaleDateString(),
                project: null,
                task: null,
                hours: '',
                description: '',
                country: null,
                location: null,
                description: null,
            },
            date: new Date().toLocaleDateString(),
            selectedProject: { label: Resources.chooseProject[currentLanguage], value: "0" },
            selectedTask: { label: Resources.selectTask[currentLanguage], value: "0", param: "" },
            selectedCountry: { label: Resources.pleaseSelectCountry[currentLanguage], value: "0" },
            selectedLocation: { label: Resources.locationRequired[currentLanguage], value: "0" },
            selectedDate: '',
            totalHours: null,
            _items: [],
            superTotalHours: null,

        }
    }
    componentDidMount() {
        let today = new Date().toLocaleDateString();
        this.setState({
            selectedDate: today
        })
        dataservice.GetDataList("GetAccountsProjectsByIdForList", "projectName", "id").then(result => {
            this.setState({ projects: [...result] })
        });
        dataservice.GetDataList("GetAccountsDefaultList?listType=country&pageNumber=0&pageSize=10000", "title", "id").then(result => {
            this.setState({ countries: [...result] })
        });
        dataservice.GetDataList("GetAccountsDefaultList?listType=timesheetlocation&pageNumber=0&pageSize=10000", "title", "id").then(result => {
            this.setState({ locations: [...result] })
        });
    }
    handleChangeCycleDropDown(event, field, selectedValue) {

        if (event == null) return;
        let orignal = this.state.searchParams;
        orignal[field] = event.value;
        this.setState({
            [selectedValue]: event,
            searchParams: orignal
        });
        if (selectedValue === "selectedProject") {
            dataservice.GetDataListWithAdditionalParam(`GetTasksAsignUsers?projectId=${event.value} `, "subject", "id", "taskProgress").then(result => {
                this.setState({ tasks: [...result] })

            })
        }
    }
    handleChangeCycle(e, field) {

        let orignal = this.state.searchParams;
        orignal[field] = e.target.value;


        this.setState({
            searchParams: orignal
        });
    }
    setDate(e, field) {
        this.setState({
            [field]: e
        });
        let date = moment(e).format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        dataservice.GetDataGrid(`GetTimeSheetByDate?date=${date}`).then(result => {
            table = [];
            this.setState({ _items: [] })
            if (result.length > 0) {

                let total = 0;
                let projectTotal;
                result.map((element, index) => {
                    projectTotal = 0;
                    table.push({
                        projectName: element.projectName,
                        tasks: element.tasks.map((ele, i) => {
                            total = total + ele.workHours;
                            projectTotal = projectTotal + ele.workHours;
                            return ({
                                taskName: ele.taskName,
                                hoursNum: ele.workHours,
                                taskStatus: ele.taskProgress
                            }
                            )

                        }),
                        projectTotal: projectTotal
                    });
                })
                console.log("table table ", table);
                this.setState({
                    _items: table,
                    superTotalHours: total
                });

            }
        });
    }
    FillGrid = (values) => {
        let dt = new Date(this.state.selectedDate).toISOString().split('T')[0];
        let start = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0];
        let finish = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
        let res = moment(dt, 'YYYY-MM-DD').isBetween(moment(start, 'YYYY-MM-DD'), moment(finish, 'YYYY-MM-DD'));
        if (res ||  moment(dt, 'YYYY-MM-DD').isSameOrAfter(finish, 'YYYY-MM-DD')) {
            toast.warn(
                Resources["saveInTimeSheet"][currentLanguage]
            );
 } else if (parseInt(this.state.searchParams.hours) > 11) {
             toast.warn(
                Resources["workingHoursLessEleven"][currentLanguage]
            );

        } else {
            let date = moment(this.state.selectedDate).format('YYYY/MM/DD[T]HH:mm:ss.SSS');
            let obj = {
                projectId: this.state.selectedProject.value,
                taskId: this.state.selectedTask.value,
                countryId: this.state.selectedCountry.value,
                locationId: this.state.selectedLocation.value,
                expenseValue: this.state.hours,
                description: this.state.description,
                docDate: date,
                taskDropDownDisabled: false
            }
            dataservice.addObject("AddLateTimeSheet", obj).then(res => {
                dataservice.GetDataGrid(`GetTimeSheetByDate?date=${date}`).then(result => {
                    table = [];
                    this.setState({ _items: [] })
                    if (result.length > 0) {
                        let total = 0;
                        let projectTotal;
                        result.map((element, index) => {
                            projectTotal = 0;
                            table.push({
                                projectName: element.projectName,
                                tasks: element.tasks.map((ele, i) => {
                                    total = total + ele.workHours;
                                    projectTotal = projectTotal + ele.workHours;
                                    return ({
                                        taskName: ele.taskName,
                                        hoursNum: ele.workHours,
                                        taskStatus: ele.taskProgress
                                    }
                                    )
                                }),
                                projectTotal: projectTotal
                            });
                        })

                        this.setState({
                            _items: table,
                            superTotalHours: total
                        });
                        toast.success(
                            Resources["operationSuccess"][currentLanguage]
                        );
                    }
                });
            }).catch(() => {
                toast.error(
                    Resources["operationCanceled"][currentLanguage]
                );
            })
        }
    }
    render() {
        return (
            <div className="documents-stepper noTabs__document">
                <div className="doc-container">
                    <HeaderDocument
                        docTitle={Resources.docTitle[currentLanguage]}
                    />
                    <div className="step-content">
                        <div className="document-fields">
                            <Formik
                                validationSchema={validationSchema}
                                initialValues={{ ...this.state.searchParams }}
                                enableReinitialize={true}
                                onSubmit={values => {
                                    this.FillGrid(values);
                                }}
                            >
                                {({ errors, touched, handleBlur, values, handleSubmit, setFieldValue, setFieldTouched }) => (
                                    <form className="customProform" noValidate="novalidate" onSubmit={handleSubmit} >
                                        <div className="proForm datepickerContainer">
                                            <div className="linebylineInput  alternativeDate">
                                                <DatePicker title='date'
                                                    startDate={this.state.selectedDate}
                                                    handleChange={(e) => { this.setDate(e, 'selectedDate') }} />
                                            </div>
                                            <div className="linebylineInput ">
                                                <Dropdown
                                                    onBlur={handleBlur}
                                                    onChange={setFieldValue}
                                                    name="country"
                                                    id="country"
                                                    title="country"
                                                    data={this.state.countries}
                                                    selectedValue={this.state.selectedCountry}
                                                    handleChange={(e) => this.handleChangeCycleDropDown(e, "country", 'selectedCountry')}
                                                    index="country"

                                                    error={errors.country}
                                                    touched={touched.country}
                                                />
                                            </div>
                                            <div className="linebylineInput ">
                                                <Dropdown
                                                    onBlur={setFieldTouched}
                                                    onChange={setFieldValue}
                                                    name="project"
                                                    id="project"
                                                    title="Project"
                                                    data={this.state.projects}
                                                    selectedValue={this.state.selectedProject}
                                                    handleChange={(e) => this.handleChangeCycleDropDown(e, "project", 'selectedProject')}
                                                    index="project"
                                                    error={errors.project}
                                                    em={touched.project}
                                                    touched={touched.project}
                                                />
                                            </div>
                                            <div className="linebylineInput ">
                                                <Dropdown
                                                    onBlur={handleBlur}
                                                    onChange={setFieldValue}
                                                    name="location"
                                                    id="location"
                                                    title="location"
                                                    data={this.state.locations}
                                                    selectedValue={this.state.selectedLocation}
                                                    handleChange={(e) => this.handleChangeCycleDropDown(e, "location", 'selectedLocation')}
                                                    index="location"

                                                    error={errors.location}
                                                    touched={touched.location}
                                                />
                                            </div>

                                            {this.state.selectedProject.value > 0 ? <div className="linebylineInput ">
                                                <Dropdown
                                                    onBlur={handleBlur}
                                                    onChange={setFieldValue}
                                                    name="task"
                                                    id="task"
                                                    title="Task"
                                                    data={this.state.tasks}
                                                    selectedValue={this.state.selectedTask}
                                                    handleChange={(e) => this.handleChangeCycleDropDown(e, "task", 'selectedTask')}
                                                    index="task"

                                                    error={errors.task}
                                                    em={touched.task}
                                                    touched={touched.task}
                                                />
                                            </div> : <div className="linebylineInput ">
                                                    <Dropdown
                                                        onBlur={handleBlur}
                                                        onChange={setFieldValue}
                                                        name="task"
                                                        id="task"
                                                        title="Task"
                                                        data={this.state.tasks}
                                                        selectedValue={this.state.selectedTask}
                                                        handleChange={(e) => this.handleChangeCycleDropDown(e, "task", 'selectedTask')}
                                                        index="task"

                                                        em={touched.task}
                                                        touched={touched.task}
                                                    />
                                                </div>}

                                            <div className="linebylineInput ">
                                                <label className="control-label">{Resources.hours[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.hours ? (" has-error") : !errors.hours && touched.hours ? (" has-success") : " ")} >
                                                    <input type="text" className="form-control" id="hours"
                                                        onBlur={handleBlur}
                                                        value={this.state.searchParams.hours}
                                                        placeholder={Resources.hours[currentLanguage]}
                                                        id="hours"
                                                        name="hours"
                                                        onChange={(e) => { this.handleChangeCycle(e, 'hours') }} />
                                                    {errors.hours ? (<em className="pError">{errors.hours}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput fullInputWidth letterFullWidth">
                                                <label className="control-label">{Resources.description[currentLanguage]}</label>
                                                <div className={"ui input inputDev "} >
                                                    <input type="text" className="form-control" id="description"
                                                        value={this.state.searchParams.description}
                                                        name="description"
                                                        placeholder={Resources.description[currentLanguage]}
                                                        onChange={(e) => { this.handleChangeCycle(e, 'description') }} />
                                                </div>
                                            </div>
                                            <div className="slider-Btns letterFullWidth">
                                                <button type="submit" className="btn primaryBtn-1" >{Resources.search[currentLanguage]}</button>
                                            </div>
                                        </div>
                                    </form>
                                )
                                }
                            </Formik>
                            <table className="attachmentTable">
                                <thead>
                                    <tr>

                                        <th>
                                            <div className="headCell">
                                                <span>
                                                    Task Name
                                        </span>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="headCell">
                                                <span>
                                                    Task Status
                                    </span>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="headCell">
                                                <span>
                                                    Workig Hours
                                        </span>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="headCell">
                                                <span>
                                                    Total Hr(s)
                                        </span>
                                            </div>
                                        </th>


                                    </tr>
                                </thead>

                                <tbody>

                                    {

                                        this.state._items.map((element, index) => {
                                            return (
                                                <>
                                                    <tr key={index} style={{
                                                        background: '#bcbcbc',
                                                        paddingLeft: '16px'
                                                    }} className="projectTr__title">
                                                        <td colspan="12" style={{ paddingLeft: '18px !important' }}> {element.projectName}</td>
                                                    </tr>
                                                    {element.tasks.map((ele, i) => {
                                                        return (
                                                            <tr>
                                                                <td>
                                                                    <div className="contentCell">
                                                                        <p className="zero">
                                                                            {ele.taskName}
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="contentCell" style={{ maxWidth: 'unset', paddingRight: '9px' }}>

                                                                        <div class="progress__container">
                                                                            <div class="progress__container--bar" style={{ width: (ele.taskStatus === undefined || ele.taskStatus === 0) ? '0%' : ele.taskStatus + '%', position: (ele.taskStatus === undefined || ele.taskStatus === 0) ? 'unset' : 'relative' }}>
                                                                                <p class="perCentage zero">{(ele.taskStatus === undefined || ele.taskStatus === 0) ? 0 : ele.taskStatus}%</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="contentCell">
                                                                        <p className="zero">
                                                                            {ele.hoursNum}
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="contentCell">
                                                                        <p className="zero">
                                                                            {element.projectTotal}
                                                                        </p>
                                                                    </div>
                                                                </td>

                                                            </tr>
                                                        )
                                                    })}

                                                </>
                                            )
                                        })
                                    }
                                </tbody>

                                <tfoot>
                                    <tr>
                                        <td colspan="4">
                                            <p>Total Hr(s)</p>
                                        </td>
                                        <td colspan="4">
                                            <p>{this.state.superTotalHours} Hr(s)</p>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LateTimeSheetAddEdit