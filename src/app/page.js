'use client';

import Image from 'next/image'
import Head from 'next/head'
import Script from 'next/script'
import styles from './page.module.css'
import React, { useEffect, useRef, useState } from 'react';
import DrawingCanvas from './DrawingCanvas';
import LoadingOverlay from './Loading/LoadingOverlay';
import './App.css'; // Import the CSS filey'
import { useSearchParams } from 'next/navigation'

export default function Home() {
  const canvasRef = useRef(null);
  const [fullName, setFullName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const searchParams = useSearchParams();
  const docId = searchParams.get("docId");

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleSave = async () => {
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
    <Script src="https://telegram.org/js/telegram-web-app.js"></Script>
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
      <h3>Ստորագրեք ստօրև ուղանկյան մեջ / Sign in the rectangular area bellow</h3>
      <DrawingCanvas fullName={fullName} canvasRef={canvasRef} />
      <div>
      <button className='reset-button' onClick={handleClear}>Մաքրել! / Clear!</button>       
      <button className='download-button' onClick={handleSave}>Ստորագրել! / Sign!</button>
      </div>      
      {isUploading && <LoadingOverlay />}
    </div>
    </main>
  )
}
