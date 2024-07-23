

import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setQrCodeUrl, setResultImageUrl, setIsVideoPlaying, setLoading } from '../redux/imageSlice';
import { supabase } from '../supabaseClient';
import io from 'socket.io-client';

// Replace with your socket server URL

const CanvasDrawing = () => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [brushSize, setBrushSize] = useState(5);
    const [isErasing, setIsErasing] = useState(false);
    const [history, setHistory] = useState([]);
    const [selectedText, setSelectedText] = useState(''); // State for selected text
    const [selectedTool, setSelectedTool] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const socket = io('http://localhost:3000');

    const predefinedTexts = ['cyber city', 'graffiti', 'cosmic cruisers', 'starlight blooms']; // Predefined texts

    const getTouchPos = (canvas, touchEvent) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    };

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctxRef.current = ctx;
        ctx.beginPath();

        if (e.type === 'mousedown' || e.type === 'touchstart') {
            const pos = e.type === 'mousedown' ? { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY } : getTouchPos(canvas, e);
            ctx.moveTo(pos.x, pos.y);
            setDrawing(true);
        }
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
        ctx.strokeStyle = isErasing ? 'black' : 'white';

        let pos;
        if (e.type === 'mousemove' || e.type === 'touchmove') {
            pos = e.type === 'mousemove' ? { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY } : getTouchPos(canvasRef.current, e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }
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

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHistory([]);
    };



    const addLogoToImage = async (imageDataUrl) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const image = new Image();
        image.src = imageDataUrl;

        return new Promise((resolve) => {
            image.onload = () => {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);

                const logo = new Image();
                logo.src = 'logo.png'; // Path to your logo

                logo.onload = () => {
                    const logoWidth = 100; // Adjust the width of the logo
                    const logoHeight = (logo.height / logo.width) * logoWidth; // Maintain aspect ratio
                    ctx.drawImage(logo, canvas.width - logoWidth - 10, 10, logoWidth, logoHeight); // Position the logo

                    const finalImageDataUrl = canvas.toDataURL('image/png');
                    resolve(finalImageDataUrl);
                };
            };
        });
    };


    const uploadImageToSupabase = async (imageDataUrl) => {
        const fileName = `public/${Date.now()}.png`;
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();

        const { data, error } = await supabase.storage.from('images').upload(fileName, blob, {
            contentType: 'image/png',
            upsert: true
        });

        if (error) {
            console.error('Supabase upload error:', error);
            return null;
        }

        const publicURL = `https://mxyippuwkpysdexmxrbm.supabase.co/storage/v1/object/public/images/${fileName}`;
        console.log('Generated image uploaded to Supabase:', publicURL);
        return publicURL;
    };



    const submitDrawing = async () => {
        const canvas = canvasRef.current;
        const imageDataUrl = canvas.toDataURL('image/png');
        // const imageData = imageDataUrl.split(',')[1];


        const byteString = atob(imageDataUrl.split(',')[1]);
        const mimeString = imageDataUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const formData = new FormData();
        formData.append('file', blob, 'drawing.png');
        formData.append('text', selectedText);

        try {

            dispatch(setLoading(true));
            dispatch(setIsVideoPlaying(true));
            dispatch(setResultImageUrl(''));
            navigate('/loading'); // Navigate to loading screen

            socket.emit('playVideo');

            const response = await axios.post('http://127.0.0.1:8000/process', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Connection': 'keep-alive',
                    'Origin': 'http://localhost:7000',
                    'Referer': 'http://localhost:7000/docs',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15',
                    'accept': 'application/json'
                }
            });



            let resultImage = 'data:image/png;base64,' + response.data.image;
            resultImage = await addLogoToImage(resultImage); // Add logo to the image

            const imageUrl = await uploadImageToSupabase(resultImage);
            if (imageUrl) {
                dispatch(setQrCodeUrl(imageUrl));
                dispatch(setResultImageUrl(imageUrl));
                dispatch(setIsVideoPlaying(false));
                dispatch(setLoading(false));
                navigate('/qr-code'); // Navigate to result screen
            }
        } catch (error) {
            console.error('Error:', error);
            dispatch(setLoading(false));
            dispatch(setIsVideoPlaying(false));
        }
    };

    return (
        <div className='mainContainer'>
            <div className='leftContainer'>
                <canvas
                    ref={canvasRef}
                    width="1300"
                    height="1000px"
                    className='canvasContaione'
                    style={{ border: '40px solid #fff' }}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    onTouchStart={startDrawing}
                    onTouchEnd={stopDrawing}
                    onTouchMove={draw}
                    onMouseLeave={stopDrawing}
                    onTouchCancel={stopDrawing}
                />
            </div>
            {/* <div style={{ marginTop: '20px' }}>
                <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter your text here"
                />
            </div> */}
            <div className='rightContainer'>
                <div style={{ marginTop: '30px' }} className='promtsBtnContainer'>
                    {predefinedTexts.map((text, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedText(text)}
                            className='promptsBtn'
                            style={{ backgroundColor: selectedText === text ? '#62D84E' : '#fff' }}
                        >
                            {text}
                        </button>
                    ))}
                </div>

                <div style={{ margin: '130px 0px 30px 0px' }} className='range'>
                    {/* <label htmlFor="brushSize">Brush Size:</label> */}
                    <input
                        type="range"
                        id="brushSize"
                        min="1"
                        max="20"
                        value={brushSize}
                        onChange={(e) => setBrushSize(e.target.value)}
                    />
                </div>

                <div className='funcButtonContainer'>

                    <button
                        onClick={() => {
                            setIsErasing(false);
                            setSelectedTool('brush');
                        }}
                        style={{ backgroundColor: selectedTool === 'brush' ? '#62D84E' : '#fff' }}
                    >
                        <img src='brushicon.png' width={25} style={{
                            margin: "0px 16px 0px 16px",
                        }} />
                        Brush
                    </button>
                    <button
                        onClick={() => {
                            resetCanvas();
                            setSelectedTool('reset');
                        }}
                        style={{ backgroundColor: selectedTool === 'reset' ? '#62D84E' : '#fff' }}
                    >
                        <img src='redrawicon.png' width={25} style={{
                            margin: "0px 16px 0px 16px"
                        }} />
                        Reset
                    </button>
                    <button
                        onClick={() => {
                            setIsErasing(true);
                            setSelectedTool('eraser');
                        }}
                        style={{ backgroundColor: selectedTool === 'eraser' ? '#62D84E' : '#fff' }}
                    >
                        <img src='erasericon.png' width={25} style={{
                            margin: "0px 16px 0px 16px"
                        }} />
                        Eraser
                    </button>
                    {/* <button
                        onClick={() => {
                            undo();
                            setSelectedTool('undo');
                        }}
                        style={{ backgroundColor: selectedTool === 'undo' ? '#62D84E' : '#fff' }}
                    >
                        <img src='redrawicon.png' width={25} style={{
                            margin:"0px 16px 0px 16px",
                        
                         }}/>
                        Undo
                    </button> */}
                    <div className='submitContainer'>
                        <button onClick={submitDrawing}></button>
                    </div>


                    {/* <button onClick={() => setIsErasing(false)}></button>
                    <button onClick={resetCanvas}></button>
                    <button onClick={() => setIsErasing(true)}></button>
                    <button onClick={undo}></button> */}
                </div>

            </div>
        </div>
    );
};

export default CanvasDrawing;











