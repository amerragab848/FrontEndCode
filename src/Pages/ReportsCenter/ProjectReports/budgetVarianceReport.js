import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import { Formik, Form } from 'formik';
import BarChartComp from '../TechnicalOffice/BarChartComp'
import Export from "../../../Componants/OptionsPanels/Export"; 
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";

import * as Yup from 'yup';
import dataservice from "../../../Dataservice";
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
//const _ = require('lodash')

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const projectSchema = Yup.object().shape({
    selectedProject: Yup.string()
        .required(Resources['projectRequired'][currentLanguage])
        .nullable(true),
});
class budgetVarianceReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            showChart: false,
            rows: [],
            actualTotal: 0,
            totalBalance: 0,
            totalBudget: 0,
            pageSize: 200,
            projectList: [], noClicks: 0,
            selectedProject: { label: Resources.projectRequired[currentLanguage], value: "0" },
        }

        this.columns = [
            {
                field: "projectName",
                title: Resources["projectName"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            }, {
                field: "budgetedExpenseValue",
                title: Resources["budget"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "actual",
                title: Resources["actualTotal"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "balance",
                title: Resources["balance"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },

        ];

        if (!Config.IsAllow(3683)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

    }

    componentWillMount() {
        dataservice.GetDataList('ProjectProjectsGetAll', 'projectName', 'id').then(result => {
            this.setState({
                projectList: result
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })
    }

    getChartData = () => {
        this.setState({ isLoading: true })
        Api.get('GetBudgetVarianceByProject?projectId=' + this.state.selectedProject.value).then((result) => {
            this.setState({ showChart: true })
            if (result.length > 0) {
                let catag = [];
                let valuesActual = [];
                let valuesExpenses = [];
                let series = [];
                let stacks = ["Actual Total", "Budget Expenses"];
                let actual = 0;
                let balance = 0;
                let budget = 0;
                result.forEach(function (item) {
                    catag.push(item.expenseTypeName);
                });
                result.forEach(function (item) {
                    valuesActual = [];
                    valuesExpenses = [];
                    series = [];
                    actual = 0;
                    balance = 0;
                    budget = 0;
                    result.forEach(function (item2) {
                        if (item2.expenseTypeName) {
                            valuesActual.push(item2.actual);
                            valuesExpenses.push(item2.budgetedExpenseValue);
                            actual = actual + parseFloat(item2["actual"]);
                            balance = balance + parseFloat(item2["balance"]);
                            budget = budget + parseFloat(item2["budgetedExpenseValue"]);
                        }
                    });
                });

                result.forEach(function (item2) {
                    series.push({ stack: stacks[0], name: item2.expenseTypeName, total: item2.actual });
                    series.push({ stack: stacks[1], name: item2.expenseTypeName, total: item2.budgetedExpenseValue });
                });

                let xAxis = { categories: catag }
                let noClicks = this.state.noClicks
                this.setState({ isLoading: false, series: series, xAxis, noClicks: noClicks + 1, showChart: true, actualTotal: actual, totalBalance: balance, totalBudget: budget, rows: result });
            }
            else {
                this.setState({ isLoading: false, series: [], xAxis: [], noClicks: 0, showChart: false, actualTotal: 0, totalBalance: 0, totalBudget: 0, rows: [] })
            }
        }).catch(() => {
            this.setState({ isLoading: false, rows: [] })
        })
    }
    render() {
        const Chart = this.state.showChart ?
            (<BarChartComp
                noClicks={this.state.noClicks}
                type={'spline'}
                series={this.state.series}
                xAxis={this.state.xAxis}
                multiSeries="yes"
                title={Resources['budgetVariance'][currentLanguage]} yTitle={Resources['total'][currentLanguage]} />) : null

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                key="budgetVarianceReport"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />
            
        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'budgetVarianceReport'} />
            : null
        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.budgetVarianceReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm' style={{ marginBottom: '0' }}>
                    <Formik
                        initialValues={{
                            selectedProject: '',
                        }}
                        enableReinitialize={true}
                        validationSchema={projectSchema}
                        onSubmit={() => {
                            this.getChartData()
                        }}>
                        {({ errors, touched, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                            <Form onSubmit={handleSubmit} className='proForm reports__proForm'>
                                <div className="linebylineInput valid-input">
                                    <Dropdown title='Project' data={this.state.projectList}
                                        name='selectedProject'
                                        selectedValue={this.state.selectedProject}
                                        onChange={setFieldValue}
                                        handleChange={e => this.setState({ selectedProject: e })}
                                        onBlur={setFieldTouched}
                                        error={errors.selectedProject}
                                        touched={touched.selectedProject}
                                        value={values.selectedProject} />
                                </div>
                                <button className="primaryBtn-1 btn smallBtn" type='submit'>{Resources['search'][currentLanguage]}</button>
                            </Form>
                        )}
                    </Formik>
                </div>
                {this.state.showChart == true ?
                    <div className="row">
                        {Chart}
                    </div> : null}
                <div className='proForm reports__proForm'>
                    <div className="linebylineInput valid-input">
                        <label class="control-label">{Resources.actualTotal[currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input type="text" id="actualTotal"
                                className="form-control"
                                value={this.state.actualTotal} name="actualTotal"
                                placeholder={Resources.actualTotal[currentLanguage]} />
                        </div>
                    </div>
                    <div className="linebylineInput valid-input">
                        <label class="control-label">{Resources.balance[currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input type="text" id="balance"
                                className="form-control"
                                value={this.state.totalBalance} name="balance"
                                placeholder={Resources.balance[currentLanguage]} />
                        </div>
                    </div>
                    <div className="linebylineInput valid-input">
                        <label class="control-label">{Resources.totalBudgeted[currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input type="text" id="totalBudgeted"
                                className="form-control"
                                value={this.state.totalBudget} name="totalBudgeted"
                                placeholder={Resources.code[currentLanguage]} />
                        </div>
                    </div>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>


        )
    }

}


export default budgetVarianceReport
