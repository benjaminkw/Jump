class Enemy {
    constructor(type) {
        this.type = type;
        this.yvel = 0;
        objLayer.objects.push(this);

        if (this.type == 1) {
            this.color = ("rgba(200, 101, 20, 0.8)");
            this.diam = round((height / 8) * 1.1); //player diam * 1.1
            this.ypos = height * 0.75 - this.diam / 2 +3;
            this.xvel = random(width / 330, width / 270) * fastMultiplier; //random difference in movement speed
            this.pointValue = 100;
        }

        if (this.type == 2) {
            this.color = ("rgba(32, 152, 79, 0.8)");
            this.diam = round((height / 8) * 1.2);      //diameter based on screen height // player diam *1.2
            this.ypos = height * 0.75 - this.diam / 2 +3;
            this.xvel = random(width / 250, width / 200) * fastMultiplier; //speed random based on screen width
            this.pointValue = 150;
        }

        if (this.type == 3) {
            this.color = ("rgba(140,70,60,0.8)")
            this.rectSize = [height / 5, height / 15];
            this.ypos = height * 0.52;
            this.xvel = random(width / 330, width / 250) * fastMultiplier;
            this.pointValue = 200;
        }

        if (this.type == 4){
            this.color = ("rgba(240,10,10,0.8)");
            this.diam = round(height / 8 *1.1);
            this.ypos = height * 0.42 - this.diam / 2;
            this.xvel = random (width / 330, width / 250) * fastMultiplier;
            this.pointValue = 250;
        }


        this.dir = random ([-1,1]);
        if (this.dir == -1) {
            this.xpos = width + 100; //direction dictates start side
        }
        if (this.dir == 1) {
            this.xpos = 0 - 100;
        }

    }

    Draw() {
        fill(this.color);
        stroke(70);
        if (this.type == 1 || this.type == 2 || this.type == 4) {
            circle(this.xpos, this.ypos, this.diam);
        }
        else if (this.type == 3) {
            rectMode(CENTER);
            rect(this.xpos, this.ypos, this.rectSize[0], this.rectSize[1], 20);
        }
    }

    update() {
        this.xpos += this.dir * this.xvel;
        this.ypos += this.yvel;
    }

    dead() {
        this.yvel = 20;

    }


}




class Background {
    constructor() {
        this.color = ("rgba(20, 20, 140, 0.5)");
        this.xpos = 0;
        this.ypos = windowHeight * 0.75;
        this.width = windowWidth;
        this.hight = windowHeight / 4

        backLayer.objects.push(this);
    }

    Draw() {
        
        noStroke();
        textSize(60);
        fill(150);
        text(player.playerPoints, 100, 100);
        //text(timerVal, width - 100,100);
        rectMode(CORNER);
        fill(this.color);
        rect(this.xpos, this.ypos, this.width, this.hight);
        fill(30);
        rect(this.xpos, this.ypos, this.width, 5);

    }
}


class StartScreen {
    constructor(){
        screenLayer.objects.push(this);
    }
    
    update() {
        if (gameStart == false) {
            //if mouse is within start button, start game
            if (mouseIsPressed) {
                if (mouseX >= width / 2 - 50 && mouseX <= width / 2 + 50 && mouseY >= height / 2 - 25 && mouseY <= height / 2 + 25) {
                    gameStart = true;
                    fastMultiplier = 1;
                    fastMode = false;
                    spawnRate = 30;
                    noCursor();
                }
                else if (mouseX >= width / 2 - 50 && mouseX <= width / 2 + 50 && mouseY >= height / 2 - 25 +100 && mouseY <= height / 2 + 25 + 100) {
                    gameStart = true;
                    fastMultiplier = 2;
                    fastMode = true;
                    spawnRate = 20;
                    noCursor();
                }
            }
        }
    }


    Draw(){

        if (gameStart == false) {
            cursor();
            noStroke();
            textAlign(CENTER);
            textSize(150);
            fill(150);
            text("Jump!", width / 2, height / 2 - 200);

            rectMode(CENTER);                       //create start button
            rect(width / 2, height / 2, 100, 50, 10)
            fill(40);
            textStyle(BOLD);
            textAlign(CENTER, CENTER);
            textSize(20);
            text("START!", width / 2, height / 2);
            textStyle(NORMAL);
            fill(150);
            text("Use arrow keys, jump on enemies", width / 2, height / 2 + 200);

            rectMode(CENTER);                       //create fast mode button
            rect(width / 2, height / 2 + 100, 100, 50, 10)
            fill(40);
            textStyle(BOLD);
            textAlign(CENTER, CENTER);
            textSize(20);
            text("Fast Mode!", width / 2, height / 2 +100);
        }
    }
       
}


class EndScreen {
    constructor(){
        screenLayer.objects.push(this);
    }

    contn() {               //continue from endscreen
        if (keyIsPressed || mouseIsPressed) {
            gameEnd = false;
            gameStart = false;
            player.playerPoints = 0; //reset player points when game ends
        }
    }


    update() {
        
        if (gameEnd) {
            cursor();
            setTimeout(() => { this.contn(); }, 800);  //call contn function after 800 ms
            currentTimeInTenths = 0; //reset timer when game ends
        }
    }

    Draw(){
        if (gameEnd) {
            noStroke();
            textAlign(CENTER);
            textSize(width / 10);
            fill(150);
            text("GAME OVER!", width / 2, height / 2 -200);
            textSize(width / 15);
            text("Your Score: " + player.playerPoints, width / 2, height / 2);
            textSize(width / 50);
            text("Press any key to continue", width / 2, height / 2 + 200);
           
        }
    }
}







class PointText {
    constructor(streak, value) {
        this.streak = streak;
        this.value = value;
        this.loc = [player.xpos, player.ypos];
        this.xpos = this.loc[0] -40;
        this.ypos = this.loc[1] - 150;
        this.creationTime = currentTimeInTenths;
        this.color = 150;
        this.xdir = random(-4, 4);

        objLayer.objects.push(this);
    }

    update(){
        this.xpos += this.xdir;
        this.ypos += -5;
        this.color += 2;
        if (this.color >= 230) {
            this.color = 230;
        }
       // this.alphaval += 0.05;


    }

    Draw() {
        noStroke();
        textSize(50);
        fill(this.color);
        text(this.streak + "X" + this.value, this.xpos, this.ypos)

    }

}