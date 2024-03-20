import { apiRequest, fetchTrains, fetchTrainScheduleData, fetchTrainMovementData } from '../api/index';

describe('API tests', () => {
    test('fetchTrains should return data', async () => {

        const stations = ['LEEDS', 'BELFASTC', 'JAMESST', 'MNCRPES', 'SHEFSRF', 'NEWHVTJ', 'CAMBDGE', 'CREWEMD', 'GTWK', 'WLSDEUT', 'HLWY236', 'LOWFRMT', 'WLSDRMT', 'LINCLNC', 'GLGC', 'CARLILE', 'MOSEUPY', 'KNGX', 'STAFFRD'];
        
        let today = new Date();
    
        let year = today.getFullYear();
        let month = String(today.getMonth() + 1).padStart(2, '0');
        let day = String(today.getDate()).padStart(2, '0');
    
        let startDate = `${year}-${month}-${day}T00:00:00`;
        let endDate = `${year}-${month}-${day}T23:59:59`;

        const trainResponse = await apiRequest(`/trains/tiploc/${stations.join(',')}/${startDate}/${endDate}`);
        const trainData = await trainResponse.json();
        expect(trainData).toBeDefined();
        expect(trainData.length).toBeGreaterThan(0);
    });

    test('fetchTrains should return data in the correct pattern', async () => {
        const stations = ['LEEDS', 'BELFASTC', 'JAMESST', 'MNCRPES', 'SHEFSRF', 'NEWHVTJ', 'CAMBDGE', 'CREWEMD', 'GTWK', 'WLSDEUT', 'HLWY236', 'LOWFRMT', 'WLSDRMT', 'LINCLNC', 'GLGC', 'CARLILE', 'MOSEUPY', 'KNGX', 'STAFFRD'];
        
        const trainData = await fetchTrains(stations);
        expect(Array.isArray(trainData)).toBe(true);
        expect(trainData[0]).toHaveProperty('trainId');
        expect(trainData[0]).toHaveProperty('originTiploc');
        expect(trainData[0]).toHaveProperty('destinationTiploc');
        const modifiedTrainData = trainData.map(train => ({
            trainId: train.trainId,
            originTiploc: train.originTiploc,
            destinationTiploc: train.destinationTiploc
        }));

        expect(modifiedTrainData).toBeDefined();
        expect(modifiedTrainData.length).toBeGreaterThan(0);
    });
});
