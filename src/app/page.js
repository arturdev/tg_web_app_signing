'use client';

import Image from 'next/image'
import Head from 'next/head'
import Script from 'next/script'
import styles from './page.module.css'
import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import DrawingCanvas from './DrawingCanvas';
import LoadingOverlay from './Loading/LoadingOverlay';
import './App.css'; // Import the CSS filey'
import { useSearchParams } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

export default function Home() {
  const canvasRef = useRef(null);
  const [fullName, setFullName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [webApp, setWebApp] = useState();

  const searchParams = useSearchParams();
  const docId = searchParams.get("docId");

  useEffect(() => {
  }, []);

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleSave = async () => {
    if (fullName.trim() === "") {
      // show alert popup saying that name is required
      toast.error('Please enter your name', {
        position: toast.POSITION.TOP_CENTER, // Change the position if needed
        // You can also customize other options like autoClose, closeOnClick, etc.
      });
      return;
    }

    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png'); // Convert canvas to PNG data URL    
    setIsUploading(true);
    fetch('https://signdocument-qhhw3p7hbq-uc.a.run.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        docId: docId,
        fullname: fullName,
        signature: image,
       }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsUploading(false);
        console.log('Image uploaded:', data);        
        window.postMessage('web_app_close');
        window.close();
      })
      .catch((error) => {
        setIsUploading(false);
        console.error('Error uploading image:', error);
      });
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (        
    <main className={styles.main}>            
    {/* <Script src="https://telegram.org/js/telegram-web-app.js" defer></Script> */}
        <div className="App">
       <div className="header">
       <p>Մուտքագրեք Ձեր Անուն Ազգանունը / Enter your full name</p>
       <input
          type="text"
          value={fullName}
          onChange={handleFullNameChange}
          placeholder="Անուն Ազգանուն"
        />
      </div>
      <h3>Ստորագրեք ստորև ուղանկյան մեջ / Sign in the rectangular area bellow</h3>
      <DrawingCanvas fullName={fullName} canvasRef={canvasRef} />
      <div>
      <button className='reset-button' onClick={handleClear}>Մաքրել! / Clear!</button>       
      <button className='download-button' onClick={handleSave}>Ստորագրել! / Sign!</button>
      </div>      
      {isUploading && <LoadingOverlay />}
      <ToastContainer />
    </div>
    </main>
  )
}
