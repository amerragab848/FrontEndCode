import React from 'react';
import PropTypes from 'prop-types';
import ConnectionContext from './Context';

class ConnectionProvider extends React.Component {
    
    static propTypes = {
        children: PropTypes.node.isRequired,
    };

    state = {
        isDisconnected: false ,
        setConnection: () => this.setConnection(),

    }

    async componentDidMount() {
        const condition = navigator.onLine ? 'online' : 'offline';
        if (condition === 'online') {
            const webPing = setInterval(
                () => {
                    fetch('//google.com', {
                        mode: 'no-cors',
                    })
                        .then(() => {
                            this.setState({ isDisconnected: false }, () => { 
                            });
                        }).catch(() => this.setState({ isDisconnected: true }))
                }, 300000);
            return;
        }
        //this.setState({ isDisconnected: false });
    }

    setConnection = () => {
        const condition = navigator.onLine ? 'online' : 'offline';
        if (condition === 'online') {
            const webPing = setInterval(
                () => {
                    fetch('//google.com', {
                        mode: 'no-cors',
                    }).then(() => {
                            this.setState({ isDisconnected: false }, () => { 
                            });
                        }).catch(() => this.setState({ isDisconnected: true }))
                }, 300000);
            return ;
        }

    };
    render() { 

        return (
            <ConnectionContext.Provider value={this.state}>
                {this.props.children}
            </ConnectionContext.Provider>
        );
    }
}

export default ConnectionProvider;
