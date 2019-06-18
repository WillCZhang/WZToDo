import { ADD_ITEM, CHANGE_STATUS, CANCEL_ITEM, ADD_DETAIL, SHOW_DETAIL, CLOSE_DETAIL, CLEAR_ALL, LOAD_LIST } from '../const';

// todo list
function addItem(text, detail) {
    return {type: ADD_ITEM, text: text, detail: detail};
}

function finishItem(id) {
    return {type: CHANGE_STATUS, id: id};
}

function cancelItem(id) {
    return {type: CANCEL_ITEM, id: id};
}

function addDetail(obj) {
    return {type: ADD_DETAIL, id: obj.id, detail: obj.detail};
}

function clearAll() {
    return {type: CLEAR_ALL};
}

function loadList(list) {
    return {type: LOAD_LIST, list: list};
}

export { addItem, finishItem, cancelItem, addDetail, clearAll, loadList };

// ui
function showDetail(obj) {
    return {type: SHOW_DETAIL, title: obj.title, detail: obj.detail};
}

function closeDetail() {
    return {type: CLOSE_DETAIL};
}

export { showDetail, closeDetail };