import React from 'react';
import { connect } from 'react-redux';

class Button extends React.Component {
	render() {
		return <button>Click Me!</button>;
	}
}

export default connect()(Button); 
