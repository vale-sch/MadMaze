declare namespace MadMaze {
}
declare namespace MadMaze {
    import f = FudgeCore;
    class ObstaclesTranslator extends f.ComponentScript {
        static readonly iSubclass: number;
        private isCross;
        private verticalNeg;
        private verticalPos;
        private rndRotVel;
        private rndTransVel;
        constructor();
        hndEvent: (_event: Event) => void;
        private update;
    }
}
