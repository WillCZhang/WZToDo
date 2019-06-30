
import React from 'react';
import './todo.css';
import { connect } from 'react-redux';
import { addItem, finishItem, cancelItem, addDetail, showDetail, closeDetail, clearAll, loadList } from '../actions/todoActions'
import { todoService } from '../services/todo';
import { userService } from '../services/user';
import { history } from './history';

class Todo extends React.Component {
    constructor() {
        super();
        this.title = React.createRef();
        this.detail = React.createRef();
    }
    componentDidMount() {
        todoService.getItems(this.props.loadList);
    }
    todoText(id, text, done, detail) {
        const key = id + "text";
        let detailObj = { title: text, detail: detail };
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
            <ul className="horizontal" key={todo.id + "list"}>
                {this.todoText(todo.id, todo.text, todo.done, todo.detail)}
                {this.doneButton(todo.id, todo.done)}
                <li key={todo.id} className="cancel" onClick={() => this.props.cancelItem(todo.id)}>Cancel</li>
            </ul>
        );
        let currList = (
            <div className="center">
                <h3>Your current todo list</h3>
            </div>
        )
        let clearAll = (
            <div className="container center">
                <button className="button-clear" onClick={() => this.props.clearAll()}>Clear All</button>
            </div>
        )
        return (
            <div>
                {list.length > 0 ? currList : null}
                <br></br>
                <ul>{list}</ul>
                <br></br>
                <br></br>
                {list.length > 0 ? clearAll : null}
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
        let showItem = (data) => {
            if (data["todo"] !== null || data["todo"] !== undefined)
                this.props.loadList(data);
        }
        todoService.addItem(this.title.current.value, this.detail.current.value, showItem);
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
    logout = () => {
        userService.logout();
        history.push('/login');
    }
    render() {
        const list = this.generateTodoListView();
        const detailedView = this.generateDetailView();
        return (
            <div className="container">
                <div className="center">
                    <h2>Hi {userService.getLoginUsername()}! What do you want to finish today?</h2>
                </div>
                <div className="center">
                    {this.generateAddTodoItemView()}
                </div>
                <br></br>
                <br></br>
                {this.props.ui.showDetail ? detailedView : list}
                <br></br>
                <br></br>
                <div className="center">
                    <input type="button" value="Logout" className="button button-add" onClick={this.logout}></input>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => { return { list: state.list, ui: state.ui } };
const mapDispatchToProps = { addItem, finishItem, cancelItem, addDetail, showDetail, closeDetail, clearAll, loadList };
export default connect(mapStateToProps, mapDispatchToProps)(Todo);