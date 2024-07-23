import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LoadingPage = () => {
    const resultImageUrl = useSelector((state) => state.image.resultImageUrl);
    const navigate = useNavigate();

    useEffect(() => {
        if (resultImageUrl) {
            navigate('/result');
        }
    }, [resultImageUrl, navigate]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <img src="bb.gif" alt="Loading GIF" style={{ width: '400px' }} />
        </div>
    );
};

export default LoadingPage;
