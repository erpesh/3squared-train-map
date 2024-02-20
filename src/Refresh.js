import { useState } from "react";
import Timer from './Timer'

const Refresh = ({ refreshTrains }) => {
    let time = new Date().toLocaleTimeString();
    const [currentTime, setCurrentTime] = useState(time);

    const updateTime = () => {
        let time = new Date().toLocaleTimeString();
        setCurrentTime(time);
    }

    setInterval(updateTime, 1000);

    return (
        <div className="Refresh">
            <h1>Live time: {currentTime}</h1>
            <h1>
                Updates in: <Timer refreshTrains={refreshTrains}/>
            </h1>
            <button className={'primary-bg'} onClick={refreshTrains}>Update</button>
        </div>
    )
}

export default Refresh;