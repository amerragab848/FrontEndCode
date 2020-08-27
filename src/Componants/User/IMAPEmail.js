import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Resources from "../../resources.json";
import dataservice from "../../Dataservice";
import Dropdown from '../OptionsPanels/DropdownMelcous';
import LoadingSection from '../publicComponants/LoadingSection';
import moment from 'moment';
import { SkyLightStateless } from 'react-skylight';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from "react-toastify";
import TextEditor from '../OptionsPanels/TextEditor';


let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
    projectId: Yup.string().required(Resources['projectRequired'][currentLanguage]).nullable(),
    fromCompanyId: Yup.string().required(Resources['fromCompanyRequired'][currentLanguage]).nullable(),
    fromContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]).nullable(),
})

class IMApEmails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            imapObj: {
                id: null,
                projectId: null,
                fromCompanyId: null,
                fromContactId: null,
                subject: null,
                docDate: null,
                status: true,
                refDoc: null
            },
            imapEmailsList: [],
            projectsList: [],
            companiesList: [],
            contactsList: [],
            rows: [],
            selectedRow: {},
            pageSize: 10,
            pageNumber: 0,
            totalRows: 0,
            ShowPopup: false,
            isLoading: false,
            emailBody:null,
            selectedImapEmail: { label: Resources.imapConfigurationName[currentLanguage], value: 0 },
            selectedProject: { label: Resources.projectName[currentLanguage], value: 0 },
            selectedCompany: { label: Resources.CompanyName[currentLanguage], value: 0 },
            selectedContact: { label: Resources.ContactName[currentLanguage], value: 0 }
        }
    }

    componentDidMount = () => {
        dataservice.GetDataList('GetImapConfiguration', 'name', 'id').then(result => {
            this.setState({ imapEmailsList: result || [] });
        });
        dataservice.GetDataList('GetAccountsProjects', 'projectName', 'projectId').then(result => {
            this.setState({ projectsList: result || [] });
        });
    }

    handleChange = (e) => {
        if (e.value > 0) {
            this.setState({ isLoading: true })
            dataservice.GetDataGrid(`SynchronizeEmails?configurationSetId=${e.value}`).then(result => {
                dataservice.GetDataGrid(`GetEmails?configurationId=${e.value}&pageNumber=${this.state.pageNumber}&pageSize=${this.state.pageSize}`).then(messages => {
                    this.setState({
                        selectedImapEmail: e,
                        rows: messages.data || [],
                        totalRows: messages.total || 0,
                        isLoading: false
                    })
                });
            })
        }
    }

    popupHandleChange = (obj, fieldName, fieldObj, selectedField) => {
        let originalDocument = { ...this.state[obj] }
        let newDocument = {};
        newDocument[fieldName] = fieldObj.value;
        Object.assign(originalDocument, newDocument);
        this.setState({
            [obj]: originalDocument,
            [selectedField]: { label: fieldObj.label, value: fieldObj.value }
        })
    }

    projectHandleChange = (e) => {
        dataservice.GetDataList(`GetProjectProjectsCompaniesForList?projectId=${e.value}`, 'companyName', 'companyId').then(result => {
            this.setState({ companiesList: result || [] });
        });
    }

    companytHandleChange = (e) => {
        dataservice.GetDataList(`GetContactsByCompanyId?companyId=${e.value}`, 'contactName', 'id').then(result => {
            this.setState({ contactsList: result || [] });
        });
    }

    addInboxToEmailRecord = () => {
        let imapObj = {
            id: null,
            projectId: null,
            fromCompanyId: null,
            fromContactId: null,
            subject: null,
            docDate: null,
            status: true,
            refDoc: null
        }
        let params = { ...this.state.imapObj }
        params.subject = this.state.selectedRow.subject;
        params.docDate = this.state.selectedRow.date;
        this.setState({ isLoading: true })
        dataservice.addObject(`AddToEmailRecord`, params).then(result => {
            toast.success(Resources.successAlert[currentLanguage])
            this.setState({
                selectedRow: {},
                imapObj: imapObj,
                selectedImapEmail: { label: Resources.imapConfigurationName[currentLanguage], value: 0 },
                selectedProject: { label: Resources.projectName[currentLanguage], value: 0 },
                selectedCompany: { label: Resources.CompanyName[currentLanguage], value: 0 },
                selectedContact: { label: Resources.ContactName[currentLanguage], value: 0 },
                isLoading: false,
                ShowPopup: false
            })
        })
    }

    GetPrevoiusData() {
        let pageNumber = this.state.pageNumber - 1;
        if (pageNumber >= 0 && this.state.selectedImapEmail.value > 0) {
            this.setState({
                isLoading: true,
                pageNumber: pageNumber
            });
            let url = `GetEmails?configurationId=${this.state.selectedImapEmail.value}&pageNumber=${pageNumber}&pageSize=${this.state.pageSize}`
            dataservice.GetDataGrid(url).then(result => {
                this.setState({
                    rows: result.data || [],
                    totalRows: result.total || 0,
                    isLoading: false
                });
            })
        }
    };

    GetNextData() {
        let pageNumber = this.state.pageNumber + 1;
        let maxRows = this.state.totalRows;
        if (this.state.pageSize * pageNumber !== 0 && this.state.pageSize * pageNumber < maxRows && this.state.selectedImapEmail.value > 0) {
            this.setState({
                isLoading: true,
                pageNumber: pageNumber
            });
            let url = `GetEmails?configurationId=${this.state.selectedImapEmail.value}&pageNumber=${pageNumber}&pageSize=${this.state.pageSize}`
            dataservice.GetDataGrid(url).then(result => {
                this.setState({
                    rows: result.data || [],
                    totalRows: result.total || 0,
                    isLoading: false
                });
            })
        }
    };

    preparePopUp=(element)=>{
        let url=`GetEmailBody?messageId=${element.msgId}&configurationSetId=${this.state.selectedImapEmail.value}`
        dataservice.GetRowById(url).then(result=>{
            this.setState({ selectedRow: element,emailBody:result.textBody, ShowPopup: true })
        })
        //this.setState({ selectedRow: element, ShowPopup: true })
    }

    render() {
        let table = <table className="attachmentTable attachmentTableAuto">
            <thead>
                <tr>
                    <th>
                        <div className="headCell">
                            <span>
                                {Resources.fromEmail[currentLanguage]}
                            </span>
                        </div>
                    </th>
                    <th>
                        <div className="headCell">
                            <span>
                                {Resources.subject[currentLanguage]}
                            </span>
                        </div>
                    </th>
                    <th>
                        <div className="headCell">
                            <span>
                                {Resources.date[currentLanguage]}
                            </span>
                        </div>
                    </th>
                    <th>
                        <div className="headCell">
                            <span>
                                {Resources.LogControls[currentLanguage]}
                            </span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    this.state.rows.map((element, index) => {
                        return (
                            <>
                                <tr key={index} >
                                    <td style={{ paddingLeft: '18px !important' }}>
                                        {element.fromEmail}
                                    </td>
                                    <td style={{ paddingLeft: '18px !important' }}>
                                        {element.subject}
                                    </td>
                                    <td style={{ paddingLeft: '18px !important' }}>
                                        {moment(element.date).format('DD/MM/YYYY')}
                                    </td>
                                    <td style={{ paddingLeft: '18px !important' }}>
                                        <button className="ui basic button" onClick={() => { this.preparePopUp(element) }}>
                                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxwYXRoIGZpbGw9IiNDQ0QyREIiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTE0IDYuMDFjMCAxLjExLS44OTYgMi4wMS0yIDIuMDFzLTItLjktMi0yLjAxQzEwIDQuOSAxMC44OTYgNCAxMiA0czIgLjkgMiAyLjAxem0wIDUuOTg2YzAgMS4xMS0uODk2IDIuMDEtMiAyLjAxcy0yLS45LTItMi4wMWMwLTEuMTEuODk2LTIuMDEgMi0yLjAxczIgLjkgMiAyLjAxem0wIDUuOTk0YzAgMS4xMS0uODk2IDIuMDEtMiAyLjAxcy0yLS45LTItMi4wMWMwLTEuMTEuODk2LTIuMDEgMi0yLjAxczIgLjkgMiAyLjAxeiIvPgo8L3N2Zz4K" alt="Row Actions" />
                                        </button>
                                    </td>
                                </tr>
                            </>
                        )
                    })
                }
            </tbody>
        </table>
        let RenderSettings = () => {
            return (
                <div className="doc-pre-cycle">
                    <div className="subiTabsContent feilds__top">
                        <Formik
                            initialValues={{ ...this.state.imapObj }}
                            enableReinitialize={true}
                            validationSchema={validationSchema}
                            onSubmit={() => {
                                this.addInboxToEmailRecord()
                            }}>
                            {({ errors, touched, handleBlur, handleSubmit }) => (
                                <Form onSubmit={handleSubmit}>
                                    <div className='document-fields'>
                                        <div className="proForm datepickerContainer">
                                            <div className="letterFullWidth">
                                                <label className="control-label">{Resources.emailBody[currentLanguage]}</label>
                                                <div className="inputDev ui input">
                                                    <TextEditor
                                                        value={this.state.emailBody || ''}
                                                        disabled={true} />
                                                </div>
                                            </div>
                                            <div className="linebylineInput valid-input">
                                                <Dropdown title='Projects' data={this.state.projectsList} name='projectId'
                                                    selectedValue={this.state.selectedProject}
                                                    handleChange={e => {
                                                        this.popupHandleChange('imapObj', 'projectId', e, 'selectedProject');
                                                        this.projectHandleChange(e)
                                                    }}
                                                    error={errors.projectId}
                                                    touched={touched.projectId}
                                                    value={this.state.selectedProject} />
                                            </div>
                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources['reference'][currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.refDoc && touched.refDoc ? (" has-error") : !errors.refDoc && touched.refDoc ? (" has-success") : " ")} >
                                                    <div className="inputDev ui input">
                                                        <input autoComplete="off" className="form-control"
                                                            value={this.state.imapObj.refDoc} name="refDoc"
                                                            defaultValue={this.state.imapObj.refDoc}
                                                            onBlur={handleBlur} onChange={(e) => this.popupHandleChange('imapObj', 'refDoc', e, '')}
                                                            placeholder={Resources['reference'][currentLanguage]} />
                                                        {touched.refDoc ? (<em className="pError">{errors.refDoc}</em>) : null}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <Dropdown title='fromCompany' data={this.state.companiesList} name='fromCompanyId'
                                                    selectedValue={this.state.selectedCompany}
                                                    handleChange={e => {
                                                        this.popupHandleChange('imapObj', 'fromCompanyId', e, 'selectedCompany');
                                                        this.companytHandleChange(e)
                                                    }}
                                                    error={errors.fromCompanyId}
                                                    touched={touched.fromCompanyId}
                                                    value={this.state.selectedCompany} />
                                            </div>
                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <Dropdown title='fromContact' data={this.state.contactsList} name='fromContactId'
                                                    selectedValue={this.state.selectedContact}
                                                    handleChange={e => {
                                                        this.popupHandleChange('imapObj', 'fromContactId', e, 'selectedContact');
                                                    }}
                                                    error={errors.fromContactId}
                                                    touched={touched.fromContactId}
                                                    value={this.state.selectedContact} />
                                            </div>
                                        </div>
                                        <div className="slider-Btns">
                                            <button className="primaryBtn-1 btn meduimBtn" type='submit' >{Resources['save'][currentLanguage]}</button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )
        }
        return (
            <div className="mainContainer">
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <div className="proForm reports__proForm">
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="imapConfigurationName"
                                    data={this.state.imapEmailsList}
                                    value={this.state.selectedImapEmail}
                                    selectedValue={this.state.selectedImapEmail}
                                    handleChange={e => { this.handleChange(e) }} />
                            </div>
                        </div>
                        <div className="proForm reports__proForm">
                            <div className="linebylineInput valid-input">
                                <p>{Resources.inboxSummary[currentLanguage]}<span>({this.state.rows.length})</span></p>
                            </div>
                            <div className="">
                                <button onClick={() => { this.handleChange(this.state.selectedImapEmail) }} ><i class="fa fa-refresh"></i></button>
                            </div>
                        </div>

                    </div>
                    <div className="filterBTNS">
                        <div className="rowsPaginations readOnly__disabled">
                            <div className="rowsPagiRange">
                                <span>{this.state.pageSize * this.state.pageNumber + 1}</span> -
                            <span> {this.state.pageSize * this.state.pageNumber + this.state.pageSize}</span>
                                {Resources['jqxGridLanguage'][currentLanguage].localizationobj.pagerrangestring}
                                <span>{this.state.totalRows}</span>
                            </div>
                            <button className={this.state.pageNumber == 0 ? "rowunActive" : ""} onClick={() => this.GetPrevoiusData()}><i className="angle left icon" /></button>
                            <button className={this.state.totalRows <= (this.state.pageSize * this.state.pageNumber + this.state.pageSize) ? "rowunActive" : ""} onClick={() => this.GetNextData()}>
                                <i className="angle right icon" />
                            </button>
                        </div>
                    </div>
                </div>
                <header>
                    <h2 className="zero">{Resources.imapEmails[currentLanguage]}</h2>
                </header>
                <div className="doc-pre-cycle letterFullWidth">
                    {this.state.isLoading == false ? table : <LoadingSection />}
                    <div className="skyLight__form">
                        <SkyLightStateless onOverlayClicked={() => this.setState({ ShowPopup: false, selectedRow: {} })}
                            title={Resources['addToEmailRecord'][currentLanguage]} isVisible={this.state.ShowPopup}
                            onCloseClicked={() => this.setState({ ShowPopup: false, selectedRow: {} })} >
                            {RenderSettings()}
                        </SkyLightStateless>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(IMApEmails)