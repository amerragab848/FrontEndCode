import React, { Component } from 'react'; 
import Resources from '../../resources.json';
import Api from '../../api';
   
import Modal from 'react-responsive-modal';





var hoverPointer = {
    cursor: 'Pointer'
}

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class Widgets extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            open: false,
            detailsData: []
        }
    };

    componentDidMount() {
        Api.get(this.props.api).then(result => {
            this.setState({
                value: result
            });
        }); 

         
    }

    onOpenModal = () => {
        if (this.props.isModal === 'true') {
            this.setState({ open: true });
            Api.get(this.props.apiDetails).then(res => {
                this.setState({
                    detailsData: res
                });
            });
        }
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    render() {
        const { open } = this.state;

            return (
            <div>
                <div>
                    <Modal open={open} onClose={this.onCloseModal} center>              
                    </Modal>
                </div>
                <div className="summerisItem">
                    <div className="content">
                        <h4 className="title">{Resources[this.props.title][currentLanguage]}</h4>
                        <p className="number" style={this.props.isModal === 'true' ? hoverPointer :{} } onClick={this.onOpenModal}>{this.state.value}</p>
                    </div>
                </div>
            </div>
            )
    }
}

export default Widgets;