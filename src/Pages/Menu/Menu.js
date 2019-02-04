import React, { Component } from "react";
import Api from "../../api";
import LeftMenu from "./LeftMenu";
import HeaderMenu from "./HeaderMenu";
//import Resources from "../../resources.json";
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appComponants: []
    };
  }

  componentDidMount = () => {
    var result = null;

    Api.get("GetPrimeData").then(res => {
    
      result = res;

      console.log("result : "+result);

      this.setState({
         appComponants: result.appComponants 
      }); 

    });  
  };

  render() {
    return (
      <div>
        <HeaderMenu />
        <LeftMenu appComponants={this.state.appComponants} />
      </div>
    );
  }
}

export default Menu;
