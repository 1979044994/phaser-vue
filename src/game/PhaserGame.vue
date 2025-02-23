<!-- GameWrapper.vue -->
<template>
    <div class="game-container">
        <div ref="gameCanvas" class="game-canvas"></div>

        <div class="mobile-controls">
            <button @touchstart="rollDice" class="dice-button">🎲</button>
            <input type="number" v-model.number="fixedDice" min="1" max="6" class="dice-input" @touchstart.stop>
            <button @click="handleDice" class="dice-button">🎲</button>
        </div>

        <transition name="message-fade">
            <div v-if="message" class="game-message">{{ message }}</div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import Phaser from 'phaser';
import { onMounted, onUnmounted, ref } from 'vue';
import { gameConfig, IMG_BASE_URL } from './config';
import { PhaserChessGame } from './game';

const gameCanvas = ref<HTMLElement>(); // 引用游戏画布的 DOM 元素
const message = ref(''); // 游戏消息
const fixedDice = ref(3); // 固定骰子值

let game: Phaser.Game; // Phaser 游戏实例
let chessGame: PhaserChessGame; // 自定义的 PhaserChessGame 实例

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' }); // 调用父类构造函数并设置场景键
    }

    preload() {
        return new Promise<void>((resolve) => {
            const baseUrl = window.location.origin;

            // 使用绝对路径加载slogan资源
            this.load.image('slogan', `${baseUrl}/images/slogan.png`);
            this.load.image('chests', `${baseUrl}/images/chests.webp`);
            this.load.setBaseURL(IMG_BASE_URL); // 设置资源的基础 URL
            this.load.image('cell-normal', 'normal.webp'); // 加载普通单元格图像
            this.load.image('piece', 'piece.webp'); // 加载棋子图像

            this.load.setCORS('anonymous'); // 设置跨域资源共享
            this.load.crossOrigin = 'anonymous'; // 设置跨域资源共享
            this.load.image('background', 'bg.webp'); // 加载背景图像
            this.load.image('achievement', 'achievement.webp');

            // 加载所有特殊单元格资源
            gameConfig.specialCells.forEach(cell => {
                this.load.image(cell.imgName, cell.imgName);
            });
            this.load.once('complete', resolve); // 资源加载完成后调用 resolve
            this.load.start(); // 开始加载资源
        });
    }

    create() {
        // 创建背景图像
        // this.add.image(0, 0, 'background')
        //     .setOrigin(0)
        //     .setDisplaySize(this.scale.width, this.scale.height)
        //     .setDepth(-1); // 确保在最底层

        chessGame = new PhaserChessGame(this, gameConfig); // 创建自定义的 PhaserChessGame 实例
        chessGame.createPiece(); // 创建棋子

        // 在 create 方法中添加调试代码
        const testMoves = async () => {
            // 测试前进 3 步
            await chessGame.movePiece(3);
            // 测试后退 2 步
            await chessGame.movePiece(-2);
        };

        // 显示当前坐标
        const posText = this.add.text(10, 10, '', { color: '#fff' }); // 创建文本对象显示当前坐标
        this.events.on('update', () => {
            posText.setText(`Current: ${chessGame.currentPos.x},${chessGame.currentPos.y}`); // 更新文本内容
        });

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.downElement.localName === 'button') return; // 如果点击的是按钮则返回
            const worldPoint = pointer.positionToCamera(this.cameras.main); // 获取点击位置的世界坐标
            // 处理棋盘点击...
        });

        // 监听游戏状态变化
        this.events.on('game-state', (state: 'start' | 'end') => {
            updateUIState(state === 'start'); // 更新 UI 状态
        });

        // 监听游戏消息
        this.events.on('game-message', (msg: string) => {
            message.value = msg; // 设置消息内容
            setTimeout(() => message.value = '', 3000); // 3 秒后清除消息
        });

        // 添加网格
        this.add.grid(
            this.scale.width / 2,
            this.scale.height / 2,
            chessGame.board.length * chessGame.cellSize.width,
            chessGame.board[0].length * chessGame.cellSize.height,
            chessGame.cellSize.width,
            chessGame.cellSize.height,
            0x000000, 0, 0xffffff, 0.1
        ).setOrigin(0.5);
    }
}

const initGame = () => {
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO, // 自动选择渲染器
        parent: gameCanvas.value!, // 将游戏附加到 gameCanvas 元素
        width: window.innerWidth, // 设置游戏宽度
        height: window.innerHeight, // 设置游戏高度
        scene: [MainScene], // 设置场景
        scale: {
            mode: Phaser.Scale.RESIZE, // 设置缩放模式为调整大小
            autoCenter: Phaser.Scale.CENTER_BOTH // 自动居中
        },
        input: {
            touch: {
                capture: true // 捕获触摸事件
            }
        }
    };

    game = new Phaser.Game(config); // 创建 Phaser 游戏实例
};

const isMoving = ref(false); // 是否正在移动
const diceLabel = ref('🎲 掷骰子'); // 骰子按钮标签

const handleDiceClick = () => {
    if (!isMoving.value) {
        const value = Math.floor(Math.random() * 6) + 1; // 随机生成 1 到 6 的值
        chessGame.requestMove(value); // 请求移动棋子
        updateUIState(true); // 更新 UI 状态
    }
};

const updateUIState = (moving: boolean) => {
    isMoving.value = moving; // 设置是否正在移动
    diceLabel.value = moving ? '移动中...' : '🎲 掷骰子'; // 更新骰子按钮标签
};

const rollDice = () => {
    const value = Math.floor(Math.random() * 6) + 1; // 随机生成 1 到 6 的值
    console.log('Roll dice:', value);

    chessGame.movePiece(value); // 移动棋子
};

const handleDice = () => {
    chessGame.movePiece(fixedDice.value); // 移动棋子到固定的骰子值
};

onMounted(() => {
    initGame(); // 初始化游戏
    window.addEventListener('resize', () => game.scale.refresh()); // 监听窗口调整大小事件
});

onUnmounted(() => {
    game.destroy(true); // 销毁游戏实例
    window.removeEventListener('resize', () => game.scale.refresh()); // 移除窗口调整大小事件监听器
});
</script>

<style scoped>
.game-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    touch-action: none;
}

.mobile-controls {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 15px;
    align-items: center;
}

.dice-button {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    font-size: 24px;
    touch-action: manipulation;
}

.dice-input {
    width: 80px;
    height: 40px;
    text-align: center;
    font-size: 18px;
    border: 2px solid #fff;
    background: rgba(255, 255, 255, 0.9);
    touch-action: manipulation;
}

.game-message {
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px 25px;
    border-radius: 25px;
    font-size: 16px;
    max-width: 80%;
    text-align: center;
}

.message-fade-enter-active,
.message-fade-leave-active {
    transition: opacity 0.3s;
}

.message-fade-enter-from,
.message-fade-leave-to {
    opacity: 0;
}
</style>
