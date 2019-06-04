import { combineReducers } from 'redux';
import { ADD_ITEM, FINISH_ITEM, CANCEL_ITEM, ADD_DETAIL, SHOW_DETAIL } from '../const';

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

function loadCache() {
    let list = {};
    for (let todo of cache["todo"]) {
        let id = Object.values(list).length;
        list[id] = newItem(todo, id);
    }
    for (let done of cache["done"]) {
        let id = Object.values(list).length;
        list[id] = newItem(done, id, done=true);
    }
    return list;
}
const initList = loadCache();

function newItem(text, id, detail="", done=false) {
    return {
        id: id,
        text: text,
        detail: detail,
        done: done
    }
}

const listReducer = (list=initList, action) => {
    if (action.type === ADD_ITEM) {
        let item = newItem(action.text, initList.length);
        list[item.id] = item;
    } else if (action.type === FINISH_ITEM) {
        list[action.id].done = true;
    } else if (action.type === CANCEL_ITEM) {
        delete list.action.id;
    } else if (action.type === ADD_DETAIL) {
        list[action.id].detail = action.detail;
    }
    return list;
}

const uiReducer = (ui={showDetail: false}, action) => {
    if (action.type === SHOW_DETAIL) {
        ui.showDetail = true;
    }
    return ui;
}

export default combineReducers({
    list: listReducer,
    ui: uiReducer
});