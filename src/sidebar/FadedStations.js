import StationItem from "./StationItem";
import React, {useState} from "react";

export default function FadedStations({passedStations, notPassedStations, destination}) {
    const [faded, setFaded] = useState(true);

    if (faded)
        return (
            <div onClick={() => setFaded(false)} style={{position: 'relative'}}>
                <StationItem
                    station={passedStations[0]}
                    nextStation={passedStations[1]}
                />
                <div className={'fade-stations'}/>
            </div>
        )

    return (
        <>
            {passedStations.map((station, index) => (
                <StationItem
                    key={index}
                    station={station}
                    nextStation={notPassedStations[index + 1] ?? destination}
                />
            ))}
        </>
    )
}