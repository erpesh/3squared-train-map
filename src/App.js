import React, { useEffect, useState } from 'react';
import './App.css';
import TrainMap from './TrainMap';
import { apiRequest } from "./api";

const App = () => {
    const [selectedTrain, setSelectedTrain] = useState(null);
    const [trains, setTrains] = useState([]);

    async function fetchTrains() {
        let today = new Date();

        let year = today.getFullYear();
        let month = String(today.getMonth() + 1).padStart(2, '0');
        let day = String(today.getDate()).padStart(2, '0');

        let startDate = `${year}-${month}-${day}T00:00:00`;
        let endDate = `${year}-${month}-${day}T23:59:59`;

        const trainResponse = await apiRequest(`/trains/tiploc/LEEDS,BELFASTC,JAMESST,NEWHVTJ,CAMBDGE,CREWEMD,GTWK,WLSDEUT,HLWY236,LOWFRMT,WLSDRMT,LINCLNC,GLGC,CARLILE,MOSEUPY,KNGX,STAFFRD/${startDate}/${endDate}`);
        const trainData = await trainResponse.json();
        const filteredTrainData = trainData
            .filter(item => item["lastReportedType"] === "DEPARTURE" ||
                item["lastReportedType"] === "ARRIVAL" || item["lastReportedType"] === "DESTINATION")
            .filter((obj, index, self) =>
                    index === self.findIndex((t) => (
                        t.trainId === obj.trainId
                    ))
            );
        console.log(filteredTrainData)

        setTrains(filteredTrainData);
        setSelectedTrain(filteredTrainData[0]);
    }

    useEffect(() => {
        fetchTrains();
    }, []);

    const handleTrainSelection = (train) => {
        setSelectedTrain(train);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <div style={{ width: '20%', backgroundColor: '#f0f0f0', padding: '10px', overflowY: 'auto' }}>
                <h2>Train Information</h2>
                {trains.map(train => (
                    <div key={train.trainId} className={`train-card ${selectedTrain === train ? 'selected' : ''}`} onClick={() => handleTrainSelection(train)}>
                        <h3>{train.originLocation} to {train.destinationLocation}</h3>
                        <p>Status: {train.lastReportedType}</p>
                        {/* Add more information about the train if needed */}
                    </div>
                ))}
            </div>

            {/* Map */}
            <div style={{ flex: 1 }}>
                <TrainMap onTrainSelect={handleTrainSelection} selectedTrain={selectedTrain} />
            </div>
        </div>
    );
};

export default App;
