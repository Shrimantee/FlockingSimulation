class Obstacle {
  constructor(x, y,r,img) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.img = img
  }

  show() {
    fill(255, 255, 255, 0);
    noStroke()
    imageMode(CENTER)
    translate(this.x,this.y);
    image(this.img,0,0)

    circle(0,0, this.r);
    translate(-this.x,-this.y);
    imageMode(CORNER)

  }
  
  setPosition(x, y) {
   this.x = x;
    this.y = y;
  }
}