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
import AddNewContact from './AddNewContact'
import { connect } from 'react-redux'
import { ShowPopUp_Contact, HidePopUp_Contact, ShowNotifyMessage } from '../../../store/actions/types'
import * as AdminstrationActions from '../../../store/actions/Adminstration'
import NotifiMsg from '../../publicComponants/NotifiMsg'

import {
    bindActionCreators
} from 'redux';
const _ = require('lodash')

let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");


class Index extends Component {
    constructor(props) {
        super(props);
        this.columnsGrid = [
            {
                formatter: <button className="primary-1 btn smallBtn">{Resources['changeCompany'][currentLanguage]}</button>,
                key: 'customBtn',
            },
            {
                formatter: <button className="primaryBtn-1 btn smallBtn">{Resources['KeyContact'][currentLanguage]}</button>,
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
            rows: this.props.companies.companyContact,
            ProjectCompanies: [],
            AccountsDefaultList: [],
            titleData: [],
            totalRows: this.props.companies.companyContact.length,
            pageSize: 50,
            pageNumber: 0,
            pageTitle: Resources['contacts'][currentLanguage],
            selectedCompany: 0,
            rowSelectedId: '',
            companyID: this.props.match.params.companyID,
            currentComponent: '',
            currentTitle: 'addContact',
            showDeleteModal: false,
            showComponent:false
        }
    }
    componentWillReceiveProps(nextProps, prevProps) {
        console.log(this.props)
        //   if(this.state.showNotify!=this.props.companies.notifyMessage)
        //   {

        //     alert("not")
        //     //   this.setState({
        //     //     showNotify:this.props.companies.notifyMessage
        //     //   })
        //   }
    }


    componentDidMount() {
        if (Config.IsAllow(14)) {
            let url = 'GetCompanyContacts?companyId=' + this.state.companyID
            this.props.actions.GetCompaniesContact(url);
            Api.get('GetProjectCompanies?accountOwnerId=2').then(result => {
                this.setState({ ProjectCompanies: result });
            });
            Api.get('GetAccountsDefaultList?listType=contacttitle&pageNumber=0&pageSize=10000').then(result => {
                let _data = []
                result.forEach(element => {
                    _data.push({ label: element.title, value: element.id })
                });
                this.setState({ titleData: _data })

            });
        }
    }

    cellClick = (rowID, colID) => {
        let id = this.props.companies.companyContact[rowID]['id']
        if (colID == 1)
            alert("change")
        else if (colID == 2)
            alert("key")

    }
    addRecord = () => {
        if (Config.IsAllow(10)) {
            this.setState({ currentComponent: <AddNewContact titleData={this.state.titleData} companyID={this.state.companyID} /> ,showComponent: true })
             this.props.actions.TogglePopUp();
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
        this.setState({ showDeleteModal: false });

    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });

    };


    ConfirmDeleteComanies = () => {
        this.setState({ showDeleteModal: true })
        if (Config.IsAllow(12)) {
            let url = 'CompanyContactDelete?id=' + this.state.selectedRows[0]
            this.props.actions.deleteContact(url, this.state.selectedRows[0]);
            this.setState({ showDeleteModal: false });
        }
        else
            alert('not allowed to delete')

    }

    render() {
        const dataGrid = this.props.companies.getingData === false ? (
            <GridSetup rows={this.props.companies.companyContact} columns={this.columnsGrid}
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
               {this.props.companies.notifyMessage ?
                    <NotifiMsg showNotify={this.props.companies.notifyMessage} IsSuccess={true} Msg={Resources['smartSentAccountingMessage'][currentLanguage].successTitle} />
                    : null}
                
             {this.state.showComponent?this.state.currentComponent:null}

                <div className="submittalFilter">
                    <div className="subFilter">
                        <h3 className="zero">{this.state.pageTitle}</h3>
                        <span>{this.props.companies.companyContact.length}</span>
                    </div>

                    <div className="filterBTNS">
                        {btnExport}
                        <button className="primaryBtn-1 btn mediumBtn" onClick={this.addRecord}>NEW</button>
                    </div>
                </div>
                <div>
                    <div className="grid-container">
                        {this.props.companies.getingData === false ? dataGrid : <LoadingSection />}
                    </div>
                </div>
                <div>
                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={Resources['smartDeleteMessage'][currentLanguage].content}
                            closed={this.onCloseModal}
                            buttonName='delete'
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            clickHandlerContinue={this.ConfirmDeleteComanies}
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
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AdminstrationActions, dispatch)
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));
