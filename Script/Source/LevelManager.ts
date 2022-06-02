
namespace MadMaze {
    import f = FudgeCore;
    export let startPoint: f.Vector3;
    export let levelOverview: HTMLElement;
    levelOverview = document.getElementById("level");
    levelOverview.style.fontSize = "70px";
    levelOverview.style.fontWeight = "bold";
    levelOverview.style.textAlign = "center";
    levelOverview.style.color = "green";
    export enum Levels {
        LEVEL1 = "Graph|2022-05-17T15:48:20.157Z|38212",
        LEVEL2 = "Graph|2022-05-17T15:48:08.487Z|74649",
        LEVEL3 = "Graph|2022-05-17T15:39:18.443Z|44479",
        LEVEL4 = "Graph|2022-05-31T15:35:07.044Z|09570",
        LEVEL5 = "Graph|2022-05-31T15:46:28.921Z|74068",
    }
    export class LevelManager {
        public static level: number = 1;
        public static nextLevelGraph: Levels = Levels.LEVEL1;
        public static previousGraph: f.Graph;
        public static levelOverview: HTMLElement;
        constructor() {
            LevelManager.levelOverview = document.getElementById("level");
            LevelManager.levelOverview.style.fontSize = "70px";
            LevelManager.levelOverview.style.fontWeight = "bold";
            LevelManager.levelOverview.style.textAlign = "center";
            LevelManager.levelOverview.style.color = "green";
        }
        public static loadNextLevel(): void {
            spawnPoint = null;
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
            rgdbdyBall.setVelocity(f.Vector3.ZERO());
            startPoint = levelToLoad.getChildrenByName("startPoint")[0].getComponent(f.ComponentTransform).mtxLocal.translation;
            rgdbdyBall.setPosition(startPoint);
            cameraFlyPoints = new Array<f.ComponentTransform>(levelToLoad.getChildrenByName("cameraFlyPoints")[0].nChildren - 1);
            let increment: number = 0;
            levelToLoad.getChildrenByName("cameraFlyPoints")[0].getChildren().forEach(flyPoint => {
                cameraFlyPoints[increment] = flyPoint.getComponent(f.ComponentTransform);
                increment++;
            });
            madeMazeGraph.appendChild(levelToLoad);
            this.previousGraph = levelToLoad;
            // this.levelOverview.innerHTML = "Level: " + this.level;
        }

        public static initilizeScene(): void {
            let scene: f.Graph = <f.Graph>f.Project.resources[this.nextLevelGraph];
            madeMazeGraph.appendChild(scene);
            this.previousGraph = scene;
            //this.levelOverview.innerHTML = "Level: " + this.level;
            startPoint = scene.getChildrenByName("startPoint")[0].getComponent(f.ComponentTransform).mtxLocal.translation;
            rgdbdyBall.setPosition(startPoint);
            cameraFlyPoints = new Array<f.ComponentTransform>(this.previousGraph.getChildrenByName("cameraFlyPoints")[0].nChildren - 1);
            let increment: number = 0;

            this.previousGraph.getChildrenByName("cameraFlyPoints")[0].getChildren().forEach(flyPoint => {
                cameraFlyPoints[increment] = flyPoint.getComponent(f.ComponentTransform);
                increment++;
            });

            lowestBorder = -55;
        }
        public static checkForNextLevel(): void {
            switch (LevelManager.level) {
                case (1):
                    lowestBorder = -55;
                    this.nextLevelGraph = Levels.LEVEL1;
                    break;
                case (2):
                    lowestBorder = -8;
                    this.nextLevelGraph = Levels.LEVEL2;
                    break;
                case (3):
                    lowestBorder = -1;
                    this.nextLevelGraph = Levels.LEVEL3;
                    break;
                case (4):
                    lowestBorder = -20;
                    this.nextLevelGraph = Levels.LEVEL4;
                    break;
                case (5):
                    lowestBorder = -18;
                    this.nextLevelGraph = Levels.LEVEL5;
                    break;
            }
        }
    }
}
