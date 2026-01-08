function ObjectLayer() {
    this.objects = [];

    this.update = function(){
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].update();
        }
    }

    this.Draw = function(){
        if (gameStart && gameEnd != true) {
            for (var i = 0; i < this.objects.length; i++) {
                this.objects[i].Draw();
            }
        }
    }
}

function BackgroundLayer() {
    this.objects = [];

    this.Draw = function() {
        if (gameStart && gameEnd != true) {
            for (var i = 0; i < this.objects.length; i++) {
                this.objects[i].Draw();
            }
        }
    }

}

function ScreenLayer() {
    this.objects = [];

    this.update = function() {
        for(element of this.objects) {
            element.update();
        }
    }

    this.Draw = function() {
        for(var i=0; i < this.objects.length; i++) {
            this.objects[i].Draw();
        }
    }
}