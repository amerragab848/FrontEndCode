import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import moment from "moment";
import Resources from "../../resources.json"
import LoadingSection from '../publicComponants/LoadingSection'
import Calendar from "react-calendar";
import Dropdown from '../OptionsPanels/DropdownMelcous'
import dataService from '../../Dataservice'
import CryptoJS from "crypto-js";
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";
import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux';

import * as dashboardComponantActions from '../../store/actions/communication';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let subject = "test"
let publicFonts = currentLanguage === "ar" ? 'cairo-sb' : 'Muli, sans-serif'


const filterStyle = {
    control: (styles, { isFocused }) =>
        ({
            ...styles,
            backgroundColor: '#fff',
            width: '100%',
            borderRadius: '4px',
            border: isFocused ? "solid 2px #83B4FC" : '2px solid #E9ECF0',
            boxShadow: 'none',
            transition: ' all 0.4s ease-in-out',
            minHeight: '36px'
        }),
    option: (styles, { isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            backgroundColor: isDisabled ? '#fff' : isSelected ? '#e9ecf0' : isFocused ? '#f2f6fa' : "#fff",
            color: '#3e4352',
            fontSize: '14px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            textTransform: 'capitalize',
            fontFamily: publicFonts,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            zIndex: '155'
        };
    },
    input: styles => ({ ...styles, maxWidth: '100%' }),
    placeholder: styles => ({ ...styles, color: '#A8B0BF', fontSize: '13px', width: '100%', fontFamily: publicFonts }),
    singleValue: styles => ({ ...styles, color: '#252833', fontSize: '13px', width: '100%', fontFamily: publicFonts }),
    indicatorSeparator: styles => ({ ...styles, display: 'none' }),
    menu: styles => ({ ...styles, zIndex: 155, boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.2)', border: 'solid 1px #ccd2db' }),
    multiValue: styles => ({
        ...styles, background: '#e9edf2',
        padding: '3px',
        height: '28px',
        borderRadius: '100px',
        display: 'inline-flex',
        alignItems: 'center',
        boxShadow: 'none',
        color: '#3e4352',
    }),
    multiValueLabel: styles => ({
        ...styles,
        color: '#3e4352',
        fontSize: '12px',
        fontFamily: 'Muli, sans-serif',
        fontWeight: '600',
    }),
    multiValueRemove: styles => ({
        ...styles,
        color: '#fff',
        background: '#858D9E',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        fontSize: '11px',
        fontFamily: 'Muli, sans-serif',
        fontWeight: '300',
        margin: '0 2px',
        cursor: 'pointer',
        ':hover': {
            backgroundColor: '#858D9E',
            color: 'white',
        },
    }),
};


class GlobalSearch extends Component {

    constructor(props) {
        super(props)
        const query = new URLSearchParams(this.props.location.search);
        let index = 0;
        for (let param of query.entries()) {
            if (index === 0) {
                try {
                    let obj = JSON.parse(CryptoJS.enc.Base64.parse(param[1]).toString(CryptoJS.enc.Utf8));
                    subject = obj.subject;
                }
                catch {
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.searchColumns = [
            {
                field: 'index',
                title: Resources['no'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: 'subject',
                title: Resources['subject'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'statusText',
                title: Resources['status'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'docTypeName',
                title: Resources['docName'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'docDate',
                title: Resources['docDate'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: 'projectName',
                title: Resources['projectName'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }
        ];

        this.statusData = [
            {
                label: Resources.oppened[currentLanguage], value: 1
            }, {
                label: Resources.closed[currentLanguage], value: 0
            }, {
                label: Resources.all[currentLanguage], value: null
            },

        ]

        this.state = {
            lastChunk: 0,
            subject: subject,
            searchResult: [],
            pageSize: 50,
            pageNumber: 0,
            totalRows: 200,
            isLoading: true,
            showAttachLoading: true,
            showDate: false,
            filterDate: '',//moment().format("DD/MM/YYYY"),
            selectedStatus: this.statusData[2],
            docsType: [],
            selectedDocs: [],
            attachementsSearchResult: [],
            allAttaches: [],

        }
    }

    componentWillMount() {
        var e = { label: this.props.projectName, value: this.props.projectId };
        this.props.actions.RouteToMainDashboard(e);
        let searchOptions = {
            subject: this.state.subject,
            fromDate: '',//moment().add(-1, 'Y').format('YYYY/MM/DD'),
            toDate:'',// moment().format('YYYY/MM/DD'),
            docs: [],
            readedAttachFiles: [],
            status: null,
            pageNumber: 0
        }
      
       this.setState({ isLoading: true })

        dataService.addObject("GetDataForSearchInApp?docType=19", searchOptions).then(searchResult => {
            if (searchResult) {
                this.readFiles(searchResult.attachFiles, searchOptions, false);
                let data = []
                if (searchResult.searchResp.searchList.length > 0)
                    searchResult.searchResp.searchList.forEach((item, i) => {
                        item.index = i + 1;
                        data.push(item)
                    })
                this.setState({ allAttaches: searchResult.attachFiles, searchResult: data, totalRows: searchResult.searchResp.total, isLoading: false })
            }
            else
                this.setState({ allAttaches: [], searchResult: [], totalRows: searchResult.searchResp.total })

            dataService.GetDataList("GetAccountsDocTypeForDrop", "docType", "refCode").then(result => {
                this.setState({ isLoading: false, showAttachLoading: false, docsType: result })
            })
        })
    }

    async readFiles(files, searchOptions, firstOrNext) {

        let attachList = this.state.attachementsSearchResult;
        let i = 0;
        let j = 0;
        let temparray = [];
        let chunk = 10;
        let resultLength = 0;
        let newLit = firstOrNext == false ? [] : attachList;
        let maxIterate = files.length

        for (i = firstOrNext == true ? this.state.lastChunk : 0, j = maxIterate; i < j; i += chunk) {
            let lastChunk = i + chunk;
            temparray = files.slice(i, lastChunk);

            this.setState({ showAttachLoading: true })

            await dataService.GetAttachesPost(temparray, searchOptions).then(result => {
                resultLength = result ? result.length : 0;

                newLit.push.apply(newLit, result)

                this.setState({ showAttachLoading: false, attachementsSearchResult: result ? newLit : attachList, lastChunk })
            });

            if (resultLength > 0) { break; }
        }
    }

    GetNextAttachFiles() {

        let fromDate = '';
        let toDate = '';

        if (this.state.filterDate.split("-")[0] === this.state.filterDate) {
            fromDate = moment().add(-1, 'Y').format('YYYY/MM/DD')
            toDate = moment().format('YYYY/MM/DD')
        }
        else {
            fromDate = moment(this.state.filterDate.split("-")[0]).format('YYYY/MM/DD');
            toDate = moment(this.state.filterDate.split("-")[1]).format('YYYY/MM/DD');
        }

        let searchOptions = {
            subject: this.state.subject,
            fromDate: fromDate,
            toDate: toDate,
            docs: [],
            status: this.state.selectedStatus.value,
            pageNumber: 0
        }

        this.readFiles(this.state.allAttaches, searchOptions, true);
    }

    changeDate() {
        let showDate = !this.state.showDate
        this.setState({ showDate });
    }

    resetDate = () => {
        this.setState({ showDate: false });
    }

    onChange = (date) => {
        let filterDate = date != null ? moment(date[0]).format("YYYY/MM/DD") + " - " + moment(date[1]).format("YYYY/MM/DD") : "";
        this.setState({ filterDate, showDate: false });
    };

    search = (flag) => {

        let docs = []
        this.state.selectedDocs.forEach(item => {
            docs.push(item.value)
        })

        let fromDate = '';
        let toDate = '';
        let pageNumber = this.state.pageNumber

        if (flag !== 0)
            pageNumber = this.state.pageNumber + flag
        else
            pageNumber = 0
        this.setState({ pageNumber })

        if (this.state.filterDate.split("-")[0] === this.state.filterDate) {
            fromDate = moment().add(-1, 'Y').format('YYYY/MM/DD')
            toDate = moment().format('YYYY/MM/DD')
        }
        else {
            fromDate = moment(this.state.filterDate.split("-")[0]).format('YYYY/MM/DD');
            toDate = moment(this.state.filterDate.split("-")[1]).format('YYYY/MM/DD');
        }

        let searchOptions = {
            subject: this.state.subject,
            fromDate: fromDate,
            toDate: toDate,
            docs: docs,
            status: this.state.selectedStatus.value,
            pageNumber: pageNumber
        }

        this.setState({ isLoading: true })

        dataService.addObject("GetDataForSearchInApp", searchOptions).then(searchResult => {
            if (searchResult) {
                this.readFiles(this.state.allAttaches, searchOptions, false);

                let data = []
                if (searchResult.searchResp.searchList.length > 0)
                    searchResult.searchResp.searchList.forEach((item, i) => {
                        item.index = i + 1;
                        data.push(item)
                    })
                this.setState({ searchResult: data, isLoading: false, totalRows: searchResult.searchResp.total })
            }
            else
                this.setState({ searchResult: [], isLoading: false, totalRows: searchResult.searchResp.total })
        })

    }
    cellClick = (rowData) => {
        if (rowData) {
            let obj = {
                docId: rowData.docId,
                projectId: rowData.projectId,
                projectName: rowData.projectName,
                arrange: 0,
                docApprovalId: 0,
                isApproveMode: false,
                perviousRoute: window.location.pathname + window.location.search
            };

            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

            this.props.history.push({
                pathname: rowData.docLink,
                search: "?id=" + encodedPaylod
            });
        }
    }

    render() {
        let ViewAttachmentsResult = () => {
            return (
                <div className="doc-pre-cycle letterFullWidth">
                    <div className='document-fields'>
                        <ul className="ul__deleteHover">
                            <li className="title">
                                <h4 className="zero">{Resources['fileName'][currentLanguage]}</h4>
                            </li>
                            {this.state.attachementsSearchResult.map(item => (
                                <li key={item.id}>
                                    <div className="contentCell tableCell-4">
                                        <a
                                            href={item["attachFile"]}
                                            className="pdfPopup various zero"
                                            data-toggle="tooltip"
                                            title={item["fileName"]}>
                                            {item.fileNameDisplay}
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
        };
        const searchGrid = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                key="searchGrid"
                data={this.state.searchResult}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.searchColumns}
                rowClick={(cell) => { this.cellClick(cell) }}
            />
        ) : <LoadingSection />;

        return (<div className="main__withouttabs mainContainer" >
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <h3 className="zero">Search Result</h3>
                        <span>{this.state.totalRows}</span>
                    </div>

                    <div className="rowsPaginations readOnly__disabled">
                        <div className="rowsPagiRange">
                            <span>{this.state.pageSize * this.state.pageNumber + 1}</span> -{" "}
                            <span>
                                {this.state.pageSize * this.state.pageNumber +
                                    this.state.pageSize}
                            </span>{" "}
                            of
                            <span> {this.state.totalRows}</span>
                        </div>
                        <button
                            className={this.state.pageNumber === 0 ? "rowunActive" : ""} onClick={() => this.state.pageNumber != 0 ? this.search(-1) : null} >
                            <i className="angle left icon" />
                        </button>
                        <button className={this.state.totalRows > this.state.pageSize * this.state.pageNumber + this.state.pageSize ? "" : "rowunActive"}
                            onClick={() => this.state.totalRows > this.state.pageSize * this.state.pageNumber + this.state.pageSize ? this.search(1) : null}>
                            <i className="angle right icon" />
                        </button>
                    </div>
                </div>

                <div className="filter__warrper" style={{ paddingRight: "16px", paddingLeft: "24px" }}>

                    <div className="filter__input-wrapper" >
                        <div id="signupForm1" className="proForm" >
                            <div className="letterFullWidth multiDrop">
                                <div className="form-group linebylineInput  multiChoice" style={{ maxWidth: '660px', marginBottom: '16px' }}>
                                    <label className="control-label"> {Resources.docType[currentLanguage]}   </label>
                                    <Dropdown
                                        data={this.state.docsType}
                                        isMulti={true}
                                        closeMenuOnSelect={false}
                                        selectedValue={this.state.selectedDocs}
                                        handleChange={event => this.setState({ selectedDocs: event })}
                                        name="docType" styles={filterStyle} />
                                </div>
                            </div>
                            <div className="form-group linebylineInput medium__input--width">
                                <label className="control-label"> {Resources.subject[currentLanguage]}   </label>
                                <div className="ui input inputDev" style={{ position: "relative", display: "inline-block" }} >
                                    <input type="text" autoComplete="off" placeholder="Subject" defaultValue={this.state.subject} onChange={(event) => this.setState({ subject: event.target.value })} />
                                </div>
                            </div>
                            <div className={"form-group linebylineInput medium__input--width "}  >
                                <label className="control-label" >
                                    {Resources.docDate[currentLanguage]}
                                </label>
                                <div className="ui input inputDev" style={{ position: "relative", display: "inline-block" }} onMouseLeave={this.resetDate} >
                                    <input type="text" autoComplete="off" placeholder={Resources.docDate[currentLanguage]} value={this.state.filterDate}
                                        onClick={() => this.changeDate()} />
                                    {this.state.showDate ?
                                        <div className="viewCalender"   >
                                            <Calendar onChange={date => this.onChange(date)} selectRange={true} />
                                        </div> :
                                        null}
                                </div>
                            </div>
                            <div className="form-group linebylineInput medium__input--width">
                                <label className="control-label"> {Resources.status[currentLanguage]}   </label>
                                <Dropdown
                                    data={this.statusData}
                                    isMulti={false}
                                    selectedValue={this.state.selectedStatus}
                                    handleChange={event => this.setState({ selectedStatus: event })}
                                    name="status" styles={filterStyle} />
                            </div>
                            <button className="defaultBtn btn" onClick={() => this.search(0)} type="button">Search</button>
                        </div>
                    </div>
                </div>
                {searchGrid}
                              
                {this.state.showAttachLoading === false ? ( 

                <div className="dropWrapper">
                    {ViewAttachmentsResult()}
                </div>
              ) : <LoadingSection />}  

                <div className="rowsPaginations readOnly__disabled" style={{ justifyContent: "center" }}>
                    <button className="rowActive" onClick={() => this.GetNextAttachFiles()}>
                        <i className="angle right icon" />
                    </button>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        showLeftMenu: state.communication.showLeftMenu,
        showSelectProject: state.communication.showSelectProject
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(dashboardComponantActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(GlobalSearch));