import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import dataservice from "../../../Dataservice";
import CryptoJS from 'crypto-js';
import SkyLight from 'react-skylight';
//const _ = require('lodash')
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class WFDistributionAccountReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            dropDownList: [],
            selectedContact: { label: Resources.selectContact[currentLanguage], value: "0" },
            selectedContact_level: { label: Resources.selectContact[currentLanguage], value: "0" },
            rows: []
        }

        if (!Config.IsAllow(3720)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }
        this.columns = [
            {
                key: "subject",
                name: Resources["subject"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: this.subjectLink
            }, {
                key: "description",
                name: Resources["description"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "type",
                name: Resources["type"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "levelCount",
                name: Resources["levelNo"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }
        ];
    }

    componentWillMount() {
        dataservice.GetDataList('GetContactsHasAccountsWithoutCompId', 'contactName', 'id').then(result => {
            this.setState({
                dropDownList: result
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })
    }

    getGridRows = () => {
        if (this.state.selectedContact.value != '0') {
            this.setState({ isLoading: true })
            Api.get('GetContactsWorkFlowDist?contactId=' + this.state.selectedContact.value).then((res) => {
                this.setState({ rows: res, isLoading: false })
            }).catch(() => {
                this.setState({ isLoading: false })
            })
        }
    }

    showPopUp = () => {
        this.setState({ showModal: true })
        this.simpleDialog.show()
    }

    subjectLink = ({ value, row }) => {
        let subject = "";
        if (row) {   
            let obj = {
                docId: row.url.split('/')[1],
                projectId: row.projectId,
                projectName: row.projectName,
                arrange: 0,
                docApprovalId: 0,
                isApproveMode: false
            };
            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
            let doc_view = "/projectWorkFlowAddEdit?id=" + encodedPaylod
            subject = row.subject;
            return <a href={doc_view}> {subject} </a>;
        }
        return null;
    }

    selectedRows(rows) {
        this.setState({ selectedRows: rows })
    }

    addLevel() {
        if (this.state.selectedContact_level.value != '0') {
            Api.post('AddWFItemsToSameLevel?contactId=' + this.state.selectedContact.value + '&toContactId=' + this.state.selectedContact_level.value, this.state.selectedRows).then(() => {
                toast.success(Resources.operationSuccess[currentLanguage])
                this.setState({ showModal: false })
            }).catch(() => {
                toast.error(Resources.operationCanceled[currentLanguage])
            })
        }
    }

    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={true}
                selectedCopmleteRow={true} selectedRows={rows => this.selectedRows(rows)}
                pageSize={this.state.pageSize} columns={this.columns} addLevel={e => this.showPopUp()} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'wokFlowDistrbutionAccountsReport'} />
            : null

        const addToSameLevel = <div className="doc-container">
            <div className="step-content">
                <div className="document-fields">
                    <div className="proForm datepickerContainer">
                        <Dropdown className='fullWidthWrapper textLeft'
                            title="ContactName"
                            data={this.state.dropDownList}
                            selectedValue={this.state.selectedContact_level}
                            handleChange={event => this.setState({ selectedContact_level: event })}
                            name="ContactName"
                            index="ContactName"
                        />
                        <div className="fullWidthWrapper ">
                            <button className="primaryBtn-1 btn mediumBtn" onClick={() => this.addLevel()}>{Resources['save'][currentLanguage]}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        return (



            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.wokFlowDistrbutionAccountsReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm'>
                    <div className="linebylineInput valid-input">
                        <Dropdown title="ContactName" name="ContactName" index="ContactName"
                            data={this.state.dropDownList} selectedValue={this.state.selectedContact}
                            handleChange={event => this.setState({ selectedContact: event })} />
                    </div>
                    <button className="primaryBtn-1 btn smallBtn" onClick={() => this.getGridRows()}>{Resources['search'][currentLanguage]}</button>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
                <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources['addToTheSameLevel'][currentLanguage]}>
                        {addToSameLevel}
                    </SkyLight>
                </div>

            </div>


        )
    }

}

export default WFDistributionAccountReport
