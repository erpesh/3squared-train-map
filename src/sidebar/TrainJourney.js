import React, {useMemo} from "react";
import StationItem from "./StationItem";
import FadedStations from "./FadedStations";

const TrainJourney = ({selectedTrain}) => {
    const stationsNumber = selectedTrain.stations.length;
    const origin = selectedTrain.stations[0];
    const destination = selectedTrain.stations[stationsNumber - 1];
    const passedStations = useMemo(() => selectedTrain.stations.filter((s, i) => s.isPass && i !== 0 && i !== stationsNumber - 1), [selectedTrain]);
    const notPassedStations = useMemo(() => selectedTrain.stations.filter((s, i) => !s.isPass && i !== 0 && i !== stationsNumber - 1), [selectedTrain]);

    return (
        <div>
            <h3>Train Journey</h3>
            <div className={'stations-container'}>
                <StationItem
                    station={origin}
                    nextStation={selectedTrain.stations[1]}
                    isFirst
                />
                {passedStations && passedStations.length > 1 && <FadedStations
                    passedStations={passedStations}
                    notPassedStations={notPassedStations}
                    destination={destination}
                />}
                {notPassedStations.map((station, index) => (
                    <StationItem
                        key={index}
                        station={station}
                        nextStation={notPassedStations[index + 1] ?? destination}
                    />
                ))}
                <StationItem
                    station={destination}
                    isLast
                />
            </div>
        </div>
    );
};

export default TrainJourney;