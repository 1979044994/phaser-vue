import Phaser from 'phaser';
import { IMG_BASE_URL } from './config';
import { ChessType, GameConfig } from './types';
import { GameUI } from './ui';

export class PhaserChessGame {
  private scene: Phaser.Scene;
  private board: (Phaser.GameObjects.Sprite | null)[][];
  private piece!: Phaser.GameObjects.Sprite;
  private currentPos: { x: number; y: number };
  private cellSize: { width: number; height: number };
  private pathHistory: Array<{ x: number; y: number }> = [];
  private background!: Phaser.GameObjects.Image;
  private isMoving = false;
  private boardOffsetY = 300; // 增加垂直偏移量（根据实际效果调整）
  private currentProgress: number = 0;
  private totalProgress: number = 10;
  private ui!: GameUI;

  /**
   * 游戏类的构造函数
   *
   * @param scene - Phaser 场景对象
   * @param config - 游戏配置对象
   *
   * 初始化游戏类的实例，包括设置游戏区域、UI、背景和棋盘。
   *
   * @remarks
   * - `playArea` 设置游戏区域的 y 坐标和高度。
   * - `ui` 初始化游戏的 UI 并设置其深度。
   * - `scene` 保存传入的场景对象。
   * - `currentPos` 设置当前棋盘位置。
   * - `cellSize` 设置棋盘单元格的大小。
   * - `setBackground` 设置游戏背景。
   * - `scene.scale.on('resize')` 监听窗口大小变化事件并调整背景大小。
   * - `board` 初始化棋盘。
   */
  constructor(scene: Phaser.Scene, config: GameConfig) {
    // 移除 playArea 定义
    this.setupBoardPosition(scene.scale.height); // 新增初始化方法
    this.ui = new GameUI(scene);
    this.ui.uiContainer.setDepth(1000);

    this.scene = scene;
    this.currentPos = { x: 0, y: config.boardSize - 1 };
    this.cellSize = { width: 69, height: 75 };
    this.setBackground();
    scene.scale.on('resize', (gameSize: any) => {
      this.background.setDisplaySize(gameSize.width, gameSize.height);
    });

    this.board = this.initBoard(config);
  }

  private initBoard(config: GameConfig): (Phaser.GameObjects.Sprite | null)[][] {
    const { boardSize, specialCells } = config;
    const board: (Phaser.GameObjects.Sprite | null)[][] = Array.from({ length: boardSize }, () =>
      Array(boardSize).fill(null)
    );

    specialCells.forEach(cell => {
      this.scene.load.image(cell.imgName, `${IMG_BASE_URL}${cell.imgName}`);
    });

    for (let x = 0; x < boardSize; x++) {
      for (let y = 0; y < boardSize; y++) {
        if (this.isCellValid(x, y, boardSize)) {
          const pos = this.gridToPosition(x, y);
          const cell = this.scene.add.sprite(pos.x, pos.y, 'cell-normal');
          cell.setDisplaySize(this.cellSize.width, this.cellSize.height);
          board[x][y] = cell;
        }
      }
    }

    specialCells.forEach(({ position: [x, y], imgName, type }) => {
      if (this.isCellValid(x, y, boardSize)) {
        const pos = this.gridToPosition(x, y);
        const cell = this.scene.add.sprite(pos.x, pos.y, imgName);
        cell.setDisplaySize(this.cellSize.width, this.cellSize.height);
        cell.setData('type', type);
        board[x][y] = cell;
      }
    });

    return board;
  }

  // 新增初始化方法
  private setupBoardPosition(screenHeight: number) {
    const sloganHeight = 200; // 与slogan实际高度一致
    this.boardOffsetY = sloganHeight + 100; // slogan下方留出100px空间
  }


  private isCellValid(x: number, y: number, boardSize: number): boolean {
    const outerRing = x === 0 || y === 0 || x === boardSize - 1 || y === boardSize - 1;
    const innerRing = x >= 5 && x <= 13 && (y === 5 || y === 13) || y >= 5 && y <= 13 && (x === 5 || x === 13);
    const connectingPath = (x === 9 && (y <= 5 || y >= 13)) || (y === 9 && (x <= 5 || x >= 13));

    return outerRing || innerRing || connectingPath;
  }

  private setBackground(): void {
    this.scene.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(-999)
      .setDisplaySize(this.scene.scale.width, this.scene.scale.height);
  }

  public createPiece(userAvatarUrl: string | null): void {
    const startPos = this.gridToPosition(this.currentPos.x, this.currentPos.y);
    const offsetY = this.cellSize.height * 0.2; // 使棋子位置靠上
    this.piece = this.scene.add.sprite(startPos.x, startPos.y - offsetY, 'piece');
    this.piece.setDisplaySize(this.cellSize.width * 0.8, this.cellSize.height * 0.8);

    if (userAvatarUrl) {
      // 计算头像的位置，使其位于棋子上方中间
      const avatarX = startPos.x;
      const avatarY = startPos.y - offsetY - this.cellSize.height * 0.4; // 调整头像的垂直位置
      const avatarSize = Math.min(this.cellSize.width * 0.4, this.cellSize.height * 0.4); // 头像的大小

      const avatar = this.scene.add.image(avatarX, avatarY, 'userAvatar');
      avatar.setDisplaySize(avatarSize, avatarSize);
      avatar.setDepth(this.piece.depth + 1); // 确保头像显示在棋子上方
    }

    this.setupCamera();
  }

  /**
   * 设置场景的主摄像机。
   *
   * - 将摄像机中心对准当前棋子位置。
   * - 设置摄像机缩放级别为1.2。
   * - 使摄像机平滑跟随棋子。
   * - 设置摄像机跟随的偏移量。
   *
   * @private
   * @method setupCamera
   */
  private setupCamera(): void {
    const camera = this.scene.cameras.main;
    const startPos = this.gridToPosition(this.currentPos.x, this.currentPos.y);
    camera.centerOn(startPos.x, startPos.y);
    camera.setZoom(1.2);
    camera.startFollow(this.piece, true, 0.1, 0.1);
    camera.setFollowOffset(-10, 10);
    // 调整相机边界（关键）
    // camera.setBounds(
    //   0,
    //   this.boardOffsetY - 50, // 上边界留出过渡空间
    //   this.board.length * this.cellSize.width,
    //   this.scene.scale.height - this.boardOffsetY + 100 // 动态计算高度
    // );
    // // 创建顶部遮罩
    // const mask = this.scene.make.graphics()
    //   .fillRect(0, 0, this.scene.scale.width, this.playArea.y)
    //   .createGeometryMask();

    // this.scene.cameras.main.setMask(mask);
  }


  public async movePiece(steps: number): Promise<void> {
    if (this.isMoving) return;
    this.isMoving = true;

    try {
      const direction = steps > 0 ? 1 : -1;
      const absoluteSteps = Math.abs(steps);
      const path = this.calculateRealPath(direction, absoluteSteps);
      await this.animateMovement(path);
      this.handleSpecialEffect();
    } finally {
      this.isMoving = false;
    }
  }

  private debugPath(path: { x: number, y: number }[], direction: number) {
    console.groupCollapsed(`Path Debug (${direction > 0 ? '+' : '-'}${path.length} steps)`);
    console.log('Start:', this.currentPos);
    path.forEach((p, i) => console.log(`Step ${i + 1}:`, p));
    console.groupEnd();
  }

  private calculateRealPath(direction: number, steps: number): { x: number; y: number }[] {
    const path: { x: number; y: number }[] = [];
    let current = { ...this.currentPos };

    for (let i = 0; i < steps; i++) {
      const next = direction === 1 ?
        this.getNextClockwisePosition(current, i === 0) :
        this.getPreviousClockwisePosition(current, i === 0);

      if (!this.isValidPosition(next)) {
        console.warn(`Invalid step at ${i + 1}/${steps}:`, next);
        break;
      }

      direction === 1 ? path.push(next) : path.unshift(next);
      current = next;
    }

    if (direction === -1) {
      path.reverse();
    }

    if (path.length > 0) {
      this.currentPos = path[path.length - 1];
    }

    this.debugPath(path, direction);
    return path;
  }

  private getNextClockwisePosition(current: { x: number; y: number }, isArrival: boolean): { x: number; y: number } {
    const size = this.board.length;
    const mid = Math.floor(size / 2);
    const innerStart = 5;
    const innerEnd = 13;

    const currentCell = this.board[current.x][current.y];
    const cellType = currentCell?.getData('type');

    if (isArrival && cellType === 1) {
      if (current.x === 9 && current.y === 5) return { x: 9, y: 4 };
      if (current.x === 9 && current.y === 13) return { x: 9, y: 14 };
      if (current.y === 9 && current.x === 0) return { x: 1, y: 9 };
      if (current.y === 9 && current.x === 18) return { x: 17, y: 9 };
    }

    if (current.x === 0 && current.y > 0) return { x: 0, y: current.y - 1 };
    if (current.y === 0 && current.x < size - 1) return { x: current.x + 1, y: 0 };
    if (current.x === size - 1 && current.y < size - 1) return { x: size - 1, y: current.y + 1 };
    if (current.y === size - 1 && current.x > 0) return { x: current.x - 1, y: size - 1 };

    if (current.x === 5 && current.y > 5) return { x: 5, y: current.y - 1 };
    if (current.y === 13 && current.x > 5) return { x: current.x - 1, y: 13 };
    if (current.x === 13 && current.y < 13) return { x: 13, y: current.y + 1 };
    if (current.y === 5 && current.x < 13) return { x: current.x + 1, y: 5 };

    if (current.x === mid) {
      if (current.y < 5) return { x: mid, y: current.y - 1 };
      if (current.y > 13) return { x: mid, y: current.y + 1 };
    }
    if (current.y === mid) {
      if (current.x < 5) return { x: current.x + 1, y: mid };
      if (current.x > 13) return { x: current.x - 1, y: mid };
    }

    return current;
  }

  private getPreviousClockwisePosition(current: { x: number; y: number }, isArrival: boolean): { x: number; y: number } {
    const size = this.board.length;
    const mid = Math.floor(size / 2);
    const innerStart = 5;
    const innerEnd = 13;

    const currentCell = this.board[current.x][current.y];
    const cellType = currentCell?.getData('type');

    if (isArrival && cellType === 1) {
      if (current.x === mid && current.y === 6) return { x: mid, y: 5 };
      if (current.x === mid && current.y === 12) return { x: mid, y: 13 };
      if (current.y === mid && current.x === 6) return { x: 5, y: mid };
      if (current.y === mid && current.x === 12) return { x: 13, y: mid };
    }

    if (current.x === 0 && current.y < size - 1) return { x: 0, y: current.y + 1 };
    if (current.y === size - 1 && current.x < size - 1) return { x: current.x + 1, y: size - 1 };
    if (current.x === size - 1 && current.y > 0) return { x: size - 1, y: current.y - 1 };
    if (current.y === 0 && current.x > 0) return { x: current.x - 1, y: 0 };

    if (current.x === innerStart && current.y < innerEnd) return { x: innerStart, y: current.y + 1 };
    if (current.y === innerStart && current.x > innerStart) return { x: current.x - 1, y: innerStart };
    if (current.x === innerEnd && current.y > innerStart) return { x: innerEnd, y: current.y - 1 };
    if (current.y === innerEnd && current.x < innerEnd) return { x: current.x + 1, y: innerEnd };

    if (current.x === mid) {
      if (current.y < innerStart) return { x: mid, y: current.y + 1 };
      if (current.y > innerEnd) return { x: mid, y: current.y - 1 };
    }
    if (current.y === mid) {
      if (current.x < innerStart) return { x: current.x - 1, y: mid };
      if (current.x > innerEnd) return { x: current.x + 1, y: mid };
    }

    return current;
  }

  private isValidPosition(pos: { x: number, y: number }): boolean {
    const boardSize = this.board.length;

    const isVerticalPath = pos.x === 9 && (pos.y <= 5 || pos.y >= 13);
    const isHorizontalPath = pos.y === 9 && (pos.x <= 5 || pos.x >= 13);

    const isBridgePosition =
      (pos.x >= 4 && pos.x <= 14 && pos.y === 5) ||
      (pos.x >= 4 && pos.x <= 14 && pos.y === 13) ||
      (pos.y >= 4 && pos.y <= 14 && pos.x === 5) ||
      (pos.y >= 4 && pos.y <= 14 && pos.x === 13);

    return (
      pos.x >= 0 && pos.x < boardSize &&
      pos.y >= 0 && pos.y < boardSize &&
      (this.isCellValid(pos.x, pos.y, boardSize) ||
        isVerticalPath ||
        isHorizontalPath ||
        isBridgePosition)
    );
  }

  private async animateMovement(path: { x: number; y: number }[]) {
    return new Promise<void>(resolve => {
      this.scene.tweens.killTweensOf(this.piece);
      const offsetY = this.cellSize.height * 0.2; // 偏移量，和 createPiece 中保持一致

      const targets = path.map(pos => {
        const posObj = this.gridToPosition(pos.x, pos.y);
        return {
          x: posObj.x,
          y: posObj.y - offsetY
        };
      });

      this.scene.tweens.chain({
        targets: this.piece,
        tweens: targets.map((target, index) => ({
          ...target,
          duration: 300,
          onStart: () => this.highlightCurrentCell(path[index]),
          onComplete: index === targets.length - 1 ? resolve : undefined
        }))
      }).play();
    });
  }
  private isTurnPoint(pos: { x: number, y: number }): boolean {
    const turnPoints = [[9, 5], [9, 13], [5, 9], [13, 9]];
    return turnPoints.some(([x, y]) => x === pos.x && y === pos.y);
  }

  private highlightCurrentCell(pos: { x: number; y: number }, color = 0x00ff00): void {
    this.board.flat().forEach(cell => cell?.clearTint());
    const currentCell = this.board[pos.x][pos.y];
    currentCell?.setTint(color);
  }

  // private handleSpecialEffect(): void {
  //   const currentCell = this.board[this.currentPos.x][this.currentPos.y];
  //   if (!currentCell) return;

  //   const cellType = currentCell.getData('type');
  //   if (cellType === ChessType.ACHIEVEMENT) {
  //     // +++ 获取棋子的世界坐标 +++
  //     const worldPos = this.gridToPosition(this.currentPos.x, this.currentPos.y);
  //     const screenPos = this.scene.cameras.main.getWorldPoint(worldPos.x, worldPos.y);
  //     console.log(screenPos, 'screenPos');

  //     // +++ 传递屏幕坐标 +++
  //     this.ui.playAchievementFly(screenPos);
  //   }
  // }
  private handleSpecialEffect(): void {
    const currentCell = this.board[this.currentPos.x][this.currentPos.y];
    if (!currentCell) return;

    const cellType = currentCell.getData('type');
    if (cellType === ChessType.ACHIEVEMENT) {
      this.currentProgress += 1;
      if (this.currentProgress > this.totalProgress) {
        this.currentProgress = this.totalProgress;
      }

      // 获取棋子的世界坐标
      const worldPos = this.gridToPosition(this.currentPos.x, this.currentPos.y);
      // 将世界坐标转换为屏幕坐标
      const screenPos = new Phaser.Math.Vector2();
      screenPos.x = worldPos.x - this.scene.cameras.main.worldView.x;
      screenPos.y = worldPos.y - this.scene.cameras.main.worldView.y;
      console.log(screenPos, 'screenPos');

      this.ui.playAchievementFly(screenPos);
    }
  }

  // 修改棋盘坐标转换
  /**
   * 将网格坐标转换为实际位置坐标。
   *
   * @param x - 网格的X坐标。
   * @param y - 网格的Y坐标。
   * @returns 返回一个包含实际位置坐标的Phaser.Math.Vector2对象。
   */
  private gridToPosition(x: number, y: number): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(
      x * this.cellSize.width + this.cellSize.width / 2,
      this.boardOffsetY + y * this.cellSize.height // 移除多余偏移
    );
  }

  // game.ts 添加渐变遮罩
  private createGradientMask() {
    const gradient = this.scene.textures.createCanvas('mask', 256, 256);
    if (!gradient) {
      throw new Error('Failed to create gradient texture');
    }
    const ctx = gradient.getContext();

    // 创建垂直渐变
    const grd = ctx.createLinearGradient(0, 0, 0, 256);
    grd.addColorStop(0, 'rgba(0,0,0,0)');
    grd.addColorStop(0.2, 'rgba(0,0,0,1)');

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 256, 256);
    gradient.refresh();

    // 应用渐变遮罩
    const mask = this.scene.make.sprite({
      key: 'mask',
      x: 0,
      y: this.boardOffsetY - 50,
      scale: { x: this.scene.scale.width / 256, y: 1 }
    }, true).createGeometryMask();

    this.scene.cameras.main.setMask(mask);
  }


}
