import { combineReducers } from 'redux';
import { ADD_ITEM, CHANGE_STATUS, CANCEL_ITEM, ADD_DETAIL, SHOW_DETAIL, CLOSE_DETAIL, CLEAR_ALL } from '../const';

const cache = {
    "todo": [
        "do cpsc 436 assignment",
        "plan projects",
        "plan meeting schedule"
    ],
    "done": [
        "find a group",
        "buy some food"
    ]
}

let nextId = 1;

function newItem(text, id, done=false, detail="") {
    if (isNaN(id)) {
        id = ++nextId;
    }
    return {
        id: id,
        text: text,
        detail: detail,
        done: done
    }
}

function loadCache() {
    let list = {};
    for (let todo of cache["todo"]) {
        let item = newItem(todo);
        list[item.id] = item;
    }
    for (let done of cache["done"]) {
        let item = newItem(done, undefined, true);
        list[item.id] = item;
    }
    return list;
}

const initList = loadCache();

const listReducer = (list=initList, action) => {
    if (action.type === ADD_ITEM) {
        let item = newItem(action.text, undefined, false, action.detail);
        return {...list, [item.id]: item};
    } else if (action.type === CHANGE_STATUS) {
        return {...list, [action.id]: newItem(list[action.id].text, action.id, !list[action.id].done, list[action.id].detail)};
    } else if (action.type === CANCEL_ITEM) {
        let tempList = {...list};
        delete tempList[action.id];
        return tempList;
    } else if (action.type === ADD_DETAIL) {
        return {...list, [action.id]: newItem(list[action.id].text, action.id, list[action.id].done, action.detail)};
    } else if (action.type === CLEAR_ALL) {
        return {};
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