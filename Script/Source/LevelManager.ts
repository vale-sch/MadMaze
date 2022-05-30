
namespace MadMaze {
    import f = FudgeCore;

    export enum Levels {
        LEVEL1 = "Graph|2022-05-17T15:48:08.487Z|74649",
        LEVEL2 = "Graph|2022-05-17T15:39:18.443Z|44479",
        LEVEL3 = "Graph|2022-05-17T15:48:20.157Z|38212",
    }
    export class LevelManager {
        public static level: number = 1;
        public static nextLevelGraph: Levels = Levels.LEVEL1;
        public static previousGraph: f.Graph;
        public static levelOverview: HTMLElement;
        constructor() {
            LevelManager.levelOverview = document.getElementById("level");
            LevelManager.levelOverview.style.fontSize = "50px";
            LevelManager.levelOverview.style.fontWeight = "bold";
            LevelManager.levelOverview.style.textAlign = "center";
            LevelManager.levelOverview.style.color = "green";
        }
        public static loadNextLevel(): void {
            this.previousGraph.getChildren().forEach(child => {
                if (child.getComponent(f.ComponentRigidbody))
                    child.removeComponent(child.getComponent(f.ComponentRigidbody));
                child.getChildren().forEach(childOfChild => {
                    if (childOfChild.getComponent(f.ComponentRigidbody))
                        childOfChild.removeComponent(childOfChild.getComponent(f.ComponentRigidbody));
                    childOfChild.getChildren().forEach(childOfChildofChild => {
                        if (childOfChildofChild.getComponent(f.ComponentRigidbody))
                            childOfChildofChild.removeComponent(childOfChildofChild.getComponent(f.ComponentRigidbody));
                    });
                });
            });
            madeMazeGraph.removeChild(this.previousGraph);
            let levelToLoad: f.Graph = <f.Graph>f.Project.resources[this.nextLevelGraph];
            isCameraFly = true;
            flyIncrement = 0;
            cameraFlyPoints = new Array<f.ComponentTransform>(levelToLoad.getChildrenByName("cameraFlyPoints")[0].nChildren - 1);
            let increment: number = 0;

            levelToLoad.getChildrenByName("cameraFlyPoints")[0].getChildren().forEach(flyPoint => {
                cameraFlyPoints[increment] = flyPoint.getComponent(f.ComponentTransform);
                increment++;
            });
            madeMazeGraph.appendChild(levelToLoad);

            this.previousGraph = levelToLoad;


            rgdbdyBall.setPosition(levelToLoad.getChildrenByName("spawnPoint")[0].mtxLocal.translation);
            rgdbdyBall.setVelocity(f.Vector3.ZERO());
            this.levelOverview.innerHTML = "Level: " + this.level;
        }

        public static initilizeScene(): void {
            let scene: f.Graph = <f.Graph>f.Project.resources[this.nextLevelGraph];
            madeMazeGraph.appendChild(scene);
            this.previousGraph = scene;
            this.levelOverview.innerHTML = "Level: " + this.level;
            cameraFlyPoints = new Array<f.ComponentTransform>(this.previousGraph.getChildrenByName("cameraFlyPoints")[0].nChildren - 1);
            let increment: number = 0;

            this.previousGraph.getChildrenByName("cameraFlyPoints")[0].getChildren().forEach(flyPoint => {
                cameraFlyPoints[increment] = flyPoint.getComponent(f.ComponentTransform);
                increment++;
            });

            lowestBorder = -7;
        }
        public static checkForNextLevel(): void {
            switch (LevelManager.level) {
                case (1):
                    lowestBorder = -7;
                    this.nextLevelGraph = Levels.LEVEL1;
                    break;
                case (2):
                    lowestBorder = -1;
                    isCameraFly = true;
                    this.nextLevelGraph = Levels.LEVEL2;
                    break;
                case (3): this.nextLevelGraph = Levels.LEVEL3;
                    isCameraFly = true;
                    lowestBorder = -1;
                    break;
            }
        }
    }
}
