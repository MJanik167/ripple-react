import logo from './logo.svg';
import './App.css';
import React, { useEffect, useLayoutEffect } from 'react';

function App() {
  const canvasRef = React.useRef(null);

  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);

  const handleClick = (e) => {

    canvasRef.current.moveTo(e.pageX, e.pageY);
    canvasRef.current.beginPath();
    canvasRef.current.arc(e.pageX, e.pageY, 20, 0, 2 * Math.PI);
    canvasRef.current.stroke();
    console.log("line");
  };

  const handleResize = () => {
    setWindowHeight(window.innerHeight);
    setWindowWidth(window.innerWidth);
  }



  useLayoutEffect(() => {
    let canvas = document.querySelector('.App');
    canvasRef.current = canvas.getContext('2d');
    console.log(canvasRef.current);
    window.addEventListener('resize', handleResize);
    console.log("resize listener added");
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
