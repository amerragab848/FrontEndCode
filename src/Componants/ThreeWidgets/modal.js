import React from "react";
import Modal from "react-responsive-modal";

const styles = {
    fontFamily: "sans-serif",
    textAlign: "center"
};

class Modales extends React.Component {
    render() {
        return (
            <div style={styles}>
                <Modal open={this.props.opened} onClose={this.props.closed}>
                    <h2>Simple centered modal</h2>
                    <p>{this.props.id}</p>
                    <button onClick={this.props.closed}>Close Modal</button>
                </Modal>
            </div>
        );
    }
}

export default Modales;
