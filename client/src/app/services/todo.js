export const todoService = {
    addItem
};

function addItem(text, detail) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text,
            detail: detail
        })
    };
    let username = localStorage.getItem('user');
    let url = 'http://127.0.0.1:8000/user/'+username+'/list';
    return fetch(url, requestOptions).then(handleResponse).catch((e) => {
        console.log(e);
        return Promise.reject(e);
    });
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            const error = (data && data.msg) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    }).catch((e) => {
        return Promise.reject(e);
    });
}