import { ADD_ITEM, FINISH_ITEM, CANCEL_ITEM, ADD_DETAIL, SHOW_DETAIL } from '../const';

// todo list
function addItem(text) {
    return {type: ADD_ITEM, text: text};
}

function finishItem(id) {
    return {type: FINISH_ITEM, id: id};
}

function cancelItem(id) {
    return {type: CANCEL_ITEM, id: id};
}

function addDetail(obj) {
    return {type: ADD_DETAIL, id: obj.id, detail: obj.detail};
}

export { addItem, finishItem, cancelItem, addDetail };

// ui
function showDetail(obj) {
    return {type: SHOW_DETAIL, id: obj.id, detail: obj.detail};
}

export { showDetail };