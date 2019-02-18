import React, { Component, Fragment } from 'react';
import DropdownMelcous from '../OptionsPanels/DropdownMelcous';
import moment from 'moment';
import Api from '../../api';
import NotifiMsg from '../publicComponants/NotifiMsg'
import Recycle from '../../Styles/images/attacheRecycle.png'
import Resources from '../../resources.json';
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import _ from "lodash";
import { Formik, Form , withFormik } from 'formik';
import * as Yup from 'yup';
import today from 'material-ui/svg-icons/action/today';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let timeSheetSettings = JSON.parse(localStorage.getItem('timeSheetSettings'))
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
            isNewMode:true
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
        console.log(day)
        console.log(vacationDay)
        if (e.value == 'NoDate') {
            this.setState({
                date: '',
                dateValidation: true
            })
        }

        if (e.value === 'felmeshmesh') {
            Api.get('GetTimeSheetByDate?date=' + Today + '').then(
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
        const allItems = this.state.tableView == true ? items.length ? (items.map(item => {
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
        total = _.sum(count);

        return (
            <div className="timeSheetInput">
                {this.state.isNewMode ?
                <div className="mainContainer">
                    {this.state.maxError ?
                        <NotifiMsg statusClass={this.state.statusClass} IsSuccess="false" Msg={Resources['smartAddMessage'][currentLanguage].failureContent + (defaultHours * 2)} />
                        : <NotifiMsg statusClass={this.state.statusClass} IsSuccess="true" Msg={Resources['smartAddMessage'][currentLanguage].successTitle} />}

                    {this.state.DeleteDone ?
                        <NotifiMsg statusClass={this.state.statusClass} IsSuccess="true" Msg={Resources['smartDeleteMessage'][currentLanguage].successTitle} />
                        : null}
                    {this.state.VacationDayMSG ?
                        <NotifiMsg statusClass={this.state.statusClass} IsSuccess="false" Msg={Resources['smartVacationMessage'][currentLanguage].content} />
                        : null}

                    <div className="table__inputs">
                        <div className="halfWindow">
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

                                onSubmit={(values ,actions) => {
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
                                                        initialValues:{
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
                                                            isNewMode:false
                                                        })
                                                        setTimeout(() => {
                                                            this.setState({
                                                                statusClass: "disNone",
                                                                isLoading: false,
                                                                isNewMode:true
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
                                 {({ errors, touched, handleBlur, handleChange  , handleReset,handleSubmit , isSubmitting}) => (
                                     <Form id="signupForm1" className="proForm" noValidate="novalidate" onSubmit={handleSubmit}>
                                        <div className={this.state.dateValidation && touched.dateValidation ? ("has-error") :
                                            !this.state.dateValidation && touched.dateValidation ? "" : ""} >
                                            <DropdownMelcous title="date" data={options}
                                                handleChange={this.date_handleChange}
                                                index='dateValidation' name="dateValidation" />
                                            {this.state.dateValidation && touched.dateValidation ? (
                                                <em className="pError">{Resources['isRequiredField'][currentLanguage]}</em>) : null}
                                        </div>


                                        <div className={this.state.projectsValidation && touched.projectsValidation ? ("has-error") :
                                            !this.state.projectsValidation && touched.projectsValidation ? "" : ""} >
                                            <DropdownMelcous title="Projects" data={this.state.Projects} selectedValue={this.state.projectId}
                                                handleChange={this.ProjectshandleChange} name="projectsValidation" />
                                            {this.state.projectsValidation && touched.projectsValidation ? (
                                                <em className="pError">{Resources['isRequiredField'][currentLanguage]}</em>) : null}
                                        </div>



                                        <DropdownMelcous title='Task' data={this.state.TaskData} handleChange={this.Task_handelChange}
                                            placeholder='Task' selectedValue={this.state.taskId} />


                                        <span className="collapseIcon" onClick={this.collapseTaskInfo}>{this.state.collapse ? <span className="plusSpan redSpan ">-</span> : <span className="plusSpan greenSpan">+</span>}
                                            <span>{Resources['taskInformation'][currentLanguage]}</span>  </span>

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


                                        <div className={this.state.countryValidation && touched.countryValidation ? ("has-error") :
                                            !this.state.countryValidation && touched.countryValidation ? "" : ""} >
                                            <DropdownMelcous title='country' data={this.state.countryData} selectedValue={this.state.countryId}
                                                handleChange={this.country_handelChange} placeholder='country' name="countryValidation" />
                                            {this.state.countryValidation && touched.countryValidation ? (
                                                <em className="pError">adadadad</em>) : null}
                                        </div>


                                        <div className={this.state.locationValidation && touched.locationValidation ? ("has-error")
                                            : !this.state.locationValidation && touched.locationValidation ? "" : ""} >
                                            <DropdownMelcous title='location' data={this.state.LocationData}
                                                handleChange={this.location_handelChange} placeholder='location'
                                                name="locationValidation" selectedValue={this.state.locationId} />
                                            {this.state.locationValidation && touched.locationValidation ? (
                                                <em className="pError">{Resources['isRequiredField'][currentLanguage]}</em>) : null}
                                        </div>



                                        <div className="textarea-group noPadding">
                                            <label>Description</label>
                                            <textarea onChange={this.Description_handelChang}></textarea>
                                        </div>

                                        <div className="fullWidthWrapper">
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

                                    </Form>
                                )}
                            </Formik>

                        </div>
                        <div className="tableWindow">
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
                                <tbody  >

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
                    {this.state.ConfirmDelete ? (
                        <ConfirmationModal
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.ConfirmDelete}
                            clickHandlerCancel={this.onCloseModal}
                            clickHandlerContinue={() => this.ConfirmDeleteTask()}
                            title={Resources["smartDeleteMessage"][currentLanguage].content}
                            buttonName="delete"
                        />
                    ) : null}
                </div>
             :null}   </div>
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