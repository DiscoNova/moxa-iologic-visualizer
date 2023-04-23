import fetch from "node-fetch";

async function fetchWithTimeout(resource, options = {}) {
    const {
        method = 'GET', // Isn't this the default anyways?
        timeout = 2500, // No answer in 2.5 seconds; slow!
    } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
        headers: {
            'Accept': 'vdn.dac.v1',
            'Content-Type': 'application/json',
        },
        ...options,
        signal: controller.signal,
    });
    clearTimeout(id);
    return response;
}
export default fetchWithTimeout;
