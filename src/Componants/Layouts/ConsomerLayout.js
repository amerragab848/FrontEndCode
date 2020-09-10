import React from 'react';

import ConnectionContext from '../../Componants/Layouts/Context';
import { toast } from "react-toastify";
import Resources from "../../resources.json";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class ConnectionConsomer extends React.Component {

    successBoxAppear = (isDisconnected) => {
        if (isDisconnected) {

            toast.success(
                Resources["operationSuccess"][currentLanguage]
            );
        }
    }

    render() {
        return (
            <ConnectionContext.Consumer>
                {({ isDisconnected }) => (
                    this.successBoxAppear(isDisconnected) 
                    // <div>
                    //     <div style={{
                    //         height: '60px',
                    //         background: '#ff8100',
                    //         marginTop: '0',
                    //         fontSize: '20px'
                    //     }}>
                    //         <p>Internet connection lost + {isDisconnected}</p>
                    //     </div>
                    // </div>
                )}
            </ConnectionContext.Consumer>
        );
    }
}

export default ConnectionConsomer;

