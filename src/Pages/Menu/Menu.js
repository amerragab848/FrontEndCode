import React, { Component } from "react";
import Api from "../../api";
import LeftMenu from "./LeftMenu";
import HeaderMenu from "./HeaderMenu";
import config from "../../Services/Config";

const loadingStyle = {
  container: {
    position: "absolute",
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
    zIndex: "20",
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
}

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appComponants: [],
      contactName: '',
      profilePath: '',
      isLoading: false,
      isLoadingComponants: false
    };
  }

  componentDidMount = () => {
    this.setState({ isLoading: true });
    Api.get("GetDefaultData?token=").then(result => {
      if (result) {
        config.contactName = result.contactName;
        localStorage.setItem('contactName', result.contactName)
        config.setSignature(result.signaturePath);
        this.setState({
          contactName: result.contactName,
          profilePath: config.getPublicConfiguartion().downloads + "/" + result.profilePath,
          iscompnay: result.isCompany,
          authorize: result.authorize,
          wfSettings: result.wfSettings,
          isLoading: false
        });

        localStorage.setItem('profilePath', this.state.profilePath);
      }
    });
    this.setState({ isLoadingComponants: true });

    Api.get("GetPrimeData").then(res => {
      if (res) {
        this.setState({
          appComponants: res.appComponants,
          isLoadingComponants: true
        });
      }
    });
  };

  render() {
    return (
      <div>
        {this.state.isLoading == false ?
          <HeaderMenu
            contactName={this.state.contactName}
            profilePath={this.state.profilePath} /> :
          <div style={loadingStyle.container}>
            <span style={loadingStyle.spinner}></span>
          </div>}
        <LeftMenu appComponants={this.state.appComponants} />
      </div>
    );
  }
}

export default Menu;
