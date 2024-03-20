import React from 'react';
import {useAppState} from "../AppContext";
import Train from "./Train";

export default function Trains() {
    const {
        filteredTrains,
    } = useAppState();

    return (
        <>
            {filteredTrains.map(train => (
                <Train key={train.trainId} train={train}/>
            ))}
        </>
    )
}