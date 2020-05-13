import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import NotifiMsg from '../publicComponants/NotifiMsg';
import Api from '../../api'
import Dropdown from "../OptionsPanels/DropdownMelcous";
import Resources from '../../resources.json';
import DatePicker from '../OptionsPanels/DatePicker'
import moment from 'moment';
import Export from "../OptionsPanels/Export";
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";


let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
 class OverTime extends Component {
    constructor(props) {
        super(props)
 const columnsGrid = [
            {
                field: 'docDate',
                title: Resources['docDate'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "date",
                sortable: true,
            },
            {
                field: 'description',
                title: Resources['description'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'projectName',
                title: Resources['projectName'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'totalHours',
                title: Resources['overtimeHours'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "number",
                sortable: true,
            },
            {
                field: 'approvalStatusName',
                title: Resources['status'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'comment',
                title: Resources['comment'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
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

                    <div className="submittalFilter readOnly__disabled">
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


                         <div className="rowsPaginations readOnly__disabled">
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

                    <div className="overTimeWrapper">
                        {this.state.Loading ? <LoadingSection /> : null}
                        {this.state.isLoading == false

                            ? 
                            <GridCustom
                            ref='custom-data-grid'
                            key="OverTime"
                            data={this.state.rows}
                            pageSize={this.state.rows.length}
                            groups={[]}
                            actions={[]}
                            rowActions={[]}
                            cells={this.state.columns}
                            rowClick={() => {  }}
                        />
                            : <div className={this.state.isLoading == false ? "disNone" : ""}> 
                            <GridCustom
                            ref='custom-data-grid'
                            key="OverTime"
                            data={[]}
                            pageSize={0}
                            groups={[]}
                            actions={[]}
                            rowActions={[]}
                            cells={this.state.columns}
                            rowClick={() => {  }}
                        />
                            </div>}
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