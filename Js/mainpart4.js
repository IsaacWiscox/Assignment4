// Set up canvas

// Selecting paragraph and initializing count
const para = document.querySelector('p');
let count = 0;

// Selecting canvas and getting 2d context
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Getting canvas width and height
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// Function to generate random number
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
};

// Function to generate random RGB color value
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Shape class
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

// Ball class
class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true;
  }

  // Method to draw the ball
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Method to update ball's position
  update() {
    // Boundary check and velocity updates
    if ((this.x + this.size) >= width || (this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height || (this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  // Method to detect collision with other balls
  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

// EvilCircle class
class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);
    this.color = "white";
    this.size = 10;

    // Event listener for movement controls
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'a':
          this.x -= this.velX;
          break;
        case 'd':
          this.x += this.velX;
          break;
        case 'w':
          this.y -= this.velY;
          break;
        case 's':
          this.y += this.velY;
          break;
      }
    });
  }

  // Method to draw the evil circle
  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 5;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // Method to keep the evil circle within canvas bounds
  checkBounds() {
    if ((this.x + this.size) >= width || (this.x - this.size) <= 0) {
      this.x -= this.size;
    }

    if ((this.y + this.size) >= height || (this.y - this.size) <= 0) {
      this.y -= this.size;
    }
  }

  // Method to detect collision with balls and remove them
  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false;
          count--;
          para.textContent = 'Ball count: ' + count;
        }
      }
    }
  }
}

// Array to hold balls
const balls = [];

// Generating and adding balls to the array
while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );
  balls.push(ball);
  count++;
  para.textContent = 'Ball count: ' + count;
}

// Creating an instance of EvilCircle
const evilBall = new EvilCircle(random(0, width), random(5, height));

// Main loop to update and render balls
function loop() {
  // Drawing semi-transparent background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  // Updating and rendering each ball
  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  // Drawing and updating EvilCircle
  evilBall.draw();
  evilBall.checkBounds();
  evilBall.collisionDetect();

  // Recursive call to loop for animation
  requestAnimationFrame(loop);
}

// Starting the animation loop
loop();
