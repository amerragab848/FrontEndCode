import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridCustom from 'react-customized-grid'; 

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');


class PaymentReqStatusReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            WFList: [],
            dropDownList: [],
            payment: { label: Resources.months[currentLanguage], value: "0" },
            rows: [],
            code: 0,
            months: [
                { label: "January", value: "January" },
                { label: "February", value: "February" },
                { label: "March", value: "March" },
                { label: "April", value: "April" },
                { label: "May", value: "May" },
                { label: "June", value: "June" },
                { label: "July", value: "July" },
                { label: "August", value: "August" },
                { label: "September", value: "September" },
                { label: "October", value: "October" },
                { label: "November", value: "November" },
                { label: "December", value: "December" }
            ],
            columns: [
                {
                    "field": "projectName",
                    "title": Resources.projectName[currentLanguage],
                    "type": "text",
                    "width": 20,
                    "fixed": true,
                    "groupable": true,
                    "sortable": true
                }, {
                    "field": "contractName",
                    "title": Resources.contractName[currentLanguage],
                    "type": "text",
                    "width": 20,
                    "fixed": true,
                    "groupable": true,
                    "sortable": true
                }, {
                    "field": "subject",
                    "title": Resources.subject[currentLanguage],
                    "type": "text",
                    "width": 20,
                    "fixed": true,
                    "groupable": true,
                    "sortable": true
                }
            ]
        }

        if (!Config.IsAllow(3758)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

    }

    getGridRows = () => {
        if (this.state.payment.value != '0') {
            this.setState({ isLoading: true })
            Api.post('GetReqPaymentStatusChilds?code=' + this.state.code + '&date=' + this.state.payment.value).then((res) => {
                this.setState({ rows: res, isLoading: false })
            }).catch(() => {
                this.setState({ isLoading: false })
            })
        }

    }

    handleBlur = () => {

        if (this.state.payment.value != '0' && this.state.code != 0) {
            this.setState({ isLoading: true })
            
            let columns = [
                {
                    "field": "projectName",
                    "title": Resources.projectName[currentLanguage],
                    "type": "text",
                    "width": 20,
                    "fixed": true,
                    "groupable": true,
                    "sortable": true
                }, {
                    "field": "contractName",
                    "title": Resources.contractName[currentLanguage],
                    "type": "text",
                    "width": 20,
                    "groupable": true,
                    "sortable": true
                }, {
                    "field": "subject",
                    "title": Resources.subject[currentLanguage],
                    "type": "text",
                    "width": 20,
                    "groupable": true,
                    "sortable": true
                }
            ]
            Api.post('GetReqPaymentStatusParent?code=' + this.state.code + '&date=' + this.state.payment.value).then(res => {
                if (res) {
                    let wfLevelDescription = res[0] != null ? res[0].wfLevelDescription : null
                    if (wfLevelDescription != null) {
                        wfLevelDescription.forEach(element => {
                            let afterReplace = element.subject.replace(/#|_|&|\s/g, '-')
                            columns.push(
                                {
                                    "field": afterReplace,
                                    "title": afterReplace,
                                    "type": "date",
                                    "width": 20,
                                    "groupable": true,
                                    "sortable": true
                                })
                        })
                        this.setState({ columns, isLoading: false, rows: [] })
                    }
                    else {
                        this.setState({ isLoading: false })
                    }
                }
            }).catch(err => {
                this.setState({ isLoading: false })
            })
        }
    }

    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.state.columns}
                pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={'paymentReqStatusReport'} />
            : null

        return (

            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.paymentReqStatusReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm'>
                    <div className="linebylineInput valid-input">

                        <Dropdown title="workFlow" data={this.state.months}
                            selectedValue={this.state.payment} onBlur={this.handleBlur}
                            name="workFlows" index="workFlows"
                            handleChange={event => { this.setState({ payment: event }); }} />
                    </div>

                    <div className="linebylineInput valid-input">
                        <label class="control-label">{Resources.subject[currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input type="text" id="code"
                                className="form-control"
                                defaultValue={this.state.code} name="code"
                                onChange={event => this.setState({ code: event.target.value })}
                                onBlur={() => this.handleBlur()}
                                placeholder={Resources.code[currentLanguage]} />
                        </div>
                    </div>
                    <button className="primaryBtn-1 btn smallBtn" onClick={() => this.getGridRows()}>{Resources['search'][currentLanguage]}</button>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

}


export default PaymentReqStatusReport
