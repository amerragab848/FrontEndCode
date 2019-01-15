import React, { Component } from 'react'
import Api from '../../api'
import Dropdown from "./DropdownMelcous";
import InputMelcous from './InputMelcous'
import validations from './validationRules';

const _ = require('lodash')

class CreateTransmittal extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <div className="dropWrapper">
                <InputMelcous title="Subject" value="add subject"
                 placeholderText='Subject'
                //   inputChangeHandler={this.inputChangeHandler} 
                />
                <Dropdown title="To Company"
                //   data={this.state.To_Cc_CompanyData} handleChange={this.To_company_handleChange}
                //   className={this.state.toCompanyClass} message={this.state.toCompanyErrorMess} 
                />
                <Dropdown title="Attention"
                //data={this.state.AttentionData} handleChange={this.Attention_handleChange}
                //className={this.state.attentionClass} message={this.state.attentionErrorMess}
                />
                <Dropdown title="Priority"
                //data={this.state.PriorityData} handleChange={this.Priority_handelChange}
                //className={this.state.priorityClass} message={this.state.priorityErrorMess}
                />
                <Dropdown title="Submitted For"
                //data={this.state.PriorityData} handleChange={this.Priority_handelChange}
                //className={this.state.priorityClass} message={this.state.priorityErrorMess}
                />




{/* 
                 <div className="documents-temp">
                    <div className="doc-container">
                        <div className="">
                            <div className="subiTabsContent">
                                <div className="document-fields"> */}
                                    <form className="proForm">
                                        <div className="linebylineInput">
                                            <label className="control-label">Status</label>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio" className="hidden" name="Close-open" />
                                                <label>Opened</label>
                                            </div>
                                            <div className="ui checkbox radio radioBoxBlue checked">
                                                <input type="radio" className="hidden" name="Close-open" />
                                                <label>Closed</label>
                                            </div>
                                        </div>
                                    </form>
                                {/* </div>
                            </div>
                        </div>
                    </div>
                </div>  */}


                <div className="dropBtn">
                    <button className="primaryBtn-1 btn"
                    //onClick={this.clickHandler}
                    >Submit</button>
                </div>
            </div>

        )
    }

}
export default CreateTransmittal;