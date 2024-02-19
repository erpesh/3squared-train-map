import React, { useState, useEffect } from "react";

const Timer = ( ) => {
    const [delay, setDelay] = useState(200);

    useEffect(() => {
        const timer = setInterval(() => {
            setDelay(delay - 1);
        }, 1000);

        if (delay === 0) {
            clearInterval(timer);
            window.location.reload();
        }

        return () => {
            clearInterval(timer);
        };
        
    }, [delay]);



    return (
        <>
      <span style={{fontSize: 20}}>
        {delay}
      </span>
        </>
    );
};

export default Timer;