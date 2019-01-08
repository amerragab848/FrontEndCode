import React, { Component } from 'react';
import Resources from '../../resources.json';
import Api from '../../api';
import '../../App.css';

let currentLang = localStorage.getItem('lang');

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
             <div className="col-xs-3 mt-5"> 
                <div className="card">
                  <div className="card-body">
                  <h5 className="card-title">{Resources[this.props.title][currentLang]}</h5>
                    <div className="text_counter">
                      <span>{this.state.value}</span>        
                    </div>
                </div>
              </div>
            </div>
        );
    }
}

export default Widgets;