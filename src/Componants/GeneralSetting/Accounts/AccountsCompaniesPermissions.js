import React, { Component, Fragment } from "react";
import Api from "../../../api";
import "../../../Styles/css/semantic.min.css";
import "../../../Styles/scss/en-us/layout.css";
import Resources from "../../../resources.json";
import DropdownMelcous from '../../OptionsPanels/DropdownMelcous'
import { withRouter } from "react-router-dom";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let id = null;



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


    CompanieshandleChange = (e) => {
        console.log(e)
        this.setState({ data: e })
    }

    SaveCompanies = () => {
        this.state.data.forEach(function (item) {
            var obj = {};
            obj.accountId = id
            obj.companyId = item.value
            obj.deletable = true
            Api.post("AdduserCompaniesList", obj)
        })
        this.props.history.push({
            pathname: '/Accounts',
        })
    }
    render() {
        return (

            <div className="mainContainer">
                <h3> {Resources['accountsCompaniesPermissions'][currentLanguage]}</h3>
                {this.state.render === true ?
                    <Fragment>
                        <DropdownMelcous title='UserCompanies' data={this.state.CompaniesData}
                            selectedValue={this.state.CompaniesDefaultData}
                            handleChange={this.CompanieshandleChange} placeholder='UserCompanies' isMulti={true} />
                        <div className="gridfillter-container">

                            <div className="dropBtn">
                                <button className="primaryBtn-1 btn smallBtn" onClick={this.SaveCompanies}>
                                    {Resources['save'][currentLanguage]}</button>
                            </div>
                        </div>
                    </Fragment> : null}
            </div>
        )
    }

}
export default withRouter(AccountsCompaniesPermissions)