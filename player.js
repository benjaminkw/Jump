class Player {
    constructor(layer, state) {
        this.color = color(200,50,120);
        this.xpos = width / 2; 
        this.diam = height / 9;
        this.ypos = height - this.diam ;

        this.xvel = 0;
        this.yvel = 1.5;
        this.jumpState = 0;

        this.playerPoints = 0;

        this.state = state;
        layer.objects.push(this);
    }


    update(){
        this[this.state]();
        this.checkCollision();

        if (gameStart == 0) { 
            this.state = "idle";
          }
          else if (gameStart == 1 && this.state != "Dead") {
            this.state = "move";
          }
    }
    
    Draw(){
        noStroke();
        fill(this.color);
        circle(this.xpos, this.ypos, this.diam); 
        
    }

    move(){
    
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {   //acceleration left/right
            this.xvel += 2 * fastMultiplier*2;
        }
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
            this.xvel += -2 * fastMultiplier*2;
        }

        if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
            this.Jump();
        }


        if (this.jumpState == 1) {                 //downward acceleration when in air
            this.yvel += (this.diam * 0.007);
        }


        this.xpos += this.xvel;
        this.ypos += this.yvel;

        if (this.xvel >= width / 150) {      //x speed max 12
            this.xvel = width / 150;
        }
        if (this.xvel <= -width / 150) {
            this.xvel = -width / 150;
        }

        if (this.ypos >  height * 0.75 -this.diam / 2 +3) {     //y vel stops on ground
            this.yvel = 0;
            this.jumpState = 0;
            this.ypos = height * 0.75 - this.diam / 2 +3;
            this.streak = 0;  
        }
        
        if (this.xpos >= width - (this.diam / 2)) {     //x position can not exceed screen limits
            this.xpos = width -(this.diam / 2);
        }
        if (this.xpos <= 0 + (this.diam / 2)) {
            this.xpos = 0 + (this.diam / 2);
        }


        this.xvel = this.xvel * 0.8;        //x velocity decelleration


    }

    idle(){
        //reset position and speed
        this.xpos = width / 2;
        this.ypos = height - this.diam ;
        this.xvel = 0;

        this.contEnd = true; //reset contEnd to true so game can end again
    }

    Jump(collide) {

        if (this.jumpState == 1 && collide) {
            this.yvel = 0;
            this.yvel += -(this.diam * 0.16);
            if (fastMode){
                this.yvel = this.yvel *  (fastMultiplier*0.6)
            }
        }

        if (this.jumpState == 0) {
            this.yvel += -(this.diam * 0.16);
            if (fastMode){
                this.yvel = this.yvel *  (fastMultiplier*0.6)
            }
            this.jumpState = 1;
        }

    }



    checkCollision (){
        //for every enemy
        for (var i = 0; i <enemiesList.length; i++) {
            if (enemiesList[i].type == 1 || enemiesList[i].type == 2 || enemiesList[i].type == 4) {
                //collision for circular enemies

                this.collisionDist = sqrt(sq(this.xpos - enemiesList[i].xpos) + sq(this.ypos - enemiesList[i].ypos))
                //check collision
    
                if (this.collisionDist <= this.diam / 2 + enemiesList[i].diam / 2) {
                    //this.yvel = 0;
    
                    //check if bottom of player is over of enemy center and function Jump
                    if (this.ypos + (this.diam / 2) <= enemiesList[i].ypos) {
                        enemiesList[i].dead();
                        this.Jump(true);
                        this.streak += 1; 
                        this.playerPoints += enemiesList[i].pointValue * this.streak;
                        pointText(this.streak, enemiesList[i].pointValue);
                    }
                    //if player is not on top return true
                    else {
                        this.state = "Dead";
                    }
                }
            }
                //collision for enemy type 3 rectangle
            else if (enemiesList[i].type == 3)  {
                //dist from center of player to center of enemy
                this.collisionDist = sqrt(sq(this.xpos - enemiesList[i].xpos) + sq(this.ypos - enemiesList[i].ypos)) 

                this.eSizeW = enemiesList[i].rectSize[0]; //grab width and height of enemy rect
                this.eSizeH = enemiesList[i].rectSize[1];

                if (this.collisionDist <= this.diam / 2 + this.eSizeW / 2) { //if within range
                    //if player is under enemy, no collision and continue
                    if (this.ypos - this.diam / 2 >= enemiesList[i].ypos + this.eSizeH / 2) {
                        continue;
                    }
                    //if player is over enemy rect
                    if (this.ypos + this.diam / 2 <= enemiesList[i].ypos) {
                        //if player bottom is colliding with enemy top
                        if(this.ypos + this.diam / 2 >= enemiesList[i].ypos - this.eSizeH / 2) {
                            enemiesList[i].dead();
                            this.Jump(true);
                            this.streak += 1; 
                            this.playerPoints += enemiesList[i].pointValue * this.streak;
                            pointText(this.streak, enemiesList[i].pointValue); 
                        }
                        else {
                            continue;
                        }
                    }
                    
                    else {
                        this.state = "Dead";
                    }
                }
            }
            
        }
    }

    Dead() {
         //contEnd makes sure statement only runs once
        if (this.contEnd) {        
            setTimeout(() => {gameEnd = true;}, 500);
            this.contEnd = false;
        }

        this.ypos += 10; //player falls out of screen
    }

}