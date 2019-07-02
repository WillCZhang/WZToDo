import { combineReducers } from 'redux';
import { ADD_ITEM, CHANGE_STATUS, CANCEL_ITEM, ADD_DETAIL, SHOW_DETAIL, CLOSE_DETAIL, CLEAR_ALL, LOAD_LIST } from '../const';
import { todoService } from '../services/todo';

function newItem(text, id, done=false, detail="") {
    return {
        id: id,
        text: text,
        detail: detail,
        done: done
    }
}

function loadList(list) {
    let result = {};
    for (let todo of list["todo"]) {
        result[todo["id"]] = todo;
    }
    for (let done of list["done"]) {
        result[done["id"]] = done;
    }
    return result;
}

const listReducer = (list={}, action) => {
    if (action.type === ADD_ITEM) {
        let item = newItem(action.text, undefined, false, action.detail);
        return {...list, [item.id]: item};
    } else if (action.type === CHANGE_STATUS) {
        todoService.changeStatus(action.id);
        return {...list, [action.id]: newItem(list[action.id].text, action.id, !list[action.id].done, list[action.id].detail)};
    } else if (action.type === CANCEL_ITEM) {
        let tempList = {...list};
        todoService.deleteItem(action.id);
        delete tempList[action.id];
        return tempList;
    } else if (action.type === ADD_DETAIL) {
        return {...list, [action.id]: newItem(list[action.id].text, action.id, list[action.id].done, action.detail)};
    } else if (action.type === CLEAR_ALL) {
        for (let key of Object.keys(list))
            todoService.deleteItem(key);
        return {};
    } else if (action.type === LOAD_LIST) {
        return loadList(action.list);
    }
    return list;
}

const defaultUI = {
    showDetail: false,
    title: "",
    detail: ""
}

const uiReducer = (ui=defaultUI, action) => {
    if (action.type === SHOW_DETAIL) {
        let detail = action.detail;
        if (detail === "")
            detail = "This item has no detail..."
        return {showDetail: true, title: action.title, detail: detail};
    } else if (action.type === CLOSE_DETAIL) {
        return defaultUI;
    }
    return ui;
}

export default combineReducers({
    list: listReducer,
    ui: uiReducer
});