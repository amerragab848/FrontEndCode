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

import PieChartComp from '../PieChartComp'
import Api from '../../../api';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')


const StatusDropData = [
    { label: Resources.selectAll[currentLanguage], value: '' },
    { label: Resources.active[currentLanguage], value: true },
    { label: Resources.inActive[currentLanguage], value: false },]


class ActiveProjectsReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            selectedStatus: { label: Resources.selectAll[currentLanguage], value: '' },
            rows: [],
            finishDate: moment(),
            startDate: moment(),
            showChart: true,
            series: [],
            xAxis: { type: 'pie' },
            noClicks: 0,
        }

        if (!Config.IsAllow(3686)) {
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
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "statusName",
                name: Resources["holded"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ];

    }


    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }


    componentDidMount() {
    }

    componentWillMount() {
    }


    getGridRows = () => {
        this.setState({ isLoading: true })
        let noClicks = this.state.noClicks;
        Api.get('ActiveProjectReport?status=' + this.state.selectedStatus.value + '').then(
            res => {

                let hold = 0
                let unhold = 0
                res.map(i => {

                    if (i.statusName === 'UnHold')
                        unhold = unhold + 1

                    if (i.statusName === 'Hold')
                        hold = hold + 1
                })

                let series = [{
                    name: Resources['activeProjectsReport'][currentLanguage],
                    data: [{ y: hold, name: Resources['holded'][currentLanguage] },
                    { y: unhold, name: Resources['unHolded'][currentLanguage] },],
                    type: "pie"
                }]

                this.setState({
                    series, noClicks: noClicks + 1,
                    rows: res, isLoading: false
                })
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    render() {

        let Chart =
            <PieChartComp
                noClicks={this.state.noClicks}
                series={this.state.series}
                title='activeProjectsReport' />

        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'activeProjectsReport'} />
            : null

        return (

            <div className='mainContainer main__fulldash'>

                <div className="documents-stepper noTabs__document">

                    <div className="submittalHead">
                        <h2 className="zero">{Resources['activeProjectsReport'][currentLanguage]}</h2>
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
                                    <Dropdown className="fullWidthWrapper textLeft" title='status'
                                        data={StatusDropData}
                                        selectedValue={this.state.selectedStatus}
                                        handleChange={e => this.setState({ selectedStatus: e })} />
                                </div>

                                <div className="fullWidthWrapper ">
                                    <button className="primaryBtn-1 btn mediumBtn" onClick={this.getGridRows}>{Resources['search'][currentLanguage]}</button>
                                </div>

                            </div>

                            <div className="doc-pre-cycle letterFullWidth">
                                {Chart}
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
export default withRouter(ActiveProjectsReport)
