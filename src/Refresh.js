import { useState } from "react";
import Timer from './Timer'
const Refresh = () => {
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
            <h1>Refreshes in: <Timer/></h1>
            <button onClick={()=> window.location.reload(false)}>Refresh</button>
        
        </div>
        
    
    )
}

export default Refresh;