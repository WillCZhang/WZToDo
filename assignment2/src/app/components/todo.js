
import React from 'react';
import './todo.css';
import { connect } from 'react-redux';
import { addItem, finishItem, cancelItem, addDetail } from '../actions/todo'

class Todo extends React.Component {
    render() {
        const items = Object.values(this.props.list).map((todo) =>
            <ul className="horizontal">
                <li key={todo.id} className="text">{todo.text}</li>
                <li className="done">Done</li>
                <li className="cancel">Cancel</li>
            </ul>
        );
        const list = <ul>{items}</ul>
        const detailedView = <h3>Test</h3>
        return (
            <div className="container">
                {this.props.ui.showDetail? detailedView : list}
            </div>
        );
    }
}

const mapStateToProps = (state) => {return {list: state.list, ui: state.ui}};
const mapDispatchToProps = { addItem, finishItem, cancelItem, addDetail };
export default connect(mapStateToProps, mapDispatchToProps)(Todo);