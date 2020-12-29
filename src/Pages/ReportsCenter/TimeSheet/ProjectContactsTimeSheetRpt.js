import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import dataservice from "../../../Dataservice";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import moment from "moment";
import ExportDetails from "../ExportReportCenterDetails";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class projectContactsTimeSheetRpt extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            companiesList: [],
            selectedCompany: null,
            rows: [],
            finishDate: moment(),
            startDate: moment(),
            timeSheetObj: null
        }

        if (!Config.IsAllow(3715)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });

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
                "field": "contactName",
                "title": Resources.ContactName[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "hours",
                "title": Resources.hours[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }];

        this.fields = [{
            title: Resources["CompanyName"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["startDate"][currentLanguage],
            value: this.state.startDate,
            type: "D"
        }, {
            title: Resources["finishDate"][currentLanguage],
            value: this.state.finishDate,
            type: "D"
        }];
    }

    componentDidMount() {
        this.getDataList('GetProjectCompanies?accountOwnerId=2', 'companyName', 'id', 'companiesList');
        if (Config.IsAllow(3737)) {
            this.columns.push({
                "field": "cost",
                "title": Resources["cost"][currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            })
        }
    }

    getGridRows = () => {
        this.setState({ isLoading: true });
        let obj = {
            companyId: this.state.selectedCompany != null ? this.state.selectedCompany.value : null,
            startDate: moment(this.state.startDate),
            finishDate: moment(this.state.finishDate)
        }
        let url = this.state.selectedCompany != null ? 'GetProjectcontactsTimeSheetByCompanyId' : 'GetProjectcontactsTimeSheetAll'
        Api.post(url, obj).then((res) => {
            if (res.length > 0) {
                this.setState({
                    rows: res, isLoading: false
                });
            }
            else {
                this.setState({
                    rows: [], isLoading: false
                });
            }
        }).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    setData = (name, value) => {
        this.setState({ [name]: value })
    }

    getDataList = (api, title, value, targetState) => {

        this.setState({ isLoading: true });
        dataservice.GetDataList(api, title, value).then(result => {
            this.setState({
                [targetState]: result,
                isLoading: false
            });
        }).catch(() => {
            this.setState({
                [targetState]: [],
                isLoading: false
            });
            toast.error('somthing wrong')
        })
    }


    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom ref='custom-data-grid' gridKey="ProjectContactsTimeSheetRpt" groups={[]} data={this.state.rows || []} cells={this.columns}
                pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = <ExportDetails fieldsItems={this.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.projectContactsTimeSheetRpt[currentLanguage]} />

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.projectContactsTimeSheetRpt[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className="proForm reports__proForm">
                    <div className="linebylineInput valid-input">
                        <Dropdown title="CompanyName" name="companyName" index="companyName"
                            data={this.state.companiesList} selectedValue={this.state.selectedCompany}
                            handleChange={event => {
                                this.setState({ selectedCompany: event });
                                this.fields[0].value = event.label
                            }}
                            isClear={true}
                        />
                    </div>

                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker title='startDate'
                            startDate={this.state.startDate}
                            handleChange={e => { this.setData('startDate', e); this.fields[1].value = e }} />
                    </div>
                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker title='finishDate'
                            startDate={this.state.finishDate}
                            setDate={e => { this.setData('finishDate', e); this.fields[2].value = e }} />
                    </div>
                    <button className="primaryBtn-1 btn smallBtn" onClick={this.getGridRows}>{Resources['search'][currentLanguage]}</button>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

} export default projectContactsTimeSheetRpt;
