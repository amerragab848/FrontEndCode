import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import NotifiMsg from '../publicComponants/NotifiMsg';
import Api from '../../api'
import Dropdown from "../OptionsPanels/DropdownMelcous";
import Resources from '../../resources.json';
import DatePicker from '../OptionsPanels/DatePicker'
import moment from 'moment';
import GridSetup from "../../Pages/Communication/GridSetup";
import Export from "../../Componants/OptionsPanels/Export";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};


 class OverTime extends Component {
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
                formatter: dateFormate
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
                key: "totalHours",
                name: Resources["overtimeHours"][currentLanguage],
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
            btnisLoading: false,
            statusClassSuccess: "disNone",
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
            Api.post('GetOverTimeByRange', { projectId: this.state.projectId, startDate: this.state.startDate, finishDate: this.state.finishDate, pageNumber: this.state.pageNumber, pageSize: this.state.pageSize }).then(result => {
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
            Api.post('GetOverTimeByRange', { startDate: this.state.startDate, finishDate: this.state.finishDate, pageNumber: this.state.pageNumber, pageSize: this.state.pageSize }).then(result => {
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

    addRecord() {
        this.props.history.push({
            pathname: 'AddOverTime'
        })
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

        let sdate= moment( this.state.startDate,"DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SS");
        let fdate= moment( this.state.finishDate,"DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SS");

        if (this.state.projectId) {
            this.setState({ btnisLoading: true, Loading: true })
            Api.post('GetOverTimeByRange', { projectId: this.state.projectId, startDate: sdate, finishDate: fdate, pageNumber: this.state.pageNumber, pageSize: this.state.pageSize }).then(
                result => {
                    this.setState({
                        rows: result,
                        isLoading: false,
                        btnisLoading: false,
                        Loading: false,
                        totalRows: result.length
                    })
                }, this.setState({ isLoading: true })
            );
        }

        else {
            this.setState({ btnisLoading: true, Loading: true })
            Api.post('GetOverTimeByRange', { startDate:sdate, finishDate: fdate, pageNumber: this.state.pageNumber, pageSize: this.state.pageSize }).then(
                result => {
                    this.setState({
                        rows: result,
                        isLoading: false,
                        btnisLoading: false,
                        Loading: false,
                        totalRows: result.length
                    });
                }, this.setState({ isLoading: true })
            );
        }
    }

    render() {

        const btnExport =
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={Resources['overtime'][currentLanguage]} />


        return (

            <div className="mainContainer">
                <div className="resetPassword">
                    <NotifiMsg statusClass={this.state.statusClassSuccess} IsSuccess="true" Msg={Resources['successAlert'][currentLanguage]} />

                    <div className="submittalFilter">
                        <div className="subFilter">
                            <h3 className="zero"> {Resources['overtime'][currentLanguage]}</h3>
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
                   
                        <div className="filterBTNS">

                            <button className="primaryBtn-1 btn mediumBtn" onClick={() => this.addRecord()}>New</button>
                            {btnExport}
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

                    <div className="gridfillter-container">
                        <div className="fillter-status-container">
                            <div className="form-group fillterinput fillter-item-c">
                                <Dropdown title='Projects' data={this.state.Projects}
                                    handleChange={this.ProjectshandleChange} placeholder='Projects' />
                            </div>
                            <div className="form-group fillterinput fillter-item-c" >
                                <DatePicker title='startDate' startDate={this.state.startDate}
                                    handleChange={this.startDatehandleChange} />
                            </div>
                            <div className="form-group fillterinput fillter-item-c" >

                                <DatePicker title='finishDate' startDate={this.state.finishDate}
                                    handleChange={this.finishDatehandleChange} />
                            </div>
                            <div className="dropBtn">
                                {this.state.btnisLoading === false ? (
                                    <button className="primaryBtn-1 btn smallBtn" onClick={this.ViewReport}>
                                        {Resources['View'][currentLanguage]}</button>
                                ) : (
                                        <button className="primaryBtn-1 btn smallBtn" >
                                            <div className="spinner">
                                                <div className="bounce1" />
                                                <div className="bounce2" />
                                                <div className="bounce3" />
                                            </div>
                                        </button>
                                    )}
                            </div>
                        </div>
                    </div>

                    <div className="sayedWrapper">
                        {this.state.Loading ? <LoadingSection /> : null}
                        {this.state.isLoading == false

                            ? <GridSetup columns={this.state.columns} rows={this.state.rows} showCheckbox={false} />

                            : <div className={this.state.isLoading == false ? "disNone" : ""}> <GridSetup columns={this.state.columns} showCheckbox={false} /></div>}
                    </div>
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
export default withRouter(OverTime)