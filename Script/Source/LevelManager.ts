
namespace MadMaze {
    export enum LevelGraph {
        LEVEL1 = "Level1",
        LEVEL2 = "Level2",
        LEVEL3 = "Level3",
    }
    export class LevelManager {
        public static level: number = 0;
        public static levelGraph: LevelGraph;
        constructor(_level: number, _levelGraph: LevelGraph) {
            LevelManager.level = _level;
            LevelManager.levelGraph = _levelGraph;
        }

    }
}
