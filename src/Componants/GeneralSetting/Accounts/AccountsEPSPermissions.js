import React, { Component, Fragment } from "react";
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
        if (config.IsAllow(1001103)) {
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
        this.setState({ data: e })
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

    goBack = () => {
        this.props.history.goBack()
    }

    render() {
        return (
            <div className="mainContainer dropdownMulti white-bg">
                <div className="documents-stepper cutome__inputs noTabs__document">
                    <div className="submittalHead">
                        <h2 className="zero"> {Resources['accountsEPSPermissions'][currentLanguage]}</h2>
                        <div className="SubmittalHeadClose" onClick={this.goBack}>
                            <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                        <g id="Group-2">
                                            <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                                <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                                                    <g id="Group">
                                                        <circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
                                                        <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z" id="Combined-Shape" fill="#858D9E" fillRule="nonzero"></path>
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
                        <div className="step-content noBtn__footer">
                            <div className="subiTabsContent">
                                <div className="document-fields">
                                    <div className="proForm first-proform">
                                        {this.state.render === true ?
                                            <Fragment>
                                                <div className="letterFullWidth">
                                                    <DropdownMelcous title='chooseEPS' data={this.state.EPSData}
                                                        selectedValue={this.state.EPSDefaultData}
                                                        handleChange={this.EPShandleChange} placeholder='chooseEPS' isMulti={true} closeMenuOnSelect={false} />
                                                </div>
                                                <div className="dropBtn">
                                                    <button className="primaryBtn-2 btn smallBtn" onClick={this.goBack}>Back</button>
                                                    <span className="border" ></span>
                                                    <button className="primaryBtn-1 btn smallBtn" onClick={this.SaveEps}>
                                                        {Resources['save'][currentLanguage]}</button>
                                                </div>
                                            </Fragment>
                                            : null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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