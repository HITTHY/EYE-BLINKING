import React from 'react';
import styled from 'styled-components';

interface BlinkCounterProps {
  current: number;
  total: number;
}

const CounterContainer = styled.div`
  font-size: 1.1rem;
  margin-top: 1rem;
  color: #333;
`;

export const BlinkCounter: React.FC<BlinkCounterProps> = ({ current, total }) => (
  <CounterContainer>
    Blinks detected: {current} / {total}
  </CounterContainer>
);