import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import {apiRequest} from "./api";

const MyMap = ({ onTrainSelect, selectedTrain }) => {
    const [map, setMap] = useState(null);
    const [routeLine, setRouteLine] = useState([]);

    const trainIcon = new Icon({
        iconUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Map_icons_by_Scott_de_Jonge_-_train-station.svg/1024px-Map_icons_by_Scott_de_Jonge_-_train-station.svg.png',
        iconSize: [30, 30],
    });

    const fetchTrainMovementData = async (activationId, scheduleId) => {
        try {
            const movementResponse = await apiRequest(`/ifmtrains/movement/${activationId}/${scheduleId}`)
            const movementData = await movementResponse.json();
            console.log(movementData);
            displayTrainRoute(movementData);
        } catch (error) {
            console.error('Error fetching train movement data:', error);
        }
    };

    useEffect(() => {
        if (selectedTrain)
            fetchTrainMovementData(selectedTrain.activationId, selectedTrain.scheduleId);
    }, [selectedTrain])

    const displayTrainRoute = (movementData) => {
        if (movementData.length > 0) {
            const routeSegments = [];

            for (let i = 0; i < movementData.length - 1; i++) {
                const currentMovement = movementData[i];
                const nextMovement = movementData[i + 1];

                const plannedDeparture = new Date(currentMovement.plannedDeparture).getTime();
                const actualDeparture = new Date(currentMovement.actualDeparture).getTime();
                const plannedArrival = new Date(nextMovement.plannedDeparture).getTime();
                const actualArrival = new Date(nextMovement.actualDeparture).getTime();

                const delay = actualDeparture - plannedDeparture;
                const color = delay > 0 ? '#bf212f' : delay < 0 ? '#27b376' : '#264b96'; // Red for late, green for early, blue for on time

                routeSegments.push({
                    positions: [
                        [currentMovement.latLong.latitude, currentMovement.latLong.longitude],
                        [nextMovement.latLong.latitude, nextMovement.latLong.longitude]
                    ],
                    color: color,
                });
            }

            setRouteLine(routeSegments);
        }
    };

    const handleTrainClick = (train) => {
        // Fetch and display movement data for the selected train
        fetchTrainMovementData(train.activationId, train.scheduleId);

        // Notify parent component about train selection
        onTrainSelect(train);
    };

    // if (!trains || trains.length === 0) return <div>Error</div>
    if (!selectedTrain) return <div>Loading</div>

    return (
        <MapContainer center={[54, -0.5]} zoom={6} style={{ height: '100vh', background: 'ghostwhite' }} whenCreated={setMap}>
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                maxZoom={20}
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            {/*{trains.map((train) => (*/}
            {/*    <Marker*/}
            {/*        key={train.trainId}*/}
            {/*        position={[train.latitude, train.longitude]}*/}
            {/*        icon={trainIcon}*/}
            {/*        eventHandlers={{*/}
            {/*            click: () => handleTrainClick(train),*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        <Popup>*/}
            {/*            <div>*/}
            {/*                <h2>{train.trainId}</h2>*/}
            {/*                <p>Origin: {train.originLocation}</p>*/}
            {/*                <p>Destination: {train.destinationLocation}</p>*/}
            {/*                <p>Status: {train.cancelled ? 'Cancelled' : 'On time'}</p>*/}
            {/*            </div>*/}
            {/*        </Popup>*/}
            {/*    </Marker>*/}
            {/*))}*/}


            {routeLine && routeLine.map((segment, index) => (
                <Polyline key={index} pathOptions={{ color: segment.color }} positions={segment.positions} />
            ))}
            {/*{routeLine && <Polyline pathOptions={{ color: routeLine.color }} positions={routeLine.positions} />}*/}
        </MapContainer>
    );
};

export default MyMap;
