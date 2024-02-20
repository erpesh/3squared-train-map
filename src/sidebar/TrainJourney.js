import React from "react";
import {Circle, Flag, Goal, MoreVertical} from "lucide-react";

const TrainJourney = ({selectedTrain}) => {
    return (
        <div>
            <div>
                <h3>Train Journey</h3>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'left'}}>
                    <div style={{marginRight: '10px'}}>
                        {selectedTrain.stations.map((station, index) => (
                            <div key={index} style={{marginBottom: '0px', display: 'flex', flexDirection: 'column'}}>
                                {index === 0 ?
                                    <Goal size={30} padding={0}/> :
                                    index === selectedTrain.stations.length - 1 ?
                                        <Flag size={30} padding={0}/> :
                                        <Circle
                                            size={30}
                                            fill={station.isPass && "black"}
                                            padding={10}
                                        />}
                                {index !== selectedTrain.stations.length - 1 && <MoreVertical size={30} padding={0}/>}
                            </div>
                        ))}

                    </div>
                    <div>
                        {selectedTrain.stations.map((station, index) => (
                            <div key={index} style={{marginBottom: '10px'}}>
                                <p><b>{station.location}</b><br/>{station.tiploc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TrainJourney;