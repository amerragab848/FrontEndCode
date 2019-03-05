import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Api from "../../../api";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import Export from "../../../Componants/OptionsPanels/Export";
import "../../../Styles/css/semantic.min.css";
import "../../../Styles/scss/en-us/layout.css";
import GridSetup from "../../../Pages/Communication/GridSetup";
import Resources from "../../../resources.json";
import Config from '../../../Services/Config'
import ConfirmationModal from "../../publicComponants/ConfirmationModal";
import { SkyLightStateless } from 'react-skylight';
import AddNewContact from './AddNewContact'
import { connect } from 'react-redux'
import { Add_Contact, Update_Contact, ShowPopUp_Contact, HidePopUp_Contact } from '../../../store/actions/types'
const _ = require('lodash')

let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");


class Index extends Component {
    constructor(props) {
        console.log(props)
        super(props);
        this.columnsGrid = [
            {
                formatter: <button >{Resources['changeCompany'][currentLanguage]}</button>,
                key: 'customBtn',
            },
            {
                formatter: <button>{Resources['KeyContact'][currentLanguage]}</button>,
                key: 'customBtn1',
            },

            {
                key: "address",
                name: Resources["title"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "contactName",
                name: Resources["ContactName"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "position",
                name: Resources["position"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "mobile",
                name: Resources["Mobile"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "email",
                name: Resources["email"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "enteredBy",
                name: Resources["enteredBy"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "lastModified",
                name: Resources["lastModified"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ];

        this.ExportColumns = [
            {
                key: "address",
                name: Resources["title"][currentLanguage],

            },
            {
                key: "contactName",
                name: Resources["ContactName"][currentLanguage],

            },
            {
                key: "position",
                name: Resources["position"][currentLanguage],

            },
            {
                key: "mobile",
                name: Resources["Mobile"][currentLanguage],

            },
            {
                key: "email",
                name: Resources["email"][currentLanguage],

            },
            {
                key: "enteredBy",
                name: Resources["enteredBy"][currentLanguage],

            },
            {
                key: "lastModified",
                name: Resources["lastModified"][currentLanguage],

            }
        ];

        this.state = {
            isLoading: true,
            rows: [],
            ProjectCompanies: [],
            AccountsDefaultList: [],
            titleData:[],
            totalRows: 0,
            pageSize: 50,
            pageNumber: 0,
            pageTitle: Resources['contacts'][currentLanguage],
            selectedCompany: 0,
            rowSelectedId: '',
            companyID: this.props.match.params.companyID,
            currentComponent: '',
            currentTitle: 'addContact',
            popShow: false
        }
    }
componentWillReceiveProps(){
    this.setState({ popShow: this.props.communication.showPopUp,
        rows: this.props.communication.companyContact,
        totalRows:this.props.communication.companyContact.length})
   
}
    componentDidMount() {
        if (Config.IsAllow(14)) {
            Api.get('GetCompanyContacts?companyId=' + this.state.companyID).then(result => {
             
                this.props.dispatch({ type: Update_Contact, data: result })
                this.setState({isLoading:false})
            });
            Api.get('GetProjectCompanies?accountOwnerId=2').then(result => {
                this.setState({
                    ProjectCompanies: result,
                });
            });
            Api.get('GetAccountsDefaultList?listType=contacttitle&pageNumber=0&pageSize=10000').then(result => {
                let _data = []
                result.forEach(element => {
                    _data.push({ label: element.title, value: element.id })
                });
                this.setState({titleData:_data})
                
            });
        }

    }


    cellClick = (rowID, colID) => {
        let id = this.state.rows[rowID]['id']
        if (colID == 1)
            alert("change")
        else if (colID == 2)
            alert("key")

    }
    addRecord = () => {
        if (Config.IsAllow(10)) {
            this.setState({ currentComponent: <AddNewContact titleData={this.state.titleData} companyID={this.state.companyID} /> })
            this.props.dispatch({ type: ShowPopUp_Contact })
        }
        else
            alert("not allow to add new company")
    }


    clickHandlerDeleteRowsMain = selectedRows => {
        this.setState({
            showDeleteModal: true,
            selectedRows: selectedRows
        });
    };
    onCloseModal() {
        this.setState({
            showDeleteModal: false
        });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };

    ConfirmDeleteComanies = () => {
        this.setState({ showDeleteModal: true })
        let rowsData = this.state.rows;
        if (Config.IsAllow(1258)) {
            Api.post('ProjectCompaniesDelete?id=' + this.state.selectedRows)
                .then(result => {
                    let originalRows = this.state.rows.filter(r => r.id !== this.state.selectedRows);

                    this.setState({
                        rows: originalRows,
                        totalRows: originalRows.length,
                        isLoading: false,
                        showDeleteModal: false,
                        IsActiveShow: false
                    });
                })
                .catch(ex => {
                    this.setState({
                        showDeleteModal: false,
                        IsActiveShow: false
                    })
                })
        }
        else
            alert('not allowed to delete')

    }


    render() {
        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.columnsGrid}
                    showCheckbox={true}
                    clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                    cellClick={this.cellClick}
                    single={true}
                />
            ) : <LoadingSection />;
        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.rows} columns={this.ExportColumns} fileName={this.state.pageTitle} />
            : null;
        return (
            <div className="mainContainer">
                <div className="largePopup" style={{ display: this.state.popShow ? 'block' : 'none' }}>

                    <SkyLightStateless
                        isVisible={this.state.popShow}
                        onCloseClicked={() => {  this.props.dispatch({ type: HidePopUp_Contact })}}
                    >
                        {this.state.currentComponent}
                    </SkyLightStateless>
                </div>
                <div className="submittalFilter">
                    <div className="subFilter">
                        <h3 className="zero">{this.state.pageTitle}</h3>
                        <span>{this.state.rows.length}</span>
                    </div>

                    <div className="filterBTNS">
                        {btnExport}
                        <button className="primaryBtn-1 btn mediumBtn" onClick={this.addRecord}>NEW</button>
                    </div>
                </div>
                <div>
                    <div className="grid-container">
                        {dataGrid}
                    </div>
                </div>
                <div>
                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            clickHandlerContinue={this.clickHandlerContinueMain}
                        />
                    ) : null
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    let sState = state;
    return sState;
}

export default withRouter(connect(mapStateToProps)(Index));
