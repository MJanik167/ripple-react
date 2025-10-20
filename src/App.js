import logo from './logo.svg';
import './App.css';
import React, { useEffect, useLayoutEffect } from 'react';


class Ripple {
  constructor(x, y, ctx) {
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.radius = 0;
    this.maxRadius = 10000;
    this.lineWidth = 5;
    this.alpha = 1.0;
  }

  draw() {
    this.ctx.moveTo(this.x, this.y);
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius++, 0, 2 * Math.PI);
    this.ctx.stroke();
  }
}

function App() {
  const canvasRef = React.useRef(null);
  const ripples = React.useRef([]);

  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);


  const handleClick = (e) => {
    ripples.current.push(new Ripple(e.pageX, e.pageY, canvasRef.current));
  };

  const handleResize = () => {
    setWindowHeight(window.innerHeight);
    setWindowWidth(window.innerWidth);
  }


  const draw = () => {
    canvasRef.current.clearRect(0, 0, windowWidth, windowHeight);

    ripples.current.forEach((ripple, index) => {
      ripple.draw();
      if (ripple.radius > ripple.maxRadius) {
        ripples.current.splice(index, 1);
      }
    })

    requestAnimationFrame(draw);
  };

  useLayoutEffect(() => {
    let canvas = document.querySelector('.App');
    canvasRef.current = canvas.getContext('2d');
    canvasRef.current.strokeStyle = '#c4c4c4ff';
    canvasRef.current.lineWidth = 10;
    window.addEventListener('resize', handleResize);

    requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);


  return (
    <canvas width={windowWidth} height={windowHeight} className="App" onClick={handleClick}>

    </canvas>
  );
}

export default App;
