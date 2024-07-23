


// import React, { useRef, useState } from 'react';
// import axios from 'axios';

// const CanvasDrawing = () => {
//     const canvasRef = useRef(null);
//     const [drawing, setDrawing] = useState(false);
//     const [textInput, setTextInput] = useState('');
//     const [resultImage, setResultImage] = useState('');

//     const startDrawing = (e) => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         ctx.beginPath();
//         ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         setDrawing(true);
//     };

//     const stopDrawing = () => {
//         setDrawing(false);
//     };

//     const draw = (e) => {
//         if (!drawing) return;
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         ctx.lineWidth = 2;
//         ctx.lineCap = 'round';
//         ctx.strokeStyle = 'black';
//         ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         ctx.stroke();
//     };

//     const submitDrawing = async () => {
//         const canvas = canvasRef.current;
//         const imageDataUrl = canvas.toDataURL('image/png');
//         const imageData = imageDataUrl.split(',')[1];

//         try {
//             const response = await axios.post('http://127.0.0.1:8000/generate', {
//                 text: textInput,
//                 image: imageData
//             });

//             setResultImage('data:image/png;base64,' + response.data.image_base64);
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
//             <canvas
//                 ref={canvasRef}
//                 width="480"
//                 height="272"
//                 style={{ border: '1px solid black' }}
//                 onMouseDown={startDrawing}
//                 onMouseUp={stopDrawing}
//                 onMouseMove={draw}
//             />
//             <div style={{ marginTop: '20px' }}>
//                 <input
//                     type="text"
//                     value={textInput}
//                     onChange={(e) => setTextInput(e.target.value)}
//                     placeholder="Enter your text here"
//                 />
//                 <button onClick={submitDrawing}>Submit</button>
//             </div>
//             {resultImage && (
//                 <div style={{ marginTop: '20px' }}>
//                     <img src={resultImage} alt="Generated Image" />
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CanvasDrawing;





// import React, { useRef, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const CanvasDrawing = () => {
//     const canvasRef = useRef(null);
//     const [drawing, setDrawing] = useState(false);
//     const [textInput, setTextInput] = useState('');
//     const navigate = useNavigate();

//     const startDrawing = (e) => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         ctx.beginPath();
//         ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         setDrawing(true);
//     };

//     const stopDrawing = () => {
//         setDrawing(false);
//     };

//     const draw = (e) => {
//         if (!drawing) return;
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         ctx.lineWidth = 2;
//         ctx.lineCap = 'round';
//         ctx.strokeStyle = 'black';
//         ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         ctx.stroke();
//     };

//     const submitDrawing = async () => {
//         const canvas = canvasRef.current;
//         const imageDataUrl = canvas.toDataURL('image/png');
//         const imageData = imageDataUrl.split(',')[1];

//         try {
//             const response = await axios.post('http://127.0.0.1:8000/generate', {
//                 text: textInput,
//                 image: imageData
//             });

//             const resultImage = 'data:image/png;base64,' + response.data.image_base64;
//             localStorage.setItem('resultImage', resultImage);
//             navigate('/result');
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
//             <canvas
//                 ref={canvasRef}
//                 width="480"
//                 height="272"
//                 style={{ border: '1px solid black' }}
//                 onMouseDown={startDrawing}
//                 onMouseUp={stopDrawing}
//                 onMouseMove={draw}
//             />
//             <div style={{ marginTop: '20px' }}>
//                 <input
//                     type="text"
//                     value={textInput}
//                     onChange={(e) => setTextInput(e.target.value)}
//                     placeholder="Enter your text here"
//                 />
//                 <button onClick={submitDrawing}>Submit</button>
//             </div>
//         </div>
//     );
// };

// export default CanvasDrawing;











// import React, { useRef, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const CanvasDrawing = () => {
//     const canvasRef = useRef(null);
//     const ctxRef = useRef(null);
//     const [drawing, setDrawing] = useState(false);
//     const [textInput, setTextInput] = useState('');
//     const [brushSize, setBrushSize] = useState(5);
//     const [isErasing, setIsErasing] = useState(false);
//     const [history, setHistory] = useState([]);
//     const navigate = useNavigate();

//     const startDrawing = (e) => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
//         ctxRef.current = ctx;
//         ctx.beginPath();
//         ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         setDrawing(true);
//     };

//     const stopDrawing = () => {
//         if (drawing) {
//             setDrawing(false);
//             saveHistory();
//         }
//     };

//     const draw = (e) => {
//         if (!drawing) return;
//         const canvas = canvasRef.current;
//         const ctx = ctxRef.current;
//         ctx.lineWidth = brushSize;
//         ctx.lineCap = 'round';
//         ctx.strokeStyle = isErasing ? 'white' : 'black';
//         ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         ctx.stroke();
//     };

//     const saveHistory = () => {
//         const canvas = canvasRef.current;
//         const dataUrl = canvas.toDataURL();
//         setHistory((prevHistory) => [...prevHistory, dataUrl]);
//     };

//     const undo = () => {
//         const canvas = canvasRef.current;
//         const ctx = ctxRef.current;
//         if (history.length > 0) {
//             const newHistory = [...history];
//             newHistory.pop();
//             setHistory(newHistory);
//             const img = new Image();
//             img.src = newHistory[newHistory.length - 1] || '';
//             img.onload = () => {
//                 ctx.clearRect(0, 0, canvas.width, canvas.height);
//                 ctx.drawImage(img, 0, 0);
//             };
//         }
//     };

//     const submitDrawing = async () => {
//         const canvas = canvasRef.current;
//         const imageDataUrl = canvas.toDataURL('image/png');
//         const imageData = imageDataUrl.split(',')[1];

//         try {
//             const response = await axios.post('http://127.0.0.1:8000/generate', {
//                 text: textInput,
//                 image: imageData
//             });

//             const resultImage = 'data:image/png;base64,' + response.data.image_base64;
//             localStorage.setItem('resultImage', resultImage);
//             navigate('/result');
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
//             <canvas
//                 ref={canvasRef}
//                 width="480"
//                 height="272"
//                 style={{ border: '1px solid black' }}
//                 onMouseDown={startDrawing}
//                 onMouseUp={stopDrawing}
//                 onMouseMove={draw}
//             />
//             <div style={{ marginTop: '20px' }}>
//                 <input
//                     type="text"
//                     value={textInput}
//                     onChange={(e) => setTextInput(e.target.value)}
//                     placeholder="Enter your text here"
//                 />
//             </div>
//             <div style={{ marginTop: '10px' }}>
//                 <label htmlFor="brushSize">Brush Size:</label>
//                 <input
//                     type="range"
//                     id="brushSize"
//                     min="1"
//                     max="20"
//                     value={brushSize}
//                     onChange={(e) => setBrushSize(e.target.value)}
//                 />
//             </div>
//             <div style={{ marginTop: '10px' }}>
//                 <button onClick={() => setIsErasing(false)}>Brush</button>
//                 <button onClick={() => setIsErasing(true)}>Erase</button>
//                 <button onClick={undo}>Undo</button>
//             </div>
//             <div style={{ marginTop: '20px' }}>
//                 <button onClick={submitDrawing}>Submit</button>
//             </div>
//         </div>
//     );
// };

// export default CanvasDrawing;











import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import QRCode from 'qrcode.react';

const CanvasDrawing = () => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [brushSize, setBrushSize] = useState(5);
    const [isErasing, setIsErasing] = useState(false);
    const [history, setHistory] = useState([]);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [showQrCode, setShowQrCode] = useState(false);
    const navigate = useNavigate();

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctxRef.current = ctx;
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setDrawing(true);
    };

    const stopDrawing = () => {
        if (drawing) {
            setDrawing(false);
            saveHistory();
        }
    };

    const draw = (e) => {
        if (!drawing) return;
        const ctx = ctxRef.current;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = isErasing ? 'white' : 'black';
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    const saveHistory = () => {
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL();
        setHistory((prevHistory) => [...prevHistory, dataUrl]);
    };

    const undo = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (history.length > 0) {
            const newHistory = [...history];
            newHistory.pop();
            setHistory(newHistory);
            const img = new Image();
            img.src = newHistory[newHistory.length - 1] || '';
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        }
    };

    const uploadImageToSupabase = async (imageDataUrl) => {
        const { data, error } = await supabase.storage.from('images').upload(`public/${Date.now()}.png`, imageDataUrl, {
            contentType: 'image/png',
            upsert: true
        });

        if (error) {
            console.error('Supabase upload error:', error);
            return null;
        }

        const { publicURL, error: urlError } = supabase.storage.from('images').getPublicUrl(data.Key);
        if (urlError) {
            console.error('Supabase URL error:', urlError);
            return null;
        }

        return publicURL;
    };

    const submitDrawing = async () => {
        const canvas = canvasRef.current;
        const imageDataUrl = canvas.toDataURL('image/png');
        const imageData = imageDataUrl.split(',')[1];

        try {
            const response = await axios.post('http://127.0.0.1:8000/generate', {
                text: textInput,
                image: imageData
            });

            const resultImage = 'data:image/png;base64,' + response.data.image_base64;
            const imageUrl = await uploadImageToSupabase(resultImage);
            if (imageUrl) {
                localStorage.setItem('resultImage', imageUrl);
                setQrCodeUrl(imageUrl);
                setShowQrCode(true);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const closeQrCode = () => {
        setShowQrCode(false);
        navigate('/result');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <canvas
                ref={canvasRef}
                width="480"
                height="272"
                style={{ border: '1px solid black' }}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
            />
            <div style={{ marginTop: '20px' }}>
                <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter your text here"
                />
            </div>
            <div style={{ marginTop: '10px' }}>
                <label htmlFor="brushSize">Brush Size:</label>
                <input
                    type="range"
                    id="brushSize"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(e.target.value)}
                />
            </div>
            <div style={{ marginTop: '10px' }}>
                <button onClick={() => setIsErasing(false)}>Brush</button>
                <button onClick={() => setIsErasing(true)}>Erase</button>
                <button onClick={undo}>Undo</button>
            </div>
            <div style={{ marginTop: '20px' }}>
                <button onClick={submitDrawing}>Submit</button>
            </div>
            {showQrCode && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'white',
                    padding: '20px',
                    border: '1px solid black',
                    zIndex: 1000
                }}>
                    <QRCode value={qrCodeUrl} />
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <button onClick={closeQrCode}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CanvasDrawing;
.0