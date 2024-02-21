
import React, {useEffect, useState} from 'react';
import './App.css';
import Map from './map/Map';
import Refresh from './Refresh';
import Header from './Header';
import Legend from './Legend';
import {fetchTrains} from "./api";
import {getTrainsWithMovement} from "./utils/mappers";
import useFilters from "./hooks/useFilters";
import Sidebar from "./sidebar/Sidebar";
import useRefresh from "./hooks/useRefresh";
import LoadingSpinner from "./LoadingSpinner";

const App = () => {
    const [selectedTrain, setSelectedTrain] = useState(null);
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);

    const {filteredTrains, filters, setFilters} = useFilters(trains);

    async function getTrains(date= null) {
        const filteredTrainData = await fetchTrains(date);

        const trainsWithMovement = await getTrainsWithMovement(filteredTrainData);
        setTrains(trainsWithMovement);
    }

    useEffect(() => {
        getTrains()
            .then(() => setLoading(false))
    }, [])

    const refreshTrains = useRefresh(getTrains);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Header/>
            <Legend/>
            <Sidebar
                trains={trains}
                filteredTrains={filteredTrains}
                filters={filters}
                setFilters={setFilters}
                selectedTrain={selectedTrain}
                onTrainSelect={setSelectedTrain}
                loading={loading}
            />
            <div style={{ flex: 1 }}>
                {loading ? <LoadingSpinner/> : <Map
                    trains={filteredTrains}
                    selectedTrain={selectedTrain}
                    setSelectedTrain={setSelectedTrain}
                />}
            </div>
            <Refresh refreshTrains={refreshTrains}/>
        </div>
        
    );
};

export default App;
