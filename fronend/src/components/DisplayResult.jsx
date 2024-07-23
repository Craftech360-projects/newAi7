
// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';

// const DisplayResult = () => {
//     const resultImageUrl = useSelector((state) => state.image.resultImageUrl);
//     const loading = useSelector((state) => state.image.loading);
//     const [imageUrl, setImageUrl] = useState(resultImageUrl);

//     useEffect(() => {
//         if (loading) {
//             setImageUrl(null); // Clear the image URL to show the loading GIF
//         } else if (resultImageUrl) {
//             setImageUrl(resultImageUrl); // Set the new image URL once loading is complete
//         }
//     }, [loading, resultImageUrl]);

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
//             {loading || !imageUrl ? (
//                 <img src="bb.gif" alt="Loading GIF" style={{ width: '400px' }} />
//             ) : (
//                 <img src={imageUrl} alt="Generated Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />
//             )}
//         </div>
//     );
// };

// export default DisplayResult;




// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';

// const DisplayResult = () => {
//     const resultImageUrl = useSelector((state) => state.image.resultImageUrl);
//     const loading = useSelector((state) => state.image.loading);
//     const [imageUrl, setImageUrl] = useState(resultImageUrl);

//     useEffect(() => {
//         setImageUrl(resultImageUrl);
//     }, [resultImageUrl]);

//     useEffect(() => {
//         const intervalId = setInterval(() => {
//             if (loading) {
//                 setImageUrl(null); // Clear the image URL to show the loading GIF
//             } else if (resultImageUrl && resultImageUrl !== imageUrl) {
//                 setImageUrl(resultImageUrl); // Set the new image URL once loading is complete
//             }
//         }, 1000); // Poll every second

//         return () => clearInterval(intervalId); // Cleanup interval on component unmount
//     }, [loading, resultImageUrl, imageUrl]);

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
//             {loading || !imageUrl ? (
//                 <img src="bb.gif" alt="Loading GIF" style={{ width: '400px' }} />
//             ) : (
//                 <img src={imageUrl} alt="Generated Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />
//             )}
//         </div>
//     );
// };

// export default DisplayResult;



import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const DisplayResult = () => {
    const resultImageUrl = useSelector((state) => state.image.resultImageUrl);
    const loading = useSelector((state) => state.image.loading);
    const [imageUrl, setImageUrl] = useState(resultImageUrl);

    useEffect(() => {
        setImageUrl(resultImageUrl);
    }, [resultImageUrl]);

    useEffect(() => {
        if (loading) {
            setImageUrl(null); // Clear the image URL to show the loading GIF
        } else if (resultImageUrl) {
            setImageUrl(resultImageUrl); // Set the new image URL once loading is complete
        }
    }, [loading, resultImageUrl]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            {loading || !imageUrl ? (
                <img src="bb.gif" alt="Loading GIF" style={{ width: '400px' }} />
            ) : (
                <img src={imageUrl} alt="Generated Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            )}
        </div>
    );
};

export default DisplayResult;

