import React, { Component } from 'react';
import Resources from '../../resources.json';
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import dataService from '../../Dataservice'
import { toast } from "react-toastify";
import Config from "../../Services/Config.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import Export from "../../Componants/OptionsPanels/Export";
import sumBy from 'lodash/sumBy';
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";


let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class ProjectTimeSheet extends Component {
    constructor(props) {

        super(props)

        this.columnsGrid = [
            {
                field: "contactName",
                title: Resources["ContactName"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "text"
            },
            {
                field: "companyName",
                title: Resources["CompanyName"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "totalExpenseValue",
                title: Resources["timehours"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "total",
                title: Resources["totalCost"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            }
           
           
        ];

        this.state = {
            projectId: this.props.projectId || localStorage.getItem("lastSelectedProject"),
            projectName: this.props.projectName || localStorage.getItem("lastSelectedprojectName"),
            totalHours: 0,
            totalCost: 0,
            isLoading: true,
            rows: []
        }

        if (!Config.IsAllow(407)) {
            toast.warning(Resources['missingPermissions'][currentLanguage])
            this.props.history.push('/');
        }
    }

    componentDidMount() {
        this.props.actions.FillGridLeftMenu();
        dataService.GetDataGrid(`GetTimeSheetForProject?projectId=${this.state.projectId}`).then(result => {

            if (result.length > 0) {

                const totalHours = sumBy(result, function (item) {
                    return item.totalExpenseValue
                })

                const totalCost = sumBy(result, function (item) {
                    return item.total
                })

                this.setState({
                    rows: result,
                    totalHours,
                    totalCost
                });
            }
        })

        this.setState({ isLoading: false });
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
    }

    render() {
        const dataGrid = this.state.isLoading === false ?
            (
                this.state.rows.length > 0 ? <GridCustom  cells={this.columnsGrid} data={this.state.rows}  groups={[]}  pageSize={this.state.rows.length}  actions={[]}   rowActions={[]}  rowClick={() => { }}      /> : null
               
                
               
               
            ) : (
                <LoadingSection />
            );

        const btnExport = this.state.isLoading === false ?
            (
                this.state.rows.length > 0 ? <Export
                    rows={this.state.isLoading === false ? this.state.rows : []}
                    columns={this.columnsGrid}
                    fileName={Resources.timesheetLog[currentLanguage]}
                /> : null
            ) : null;

        return (
            <div className="mainContainer">
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>
                    <HeaderDocument projectName={this.state.projectName} docTitle={Resources.timesheetLog[currentLanguage]} moduleTitle={Resources['reportsCenter'][currentLanguage]} />
                    <div className="doc-container">
                        <div className="step-content">
                            <div className="subiTabsContent">
                                <div className="document-fields">
                                    {this.state.isLoading ? <LoadingSection /> : null}
                                    <form id="signupForm1" className="proForm datepickerContainer" noValidate="novalidate">

                                        <div className="linebylineInput fullInputWidth">
                                            <label className="control-label">
                                                {Resources.totalHours[currentLanguage]}
                                            </label>
                                            <div className="ui input inputDev">
                                                <input type="text" className="form-control" id="totalHours"
                                                    value={this.state.totalHours}
                                                    name="totalHours" readOnly
                                                    placeholder={Resources.totalHours[currentLanguage]} />
                                            </div>
                                        </div>

                                        <div className="linebylineInput fullInputWidth">
                                            <label className="control-label">
                                                {Resources.totalCost[currentLanguage]}
                                            </label>
                                            <div className="ui input inputDev">
                                                <input type="text" className="form-control" id="totalCost"
                                                    value={this.state.totalCost}
                                                    name="totalCost" readOnly
                                                    placeholder={Resources.totalCost[currentLanguage]} />
                                            </div>
                                        </div>

                                    </form>
                                </div>
                                <div className={"grid-container " + (this.state.rows.length === 0 ? "griddata__load" : " ")}>
                                    <div className="submittalFilter readOnly__disabled">
                                        <div className="subFilter">
                                            <h3 className="zero"></h3>
                                        </div>
                                        {btnExport}
                                    </div>
                                    {dataGrid}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state, ownProps) {
    return {
        document: state.communication.document,
        isLoading: state.communication.isLoading
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTimeSheet)