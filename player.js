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

        //this.circularCollisionStrategy = new CircularCollisionStrategy();
        //rectangularCollisionStrategy = new RectangularCollisionStrategy();
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

    checkCollision(){
        this.radius = this.diam / 2
        for (const enemy of enemiesList) {
            var collidedWithCurrentEnemyAndDied = false

            this.distanceFromCenter = sqrt(sq(this.xpos - enemy.xpos) + sq(this.ypos - enemy.ypos))
            this.isAboveEnemy = this.ypos + this.radius <= enemy.ypos
            
            if (enemy.type == 1 || enemy.type == 2 || enemy.type == 4) {
                if(this.checkCircCollision(enemy)){
                    collidedWithCurrentEnemyAndDied = this.circHandleCollision(enemy);
                }
            }
            else if (enemy.type == 3)  {
                if(this.checkRectCollision(enemy)){
                    collidedWithCurrentEnemyAndDied = this.rectHandleCollision(enemy);
                }
            }
            if(collidedWithCurrentEnemyAndDied){
                this.state = "Dead";
            }

        }
    }

    rectHandleCollision(enemy){
        const eSizeH = enemy.rectSize[1];
        const playerUnderEnemy = this.ypos - this.radius >= enemy.ypos + eSizeH / 2;
        if (playerUnderEnemy) {
            return false;
        }
        if (this.isAboveEnemy) {
            const bottomCollidingWithTop = this.ypos + this.radius >= enemy.ypos - eSizeH / 2
            if(bottomCollidingWithTop) {
                this.killEnemyByHeadbutt(enemy);
                return false;
            }
            //didn't die but also didn't kill him 
            return false;
        }
        return true;
        
    }

    circHandleCollision(enemy){
        if (this.isAboveEnemy) {
            this.killEnemyByHeadbutt(enemy);
            return false;
        }
        return true;
    }

    checkRectCollision(enemy){
        const eSizeW = enemy.rectSize[0]; 
        const isColliding = this.distanceFromCenter <= this.radius + eSizeW / 2;
        if (isColliding) {
            return true;
        }
        return false;
    }

    checkCircCollision(enemy){
        const isColliding = this.distanceFromCenter <= this.radius + enemy.diam / 2
        if (isColliding) {
            return true;
        }
        return false;
    }

    killEnemyByHeadbutt(enemy){
        enemy.dead();
        this.Jump(true);
        this.streak += 1; 
        this.playerPoints  += enemy.pointValue * this.streak;
        pointText(this.streak, enemy.pointValue);
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