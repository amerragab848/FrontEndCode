import React, { Component, Fragment } from 'react';
import DropdownMelcous from '../OptionsPanels/DropdownMelcous';
import moment from 'moment';
import Api from '../../api';
import NotifiMsg from '../publicComponants/NotifiMsg'
import Recycle from '../../Styles/images/attacheRecycle.png'
import Resources from '../../resources.json';
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import sum from "lodash/sum";
import { Formik, Form, withFormik } from 'formik';
import * as Yup from 'yup';

import today from 'material-ui/svg-icons/action/today';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let timeSheetSettings = localStorage.getItem('timeSheetSettings') ? JSON.parse(localStorage.getItem('timeSheetSettings')) : { defaultHours: 0, timeSheetPolicy: 0, vacationDays: [] }
let defaultHours = timeSheetSettings['defaultHours'];
let timeSheetPolicy = timeSheetSettings['timeSheetPolicy'];
let vacationDays = timeSheetSettings['vacationDays'];
let total = '';
let day = moment(moment().format()).day();
day = day === 6 ? 1 : day + 2;
let date = moment().format();
let LastDate = ((moment().day() == 0) ? moment().subtract(3, "days").format() : moment().subtract(1, "days").format());
let yesterday = moment(LastDate).format("YYYY-MM-DD[T]HH:mm:ss.SS");
let Today = moment(date).format("YYYY-MM-DD[T]HH:mm:ss.SS");
let TodayTitle = "Today - " + moment(Today).format("DD-MM-YYYY");
let YesterdayTitle = "Yesterday - " + moment(LastDate).format("DD-MM-YYYY");

const options = [
    { value: 'NoDate', label: 'Please Select Date' },
    { value: 'felmeshmesh', label: TodayTitle },
    { value: 'felmeshmesh2', label: YesterdayTitle }
]

const workHoursValid = Yup.object().shape({
    workHours: Yup.number()
        .min(.5, Resources['numbersGreaterThanOrEqualHalf'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage])
});

let vacationDay = vacationDays.find(function (i) {
    return i === day;
})


let deleteRowId = '';
class AddTimeSheet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Projects: [],
            projectId: '',
            TaskData: [],
            taskId: '',
            countryData: [],
            LocationData: [],
            collapse: false,
            EstimatedHours: '',
            ActualTotal: '',
            TotalApprovedHours: '',
            EarnedHours: '',
            TotalRejectedHours: '',
            tasks: '',
            date: '',
            Description: '',
            countryId: '',
            workHours: '',
            locationId: '',
            dateValidation: true,
            countryValidation: true,
            locationValidation: true,
            projectsValidation: true,
            TimeSheetData: [],
            docDate: today,
            tableView: false,
            statusClass: "disNone",
            maxError: false,
            isLoading: false,
            ConfirmDelete: false,
            DeleteDone: false,
            VacationDayMSG: false,
            isNewMode: true
        };
    }

    onCloseModal = () => {
        this.setState({ ConfirmDelete: false });
    };

    country_handelChange = (e) => {
        this.setState({
            countryId: e,
            countryValidation: false
        })
    }

    Description_handelChang = (e) => {
        this.setState({
            Description: e.target.value
        })
    }

    DeleteTask = (e) => {
        deleteRowId = e;
        this.setState({
            ConfirmDelete: true
        })
    }

    ConfirmDeleteTask = () => {
        Api.post('DeleteSheet?id=' + deleteRowId + '').then(
            setTimeout(() => {
                Api.get('GetTimeSheetByDate?date=' + this.state.docDate + '').then(
                    res => {
                        this.setState({
                            tableView: true,
                            TimeSheetData: res,
                            dateValidation: false,
                            DeleteDone: true,
                            statusClass: "animationBlock"
                        })
                    }
                )
            }, 500))
        this.setState({ ConfirmDelete: false, DeleteDone: false, statusClass: "disNone" })
    }

    workHoursChangeHandler = (e) => {
        this.setState({
            workHours: e.target.value
        })
    }

    location_handelChange = (e) => {
        this.setState({
            locationId: e,
            locationValidation: false
        })
    }

    date_handleChange = (e) => { 
        if (e.value == 'NoDate') {
            this.setState({
                date: '',
                dateValidation: true
            })

        }

        if (e.value === 'felmeshmesh') {
            Api.get('GetTimeSheetByDate?date=' + moment(Today).format('YYYY-MM-DD') + '').then(
                res => {
                    this.setState({
                        tableView: true,
                        TimeSheetData: res,
                        dateValidation: false,
                        docDate: Today,
                    })

                }
            )

        }

        if (e.value === 'felmeshmesh2') {
            Api.get('GetTimeSheetByDate?date=' + yesterday + '').then(
                res => {
                    this.setState({
                        tableView: true,
                        TimeSheetData: res,
                        docDate: yesterday,
                        dateValidation: false
                    })

                }
            )
        }


    }

    collapseTaskInfo = () => {
        const collapse = this.state.collapse
        this.setState({
            collapse: !collapse
        })
    }

    componentDidMount = () => {
        this.GetData("GetAccountsProjectsByIdForList", 'projectName', 'projectId', 'Projects');
        this.GetData("GetAccountsDefaultList?listType=country&pageNumber=0&pageSize=10000", 'title', 'id', 'countryData');
        this.GetData("GetAccountsDefaultList?listType=timesheetlocation&pageNumber=0&pageSize=10000", 'title', 'id', "LocationData")
    }

    Task_handelChange = (e) => {
        Api.get("GetTaskDetail?taskId=" + e.value).then
            (
            result => {
                this.setState({
                    EstimatedHours: result.estimatedTime,
                    ActualTotal: result.actualTotal,
                    TotalApprovedHours: result.approved,
                    EarnedHours: result.earnedHours,
                    TotalRejectedHours: result.rejected,
                    taskId: e
                })
            }
            )
    }

    ProjectshandleChange = (e) => {
        let url = "GetTasksAsignUsers?projectId=" + e.value;
        this.GetData(url, "subject", "id", "TaskData");
        this.setState({ projectId: e, projectsValidation: false, taskId: '' })
    }

    render() {
        const items = this.state.TimeSheetData; 
        let count = [];
        const allItems = this.state.tableView === true ? items !== null ? (items.map(item => {
            count.push(item.workHours);
            return (
                <Fragment key={Math.random()}>

                    {item.workHours === 0 ?
                        <Fragment >
                            <tr>
                                <td className="fullColumn" colSpan="8">
                                    <div className="contentCell tableCell-2">
                                        <a className="pdfPopup various zero">{item.projectName} </a>
                                    </div>
                                </td>
                            </tr>
                            {item.tasks.map(i => {
                                count.push(i.workHours)
                                return (
                                    <tr key={i.id} >
                                        <td className="removeTr">
                                            <div className="contentCell tableCell-1">
                                                <span className="pdfImage" onClick={() => this.DeleteTask(i.id)}>
                                                    <img src={Recycle} alt="pdf" />
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="contentCell tableCell-2">
                                                <a className="pdfPopup various zero">{i.taskName} </a>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="contentCell tableCell-2">
                                                <a className="pdfPopup various zero">{i.taskProgress} </a>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="contentCell tableCell-2">
                                                <a className="pdfPopup various zero">{i.workHours} </a>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="contentCell tableCell-2">
                                                <a className="pdfPopup various zero">{i.workHours + "Hr(s)"}</a>
                                            </div>
                                        </td>

                                    </tr>
                                )
                            })}
                        </Fragment>
                        :
                        <tr>
                            <td>
                                <div className="contentCell tableCell-2">
                                    <a className="pdfPopup various zero">{item.projectName} </a>
                                </div>
                            </td>
                            <td>
                                <div className="contentCell tableCell-2">
                                    <a className="pdfPopup various zero">{item.workHours} </a>
                                </div>
                            </td>
                            <td>
                                <div className="contentCell tableCell-2">
                                    <a className="pdfPopup various zero">{item.workHours + "Hr(s)"}</a>
                                </div>
                            </td>
                        </tr>
                    }

                </Fragment>
            )
        })
        ) : null
            : null
        total = sum(count);

        return (
            <div className="timeSheetInput">
                {this.state.isNewMode ?
                    <div className="mainContainer main__fulldash white-bg">
                        {this.state.maxError ?
                            <NotifiMsg statusClass={this.state.statusClass} IsSuccess="false" Msg={Resources['smartAddMessageFailureContent'][currentLanguage] + (defaultHours * 2)} />
                            : <NotifiMsg statusClass={this.state.statusClass} IsSuccess="true" Msg={Resources['smartAddMessageSuccessTitle'][currentLanguage]} />
                        }
                        {this.state.DeleteDone ?
                            <NotifiMsg statusClass={this.state.statusClass} IsSuccess="true" Msg={Resources["smartDeleteMessageSuccessTitle"][currentLanguage]} />
                            : null
                        }
                        {this.state.VacationDayMSG ?
                            <NotifiMsg statusClass={this.state.statusClass} IsSuccess="false" Msg={Resources['smartVacationMessageContent'][currentLanguage]} />
                            : null
                        }
                        <div className="documents-stepper cutome__inputs noTabs__document">
                            <div className="submittalHead">
                                <h2 className="zero">TIME SHEET</h2>
                                <div className="SubmittalHeadClose">
                                    <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                                <g id="Group-2">
                                                    <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                                        <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                                                            <g id="Group">
                                                                <circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
                                                                <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z" id="Combined-Shape" fill="#858D9E" fillRule="nonzero"></path>
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
                                <div className="step-content noBtn__footer">
                                    <div className="subiTabsContent">
                                        <div className="document-fields">

                                            <Formik
                                                initialValues={{
                                                    dateValidation: '',
                                                    projectsValidation: '',
                                                    countryValidation: '',
                                                    locationValidation: '',
                                                    workHours: ' '
                                                }}
                                                validationSchema={workHoursValid}
                                                validate={values => {
                                                    let errors = {};
                                                    if (values.workHours.length == 0) {
                                                        errors.workHours = Resources['isRequiredField'][currentLanguage];
                                                    }
                                                    return errors;
                                                }}

                                                onSubmit={(values, actions) => {
                                                    if (!this.state.dateValidation && !this.state.projectsValidation && !this.state.countryValidation && !this.state.locationValidation) {

                                                        if (this.state.workHours > (defaultHours - total)) {
                                                            this.setState({
                                                                maxError: true,
                                                                statusClass: "animationBlock"
                                                            })
                                                            setTimeout(() => {
                                                                this.setState({
                                                                    statusClass: "disNone",
                                                                    maxError: false,
                                                                })
                                                            }, 1000);
                                                        }
                                                        else {
                                                            if (vacationDay === undefined) {
                                                                this.setState({
                                                                    isLoading: true
                                                                })
                                                                Api.post("AddSheet", {
                                                                    projectId: this.state.projectId.value, taskId: this.state.taskId.value, countryId: this.state.countryId.value, locationId: this.state.locationId.value,
                                                                    expenseValue: this.state.workHours, description: this.state.description, docDate: this.state.docDate,
                                                                    taskDropDownDisabled: timeSheetPolicy === 'projects' ? true : ''
                                                                }).then(
                                                                    result => {
                                                                        actions.setSubmitting(false);
                                                                        actions.resetForm({});
                                                                        withFormik({
                                                                            enableReinitialize: true,
                                                                            initialValues: {
                                                                                dateValidation: '',
                                                                                projectsValidation: '',
                                                                                countryValidation: '',
                                                                                locationValidation: '',
                                                                                workHours: ' '
                                                                            }
                                                                        })
                                                                        this.setState({
                                                                            taskId: '',
                                                                            countryId: '',
                                                                            locationId: '',
                                                                            projectId: '',
                                                                            description: '',
                                                                            workHours: '',
                                                                            statusClass: "animationBlock",
                                                                            isNewMode: false
                                                                        })
                                                                        setTimeout(() => {
                                                                            this.setState({
                                                                                statusClass: "disNone",
                                                                                isLoading: false,
                                                                                isNewMode: true
                                                                            })
                                                                        }, 3000);

                                                                        Api.get('GetTimeSheetByDate?date=' + this.state.docDate + '').then(
                                                                            res => {
                                                                                this.setState({
                                                                                    TimeSheetData: res,
                                                                                })
                                                                            })
                                                                    })
                                                            }
                                                            else {
                                                                setTimeout(() => {
                                                                    this.setState({

                                                                        VacationDayMSG: true,
                                                                        statusClass: "animationBlock"
                                                                    })
                                                                }, 500);
                                                                this.setState({
                                                                    statusClass: "disNone",
                                                                    VacationDayMSG: false,
                                                                })
                                                            }
                                                        }
                                                    }
                                                }}
                                                onReset={(values) => { }}
                                            >
                                                {({ errors, touched, handleBlur, handleChange, handleReset, handleSubmit, isSubmitting }) => (
                                                    <Form id="signupForm1" className="proForm customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                                        <div className="proForm datepickerContainer">

                                                            <div className="linebylineInput">
                                                                <div className={this.state.dateValidation && touched.dateValidation ? ("has-error") :
                                                                    !this.state.dateValidation && touched.dateValidation ? "" : ""} >
                                                                    <DropdownMelcous title="date" data={options}
                                                                        handleChange={this.date_handleChange}
                                                                        index='dateValidation' name="dateValidation" />
                                                                    {this.state.dateValidation && touched.dateValidation ? (
                                                                        <em className="pError">{Resources['isRequiredField'][currentLanguage]}</em>) : null}
                                                                </div>
                                                            </div>

                                                            <div className="linebylineInput">
                                                                <div className={this.state.projectsValidation && touched.projectsValidation ? ("has-error") :
                                                                    !this.state.projectsValidation && touched.projectsValidation ? "" : ""} >
                                                                    <DropdownMelcous title="Projects" data={this.state.Projects} selectedValue={this.state.projectId}
                                                                        handleChange={this.ProjectshandleChange} name="projectsValidation" />
                                                                    {this.state.projectsValidation && touched.projectsValidation ? (
                                                                        <em className="pError">{Resources['isRequiredField'][currentLanguage]}</em>) : null}
                                                                </div>
                                                            </div>

                                                            <div className="linebylineInput">
                                                                <DropdownMelcous title='Task' data={this.state.TaskData} handleChange={this.Task_handelChange}
                                                                    placeholder='Task' selectedValue={this.state.taskId} />
                                                            </div>

                                                            <div className="linebylineInput linebylineInput__collapse">
                                                                <span className="collapseIcon" onClick={this.collapseTaskInfo}>
                                                                    {this.state.collapse ?
                                                                        <span className="plusSpan redSpan ">-</span> : <span className="plusSpan greenSpan">+</span>
                                                                    }
                                                                    <span>{Resources['taskInformation'][currentLanguage]}</span>
                                                                </span>
                                                                <div className={this.state.collapse ? "taskInfo" : "taskInfo taskMaxHeight"}   >
                                                                    <div className="incomingInfo">
                                                                        <a>{Resources['estimatedHours'][currentLanguage]} </a>
                                                                        <span>{this.state.EstimatedHours}</span>
                                                                    </div>
                                                                    <div className="incomingInfo">
                                                                        <a>{Resources['actualHours'][currentLanguage]}</a>
                                                                        <span>{this.state.ActualTotal}</span>
                                                                    </div>
                                                                    <div className="incomingInfo">
                                                                        <a>{Resources['approvedHours'][currentLanguage]} </a>
                                                                        <span>{this.state.TotalApprovedHours}</span>
                                                                    </div>
                                                                    <div className="incomingInfo">
                                                                        <a>{Resources['earnedHours'][currentLanguage]}</a>
                                                                        <span>{this.state.EarnedHours}</span>
                                                                    </div>
                                                                    <div className="incomingInfo">
                                                                        <a>{Resources['rejectedHours'][currentLanguage]} </a>
                                                                        <span>{this.state.TotalRejectedHours}</span>
                                                                    </div>

                                                                </div>
                                                            </div>

                                                            <div className="linebylineInput">
                                                                <label className="control-label">{Resources['workHours'][currentLanguage]} </label>
                                                                <div className={errors.workHours && touched.workHours ?
                                                                    ("ui input inputDev has-error") : "ui input inputDev"} >
                                                                    <input name='workHours'
                                                                        className="form-control" id="workHours" placeholder={Resources['workHours'][currentLanguage]} autoComplete='off'
                                                                        onBlur={(e) => {
                                                                            this.workHoursChangeHandler(e)
                                                                            handleBlur(e)
                                                                        }} onChange={handleChange} />
                                                                    {errors.workHours && touched.workHours ? (
                                                                        <em className="pError">{errors.workHours}</em>
                                                                    ) : null}
                                                                </div>
                                                            </div>

                                                            <div className="linebylineInput">
                                                                <div className={this.state.countryValidation && touched.countryValidation ? ("has-error") :
                                                                    !this.state.countryValidation && touched.countryValidation ? "" : ""} >
                                                                    <DropdownMelcous title='country' data={this.state.countryData} selectedValue={this.state.countryId}
                                                                        handleChange={this.country_handelChange} placeholder='country' name="countryValidation" />
                                                                    {this.state.countryValidation && touched.countryValidation ? (
                                                                        <em className="pError">{Resources['isRequiredField'][currentLanguage]}</em>) : null}
                                                                </div>
                                                            </div>

                                                            <div className="linebylineInput">
                                                                <div className={this.state.locationValidation && touched.locationValidation ? ("has-error")
                                                                    : !this.state.locationValidation && touched.locationValidation ? "" : ""} >
                                                                    <DropdownMelcous title='location' data={this.state.LocationData}
                                                                        handleChange={this.location_handelChange} placeholder='location'
                                                                        name="locationValidation" selectedValue={this.state.locationId} />
                                                                    {this.state.locationValidation && touched.locationValidation ? (
                                                                        <em className="pError">{Resources['isRequiredField'][currentLanguage]}</em>) : null}
                                                                </div>
                                                            </div>

                                                            <div className="letterFullWidth">
                                                                <div className="textarea-group noPadding">
                                                                    <label>Description</label>
                                                                    <textarea onChange={this.Description_handelChang}></textarea>
                                                                </div>
                                                            </div>

                                                            <div className="slider-Btns">
                                                                {this.state.isLoading === false ? (
                                                                    <button
                                                                        className="primaryBtn-1 btn largeBtn"
                                                                        type="submit"
                                                                    >  {Resources["save"][currentLanguage]}
                                                                    </button>
                                                                ) :
                                                                    (
                                                                        <button className="primaryBtn-1 btn largeBtn disabled">
                                                                            <div className="spinner">
                                                                                <div className="bounce1" />
                                                                                <div className="bounce2" />
                                                                                <div className="bounce3" />
                                                                            </div>
                                                                        </button>
                                                                    )}

                                                            </div>
                                                        </div>
                                                    </Form>
                                                )}
                                            </Formik>
                                        </div>
                                        <div className="doc-pre-btn">
                                            <table className="attachmentTable"  >
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            <div className="headCell tableCell-1">
                                                                <span> </span>
                                                            </div>
                                                        </th>
                                                        <th>
                                                            <div className="headCell tableCell-2">
                                                                <span>{Resources['taskName'][currentLanguage]}</span>
                                                            </div>
                                                        </th>
                                                        <th>
                                                            <div className="headCell tableCell-3">
                                                                <span> {Resources['taskStatus'][currentLanguage]}</span>
                                                            </div>
                                                        </th>
                                                        <th>
                                                            <div className="headCell tableCell-3">
                                                                <span>{Resources['workHours'][currentLanguage]}</span>
                                                            </div>
                                                        </th>

                                                        <th>
                                                            <div className="headCell tableCell-4">
                                                                <span>{Resources['totalHours'][currentLanguage]}</span>
                                                            </div>
                                                        </th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {allItems}

                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td colSpan="4"><p>{Resources['totalHours'][currentLanguage]}</p></td>
                                                        <td colSpan="4"><p>{total + "Hr(s)"}</p></td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {this.state.ConfirmDelete ? (
                            <ConfirmationModal
                                closed={this.onCloseModal}
                                showDeleteModal={this.state.ConfirmDelete}
                                clickHandlerCancel={this.onCloseModal}
                                clickHandlerContinue={() => this.ConfirmDeleteTask()}
                                title={Resources["smartDeleteMessageContent"][currentLanguage]}
                                buttonName="delete"
                            />
                        ) : null}
                    </div>
                    : null}   </div>
        )
    }

    GetData = (url, label, value, currState) => {
        let Data = []
        Api.get(url).then(result => {
            (result).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];
                Data.push(obj);
            });
            this.setState({
                [currState]: [...Data]
            });
        }).catch(ex => {
        });
    }
}





export default AddTimeSheet;