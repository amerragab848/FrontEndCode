import React, { Component, Fragment } from "react";
import Api from "../../../api";
import config from "../../../Services/Config";
import Resources from "../../../resources.json";
import DropdownMelcous from '../../OptionsPanels/DropdownMelcous'
import { withRouter } from "react-router-dom";
import HeaderDocument from '../../OptionsPanels/HeaderDocument'

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let id = 0;

class AccountsCompaniesPermissions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CompaniesData: [],
            CompaniesDefaultData: [],
            data: [],
            render: false
        }
    }
    componentDidMount() {
        if (config.IsAllow(1001105)) {
            const query = new URLSearchParams(this.props.location.search);
            for (let param of query.entries()) {
                id = param[1];
            }
            let Data = []
            Api.get("GetCompaniesForAccounts?accountId=" + id).then(result => {
                (result).forEach(item => {
                    var obj = {};
                    obj.label = item['companyName'];
                    obj.value = item['id'];
                    Data.push(obj);
                });
                this.setState({
                    CompaniesData: [...Data]
                });
            }).catch(ex => {
            });

            let Data2 = []
            Api.get("GetuserCompanies?accountId=" + id).then(result => {
                (result).forEach(item => {
                    var obj = {};
                    obj.label = item['companyName'];
                    obj.value = item['companyId'];
                    Data2.push(obj);
                });
                this.setState({
                    CompaniesDefaultData: [...Data2],
                    render: true
                });
            }).catch(ex => {
            });
        }
        else {
            alert('You Don`t Have Permissions')
            this.props.history.goBack()
        }
    }


    CompanieshandleChange = (e) => {
        console.log(e)
        this.setState({ data: e })
    }

    SaveCompanies = () => {

        this.state.data.forEach(function (item) {
            var obj = {};
            obj.accountId = parseInt(id)
            obj.companyId = item.value
            //  obj.deletable = true
            Api.post("AdduserCompaniesList", obj)
        })


    }
    goBack = () => {
        this.props.history.goBack()
    }
    render() {
        return (

            <div className="mainContainer main__withouttabs dropdownMulti">
                <div className="documents-stepper noTabs__document readOnly_inputs">
                    <HeaderDocument docTitle={Resources['accountsCompaniesPermissions'][currentLanguage]} />
                    <div className="doc-container">
                        <div className="step-content">
                            <div id="step1" className="step-content-body">
                                <div className="subiTabsContent">
                                    <div className="document-fields proForm">
                                        {this.state.render === true ?
                                            <Fragment>
                                                <DropdownMelcous title='UserCompanies' data={this.state.CompaniesData}
                                                    selectedValue={this.state.CompaniesDefaultData}
                                                    handleChange={this.CompanieshandleChange} placeholder='UserCompanies' isMulti={true} closeMenuOnSelect={false} />

                                                <div className="dropBtn">
                                                    <button className="primaryBtn-2 btn smallBtn" onClick={this.goBack}>Back</button>
                                                    <span className="border" ></span>
                                                    <button className="primaryBtn-1 btn smallBtn" onClick={this.SaveCompanies}>
                                                        {Resources['save'][currentLanguage]}</button>
                                                </div>
                                            </Fragment> : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
export default withRouter(AccountsCompaniesPermissions)