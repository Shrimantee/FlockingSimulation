
class Boid {
    constructor(x = random(width), y = randomGaussian(height / 2, 20)) {
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 5;

        this.coneView = radians(360);
        this.coneViewFlag = false;
        this.foodFlag = false;
        this.start = 0;
        this.end = 0;
        this.pos = 0;
        this.color = color(random(255), random(255), random(255), 200);
        this.Ga = 10;
        this.angle = 0;


    }

    edges() {
        if (this.position.x > width) {
            this.position.x = 0;
            this.color = color(random(255), random(255), random(255), 200);

        }
        if (this.position.x < 0) {
            this.position.x = width;
            this.color = color(random(255), random(255), random(255), 200);

        }
        if (this.position.y > height) {
            this.position.y = 0;
            this.color = color(random(255), random(255), random(255), 200);

        }
        if (this.position.y < 0) {
            this.position.y = height;
            this.color = color(random(255), random(255), random(255), 200);

        }

    }
    setColor(boids) {
        let closest;
        let perceptionRadius = 100;

        for (let current of boids) {
            let d = dist(this.position.x, this.position.y, current.position.x, current.position.y);
            if (d < perceptionRadius) {
                closest = current;
                let r = red(closest.color);
                let g = green(closest.color);
                let b = blue(closest.color);
                let c = color(r, g, b, 200);
                return c;
            }
        }
    }
    align(boids) {
        let perceptionRadius = 75;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = this.position.dist(other.position);
            if (this.coneViewFlag) {
                if (other != this && d < perceptionRadius && this.start < other.pos && other.pos < this.end) {
                    steering.add(other.velocity);
                    total++;
                }
            } else {
                if (other != this && d < perceptionRadius) {
                    steering.add(other.velocity);
                    total++;
                }
            }

        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    separation(boids) {
        let perceptionRadius = 50;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = this.position.dist(other.position);
            if (this.coneViewFlag) {
                if (other != this && d < perceptionRadius && this.start < other.pos && other.pos < this.end) {
                    let diff = p5.Vector.sub(this.position, other.position);
                    diff.div(d * d);
                    steering.add(diff);
                    total++;
                }
            }
            else {
                if (other != this && d < perceptionRadius) {
                    let diff = p5.Vector.sub(this.position, other.position);
                    diff.div(d * d);
                    steering.add(diff);
                    total++;
                }
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
            steering.mult(1.1);

        }
        return steering;
    }

    cohesion(boids) {
        let perceptionRadius = 100;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = this.position.dist(other.position);
            if (this.coneViewFlag) {
                if (other != this && d < perceptionRadius && this.start < other.pos && other.pos < this.end) {
                    steering.add(other.position);
                    total++;
                }
            }
            else {
                if (other != this && d < perceptionRadius) {
                    steering.add(other.position);
                    total++;
                }
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }


    flock(boids) {

        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);
        let c = this.setColor(boids);

        if (!this.coneViewFlag) {
            alignment.mult(alignSlider.value());
            cohesion.mult(cohesionSlider.value());
            separation.mult(separationSlider.value());
        }

        let mv = createVector(random(0, 10), randomGaussian(height / 2, 20))
        if (mouseIsPressed) {
            if (this.foodFlag) {
                mv = createVector(mouseX, mouseY);
                alignment.mult(2);
                cohesion.mult(2);
                separation.mult(3);
                const f = p5.Vector.sub(mv, this.position);
                var dsq = f.magSq();
                dsq = constrain(dsq, 1, 3)
                f.normalize();
                var strength = 1 / dsq;
                f.setMag(strength)
                this.acceleration.add(f);
            }
        }
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);

        if (c) {
            this.color = c;
        }



    }

    update() {

        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);

        print(this.coneView)
        if (this.coneViewFlag) {
            this.start = (this.velocity.heading() - this.coneView / 2) + - HALF_PI / 2;
            this.end = (this.velocity.heading() + this.coneView / 2) + HALF_PI / 2;
            this.pos = this.position.heading();
        }



    }
    onScreen(v) {
        return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
    }
    show(img) {
        push();

        translate(this.position.x, this.position.y);

        rotate(this.velocity.heading() + HALF_PI);

        imageMode(CENTER);

        var s = 0;
        if (degrees(this.velocity.heading()) > -90 && degrees(this.velocity.heading() < 90))
            s = -1
        else
            s = 1;
        scale(s, 1)
        image(img, 0, 0, img.width / 20, img.height / 20)

        if (s < 0) scale(-s, 1)


        pop();
    }
    check(o) {


        let steering = createVector();

        let target = createVector(o.x, o.y);

        let d = this.position.dist(target)
        if (d < o.r) {

            let diff = p5.Vector.sub(this.position, target);
            diff.div(d * d);
            steering = diff;
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
            steering.mult(1.2);
            this.acceleration.add(steering)


        }



    }

}

