import React from 'react'

function InputMelcous (props) {
    return (
        
        <div className="form-group fillterinput fillter-item-c">

        <label className="control-label">{props.title}</label>

        <div className="inputDev ui input">
            <input  type="text" className="form-control" id="lastname1" 
            placeholder="Type Comment" onChange={props.inputChangeHandler}></input>
           
        </div>

    </div>
    )
}

export default InputMelcous;