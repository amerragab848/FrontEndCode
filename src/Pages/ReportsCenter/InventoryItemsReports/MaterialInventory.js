import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import ExportDetails from "../ExportReportCenterDetails";
import GridCustom from 'react-customized-grid';
import Dataservice from '../../../Dataservice';
import Api from '../../../api.js';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')

class ExpensesStatus extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            projectsData: [],
            projectIds: [],
            selectedProject: { label: Resources.projectName[currentLanguage], value: "0" },
            rows: [],
            allProjects: false
        }

        if (!Config.IsAllow(3665)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }
        this.columns = [
            {
                "field": "projectName",
                "title": Resources.projectName[currentLanguage],
                "type": "text",
                "width": 15,
                "fixed": true,
                "groupable": true,
                "sortable": true
            }, {
                "field": "description",
                "title": Resources.description[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "unit",
                "title": Resources.unit[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "quantity",
                "title": Resources.quantity[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "itemCode",
                "title": Resources.itemCode[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "resourceCode",
                "title": Resources.resourceCode[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }
        ];
        this.fields = [{
            title: Resources["projectName"][currentLanguage],
            value: "",
            type: "text"
        }];
    }

    componentDidMount() {
        
        Dataservice.GetDataList('GetMaterialInventoryProjects?pageNumber=1&pageSize=1000', 'projectName', 'projectId').then(
            result => {
                this.setState({
                    projectsData: result
                })
            }).catch(() => {
                toast.error('somthing wrong')
            })
    }

    getGridRows = () => {
        let dtoDoc=null;
        if(this.state.allProjects===true){
            console.log(this.state)
           dtoDoc=this.state.projectsData.map(i=>i.value);
           this.fields[0].value = "All Projects";
        }else{
            dtoDoc=this.state.projectIds;
        }
        this.setState({ isLoading: true })
        let obj = {
            dtoDocument: dtoDoc,
            pageNumber: 0,
            pageSize: 10000
        }
        Api.post('GetMaterialInventorySummary', obj).then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false
                })
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }
    handleChangeDrop = (name, selected, e) => {
       
        let arrIds = e.map(i => i.value);
        let  arrVals = e.map(i => i.label + " , ");
        this.fields[0].value = arrVals;
        
        this.setState({
            [name]: arrIds,
            [selected]: e,

        })
    }
    checkChange = (e) => {
        this.setState({ allProjects: e.target.checked });
    }
    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.columns}
                pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
            />
        ) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?

            <ExportDetails fieldsItems={this.columns}
                rows={this.state.rows}
                fields={this.fields} fileName={Resources.materialInventoryReport[currentLanguage]} />
            : null

        return (


            <div className="reports__content reports__multiDrop">
                <header>
                    <h2 className="zero">{Resources.materialInventoryReport[currentLanguage]}</h2>
                    {btnExport}
                </header>


                <div className='proForm reports__proForm datepickerContainer'>
                    <div className="linebylineInput multiChoice">
                        <Dropdown title='projectName' data={this.state.projectsData} name='projectName'
                            isMulti={true} selectedValue={this.state.selectedCompany} handleChange={e => { this.handleChangeDrop('projectIds', 'selectedProject', e); }} />

                    </div>
                    <div className="linebylineInput">
                        <div className="ui checkbox checkBoxGray300 checked" >
                            <input type="checkbox"
                                id="allProjects"
                                name="allProjects"
                                value={this.state.allProjects}
                                checked={this.state.allProjects}
                                onChange={(e) => { this.checkChange(e); }}
                            />
                            <label>{Resources.allProjects[currentLanguage]}</label>
                        </div>
                    </div>
                    <button className="primaryBtn-1 btn smallBtn" onClick={this.getGridRows}>{Resources['search'][currentLanguage]}</button>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>

        )
    }

}
export default withRouter(ExpensesStatus)
