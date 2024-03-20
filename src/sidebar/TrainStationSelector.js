import React from 'react';
import useLocalStorageState from "use-local-storage-state";
import stations from './stations.min.json';
import Select from "react-select";

const TrainStationSelector = () => {
    const [selectedStations, setSelectedStations] = useLocalStorageState("selectedStations", {defaultValue: []});

    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <Select
                aria-label={"Train stations"}
                defaultValue={selectedStations}
                onChange={(newValue) => setSelectedStations(newValue)}
                isMulti
                name="colors"
                options={stations.map(i => ({value: i.tiploc, label: i.name}))}
                className="basic-multi-select"
                classNamePrefix="select"
            />
            <div style={{ marginTop: '10px' }}>
                <button className={'secondary-bg'} onClick={() => window.location.reload()}>
                    Update
                </button>
            </div>
        </div>
    );
};

export default TrainStationSelector;
