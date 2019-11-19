import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Api from "../../../api";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import Export from "../../OptionsPanels/Export";
import Filter from "../../FilterComponent/filterComponent";
import GridSetup from "../../../Pages/Communication/GridSetup";
import Resources from "../../../resources.json";
import Config from '../../../Services/Config'
import ConfirmationModal from "../../publicComponants/ConfirmationModal";
import { toast } from "react-toastify";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const filtersColumns = [
    {
        field: "companyName",
        name: "CompanyName",
        type: "string"
    },
    {
        field: "roleTitle",
        name: "companyRole",
        type: "string"
    },
    {
        field: "disciplineTitle",
        name: "disciplineTitle",
        type: "string"
    },
    {
        field: "keyContactName",
        name: "keyContact",
        type: "string"
    }
];

class Index extends Component {
    constructor(props) {
        super(props);
        this.ExportColumns = [

            {
                key: "companyName",
                name: Resources["CompanyName"][currentLanguage]
            },
            {
                key: "roleTitle",
                name: Resources["companyRole"][currentLanguage]
            },
            {
                key: "disciplineTitle",
                name: Resources["disciplineTitle"][currentLanguage]
            },
            {
                key: "keyContactName",
                name: Resources["KeyContact"][currentLanguage],
                width: 100
            },
            {
                key: "location",
                name: Resources["location"][currentLanguage]
            },
            {
                key: "contactsTel",
                name: Resources["Telephone"][currentLanguage]
            },
            {
                key: "contactsMobile",
                name: Resources["Mobile"][currentLanguage]
            },
            {
                key: "contactsFax",
                name: Resources["Fax"][currentLanguage],
                width: 100
            },
            {
                key: "grade",
                name: Resources["Grade"][currentLanguage]
            },
            {
                key: "enteredBy",
                name: Resources["enteredBy"][currentLanguage]
            },
            {
                key: "lastModified",
                name: Resources["lastModified"][currentLanguage]
            }
        ];

        const columnsGrid = [
            {
                formatter: this.customButton,
                key: 'customBtn',
                width: 80
            },
            {
                key: "id",
                visible: false,
                width: 20,
                frozen: true
            },
            {
                key: "companyName",
                name: Resources["CompanyName"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "roleTitle",
                name: Resources["companyRole"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "disciplineTitle",
                name: Resources["disciplineTitle"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "keyContactName",
                name: Resources["KeyContact"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "location",
                name: Resources["location"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "contactsTel",
                name: Resources["Telephone"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "contactsMobile",
                name: Resources["Mobile"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "contactsFax",
                name: Resources["Fax"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "grade",
                name: Resources["Grade"][currentLanguage],
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
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ];
       
        this.state = {
            columns: columnsGrid.filter(column => column.visible !== false),
            isLoading: true,
            rows: [],
            filtersColumns: [],
            viewfilter: false,
            totalRows: 0,
            pageSize: 50,
            pageNumber: 0,
            pageTitle: Resources['Companies'][currentLanguage],
            api: 'GetProjectCompaniesGrid?',
            selectedCompany: 0,
            Previous: false,
            rowSelectedId: ''
        };
    }
    customButton = () => {
        return <button className="companies_icon" onClick={this.clickHandler} ><i className="fa fa-users"></i></button>;
    };

    componentDidMount() {
        if (Config.IsAllow(1001105)) {
            Api.get(this.state.api + "pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize).then(result => {
                this.setState({
                    rows: result,
                    isLoading: false,
                    totalRows: result.length
                });
            });
        }
        else
            toast.warning("you don't have permission");

    }

    viewContact = (rowSelected) => {
        if (Config.IsAllow(14)) {
            this.props.history.push({
                pathname: "/Contacts/" + rowSelected,
            });
        }
        else {
            toast.warning("you don't have permission");
        }
    }

    cellClick = (rowID, colID) => {
        let id = this.state.rows[rowID]['id']
        if (colID == 1)
            this.viewContact(id)
        else if (!Config.IsAllow(1257)) {
            toast.warning("you don't have permission");
        }
        else if (colID != 0) {
            this.props.history.push({
                pathname: "/AddEditCompany/" + id,
            });
        }
    }
    
    GetNextData = () => {
        let pageNumber = this.state.pageNumber + 1;
        this.setState({
            isLoading: true,
            pageNumber: pageNumber
        });
        let url = this.state.api + "pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize
        Api.get(url).then(result => {
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

    GetPreviousData = () => {
        let pageNumber = this.state.pageNumber - 1;
        if (pageNumber >= 0) {
            this.setState({
                isLoading: true,
                pageNumber: pageNumber
            });
            let url = this.state.api + "pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize
            Api.get(url).then(result => {
                let oldRows = [];
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
            });;
        }
    }

    hideFilter(value) {
        this.setState({ viewfilter: !this.state.viewfilter });
        return this.state.viewfilter;
    }

    filterMethodMain = (e, query) => {
        var stringifiedQuery = JSON.stringify(query)
        if (stringifiedQuery.includes("companyName") || stringifiedQuery.includes("roleTitle") || stringifiedQuery.includes("keyContactName")) {
            this.setState({ isLoading: true })
            let _query = stringifiedQuery.split(',"isCustom"')
            let url = 'ProjectCompaniesFilter?query=' + _query[0] + '}'
            Api.get(url).then(result => {
                this.setState({
                    rows: result,
                    isLoading: false,
                    pageNumber: 1,
                    totalRows: result.length
                });
            })
        }
        else {
            this.setState({ isLoading: true })
            Api.get(this.state.api + "pageNumber=" + 0 + "&pageSize=" + this.state.pageSize).then(result => {
                this.setState({
                    rows: result,
                    isLoading: false,
                    pageNumber: 1,
                    totalRows: result.length
                });
            });
        }
    };

    addRecord = () => {
        if (Config.IsAllow(1256))
            this.props.history.push({
                pathname: "/AddEditCompany/0",
            });
        else
            toast.warning("you don't have permission");
    }
    clickHandlerDeleteRowsMain = selectedRows => {
        this.setState({
            showDeleteModal: true,
            selectedRowId: selectedRows
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

        if (Config.IsAllow(1258)) {
            this.setState({ isLoading: true })
            let newRows = []
            let selectedRow = {}
            this.state.rows.forEach(element => {
                if (element.id == this.state.selectedRowId)
                    selectedRow = element
                else
                    newRows.push(element)
            })
            if (selectedRow.deletable == true) {
                this.setState({
                    isLoading: false,
                    showDeleteModal: false,
                    IsActiveShow: false
                });
                toast.warning("you can't remove this company !")
            }
            else {
                Api.post('ProjectCompaniesDelete?id=' + this.state.selectedRowId)
                    .then(result => {
                        this.setState({
                            rows: newRows,
                            totalRows: newRows.length,
                            isLoading: false,
                            showDeleteModal: false,
                            IsActiveShow: false
                        });
                        toast.success("operation complete successful")
                    })
                    .catch(ex => {
                        this.setState({
                            showDeleteModal: false,
                            IsActiveShow: false
                        })
                    })
            }
        }
        else
            toast.warning("you don't have permission");

    }
    render() {
        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.state.columns}
                    showCheckbox={true}
                    clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                    viewContactHandler={this.clickHandler}
                    cellClick={this.cellClick}
                    single={true}
                />
            ) : <LoadingSection />;

        const btnExport = this.state.isLoading === false ? <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.ExportColumns} fileName={this.state.pageTitle} /> : null;

        const ComponantFilter = this.state.isLoading === false ? <Filter filtersColumns={filtersColumns} filterMethod={this.filterMethodMain} /> : null;

        return (
            <div>
                <div className="submittalFilter">
                    <div className="subFilter">
                        <h3 className="zero">{this.state.pageTitle}</h3>
                        <span>{this.state.totalRows}</span>
                        <div className="ui labeled icon top right pointing dropdown fillter-button" tabIndex="0" onClick={() => this.hideFilter(this.state.viewfilter)}>
                            <span>
                                <svg
                                    width="16px"
                                    height="18px"
                                    viewBox="0 0 16 18"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <g
                                        id="Symbols"
                                        stroke="none"
                                        strokeWidth="1"
                                        fill="none"
                                        fillRule="evenodd"
                                    >
                                        <g
                                            id="Action-icons/Filters/Hide+text/24px/Grey_Base"
                                            transform="translate(-4.000000, -3.000000)"
                                        >
                                            <g id="Group-4">
                                                <g id="Group-7">
                                                    <g id="filter">
                                                        <rect
                                                            id="bg"
                                                            fill="#80CBC4"
                                                            opacity="0"
                                                            x="0"
                                                            y="0"
                                                            width="24"
                                                            height="24"
                                                        />
                                                        <path
                                                            d="M15.5116598,15.1012559 C14.1738351,15.1012559 13.0012477,14.2345362 12.586259,12.9819466 L4.97668038,12.9819466 C4.43781225,12.9819466 4,12.5415758 4,12 C4,11.4584242 4.43781225,11.0180534 4.97668038,11.0180534 L12.586259,11.0180534 C13.0012477,9.76546385 14.1738351,8.89874411 15.5116598,8.89874411 C16.8494845,8.89874411 18.0220719,9.76546385 18.4370606,11.0180534 L19.0233196,11.0180534 C19.5621878,11.0180534 20,11.4584242 20,12 C20,12.5415758 19.5621878,12.9819466 19.0233196,12.9819466 L18.4370606,12.9819466 C18.0220719,14.2345362 16.8494845,15.1012559 15.5116598,15.1012559 Z M15.5116598,10.8626374 C14.8886602,10.8626374 14.3813443,11.372918 14.3813443,12 C14.3813443,12.627082 14.8886602,13.1373626 15.5116598,13.1373626 C16.1346594,13.1373626 16.6419753,12.627082 16.6419753,12 C16.6419753,11.372918 16.1346594,10.8626374 15.5116598,10.8626374 Z M7.78600823,9.20251177 C6.44547873,9.20251177 5.27202225,8.33246659 4.8586039,7.07576209 C4.37264206,7.01672011 4,6.60191943 4,6.10125589 C4,5.60059914 4.37263163,5.1858019 4.85858244,5.12675203 C5.27168513,3.86979791 6.44573643,3 7.78600823,3 C9.1238329,3 10.2964204,3.86671974 10.711409,5.11930926 L19.0233196,5.11930926 C19.5621878,5.11930926 20,5.5596801 20,6.10125589 C20,6.64283167 19.5621878,7.08320251 19.0233196,7.08320251 L10.711409,7.08320251 C10.2964204,8.33579204 9.1238329,9.20251177 7.78600823,9.20251177 Z M7.78600823,4.96389325 C7.1630086,4.96389325 6.65569273,5.4741739 6.65569273,6.10125589 C6.65569273,6.72833787 7.1630086,7.23861852 7.78600823,7.23861852 C8.40900786,7.23861852 8.91632373,6.72833787 8.91632373,6.10125589 C8.91632373,5.4741739 8.40900786,4.96389325 7.78600823,4.96389325 Z M13.1695709,18.8806907 C12.7545822,20.1332803 11.5819948,21 10.2441701,21 C8.90634542,21 7.73375797,20.1332803 7.3187693,18.8806907 L4.97668038,18.8806907 C4.43781225,18.8806907 4,18.4403199 4,17.8987441 C4,17.3571683 4.43781225,16.9167975 4.97668038,16.9167975 L7.3187693,16.9167975 C7.73375797,15.664208 8.90634542,14.7974882 10.2441701,14.7974882 C11.5819948,14.7974882 12.7545822,15.664208 13.1695709,16.9167975 L19.0233196,16.9167975 C19.5621878,16.9167975 20,17.3571683 20,17.8987441 C20,18.4403199 19.5621878,18.8806907 19.0233196,18.8806907 L13.1695709,18.8806907 Z M10.2441701,16.7613815 C9.62117047,16.7613815 9.1138546,17.2716621 9.1138546,17.8987441 C9.1138546,18.5258261 9.62117047,19.0361068 10.2441701,19.0361068 C10.8671697,19.0361068 11.3744856,18.5258261 11.3744856,17.8987441 C11.3744856,17.2716621 10.8671697,16.7613815 10.2441701,16.7613815 Z"
                                                            id="Shape"
                                                            fill="#5E6475"
                                                            fillRule="nonzero"
                                                        />
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </span>
                            <span className={this.state.viewfilter === false ? "text active " : "text"}>
                                <span className="show-fillter">{Resources['hideFillter'][currentLanguage]}</span>
                                <span className="hide-fillter">{Resources['showFillter'][currentLanguage]}</span>
                            </span>
                        </div>
                    </div>
                    <div className="filterBTNS">
                        {btnExport}
                        <button className="primaryBtn-1 btn mediumBtn" onClick={this.addRecord}>{Resources['add'][currentLanguage]}</button>
                    </div>
                    <div className="rowsPaginations">
                        <div className="rowsPagiRange">
                            <span>{(this.state.pageSize * this.state.pageNumber) + 1}</span> - <span>{(this.state.pageSize * this.state.pageNumber) + this.state.pageSize}</span> of
                            <span>{this.state.totalRows}</span>
                        </div>
                        <button className={this.state.pageNumber <= 0 ? "rowunActive" : ""} onClick={this.GetPreviousData}>
                            <i className="angle left icon" />
                        </button>
                        <button onClick={this.GetNextData}>
                            <i className="angle right icon" />
                        </button>
                    </div>
                </div>
                <div className="filterHidden" style={{ maxHeight: this.state.viewfilter ? "" : "0px", overflow: this.state.viewfilter ? "" : "hidden" }}>
                    <div className="gridfillter-container">
                        {ComponantFilter}
                    </div>
                </div>
                <div className="grid-container">
                    {dataGrid}
                </div>
                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal title={Resources['smartDeleteMessage'][currentLanguage].content} closed={this.onCloseModal} showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain} buttonName='delete' clickHandlerContinue={this.ConfirmDeleteComanies} />
                ) : null}
            </div>
        );
    }
}


export default withRouter(Index);
