import React, { Component } from 'react'
import GridSetup from "../../Pages/Communication/GridSetup";
import { withRouter } from "react-router-dom";
import moment from "moment";
import Api from '../../api';
import Resources from "../../resources.json"
import LoadingSection from '../publicComponants/LoadingSection'
import Calendar from "react-calendar";
import Dropdown from '../OptionsPanels/DropdownMelcous'
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let subject = "test"
let formatDate = function (date) {
    if (date != null)
        return moment(date).format("DD/MM/YYYY");
    return "No Date"
}
// let formatStatus=function(status){
//     if(status==null)
//     return "Pending"
// }

class GlobalSearch extends Component {
    constructor(props) {
        super(props)
        //     const query = new URLSearchParams(this.props.location.search);
        //     let index = 0;
        //     for (let param of query.entries()) {
        //         if (index == 0) {
        //             try {
        //                 let obj = JSON.parse(CryptoJS.enc.Base64.parse(param[1]).toString(CryptoJS.enc.Utf8));
        //                 subject = obj.subject; 
        //             }
        //             catch{
        //                 this.props.history.goBack();
        //             }
        //         }
        //         index++;
        //     }
        this.searchColumns = [
            {
                key: "index",
                name: Resources["no"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true

            }, {
                key: "subject",
                name: Resources["subject"][currentLanguage],
                width: 300,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "statusText",
                name: Resources["status"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: false,
                sortDescendingFirst: true,
                //  formatter:formatStatus
            }, {
                key: "docDate",
                name: Resources["docDate"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: formatDate
            }, {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }
        ];
        this.statusData = [
            {
                label: Resources.oppened[currentLanguage], value: 1
            }, {
                label: Resources.closed[currentLanguage], value: 1
            }, {
                label: Resources.all[currentLanguage], value: 1
            },

        ]

        this.state = {
            subject: subject,
            searchResult: [],
            isLoading: true,
            showDate: false,
            filterDate: moment().format("DD/MM/YYYY"), 
            selectedStatus: this.statusData[2]
        }


    
    }
    componentWillMount() {
        let searchOptions = {
            subject: this.state.subject,
            fromDate: moment().add(-15, 'Y').format('YYYY/MM/DD'),
            toDate: moment().format('YYYY/MM/DD'),
            docs: [],
            status: null,
            pageNumber: 0
        }
        Api.post("GetDataForSearchInApp", searchOptions).then(searchResult => {
            if (searchResult) {
                let data = []
                if (searchResult.length > 0)
                    searchResult.forEach((item, i) => {
                        item.index = i + 1;
                        data.push(item)
                    })
                this.setState({ isLoading: false, searchResult: data })
            }
            else
                this.setState({ isLoading: false, searchResult: [] })
        })
    }
    changeDate() {
        let showDate = !this.state.showDate
        this.setState({ showDate });
    }

    resetDate = () => {
        this.setState({ showDate: false });
    }
    onChange = (date) => {
        let filterDate = date != null ? moment(date[0]).format("DD/MM/YYYY") + "-" + moment(date[1]).format("DD/MM/YYYY") : "";
        this.setState({ filterDate, showDate: false });
    };
    render() {
        const searchGrid = this.state.isLoading === false ? (
            <GridSetup
                rows={this.state.searchResult}
                showCheckbox={false}
                pageSize={this.state.pageSize}
                columns={this.searchColumns}
                key='searchGrid'
            />) : <LoadingSection />;

        return (
            <div className="main__withouttabs mainContainer">
                <div className="doc-pre-cycle">
                    <header className="doc-pre-btn">
                        <h2 className="zero">{Resources.subContractsList[currentLanguage]}</h2>
                    </header>
                    <div className="filter__warrper" style={{ paddingRight: "16px", paddingLeft: "24px" }}>
                        <div className="filter__more" style={{ padding: 0 }}>
                            <span>5 filters applied</span>
                        </div>
                        <div className="filter__input-wrapper" onMouseLeave={this.resetDate}>
                            <form id="signupForm1" method="post" className="proForm" action="" noValidate="noValidate">
                                {/* "small__input--width " */}
                                <div className="form-group linebylineInput medium__input--width">
                                    <label className="control-label"> {Resources.subject[currentLanguage]}   </label>
                                    <div className="ui input inputDev" style={{ position: "relative", display: "inline-block" }} >
                                        <input type="text" autoComplete="off" placeholder="Subject" />
                                    </div>
                                </div>
                                <div className={"form-group linebylineInput medium__input--width "}  >
                                    <label className="control-label" >
                                        {Resources.docDate[currentLanguage]}
                                    </label>
                                    <div className="ui input inputDev" style={{ position: "relative", display: "inline-block" }}  >
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
                                            name="status" />
                                </div>
                                <div className="form-group linebylineInput medium__input--width">
                                    <label className="control-label"> {Resources.docType[currentLanguage]}   </label>
                                        <Dropdown
                                            data={this.state.docTypeData}
                                            isMulti={false}
                                            selectedValue={this.state.docType}
                                            handleChange={event => this.setState({ docType: event })}
                                            name="docType" />
                                </div> 
                                <button className="defaultBtn btn">Search</button>
                            </form>
                        </div>
                    </div>
                    {searchGrid}
                </div>
            </div>
        );
    }
}
export default withRouter(GlobalSearch);