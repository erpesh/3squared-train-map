import React, {createContext, useContext, useState, useEffect, useMemo} from 'react';
import { fetchTrains } from "./api";
import { getTrainsWithMovement } from "./utils/mappers";
import useFilters from "./hooks/useFilters";
import useLocalStorageState from "use-local-storage-state";
import useRefresh from "./hooks/useRefresh";
import {useIsMount} from "./hooks/useIsMount";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const isMount = useIsMount();
    // const [selectedTrain, setSelectedTrain] = useState(null);
    const [selectedTrainId, setSelectedTrainId] = useState(null);
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedStations, setSelectedStations] = useLocalStorageState("selectedStations", {defaultValue: []});
    const { filteredTrains, filters, setFilters } = useFilters(trains);

    const selectedTrain = useMemo(() => trains.find(t => t.trainId === selectedTrainId) ?? null, [selectedTrainId, trains]);

    const getTrains = async () => {
        try {
            const filteredTrainData = await fetchTrains(selectedStations.map(i => i.value));
            const trainsWithMovement = await getTrainsWithMovement(filteredTrainData);
            setTrains(trainsWithMovement);
            setLoading(false);
        } catch (e) {
            console.log(e)
            setError(e);
        }
    };

    useEffect(() => {
        getTrains();
    }, [selectedStations]);

    function updateTrains() {
        if (!isMount) // To prevent double fetch on page load
            getTrains();
    }

    const refreshTrains = useRefresh(updateTrains);

    return (
        <AppContext.Provider
            value={{
                selectedTrain,
                setSelectedTrainId,
                trains,
                refreshTrains,
                filteredTrains,
                filters,
                setFilters,
                loading,
                error
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppState = () => useContext(AppContext);