import React from "react";
import Rodal from "../../Styles/js/rodal";
import "../../Styles/css/rodal.css";
import Api from "../../api";

class Modales extends React.Component {
  componentDidMount() {
    if (this.props.apiDetails) {
      Api.get(this.props.apiDetails).then(result => {
        console.log(result);
      });
    }
  }

  render() {
    return (
      <div>
        <Rodal visible={this.props.opened} onClose={this.props.closed}>
          <div className="ui modal mediumModal">
            <div className="header zero">{this.props.title}</div>
            <div className="content">
              <p>
                Fixie tote bag ethnic keytar. Neutra vinyl American Apparel kale
                chips tofu art party, cardigan raw denim quinoa
              </p>
            </div>
            <div className="actions">
              <button
                className="defaultBtn btn cancel smallBtn"
                onClick={this.props.closed}
              >
                Cancel
              </button>
              <button className="smallBtn primaryBtn-1 btn approve">ADD</button>
            </div>
          </div>
        </Rodal>
      </div>
    );
  }
}

export default Modales;
