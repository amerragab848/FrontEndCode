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
const _ = require('lodash')
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
class WFDistributionAccountReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            dropDownList: [],
            selectedContact: { label: Resources.selectContact[currentLanguage], value: "0" },
            selectedContact_level:{ label: Resources.selectContact[currentLanguage], value: "0" },
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
        this.setState({showModal:true})
        this.simpleDialog.show()
    }

    subjectLink = ({ value, row }) => {
        let subject = "";
        if (row) {
            let obj = {
                docId: row.id,
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
    };

    selectedRows(rows) {
        this.setState({ selectedRows: rows })
    }
    addLevel(){
        if(this.state.selectedContact_level.value!='0'){
            Api.post('AddWFItemsToSameLevel?contactId='+this.state.selectedContact.value+'&toContactId='+this.state.selectedContact_level.value,this.state.selectedRows).then(()=>{
                toast.success(Resources.operationSuccess[currentLanguage])
                this.setState({showModal:false})
            }).catch(()=>{
                toast.error(Resources.operationCanceled[currentLanguage])
            })
        }
    }

    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridSetup

                rows={this.state.rows}
                showCheckbox={true}
                selectedCopmleteRow={true}
                selectedRows={rows=>this.selectedRows(rows)}
                pageSize={this.state.pageSize}
                columns={this.columns}
                addLevel={e => this.showPopUp()}
            />) : <LoadingSection />;
        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'wokFlowDistrbutionAccountsReport'} />
            : null;
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

            <div className='mainContainer main__fulldash'>
                <div className="documents-stepper noTabs__document">
                    <div className="submittalHead">
                        <h2 className="zero">{Resources['wokFlowDistrbutionAccountsReport'][currentLanguage]}</h2>
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
                                    <Dropdown className='fullWidthWrapper textLeft'
                                        title="ContactName"
                                        data={this.state.dropDownList}
                                        selectedValue={this.state.selectedContact}
                                        handleChange={event => this.setState({ selectedContact: event })}
                                        name="ContactName"
                                        index="ContactName"
                                    />
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
                <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources['addToTheSameLevel'][currentLanguage]}>
                        {addToSameLevel}
                    </SkyLight>
                </div>
            </div >
        )
    }

}


export default WFDistributionAccountReport
