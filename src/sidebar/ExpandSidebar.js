import React, {useState} from "react";
import {formatTime} from "../utils/formatters";
import TrainJourney from "./TrainJourney";

const ExpandSideBar = ({selectedTrain}) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <div>
            <button onClick={handleExpand} className={'secondary-bg'}>
                {expanded ? 'Less Info' : 'More Info'}
            </button>
            {expanded && (
                <div>
                    <div className='train-card' >
                        <p>Last Reported Status: {selectedTrain.lastReportedType}</p>
                        <p>Departed at: {formatTime(selectedTrain.actualDeparture)}</p>
                        <p>Arrived at: {formatTime(selectedTrain.actualArrival)}</p>
                        <TrainJourney selectedTrain={selectedTrain}/>
                    </div>
                </div>
            )}
        </div>
    );

};

export default ExpandSideBar;