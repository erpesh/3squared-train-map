import {Marker, Tooltip} from "react-leaflet";
import React from "react";
import {Icon} from "leaflet";

export default function Train({ train, selectedTrain, setSelectedTrain }) {
    const position = [
        train.movement.latLong.latitude,
        train.movement.latLong.longitude,
    ]

    const trainIcon = new Icon({
        iconUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Map_icons_by_Scott_de_Jonge_-_train-station.svg/1024px-Map_icons_by_Scott_de_Jonge_-_train-station.svg.png',
        iconSize: [30, 30],
    });

    return (
        <Marker
            key={train.trainId}
            style={{opacity: selectedTrain && train !== selectedTrain ? 0.5 : 1}}
            position={position}
            icon={trainIcon}
            eventHandlers={{
                click: () => {
                    setSelectedTrain(train)
                },
            }}
        >
            <Tooltip>
                <div>
                    <h2>{train.headCode}</h2>
                    <p>Origin: {train.originLocation}</p>
                    <p>Destination: {train.destinationLocation}</p>
                    <p>Status: {train.cancelled ? 'Cancelled' : 'On time'}</p>
                </div>
            </Tooltip>
        </Marker>
    )
}