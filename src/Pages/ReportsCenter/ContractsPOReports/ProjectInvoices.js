import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export"; 
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";

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
class ProjectInvoices extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            ProjectsData: [],
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: "0" },
            rows: [],
            pageSize: 200,
        }

        if (!Config.IsAllow(3691)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }
        this.columns = [
            {
                field: "arrange",
                title: Resources["numberAbb"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: "subject",
                title: Resources["subject"][currentLanguage],
                width: 25,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "docDate",
                title: Resources["docDate"][currentLanguage],
                width: 16,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: "total",
                title: Resources["total"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "balance",
                title: Resources["balanceToFinish"][currentLanguage],
                width: 14,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "docCloseDate",
                title: Resources["docClosedate"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            },
            {
                field: "createdBy",
                title: Resources["createdBy"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
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
        Dataservice.GetDataGrid('GetContractsInvoicesForPoByProjectIdWithOutPaging?projectId=' + this.state.selectedProject.value + '').then(
            res => {
                this.setState({
                    rows: res.data,
                    isLoading: false
                })
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    render() {

        const dataGrid = this.state.isLoading === false ? (

            <GridCustom
                ref='custom-data-grid'
                key="ProjectInvoices"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'projectInvoices'} />
            : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.projectInvoices[currentLanguage]}</h2>
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
                        <Form onSubmit={handleSubmit} className='proForm reports__proForm'>
                            <div className="linebylineInput valid-input">
                                <Dropdown className="fullWidthWrapper textLeft" title='Projects' data={this.state.ProjectsData} name='selectedProject'
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
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>

        )
    }

}
export default withRouter(ProjectInvoices)
