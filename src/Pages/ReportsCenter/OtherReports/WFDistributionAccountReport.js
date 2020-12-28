import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
//import Export from "../../../Componants/OptionsPanels/Export";
import ExportDetails from "../ExportReportCenterDetails";
//import GridCustom from 'react-customized-grid';
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import dataservice from "../../../Dataservice";
import CryptoJS from 'crypto-js';
import SkyLight from 'react-skylight';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class WFDistributionAccountReport extends Component {

    constructor(props) {

        super(props)
        this.state = {
            isLoading: false,
            dropDownList: [],
            selectedContact: { label: Resources.selectContact[currentLanguage], value: "0" },
            selectedContact_level: { label: Resources.selectContact[currentLanguage], value: "0" },
            rows: [],
            selectedRows: []
        }

        if (!Config.IsAllow(3720)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

        this.columns = [
            { title: '', type: 'check-box', fixed: true, field: 'id' },
            {
                "field": "subject",
                "title": Resources.subject[currentLanguage],
                "type": "text",
                "width": 25,
                "fixed": true,
                "groupable": true,
                "sortable": true,
                "href": 'link',
                'classes': 'bold'
            },
            {
                "field": "description",
                "title": Resources.description[currentLanguage],
                "type": "text",
                "width": 20,
                "groupable": true,
                "sortable": true
            },
            {
                "field": "type",
                "title": Resources.type[currentLanguage],
                "type": "text",
                "width": 12,
                "groupable": true,
                "sortable": true
            },
            {
                "field": "projectName",
                "title": Resources.projectName[currentLanguage],
                "type": "text",
                "width": 17,
                "groupable": true,
                "sortable": true
            },
            {
                "field": "levelCount",
                "title": Resources.levelNo[currentLanguage],
                "type": "text",
                "width": 10,
                "groupable": true,
                "sortable": true
            }
        ];

        this.fields = [{
            title: Resources["ContactName"][currentLanguage],
            value: "",
            type: "text"
        }];
    }

    componentDidMount() {
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
            Api.get('GetContactsWorkFlowDist?contactId=' + this.state.selectedContact.value).then((result) => {

                result.forEach(row => {

                    let link = "";

                    let docId = row.url.split("/");

                    let obj = {
                        docId: docId[1],
                        projectId: row.projectId,
                        projectName: row.projectName,
                        arrange: 0,
                        docApprovalId: 0,
                        isApproveMode: false,
                        perviousRoute: window.location.pathname + window.location.search
                    };

                    let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));

                    let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

                    if (row.type === "Distribution List") {
                        link = '/projectDistributionListAddEdit?id=' + encodedPaylod;
                    } else {
                        link = '/projectWorkFlowAddEdit?id=' + encodedPaylod;
                    }

                    row.link = link;
                });

                this.setState({ rows: result, isLoading: false })
            }).catch(() => {
                this.setState({ isLoading: false })
            })
        }
    }

    showPopUp = (value) => {

        this.setState({ showModal: true, selectedRows: value })
        this.simpleDialog.show()
    }


    addLevel() {
        if (this.state.selectedContact_level.value != '0') {

            Api.post('AddWFItemsToSameLevel?contactId=' + this.state.selectedContact.value + '&tocontactId=' + this.state.selectedContact_level.value, this.state.selectedRows).then(() => {
                toast.success(Resources.operationSuccess[currentLanguage])
                this.setState({ showModal: false })
            }).catch(() => {
                toast.error(Resources.operationCanceled[currentLanguage])
            })
        } else {
            toast.warn("Please Choose Contact Name ...");
        }
    }

    checkedRow = (id, checked) => {

        let hasWorkFlow = this.state.rows.find(x => x.id === id);

        if (hasWorkFlow.type === "Work Flow") {
            let indexed = checked.findIndex(x => x === id);
            if (indexed > -1) {
                checked.splice(indexed, 1);
            } else {
                checked.push(id);
            }

            return true;
        } else {
            toast.warn("Can't Send Distrbution Only Work Flow ...");
            return false;
        }
    }


    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.columns}
                pageSize={this.state.rows.length}
                actions={[{
                    title: 'Send To The Same Level',
                    handleClick: (value) => {
                        this.showPopUp(value);
                    },
                    classes: "autoGridBtn"
                }]} rowActions={[]} rowClick={() => { }}
                shouldCheck={(id, checked) => {
                    this.checkedRow(id, checked);
                }}

            />
        ) : <LoadingSection />

        const btnExport = 
            <ExportDetails fieldsItems={this.columns}
                rows={this.state.rows}
                fields={this.fields} fileName={'wokFlowDistrbutionAccountsReport'} />

        const addToSameLevel = <div className="doc-container">
            <div className="step-content">
                <div className="document-fields">
                    <div className="proForm datepickerContainer">
                        <Dropdown className='fullWidthWrapper textLeft'
                            title="ContactName"
                            data={this.state.dropDownList}
                            selectedValue={this.state.selectedContact_level}
                            handleChange={event =>  this.setState({ selectedContact_level: event })}
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
                <div className='proForm reports__proForm datepickerContainer'>
                    <div className="linebylineInput valid-input">
                        <Dropdown title="ContactName" name="ContactName" index="ContactName"
                            data={this.state.dropDownList} selectedValue={this.state.selectedContact}
                            handleChange={event =>{ this.setState({ selectedContact: event });this.fields[0].value = event.label }} />
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
