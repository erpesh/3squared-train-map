
import React, {useEffect, useState} from 'react';
import './App.css';
import Map from './map/Map';
import TrainSidebar from './TrainSidebar';
import Refresh from './Refresh';
import Header from './Header';
import Legend from './Legend';

import {apiRequest, fetchTrainMovementData, fetchTrainScheduleData} from "./api";
import useFilters from "./hooks/useFilters";
import {getStationsAndRoutes} from "./utils/mappers";

const App = () => {
    const [selectedTrain, setSelectedTrain] = useState(null);
    const [trainsWithMovement, setTrainsWithMovement] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const {filteredTrains, filters, setFilters} = useFilters(trainsWithMovement);

    async function fetchTrains(date= null) {
        let today = date ? new Date(date) : new Date();

        let year = today.getFullYear();
        let month = String(today.getMonth() + 1).padStart(2, '0');
        let day = String(today.getDate()).padStart(2, '0');

        let startDate = `${year}-${month}-${day}T00:00:00`;
        let endDate = `${year}-${month}-${day}T23:59:59`;

        const trainResponse = await apiRequest(`/trains/tiploc/LEEDS,BELFASTC,JAMESST,MNCRPES,SHEFSRF,NEWHVTJ,CAMBDGE,CREWEMD,GTWK,WLSDEUT,HLWY236,LOWFRMT,WLSDRMT,LINCLNC,GLGC,CARLILE,MOSEUPY,KNGX,STAFFRD/${startDate}/${endDate}`);
        const trainData = await trainResponse.json();
        const filteredTrainData = trainData
            .filter(item => item["lastReportedType"] === "DEPARTURE" ||
                item["lastReportedType"] === "ARRIVAL" || item["lastReportedType"] === "DESTINATION")
            .filter((obj, index, self) =>
                index === self.findIndex((t) => (
                    t.trainId === obj.trainId
                ))
            );

        const trainsWithMovement = await getTrainsWithMovement(filteredTrainData);
        setTrainsWithMovement(trainsWithMovement);
    }

    const getMovementAndSchedule = async (activationId, scheduleId) => {
        const [movement, schedule] = await Promise.all([
            fetchTrainMovementData(activationId, scheduleId),
            fetchTrainScheduleData(activationId, scheduleId)
        ])
        return {
            movement,
            schedule
        };
    }

    async function getTrainsWithMovement(trains) {
        const data = await Promise.all(
            trains.map(train => getMovementAndSchedule(train.activationId, train.scheduleId))
        )

        const trainsWithMovement = [];
        for (let i = 0; i < trains.length; i++) {
            const {movement, schedule} = data[i];
            const {stations} = getStationsAndRoutes(movement, schedule);

            const train = trains[i];
            const actualArrival = new Date(train.actualArrival);
            const scheduledArrival = new Date(train.scheduledArrival);

            const delayInMilliseconds = actualArrival - scheduledArrival;
            const delayInMinutes = Math.floor(delayInMilliseconds / 1000 / 60);

            const isLate = delayInMilliseconds > 0;

            trainsWithMovement.push({
                ...train,
                stations,
                movement: movement[movement.length - 1],
                isLate,
                delayInMinutes
            })
        }
        console.log(trainsWithMovement);
        return trainsWithMovement;
    }

    const refreshTrains = () => setRefresh(!refresh);

    useEffect(() => {
        fetchTrains();
    }, [refresh]);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Header/>
            <Legend/>
            <TrainSidebar
                trains={trainsWithMovement}
                filteredTrains={filteredTrains}
                filters={filters}
                setFilters={setFilters}
                selectedTrain={selectedTrain}
                onTrainSelect={setSelectedTrain}
            />
            <div style={{ flex: 1 }}>
                <Map
                    trains={filteredTrains}
                    selectedTrain={selectedTrain}
                    setSelectedTrain={setSelectedTrain}
                />
            </div>
            <Refresh refreshTrains={refreshTrains}/>
        </div>
        
    );
};

export default App;
