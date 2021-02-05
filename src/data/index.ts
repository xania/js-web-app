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
