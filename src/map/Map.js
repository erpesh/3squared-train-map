import React, {useEffect, useRef, useState} from 'react';
import {MapContainer, TileLayer, ZoomControl, ScaleControl, WMSTileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Stations from "./Stations";
import Routes from "./Routes";
import Trains from "./Trains";
import useLocalStorageState from "use-local-storage-state";

export const colors = {
    onTime: "#305dbd",
    early: "#27b376",
    late: "#bf212f",
    scheduled: "#a2adaa",
}

const Map = ({ trains, selectedTrain }) => {
    const ref = useRef(null);
    const [routeLine, setRouteLine] = useState([]);
    const [stations, setStations] = useState([]);
    // const [tileLayer, setTileLayer] = useLocalStorageState("tileLayed", {defaultValue: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"});

    useEffect(() => {
        // if (ref.current)
        //     ref.current.setUrl("");

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

    if (!trains || trains.length === 0) return <div>Error</div>
    // if (!trains || trains.length === 0) return <div>Loading</div>

    return (
        <MapContainer
            zoomControl={false}
            center={[54, -0.5]}
            zoom={6}
            style={{ height: '100vh', background: 'ghostwhite' }}
        >
            <TileLayer
                ref={ref}
                url={"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
                maxZoom={20}
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {/*<WMSTileLayer*/}
            {/*    url={"http://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"}*/}
            {/*/>*/}

            {stations && <Stations stations={stations}/>}
            {trains && trains.length > 0 && <Trains/>}
            {routeLine && <Routes routeLine={routeLine}/>}
            <ZoomControl position={'bottomleft'}/>
            <ScaleControl position={'bottomright'}/>
        </MapContainer>
    );
};

export default Map;