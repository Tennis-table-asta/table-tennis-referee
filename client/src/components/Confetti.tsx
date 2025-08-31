import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  show: boolean;
  duration?: number;
}

const Confetti: React.FC<ConfettiProps> = ({ show, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!isVisible) return null;

  const confettiPieces = Array.from({ length: 20 }, (_, i) => {
    const shapes = ['', 'square', 'rectangle'];
    const shapeClass = shapes[Math.floor(Math.random() * shapes.length)];
    
    return (
      <div
        key={i}
        className={`confetti ${shapeClass}`}
        style={{
          left: `${Math.random() * 100}%`,
          animationDuration: `${2 + Math.random() * 2}s`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      />
    );
  });

  return (
    <div className="confetti-container">
      {confettiPieces}
    </div>
  );
};

export default Confetti;