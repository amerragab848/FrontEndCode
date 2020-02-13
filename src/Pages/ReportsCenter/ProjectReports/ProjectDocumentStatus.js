import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import Dataservice from '../../../Dataservice';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')

const ValidtionSchema = Yup.object().shape({
    selectedProject: Yup.string().required(Resources['projectSelection'][currentLanguage]).nullable(true)
});

const columns = [
    { field: 'title', title: 'Document' },
    { field: 'open', title: 'Open' },
    { field: 'closed', title: 'Close' },
    { field: 'approved', title: 'Approve' },
    { field: 'rejected', title: 'Reject' }];

class ProjectDocumentStatus extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            ProjectsData: [],
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: "0" },
            rows: []
        }

        if (!Config.IsAllow(3678)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push("/");
        }
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
        Dataservice.GetDataGrid('ProjectDocumentStatus?projectId=' + this.state.selectedProject.value).then(res => {
            this.setState({
                rows: res,
                isLoading: false
            })
        }).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    render() {

        const btnExport = this.state.isLoading === false ?
            (
                <Export
                    rows={this.state.isLoading === false ? this.state.rows : []}
                    columns={columns}
                    fileName="Project Document Status"
                />
            ) : null;

        return (
            <React.Fragment>
                <div className="filterBTNS">
                    {btnExport}
                </div>
                <div className="reports__content">
                    <header>
                        <h2 className="zero">{Resources.ProjectDocumentStatus[currentLanguage]}</h2>
                        {this.state.isLoading ? <LoadingSection /> : null}
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
                                        handleChange={e => this.setState({ selectedProject: e })}
                                        onBlur={setFieldTouched}
                                        error={errors.selectedProject}
                                        touched={touched.selectedProject}
                                        value={values.selectedProject} />
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
            </React.Fragment>
        )
    }

}
export default withRouter(ProjectDocumentStatus)
