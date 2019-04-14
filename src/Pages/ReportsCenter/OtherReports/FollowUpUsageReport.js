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
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};
class WFUsageReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            dropDownList: [],
            selectedWF: { label: Resources.slectWorkFlow[currentLanguage], value: "0" },
            rows: [],
            columns : [
                {
                    key: "subject",
                    name: Resources["subject"][currentLanguage],
                    width: 150,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                } , {
                    key: "level",
                    name: Resources["levelNo"][currentLanguage],
                    width: 120,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                },
            ]
    
        }

        if (!Config.IsAllow(3750) ) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }
   
    }



    componentDidMount() {
    }

    componentWillMount() {
        Api.get('GetAllWorkFlowList').then(result => {
            let list = []
            result.forEach((element) => {
                list.push({ label: element.subject, value: element.code })
            })
            this.setState({
                dropDownList: list
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })
    }

    DropdownChange=(event)=>{
        this.setState({ selectedWF: event,isLoading:true })
        Api.post('GetFollowUpsUsageParent?code='+event.value).then(res=>{
            let columns=[  
                {
                key: "subject",
                name: Resources["subject"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            } , {
                key: "level",
                name: Resources["levelNo"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "level",
                name: Resources["levelNo"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }]
            res.forEach((element)=>{
                columns.push(
                    {
                        key: element.projectName,
                        name: element.projectName,
                        width: 120,
                        draggable: true,
                        sortable: true,
                        resizable: true,
                        filterable: true,
                        sortDescendingFirst: true
                    })
              
            })
       
        this.setState({columns,isLoading:false, rows: []})

        })
    }
    getGridRows = () => {
        if (this.state.selectedWF.value != '0') {
            this.setState({ isLoading: true })
            Api.post('GetFollowUpsUsageChilds?code=' + this.state.selectedWF.value).then((res) => {
                this.setState({ rows: res, isLoading: false })
            }).catch(() => {
                this.setState({ isLoading: false })
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
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={'followUpsUsageReport'} />
            : null;
        return (

            <div className='mainContainer'>
                <div className="documents-stepper noTabs__document">
                    <div className="submittalHead">
                        <h2 className="zero">{Resources['followUpsUsageReport'][currentLanguage]}</h2>
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
                                    <Dropdown className='fullWidthWrapper'
                                        title="workFlow"
                                        data={this.state.dropDownList}
                                        selectedValue={this.state.selectedWF}
                                        handleChange={event =>this.DropdownChange(event)}
                                        name="workFlows"
                                        index="workFlows"
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

            </div >
        )
    }

}


export default WFUsageReport
