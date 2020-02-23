import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import ExportDetails from "../ExportReportCenterDetails";
import moment from "moment";
import Dataservice from '../../../Dataservice';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')

const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
}

const ValidtionSchema = Yup.object().shape({
    selectedProject: Yup.string()
        .required(Resources['projectSelection'][currentLanguage])
        .nullable(true),
});

class CashFlowReport extends Component {

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
            this.props.history.push({
                pathname: "/"
            })
        }

        this.fields = [{
            title: Resources["Projects"][currentLanguage],
            value: "",
            type: "text"
        }];
    }

    componentDidMount() {
        Dataservice.GetDataList('ProjectProjectsGetAll', 'projectName', 'projectId').then(
            result => {
                this.setState({
                    ProjectsData: result
                })
            }).catch(() => {
                toast.error('somthing wrong')
            })
    }

    getGridRows = () => {
        this.setState({ isLoading: true })
        Dataservice.GetDataGrid('GetCashFlow?projectId=' + this.state.selectedProject.value + '').then(
            result => {

                this.columns = [];

                result.map(item => {
                    return this.columns.push({
                        title: item.header,
                        type: "text",
                        field : item
                    })
                })

                this.setState({
                    rows: result,
                    isLoading: false
                })
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    render() {
        const btnExport = this.state.isLoading === false ?
            <ExportDetails fieldsItems={this.columns}
                rows={this.state.rows} fields={this.fields} fileName={Resources.cashFlow[currentLanguage]} /> : null

        return (
            <React.Fragment>
                <div className="reports__content">
                    <header>
                        <h2 className="zero">{Resources.cashFlow[currentLanguage]}</h2>
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
                                    {this.state.rows.map(i => {
                                        return (
                                            <th>
                                                <div className="headCell">
                                                    {i.header}
                                                </div>
                                            </th>
                                        )
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {this.state.rows.map(i => {
                                        return (
                                            <td>
                                                <div className="contentCell" style={{ width: '100%', justifyContent: 'center' }}>
                                                    {i.totalIn}
                                                </div>
                                            </td>
                                        )
                                    })}
                                </tr>
                                <tr>
                                    {this.state.rows.map(i => {
                                        return (
                                            <td>
                                                <div className="contentCell" style={{ width: '100%', justifyContent: 'center' }}>
                                                    {i.totalOut}
                                                </div>
                                            </td>
                                        )
                                    })}
                                </tr>
                                <tr>
                                    {this.state.rows.map(i => {
                                        return (
                                            <td>
                                                <div className="contentCell" style={{ width: '100%', justifyContent: 'center' }}>
                                                    {i.variance}
                                                </div>
                                            </td>
                                        )
                                    })}
                                </tr>
                            </tbody>
                        </table> : null}
                </div>
            </React.Fragment>
        )
    }

}
export default withRouter(CashFlowReport)
