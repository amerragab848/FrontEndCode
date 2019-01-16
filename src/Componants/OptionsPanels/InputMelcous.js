import React from 'react'

function InputMelcous (props) {
    return (
        
        <div className="fullWidthWrapper textLeft">

        <label className="control-label">{props.title}</label>

        <div className="inputDev ui input">
            <input  type="text" className="form-control" id="lastname1" 
            placeholder={props.placeholderText} value={props.text} onChange={props.inputChangeHandler}></input>
           
        </div>

    </div>
    )
}

export default InputMelcous;