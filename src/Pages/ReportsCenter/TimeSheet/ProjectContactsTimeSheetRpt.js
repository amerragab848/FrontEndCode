import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import dataservice from "../../../Dataservice";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import moment from "moment";
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
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "contactName",
                name: Resources["ContactName"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "hours",
                name: Resources["hours"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ];
    }

    componentDidMount() {
        this.getDataList('GetProjectCompanies?accountOwnerId=2', 'companyName', 'id', 'companiesList');
        if (Config.IsAllow(3737)) {
            this.columns.push({
                key: "cost",
                name: Resources["cost"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
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
            <GridSetup rows={this.state.rows} showCheckbox={false}
                selectedCopmleteRow={true}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={Resources['projectContactsTimeSheetRpt'][currentLanguage]} />
            : null

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
                            }}
                            isClear={true}
                        />
                    </div>

                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker title='startDate'
                            startDate={this.state.startDate}
                            handleChange={e => this.setData('startDate', e)} />
                    </div>
                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker title='finishDate'
                            startDate={this.state.finishDate}
                            setDate={e => this.setData('finishDate', e)} />
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
