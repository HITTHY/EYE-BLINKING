import * as faceapi from 'face-api.js';
import { BLINK_THRESHOLD } from './constants';

export const loadModels = async () => {
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]);
    console.log('Models loaded successfully');
  } catch (error) {
    console.error('Error loading models:', error);
    throw error;
  }
};

export const detectEyeBlink = async (
  video: HTMLVideoElement,
  onBlink: () => void
) => {
  const detection = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks();

  if (detection) {
    const landmarks = detection.landmarks;
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    const leftEyeAspectRatio = getEyeAspectRatio(leftEye);
    const rightEyeAspectRatio = getEyeAspectRatio(rightEye);
    
    if (leftEyeAspectRatio < BLINK_THRESHOLD && rightEyeAspectRatio < BLINK_THRESHOLD) {
      onBlink();
    }
  }
};

const getEyeAspectRatio = (eyePoints: faceapi.Point[]) => {
  const v1 = calculateDistance(eyePoints[1], eyePoints[5]);
  const v2 = calculateDistance(eyePoints[2], eyePoints[4]);
  const h = calculateDistance(eyePoints[0], eyePoints[3]);
  
  return (v1 + v2) / (2.0 * h);
};

const calculateDistance = (point1: faceapi.Point, point2: faceapi.Point) => {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  );
};