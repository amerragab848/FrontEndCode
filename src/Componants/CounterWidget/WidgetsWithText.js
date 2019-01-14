import React, { Component } from 'react';
import Resources from '../../resources.json';
import Api from '../../api';
import "../../Styles/scss/en-us/dashboard.css";
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
    };

    componentDidMount() {
        Api.get(this.props.api).then(data => {
            let _value = this.props.value.split('-');
            let _total = this.props.total.split('-');

            this.setState({
                count: data[_value[1]][_value[0]],
                total: data[_total[1]][_total[0]],
            });
        });
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
                            <sub>Out Of {Api.ConvertNumbers(this.state.total, 2)}</sub>
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