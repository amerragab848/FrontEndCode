import React, { Component } from "react";
import Api from "../../api";
import LeftMenu from "./LeftMenu";
import HeaderMenu from "./HeaderMenu"; 
import config from "../../Services/Config";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appComponants: [],
      contactName: '' ,
      profilePath:''
    };
  }

  componentDidMount = () => { 
    Api.get("GetDefaultData?token=").then(result => {
       config.contactName = result.contactName; 
       this.setState({
         contactName: result.contactName,
         profilePath: config.getPublicConfiguartion().downloads+ "/"+result.profilePath
       });
    });

    Api.get("GetPrimeData").then(res => {  
      this.setState({
         appComponants: res.appComponants 
      }); 
    });  

  };

  render() {
    return (
      <div>
        { this.state.contactName?  <HeaderMenu contactName={this.state.contactName} profilePath ={this.state.profilePath} />: null }
        <LeftMenu appComponants={this.state.appComponants} />
      </div>
    );
  }
}

export default Menu;
