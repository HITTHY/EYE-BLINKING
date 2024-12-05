import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { loadModels, detectEyeBlink } from '../utils/faceDetection';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Video = styled.video`
  width: 640px;
  height: 480px;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const PasswordInput = styled.input`
  padding: 0.5rem;
  margin: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 300px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.5rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const Status = styled.div<{ $success?: boolean }>`
  color: ${props => props.$success ? 'green' : 'red'};
  margin: 1rem 0;
`;

export const BlinkAuth: React.FC = () => {
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

  return (
    <Container>
      <h1>Blink Authentication System</h1>
      <Video ref={videoRef} autoPlay muted />
      
      <PasswordInput
        type="password"
        placeholder="Set your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isRecording}
      />

      <Button onClick={startBlinkDetection} disabled={isRecording || !password}>
        {isRecording ? 'Recording Blinks...' : 'Start Blink Detection'}
      </Button>

      {status && <Status $success={status.includes('successfully')}>{status}</Status>}
      
      {isRecording && (
        <div>Blinks detected: {blinkCount} / {password.length}</div>
      )}
    </Container>
  );
};