export function apiRequest(endpoint) {
    return fetch(`https://traindata-stag-api.railsmart.io/api${endpoint}`, {
            headers: {
                'X-ApiVersion': 1,
                'X-ApiKey': process.env.REACT_APP_API_KEY
            }
        }
    );
}

export const fetchTrainScheduleData = async (activationId, scheduleId) => {
    try {
        const scheduleResponse = await apiRequest(`/ifmtrains/schedule/${activationId}/${scheduleId}`)
        const scheduleData = await scheduleResponse.json();
        return scheduleData;
    } catch (error) {
        console.error('Error fetching train schedule data:', error);
        return null;
    }
};

export const fetchTrainMovementData = async (activationId, scheduleId) => {
    try {
        const movementResponse = await apiRequest(`/ifmtrains/movement/${activationId}/${scheduleId}`)
        const movementData = await movementResponse.json();
        return movementData;
    } catch (error) {
        console.error('Error fetching train movement data:', error);
        return null;
    }
};