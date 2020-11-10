import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import Config from '../../../Services/Config';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import moment from "moment";
import dataService from '../../../Dataservice'
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import ExportDetails from "../ExportReportCenterDetails";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const ValidtionSchema = Yup.object().shape({
    selectedProject: Yup.string()
        .required(Resources['projectSelection'][currentLanguage])
        .nullable(true),
    selectContract: Yup.string()
        .required(Resources['contractRequired'][currentLanguage])
        .nullable(true),
});
class compareApprovedQuantity extends Component {

    constructor(props) {
        super(props)
        this.state = {
            projectList: [],
            rows: [],
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: "-1" },
            selectContract: { label: Resources.contract[currentLanguage], value: "-1" },
            finishDate: moment(),
            startDate: moment(),
            ContractSum: 0,
            countContract: 0,
            pageSize: 200,
            columns: [
                {
                    field: "details",
                    title: Resources["details"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: true,
                    type: "text",
                    sortable: true,
                },
                {
                    field: "unit",
                    title: Resources["unit"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
                }, {
                    field: "unitPrice",
                    title: Resources["unitPrice"][currentLanguage],
                    width: 18,
                    fixed: false,
                    type: "text",
                    sortable: true,
                }, {
                    field: "quantity",
                    title: Resources["quantity"][currentLanguage],
                    width: 18,
                    fixed: false,
                    type: "text",
                    sortable: true,
                }, {
                    field: "revised Quantity",
                    title: Resources["revQuantity"][currentLanguage],
                    width: 18,
                    fixed: false,
                    type: "text",
                    sortable: true,
                }
            ]
        }

        if (!Config.IsAllow(3769)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

        this.fields = [{
            title: Resources["Projects"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["contractor"][currentLanguage],
            value: "",
            type: "text"
        }, {
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
        this.setState({ isLoading: true })
        dataService.GetDataList('ProjectProjectsForList', 'projectName', 'id').then(res => {
            this.setState({ projectList: res, isLoading: false })
        })
    }

    getGridtData = () => {
        this.setState({ currentComponent: null })
        let reportobj = {
            projectId: this.state.selectedProject.value,
            contractId: this.state.selectContract.value,
            startDate: moment(this.state.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            finishDate: moment(this.state.finishDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
        }
        this.setState({ isLoading: true })
        Api.post('ComapareApprovedQuantity', reportobj).then(rows => {
            let columns = []
            if (rows[0]) {
                let objLength = Object.getOwnPropertyNames(rows[0])
                for (var i = 0; i < objLength.length; i++) {
                    columns.push({
                        field: objLength[i],
                        title: objLength[i],
                        width: 18,
                        groupable: true,
                        fixed: true,
                        type: "text",
                        sortable: true,
                    })
                }
            }
            this.setState({ rows, isLoading: false, columns })
        }).catch(() => {
            this.setState({ isLoading: false })
            toast.error(Resources.operationCanceled[currentLanguage])
        });
    }

    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }

    projectChange = (e) => {
        this.setState({ isLoading: true })
        dataService.GetDataList('GetContractByProjectId?projectId=' + e.value, 'subject', 'id').then(res => {
            this.setState({ contractsData: res, isLoading: false, selectedProject: e })
        })
    }

    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                key="compareApprovedQuantity"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.state.columns}
                rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = <ExportDetails fieldsItems={this.state.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.compareApprovedQuantity[currentLanguage]} />

        return (

            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.compareApprovedQuantity[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <Formik
                    initialValues={{
                        selectedProject: '',
                        selectContract: ''
                    }}
                    enableReinitialize={true}
                    validationSchema={ValidtionSchema}
                    onSubmit={() => {
                        this.getGridtData()
                    }}>
                    {({ errors, touched, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit} className='proForm reports__proForm datepickerContainer' >
                            <div className="linebylineInput valid-input ">
                                <Dropdown title='Projects' data={this.state.projectList}
                                    name='selectedProject'
                                    selectedValue={this.state.selectedProject}
                                    onChange={setFieldValue}
                                    handleChange={e => { this.projectChange(e); this.fields[0].value = e.label }}
                                    onBlur={setFieldTouched}
                                    error={errors.selectedProject}
                                    touched={touched.selectedProject}
                                />
                            </div>
                            <div className="linebylineInput valid-input " >
                                <Dropdown title='contract' data={this.state.contractsData}
                                    name='selectContract'
                                    selectedValue={this.state.selectContract}
                                    onChange={setFieldValue}
                                    handleChange={e => { this.setState({ selectContract: e }); this.fields[1].value = e.label }}
                                    onBlur={setFieldTouched}
                                    error={errors.selectContract}
                                    touched={touched.selectContract}
                                />
                            </div>
                            <div className="linebylineInput valid-input alternativeDate">
                                <DatePicker title='startDate'
                                    startDate={this.state.startDate}
                                    handleChange={e => { this.handleChange('startDate', e); this.fields[2].value = e }} />
                            </div>
                            <div className="linebylineInput valid-input alternativeDate">
                                <DatePicker title='finishDate'
                                    startDate={this.state.finishDate}
                                    handleChange={e => { this.handleChange('finishDate', e); this.fields[3].value = e }} />
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


export default compareApprovedQuantity
