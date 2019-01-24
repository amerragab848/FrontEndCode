import React, { Component } from 'react';
import Resources from '../../resources.json';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class InputMelcous extends Component {
        constructor(props) {
                super(props)
                console.log(this.props)
        }
        render() {


                return (


                        <div className={this.props.fullwidth == 'true' ? 'fullWidthWrapper textLeft' : 'fillter-status fillter-item-c'}>

                                <label className="control-label">{Resources[this.props.title][currentLanguage]}</label>
                                <div className="inputDev ui input">
                                        <input type="text" className="form-control" id="lastname1"
                                                placeholder={this.props.placeholderText == null ? ' ' : Resources[this.props.placeholderText][currentLanguage] }
                                                fullwidth={this.props.fullwidth}
                                                value={this.props.value} 
                                                defaultValue={this.props.defaultValue}
                                                onChange={this.props.inputChangeHandler}></input>
                                </div>
                        </div>
                )
        }
}
export default InputMelcous;