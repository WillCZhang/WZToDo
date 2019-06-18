import Base64  from 'base-64';
// import { authHeader } from '../_helpers';

export const userService = {
    login,
    logout
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: username,
            password: Base64.encode(password)
        })
    };
    return fetch(`http://127.0.0.1:8000/login`, requestOptions)
        .then(handleResponse).catch((e) => {
            console.log(e);
        }).then(user => {
            // login successful if there's a user in the response
            if (user && user.code === 200) {
                // store user details and basic auth credentials in local storage
                // to keep user logged in between page refreshes
                user.authdata = window.btoa(username + ':' + password);
                localStorage.setItem('user', username);
            } else {
                alert(user.msg);
            }

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

// function getAll() {
//     const requestOptions = {
//         method: 'GET'
//     };

//     return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
// }

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}