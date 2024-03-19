import {useEffect, useState} from "react";
import Timer from './Timer'
import {useAppState} from "./AppContext";

const Refresh = () => {
    const {refreshTrains} = useAppState();

    const defaultDelay = 20;
    const [delay, setDelay] = useState(defaultDelay);

    useEffect(() => {
        const timer = setInterval(() => {
            setDelay(delay - 1);
        }, 1000);

        if (delay === 0) {
            clearInterval(timer);
            refreshTrains();
            setDelay(defaultDelay);
        }

        return () => {
            clearInterval(timer);
        };

    }, [delay]);

    return (
        <></>
    )
}

export default Refresh;