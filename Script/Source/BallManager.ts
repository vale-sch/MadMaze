import f = FudgeCore;
namespace MadMaze {


    export let locationBooleans: LocationBool[] = new Array<LocationBool>();
    export let spawnPoint: f.Vector3 = f.Vector3.ZERO();
    export class BallManager {

        private rgdbdyBall: f.ComponentRigidbody;
        public alignment: HTMLElement;

        constructor(_rgdBdy: f.ComponentRigidbody) {
            this.rgdbdyBall = _rgdBdy;
            //this.rgdbdyBall.mass = 5;
            this.alignment = document.getElementById("alignment");
            this.alignment.style.fontSize = "48px";
            this.alignment.style.fontWeight = "bold";
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
            f.Loop.start();
        }
        private update = (_event: Event): void => {
            if (this.rgdbdyBall.getPosition().y < -1) {
                this.rgdbdyBall.setPosition(spawnPoint);
                this.rgdbdyBall.setVelocity(f.Vector3.ZERO());

                madeMazeGraph.getChildren().forEach(child => {
                    child.getChildren().forEach(childOfChild => {
                        childOfChild.getChildren().forEach(childOfChildofChild => {
                            if (!childOfChildofChild.isActive) {
                                childOfChildofChild.activate(true);
                                if (childOfChildofChild.getComponent(f.ComponentRigidbody))
                                    childOfChildofChild.getComponent(f.ComponentRigidbody).activate(true);
                            }
                        });
                    });
                });
            }
        }




        private gamma: number = 0;
        private beta: number = 0;
        private speed: number = 0.5;
        public applyForceAlongDirection = (event: DeviceOrientationEvent): void => {
            this.gamma = event.gamma * this.speed;
            this.beta = event.beta * this.speed;
            locationBooleans.forEach(location => {
                switch (location.name) {
                    case ("normal"):
                        if (location.isActive)
                            this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma, -5, -this.beta));
                        break;

                    case ("rightSide"):
                        if (location.isActive) {
                            if (Math.abs(event.beta) > 100) {
                                this.rgdbdyBall.applyForce(new f.Vector3(this.gamma / 4, 750 / Math.abs(this.gamma), -this.beta / 15));
                                return;
                            }
                            this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma / 4, this.gamma / 10, -this.beta));
                        }
                        break;

                    case ("leftSide"):
                        if (location.isActive) {
                            if (Math.abs(event.beta) > 100) {
                                this.rgdbdyBall.applyForce(new f.Vector3(this.gamma / 4, 750 / Math.abs(this.gamma), -this.beta / 15));
                                return;
                            }
                            this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma / 4, -this.gamma / 10, -this.beta));
                        }
                        break;

                    case ("setUpReversed"):
                        if (location.isActive) {
                            if (event.beta > -90)
                                this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma, -this.beta / 2, -this.beta));
                            else
                                this.rgdbdyBall.applyForce(new f.Vector3(this.gamma, -this.beta / 2, -this.beta));
                        }
                        break;

                    case ("setUpNormal"):
                        if (location.isActive) {
                            if (event.beta < 90)
                                this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma / 2, this.beta / 6, -this.beta));
                            else
                                this.rgdbdyBall.applyForce(new f.Vector3(this.gamma / 2, this.beta / 6, -this.beta));
                        }
                        break;

                    case ("overHead"):
                        if (location.isActive)
                            this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma, this.beta / 5, this.beta));
                        break;

                    case ("overHeadReversed"):
                        if (location.isActive)
                            this.rgdbdyBall.applyForce(new f.Vector3(-this.gamma, -this.beta / 5, -this.beta));
                        break;

                }
            });
        }
    }
}
