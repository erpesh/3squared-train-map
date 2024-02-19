import React from 'react';

const Button = () => {
    return(
        <div classname = "Button">
            <button onClick={()=> window.location.reload(false)}>Refresh</button>
        </div>
    );
};

export default Button