import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous';
import ExportDetails from "../ExportReportCenterDetails";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let projectId = localStorage.getItem("lastSelectedProject") == null ? 0 : localStorage.getItem("lastSelectedProject")

class ContractedQtyVSEarnedQty extends Component {

    constructor(props) {
        super(props)
        this.columns = [
            {
                field: "arrange",
                title: Resources["no"][currentLanguage],
                width: 4,
                groupable: true,
                fixed: true,
                sortable: true,
                hidden: false,
                type: "number"
            },
            {
                field: "boqType",
                title: Resources["boqType"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, hidden: false,
                type: "text"
            }, {
                field: "secondLevel",
                title: Resources["boqTypeChild"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, 
                hidden: false,
                type: "text"
            },  {
                field: "itemCode",
                title: Resources["itemCode"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "text"
            }, {
                field: "subject",
                title: Resources["description"][currentLanguage],
                width: 15,
                groupable: true,
                sortable: true,
                 hidden: false,
                type: "text",
            },
            {
                field: "unit",
                title: Resources["unit"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, 
                hidden: false,
                type: "text"
            },
            {
                field: "unitPrice",
                title: Resources["unitPrice"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, 
                hidden: false,
                type: "number"
            },{
                field: "quantity",
                title: Resources["boqQuanty"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, 
                hidden: false,
                type: "number"
            }, {
                field: "revisedQuantity",
                title: Resources["approvedQuantity"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, 
                hidden: false,
                type: "number"
            },
            {
                field: "quantityComplete",
                title: Resources["quantityComplete"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true, 
                hidden: false,
                type: "number"
            }, 
            {
                field: "paymentPercent",
                title: Resources["paymentPercent"][currentLanguage],
                width: 15,
                groupable: true,
                sortable: true, 
                hidden: false,
                type: "text"
            }, 
            {
                field: "wasAdded",
                title: Resources["status"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                 hidden: true,
                type: "text"
            },
            {
                field: "totalExcutedPayment",
                title: Resources["totalAmount"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "number"
            },
            {
                field: "lastComment",
                title: Resources["comment"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                 hidden: false,
                type: "text"
            },
            {
                field: "itemStatus",
                title: Resources["itemStatus"][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: "text"
            }
             ];
        this.state = {
            isLoading: false,
            PaymentRequisitionList: [],
            SelectedPaymentRequisition: { label: Resources.paymentRequistion[currentLanguage], value: "0" },
            rows: [],
            pageSize: 200,
            pageNumber:0,
            totalRows:0
        }
        if (!Config.IsAllow(10074)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }
        this.fields = [
            {
                title: Resources["paymentRequistion"][currentLanguage],
                value: "",
                type: "text"
            }
        ];
    }

    componentDidMount() {
        this.setState({ isLoading: true })
        Api.get(`GetContractsRequestPaymentsCustom?projectId=${projectId}&pageNumber=0&pageSize=1000`).then(result => {
            let array = [];
            if (result) {
                result.data.forEach(element => {
                    let obj = {};
                    obj.label = element.subject;
                    obj.value = element.id;
                    array.push(obj)
                });
            }
            this.setState({
                PaymentRequisitionList: array,
                isLoading: false
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })
    }

    getGridRows = (e) => {
        this.setState({
            SelectedPaymentRequisition: e,
            isLoading: true
        })
        Api.get(`GetRequestItemsByRequestIdForReport?requestId=${e.value}&pageNumber=${this.state.pageNumber}&pageSize=${this.state.pageSize}`).then((res) => {
            this.setState({ rows: res || [], isLoading: false })
        }).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    GetPrevoiusData() {
        let pageNumber = this.state.pageNumber - 1;
        if (pageNumber >= 0 && this.state.SelectedPaymentRequisition.value > 0) {
            this.setState({
                isLoading: true,
                pageNumber: pageNumber
            });
            let url = `GetRequestItemsByRequestIdForReport?requestId=${this.state.SelectedPaymentRequisition.value}&pageNumber=${pageNumber}&pageSize=${this.state.pageSize}`
            Api.get(url).then(result => {
                this.setState({
                    rows: result.data || [],
                    totalRows: result.total || 0,
                    isLoading: false
                });
            })
        }
    };

    GetNextData() {
        let pageNumber = this.state.pageNumber + 1;
        let maxRows = this.state.totalRows;
        if (this.state.pageSize * pageNumber !== 0 && this.state.pageSize * pageNumber < maxRows && this.state.SelectedPaymentRequisition.value > 0) {
            this.setState({
                isLoading: true,
                pageNumber: pageNumber
            });
            let url = `GetRequestItemsByRequestIdForReport?requestId=${this.state.SelectedPaymentRequisition.value}&pageNumber=${pageNumber}&pageSize=${this.state.pageSize}`
            Api.get(url).then(result => {
                this.setState({
                    rows: result.data || [],
                    totalRows: result.total || 0,
                    isLoading: false
                });
            })
        }
    };

    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                key="allocationOfProjectsOnComp"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : null

        const btnExport =
            <ExportDetails fieldsItems={this.columns}
                rows={this.state.rows} fields={this.fields} fileName={Resources.contractQtyVsEarnedQty[currentLanguage]} />

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.contractQtyVsEarnedQty[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className="submittalFilter readOnly__disabled">
                <div className="filterBTNS">
                <div className="linebylineInput valid-input">
                    <Dropdown title='paymentRequistion'
                        data={this.state.PaymentRequisitionList}
                        name='SelectedPaymentRequisition'
                        selectedValue={this.state.SelectedPaymentRequisition}
                        handleChange={e => {
                            this.fields[0].value = e.label
                            this.getGridRows(e);
                        }}
                        value={this.state.SelectedPaymentRequisition} />
                </div>
                </div>
                <div className="rowsPaginations readOnly__disabled">
              <div className="rowsPagiRange">
                <span>{this.state.pageSize * this.state.pageNumber + 1}</span> -
                <span>
                  {  this.state.pageSize * this.state.pageNumber + this.state.pageSize}
                </span>
                {Resources['jqxGridLanguage'][currentLanguage].localizationobj.pagerrangestring}
                <span> {this.state.totalRows}</span>
              </div>
              <button className={this.state.pageNumber == 0 ? "rowunActive" : ""} onClick={() => this.GetPrevoiusData()}><i className="angle left icon" /></button>
              <button className={this.state.totalRows !== this.state.pageSize * this.state.pageNumber + this.state.pageSize ? "rowunActive" : ""} onClick={() => this.GetNextData()}>
                <i className="angle right icon" />
              </button>
            </div>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
                {this.state.isLoading == true ? <LoadingSection /> : null}
            </div>
        )
    }
}

export default ContractedQtyVSEarnedQty
