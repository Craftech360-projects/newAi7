import React from 'react';

const LoadingScreen = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width:'100vw', backgroundColor:"#000" }}>
        <img src="bb.gif" alt="Loading GIF" style={{ width: '10%' }} />
    </div>
    );
};

export default LoadingScreen;
