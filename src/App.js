
import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import Map from './map/Map';
import Refresh from './Refresh';
import Header from './Header';
import Legend from './Legend';
import {fetchTrains} from "./api";
import {getTrainsWithMovement} from "./utils/mappers";
import useFilters from "./hooks/useFilters";
import Sidebar from "./sidebar/Sidebar";

const App = () => {
    const [selectedTrain, setSelectedTrain] = useState(null);
    const selectedTrainRef = useRef(null);
    const [trainsWithMovement, setTrainsWithMovement] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const {filteredTrains, filters, setFilters} = useFilters(trainsWithMovement);

    async function getTrains(date= null) {
        const filteredTrainData = await fetchTrains(date);

        const trainsWithMovement = await getTrainsWithMovement(filteredTrainData);
        setTrainsWithMovement(trainsWithMovement);
    }

    const selectTrain = (train) => {
        setSelectedTrain(train);

    }

    const refreshTrains = () => setRefresh(!refresh);

    useEffect(() => {
        getTrains();
    }, [refresh]);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Header/>
            <Legend/>
            <Sidebar
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
