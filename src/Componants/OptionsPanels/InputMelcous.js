import React from 'react';

function InputMelcous (props) {

    return (

        
        <div className={props.fullwidth =='true'? 'fullWidthWrapper textLeft':'fillter-status fillter-item-c'}
        >
        <label className="control-label">{props.title}</label>
        <div className="inputDev ui input">
            <input  type="text" className="form-control" id="lastname1" 
            placeholder={props.placeholderText} 
            defaultValue={props.defulatValue}
             value={ props.value}
             fullwidth={props.fullwidth} 
             onChange={props.inputChangeHandler}></input>
        </div>

    </div>
    )
}

export default InputMelcous;