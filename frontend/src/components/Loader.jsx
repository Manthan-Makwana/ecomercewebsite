import React, { useEffect, useState } from 'react';
import '../componentStyles/Loader.css';

const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setVisible(false), 600);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="loader-masterpiece">
      <div className="loader-frame">
        
        {/* Primary Mark */}
        <div className="loader-insignia">
          <div className="insignia-ring">
            <div className="ring-segment"></div>
            <div className="ring-segment"></div>
            <div className="ring-segment"></div>
          </div>
          <div className="insignia-center">
            <span>S</span>
          </div>
        </div>

        {/* Typographic Statement */}
        <div className="loader-statement">
          <div className="statement-line">
            <span className="statement-word" style={{ animationDelay: '0.2s' }}>Welcome</span>
            <span className="statement-word" style={{ animationDelay: '0.4s' }}>To</span>
            <span className="statement-word" style={{ animationDelay: '0.6s' }}>SD</span>
          </div>
          <div className="statement-line">
            <span className="statement-word accent" style={{ animationDelay: '0.8s' }}></span>
          </div>
        </div>

        {/* Elegant Counter */}
        <div className="loader-measure">
          <div className="measure-track">
            <div 
              className="measure-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="measure-number">
            <span className="number-current">{progress}</span>
            <span className="number-total">100</span>
          </div>
        </div>

        {/* Subtle Texture */}
        <div className="loader-texture">
          <div className="texture-grain"></div>
        </div>

      </div>
    </div>
  );
};

export default Loader;