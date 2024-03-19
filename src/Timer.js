import React, { useState, useEffect } from "react";

const Timer = ({ refreshTrains }) => {
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
      <span style={{fontSize: 20}}>
        {delay}
      </span>
    );
};

export default Timer;