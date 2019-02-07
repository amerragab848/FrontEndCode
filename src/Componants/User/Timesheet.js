import React, { Component, Fragment } from 'react'

import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import NotifiMsg from '../publicComponants/NotifiMsg';
import Api from '../../api'
import Dropdown from "../OptionsPanels/DropdownMelcous";
import Resources from '../../resources.json';
import DatePicker from '../OptionsPanels/DatePicker'
import moment from 'moment';
import GridSetup from "../../Pages/Communication/GridSetup";
import { Toolbar, Data, Filters } from "react-data-grid-addons";
import Filter from "../FilterComponent/filterComponent";
import Export from "../../Componants/OptionsPanels/Export";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');




export default class Timesheet extends Component {
    constructor(props) {
        super(props)

        const columnsGrid = [
            {
                key: "docDate",
                name: Resources["docDate"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,
            },
            {
                key: "description",
                name: Resources["description"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,
                filterable: true,
            },
            {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,
                filterable: true,

            },
            {
                key: "expenseValue",
                name: Resources["hours"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,

            },
            {
                key: "approvalStatusName",
                name: Resources["status"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,

            },
            {
                key: "comment",
                name: Resources["comment"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,

            }
        ];

        this.state = {
            startDate: moment(),
            finishDate: moment(),
            Projects: [],
            projectId: '',
            columns: columnsGrid,
            isLoading: true,
            rows: [],
            isCustom: true,
            btnisLoading: false,
            isLoadingsendRequest: false,
            statusClassSuccess: "disNone",
            isLoadingFirst: true,
            Loading: false,
            pageSize: 50,
            pageNumber: 0,
            totalRows: 0,
        };
    }

    GetNextData = () => {
        let pageNumber = this.state.pageNumber + 1;
        this.setState({
            isLoading: true,
            pageNumber: pageNumber
        });
        if (this.state.projectId) {
            Api.post('GetTimeSheetByRange', { projectId: this.state.projectId, startDate: this.state.startDate, finishDate: this.state.finishDate, pageNumber: this.state.pageNumber, pageSize: this.state.pageSize }).then(result => {
                let oldRows = this.state.rows;
                const newRows = [...oldRows, ...result];

                this.setState({
                    rows: newRows,
                    totalRows: newRows.length,
                    isLoading: false
                });
            }).catch(ex => {
                let oldRows = this.state.rows;
                this.setState({
                    rows: oldRows,
                    isLoading: false
                });
            });
        }
        else {
            Api.post('GetTimeSheetByRange', { startDate: this.state.startDate, finishDate: this.state.finishDate, pageNumber: this.state.pageNumber, pageSize: this.state.pageSize }).then(result => {
                let oldRows = this.state.rows;
                const newRows = [...oldRows, ...result];

                this.setState({
                    rows: newRows,
                    totalRows: newRows.length,
                    isLoading: false
                });
            }).catch(ex => {
                let oldRows = this.state.rows;
                this.setState({
                    rows: oldRows,
                    isLoading: false
                });
            });
        }

    }

    hideFilter(value) {
        this.setState({ viewfilter: !this.state.viewfilter });

        return this.state.viewfilter;
    }

    isCustomHandlel() {
        this.setState({ isCustom: !this.state.isCustom });
    }

    componentDidMount = () => {
        this.GetData("GetAccountsProjectsByIdForList", 'projectName', 'projectId', 'Projects');
    }

    ProjectshandleChange = (e) => {
        this.setState({
            projectId: e.value,
        })
    }

    startDatehandleChange = (date) => {
        this.setState({ startDate: date });
    }

    finishDatehandleChange = (date) => {
        this.setState({ finishDate: date });
    }

    ViewReport = () => {
        if (this.state.projectId) {
            this.setState({ btnisLoading: true, Loading: true })
            setTimeout(() => {
                Api.post('GetTimeSheetByRange', { projectId: this.state.projectId, startDate: this.state.startDate, finishDate: this.state.finishDate, pageNumber: this.state.pageNumber, pageSize: this.state.pageSize }).then(
                    result => {
                        this.setState({
                            rows: result,
                            isLoading: false,
                            btnisLoading: false,
                            Loading: false,
                            totalRows: result.length
                        })
                    },
                );
            }, 100); this.setState({ isLoading: true, })
        }

        else {
            this.setState({ btnisLoading: true, Loading: true })
            setTimeout(() => {
                Api.post('GetTimeSheetByRange', { startDate: this.state.startDate, finishDate: this.state.finishDate, pageNumber: this.state.pageNumber, pageSize: this.state.pageSize }).then(
                    result => {
                        this.setState({
                            rows: result,
                            isLoading: false,
                            btnisLoading: false,
                            Loading: false,
                            totalRows: result.length
                        });
                    },
                );
            }, 100);
            this.setState({
                isLoading: true
            })
        }
    }

    sendRequest = () => {
        this.setState({ isLoadingsendRequest: true, statusClassSuccess: "disNone" })
        setTimeout(() => {
            Api.post('GetTimeSheetByRangePending', { projectId: this.state.projectId, startDate: this.state.startDate, finishDate: this.state.finishDate, pageNumber: 0, pageSize: 200 }).then(
                this.setState({ isLoadingsendRequest: false, statusClassSuccess: "animationBlock" }))
        }, 200);

        this.setState({ statusClassSuccess: "disNone" })
    }

    render() {
        ;
            const btnExport= this.state.isLoading === false ? 
            <Export rows={ this.state.isLoading === false ?  this.state.rows : [] }  columns={this.state.columns} fileName= {Resources['timesheet'][currentLanguage]} /> 
            : null ;

        return (
            <div className="resetPassword">

                <NotifiMsg statusClass={this.state.statusClassSuccess} IsSuccess="true" Msg={Resources['successAlert'][currentLanguage]} />

                <div className="dropWrapper">

                    <Dropdown title='Projects'
                        data={this.state.Projects} handleChange={this.ProjectshandleChange}
                        placeholder='Projects' />

                    <div>
                        {btnExport}
                    </div>

                    {this.state.isLoadingsendRequest === false ?

                        <button className="primaryBtn-1 btn" onClick={this.sendRequest} >
                            {Resources['sendRequest'][currentLanguage]}</button>
                        : <button className="primaryBtn-1 btn largeBtn"   >
                            <div className="spinner">
                                <div className="bounce1" />
                                <div className="bounce2" />
                                <div className="bounce3" />
                            </div>
                        </button>
                    }

                    <DatePicker title='startDate'
                        startDate={this.state.startDate}
                        handleChange={this.startDatehandleChange} />

                    <DatePicker title='finishDate'

                        startDate={this.state.finishDate}
                        handleChange={this.finishDatehandleChange} />

                    <div className="dropBtn">
                        {this.state.btnisLoading === false ? (
                            <button className="primaryBtn-1 btn" onClick={this.ViewReport}>
                                {Resources['View'][currentLanguage]}</button>
                        ) : (
                                <button className="primaryBtn-1 btn largeBtn" >
                                    <div className="spinner">
                                        <div className="bounce1" />
                                        <div className="bounce2" />
                                        <div className="bounce3" />
                                    </div>
                                </button>
                            )}
                    </div>
                </div>

                <div className="mainContainer">
                    <div className="submittalFilter">
                        <div className="subFilter">
                            <h3 className="zero"> {Resources['timeSheet'][currentLanguage]}</h3>
                            <span>{this.state.rows.length}</span>
                            <span>
                                <svg
                                    width="16px"
                                    height="18px"
                                    viewBox="0 0 16 18"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink" >
                                    <g id="Symbols"
                                        stroke="none"
                                        strokeWidth="1"
                                        fill="none"
                                        fillRule="evenodd" >
                                        <g id="Action-icons/Filters/Hide+text/24px/Grey_Base"
                                            transform="translate(-4.000000, -3.000000)" >
                                        </g>
                                    </g>
                                </svg>
                            </span>
                        </div>


                        <div className="rowsPaginations">
                            <div className="rowsPagiRange">
                                <span>0</span> - <span>{this.state.pageSize}</span> of
              <span>{this.state.totalRows}</span>
                            </div>
                            <button className="rowunActive">
                                <i className="angle left icon" />
                            </button>
                            <button onClick={() => this.GetNextData()}>
                                <i className="angle right icon" />
                            </button>
                        </div>
                    </div>

                    {this.state.Loading ? <LoadingSection /> : null}
                    {this.state.isLoading == false
                        ? <GridSetup columns={this.state.columns} rows={this.state.rows} showCheckbox={false} />
                        : <div className={this.state.isLoading == false ? "disNone" : ""}> <GridSetup columns={this.state.columns} showCheckbox={false} /></div>}

                </div>

            </div>
        )
    }

    GetData = (url, label, value, currState) => {
        let Data = []
        Api.get(url).then(result => {
            (result).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];
                Data.push(obj);
            });
            this.setState({
                [currState]: [...Data]
            });
        }).catch(ex => {
        });

    }


}