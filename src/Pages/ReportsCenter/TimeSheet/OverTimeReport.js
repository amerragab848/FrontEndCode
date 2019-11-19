import React, { Component } from 'react';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import dataservice from "../../../Dataservice";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    companyName: Yup.string().required(Resources['CompanyName'][currentLanguage]).nullable(true),
    projectTypeId: Yup.string().required(Resources['projectType'][currentLanguage]).nullable(true)
})
class OverTimeReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            companies: [],
            projectType: [],
            selectedCompany: { label: Resources.CompanyName[currentLanguage], value: 0 },
            selectedProjectType: { label: Resources.projectType[currentLanguage], value: 0 },
            rows: [],
            showChart: false,
            finishDate: moment(),
            startDate: moment(),
        }

        if (!Config.IsAllow(3710)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push("/");
        }

        this.columns = [{
            key: "job",
            name: Resources["job"][currentLanguage],
            width: 220,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            frozen: true,
            sortDescendingFirst: true
        }, {
            key: "projectName",
            name: Resources["projectName"][currentLanguage],
            width: 220,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true,
        }, {
            key: "companyName",
            name: Resources["CompanyName"][currentLanguage],
            width: 160,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true
        }, {
            key: "totalHours",
            name: Resources["totalHours"][currentLanguage],
            width: 160,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true
        }];
    }

    componentDidMount() {
        dataservice.GetDataList('GetCompanies?accountOwnerId=2', 'companyName', 'id').then(result => {
            this.setState({
                companies: result
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })

        dataservice.GetDataList('GetAccountsDefaultList?listType=project_Type&pageNumber=0&pageSize=10000', 'title', 'id').then(result => {
            this.setState({
                projectType: result
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })
    }

    getGridRows = () => {
        this.setState({ showChart: false, isLoading: true })
        let obj = {
            companyId: this.state.selectedCompany.value,
            projectTypeId: this.state.selectedProjectType.value,
            startDate: moment(this.state.startDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
            endDate: moment(this.state.finishDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS")
        }

        dataservice.addObject('GetProjectTypesTimeSheet', obj).then((res) => {
            if (res.length > 0) {
                this.setState({
                    rows: res, isLoading: false, showChart: true
                });
            }
            else
                this.setState({
                    rows: [], isLoading: false, showChart: false
                });

        }).catch(() => {
            this.setState({ isLoading: false })
        })

    }

    setDate = (name, value) => {
        this.setState({ [name]: value })
    }

    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                selectedCopmleteRow={true}
                columns={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []}
                columns={this.columns} fileName={Resources['projectTypesTimeSheet'][currentLanguage]} />
            : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.projectTypesTimeSheet[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div>
                    <Formik initialValues={{ companyName: '', projectTypeId: '' }}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={(values) => {
                            this.getGridRows()
                        }}>
                        {({ errors, touched, handleSubmit, setFieldValue, setFieldTouched }) => (
                            <Form id="InspectionRequestForm" className="proForm reports__proForm" noValidate="novalidate" onSubmit={handleSubmit}>

                                <div className="linebylineInput valid-input">
                                    <Dropdown title="CompanyName" name="companyName" index="companyName"
                                        data={this.state.companies} selectedValue={this.state.selectedCompany}
                                        handleChange={event => this.setState({ selectedCompany: event })}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.companyName}
                                        touched={touched.companyName}
                                        isClear={false}
                                        isMulti={false} />
                                </div>
                                <div className="linebylineInput valid-input">
                                    <Dropdown title="projectType" name="projectTypeId" index="projectTypeId"
                                        data={this.state.projectType} selectedValue={this.state.selectedProjectType}
                                        handleChange={event => this.setState({ selectedProjectType: event })}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.projectTypeId}
                                        touched={touched.projectTypeId}
                                        isClear={false}
                                        isMulti={false} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='startDate'
                                        startDate={this.state.startDate}
                                        handleChange={e => this.setDate('startDate', e)} />
                                </div>
                                <div className="linebylineInput valid-input alternativeDate">
                                    <DatePicker title='finishDate'
                                        startDate={this.state.finishDate}
                                        setDate={e => this.setDate('finishDate', e)} />
                                </div>
                                <button className="primaryBtn-1 btn smallBtn"  >{Resources['search'][currentLanguage]}</button>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

} export default OverTimeReport;
