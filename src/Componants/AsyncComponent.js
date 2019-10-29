import React, { Component } from 'react';

const loadingStyle = {
  container: {
    position: "fixed",
    top: "0",
    right: "0",
    left: "0",
    bottom: "0",
    display: "-webkit-flex",
    display: "flex",
    WebkitAlignItems: "center",
    alignItems: "center",
    WebkitJustifyContent: "center",
    justifyContent: "center",
    WebkitFlexFlow: "column",
    flexFlow: "column",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: "999",
    minHeight: "250px"
  },
  spinner: {
    width: "64px",
    height: "64px",
    border: "solid 6px #4382f9",
    borderBottomColor: "transparent",
    borderRadius: "50%",
    WebkitAnimation: "rotate 1s linear infinite",
    animation: "rotate 1s linear infinite"
  }
};

export default importComponent => {
    class AsyncComponent extends Component {
        constructor(props) {
            super(props);

            this.state = {
                component: null,
            };
        }

        async componentDidMount() {
            const { default: component } = await importComponent();

            this.setState({
                component: component,
            });
        }

        render() {
            const C = this.state.component;

            return C ? <C {...this.props} /> : <div style={loadingStyle.container}><span style={loadingStyle.spinner}></span></div>;
        }
    }

    return AsyncComponent;
};
