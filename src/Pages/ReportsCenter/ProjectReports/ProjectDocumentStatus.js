import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Dataservice from '../../../Dataservice';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ExportDetails from "../ExportReportCenterDetails";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import moment from 'moment';
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';


let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')

const ValidtionSchema = Yup.object().shape({
    selectedProject: Yup.string().required(Resources['projectSelection'][currentLanguage]).nullable(true)
});

const columns = [
    { field: 'title', title: Resources['document'][currentLanguage] },
    { field: 'open', title: Resources['open'][currentLanguage] },
    { field: 'closed', title: Resources['close'][currentLanguage] },
    { field: 'approved', title: Resources['approved'][currentLanguage] },
    { field: 'rejected', title: Resources['rejeceted'][currentLanguage] }];

class ProjectDocumentStatus extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            ProjectsData: [],
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: "0" },
            rows: [],
            finishDate: moment(),
            startDate: moment()
        }

        if (!Config.IsAllow(4027)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push("/");
        }

        this.fields = [{
            title: Resources["Projects"][currentLanguage],
            value: "",
            type: "text"
        },
        {
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
        Dataservice.GetDataList('ProjectProjectsGetAll', 'projectName', 'projectId').then(result => {
            result.unshift({ 'label': 'All Projects', 'value': '0' });
            this.setState({
                ProjectsData: result
            })
        }).catch(() => {
            toast.error('somthing wrong')
        })
    }

    getGridRows = () => {
        this.setState({ isLoading: true })
        let startDate = moment(this.state.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        let endDate = moment(this.state.finishDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        Dataservice.GetDataGrid(`ProjectDocumentStatus?start=${startDate}&end=${endDate}&projectId=${this.state.selectedProject.value}` ).then(res => {
            this.setState({
                rows: res,
                isLoading: false
            })
        }).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }

    render() {

        const btnExport = this.state.isLoading === false ?
            (
                <ExportDetails fieldsItems={columns}
                    rows={this.state.rows} fields={this.fields} fileName={Resources.ProjectDocumentStatus[currentLanguage]} />
            ) : null;

        return (
            <React.Fragment>
                <div className="reports__content">
                    <header>
                        <h2 className="zero">{Resources.ProjectDocumentStatus[currentLanguage]}</h2>
                        {btnExport}
                    </header>
                    <Formik
                        initialValues={{
                            selectedProject: '',
                        }}
                        enableReinitialize={true}
                        validationSchema={ValidtionSchema}
                        onSubmit={(values, actions) => {
                            this.getGridRows()
                        }}>
                        {({ errors, touched, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                            <Form className="proForm reports__proForm" onSubmit={handleSubmit}>
                                <div className="linebylineInput valid-input">
                                    <Dropdown title='Projects' data={this.state.ProjectsData} name='selectedProject'
                                        selectedValue={this.state.selectedProject} onChange={setFieldValue}
                                        handleChange={e => { this.setState({ selectedProject: e }); this.fields[0].value = e.label }}
                                        onBlur={setFieldTouched}
                                        error={errors.selectedProject}
                                        touched={touched.selectedProject}
                                        value={values.selectedProject} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='startDate'
                                        startDate={this.state.startDate}
                                        handleChange={e => { this.handleChange('startDate', e); this.fields[1].value = e }} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='finishDate'
                                        startDate={this.state.finishDate}
                                        handleChange={e => { this.handleChange('finishDate', e); this.fields[2].value = e }} />
                                </div>
                                <button className="primaryBtn-1 btn smallBtn" type='submit'>{Resources['search'][currentLanguage]}</button>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {this.state.rows ?
                        <table className="attachmentTable">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="headCell">{Resources['document'][currentLanguage]}</div>
                                    </th>
                                    <th>
                                        <div className="headCell">{Resources['open'][currentLanguage]}</div>
                                    </th>
                                    <th>
                                        <div className="headCell">{Resources['close'][currentLanguage]}</div>
                                    </th>
                                    <th>
                                        <div className="headCell">{Resources['approved'][currentLanguage]}</div>
                                    </th>
                                    <th>
                                        <div className="headCell">{Resources['rejeceted'][currentLanguage]}</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>{this.state.rows.map(i => {
                                return (
                                    <tr>
                                        <td style={{ width: 'auto' }}>
                                            <div className="contentCell" style={{ width: 'auto', justifyContent: 'center' }}> {i.title}</div>
                                        </td>
                                        <td>
                                            <div className="contentCell" style={{ width: '15%', justifyContent: 'center' }}> {i.open}</div>
                                        </td>
                                        <td>
                                            <div className="contentCell" style={{ width: '15%', justifyContent: 'center' }}> {i.closed}</div>
                                        </td>
                                        <td>
                                            <div className="contentCell" style={{ width: '15%', justifyContent: 'center' }}> {i.approved}</div>
                                        </td>
                                        <td>
                                            <div className="contentCell" style={{ width: '15%', justifyContent: 'center' }}> {i.rejected}</div>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table> : null}
                </div>
                 {this.state.isLoading==true?<LoadingSection />:null}
            </React.Fragment>
        )
    }

}
export default withRouter(ProjectDocumentStatus)
