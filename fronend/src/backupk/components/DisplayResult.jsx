// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const DisplayResult = () => {
//     const [resultImage, setResultImage] = useState('');
//     const navigate = useNavigate();

//     useEffect(() => {
//         const image = localStorage.getItem('resultImage');
//         if (image) {
//             setResultImage(image);
//         } else {
//             navigate('/');
//         }
//     }, [navigate]);

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
//             {resultImage && (
//                 <div style={{ marginTop: '20px' }}>
//                     <img src={resultImage} alt="Generated Image" />
//                 </div>
//             )}
//             <button style={{ marginTop: '20px' }} onClick={() => navigate('/')}>Back to Draw</button>
//         </div>
//     );
// };

// export default DisplayResult;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DisplayResult = () => {
    const [resultImage, setResultImage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const image = localStorage.getItem('resultImage');
        if (image) {
            setResultImage(image);
        } else {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            {resultImage && (
                <div style={{ marginTop: '20px' }}>
                    <img src={resultImage} alt="Generated Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                </div>
            )}
            <button style={{ marginTop: '20px' }} onClick={() => navigate('/')}>Back to Draw</button>
        </div>
    );
};

export default DisplayResult;
