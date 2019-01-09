import React, { Component} from 'react';  
import Resources from '../../resources.json';
import Api from '../../api'; 
import "../../Styles/scss/en-us/dashboard.css";

let currentLanguage = localStorage.getItem('lang')==null? 'en' : localStorage.getItem('lang');
 
class WidgetsWithText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: '',
            total: '',
            detailsData:[] 
        }
    };

    componentDidMount() {
         Api.get(this.props.api).then(data => { 
            let _value =this.props.value.split('-');
            let _total =this.props.total.split('-');
 
            this.setState({
                count: data[_value[1]][_value[0]],
                total: data[_total[1]][_total[0]] ,         
            });
        });  
    }

    render() {   

        return ( 
            <div className="summerisItem">  
            <div className="content">
            <h4 className="title">{Resources[this.props.title][currentLanguage]}</h4>
            <p className="number">{this.state.count}
                <sub>Out Of { Api.ConvertNumbers(this.state.total, 2)}</sub> 
            </p>
            
            </div>
            </div>
        )
    }
}
export default WidgetsWithText;