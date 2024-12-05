import React from 'react';
import { useBlinkDetection } from '../../hooks/useBlinkDetection';
import { Container, Video, PasswordInput, Button, Status } from './BlinkAuth.styles';
import { BlinkCounter } from './BlinkCounter';

export const BlinkAuth: React.FC = () => {
  const {
    videoRef,
    password,
    setPassword,
    isRecording,
    status,
    blinkCount,
    startBlinkDetection
  } = useBlinkDetection();

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
      
      {isRecording && <BlinkCounter current={blinkCount} total={password.length} />}
    </Container>
  );
};