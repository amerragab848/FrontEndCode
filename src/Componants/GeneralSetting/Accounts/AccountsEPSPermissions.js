import React, { Component,Fragment } from "react";
import Api from "../../../api";
import Resources from "../../../resources.json";
import DropdownMelcous from '../../OptionsPanels/DropdownMelcous'
import { withRouter } from "react-router-dom";
import config from "../../../Services/Config";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let id = null;
class AccountsEPSPermissions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EPSData: [],
            EPSDefaultData: [],
            data: []
        }
    }
    componentDidMount() {
        if (config.IsAllow(1001103)) 
        {
        const query = new URLSearchParams(this.props.location.search);
        for (let param of query.entries()) {
            id = param[1];
        }
        let Data = []
        Api.get("GetProjectsEpsByAccountId?accountId=" + id).then(result => {
            (result).forEach(item => {
                var obj = {};
                obj.label = item['title'];
                obj.value = item['id'];
                Data.push(obj);
            });
            this.setState({
                EPSData: [...Data]
            });
        }).catch(ex => {
        });


        let Data2 = []
        Api.get("GetAccountsEpsByAccountId?accountId=" + id).then(result => {
            (result).forEach(item => {
                var obj = {};
                obj.label = item['title'];
                obj.value = item['epsId'];
                Data2.push(obj);
            });
            this.setState({
                EPSDefaultData: [...Data2],
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


    EPShandleChange = (e) => {
        console.log(e)
        this.setState({data: e })
    }

    SaveEps = () => {
        this.state.data.forEach(function (item) {
            var obj = {};
            obj.accountId = id
            obj.epsId = item.value
            obj.title = false
            obj.titleEn = ''
            Api.post("AddAccountsEps", obj)
        })
    }
    
    goBack=()=>{
        this.props.history.goBack()
    }

    render() {
        return (
            <div className="mainContainer dropdownMulti">
             <h3> {Resources['accountsEPSPermissions'][currentLanguage]}</h3>
             {this.state.render === true ?
                    <Fragment>
                <DropdownMelcous title='chooseEPS' data={this.state.EPSData}
                    selectedValue={this.state.EPSDefaultData}
                    handleChange={this.EPShandleChange} placeholder='chooseEPS' isMulti={true} />
             

                    <div className="dropBtn">
                    <button className="primaryBtn-2 btn smallBtn" onClick={this.goBack}>Back</button>
                            <span className="border" ></span>
                        <button className="primaryBtn-1 btn smallBtn" onClick={this.SaveEps}>
                            {Resources['save'][currentLanguage]}</button>
                
                </div>
                </Fragment> : null}
            </div>
        )
    }

    GetData = (url, label, value, currState) => {
        let Data = []
        Api.get(url).then(result => {
            (result).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];
                Data.push(obj);
            });
            this.setState({
                [currState]: [...Data]
            });
        }).catch(ex => {
        });
    }
}
export default withRouter(AccountsEPSPermissions)