import {Marker, Tooltip} from "react-leaflet";
import React from "react";
import {Icon} from "leaflet";
import {Clock} from "lucide-react";
import {colors} from "./Map";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes}`;
}

export default function Trains({ trains, selectedTrain, setSelectedTrain }) {
    const getPosition = (latLong) => {
        return  [
            latLong.latitude,
            latLong.longitude,
        ]
    }

    const trainIcon = new Icon({
        iconUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Map_icons_by_Scott_de_Jonge_-_train-station.svg/1024px-Map_icons_by_Scott_de_Jonge_-_train-station.svg.png',
        iconSize: [30, 30],
    });

    return (
        <>
            {trains.map(train => (
                <Marker
                    key={train.trainId}
                    position={getPosition(train.movement.latLong)}
                    icon={trainIcon}
                    eventHandlers={{
                        click: () => {
                            setSelectedTrain(train)
                        },
                    }}
                >
                    <Tooltip>
                        <div className="train-info-container">
                            <h2>{train.headCode}</h2>
                            <p>Origin: {train.originLocation} ({train.originTiploc})</p>
                            <p>Destination: {train.destinationLocation} ({train.destinationTiploc})</p>
                            <div className="arrival-info">
                                <Clock className="icon" />
                                <span>{formatDate(train.actualArrival)}</span>
                                {train.isLate && <span className={"pl-2"}>{train.delayInMinutes} minute(s) late</span>}
                            </div>
                            <span className="status-indicator" style={{ backgroundColor: train.isLate ? colors.late : colors.onTime }}>
                                {train.isLate ? "Late" : "On Time"}
                            </span>
                        </div>
                    </Tooltip>
                </Marker>
            ))}
        </>
    )
}