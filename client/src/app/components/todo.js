
import React from 'react';
import './todo.css';
import { connect } from 'react-redux';
import { addItem, finishItem, cancelItem, addDetail, showDetail, closeDetail, clearAll, loadList } from '../actions/todoActions'
import { todoService } from '../services/todo';

class Todo extends React.Component {
    constructor() {
        super();
        this.title = React.createRef();
        this.detail = React.createRef();
    }
    componentDidMount() {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        let username = localStorage.getItem('user');
        let url = 'http://127.0.0.1:8000/user/'+username+'/list';
        let that = this;
        fetch(url, requestOptions).then(response => response.json())
            .then((data) => {
                that.props.loadList(data);
            });
    }
    todoText(id, text, done, detail) {
        const key = id + "text";
        let detailObj = {title: text, detail: detail};
        if (done) {
            return <li key={key} onClick={() => this.props.showDetail(detailObj)} className="text cross-out">{text}</li>
        } else {
            return <li key={key} onClick={() => this.props.showDetail(detailObj)} className="text">{text} {done}</li>
        }
    }
    doneButton(id, done) {
        const key = id + "button";
        if (done) {
            return <li key={key} className="done" onClick={() => this.props.finishItem(id)}>Not Done</li>
        } else {
            return <li key={key} className="done" onClick={() => this.props.finishItem(id)}>Done</li>
        }
    }
    generateTodoListView() {
        let list = Object.values(this.props.list).map((todo) =>
            <ul className="horizontal" key={todo.id+"list"}>
                {this.todoText(todo.id, todo.text, todo.done, todo.detail)}
                {this.doneButton(todo.id, todo.done)}
                <li key={todo.id} className="cancel" onClick={() => this.props.cancelItem(todo.id)}>Cancel</li>
            </ul>
        );
        return (
            <div>
                <ul>{list}</ul>
                <div className="container center">
                    <button className="button-clear" onClick={() => this.props.clearAll()}>Clear All</button>
                </div>
            </div>
        )
    }
    generateDetailView() {
        return (
            <div className="container center">
                <h3>{this.props.ui.title}</h3>
                <h5>{this.props.ui.detail}</h5>
                <input type="button" onClick={() => this.props.closeDetail()} value="Close" className="button button-clear"></input>
            </div>
        )
    }
    submit = () => {
        if (this.title.current.value === "") {
            alert("Please enter something :)")
            return;
        }
        let that = this;
        todoService.addItem(this.title.current.value, this.detail.current.value).then(function(res) {
            if (res["todo"] !== null || res["todo"] !== undefined)
                that.props.loadList(res);
        });
        this.title.current.value = "";
        this.detail.current.value = "";
    }
    generateAddTodoItemView() {
        return (
            <form>
                <input ref={this.title} type="text" className="text-line" placeholder="Any todo item?"></input>
                <br></br>
                <textarea ref={this.detail} className="text-line text-small-font" rows="5" cols="30" placeholder="Any details?"></textarea>
                <br></br>
                <input type="button" value="Add" className="button button-add" onClick={this.submit}></input>
            </form>
        )
    }
    render() {
        const list = this.generateTodoListView();
        const detailedView = this.generateDetailView();
        return (
            <div className="container">
                <div className="container center">
                    {this.generateAddTodoItemView()}
                </div>
                {this.props.ui.showDetail? detailedView : list}
            </div>
        );
    }
}

const mapStateToProps = (state) => {return {list: state.list, ui: state.ui}};
const mapDispatchToProps = { addItem, finishItem, cancelItem, addDetail, showDetail, closeDetail, clearAll, loadList };
export default connect(mapStateToProps, mapDispatchToProps)(Todo);