function generateDefaultRequest() {
    const requestType = ["GET", "POST", "PUT", "DELETE"];
    const defaultHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    let request = {};
    for (let reqType of requestType) {
        request[reqType] = {
            method: reqType,
            headers: defaultHeaders
        }
    }
    return request;
}

export const request = generateDefaultRequest();

export const handleResponse = (response) => {
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