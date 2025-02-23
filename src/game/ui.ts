export class GameUI {
  public uiContainer: Phaser.GameObjects.Container;
  private progressBar: Phaser.GameObjects.Graphics;
  private progressText: Phaser.GameObjects.Text;
  private slogan!: Phaser.GameObjects.Image;
  private chessPiece!: Phaser.GameObjects.Image;
  private chest!: Phaser.GameObjects.Image;
  private currentProgress = 0;
  private totalProgress = 10;

  constructor(private scene: Phaser.Scene) {
    this.initSlogan();
  }

  private initSlogan() {
    const { width, height } = this.scene.scale;
    this.uiContainer = this.scene.add.container(0, 0)
      .setScrollFactor(0, 0);

    this.slogan = this.scene.add.image(
      width / 2,
      175,
      'slogan'
    ).setOrigin(0.5, 0.5);

    const targetWidth = 553 / 2;
    const targetHeight = 217 / 2;
    const scaleX = targetWidth / this.slogan.width;
    const scaleY = targetHeight / this.slogan.height;
    this.slogan.setScale(scaleX, scaleY);

    this.scene.scale.on('resize', (gameSize: any) => {
      this.slogan.setPosition(gameSize.width / 2, 200);
    });

    const progressBarElements = this.createProgressBar(targetWidth);
    this.uiContainer.add([
      this.slogan,
      ...progressBarElements
    ]);
  }

  private createProgressBar(sloganWidth: number) {
    const barWidth = (sloganWidth * 0.7);
    const barY = 140 + this.slogan.displayHeight / 2 - 14;
    const barX = this.scene.scale.width / 2 - barWidth / 2;
    const barHeight = 15;
    const barRadius = barHeight / 2;

    const barBg = this.scene.add.graphics()
      .fillStyle(0x3a3e33, 1)
      .fillRect(
        barX,
        barY,
        barWidth,
        barHeight
      );

    this.progressBar = this.scene.add.graphics()
      .fillStyle(0xF97B31, 1)
      .fillRoundedRect(
        barX,
        barY,
        barWidth * (0 / 10),
        barHeight,
        barRadius
      );

    this.progressText = this.scene.add.text(
      barX + barWidth / 2,
      barY + barHeight / 2,
      '0 / 10',
      {
        fontSize: '12px',
        color: '#FFFFFF',
        fontFamily: 'Arial',
        stroke: '#000',
        strokeThickness: 2
      }
    ).setOrigin(0.5, 0.5);

    const chessPieceWidth = 56 / 2;
    const chessPieceHeight = 59 / 2;
    this.chessPiece = this.scene.add.image(
      barX - chessPieceWidth + 30,
      barY + barHeight / 2,
      'piece'
    ).setOrigin(0.5, 0.5).setDisplaySize(chessPieceWidth, chessPieceHeight);

    const chestWidth = 65 / 2;
    const chestHeight = 57 / 2;
    this.chest = this.scene.add.image(
      barX + barWidth + chestWidth / 2 - 20,
      barY + barHeight / 2,
      'chests'
    ).setOrigin(0.5, 0.5).setDisplaySize(chestWidth, chestHeight);

    return [barBg, this.progressBar, this.progressText, this.chessPiece, this.chest];
  }

  public updateProgress(current: number, total: number) {
    const barWidth = (this.slogan.displayWidth * 0.7);
    const barY = 140 + this.slogan.displayHeight / 2 - 13;
    const offsetX = 18;
    const barX = this.scene.scale.width / 2 - barWidth / 2 + offsetX;
    const barHeight = 13;
    const barRadius = barHeight / 2;
    const availableWidth = barWidth - offsetX * 2;

    this.progressBar
      .clear()
      .fillStyle(0xF97B31, 1)
      .fillRoundedRect(
        barX,
        barY,
        availableWidth * (current / total),
        barHeight,
        barRadius
      );
    this.progressText.setText(`${current} / ${total}`);
    const bgBarX = this.scene.scale.width / 2 - barWidth / 2;
    this.progressText.setPosition(bgBarX + barWidth / 2, barY + barHeight / 2);
  }

  public playAchievementFly(startPos: { x: number, y: number }) {
    const totalProgress = 10;
    if (this.currentProgress >= totalProgress) return;

    const endPos = {
      x: this.chest.x + this.uiContainer.x,
      y: this.chest.y + this.uiContainer.y
    };

    const achievement = this.scene.add.image(startPos.x, startPos.y, 'achievement')
      .setScale(1)
      .setDepth(this.chest.depth + 1);

    this.uiContainer.add(achievement);

    this.scene.tweens.add({
      targets: achievement,
      x: endPos.x,
      y: endPos.y,
      scale: 0.1,
      duration: 2000,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        achievement.destroy();
        this.scene.tweens.add({
          targets: this.chest,
          y: this.chest.y - 10,
          duration: 100,
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            this.currentProgress++;
            this.updateProgress(this.currentProgress, totalProgress);
          }
        });
      }
    });
  }

}
