// 作用：定义语音相关数据结构
export interface TTSConfig {
  language: string;
  person: number; // 0:女声, 1:男声
  speed: number;  // 1-5级
  volume: number; // 1-5级
  online: boolean; // 是否在线合成
}

export interface SpeechHistory {
  id: string;
  text: string;
  timestamp: number;
  duration: number; // 播报时长(秒)
}

export interface VoiceCommand {
  command: string;
  action: string;
  description: string;
}

export class UserPreference {
  fontSize: number = 18; // sp
  highContrast: boolean = true;
  voiceGuidance: boolean = true;
  vibrationFeedback: boolean = true;

  constructor(data?: Partial<UserPreference>) {
    if (data) {
      // 手动复制每个属性，不使用 Object.assign
      if (data.fontSize !== undefined) {
        this.fontSize = data.fontSize;
      }
      if (data.highContrast !== undefined) {
        this.highContrast = data.highContrast;
      }
      if (data.voiceGuidance !== undefined) {
        this.voiceGuidance = data.voiceGuidance;
      }
      if (data.vibrationFeedback !== undefined) {
        this.vibrationFeedback = data.vibrationFeedback;
      }
    }
  }
}