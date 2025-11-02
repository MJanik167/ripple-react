import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';



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

class Player {
  constructor(x, y, ctx) {
    console.log(x, y, ctx);

    this.x = x;
    this.y = y;
    this.ctx = ctx;
  }

  keyDown(e) {
    console.log(this);

    switch (e.key) {
      case 'w':
        this.y -= 10;
        break;
      case 'a':
        this.x -= 10;
        break;
      case 's':
        this.y += 10;
        break;
      case 'd':
        this.x += 10;
        break;

      default:
        break;
    }
  }

  draw() {
    this.ctx.fillStyle = '#ff0000ff';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    this.ctx.fill();
  }
}


function App() {
  const canvasRef = useRef(null);
  const ripples = useRef([]);
  const player = useRef(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const handleResize = () => {
    setWindowHeight(window.innerHeight);
    setWindowWidth(window.innerWidth);
  }

  useLayoutEffect(() => {
    let canvas = document.querySelector('.App');

    canvasRef.current = canvas.getContext('2d');
    canvasRef.current.strokeStyle = '#c4c4c4ff';
    canvasRef.current.lineWidth = 10;

    player.current = new Player(200, 200, canvasRef.current)

    window.addEventListener('resize', handleResize);

    requestAnimationFrame(draw);

    window.addEventListener('keydown', player.current.keyDown.bind(player.current));

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', player.current.keyDown);
    }
  }, []);

  const handleClick = (e) => {
    ripples.current.push(new Ripple(e.pageX, e.pageY, canvasRef.current));
  };



  let mapX = 8, mapY = 8, tileSize = 64;
  let map = [
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 1, 0, 0, 0, 1,
    1, 0, 0, 1, 0, 0, 0, 1,
    1, 0, 0, 1, 0, 0, 0, 1,
    1, 0, 0, 1, 1, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 1, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1,

  ]



  const drawMap = () => {
    for (let y = 0; y < mapY; y++) {
      for (let x = 0; x < mapX; x++) {
        if (map[y * mapX + x] === 1) {
          canvasRef.current.fillStyle = '#ffffffff';
        } else {
          canvasRef.current.fillStyle = '#000000ff';
        }
        canvasRef.current.fillRect(x * tileSize + 1, y * tileSize + 1, tileSize - 1, tileSize - 1);
      }
    }
  }


  const draw = () => {
    canvasRef.current.clearRect(0, 0, windowWidth, windowHeight);

    drawMap();

    player.current.draw();
    console.log(player.current.y);


    ripples.current.forEach((ripple, index) => {
      ripple.draw();
      if (ripple.radius > ripple.maxRadius) {
        ripples.current.splice(index, 1);
      }
    })

    requestAnimationFrame(draw);
  };




  return (
    <canvas width={windowWidth} height={windowHeight} className="App" onClick={handleClick}>

    </canvas>
  );
}


export default App;
