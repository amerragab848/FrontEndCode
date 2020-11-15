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
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
 
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class approvalDocument extends Component {

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
        if (!Config.IsAllow(3763)) {
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
                fromDate: moment(this.state.startDate,'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                toDate: moment(this.state.finishDate,'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            }
            Api.post('GetApproveDocument', reportobj).then(res => {
                this.setState({ reportData: res, isLoading: false })
            })
        } 
    }
    
    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }
    render() {
        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.reportData : []} columns={this.exportColumns} fileName={'approvalDocument'} />
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
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.approvalDocument[currentLanguage]}</h2>
                    {btnExport}
                </header>
                {this.state.isLoading == true ?<LoadingSection /> :
                    <div className="proForm reports__proForm">
                        <div className="linebylineInput valid-input">
                            <Dropdown
                                title="Projects"
                                data={this.state.projectList}
                                selectedValue={this.state.project}
                                handleChange={event => { this.setState({ project: event }); }}
                                name="projects"
                                index="projects" />
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
                        <button className="primaryBtn-1 btn smallBtn" onClick={() => this.getChartData()}>{Resources['search'][currentLanguage]}</button>
                        <div className="doc-pre-cycle letterFullWidth">
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
        )
    }

}


export default approvalDocument
