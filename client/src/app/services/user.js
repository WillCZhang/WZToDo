import Base64 from 'base-64';
import { request, handleResponse } from './request';

export const userService = {
    login,
    logout,
    register,
    getLoginUsername
};

function login(username, password, callback) {
    const requestOptions = {
        ...request.POST,
        body: JSON.stringify({
            user: username,
            password: Base64.encode(password)
        })
    };
    return fetch(`http://127.0.0.1:8000/login`, requestOptions)
        .then(handleResponse).then(user => {
            // login successful if there's a user in the response
            if (user && user.code === 200) {
                // store user details and basic auth credentials in local storage
                // to keep user logged in between page refreshes
                user.authdata = window.btoa(username + ':' + password);
                localStorage.setItem('user', username);
                callback(user);
            } else {
                alert(user.msg);
            }
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function register(username, password, callback) {
    const requestOptions = {
        ...request.POST,
        body: JSON.stringify({
            user: username,
            password: Base64.encode(password)
        })
    };
    return fetch(`http://127.0.0.1:8000/register`, requestOptions)
        .then(handleResponse).then(user => {
            // login successful if there's a user in the response
            if (user && user.code === 200) {
                callback(user);
            } else {
                alert(user.msg);
            }
        });
}

function getLoginUsername() {
    return localStorage.getItem('user');
}