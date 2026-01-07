
class spawner {
    constructor() {
    }

    spawnerUpdate(){
        if (gameEnd || gameStart == false) { //reset spawner when game ends
            this.resetSpawner();
        }
        this.randomEnemyType();

        var twoSecondsSinceStart = currentTimeInTenths == 20;
        var startedAndNotFinished = this.startedSpawningYet == true && this.runTime != currentTimeInTenths
        var isFirstSpawnTime = twoSecondsSinceStart && this.startedSpawningYet != true
        var isTimeToSpawn = currentTimeInTenths == this.timeOfLastSpawn + this.msUntilNextSpawn

        if (startedAndNotFinished || isFirstSpawnTime) {
            this.runTime = currentTimeInTenths;
            this.startedSpawningYet = true;
            if (isTimeToSpawn || twoSecondsSinceStart) {
                enemiesList.push(new Enemy(this.enemyType)); 
                this.updateSpawnTimings();
            }
        }
        this.removeIfDead();
 
    }

    resetSpawner(){
        this.startedSpawningYet = false; 
        this.spawnRate = spawnRate;
        for (enemy of enemiesList) {
            enemy.ypos = height *2; //hides enemies by moving
        }
    }
    randomEnemyType(){
        //-t * log(r)  poisson distribution/process  r = rand 0-1    t = avg time between arrivals, 1 = 0.1 secs
        this.r = random();
        this.spawnRand = random(0, 31);
        if (this.spawnRand >= this.spawnRate) {
            if (this.spawnRand >= this.spawnRate + 13) {
                this.enemyType = 3;
                if (this.spawnRand >= this.spawnRate + 22) {
                    this.enemyType = 4;
                }
            }
            else {
                this.enemyType = 2;
            }
        }
        else {
            this.enemyType = 1;
        }
        if (this.spawnRate <= 5) { // makes sure spawnrate doesnt get too low
            this.spawnRate = 6;
        }
    }
    updateSpawnTimings(){
        this.timeOfLastSpawn = currentTimeInTenths; // set spawntime to current timer value
        this.msUntilNextSpawn = round(this.spawnRate * -1 * log(this.r)) + 1; //calculate time until next spawn
        this.spawnRate = this.spawnRate * 0.97; // spawns faster after some spawns

        if (this.msUntilNextSpawn >= 50) { //Spawn time max 5 seconds
            this.msUntilNextSpawn = 50;
        }
        if (this.spawnRate >= 25) {
            if (this.msUntilNextSpawn <= 10) { //if spawntime is less one second before spawnrate is below 25, it will be 2 seconds
                this.msUntilNextSpawn = 20;
            }

        }
        if (this.spawnRate <= 25) {
            if (this.msUntilNextSpawn >= 30) {
                this.msUntilNextSpawn = 30;
            }
            if (this.spawnRate <= 17) {
                if (this.msUntilNextSpawn >= 20) {
                    this.msUntilNextSpawn = 20;
                }
            }

        }
    }
    removeIfDead(){
        for (var i = 0; i < enemiesList.length; i++) {
            var enemyToTheLeftOfScreen = enemiesList[i].xpos < -200;
            var enemyToTheRightOfScreen =  enemiesList[i].xpos > width + 200;
            var enemyBelowScreen = enemiesList[i].ypos > height + enemiesList[i].diam;
            var enemyIsDead = enemyToTheLeftOfScreen || enemyToTheRightOfScreen || enemyBelowScreen;
            if (enemyIsDead) {
                enemiesList.splice(i, 1);
            }
        }
    }
}

function pointText(streak, value) { //create new point text.
    if (this.textVal != null) {
        delete this.textVal;
    }
    this.textVal = new PointText(streak, value);
}