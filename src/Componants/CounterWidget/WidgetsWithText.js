import React, { Component} from 'react'; 
import axios from 'axios';
import Resources from '../../resources.json';
import '../../App.css';
import "../../Styles/scss/en-us/dashboard.css";

let currentLanguage = localStorage.getItem('lang')==null? 'en' : localStorage.getItem('lang');

let DefaultUrl = 'https://demov4services.procoor.com/PM/api/Procoor/';
let axiosConfig = {
    headers: {
        'authorization': 'Bearer 9JkBsJK5cKPJSKWnTbnVL6X9JgCFAg03Vcufd84BLppnormpEcCwWAmOOarecFs8_Pd_ggljMAgJbOOdBUAAmCp6ekCl_WucTNUxM7ncGF4eOWtO2VnpGf7pVg9e9C-W3YU_gZIuXNawspCLpdY1eZQM4TmQdOs8UhHPmjohrLNseGKjaHYdEtSe7GBI6WC1cbEGTf-mTMoxNLtXtewE1EI-0-3ixF6qwDxF1EQjte1Dg8MGIAgGR2mniDt_mshe5KX_reXnN0W07BL31YwIesYycyJGWr_ds-ym0F6n5gAvgpwaLYHf9Be1KnD9io6Y445eMJm3AfP-vOGicgrdVggKDSl9ec5oKMQRcctO1I24rRinTpf0QwlC4lX9_s4FRLv7pKL4Cw9AoDnmUBIx5gGvIjWtwWLi8vnG_fEaW6YseVAF'
    }
};

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
        axios.get(DefaultUrl + this.props.api, axiosConfig).then(response => {
            let _value =this.props.value.split('-');
            let _total =this.props.total.split('-');
 
            this.setState({
                count: response.data[_value[1]][_value[0]],
                total: response.data[_total[1]][_total[0]] ,         
            });
        });  
    }

    render() {   
        return ( 
            <div className="summerisItem">  
            <div className="content">
            <h4 className="title">{Resources[this.props.title][currentLanguage]}</h4>
            <p className="number">{this.state.count}</p>
            <sub>Out Of {this.state.total}</sub> 
            </div>
            </div>
        )
    }
}
export default WidgetsWithText;