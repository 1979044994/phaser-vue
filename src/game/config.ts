// config.ts
export const IMG_BASE_URL = 'https://ycmalloss.hznmd.com/common-static/wxapp-sgs-bbs/86/chess/';
import { ChessType, GameConfig } from './types';
export const gameConfig: GameConfig = {
  boardSize: 19,
  specialCells: [
    // 绿色 - START
    // {
    //   position: [0, 18],
    //   type: ChessType.START,
    //   imgName: 'start.webp',
    //   effect: '游戏开始！'
    // },
    // 蓝色 - TURN
    {
      position: [0, 9],
      type: ChessType.TURN,
      imgName: 'turn.webp',
      effect: '转向操作！'
    },
    {
      position: [9, 5],
      type: ChessType.TURN,
      imgName: 'turn.webp',
      effect: '转向操作！'
    },
    {
      position: [18, 9],
      type: ChessType.TURN,
      imgName: 'turn.webp',
      effect: '转向操作！'
    },
    {
      position: [9, 13],
      type: ChessType.TURN,
      imgName: 'turn.webp',
      effect: '转向操作！'
    },
    // 粉色 - REWARD
    {
      position: [0, 15],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    {
      position: [0, 3],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    {
      position: [1, 0],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    {
      position: [7, 0],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    {
      position: [15, 0],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    {
      position: [9, 3],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    {
      position: [18, 3],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    {
      position: [6, 5],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    {
      position: [10, 5],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    {
      position: [18, 6],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    {
      position: [13, 8],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    {
      position: [5, 9],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    {
      position: [7, 13],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    {
      position: [13, 13],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    {
      position: [18, 12],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    {
      position: [9, 16],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    {
      position: [18, 17],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    {
      position: [1, 18],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    {
      position: [6, 18],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    {
      position: [14, 18],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    // {
    //   position: [0, 1],
    //   type: ChessType.REWARD,
    //   imgName: 'reward.webp',
    //   effect: '你获得了奖励！'
    // },
    // {
    //   position: [3, 18],
    //   type: ChessType.REWARD,
    //   imgName: 'reward.webp',
    //   effect: '你获得了奖励！'
    // },
    // {
    //   position: [7, 18],
    //   type: ChessType.REWARD,
    //   imgName: 'reward.webp',
    //   effect: '你获得了奖励！'
    // },
    // {
    //   position: [10, 18],
    //   type: ChessType.REWARD,
    //   imgName: 'reward.webp',
    //   effect: '你获得了奖励！'
    // },
    // {
    //   position: [13, 18],
    //   type: ChessType.REWARD,
    //   imgName: 'reward.webp',
    //   effect: '你获得了奖励！'
    // },
    {
      position: [17, 18],
      type: ChessType.REWARD,
      imgName: 'reward.webp',
      effect: '你获得了奖励！'
    },
    // 浅蓝色 - QUESTION
    {
      position: [0, 17],
      type: ChessType.QUESTION,
      imgName: 'question.webp',
      effect: '你触发了问答事件！'
    },
    {
      position: [0, 6],
      type: ChessType.QUESTION,
      imgName: 'question.webp',
      effect: '你触发了问答事件！'
    },
    {
      position: [5, 0],
      type: ChessType.QUESTION,
      imgName: 'question.webp',
      effect: '你触发了问答事件！'
    },
    {
      position: [10, 0],
      type: ChessType.QUESTION,
      imgName: 'question.webp',
      effect: '你触发了问答事件！'
    },
    {
      position: [18, 1],
      type: ChessType.QUESTION,
      imgName: 'question.webp',
      effect: '你触发了问答事件！'
    },
    {
      position: [5, 7],
      type: ChessType.QUESTION,
      imgName: 'question.webp',
      effect: '你触发了问答事件！'
    },
    {
      position: [2, 9],
      type: ChessType.QUESTION,
      imgName: 'question.webp',
      effect: '你触发了问答事件！'
    },
    {
      position: [15, 18],
      type: ChessType.QUESTION,
      imgName: 'question.webp',
      effect: '发生了一个特殊事件！'
    },
    {
      position: [13, 6],
      type: ChessType.QUESTION,
      imgName: 'question.webp',
      effect: '你触发了问答事件！'
    },
    {
      position: [16, 9],
      type: ChessType.QUESTION,
      imgName: 'question.webp',
      effect: '你触发了问答事件！'
    },
    {
      position: [13, 11],
      type: ChessType.QUESTION,
      imgName: 'question.webp',
      effect: '你触发了问答事件！'
    },
    {
      position: [10, 13],
      type: ChessType.QUESTION,
      imgName: 'question.webp',
      effect: '你触发了问答事件！'
    },
    {
      position: [9, 15],
      type: ChessType.QUESTION,
      imgName: 'question.webp',
      effect: '你触发了问答事件！'
    },
    {
      position: [18, 14],
      type: ChessType.QUESTION,
      imgName: 'question.webp',
      effect: '你触发了问答事件！'
    },
    {
      position: [4, 18],
      type: ChessType.QUESTION,
      imgName: 'question.webp',
      effect: '你触发了问答事件！'
    },

    // 黄色 - EVENT
    {
      position: [0, 11],
      type: ChessType.EVENT,
      imgName: 'event.webp',
      effect: '发生了一个特殊事件！'
    },
    {
      position: [0, 0],
      type: ChessType.EVENT,
      imgName: 'event.webp',
      effect: '发生了一个特殊事件！'
    },
    {
      position: [8, 0],
      type: ChessType.EVENT,
      imgName: 'event.webp',
      effect: '发生了一个特殊事件！'
    },
    {
      position: [12, 0],
      type: ChessType.EVENT,
      imgName: 'event.webp',
      effect: '发生了一个特殊事件！'
    },
    {
      position: [18, 0],
      type: ChessType.EVENT,
      imgName: 'event.webp',
      effect: '发生了一个特殊事件！'
    },
    {
      position: [5, 5],
      type: ChessType.EVENT,
      imgName: 'event.webp',
      effect: '发生了一个特殊事件！'
    },
    {
      position: [13, 5],
      type: ChessType.EVENT,
      imgName: 'event.webp',
      effect: '发生了一个特殊事件！'
    },
    {
      position: [18, 7],
      type: ChessType.EVENT,
      imgName: 'event.webp',
      effect: '发生了一个特殊事件！'
    },
    {
      position: [5, 10],
      type: ChessType.EVENT,
      imgName: 'event.webp',
      effect: '发生了一个特殊事件！'
    },
    {
      position: [18, 13],
      type: ChessType.EVENT,
      imgName: 'event.webp',
      effect: '发生了一个特殊事件！'
    },
    {
      position: [5, 18],
      type: ChessType.EVENT,
      imgName: 'event.webp',
      effect: '发生了一个特殊事件！'
    },
    {
      position: [11, 18],
      type: ChessType.EVENT,
      imgName: 'event.webp',
      effect: '发生了一个特殊事件！'
    },
    {
      position: [1, 18],
      type: ChessType.EVENT,
      imgName: 'event.webp',
      effect: '发生了一个特殊事件！'
    },
    {
      position: [5, 18],
      type: ChessType.EVENT,
      imgName: 'event.webp',
      effect: '发生了一个特殊事件！'
    },
    // {
    //   position: [9, 18],
    //   type: ChessType.EVENT,
    //   imgName: 'event.webp',
    //   effect: '发生了一个特殊事件！'
    // },
    {
      position: [12, 18],
      type: ChessType.EVENT,
      imgName: 'event.webp',
      effect: '发生了一个特殊事件！'
    },

    // 橙色 - ACHIEVEMENT
    {
      position: [0, 13],
      type: ChessType.ACHIEVEMENT,
      imgName: 'achievement.webp',
      effect: '你达成了一项成就！'
    },
    {
      position: [0, 4],
      type: ChessType.ACHIEVEMENT,
      imgName: 'achievement.webp',
      effect: '你达成了一项成就！'
    },
    {
      position: [4, 0],
      type: ChessType.ACHIEVEMENT,
      imgName: 'achievement.webp',
      effect: '你达成了一项成就！'
    },
    {
      position: [16, 0],
      type: ChessType.ACHIEVEMENT,
      imgName: 'achievement.webp',
      effect: '你达成了一项成就！'
    },
    {
      position: [18, 4],
      type: ChessType.ACHIEVEMENT,
      imgName: 'achievement.webp',
      effect: '你达成了一项成就！'
    },
    {
      position: [8, 5],
      type: ChessType.ACHIEVEMENT,
      imgName: 'achievement.webp',
      effect: '你达成了一项成就！'
    },
    {
      position: [5, 12],
      type: ChessType.ACHIEVEMENT,
      imgName: 'achievement.webp',
      effect: '你达成了一项成就！'
    },
    {
      position: [13, 9],
      type: ChessType.ACHIEVEMENT,
      imgName: 'achievement.webp',
      effect: '你达成了一项成就！'
    },
    {
      position: [18, 15],
      type: ChessType.ACHIEVEMENT,
      imgName: 'achievement.webp',
      effect: '你达成了一项成就！'
    },
    {
      position: [12, 18],
      type: ChessType.ACHIEVEMENT,
      imgName: 'achievement.webp',
      effect: '你达成了一项成就！'
    },
    {
      position: [2, 18],
      type: ChessType.ACHIEVEMENT,
      imgName: 'achievement.webp',
      effect: '你达成了一项成就！'
    },
    {
      position: [17, 18],
      type: ChessType.ACHIEVEMENT,
      imgName: 'achievement.webp',
      effect: '你达成了一项成就！'
    }
  ]
};
