import React, { Component, Fragment} from 'react';
import Resources from '../../resources.json';
import Api from '../../api';
//import '../../App.css';
import "../../Styles/scss/en-us/dashboard.css";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class Widgets extends Component {
    constructor(props) {

        super(props);
        this.state = {
            value: '0'
        }
    };

    componentDidMount() {
        Api.get(this.props.api).then(result => {
            this.setState({
                value: result
            });
        });   
} 

    render() {
        
        return (       
            <div className="summerisItem">  
                <div className="content">
                <h4 className="title">{Resources[this.props.title][currentLanguage]}</h4>
                <p className="number">{ Api.ConvertNumbers(this.state.value, 2)}</p>
                </div>
            </div>
        )
    }
}

export default Widgets;