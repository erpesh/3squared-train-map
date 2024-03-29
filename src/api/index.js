export function apiRequest(endpoint) {
    return fetch(`https://traindata-stag-api.railsmart.io/api${endpoint}`, {
            headers: {
                'X-ApiVersion': 1,
                'X-ApiKey': process.env.REACT_APP_API_KEY
            }
        }
    );
}

export const fetchTrains = async (stations) => {
    if (!stations || stations.length === 0)
        stations = ['LEEDS', 'BELFASTC', 'JAMESST', 'MNCRPES', 'SHEFSRF', 'NEWHVTJ', 'CAMBDGE', 'CREWEMD', 'GTWK', 'WLSDEUT', 'HLWY236', 'LOWFRMT', 'WLSDRMT', 'LINCLNC', 'GLGC', 'CARLILE', 'MOSEUPY', 'KNGX', 'STAFFRD'];
    try {
        let today = new Date();

        let year = today.getFullYear();
        let month = String(today.getMonth() + 1).padStart(2, '0');
        let day = String(today.getDate()).padStart(2, '0');

        let startDate = `${year}-${month}-${day}T00:00:00`;
        let endDate = `${year}-${month}-${day}T23:59:59`;
        
        const trainResponse = await apiRequest(`/trains/tiploc/${stations.join(',')}/${startDate}/${endDate}`);
        const trainData = await trainResponse.json();
        const filteredTrainData = trainData
            .filter(item => item["lastReportedType"] === "DEPARTURE" ||
                item["lastReportedType"] === "ARRIVAL" || item["lastReportedType"] === "DESTINATION")
            .filter((obj, index, self) =>
                    index === self.findIndex((t) => (
                        t.trainId === obj.trainId
                    ))
            );
        return filteredTrainData;

    }
    catch (error) {
        console.error('Error fetching trains: ', error);
        throw new Error("Error fetching trains.");
    }
}

export const fetchTrainScheduleData = async (activationId, scheduleId) => {
    try {
        const scheduleResponse = await apiRequest(`/ifmtrains/schedule/${activationId}/${scheduleId}`)
        const scheduleData = await scheduleResponse.json();
        return scheduleData;
    } catch (error) {
        console.error('Error fetching schedule: ', error);
        throw new Error("Error fetching train schedule.");
    }
};

export const fetchTrainMovementData = async (activationId, scheduleId) => {
    try {
        const movementResponse = await apiRequest(`/ifmtrains/movement/${activationId}/${scheduleId}`)
        const movementData = await movementResponse.json();
        return movementData;
    } catch (error) {
        console.error('Error fetching movement: ', error);
        throw new Error("Error fetching train movement.");
    }
};