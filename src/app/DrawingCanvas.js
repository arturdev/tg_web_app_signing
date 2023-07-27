import React, { useEffect, useState } from 'react';
import './App.css';

const DrawingCanvas = ({ fullName, canvasRef }) => {
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const getOffset = (event) => {
      const canvasBounds = canvas.getBoundingClientRect();
      const scaleX = canvas.width / canvasBounds.width;
      const scaleY = canvas.height / canvasBounds.height;
      return {
        offsetX: (event.clientX - canvasBounds.left) * scaleX,
        offsetY: (event.clientY - canvasBounds.top) * scaleY,
      };
    };

    const startDrawing = (event) => {
      event.preventDefault();
      setIsDrawing(true);
      const { offsetX, offsetY } = getOffset(event);
      context.beginPath();
      context.moveTo(offsetX, offsetY);
    };

    const draw = (event) => {
      event.preventDefault();
      if (!isDrawing) return;
      const { offsetX, offsetY } = getOffset(event);
      context.lineTo(offsetX, offsetY);
      context.lineWidth = 8;
      context.stroke();
    };

    const stopDrawing = () => {
      setIsDrawing(false);
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', (event) => {
      event.preventDefault();
      const touch = event.touches[0];
      const fakeMouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvas.dispatchEvent(fakeMouseEvent);
    });

    canvas.addEventListener('touchmove', (event) => {
      event.preventDefault();
      const touch = event.touches[0];
      const fakeMouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvas.dispatchEvent(fakeMouseEvent);
    });

    canvas.addEventListener('touchend', (event) => {
      event.preventDefault();
      const fakeMouseEvent = new MouseEvent('mouseup', {});
      canvas.dispatchEvent(fakeMouseEvent);
    });

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);

      // Remove touch event listeners
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [isDrawing]);
  
  return (
    <div>
      <div>

      </div>
      <div>
        <canvas ref={canvasRef} width={800} height={400} style={{ border: '3px solid black' }} />      
      </div>      
    </div>
  );
};

export default DrawingCanvas;