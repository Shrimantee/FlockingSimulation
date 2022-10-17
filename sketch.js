// Flocking Simulation - Part 2
// Fishes - Sprite
// By Shrimantee Roy
// Inspired by Daniel Shiffman

const flock = [];

let alignSlider, cohesionSlider, separationSlider, maxSpeedSlider;
let fish, seaweed, fishnet, jellyfish;
let seaweed_loc = []
let sizefactor = []
let seaweed_radius = []
let orgsize;
let obstacle;
let obstacle_radius = 150;
let obstaclelist = []
let maxSpeed = 3;
let coneView = 360;
let coneViewFlag = true;


function updateMaxSpeed() {
  maxSpeed = maxSpeedSlider.value();
}

function updateConeView() {
  coneView = coneviewSlider.value();
}

function checkedEvent() {
  if (coneviewChkbox.checked())
    coneViewFlag = true
  else
    coneViewFlag = false
}

function preload() {
  fish = loadImage('fish-cone.png')
  seaweed = loadImage('seaweed.png')
  fishnet = loadImage('fishnet.png')
  jellyfish = loadImage('jellyfish.png')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  bg = loadImage('bg_1.jpeg');

  menu = createGraphics(windowWidth / 5, windowHeight / 1.4);

  // Alignment Slider
  alignSlider = createSlider(0, 2, 1.5, 0.1);
  alignSlider.addClass('alignSlider')
  alignSlider.position(50, 50)
  textAlign = createElement("h5","Alignment")
  textAlign.position(50,0)
  textAlign.style('font-family',"Papyrus")
  textAlign.style('color',"#ffffff")

  // Cohesion Slider
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  cohesionSlider.position(50, 100)
  cohesionSlider.addClass('alignSlider')
  textAlign = createElement("h5","Cohesion")
  textAlign.position(50,50)
  textAlign.style('font-family',"Papyrus")
  textAlign.style('color',"#ffffff")
  //Separation Slider
  separationSlider = createSlider(0, 2, 2, 0.1);
  separationSlider.position(50, 160)
  separationSlider.addClass('alignSlider')
  textAlign = createElement("h5","Separation")
  textAlign.position(50,110)
  textAlign.style('font-family',"Papyrus")
  textAlign.style('color',"#ffffff")
  // Max Speed Slider
  maxSpeedSlider = createSlider(4, 10, 5, 1);
  maxSpeedSlider.position(50, 210)
  maxSpeedSlider.addClass('alignSlider')
  textAlign = createElement("h5","Speed")
  textAlign.position(50,160)
  textAlign.style('font-family',"Papyrus")
  textAlign.style('color',"#ffffff")
  // Cone-view Checkbox
  coneviewChkbox = createCheckbox('Enable Cone-View', coneViewFlag)
  coneviewChkbox.style('color', "white")
  coneviewChkbox.style('fontSize', "small")
  coneviewChkbox.position(50, 240)
  coneviewChkbox.style('font-family',"Papyrus")
  coneviewChkbox.style('font-weight',"bold")

  // Cone-view angle Slider

  coneviewSlider = createSlider(10, 360, 360, 1);
  coneviewSlider.position(50, 270)
  coneviewSlider.addClass('alignSlider')

  // Obstacle Checkbox
  obstacleChkBox = createCheckbox('Avoid Obstacles!', false)
  obstacleChkBox.style('color', "white")
  obstacleChkBox.style('fontSize', "small")
  obstacleChkBox.position(50, 290)
  obstacleChkBox.style('font-family',"Papyrus")
  obstacleChkBox.style('font-weight',"bold")
  // Food Attractor Checkbox
  foodChkBox = createCheckbox('Give Food!', false)
  foodChkBox.style('color', "white")
  foodChkBox.style('fontSize', "small")
  foodChkBox.position(50, 320)
  foodChkBox.style('font-family',"Papyrus")
  foodChkBox.style('font-weight',"bold")
  // Add Boids
  boidChkBox = createCheckbox('Create More Fishes!', false)
  boidChkBox.style('color', "white")
  boidChkBox.style('fontSize', "small")
  boidChkBox.position(50, 350)
  boidChkBox.style('font-family',"Papyrus")
  boidChkBox.style('font-weight',"bold")
/* 
  jellyChkBox = createCheckbox('Lets kill those Fishes!!', false)
  jellyChkBox.style('color', "white")
  jellyChkBox.style('fontSize', "small")

  jellyChkBox.position(50, 320)
  jellyfish.resize(200, 200) */



  for (let i = 0; i < 10; i++) {
    flock.push(new Boid());
  }

  obstacle = new Obstacle(width / 2, height / 2, obstacle_radius);

  if (obstacleChkBox.checked())
    obstacle = new Obstacle(width / 2, height / 2, obstacle_radius);

  let j = 0

  for (let i = 100; i < width; i += 300) {
    seaweed_loc[j] = random(i, (i * 2))
    sizefactor[j] = random(1, 3)
    j++
  }
  orgsize = createVector(seaweed.width, seaweed.height)


  menu.background(0, 0, 255, 20);

}


function mouseDragged() {
  if (boidChkBox.checked())
    flock.push(new Boid(mouseX, mouseY));
}

function draw() {
  background(bg);

  // Draw Seaweeds
  for (let i = 1; i <= seaweed_loc.length; i++) {
    imageMode(CENTER)
    image(seaweed, seaweed_loc[i - 1], height - seaweed.height / 2)
    imageMode(CORNER)
  }

  
  if (obstacleChkBox.checked()) {
    obstaclelist[0] = (new Obstacle(mouseX, mouseY, obstacle_radius, fishnet));
    for (let i = 1; i <= seaweed_loc.length; i++) {
      imageMode(CENTER)
      obstaclelist[i] = (new Obstacle(seaweed_loc[i - 1], height - seaweed.height / 2, obstacle_radius + 10, seaweed));
      imageMode(CORNER)
    }
  }






  for (let boid of flock) {

    maxSpeedSlider.input(updateMaxSpeed);
    boid.maxSpeed = maxSpeed;

    coneviewChkbox.changed(checkedEvent);
    boid.coneViewFlag = coneViewFlag

    boid.foodFlag = foodChkBox.checked();

    boid.coneView = coneView;
    boid.show(fish);
    boid.update();
    boid.edges();
    boid.flock(flock);

    if (obstacleChkBox.checked() )

      for (i = 0; i < obstaclelist.length; i++)
        boid.check(obstaclelist[i]);

  }
  if (obstacleChkBox.checked() ) {
    obstaclelist[0].show();
    obstaclelist[0].setPosition(mouseX, mouseY);
  }

  coneviewSlider.input(() => coneView = radians(coneviewSlider.value()));
  image(menu, 10, 10);

}