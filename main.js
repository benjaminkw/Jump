//global vars
var spawnRate = 30;
//layer variables
var backLayer;
var objLayer;
var screenLayer;
//screen variables
var startScreen;
var endScreen;
//enemy array and player variable
var enemiesList = [];
var player;

//gamestate variables
var gameStart = false;
var gameEnd = false;

var fastMode = false;

var fastMultiplier = 3;

//timer variable
var currentTimeInTenths = 0;
//timer runs when game is started
function incrementCounter() {
  if (gameStart && gameEnd != true) {
    currentTimeInTenths++;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight );
  setInterval(incrementCounter, 100);
  objLayer = new ObjectLayer(); 
  backLayer = new BackgroundLayer(); 
  screenLayer = new ScreenLayer(); 
  startScreen = new StartScreen();
  endScreen = new EndScreen();
  player = new Player(objLayer, "move"); //create player object on objLayer

  back = new Background();
  spawnerX = new spawner();
}

function draw() {
  clear();
  update();
  render();
}

function update(){
  spawnerX .spawnerUpdate();
  objLayer.update();
  screenLayer.update();
}

function render(){
  background(230);
  backLayer.Draw();
  objLayer.Draw();
  screenLayer.Draw();
}
