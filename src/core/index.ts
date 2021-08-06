const defaultRequestInit: RequestInit = {
    headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "nl,en;q=0.9,en-US;q=0.8,ar;q=0.7",
        "cache-control": "no-cache",
        "content-type": "application/json;charset=UTF-8",
        pragma: "no-cache",
    },
    method: "GET",
    mode: "cors",
    credentials: "same-origin",
};

export function fetchJson(url: string, init: RequestInit = {}) {
    return fetch(url, { ...defaultRequestInit, ...init });
}

export function putJson(url: string, data, init: RequestInit = {}) {
    let body = JSON.stringify(data);
    return fetch(url, { ...defaultRequestInit, ...init, method: "PUT", body });
}

export function postJson(url: string, data, init: RequestInit = {}) {
    let body = JSON.stringify(data);
    return fetch(url, { ...defaultRequestInit, ...init, method: "POST", body });
}

export function deleteJson(url: string, init: RequestInit = {}) {
    return fetch(url, { ...defaultRequestInit, ...init, method: "DELETE" });
}
