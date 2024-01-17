'use client';

import Image from 'next/image'
import Head from 'next/head'
import Script from 'next/script'
import styles from './page.module.css'
import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import DrawingCanvas from './DrawingCanvas';
import LoadingOverlay from './Loading/LoadingOverlay';
import ConfirmationModal from './ConfirmationModal/ConfirmationModal';
import './App.css'; // Import the CSS filey'
import { useSearchParams } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

export default function Home() {
  const canvasRef = useRef(null);
  const [popupMessage, setPopupMessage] = useState('Are you sure you want to save?');
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedApartment, setSelectedApartment] = useState('');
  const [selectedRadio, setSelectedRadio] = useState('1');
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
    if (!selectedBuilding.length) {
      toast.error('Please Select The Building', {
        position: toast.POSITION.TOP_CENTER, // Change the position if needed
        // You can also customize other options like autoClose, closeOnClick, etc.
      });
      return;
    }
    if (!selectedApartment.length) {
      toast.error('Please Select Apartment', {
        position: toast.POSITION.TOP_CENTER, // Change the position if needed
        // You can also customize other options like autoClose, closeOnClick, etc.
      });
      return;
    }
    setPopupMessage(fullName + '\n' + 'Շենք: ' + selectedBuilding + '\n' + 'Բնակարան: ' + selectedApartment)
    setShowModal(true);
  }

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleConfirm = async () => {
    // Perform the save action here
    setShowModal(false);
    // Call your handleSave function if needed
    await handleSaveInternal()
  };

  const handleSaveInternal = async () => {
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
        building: selectedBuilding,
        appartment: selectedApartment,
        vote: parseInt(selectedRadio) || 1,
        signature: image,
       }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsUploading(false);
        console.log('Image uploaded:', data);        
        window.postMessage('web_app_close');
        window.close();

        toast.success('Successfully Signed! You can close the window now.', {
          position: toast.POSITION.TOP_CENTER,
        });
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
      {/* Dropdowns */}
      <div className="dropdowns">
        <div className="dropdown">
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="large-dropdown"
          >
            <option value="">Շենք / Select Building</option>
            <option value="22">22</option>
            <option value="22/1">22/1</option>
            <option value="22/2">22/2</option>
          </select>
        </div>
        <div className="dropdown">
          <select
            value={selectedApartment}
            onChange={(e) => setSelectedApartment(e.target.value)}
            className="large-dropdown"
          >
            <option value="">Բնակարան / Apartment</option>
            {Array.from({ length: 91 }, (_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Radio buttons */}
      <div className="radio-buttons">
          <label></label>
          <div className="radio-button">
            <label className="first-radio">
              <input
                type="radio"
                value="1"
                checked={selectedRadio === '1'}
                onChange={() => setSelectedRadio('1')}
              />
              Կողմ
            </label>
          </div>

          <div className="radio-button">
            <label>
              <input
                type="radio"
                value="0"
                checked={selectedRadio === '0'}
                onChange={() => setSelectedRadio('0')}
              />
              Ձեռնպահ
            </label>
          </div>

          <div className="radio-button">
            <label>
              <input
                type="radio"
                value="-1"
                checked={selectedRadio === '-1'}
                onChange={() => setSelectedRadio('-1')}
              />
              Դեմ
            </label>
          </div>
        </div>

      <h3>Ստորագրեք ստորև ուղանկյան մեջ / Sign in the rectangular area bellow</h3>
      <DrawingCanvas fullName={fullName} canvasRef={canvasRef} />
      <div>        
      <button className='reset-button' onClick={handleClear}>Մաքրել! / Clear!</button>       
      <button className='download-button' onClick={handleSave}>Ստորագրել! / Sign!</button>
      </div>      
      {isUploading && <LoadingOverlay />}
      {showModal && (
          <ConfirmationModal 
            message={popupMessage}
            vote={selectedRadio}
            onCancel={handleCancel} 
            onConfirm={handleConfirm} 
          />
      )}
      <ToastContainer />
    </div>
    </main>
  )
}
