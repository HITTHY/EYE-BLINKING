import { useEffect, useRef, useState } from 'react';
import { loadModels, detectEyeBlink } from '../utils/faceDetection';

export const useBlinkDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [password, setPassword] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('');
  const [blinkCount, setBlinkCount] = useState(0);

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        await loadModels();
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setStatus('Error accessing camera');
      }
    };

    initializeCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startBlinkDetection = () => {
    if (!password) {
      setStatus('Please set a password first');
      return;
    }

    setIsRecording(true);
    setBlinkCount(0);
    setStatus('Start blinking to enter your password...');

    const checkBlinks = async () => {
      if (!videoRef.current || !isRecording) return;

      await detectEyeBlink(videoRef.current, () => {
        setBlinkCount(prev => {
          const newCount = prev + 1;
          if (newCount === password.length) {
            setIsRecording(false);
            setStatus('Password entered successfully!');
          }
          return newCount;
        });
      });

      if (isRecording) {
        requestAnimationFrame(checkBlinks);
      }
    };

    checkBlinks();
  };

  return {
    videoRef,
    password,
    setPassword,
    isRecording,
    status,
    blinkCount,
    startBlinkDetection
  };
};