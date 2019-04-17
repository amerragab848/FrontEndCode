import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import Config from '../../../Services/Config';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import moment from "moment";
import dataService from '../../../Dataservice'
import Export from "../../../Componants/OptionsPanels/Export";
const _ = require('lodash')
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class ProgressDocuments extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            reportData: [],
            projectList: [],
            project: { label: Resources.projectSelection[currentLanguage], value: "-1" },
            finishDate: moment(),
            startDate: moment()
        }
        if (!Config.IsAllow(3762)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }
        this.exportColumns = [
            {
                key: "duration",
                name: Resources["duration"][currentLanguage]
            }, {
                key: "lr",
                name: 'lr',
            }, {
                key: "rfi",
                name: 'rfi'
            }, {
                key: "as",
                name: 'as'
            }, {
                key: "sch",
                name: 'sch'
            }, {
                key: "sd",
                name: 'sd',
            }, {
                key: "m",
                name: 'm',
            }, {
                key: "qs",
                name: 'qs'
            }, {
                key: "gt",
                name: 'gt'
            }
        ];

    }

    componentDidMount() {
    }
    componentWillMount() {
        dataService.GetDataList('ProjectProjectsForList', 'projectName', 'id').then(res => {
            this.setState({ projectList: res })
        })
    }

    getChartData = () => {
        if (this.state.project.value != '-1') {
            this.setState({ isLoading: true })
            let reportobj = {
                projectId: this.state.project.value,
                fromDate: moment(this.state.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                toDate: moment(this.state.finishDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            }
            Api.post('GetProgressDocument', reportobj).then(res => {
                this.setState({ reportData: res, isLoading: false })
            })
        }


    }
    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }
    render() {
        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.reportData : []} columns={this.exportColumns} fileName={'onProgressDocuments'} />
            : null;
        let tabel = this.state.reportData.length > 0 ? this.state.reportData.map((item, Index) => {
            return (
                <tr key={Index}>
                    <td>
                        <div className="contentCell tableCell-1">
                            <p> {item.duration} </p>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-2">
                            <span className="percentage__color" style={{ background: '#2b9f47', height: item.lr + '%' }}></span>
                            <p> {item.lr} </p>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-3">
                            <span className="percentage__color" style={{ background: '#8c8b8b', height: item.rfi + '%' }}></span>
                            <p> {item.rfi} </p>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-4">
                            <span className="percentage__color" style={{ background: '#5497ce', height: item.as + '%' }}></span>
                            <p> {item.as} </p>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-4">
                            <span className="percentage__color" style={{ background: '#babd32', height: item.sch + '%' }}></span>
                            <p> {item.sch} </p>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-4">
                            <span className="percentage__color" style={{ background: '#1cbbce', height: item.sd + '%' }}></span>
                            <p> {item.sd} </p>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-4">
                            <span className="percentage__color" style={{ background: '#fe0101', height: item.m + '%' }}></span>
                            <p> {item.m} </p>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-4">
                            <span className="percentage__color" style={{ background: '#d779b1', height: item.qs + '%' }}></span>
                            <p> {item.qs} </p>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-4 ">
                            <span className="percentage__color" style={{ background: '#f47d1f', height: item.percentage + '%' }}></span>
                            <p> {item.gt} </p>
                        </div>
                    </td>
                </tr>
            );
        }) : null

        return (
            <div className='mainContainer main__fulldash'>
                <div className="documents-stepper noTabs__document">
                    <div className="submittalHead">
                        <h2 className="zero">{Resources['onProgressDocuments'][currentLanguage]}</h2>
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
                    {this.state.isLoading == true ? '' :
                        <div className="doc-container">
                            <div className="step-content">
                                <div className="document-fields">
                                    <div className=" fullWidthWrapper textRight">
                                        {btnExport}
                                    </div>
                                    <div className="proForm datepickerContainer">
                                        <div className="linebylineInput valid-input ">
                                            <Dropdown
                                                title="Projects"
                                                data={this.state.projectList}
                                                selectedValue={this.state.project}
                                                handleChange={event => { this.setState({ project: event }); }}
                                                name="projects"
                                                index="projects"
                                            />

                                        </div>
                                    </div>
                                    <div className="proForm datepickerContainer">
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

                                        <div className="fullWidthWrapper ">
                                            <button className="primaryBtn-1 btn mediumBtn" onClick={() => this.getChartData()}>{Resources['search'][currentLanguage]}</button>
                                        </div>
                                    </div>

                                </div>
                                <div className="doc-pre-cycle letterFullWidth has__table">
                                    <header><h3 class="zero">{Resources['onProgressDocuments'][currentLanguage]}</h3></header>
                                </div>
                                <div className="doc-pre-cycle letterFullWidth has__table">
                                    <div className="table__scroll">
                                        <table className="attachmentTable">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <div className="headCell tableCell-1">
                                                            <span> Duration </span>
                                                        </div>
                                                    </th>

                                                    <th>
                                                        <div className="headCell tableCell-1">
                                                            <span> LR </span>
                                                        </div>
                                                    </th>
                                                    <th>
                                                        <div className="headCell tableCell-2">
                                                            <span> RFI </span>
                                                        </div>
                                                    </th>
                                                    <th>
                                                        <div className="headCell tableCell-3">
                                                            <span> AS </span>
                                                        </div>
                                                    </th>
                                                    <th>
                                                        <div className="headCell tableCell-4">
                                                            <span> SCH </span>
                                                        </div>
                                                    </th>
                                                    <th>
                                                        <div className="headCell tableCell-4">
                                                            <span> SD </span>
                                                        </div>
                                                    </th>
                                                    <th>
                                                        <div className="headCell tableCell-4">
                                                            <span> M </span>
                                                        </div>
                                                    </th>
                                                    <th>
                                                        <div className="headCell tableCell-4">
                                                            <span> QS </span>
                                                        </div>
                                                    </th>
                                                    <th>
                                                        <div className="headCell tableCell-4">
                                                            <span> GT </span>
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tabel}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="table__figure">
                                        <h4 className="">Figure</h4>
                                        <div className="table__figure--item">
                                            <span style={{ background: '#2b9f47' }}></span>
                                            <p>{Resources['lettertitle'][currentLanguage]}</p>
                                        </div>
                                        <div className="table__figure--item">
                                            <span style={{ background: '#8c8b8b' }}></span>
                                            <p>{Resources['requestInformation'][currentLanguage]}</p>
                                        </div>
                                        <div className="table__figure--item">
                                            <span style={{ background: '#5497ce' }}></span>
                                            <p>AS Built</p>
                                        </div>
                                        <div className="table__figure--item">
                                            <span style={{ background: '#babd32' }}></span>
                                            <p>{Resources['schedule'][currentLanguage]}</p>
                                        </div>
                                        <div className="table__figure--item">
                                            <span style={{ background: '#1cbbce' }}></span>
                                            <p>Shop Drawings</p>
                                        </div>
                                        <div className="table__figure--item">
                                            <span style={{ background: '#fe0101' }}></span>
                                            <p>Material</p>
                                        </div><div className="table__figure--item">
                                            <span style={{ background: '#d779b1' }}></span>
                                            <p>{Resources['contractsQs'][currentLanguage]}</p>
                                        </div><div className="table__figure--item">
                                            <span style={{ background: '#f47d1f' }}></span>
                                            <p>Grand Totals</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>}
                </div>

            </div >
        )
    }

}


export default ProgressDocuments
