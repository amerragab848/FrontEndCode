import React, { Component, Fragment } from "react";
import dataservice from "../../Dataservice";
import Resources from "../../resources.json";
import DropdownMelcous from '../../Componants/OptionsPanels/DropdownMelcous'
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import SkyLight from "react-skylight";
import { toast } from "react-toastify";
import moment from "moment";
import DatePicker from '../../Componants/OptionsPanels/DatePicker'

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let meetingRefToken = localStorage.getItem("refToken");
let meetingAccessToken = localStorage.getItem("accToken");
let expRefToken = localStorage.getItem("expRefToken");

const _ = require("lodash");
const ValidtionSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    startDate: Yup.string().required(Resources['startDate'][currentLanguage]),
    finishDate: Yup.string().required(Resources['finishDate'][currentLanguage]),
    startTime: Yup.string().required(Resources['startTime'][currentLanguage]),
    finishTime: Yup.string().required(Resources['finishTime'][currentLanguage]),

});
const today = moment();

class ProcoorMeeting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedUsers: [{ label: "Select ALL", value: 0 }],
            poolUSers: [],
            meetingsList: [],
            currentId: 0,
            showModal: false,
            isLoading: false,
            refreshToken: "",
            accessToken: "",
            meetingURL: "",
            startMeetingURL: "",
            meetingId: "",
            document: {}
        };
    }
    generateAccessToke = (meetingRefToken) => {
        let mainData = {};

        mainData.grant_type = "refresh_token";
        mainData.refresh_token = meetingRefToken;

        dataservice.postGoMeetingToken("oauth/v2/token", mainData).then(data => {
            if (data) {
                localStorage.setItem("refToken", data.refresh_token);
                localStorage.setItem("expRefToken", moment(today).format("DD/MM/YYYY"));
                localStorage.setItem("accToken", data.access_token);

                this.setState({
                    refreshToken: data.refresh_token,
                    accessToken: data.access_token,
                })
            }
        });
    }
    generateRefreshToke = () => {

        let mainData = {};

        mainData.grant_type = "password";
        mainData.username = "hady@procoor.com";
        mainData.password = "Procoor#1";

        dataservice.postGoMeetingToken("oauth/v2/token", mainData).then(data => {
            if (data) {
                localStorage.setItem("refToken", data.refresh_token);
                localStorage.setItem("expRefToken", moment(today).format("DD/MM/YYYY"));
                localStorage.setItem("accToken", data.access_token);

                this.setState({
                    refreshToken: data.refresh_token,
                    accessToken: data.access_token,
                })
            }
        });
    }
    componentDidMount = () => {

        let meeting = {
            subject: '',
            startDate: moment().format("DD/MM/YYYY"),
            finishDate: moment().format("DD/MM/YYYY"),
            startTimeInMinutes: '',
            finishTimeMinutes: '',
            startTime: '',
            finishTime: ''

        };
        this.setState({ document: meeting });
    }
    componentWillMount = () => {
        dataservice.GetDataList('GetAllActiveAccounts', "userName", "id").then(
            res => {
                this.setState({
                    poolUSers: res,
                })
            }
        )
        dataservice.callAPIGetDataList('GetMeetingsByAccountId').then(
            res => {
                this.setState({
                    meetingsList: res,
                })
            }
        )
        if (meetingRefToken) {
            if (expRefToken) {
                var dateDiff = parseInt((today - expRefToken) / (24 * 3600 * 1000));

                if (dateDiff > 29) {
                    this.generateRefreshToke();
                } else {
                    this.generateAccessToke(meetingRefToken);
                }
            } else {
                this.generateRefreshToke();
            }
        } else {
            this.generateRefreshToke();
        }
    };
    addMeeting(e, id) {
        this.simpleDialog.show();
        this.setState({
            showModal: true
        });
    };
    usershandleChange = (e) => {
        this.setState({ selectedUsers: e })
    };
    SaveMeeting = () => {
        let obj = this.state.document;
        let selectedAccounts = this.state.selectedUsers;

        if (obj.startTime == "" || obj.finishTime == "") {

            toast.warning("Start And Finish Times Must Be Entered")
        }
        else {
            if (obj.startTimeInMinutes > obj.finishTimeMinutes) {

                toast.warning("Finish Time Must Be Greater Than Start Time")
            }
            else {
                let params = {
                    "subject": obj.subject,
                    "starttime": moment(obj.startDate).format("YYYY-DD-MM") + "T" + obj.startTime + ":00" + "z",
                    "endtime": moment(obj.finishDate).format("YYYY-DD-MM") + "T" + obj.finishTime + ":00" + "z",
                    "passwordrequired": false,
                    "conferencecallinfo": "hybrid",
                    "timezonekey": "America/Los_Angeles",
                    "meetingtype": "scheduled"
                }

                dataservice.postGoMeetingAPIs("G2M/rest/meetings", params).then(data => {
                    if (data) {
                        this.simpleDialog.hide();
                        this.setState({
                            meetingURL: data ? data[0].joinURL : null,
                            meetingId: data ? data[0].meetingid : null,
                            showModal: false
                        })
                        let addingMeetingWithAccounts = {
                            "subject": obj.subject,
                            "startDate": moment(obj.startDate).format("YYYY-MM-DD") + obj.startTime + ":00",
                            "finishDate": moment(obj.finishDate).format("YYYY-MM-DD") + obj.finishTime + ":00",
                            "selectedAccounts": selectedAccounts,
                            "meetingLink": this.state.meetingURL
                        };
                        dataservice.addObject('AddMeeting', addingMeetingWithAccounts).then(result => {

                            toast.success(Resources["operationSuccess"][currentLanguage]);
                        })
                        // dataservice.getGoMeetingAPIs("G2M/rest/meetings/" + this.state.meetingId + "/" + "start").then(res => {
                        //     this.setState({
                        //         startMeetingURL: res ? res.hostURL : null

                        // })
                    } else {
                        toast.warning("SomeThing Goes Wrong");
                    }
                });
            }
        }
    }
    convertTimeToMinutes = time => {
        var a = time.split(':');
        return (+a[0]) * 60 + (+a[1]);
    }
    handleChangeCheck = (e, name) => {
        let updated_document = this.state.document

        let value = this.convertTimeToMinutes(e.target.value)
        let valueString = e.target.value;

        updated_document[name] = value;

        if (name == "finishTimeMinutes") name = "finishTime";
        if (name == "startTimeInMinutes") name = "startTime";

        updated_document[(name)] = valueString;

        this.setState({
            meeting: updated_document
        })
    }
    handleChange(field, e) {

        let updated_document = this.state.document
        let value = e;
        updated_document[field] = value;
        this.setState({
            meeting: updated_document
        })
    }
    render() {
        let meetingURL = this.state.meetingURL
        return (
            <div className="mainContainer main__withouttabs">
                <div class="submittalFilter">
                    <div class="subFilter">
                        <h3 class="zero">{Resources["meetings"][currentLanguage]}</h3>
                    </div>
                    <div>
                        <button className="primaryBtn-1 btn mediumBtn" onClick={() => this.addMeeting()}>{Resources["new"][currentLanguage]}</button>
                    </div>
                </div>
                <section style={{ display: "flex", marginLeft: "15px", overflowY: "scroll" }}>
                    {this.state.meetingsList != null ?
                        <div style={{background: "white", overflowY: "scroll" }}>

                            {this.state.meetingsList.map(item => (
                                <li key={item.id}>
                                    <div className="contentCell tableCell-4">
                                        <h3>{item.subject}</h3>
                                        <a
                                            href={item["meetingLink"]}
                                            className="pdfPopup various zero"
                                            data-toggle="tooltip"
                                            title={item["fileName"]}>
                                            {item.meetingLink}
                                        </a> 
                                    </div>
                                </li>
                            ))}
                        </div>
                        : <div style={{ padding: "100px", background: "white"}}>
                        </div>}
                    {meetingURL != null ?
                        <div style={{ display: 'block' }}>
                            <iframe style={{ borderWidth: "thin", width: 1200, height: '100%' }} src={meetingURL} id="iframeMeeting" name="iframeMeeting">
                            </iframe>
                        </div>
                        : <div style={{ display: 'block', overflowY: "scroll" }}></div>}
                </section>
                <div
                    className="largePopup largeModal " style={{ display: this.state.showModal ? "block" : "none" }}          >
                    <SkyLight hideOnOverlayClicked ref={ref => (this.simpleDialog = ref)}
                        title={Resources['goEdit'][currentLanguage]}
                        onCloseClicked={() => this.setState({ ShowPopup: false })} isVisible={this.state.ShowPopup}>
                        <Formik initialValues={{
                            selectAccount: this.state.selectedUsers.value > 0 ? this.state.selectedUsers : '',
                            subject: this.state.document.subject,
                            startDate: this.state.document.startDate,
                            finishDate: this.state.document.finishDate,
                            startTime: this.state.document.startTime,
                            finishTime: this.state.document.finishTime
                        }}
                            enableReinitialize={true}
                            validationSchema={ValidtionSchema}
                            onSubmit={(values, actions) => {
                                this.SaveMeeting(values, actions)
                            }}>
                            {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                                <Form className="proForm" onSubmit={handleSubmit}>
                                    <div className="fillter-status fillter-item-c fullInputWidth">
                                        <div style={{ padding: "6px 10px" }}>
                                            <DropdownMelcous
                                                title='selectAccount'
                                                data={this.state.poolUSers}
                                                name='SelectedAccount'
                                                value={this.state.selectedUsers}
                                                onChange={setFieldValue}
                                                isMulti={true} handleChange={(e) => this.usershandleChange(e)}
                                                onBlur={setFieldTouched}
                                                error={errors.selectedUsers}
                                                touched={touched.selectedUsers}
                                                value={values.selectedUsers} />
                                        </div>
                                    </div>
                                    <div className="dropWrapper">
                                        <div className="fillter-status fillter-item-c fullInputWidth">
                                            <DatePicker title='startDate'
                                                startDate={this.state.document.startDate}
                                                defaultValue={this.state.document.startDate}
                                                handleChange={e => this.handleChange('startDate', e)} />
                                        </div>
                                        <div className="fillter-status fillter-item-c fullInputWidth">
                                            <DatePicker title='finishDate'
                                                startDate={this.state.document.finishDate}
                                                defaultValue={this.state.document.finishDate}
                                                handleChange={e => this.handleChange('finishDate', e)} />
                                        </div>
                                        <div className="fillter-status fillter-item-c fullInputWidth">
                                            <label className="control-label">{Resources['subject'][currentLanguage]} </label>
                                            <div className={"inputDev ui input " + (errors.subject && touched.subject ? 'has-error' : !errors.subject && touched.subject ? (" has-success") : " ")}>
                                                <input name='subject' defaultValue={this.state.document.subject}
                                                    className="form-control"
                                                    id="subject" placeholder={Resources['subject'][currentLanguage]} autoComplete='off'
                                                    onBlur={handleBlur}
                                                    onChange={e => {
                                                        handleChange(e)
                                                        this.handleChange('subject', e.target.value)
                                                    }} />
                                                {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input fullInputWidth">
                                            <label className="control-label">{Resources.startTime[currentLanguage]}</label>
                                            <div className="inputDev ui input" >
                                                <input className="form-control fsadfsadsa" id="startTime" name="startTime"
                                                    pattern="([1]?[0-9]|2[0-3]):[0-5][0-9]" type="time"
                                                    defaultValue={this.state.document.startTimeInMinutes}
                                                    onBlur={(e) => this.handleChangeCheck(e, 'startTimeInMinutes')} />
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input fullInputWidth">
                                            <label className="control-label">{Resources.finishTime[currentLanguage]}</label>
                                            <div className="inputDev ui input" >
                                                <input className="form-control fsadfsadsa" id="finishTime" name="finishTime"
                                                    pattern="([1]?[0-9]|2[0-3]):[0-5][0-9]" type="time"
                                                    defaultValue={this.state.document.finishTimeMinutes}
                                                    onBlur={(e) => this.handleChangeCheck(e, 'finishTimeMinutes')} />
                                            </div>
                                        </div>
                                        <div className="dropBtn fullWidthWrapper">
                                            {this.state.isLoading === false ? <button className="primaryBtn-1 btn smallBtn">
                                                {Resources['save'][currentLanguage]}</button>
                                                : <button className="primaryBtn-1 btn disabled">
                                                    <div className="spinner">
                                                        <div className="bounce1" />
                                                        <div className="bounce2" />
                                                        <div className="bounce3" />
                                                    </div>
                                                </button>}
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </SkyLight>
                </div>
            </div>
        );
    }
}

export default ProcoorMeeting;
