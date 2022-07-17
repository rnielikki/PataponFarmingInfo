function getJsonFetchPromise(url) {
    return fetch(url, {
        method:"GET",
        headers:{"Content-Type":"application/json"}
    }).then(t => t.json());
}
