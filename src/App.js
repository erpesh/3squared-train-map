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
import {useIsMount} from "./hooks/useIsMount";
import ErrorToast from "./ErrorToast";

const App = () => {
    const isMount = useIsMount();
    const [selectedTrain, setSelectedTrain] = useState(null);
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const {filteredTrains, filters, setFilters} = useFilters(trains);

    async function getTrains(date= null) {
        try {
            const filteredTrainData = await fetchTrains(date);
            const trainsWithMovement = await getTrainsWithMovement(filteredTrainData);
            setTrains(trainsWithMovement);
        }
        catch (e) {
            console.log(e)
            setError(e);
        }
    }

    useEffect(() => {
        getTrains()
            .then(() => setLoading(false))
    }, [])

    function updateTrains() {
        if (!isMount) // To prevent double fetch on page load
            getTrains();
    }

    const refreshTrains = useRefresh(updateTrains);

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
            <ErrorToast error={error}/>
        </div>
        
    );
};

export default App;
