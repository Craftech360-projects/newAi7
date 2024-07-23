// import React, { useRef, useState } from 'react';
// import './App.css';

// function App() {
//   const canvasRef = useRef(null);
//   const inputRef = useRef(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [imageUrl, setImageUrl] = useState(null);

//   const startDrawing = () => {
//     setIsDrawing(true);
//     const context = canvasRef.current.getContext('2d');
//     context.beginPath();
//   };

//   const draw = ({ nativeEvent }) => {
//     if (!isDrawing) return;
//     const { offsetX, offsetY } = nativeEvent;
//     const context = canvasRef.current.getContext('2d');
//     context.lineTo(offsetX, offsetY);
//     context.stroke();
//   };

//   const stopDrawing = () => {
//     setIsDrawing(false);
//   };

//   const handleSubmit = async () => {
//     const canvas = canvasRef.current;
//     const text = inputRef.current.value;

//     if (!text.trim()) {
//       alert('Please enter some text.');
//       return;
//     }

//     canvas.toBlob(async (blob) => {
//       if (!blob) {
//         console.error('Canvas toBlob conversion failed');
//         alert('Canvas conversion failed. Please try again.');
//         return;
//       }

//       const formData = new FormData();
//       formData.append('file', blob, 'canvas.png');
//       formData.append('text', text);

//       try {
//         const response = await fetch('http://127.0.0.1:8000/generate', {
//           method: 'POST',
//           body: formData,
//         });

//         if (!response.ok) {
//           throw new Error(`Server error: ${response.statusText}`);
//         }

//         const imageBlob = await response.blob();
//         const imageUrl = URL.createObjectURL(imageBlob);
//         setImageUrl(imageUrl);
//       } catch (error) {
//         console.error('Error submitting the form:', error);
//         alert('An error occurred. Please try again.');
//       }
//     }, 'image/png');
//   };

//   return (
//     <div className="container">
//       <h1>Draw and Submit Image with Text</h1>
//       <div className="canvas-container">
//         <canvas
//           ref={canvasRef}
//           width={480}
//           height={272}
//           onMouseDown={startDrawing}
//           onMouseMove={draw}
//           onMouseUp={stopDrawing}
//           onMouseOut={stopDrawing}
//         />
//       </div>
//       <div>
//         <input type="text" ref={inputRef} placeholder="Enter your text here" />
//       </div>
//       <button onClick={handleSubmit}>Submit</button>
//       <div id="responseContainer">
//         {imageUrl && <img src={imageUrl} alt="Generated" />}
//       </div>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import CanvasDrawing from './components/CanvasDrawing';
import DisplayQRCode from './components/DisplayQRCode';
import DisplayResult from './components/DisplayResult';
import LoadingPage from './components/LoadingScreen';

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route path="/" element={<CanvasDrawing />} />
                    <Route path="/qr-code" element={<DisplayQRCode />} />
                    <Route path="/loading" element={<LoadingPage />} />
                    <Route path="/result" element={<DisplayResult />} />
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;



