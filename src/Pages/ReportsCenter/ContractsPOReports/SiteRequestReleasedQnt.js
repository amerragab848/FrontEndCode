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



const ValidtionSchema = Yup.object().shape({
    selectedProject: Yup.string()
        .required(Resources['projectSelection'][currentLanguage])
        .nullable(true),
    selectedMaterialRequest: Yup.string()
        .required(Resources['siteRequestSelection'][currentLanguage])
        .nullable(true),
});

class SiteRequestReleasedQnt extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            ProjectsData: [],
            MaterialRequest: [],
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: "0" },
            selectedMaterialRequest: { label: Resources.siteRequestSelection[currentLanguage], value: "0" },
            rows: []
        }

        if (!Config.IsAllow(3693)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }

        this.columns = [

            {
                key: "details",
                name: Resources["description"][currentLanguage],
                width: 500,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "requestedQuantity",
                name: Resources["requestedQuantity"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "releasedQuantity",
                name: Resources["releasedQuantity"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }
        ];

    }

    componentDidMount() {
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
        Dataservice.GetDataGrid('GetSiteRequestItemsForReport?RequestId=' + this.state.selectedMaterialRequest.value + '').then(
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

    HandleChangeProject = (e) => {
        this.setState({ selectedProject: e })
        Dataservice.GetDataList('GetContractsSiteRequestList?projectId='+e.value+'&pageNumber=0&pageSize=1000', 'subject', 'id').then(
            res => {
                console.log(res.total)
                this.setState({
                    MaterialRequest: res
                })
            }).catch((e) => {
                toast.error('somthing wrong')
            })
    }

    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'projectInvoices'} />
            : null

        return (

            <div className='mainContainer main__fulldash'>

                <div className="documents-stepper noTabs__document">

                    <div className="submittalHead">
                        <h2 className="zero">{Resources['siteRequestReleasedQntReport'][currentLanguage]}</h2>
                        <div className="SubmittalHeadClose">
                            <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnslink="http://www.w3.org/1999/xlink">
                                <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                        <g id="Group-2">
                                            <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                                <g id="Action-icons/Close/Circulated/20pt/Grey_Normal"><g id="Group"><circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
                                                    <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z" id="Combined-Shape" fill="#858D9E" fill-rule="nonzero">
                                                    </path>
                                                </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>

                    <div className="doc-container">

                        <div className="step-content">
                            <div className="document-fields">
                                <div className=" fullWidthWrapper textRight">
                                    {btnExport}
                                </div>

                                <Formik

                                    initialValues={{
                                        selectedProject: '',
                                        selectedMaterialRequest: ''
                                    }}

                                    enableReinitialize={true}

                                    validationSchema={ValidtionSchema}

                                    onSubmit={(values, actions) => {

                                        this.getGridRows()
                                    }}>

                                    {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                                        <Form onSubmit={handleSubmit}>
                                            <div className="proForm datepickerContainer">
                                                <div className="linebylineInput valid-input">
                                                    <Dropdown title='Projects' data={this.state.ProjectsData} name='selectedProject'
                                                        selectedValue={this.state.selectedProject} onChange={setFieldValue}
                                                        handleChange={e => this.HandleChangeProject(e)}
                                                        onBlur={setFieldTouched}
                                                        error={errors.selectedProject}
                                                        touched={touched.selectedProject}
                                                        value={values.selectedProject} />
                                                </div>
                                                <div className="linebylineInput valid-input " >
                                                    <Dropdown title='siteRequest' data={this.state.MaterialRequest} name='selectedMaterialRequest'
                                                        selectedValue={this.state.selectedMaterialRequest} onChange={setFieldValue}
                                                        handleChange={e => this.setState({ selectedMaterialRequest: e })}
                                                        onBlur={setFieldTouched}
                                                        error={errors.selectedMaterialRequest}
                                                        touched={touched.selectedMaterialRequest}
                                                        value={values.selectedMaterialRequest} />
                                                </div>
                                            </div>

                                            <div className="fullWidthWrapper ">
                                                <button className="primaryBtn-1 btn mediumBtn" type='submit'>{Resources['search'][currentLanguage]}</button>
                                            </div>

                                        </Form>
                                    )}
                                </Formik>


                            </div>
                            <div className="doc-pre-cycle letterFullWidth">
                                {dataGrid}
                            </div>

                        </div>
                    </div>
                </div>

            </div >
        )
    }

}
export default withRouter(SiteRequestReleasedQnt)
