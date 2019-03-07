import React, { Component } from 'react';
import Resources from '../../resources.json';
import Api from '../../api'; 
import Modal from 'react-responsive-modal';
 
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class WidgetsWithText extends Component {
 
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            total: 0,
            open: false,
            detailsData: []
        }


        console.log(props);
    };

    componentDidMount() {

        this.abortController = new AbortController();

        let signal = this.abortController.signal;

        Api.get(this.props.props.api, signal).then(data => {
            let _value = this.props.props.value.split('-');
            let _total = this.props.props.total.split('-');

            this.setState({
                count: data[_value[1]][_value[0]] != null ? data[_value[1]][_value[0]]:0,
                total: data[_total[1]][_total[0]] != null ? data[_total[1]][_total[0]]:0,
            });
        });
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    onOpenModal = () => { 
        this.setState({ open: true });
        Api.get(this.props.apiDetails).then(res => {
            this.setState({
                detailsData: res
            });
        }); 
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };


    render() {
        const { open } = this.state;
        return (
            <div>
                <div className="summerisItem">
                    <div className="content">
                        <h4 className="title" >{Resources[this.props.title][currentLanguage]}</h4>
                        <p className="number" onClick={this.onOpenModal}>{this.state.count}
                            <sub>Out Of {this.state.total}</sub>
                        </p>
                    </div>
                </div>
                <div>
                <Modal open={open} onClose={this.onCloseModal} center>
                    
                </Modal>
                </div>
            </div> 
        )
    }
}
export default WidgetsWithText;