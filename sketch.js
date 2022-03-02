var trex, trex_running, perder, edges;
var groundImage, ground, chao;
var nuvem, nuvemImg;
var cacto, cactoImg1, cactoImg2, cactoImg3, cactoImg4, cactoImg5, cactoImg6;
var estado = "jogando" ;
var grupoNuvens, grupoCactos;
var pontos = 0;
var over, overIMG, restart, restartIMG;
var sompulo, sommorte, sommark;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png")
  nuvemImg = loadImage("cloud.png")
  
  cactoImg1 = loadImage("obstacle1.png")
  cactoImg2 = loadImage("obstacle2.png")
  cactoImg3 = loadImage("obstacle3.png")
  cactoImg4 = loadImage("obstacle4.png")
  cactoImg5 = loadImage("obstacle5.png")
  cactoImg6 = loadImage("obstacle6.png")
  
  perder = loadImage("trex_collided.png")
  overIMG = loadImage("gameOver.png")
  restartIMG = loadImage("restart.png")
  
  sompulo = loadSound("jump.mp3")
  sommorte = loadSound("die.mp3")
  sommark = loadSound("checkpoint.mp3")
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  //criando o trex
  trex = createSprite(50,height-110,20,50);
  trex.addAnimation("running", trex_running);
  trex.addImage("perder", perder)
  edges = createEdgeSprites();
  
  //adicione dimensão e posição ao trex
  trex.scale = 0.5;
  trex.x = 50

  chao = createSprite(width/2, height-10, width, 10)
  chao.visible = false
  
  ground = createSprite(width/2, height-20, width, 20);
  ground.addImage("chao", groundImage)

  grupoNuvens = new Group();
  grupoCactos = new Group();

  trex.debug = true
  trex.setCollider("circle", 0, 0, 40)
  //trex.setCollider("rectangle", 60, 0, 100, 250, 90)

  over = createSprite(width/2, height/2);
  over.addImage("fim", overIMG)
  over.scale = 0.7
  over.depth = over.depth + 3

  restart = createSprite(width/2, height/2 + 30)
  restart.addImage("restart", restartIMG)
  restart. scale = 0.4
  restart.depth = restart.depth + 3

  //over.visible = false
  //restart.visible = false
}


function draw(){
  console.log(trex.y);
  
  //definir a cor do plano de fundo 
  background("white");
  
 //impedir que o trex caia
  trex.collide(chao)

 

  drawSprites();

  text("pontos: " + pontos, width-100, 30)


  if (estado === "jogando") {
      nuvens()
    obstaculos()
      
    ground.velocityX = -(3.5  + pontos / 100)
      if(ground.x <  0){
       ground.x = ground.width/2
      }
     //pular quando tecla de espaço for pressionada
      if(touches.lenght>0 || keyDown("space") && trex.y > height - 50){
        trex.velocityY = -10;
        sompulo.play();
        touches = []
       }
  
        trex.velocityY = trex.velocityY + 0.5;


       if (trex.isTouching(grupoCactos)) {
         estado = "fim"
         sommorte.play();
       }

       pontos = pontos + Math.round(getframeRate() / 120);
       if(pontos > 0 && pontos % 1000 === 0) {
        sommark.play();
       }

       restart.visible = false
       over.visible = false

  } else if(estado === "fim") {
   
    ground.velocityX = 0
    grupoNuvens.setVelocityXEach (0)
    grupoCactos.setVelocityXEach (0)
    trex.velocityY = 0
    trex.changeAnimation("perder", perder)
    grupoNuvens.setLifetimeEach(-1)
    grupoCactos.setLifetimeEach(-1)

    restart.visible = true
    over.visible = true
    
    if (touches.lenght>0 || mousePressedOver(restart)){
      reset();
      touches = []
    }

  }
}



function nuvens() {
  if (frameCount % 40 === 0) {
    nuvem = createSprite(width + 30, 50)
    nuvem.addImage("nuvem", nuvemImg)
    nuvem.velocityX = -4
    nuvem.y = Math.round(random(20,70))
    nuvem.scale = Math.random(0.6,0.8)
    nuvem.depth = trex.depth
    trex.depth = trex.depth + 1
    nuvem.lifetime = 500

    grupoNuvens.add(nuvem)
  }
}

function obstaculos(){
  if (frameCount % 70 === 0) {
    cacto = createSprite(width + 30, height - 35)
    cacto.velocityX = -(4 + pontos / 100)
    cactoSwitch = Math.round(random(1,6))
    cacto.scale = 0.5

    switch(cactoSwitch) {
      case 1: cacto.addImage(cactoImg1);
      break;

      case 2: cacto.addImage(cactoImg2);
      break;

      case 3: cacto.addImage(cactoImg3);
      break;

      case 4: cacto.addImage(cactoImg4);
      break;

      case 5: cacto.addImage(cactoImg5);
      break;

      case 6: cacto.addImage(cactoImg6);
      break;
      
      default: break;
    }
    cacto.lifetime = 500
    grupoCactos.add(cacto)
  }
}

function reset(){
  estado = "jogando"
  over.visible = false
  restart.visible = false
  grupoCactos.destroyEach();
  grupoNuvens.destroyEach();
  pontos = 0
  trex.changeAnimation("running", trex_running);
};