import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import moment from "moment";
const _ = require('lodash')
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
                    key: "projectName",
                    name: Resources["projectName"][currentLanguage],
                    width: 120,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                }   , {
                    key: "contractName",
                    name: Resources["contractName"][currentLanguage],
                    width: 120,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                }, {
                    key: "subject",
                    name: Resources["subject"][currentLanguage],
                    width: 120,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
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

    componentDidMount() {
    }

    componentWillMount() {

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
            let dateFormate = ({ value }) => {
                let levelDesc = "Pending";
                if (value) { 
                    let date = value != undefined ? value.split('-')[0] : '';
                    let days = value != undefined ? value.split('-')[1] : '';
                    levelDesc = moment(date).format("DD/MM/YYYY") + "-" + days + ' days';
                }
                return levelDesc;
            };

            let columns = [
                {
                    key: "projectName",
                    name: Resources["projectName"][currentLanguage],
                    width: 120,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                }

                , {
                    key: "contractName",
                    name: Resources["contractName"][currentLanguage],
                    width: 120,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                }, {
                    key: "subject",
                    name: Resources["subject"][currentLanguage],
                    width: 120,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                }
            ]
            Api.post('GetReqPaymentStatusParent?code=' + this.state.code + '&date=' + this.state.payment.value).then(res => {
               
                let wfLevelDescription = res[0] != null ? res[0].wfLevelDescription : null
                if (wfLevelDescription != null) {
                    wfLevelDescription.forEach(element => {
                        let afterReplace = element.subject.replace(/#|_|&|\s/g, '-')
                        columns.push(
                            {
                                key: afterReplace,
                                name: afterReplace,
                                width: 100,
                                draggable: true,
                                sortable: true,
                                resizable: true,
                                filterable: true,
                                sortDescendingFirst: true,
                                formatter: dateFormate
                            })
                    })
                    this.setState({ columns, isLoading: false, rows: [] })
                }
                else {
                    this.setState({ isLoading: false })
                }
            })
        }



    }
    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridSetup
                rows={this.state.rows}
                showCheckbox={false}
                pageSize={this.state.pageSize}
                columns={this.state.columns}
            />) : <LoadingSection />;
        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={'paymentReqStatusReport'} />
            : null;
        return (

            <div className='mainContainer main__fulldash'>
                <div className="documents-stepper noTabs__document">
                    <div className="submittalHead">
                        <h2 className="zero">{Resources['paymentReqStatusReport'][currentLanguage]}</h2>
                        <div className="SubmittalHeadClose">
                            <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnslink="http://www.w3.org/1999/xlink">
                                <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                        <g id="Group-2">
                                            <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                                <g id="Action-icons/Close/Circulated/20pt/Grey_Normal"><g id="Group"><circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
                                                    <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z" id="Combined-Shape" fill="#858D9E" fill-rule="nonzero">
                                                    </path>
                                                </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                    <div className="doc-container">
                        <div className="step-content">
                            <div className="document-fields">
                                <div className=" fullWidthWrapper textRight">
                                    {btnExport}
                                </div>
                                <div className="proForm datepickerContainer">
                                    <div className="linebylineInput valid-input">
                                        <Dropdown
                                            title="workFlow"
                                            data={this.state.months}
                                            selectedValue={this.state.payment}
                                            handleChange={event => { this.setState({ payment: event }); }}
                                            onBlur={this.handleBlur}
                                            name="workFlows"
                                            index="workFlows"
                                        />
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.code[currentLanguage]}</label>
                                        <div className="ui input inputDev"  >
                                            <input type="text" className="form-control" id="code"
                                                defaultValue={this.state.code}
                                                name="code"
                                                onChange={event => this.setState({ code: event.target.value })}
                                                onBlur={() => this.handleBlur()}
                                                placeholder={Resources.code[currentLanguage]}
                                            />
                                        </div>
                                    </div>
                                    <div className="fullWidthWrapper ">
                                        <button className="primaryBtn-1 btn mediumBtn" onClick={() => this.getGridRows()}>{Resources['search'][currentLanguage]}</button>
                                    </div>
                                </div>

                            </div>
                            <div className="doc-pre-cycle letterFullWidth">
                                {dataGrid}

                            </div>

                        </div>
                    </div>
                </div>

            </div >
        )
    }

}


export default PaymentReqStatusReport
