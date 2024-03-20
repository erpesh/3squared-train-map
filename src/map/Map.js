import React, {useEffect, useRef, useState} from 'react';
import {MapContainer, TileLayer, ZoomControl, ScaleControl} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Stations from "./Stations";
import Routes from "./Routes";
import {useAppState} from "../AppContext";
import Train from "./Train";

export const colors = {
    onTime: "#305dbd",
    early: "#27b376",
    late: "#bf212f",
    scheduled: "#a2adaa",
}

const Map = () => {
    const {
        selectedTrain,
        filteredTrains,
    } = useAppState();

    const ref = useRef(null);
    const [routeLine, setRouteLine] = useState([]);
    const [stations, setStations] = useState([]);
    const [trainsHidden, setTrainsHidden] = useState(false);
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

    if (!filteredTrains || filteredTrains.length === 0) return <div>Error</div>
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
            {/*<TileLayer*/}
            {/*    ref={ref}*/}
            {/*    url={"https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.{ext}"}*/}
            {/*    maxZoom={20}*/}
            {/*    attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'*/}
            {/*    ext={'png'}*/}
            {/*/>*/}
            {/*<WMSTileLayer*/}
            {/*    url={"http://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"}*/}
            {/*/>*/}

            {stations && <Stations stations={stations}/>}
            {routeLine && <Routes routeLine={routeLine}/>}

            {!trainsHidden && filteredTrains && filteredTrains.length > 0 && <>
                {filteredTrains.map(train => (
                    <Train key={train.trainId} train={train}/>
                ))}
            </>}
            {trainsHidden && selectedTrain && <Train train={selectedTrain}/>}
            {selectedTrain && <button
                className={'secondary-bg hide-button'}
                onClick={() => setTrainsHidden(!trainsHidden)}
            >
                {trainsHidden ? "Show" : "Hide"}
            </button>}

            <ZoomControl position={'bottomleft'}/>
            <ScaleControl position={'bottomright'}/>
        </MapContainer>
    );
};

export default Map;