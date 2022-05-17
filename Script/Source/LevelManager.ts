
namespace MadMaze {
    import f = FudgeCore;

    export enum Levels {
        LEVEL1 = "Graph|2022-05-17T15:39:18.443Z|44479",
        LEVEL2 = "Graph|2022-05-17T15:48:08.487Z|74649",
        LEVEL3 = "Graph|2022-05-17T15:48:20.157Z|38212",
    }
    export class LevelManager {
        public static level: number = 1;
        public static nextLevelGraph: Levels = Levels.LEVEL1;
        public static levelOverview: HTMLElement;
        constructor() {
            LevelManager.levelOverview = document.getElementById("level");
            LevelManager.levelOverview.style.fontSize = "50px";
            LevelManager.levelOverview.style.fontWeight = "bold";
            LevelManager.levelOverview.style.textAlign = "center";
            LevelManager.levelOverview.style.color = "green";
        }
        public static loadNextLevel(): void {
            madeMazeGraph.getChild(madeMazeGraph.nChildren - 1).getChildren().forEach(child => {
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
            madeMazeGraph.removeChild(madeMazeGraph.getChild(madeMazeGraph.nChildren - 1));
            let nextLevel: f.Graph = <f.Graph>f.Project.resources[this.nextLevelGraph];
            madeMazeGraph.appendChild(nextLevel);
            rgdbdyBall.setPosition(nextLevel.getChildrenByName("spawnPoint")[0].mtxLocal.translation);
            rgdbdyBall.setVelocity(f.Vector3.ZERO());
            this.levelOverview.innerHTML = "Level: " + this.level;

        }
        public static initilizeScene(): void {
            let scene: f.Graph = <f.Graph>f.Project.resources[this.nextLevelGraph];
            madeMazeGraph.appendChild(scene);
            this.levelOverview.innerHTML = "Level: " + this.level;
        }
        public static checkForNextLevel(): void {
            switch (LevelManager.level) {
                case (1): this.nextLevelGraph = Levels.LEVEL1;
                    break;
                case (2): this.nextLevelGraph = Levels.LEVEL2;
                    break;
                case (3): this.nextLevelGraph = Levels.LEVEL3;
            }
        }
    }
}
