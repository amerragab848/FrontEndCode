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
import AddNewContact from './AddEditContact'
import { connect } from 'react-redux'
import * as AdminstrationActions from '../../../store/actions/Adminstration'
import { SkyLightStateless } from 'react-skylight';
import { toast } from "react-toastify";
import { bindActionCreators } from 'redux';
import DropdownMelcous from "../../OptionsPanels/DropdownMelcous";
import Dataservice from "../../../Dataservice";
const _ = require('lodash')

let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class Index extends Component {
    constructor(props) {
        super(props);
        //check for permission or not 
        if (!Config.IsAllow(14)) {
            this.props.actions.routeToTabIndex(1)
            this.props.history.push({ pathname: '/TemplatesSettings' })
            toast.warning("you don't have permission");
        }

        this.columnsGrid = [

            {
                key: 'customBtn1',
                width: 50
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
        this.Actions = [
            {
                icon: "fa fa-pencil",
                actions: [
                    {
                        text: "Change Company",
                        callback: () => {
                            this.setState({
                                showTransferpopUp: true,
                                transferCompany: this.props.Adminstration.companyList[0].value
                            });
                        }
                    },
                    {
                        text: "Key Contact",
                        callback: () => {
                            this.changeKeyContact(this.state.selectedContact)
                        }
                    }
                ]
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
            Isallow: Config.IsAllow(14),
            isLoading: true,
            rows: this.props.Adminstration.companyContact,
            ProjectCompanies: [],
            AccountsDefaultList: [],
            titleData: [],
            totalRows: this.props.Adminstration.companyContact.length,
            pageSize: 50,
            pageNumber: 0,
            pageTitle: Resources['contacts'][currentLanguage],
            selectedCompany: 0,
            rowSelectedId: '',
            companyID: this.props.match.params.companyID,
            currentComponent: '',
            currentTitle: 'addContact',
            showDeleteModal: false,
            showComponent: false,
            modelNameBtn: '',
            modelMessage: '',
            modelType: '',
            selectedContact: '',
            transferCompany: '',
            showTransferpopUp: false
        }
    }

    getCellActions = (column, row) => {
        const cellActions = {
            customBtn1: this.Actions
        };
        return cellActions[column.key];
    }
    componentDidMount() {
        let url = 'GetCompanyContacts?companyId=' + this.state.companyID
        this.props.actions.GetCompaniesContact(url);
        let titleData = Dataservice.GetDataList('GetAccountsDefaultList?listType=contacttitle&pageNumber=0&pageSize=10000', 'title', 'id')
        this.props.actions.GetCompaniesList('GetProjectCompanies?accountOwnerId=2')        
        this.setState({ titleData: titleData })

    }
    changeKeyContact = (id) => {
        this.setState({
            selectedContact: id,
            showDeleteModal: true,
            modelNameBtn: 'yes',
            modelMessage: Resources['smartDeleteMessage'][currentLanguage].title,
            modelType: 'keyContact'
        });


    }
    changeCompany = () => {
        this.setState({ showTransferpopUp: false })
        let url = 'TransferCompanyContact?contactId=' + this.state.selectedContact + '&newCompanyId=' + this.state.transferCompany
        this.props.actions.changeCompany(url, this.state.selectedContact);
    }
    addRecord = () => {
        if (!Config.IsAllow(10)) {
            this.props.actions.TogglePopUp();
            this.setState({
                currentComponent: <AddNewContact titleData={this.state.titleData} companyID={this.state.companyID} />,
                showComponent: true
            })
        }
        else
            toast.warning("you don't have permission");
    }
    clickHandlerDeleteRowsMain = selectedRows => {
        this.setState({
            showDeleteModal: true,
            selectedRows: selectedRows,
            modelNameBtn: 'delete',
            modelMessage: Resources['smartDeleteMessage'][currentLanguage].content,
            modelType: 'delete'
        });
    };
    onCloseModal() {
        this.setState({ showDeleteModal: false });
    }
    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };
    Confirm = () => {
        this.setState({ showDeleteModal: true })
        switch (this.state.modelType) {
            case "delete":
                if (Config.IsAllow(12)) {
                    let url = 'CompanyContactDelete?id=' + this.state.selectedRows[0]
                    this.props.actions.deleteContact(url, this.state.selectedRows[0]);
                    this.setState({ showDeleteModal: false });
                }
                else {
                    toast.warning("you don't have permission");
                }
                break;
            case "keyContact":
                let url = 'MakeKeyContact?companyId=' + this.state.companyID + '&id=' + this.state.selectedContact
                this.setState({ showDeleteModal: false });
                this.props.actions.deleteContact(url);
                this.setState({ showDeleteModal: false });
            default:
                return null;
        }
    }
    onRowClick = (value, index, column) => {
        let id = value['id']
        if (column.key === 'customBtn1') {
            this.setState({ selectedContact: id })
        }
        else if (!Config.IsAllow(11)) {
            toast.warning("you don't have permission");
        }
        else if (column.key !== 'select-row') {

            this.props.actions.TogglePopUp();
            this.setState({
                currentComponent: <AddNewContact titleData={this.state.titleData} companyID={this.state.companyID} contactID={id} />,
                showComponent: true
            })
        }
    }

    render() {
        const companiesList = <React.Fragment>
            <DropdownMelcous title="CompanyName" data={this.props.Adminstration.companyList}
                value={this.props.Adminstration.companyList[0]}
                handleChange={(e) => this.setState({ transferCompany: e.value })} />
            <div className="fullWidthWrapper">
                <button
                    className="primaryBtn-1 btn mediumBtn"
                    type="submit"
                    onClick={this.changeCompany}
                >  {Resources['save'][currentLanguage]}
                </button>
            </div>
        </React.Fragment>

        const dataGrid = this.props.Adminstration.getingData === false ? (
            <GridSetup rows={this.props.Adminstration.companyContact}
                columns={this.columnsGrid}
                showCheckbox={true}
                clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                onRowClick={this.onRowClick}
                single={true}
                getCellActions={this.getCellActions}
            />
        ) : <LoadingSection />;
        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.rows} columns={this.ExportColumns} fileName={this.state.pageTitle} />
            : null;
        return (

            <div className="mainContainer">
                {this.props.Adminstration.popUp ? this.state.currentComponent : null}
                <div className="submittalFilter">
                    <div className="subFilter">
                        <h3 className="zero">{this.state.pageTitle}</h3>
                        <span>{this.props.Adminstration.companyContact.length}</span>
                    </div>
                    <div className="filterBTNS">
                        {btnExport}
                        <button className="primaryBtn-1 btn mediumBtn" onClick={this.addRecord}>{Resources['add'][currentLanguage]}</button>
                    </div>
                </div>
                <div>
                    <div className="grid-container">
                        {this.props.Adminstration.getingData === false ? dataGrid : <LoadingSection />}
                    </div>
                </div>
                <div>
                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={this.state.modelMessage}
                            closed={this.onCloseModal}
                            buttonName={this.state.modelNameBtn}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            clickHandlerContinue={this.Confirm}
                        />
                    ) : null
                    }
                </div>
                <div className="largePopup changeCompany__select" style={{ display: this.state.showTransferpopUp ? 'block' : 'none' }}>
                    <SkyLightStateless
                        onOverlayClicked={() =>
                            this.setState({ showTransferpopUp: false, selectedContact: 0, transferCompany: 0 })
                        }
                        isVisible={this.state.showTransferpopUp}
                        onCloseClicked={() => {
                            this.setState({ showTransferpopUp: false, selectedContact: 0, transferCompany: 0 })
                        }}
                    >
                        {companiesList}
                    </SkyLightStateless>
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
