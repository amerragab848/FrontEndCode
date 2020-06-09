
import React, { Component } from 'react'

class LoadingSection extends Component {

	render() {
		return (
			<div className="dashboardLoading " style={{ position: this.props.isCustomLoader == true ? 'absolute' : 'fixed' }}>
				<span></span>
				<h3>Loading</h3>
			</div>
		)
	}
}

export default LoadingSection;