import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
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

        this.columns = [
            {
                key: "arrange",
                name: Resources["numberAbb"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "subject",
                name: Resources["subject"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "docDate",
                name: Resources["docDate"][currentLanguage],
                width: 160,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }, {
                key: "total",
                name: Resources["total"][currentLanguage],
                width: 50,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "balance",
                name: Resources["balanceToFinish"][currentLanguage],
                width: 140,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "docCloseDate",
                name: Resources["docClosedate"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            },
            {
                key: "createdBy",
                name: Resources["createdBy"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
        ];

    }

    componentWillMount() {
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
            res => {
                this.setState({
                    rows: res,
                    isLoading: false
                })
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    render() {
        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'projectInvoices'} />
            : null
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
                    {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form className="proForm reports__proForm" onSubmit={handleSubmit}>
                            <div className="linebylineInput valid-input">
                                <Dropdown  title='Projects' data={this.state.ProjectsData} name='selectedProject'
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
