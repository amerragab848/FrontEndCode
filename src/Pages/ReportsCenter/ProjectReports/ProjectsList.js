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
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import Dataservice from '../../../Dataservice';
import Api from '../../../api';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')

const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
}

const StatusDropData = [
    { label: Resources.active[currentLanguage], value: true },
    { label: Resources.inActive[currentLanguage], value: false },]


class ProjectsList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            ProjectsData: [],
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: '' },
            selectedStatus: { label: Resources.active[currentLanguage], value: true },
            rows: [],
            finishDate: moment(),
            startDate: moment(),
        }

        if (!Config.IsAllow(3677)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }

        this.columns = [
            {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "job",
                name: Resources["projectCode"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "projectManagerContactName",
                name: Resources["projectManagerContact"][currentLanguage],
                width: 210,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "excuteContactManager",
                name: Resources["executiveManagerContact"][currentLanguage],
                width: 210,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            },
            {
                key: "statusName",
                name: Resources["statusName"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "holdedName",
                name: Resources["holded"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "clientsConstraints",
                name: Resources["client"][currentLanguage],
                width: 130,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "projectOpenDate",
                name: Resources["openDate"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            },
            {
                key: "projectCloseDate",
                name: Resources["docClosedate"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            },
        ];

    }


    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }


    componentDidMount() {
    }

    componentWillMount() {
        Dataservice.GetDataList('GetAccountsDefaultList?listType=project_type&pageNumber=0&pageSize=10000', 'title', 'id').then(
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
        let reportobj = {
            projectTypeId: this.state.selectedProject.value === '' ? '' :this.state.selectedProject.value ,
            startDate: moment(this.state.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            finishDate: moment(this.state.finishDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            status:this.state.selectedStatus.value ,
            pageNumber:undefined ,pageSize:200, 

        }
        Api.post('GetAllProjectsLists', reportobj).then(
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

        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'projectsList'} />
            : null

        return (

            <div className='mainContainer main__fulldash'>

                <div className="documents-stepper noTabs__document">

                    <div className="submittalHead">
                        <h2 className="zero">{Resources['projectsList'][currentLanguage]}</h2>
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

                                <div className="proForm datepickerContainer">

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title='Projects'
                                            data={this.state.ProjectsData} 
                                            selectedValue={this.state.selectedProject}
                                            handleChange={e => this.setState({ selectedProject: e })} />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title='status'
                                            data={StatusDropData}
                                            selectedValue={this.state.selectedStatus}
                                            handleChange={e => this.setState({ selectedStatus: e })} />
                                    </div>

                                    <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker title='startDate'
                                            startDate={this.state.startDate}
                                            handleChange={e => this.handleChange('startDate', e)} />
                                    </div>

                                    <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker title='finishDate'
                                            startDate={this.state.finishDate}
                                            handleChange={e => this.handleChange('finishDate', e)} />
                                    </div>


                                </div>



                                <div className="fullWidthWrapper ">
                                    <button className="primaryBtn-1 btn mediumBtn" onClick={this.getGridRows}>{Resources['search'][currentLanguage]}</button>
                                </div>



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
export default withRouter(ProjectsList)
