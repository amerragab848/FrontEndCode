import React, { Component } from "react";

class OldAppNavigation extends Component {
    constructor (props) {
        super(props);

        if (this.props.location.state) {
            localStorage.setItem('old-app', JSON.stringify(this.props.location.state.data));
        }

        this.state = {
            data: this.props.location.state ? this.props.location.state.data : JSON.parse(localStorage.getItem('old-app')),
            height: '100%'
        };
    }

    componentWillMount() {
        let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        let eventer = window[eventMethod];
        let messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        eventer(messageEvent, (e) => this.RecieveMsg(e), false);
    }

    RecieveMsg(e) {
        if(e && e.data) {
            try{
                let message = JSON.parse(e.data);

                switch (message.type) {
                    case 'back':
                        this.props.history.goBack();
                        break;
                    case 'scrollHeight':
                        this.setState({
                            height: message.value + 'px'
                        });
                        break;
                    default:
                        break;
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    render() {
        return (
            <div className="mainContainer">
                <iframe style={{"position":"relative","border":"0","minHeight":"100vh","width":"100%", height: this.state.height}} {...this.state.data} id="old-app" ref={(iframe) => this.iframe = iframe}>
                </iframe>
            </div>
        );
    }
}

export default OldAppNavigation;
