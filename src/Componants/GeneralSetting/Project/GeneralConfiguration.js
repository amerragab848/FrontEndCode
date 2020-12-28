import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../publicComponants/ConfirmationModal";
import { Formik } from 'formik';
import * as Yup from 'yup';
import Api from '../../../api';
import config from "../../../Services/Config";
import Resources from "../../../resources.json";
import dataservice from "../../../Dataservice";
import DropDown from '../../OptionsPanels/DropdownMelcous'
import moment from 'moment';
import find from "lodash/find";
import Recycle from '../../../Styles/images/attacheRecycle.png'
import { toast } from "react-toastify";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");


const ValidtionSchema = Yup.object().shape({
    hours: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]),
    timesheetApprovalDays: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).integer('Please provide integer'),
    expensesApprovalDays: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).integer('Please provide integer'),
    timesheetRequestDays: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).integer('Please provide integer'),
    expensesRequestDays: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).integer('Please provide integer'),
    hodeputyPmIncentiveFractionurs: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).integer('Please provide integer'),
    quantityRedAlertPercent: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).integer('Please provide integer'),
    quantityYellowAlertPercent: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).integer('Please provide integer'),
    quantityGreenAlertPercent: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).integer('Please provide integer'),
    expensesRedAlerts: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).integer('Please provide integer'),
    expensesRedAlerts: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).integer('Please provide integer'),
    expensesGreenAlerts: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).integer('Please provide integer'),
    paymentGreenAlerts: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).integer('Please provide integer'),
    paymentRedAlerts: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).integer('Please provide integer'),
    paymentYellowAlerts: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).integer('Please provide integer'),
    invoicesGreenAlerts: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).integer('Please provide integer'),
    invoicesRedAlerts: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).integer('Please provide integer'),
    invoicesYellowAlerts: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]).integer('Please provide integer'),
})

const TimesheetPolicyDropData = [
    { label: Resources['projectsOnly'][currentLanguage], value: 'projects' },
    { label: Resources['tasksOnly'][currentLanguage], value: 'tasks' },
    { label: Resources['projectsTasks'][currentLanguage], value: 'projecttask' },
    { label: Resources['tasksExist'][currentLanguage], value: 'tasksif' },
]

const TimesheetInputs = [
    { Name: 'hours', Title: 'hours' },
    { Name: 'timesheetApprovalDays', Title: 'timesheetApprovalDays' },
    { Name: 'expensesApprovalDays', Title: 'expensesApprovalDays' },
    { Name: 'timesheetRequestDays', Title: 'timesheetRequestDays' },
    { Name: 'expensesRequestDays', Title: 'expensesRequestDays' },
    { Name: 'deputyPmIncentiveFraction', Title: 'deputyPmIncentiveFraction' },
]

const QuantityInputs = [
    { Name: 'quantityRedAlertPercent', Title: 'quantityRedAlertPercent' },
    { Name: 'quantityYellowAlertPercent', Title: 'quantityYellowAlertPercent' },
    { Name: 'quantityGreenAlertPercent', Title: 'quantityGreenAlertPercent' },
]

const ExpensesInputs = [
    { Name: 'expensesRedAlerts', Title: 'expensesRedAlerts' },
    { Name: 'expensesYellowAlerts', Title: 'expensesYellowAlerts' },
    { Name: 'expensesGreenAlerts', Title: 'expensesGreenAlerts' },
]

const PaymentInputs = [
    { Name: 'paymentGreenAlerts', Title: 'paymentRedAlerts' },
    { Name: 'paymentRedAlerts', Title: 'paymentYellowAlerts' },
    { Name: 'paymentYellowAlerts', Title: 'paymentGreenAlerts' },
]

const InvoicesInputs = [
    { Name: 'invoicesRedAlerts', Title: 'invoicesRedAlerts' },
    { Name: 'invoicesYellowAlerts', Title: 'invoicesYellowAlerts' },
    { Name: 'invoicesGreenAlerts', Title: 'invoicesGreenAlerts' },
]

const ListOfDays = [
    { label: 'Saturday', value: 7 },
    { label: 'Sunday', value: 1 },
    { label: 'Monday', value: 2 },
    { label: 'Tuesday', value: 3 },
    { label: 'Wednesday', value: 4 },
    { label: 'Thursday', value: 5 },
    { label: 'Friday', value: 6 },
]

class GeneralConfiguration extends Component {

    constructor(props) {
        if (!config.IsAllow(388)) {
            toast.warn(Resources['missingPermissions'][currentLanguage])
            this.props.history.goBack()
        }
        super(props)
        this.state = {
            DefaultConfigurations: [],
            SelectedTimesheet: {},
            TimesheetPolicyDropData: TimesheetPolicyDropData,
            WFSettingsData: [],
            ListOfDays: ListOfDays,
            SelectedDay: {},
            CheckInMin: '',
            CheckOutMin: '',
            showDeleteModal: false,
            IsVacation: false,
            isLoading: false,
            showDefaultInterim: true,
            useNormalMR:true
        }
    }

    componentWillMount = () => {
        dataservice.GetDataGrid('GetConfigurations').then(
            res => {
                let SelectedTimesheet = find(TimesheetPolicyDropData, function (i) { return i.value === res.timesheetPolicy });
                this.setState({
                    DefaultConfigurations: res,
                    showDefaultInterim: res["showDefaultInterim"],
                    useNormalMR: res["useNormalMR"],
                    SelectedTimesheet: SelectedTimesheet
                })
            }
        )

        dataservice.GetDataGrid('GetworkFlowSettings').then(
            res => {
                let SelectedDay = find(ListOfDays, function (i) { return i.value === 7 });
                this.setState({
                    WFSettingsData: res,
                    SelectedDay: SelectedDay
                })
            }
        )
    }

    handleChangeTimesheetPolicy = (val, name) => {
        if (name === 'days') {
            this.setState({ SelectedDay: val })
        }
        else {
            this.setState({ SelectedTimesheet: val })
            let updated_document = this.state.DefaultConfigurations
            updated_document[name] = val.value;
            this.setState({
                DefaultConfigurations: updated_document
            })
        }
    }

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    DeleteWF = (rowId, index) => {
        this.setState({
            showDeleteModal: true,
            rowId: rowId,
            indexId: index,
        })
    }

    ConfirmationDelete = () => {
        this.setState({ isLoading: true })
        let Data = this.state.WFSettingsData;
        Data.splice(this.state.indexId, 1);
        this.setState({ WFSettingsData: Data });
        Api.post('DeleteWFSettings?id=' + this.state.rowId + '').then(res => {
            this.setState({
                showDeleteModal: false,
                isLoading: false,

            })
            toast.success(Resources['smartSentAccountingMessageSuccessTitle'][currentLanguage])
        }).catch(ex => {
            this.setState({
                showDeleteModal: false,
                isLoading: false,
            });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        });
    }

    handleChange(e, field) {
        if (e !== 'Days' && e !== 'BOQPermissions') {
            let updated_document = this.state.DefaultConfigurations
            updated_document[field] = e.target.value;
            this.setState({
                DefaultConfigurations: updated_document
            })
        }
        else {
            let updated_document = this.state.DefaultConfigurations
            let value = updated_document[field] === true ? false : true
            updated_document[field] = value;
            this.setState({
                DefaultConfigurations: updated_document
            })
        }
    }

    AddWorkFlowSettings = () => {
        this.setState({
            isLoading: true
        })
        let dayId = this.state.SelectedDay.value
        let ConDay = this.state.WFSettingsData.filter(s => s.dayId === dayId)
        if (ConDay.length === 0) {
            let objWF = {
                check_in: moment(), check_out: moment(),
                dayId: this.state.SelectedDay.value,
                checkInMinutes: this.state.checkInMinutes || 0,
                isVacation: this.state.IsVacation,
                checkOutMinutes: this.state.checkOutMinutes || 0
            }
            dataservice.addObject('AddWFSettings', objWF).then(
                res => {
                    let NewData = res
                    let OldData = this.state.WFSettingsData
                    OldData.unshift(NewData)
                    this.setState({
                        WFSettingsData: OldData,
                        isLoading: false,
                        CheckInMin: '',
                        CheckOutMin: ''
                    })
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                })
        }
        else {
            toast.error(Resources["ValidtionDay"][currentLanguage]);
            this.setState({
                isLoading: false
            })
        }
    }

    AddConfigurations = (values) => {
        let objAdd = this.state.DefaultConfigurations

        objAdd.showDefaultInterim = this.state.showDefaultInterim;
        objAdd.useNormalMR = this.state.useNormalMR;
        dataservice.addObject('EditConfigurationById', objAdd).then(
            res => {
                this.props.history.push({
                    pathname: '/DashboardProject/',
                })
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }).catch(ex => {
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            })
    }

    handleChangeVacation = () => {
        let val = !this.state.IsVacation
        this.setState({
            IsVacation: val
        })
    }

    //convert format time to minutes of number
    convertTimeToMinutes = time => {
        var a = time.split(':');
        return (+a[0]) * 60 + (+a[1]);
    }

    handleChangeCheck = (e, name) => {
        this.setState({
            [name]: this.convertTimeToMinutes(e.target.value)
        })
    }

    handleChecked(e,stateName) {
        this.setState({
            [stateName]: e
        })
    }

    render() {

        let WFSettingsData = this.state.WFSettingsData
        let RenderWorkFlowSettingsTable =
            WFSettingsData.map((item, index) => {
                return (
                    <tr key={item.id}>
                        <td className="removeTr">
                            <div className="contentCell tableCell-1">
                                <span className="pdfImage" onClick={() => this.DeleteWF(item.id, index)} >
                                    <img src={Recycle} alt="pdf" />
                                </span>
                            </div>
                        </td>
                        <td>{item.dayName}</td>
                        <td>{item.check_in}</td>
                        <td>{item.check_out}</td>
                        <td>{item.isVacation == true ? "Yes" : "No"}</td>
                    </tr>
                )
            })

        let RenderWorkFlowSettings = () => {
            return (
                <Fragment>
                    <header className="main__header">
                        <div className="main__header--div">
                            <h2 className="zero">{Resources['workFlowSettings'][currentLanguage]}</h2>
                        </div>
                    </header>
                    <div className="fullWidthWrapper textLeft proForm datepickerContainer">
                        <div className="linebylineInput valid-input">
                            <DropDown title='days'
                                data={this.state.ListOfDays}
                                selectedValue={this.state.SelectedDay}
                                handleChange={e => this.handleChangeTimesheetPolicy(e, 'days')}
                                placeholder='days' />
                        </div>
                        <div className="linebylineInput valid-input alternativeDate alternativeDate_replacement">
                            <div className="ui checkbox checkBoxGray300 checked">
                                <input type="checkbox" value='IsVacation' onChange={() => this.handleChangeVacation()} />
                                <label>Is Vacation</label>
                            </div>
                        </div>
                        {this.state.IsVacation ? null :
                            <Fragment>
                                <div className="linebylineInput valid-input fullInputWidth">
                                    <label className="control-label">{Resources.checkIn[currentLanguage]}</label>
                                    <div className="inputDev ui input" >
                                        <input className="form-control fsadfsadsa" id="checkIn" name="checkIn"
                                            pattern="([1]?[0-9]|2[0-3]):[0-5][0-9]" type="time"
                                            defaultValue={this.state.CheckInMin}
                                            onBlur={(e) => this.handleChangeCheck(e, 'checkInMinutes')} />
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input fullInputWidth">
                                    <label className="control-label">{Resources.checkOut[currentLanguage]}</label>
                                    <div className="inputDev ui input" >
                                        <input className="form-control fsadfsadsa" id="checkOut" name="checkOut" pattern="([1]?[0-9]|2[0-3]):[0-5][0-9]" type="time" defaultValue={this.state.CheckOutMin}
                                            onBlur={(e) => this.handleChangeCheck(e, 'checkOutMinutes')} />
                                    </div>
                                </div>
                            </Fragment>}
                        <div className="slider-Btns letterFullWidth">
                            <button className="primaryBtn-1 btn meduimBtn" type='button' onClick={this.AddWorkFlowSettings}>ADD</button>
                        </div>
                    </div>
                    <table className="ui table">
                        <thead>
                            <tr>
                                <th>{Resources['actions'][currentLanguage]}</th>
                                <th>{Resources['dayName'][currentLanguage]}</th>
                                <th>{Resources['checkIn'][currentLanguage]}</th>
                                <th>{Resources['checkOut'][currentLanguage]}</th>
                                <th>{Resources['isVacation'][currentLanguage]}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RenderWorkFlowSettingsTable}
                        </tbody>
                    </table>
                </Fragment>
            )
        }

        return (
            <div className="documents-stepper cutome__inputs noTabs__document">
                <div className="submittalHead">
                    <h2 className="zero">{Resources.GeneralConfig[currentLanguage]}</h2>
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
                {this.state.isLoading ?
                    <LoadingSection /> : null
                }
                <div className="doc-container">
                    <div className="step-content noBtn__footer">
                        <div className="subiTabsContent">
                            <div className="document-fields">
                                <Formik
                                    initialValues={{ ...this.state.DefaultConfigurations }}
                                    validationSchema={ValidtionSchema}
                                    onSubmit={(values) => {
                                        this.AddConfigurations(values)
                                    }} >

                                    {({ errors, touched, handleBlur, values, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                        <form id="signupForm1" className="proForm datepickerContainer" noValidate="novalidate" onSubmit={handleSubmit}>

                                            <div className="fullWidthWrapper textLeft proForm datepickerContainer">
                                                {TimesheetInputs.map(s => {
                                                    return (
                                                        <div className="linebylineInput valid-input fullInputWidth" key={s.Name}>
                                                            <label className="control-label">{Resources[s.Title][currentLanguage]}</label>
                                                            <div className={"inputDev ui input" + (errors[s.Name] && touched[s.Name] ? (" has-error") : !errors[s.Name] && touched[s.Name] ? (" has-success") : " ")} >
                                                                <input name={s.Name} className="form-control fsadfsadsa"
                                                                    placeholder={Resources[s.Title][currentLanguage]} autoComplete='off'
                                                                    defaultValue={this.state.DefaultConfigurations[s.Name]}
                                                                    onChange={(e) => {
                                                                        this.handleChange(e, s.Name)
                                                                        handleChange(e)
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        handleBlur(e)
                                                                    }} />
                                                                {touched[s.Name] ? (<em className="pError">{errors[s.Name]}</em>) : null}
                                                            </div>
                                                        </div>)
                                                })}
                                                <div className="linebylineInput valid-input">
                                                    <DropDown title='timesheetPolicy'
                                                        data={this.state.TimesheetPolicyDropData}
                                                        selectedValue={this.state.SelectedTimesheet}
                                                        handleChange={e => this.handleChangeTimesheetPolicy(e, 'timesheetPolicy')}
                                                        placeholder='timesheetPolicy' />
                                                </div>
                                            </div>

                                            <div className="fullWidthWrapper textLeft proForm datepickerContainer">
                                                {QuantityInputs.map(s => {
                                                    return (
                                                        <div className="linebylineInput valid-input fullInputWidth" key={s.Name}>
                                                            <label className="control-label">{Resources[s.Title][currentLanguage]}</label>
                                                            <div className={"inputDev ui input" + (errors[s.Name] && touched[s.Name] ? (" has-error") : !errors[s.Name] && touched[s.Name] ? (" has-success") : " ")} >
                                                                <input name={s.Name} className="form-control fsadfsadsa"
                                                                    placeholder={Resources[s.Title][currentLanguage]} autoComplete='off'
                                                                    defaultValue={this.state.DefaultConfigurations[s.Name]}
                                                                    onChange={(e) => {
                                                                        this.handleChange(e, s.Name)
                                                                        handleChange(e)
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        handleBlur(e)
                                                                    }}
                                                                />
                                                                {touched[s.Name] ? (<em className="pError">{errors[s.Name]}</em>) : null}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <div className="fullWidthWrapper textLeft proForm datepickerContainer">
                                                {ExpensesInputs.map(s => {
                                                    return (
                                                        <div className="linebylineInput valid-input fullInputWidth" key={s.Name}>
                                                            <label className="control-label">{Resources[s.Title][currentLanguage]}</label>
                                                            <div className={"inputDev ui input" + (errors[s.Name] && touched[s.Name] ? (" has-error") : !errors[s.Name] && touched[s.Name] ? (" has-success") : " ")} >
                                                                <input name={s.Name} className="form-control fsadfsadsa"
                                                                    placeholder={Resources[s.Title][currentLanguage]} autoComplete='off'
                                                                    defaultValue={this.state.DefaultConfigurations[s.Name]}
                                                                    onChange={(e) => {
                                                                        this.handleChange(e, s.Name)
                                                                        handleChange(e)
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        handleBlur(e)
                                                                    }}
                                                                />
                                                                {touched[s.Name] ? (<em className="pError">{errors[s.Name]}</em>) : null}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <div className="fullWidthWrapper textLeft proForm datepickerContainer">
                                                {PaymentInputs.map(s => {
                                                    return (
                                                        <div className="linebylineInput valid-input fullInputWidth" key={s.Name}>
                                                            <label className="control-label">{Resources[s.Title][currentLanguage]}</label>
                                                            <div className={"inputDev ui input" + (errors[s.Name] && touched[s.Name] ? (" has-error") : !errors[s.Name] && touched[s.Name] ? (" has-success") : " ")} >
                                                                <input name={s.Name} className="form-control fsadfsadsa"
                                                                    placeholder={Resources[s.Title][currentLanguage]} autoComplete='off'
                                                                    defaultValue={this.state.DefaultConfigurations[s.Name]}
                                                                    onChange={(e) => {
                                                                        this.handleChange(e, s.Name)
                                                                        handleChange(e)
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        handleBlur(e)
                                                                    }}
                                                                />
                                                                {touched[s.Name] ? (<em className="pError">{errors[s.Name]}</em>) : null}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <div className="fullWidthWrapper textLeft proForm datepickerContainer">
                                                {InvoicesInputs.map(s => {
                                                    return (
                                                        <div className="linebylineInput valid-input fullInputWidth" key={s.Name}>
                                                            <label className="control-label">{Resources[s.Title][currentLanguage]}</label>
                                                            <div className={"inputDev ui input" + (errors[s.Name] && touched[s.Name] ? (" has-error") : !errors[s.Name] && touched[s.Name] ? (" has-success") : " ")} >
                                                                <input name={s.Name} className="form-control fsadfsadsa"
                                                                    placeholder={Resources[s.Title][currentLanguage]} autoComplete='off'
                                                                    defaultValue={this.state.DefaultConfigurations[s.Name]}
                                                                    onChange={(e) => {
                                                                        this.handleChange(e, s.Name)
                                                                        handleChange(e)
                                                                    }}
                                                                    onBlur={(e) => {
                                                                        handleBlur(e)
                                                                    }}
                                                                />
                                                                {touched[s.Name] ? (<em className="pError">{errors[s.Name]}</em>) : null}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                                <div className="linebylineInput linebylineInput__checkbox">
                                                    <label data-toggle="tooltip" title={Resources['refrenceDocument'][currentLanguage]} className="control-label"> {Resources['refrenceDocument'][currentLanguage]} </label>
                                                    <div className="ui checkbox radio radioBoxBlue">
                                                        <input type="radio" name="showDefaultInterim" checked={this.state.showDefaultInterim === true} value={true} onChange={(e) => { this.handleChecked(true,"showDefaultInterim") }} />
                                                        <label>{Resources['automatic'][currentLanguage]}</label>
                                                    </div>
                                                    <div className="ui checkbox radio radioBoxBlue checked">
                                                        <input type="radio" name="showDefaultInterim" checked={this.state.showDefaultInterim === false} value={false} onChange={(e) => { this.handleChecked(false,"showDefaultInterim") }} />
                                                        <label> {Resources['normal'][currentLanguage]}</label>
                                                    </div>
                                                </div>
                                                <div className="linebylineInput linebylineInput__checkbox">
                                                    <label data-toggle="tooltip" title={Resources['showInventoryRadioButtonInItemsTab'][currentLanguage]} className="control-label"> {Resources['showInventoryRadioButtonInItemsTab'][currentLanguage]} </label>
                                                    <div className="ui checkbox radio radioBoxBlue">
                                                        <input type="radio" name="useNormalMR" checked={this.state.useNormalMR === true} value={true} onChange={(e) => { this.handleChecked(true,"useNormalMR") }} />
                                                        <label>{Resources['yes'][currentLanguage]}</label>
                                                    </div>
                                                    <div className="ui checkbox radio radioBoxBlue checked">
                                                        <input type="radio" name="useNormalMR" checked={this.state.useNormalMR === false} value={false} onChange={(e) => { this.handleChecked(false,"useNormalMR") }} />
                                                        <label> {Resources['no'][currentLanguage]}</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="linebylineInput fullWidthWrapper daysCheckbox">
                                                <label> HR Vacation Days</label>
                                                <div className="three__daysCheck--flex">
                                                    <div className="three__daysCheck">
                                                        <div className="ui checkbox checkBoxGray300 checked">
                                                            <input type="checkbox" value='Days' onChange={() => this.handleChange('Days', 'day1')} checked={this.state.DefaultConfigurations.day1 ? 'checked' : null} />
                                                            <label>Saturday</label>
                                                        </div>
                                                        <div className="ui checkbox checkBoxGray300 checked">
                                                            <input type="checkbox" value='Days' onChange={() => this.handleChange('Days', 'day2')} checked={this.state.DefaultConfigurations.day2 ? 'checked' : null} />
                                                            <label>Sunday</label>
                                                        </div>
                                                        <div className="ui checkbox checkBoxGray300 checked">
                                                            <input type="checkbox" value='Days' onChange={() => this.handleChange('Days', 'day3')} checked={this.state.DefaultConfigurations.day3 ? 'checked' : null} />
                                                            <label>Monday</label>
                                                        </div>
                                                    </div>
                                                    <div className="three__daysCheck">
                                                        <div className="ui checkbox checkBoxGray300 checked">
                                                            <input type="checkbox" value='Days' onChange={() => this.handleChange('Days', 'day4')} checked={this.state.DefaultConfigurations.day4 ? 'checked' : null} />
                                                            <label>Tuesday</label>
                                                        </div>
                                                        <div className="ui checkbox checkBoxGray300 checked">
                                                            <input type="checkbox" value='Days' onChange={() => this.handleChange('Days', 'day5')} checked={this.state.DefaultConfigurations.day5 ? 'checked' : null} />
                                                            <label>Wednesday</label>
                                                        </div>
                                                        <div className="ui checkbox checkBoxGray300 checked">
                                                            <input type="checkbox" value='Days' onChange={() => this.handleChange('Days', 'day6')} checked={this.state.DefaultConfigurations.day6 ? 'checked' : null} />
                                                            <label>Thursday</label>
                                                        </div>
                                                    </div>
                                                    <div className="three__daysCheck">
                                                        <div className="ui checkbox checkBoxGray300 checked">
                                                            <input type="checkbox" value='Days' onChange={() => this.handleChange('Days', 'day7')} checked={this.state.DefaultConfigurations.day7 ? 'checked' : null} />
                                                            <label>Friday</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="linebylineInput fullWidthWrapper daysCheckbox">
                                                <label>{Resources['bOQPermissions'][currentLanguage]}</label>
                                                <div className="three__daysCheck--flex">
                                                    <div className="three__daysCheck">
                                                        <div className="ui checkbox checkBoxGray300 checked">
                                                            <input type="checkbox" value='BOQPermissions' onChange={() => this.handleChange('BOQPermissions', 'useBoqPermission')} checked={this.state.DefaultConfigurations.useBoqPermission ? 'checked' : null} />
                                                            <label>{Resources['useBOQPermission'][currentLanguage]}</label>
                                                        </div>
                                                        <div className="ui checkbox checkBoxGray300 checked">
                                                            <input type="checkbox" value='BOQPermissions' onChange={() => this.handleChange('BOQPermissions', 'useTransferToCompany')} checked={this.state.DefaultConfigurations.useTransferToCompany ? 'checked' : null} />
                                                            <label>{Resources['useTransferToCompany'][currentLanguage]}</label>
                                                        </div>
                                                        <div className="ui checkbox checkBoxGray300 checked">


                                                            <input type="checkbox" value='BOQPermissions' onChange={() => this.handleChange('BOQPermissions', 'useAVG')} checked={this.state.DefaultConfigurations.useAVG ? 'checked' : null} />
                                                            <label>{Resources['useAverageReleasePrice'][currentLanguage]}</label>
                                                        </div>
                                                    </div>
                                                    <div className="three__daysCheck">
                                                        <div className="ui checkbox checkBoxGray300 checked">
                                                            <input type="checkbox" value='BOQPermissions' onChange={() => this.handleChange('BOQPermissions', 'usePermissionsOnLogs')} checked={this.state.DefaultConfigurations.usePermissionsOnLogs ? 'checked' : null} />
                                                            <label>{Resources['usePermissionsOnLog'][currentLanguage]}</label>
                                                        </div>
                                                        <div className="ui checkbox checkBoxGray300 checked">
                                                            <input type="checkbox" value='BOQPermissions' onChange={() => this.handleChange('BOQPermissions', 'useCost')} checked={this.state.DefaultConfigurations.useCost ? 'checked' : null} />
                                                            <label>{Resources['useCost'][currentLanguage]}</label>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            {RenderWorkFlowSettings()}

                                            <div className="slider-Btns">
                                                <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources['save'][currentLanguage]}</button>
                                            </div>
                                        </form>
                                    )}
                                </Formik>



                            </div>
                        </div>
                    </div>
                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={Resources["smartDeleteMessageContent"][currentLanguage]}
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName='delete' clickHandlerContinue={this.ConfirmationDelete}
                        />
                    ) : null}

                </div>
            </div>
        )
    }
}

export default withRouter(GeneralConfiguration)

