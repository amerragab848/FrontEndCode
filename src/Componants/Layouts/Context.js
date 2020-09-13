import React from 'react';


const ConnectionContext = React.createContext({
    isDisconnected: false, 
    setConnection: () => { }
});  

export default ConnectionContext;
