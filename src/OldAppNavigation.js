import React, { Component } from "react";

class OldAppNavigation extends Component {
    constructor (props) {
        super(props);

        if (this.props.location.state) {
            localStorage.setItem('old-app', JSON.stringify(this.props.location.state.data));
        }

        this.state = {
            data: this.props.location.state ? this.props.location.state.data : JSON.parse(localStorage.getItem('old-app'))
        };
    }

    componentWillMount() {
        let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        let eventer = window[eventMethod];
        let messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        eventer(messageEvent, (e) => this.RecieveMsg(e), false);
    }

    RecieveMsg(e) {
        switch (e.message) {
            // case 'back':
            //     this.props.history.goBack();
            //     break;

            default:
                this.props.history.goBack();

                break;
        }


    }

    render() {
        return (
            <div className="mainContainer">
                <iframe style={{"position":"relative","border":"0","minHeight":"100vh","width":"100%"}} {...this.state.data} id="old-app" ref={(iframe) => this.iframe = iframe}>
                </iframe>
            </div>
        );
    }
}

export default OldAppNavigation;
