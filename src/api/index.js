export function apiRequest(endpoint) {
    return fetch(`https://traindata-stag-api.railsmart.io/api${endpoint}`, {
            headers: {
                'X-ApiVersion': 1,
                'X-ApiKey': process.env.REACT_APP_API_KEY
            }
        }
    );
}