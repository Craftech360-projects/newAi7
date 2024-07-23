import React from 'react';
import { useSelector } from 'react-redux';
import QRCode from 'qrcode.react';

const DisplayQRCode = () => {
    const qrCodeUrl = useSelector((state) => state.image.qrCodeUrl);
    const resultImageUrl = useSelector((state) => state.image.resultImageUrl);

    return (
        <div className='bContainer'>
            <div className='leftCV'>
                {resultImageUrl && (
                    <div className='imageConatiner'>
                        <img className='imgFF' src={resultImageUrl} alt="Generated Image" />
                        {/* <img src="bg.png" alt="" style={{ maxWidth: '100%', maxHeight: '100%' }} /> */}
                    </div>
                )}
            </div>
            <div className='rightCV'>

                <div className='qrContainer'>

                    {qrCodeUrl && (
                        <div className='qrContainerIn'> 
                            <QRCode value={qrCodeUrl} width={300} height={300} style={{width:'290px', height:"290px"}}/>
                        </div>
                    )}
                </div>
                <div className='btnCONtt'>


                    <button style={{ marginTop: '20px' }} onClick={() => window.location.href = '/'}>
                       
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DisplayQRCode;
