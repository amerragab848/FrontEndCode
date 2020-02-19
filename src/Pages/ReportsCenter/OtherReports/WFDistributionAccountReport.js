import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridCustom from 'react-customized-grid';
import dataservice from "../../../Dataservice";
import CryptoJS from 'crypto-js';
import SkyLight from 'react-skylight';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class WFDistributionAccountReport extends Component {

    constructor(props) {

        console.log("window.location.href", window.location.href);

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
                //"href": window.location.href,
                
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
            Api.get('GetContactsWorkFlowDist?contactId=' + this.state.selectedContact.value).then((res) => {
                this.setState({ rows: res, isLoading: false })
            }).catch(() => {
                this.setState({ isLoading: false })
            })
        }
    }

    showPopUp = (values) => {
        this.setState({
             showModal: true,
             selectedRows:values
             })
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

    // selectedRows(rows) {
    //     this.setState({ selectedRows: rows })
    // }

    // addLevel() {
    //     if (this.state.selectedContact_level.value != '0') {
    //         Api.post('AddWFItemsToSameLevel?contactId=' + this.state.selectedContact.value + '&tocontactId=' + this.state.selectedContact_level.value, this.state.selectedRows).then(() => {
    //             toast.success(Resources.operationSuccess[currentLanguage])
    //             this.setState({ showModal: false })
    //         }).catch(() => {
    //             toast.error(Resources.operationCanceled[currentLanguage])
    //         })
    //     }
    // }
    addLevel() {
        if (this.state.selectedContact_level.value != '0') {

            Api.post('AddWFItemsToSameLevel?contactId=' + this.state.selectedContact.value + '&tocontactId=' + this.state.selectedContact_level.value, this.state.selectedRows).then(() => {
                toast.success(Resources.operationSuccess[currentLanguage])
                this.setState({ showModal: false })
            }).catch(() => {
                toast.error(Resources.operationCanceled[currentLanguage])
            })
        }
    }

    checkedRow = (id, checked) => {
        //  id is current row
        //  checked is array of already checked rows
        if (id !== 139585) {
            return true;
        } else {
            return false;
        }
    }
    routeUrl=(url)=>{
        this.props.history.push(url);
    }

    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.columns}
                pageSize={this.state.rows.length} actions={[

                    {
                        title: 'Add to',
                        handleClick: values =>
                            // {
                            //     this.setState({
                            //         showDeleteModal: true,
                            //         selectedRows: values
                            //     });
                            // },
                            this.showPopUp(values),
                        classes: '',
                    }
                ]}
                 rowActions={[]} 
                 rowClick={() => { }}
                shouldCheck={(id, checked) => {
                    this.checkedRow(id, checked);
                }}
                rowClick={cell=>{
                    if(cell.id != 0){
                        let rowData = this.columns.filter(x => x.id == cell.id - 1).key;
                        this.routeUrl(cell.url);
                        
                    }
                }}
            />
            // <GridSetup rows={this.state.rows} showCheckbox={true}
            //     selectedCopmleteRow={true} selectedRows={rows => this.selectedRows(rows)}
            //     pageSize={this.state.pageSize} columns={this.columns} addLevel={e => this.showPopUp()} />
        ) : <LoadingSection />

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
                    {/* <button className="primaryBtn-1 btn smallBtn" onClick={() => this.showPopUp()}>{Resources['search'][currentLanguage]}</button> */}
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
