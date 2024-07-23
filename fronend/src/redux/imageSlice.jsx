// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//     qrCodeUrl: localStorage.getItem('qrCodeUrl') || '',
//     resultImageUrl: localStorage.getItem('resultImageUrl') || '',
//     isVideoPlaying: JSON.parse(localStorage.getItem('isVideoPlaying')) || false,
// };

// const imageSlice = createSlice({
//     name: 'image',
//     initialState,
//     reducers: {
//         setQrCodeUrl: (state, action) => {
//             state.qrCodeUrl = action.payload;
//             localStorage.setItem('qrCodeUrl', action.payload);
//         },
//         setResultImageUrl: (state, action) => {
//             state.resultImageUrl = action.payload;
//             localStorage.setItem('resultImageUrl', action.payload);
//         },
//         setIsVideoPlaying: (state, action) => {
//             state.isVideoPlaying = action.payload;
//             localStorage.setItem('isVideoPlaying', JSON.stringify(action.payload));
//         },
//     },
// });

// export const { setQrCodeUrl, setResultImageUrl, setIsVideoPlaying } = imageSlice.actions;
// export default imageSlice.reducer;


// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//     qrCodeUrl: '',
//     resultImageUrl: '',
//     isVideoPlaying: false,
// };

// const imageSlice = createSlice({
//     name: 'image',
//     initialState,
//     reducers: {
//         setQrCodeUrl: (state, action) => {
//             state.qrCodeUrl = action.payload;
//         },
//         setResultImageUrl: (state, action) => {
//             state.resultImageUrl = action.payload;
//         },
//         clearResultImageUrl: (state) => {
//             state.resultImageUrl = '';
//         },
//         setIsVideoPlaying: (state, action) => {
//             state.isVideoPlaying = action.payload;
//         },
//     },
// });

// export const { setQrCodeUrl, setResultImageUrl, clearResultImageUrl, setIsVideoPlaying } = imageSlice.actions;

// export default imageSlice.reducer;



import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    qrCodeUrl: localStorage.getItem('qrCodeUrl') || '',
    resultImageUrl: localStorage.getItem('resultImageUrl') || '',
    isVideoPlaying: JSON.parse(localStorage.getItem('isVideoPlaying')) || false,
    loading: false, // Add loading state

};

const imageSlice = createSlice({
    name: 'image',
    initialState,
    reducers: {
        setQrCodeUrl: (state, action) => {
            state.qrCodeUrl = action.payload;
            localStorage.setItem('qrCodeUrl', action.payload);
        },
        setResultImageUrl: (state, action) => {
            state.resultImageUrl = action.payload;
            localStorage.setItem('resultImageUrl', action.payload);
        },
        clearResultImageUrl: (state) => {
            state.resultImageUrl = '';
            localStorage.removeItem('resultImageUrl');
        },
        setIsVideoPlaying: (state, action) => {
            state.isVideoPlaying = action.payload;
            localStorage.setItem('isVideoPlaying', JSON.stringify(action.payload));
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setQrCodeUrl, setResultImageUrl, clearResultImageUrl, setIsVideoPlaying, setLoading } = imageSlice.actions;
export default imageSlice.reducer;
