import React, { useEffect, useState } from 'react';
import {MapContainer, TileLayer, ZoomControl, ScaleControl} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {fetchTrainMovementData, fetchTrainScheduleData} from "../api";
import Stations from "./Stations";
import Routes from "./Routes";
import Trains from "./Trains";
import {getStationsAndRoutes} from "../utils/mappers";

export const colors = {
    onTime: "#305dbd",
    early: "#27b376",
    late: "#bf212f",
    scheduled: "#a2adaa",
}

const Map = ({ trains, selectedTrain, setSelectedTrain }) => {
    const [routeLine, setRouteLine] = useState([]);
    const [stations, setStations] = useState([]);

    useEffect(() => {
        // Clear all markers and routes
        setRouteLine([]);

        if (selectedTrain) {
            displayTrainRoute()
        }
    }, [selectedTrain])

    const displayTrainRoute = () => {
        setRouteLine(selectedTrain.routes);
        setStations(selectedTrain.stations);
    };
    
    // if (!trains || trains.length === 0) return <div>Error</div>
    if (!trains || trains.length === 0) return <div>Loading</div>

    if (!trains || trains.length === 0) return <div>Error</div>
    // if (!trains || trains.length === 0) return <div>Loading</div>

    return (
        <MapContainer
            id = "map"
            zoomControl={false}
            center={[54, -0.5]}
            zoom={6}
            style={{ height: '100vh', background: 'ghostwhite' }}
        >
            <TileLayer
    
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                maxZoom={20}
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        
            />

            {stations && <Stations id = "map_stations" stations={stations}/>}
            {trains && trains.length > 0 && <Trains id = "map_trains" trains={trains} selectedTrain={selectedTrain} setSelectedTrain={setSelectedTrain}/>}
            {routeLine && <Routes id =  routeLine={routeLine}/>}
            <ZoomControl position={'bottomleft'}/>
            <ScaleControl position={'bottomright'}/>
        </MapContainer>
    );
};

export default Map;