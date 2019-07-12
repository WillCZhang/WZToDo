import { request, handleResponse } from "./request";
import { userService } from './user';

export const todoService = {
    getItems,
    addItem,
    deleteItem,
    changeStatus
};

function getItems(callback) {
    let username = userService.getLoginUsername();
    let url = '/user/' + username + '/list';
    fetch(url, request.GET).then(response => response.json()).then(callback);
}

function addItem(text, detail, callback) {
    const req = {
        ...request.POST,
        body: JSON.stringify({
            text: text,
            detail: detail
        })
    };
    let username = userService.getLoginUsername();
    let url = '/user/' + username + '/list';
    return fetch(url, req).then(handleResponse).then(callback);
}

function deleteItem(uuid) {
    let username = userService.getLoginUsername()
    let url = '/user/' + username + '/' + uuid;
    fetch(url, request.DELETE).then(handleResponse);
}

function changeStatus(uuid) {
    let username = userService.getLoginUsername();
    let url = '/user/' + username + '/' + uuid;
    fetch(url, request.PUT).then(handleResponse);
}
