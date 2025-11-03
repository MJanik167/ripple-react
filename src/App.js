import './App.css';
import { useState, useLayoutEffect, useRef } from 'react';

const pi = Math.PI;
const mapX = 8, mapY = 8, tileSize = 64;

const map = [
  1, 1, 1, 1, 1, 1, 1, 1,
  1, 0, 0, 1, 0, 0, 0, 1,
  1, 0, 0, 1, 0, 0, 0, 1,
  1, 0, 0, 1, 0, 0, 0, 1,
  1, 0, 0, 1, 1, 0, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 1, 0, 1,
  1, 1, 1, 1, 1, 1, 1, 1,

]



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
    this.dx = 0;
    this.dy = 0;
    this.right = 0;
    this.left = 0;
    this.a = 0;
    this.ctx = ctx;
  }

  keyDown(e) {
    console.log(e.key);

    switch (e.key) {
      case 'w':
        this.y += this.dy * 10;
        this.x += this.dx * 10;
        break;
      case 'a':
        this.y -= this.left * 10;
        this.x -= this.right * 10;
        break;
      case 's':
        this.y -= this.dy * 10;
        this.x -= this.dx * 10;
        break;
      case 'd':
        this.y += this.left * 10;
        this.x += this.right * 10;
        break;
      case 'ArrowUp':

        break;
      case 'ArrowDown':

        break;
      case 'ArrowLeft':
        this.a -= 0.1;
        if (this.a < 0) this.a = 2 * pi;
        this.dx = Math.cos(this.a);
        this.dy = Math.sin(this.a);
        this.right = Math.cos(this.a + pi / 2);
        this.left = Math.sin(this.a + pi / 2);
        break;
      case 'ArrowRight':
        this.a += 0.1;
        if (this.a > 2 * pi) this.a = 0;
        this.dx = Math.cos(this.a);
        this.dy = Math.sin(this.a);
        this.right = Math.cos(this.a + pi / 2);
        this.left = Math.sin(this.a + pi / 2);
        break;
      default:
        break;
    }
  }

  draw() {

    //direction indicator
    // this.ctx.strokeStyle = '#0000ffff';
    // this.ctx.beginPath();
    // this.ctx.moveTo(this.x, this.y);
    // this.ctx.lineTo(this.x + this.dx * 100, this.y + this.dy * 100);
    // this.ctx.stroke();


    this.ctx.fillStyle = '#ff0000ff';
    //player body
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    this.ctx.fill();
    this.rayCast();

  }

  rayCast() {
    let r, rx, ry, ra, xo, yo, dof;
    let mp, mx, my
    ra = this.a

    for (r = 0; r < 1; r++) {

      dof = 0
      let aTan = -1 / Math.tan(ra)
      if (ra > pi) {
        ry = Math.floor(this.y / tileSize) * tileSize - 0.0001
        rx = (this.y - ry) * aTan + this.x
        console.log(ry, rx);
        yo = -tileSize;
        xo = -yo * aTan;
      }
      if (ra < pi) {
        ry = Math.floor(this.y / tileSize) * tileSize + tileSize
        rx = (this.y - ry) * aTan + this.x
        yo = tileSize;
        xo = -yo * aTan;
      }
      if (ra == 0 || ra == pi) {
        rx = this.x
        ry = this.y
        dof = 8
      }
      while (dof < 4) {
        mx = Math.floor(rx / tileSize)
        my = Math.floor(ry / tileSize)
        mp = my * mapX + mx;

        if (mp < mapX * mapY && map[mp] == 1) {
          dof = 8
        } else {
          rx += xo
          ry += yo
          dof += 1
        }
      }
      console.log(rx, ry)
      this.ctx.strokeStyle = '#4adb37ff';
      this.ctx.beginPath();
      this.ctx.moveTo(this.x, this.y);
      this.ctx.lineTo(rx, ry);
      this.ctx.stroke();


      dof = 0
      let nTan = -Math.tan(ra)
      if (ra > pi / 2 && ra < pi * 3 / 2) {
        rx = Math.floor(this.x / tileSize) * tileSize - 0.0001
        ry = (this.x - rx) * nTan + this.y
        xo = -tileSize;
        yo = -xo * nTan;
      }
      if (ra < pi / 2 || ra > pi * 3 / 2) {
        rx = Math.floor(this.x / tileSize) * tileSize + tileSize
        ry = (this.x - rx) * nTan + this.y
        xo = tileSize;
        yo = -xo * nTan;
      }
      if (ra == 0 || ra == pi) {
        rx = this.x
        ry = this.y
        dof = 8
      }
      while (dof < 4) {
        mx = Math.floor(rx / tileSize)
        my = Math.floor(ry / tileSize)
        mp = my * mapX + mx;

        if (mp < mapX * mapY && map[mp] == 1) {
          dof = 8
        } else {
          rx += xo
          ry += yo
          dof += 1
        }
      }
      this.ctx.strokeStyle = '#db3797ff';
      this.ctx.beginPath();
      this.ctx.moveTo(this.x, this.y);
      this.ctx.lineTo(rx, ry);
      this.ctx.stroke();
    }
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
