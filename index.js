const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");

canvas.width = 1900;
canvas.height = 900;

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/oak_woods_v1.0/background/background1.png",
});

const shop = new Sprite({
  position: {
    x: 1130,
    y: 174,
  },
  imageSrc: "./assets/oak_woods_v1.0/decorations/shop_anim.png",
  scale: 4.5,
  framesMax: 6,
});

const player1 = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/oak_woods_v1.0/Martial Hero 3/Sprite/Idle.png",
  framesMax: 10,
  scale: 4.5,
  offset: {
    x: 115,
    y: 70,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/oak_woods_v1.0/Martial Hero 3/Sprite/Idle.png",
      framesMax: 10,
    },
    run: {
      imageSrc: "./assets/oak_woods_v1.0/Martial Hero 3/Sprite/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/oak_woods_v1.0/Martial Hero 3/Sprite/Going Up.png",
      framesMax: 3,
    },
    fall: {
      imageSrc: "./assets/oak_woods_v1.0/Martial Hero 3/Sprite/Going Down.png",
      framesMax: 3,
    },
    attack1: {
      imageSrc: "./assets/oak_woods_v1.0/Martial Hero 3/Sprite/Attack3.png",
      framesMax: 9,
    },
  },
  attackBox: {
    offset: {
      x: 250,
      y: 150,
    },
    width: 200,
    height: 100,
  },
});

const player2 = new Fighter({
  position: {
    x: 800,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  color: "red",
  offset: {
    x: 100,
    y: 0,
  },
  imageSrc: "./assets/oak_woods_v1.0/Wizard Pack/Idle.png",
  framesMax: 6,
  scale: 2.5,
  offset: {
    x: 315,
    y: 50,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/oak_woods_v1.0/Wizard Pack/IdleInverted.png",
      framesMax: 6,
    },
    run: {
      imageSrc: "./assets/oak_woods_v1.0/Wizard Pack/RunInverted.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/oak_woods_v1.0/Wizard Pack/JumpInverted.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/oak_woods_v1.0/Wizard Pack/FallInverted.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/oak_woods_v1.0/Wizard Pack/Attack2Inverted.png",
      framesMax: 8,
    },
  },
  attackBox: {
    offset: {
      x: 0,
      y: 100,
    },
    width: 100,
    height: 100,
  },
});

player2.draw();

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

let lastKey;

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player1.update();
  player2.update();

  player1.velocity.x = 0;
  player2.velocity.x = 0;

  //player 1 movement

  if (keys.a.pressed && player1.lastKey === "a") {
    player1.velocity.x = -5;
    player1.switchSprite("run");
  } else if (keys.d.pressed && player1.lastKey === "d") {
    player1.velocity.x = 5;
    player1.switchSprite("run");
  } else {
    player1.switchSprite("idle");
  }

  // jumping
  if (player1.velocity.y < 0) {
    player1.switchSprite("jump");
  } else if (player1.velocity.y > 0) {
    player1.switchSprite("fall");
  }
  if (keys.ArrowLeft.pressed && player2.lastKey === "ArrowLeft") {
    //player2 movement
    player2.velocity.x = -5;
    player2.switchSprite("run");
  } else if (keys.ArrowRight.pressed && player2.lastKey === "ArrowRight") {
    player2.velocity.x = 5;
    player2.switchSprite("run");
  } else {
    player2.switchSprite("idle");
  }

  // jumping
  if (player2.velocity.y < 0) {
    player2.switchSprite("jump");
  } else if (player2.velocity.y > 0) {
    player2.switchSprite("fall");
  }

  //detect for collision
  if (
    rectangularCollision({
      rectangle1: player1,
      rectangle2: player2,
    }) &&
    player1.isAttacking &&
    player1.framesCurrent === 4
  ) {
    player1.isAttacking = false;
    player2.health -= 20;
    document.querySelector("#player2Health").style.width = player2.health + "%";
  }
  if (
    rectangularCollision({
      rectangle1: player2,
      rectangle2: player1,
    }) &&
    player2.isAttacking &&
    player1.framesCurrent === 4
  ) {
    player2.isAttacking = false;
    player1.health -= 20;
    document.querySelector("#player1Health").style.width = player1.health + "%";
  }

  // end game based on health
  if (player1.health <= 0 || player2.health <= 0) {
    determineWiner({ player1, player2, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player1.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player1.lastKey = "a";
      break;
    case "w":
      player1.velocity.y = -20;
      break;
    case " ":
      player1.attack();
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      player2.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      player2.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      player2.velocity.y = -20;
      break;
    case "ArrowDown":
      player2.attack();
      break;
  }
});
window.addEventListener("keyup", (event) => {
  //player1 keys
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  //player2 keys
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
