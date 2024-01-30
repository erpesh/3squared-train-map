import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { Icon } from 'leaflet';

const MyMap = ({ onTrainSelect }) => {
    const [map, setMap] = useState(null);
    const [routeLine, setRouteLine] = useState(null);

    const dummyStations = {
        London: [51.509865, -0.118092],
        Manchester: [53.483959, -2.244644],
        Birmingham: [52.4862, -1.8904],
        Edinburgh: [55.9533, -3.1883],
        Cardiff: [51.4816, -3.1791],
    };

    const trainIcon = new Icon({
        iconUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Map_icons_by_Scott_de_Jonge_-_train-station.svg/1024px-Map_icons_by_Scott_de_Jonge_-_train-station.svg.png',
        iconSize: [30, 30],
    });

    useEffect(() => {
        if (map) {
            // Add your map setup code here
            // For example:
            // map.setView([54, -0.5], 6);
            // L.tileLayer(...).addTo(map);
        }
    }, [map]);

    const displayTrainRoute = (trainId) => {
        const train = dummyTrains.find((t) => t.id === trainId);
        setRouteLine({
            positions: train.route.map((station) => dummyStations[station]),
            color: 'blue', // You can customize the color
        });

        // Notify parent component about train selection
        onTrainSelect(train);
    };

    const dummyTrains = [
        { id: 1, name: 'Train 1', origin: 'London', destination: 'Manchester', status: 'On time', route: ['London', 'Manchester', 'Birmingham'] },
        { id: 2, name: 'Train 2', origin: 'Birmingham', destination: 'Edinburgh', status: 'Late', route: ['Birmingham', 'Manchester', 'Edinburgh'] },
        { id: 3, name: 'Train 3', origin: 'Manchester', destination: 'Cardiff', status: 'Early', route: ['Manchester', 'Cardiff'] },
    ];

    return (
        <MapContainer center={[54, -0.5]} zoom={6} style={{ height: '100vh', background: 'ghostwhite' }} whenCreated={setMap}>
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                maxZoom={20}
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            {dummyTrains.map((train) => (
                <Marker
                    key={train.id}
                    position={dummyStations[train.origin]}
                    icon={trainIcon}
                    eventHandlers={{
                        click: () => displayTrainRoute(train.id),
                    }}
                >
                    <Popup>
                        <div>
                            <h2>{train.name}</h2>
                            <p>Origin: {train.origin}</p>
                            <p>Destination: {train.destination}</p>
                            <p>Status: {train.status}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {routeLine && <Polyline pathOptions={{ color: routeLine.color }} positions={routeLine.positions} />}
        </MapContainer>
    );
};

export default MyMap;
