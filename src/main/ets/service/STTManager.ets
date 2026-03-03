// 作用：语音转文本（STT）功能管理

import { BusinessError } from '@kit.BasicServicesKit';
export interface VoiceCommand {
  pattern: RegExp;
  action: string;
}

export class STTManager {
  private static instance: STTManager;
  private isListening: boolean = false;

  static getInstance(): STTManager {
    if (!STTManager.instance) {
      STTManager.instance = new STTManager();
    }
    return STTManager.instance;
  }

  // 开始语音识别
  startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.isListening) {
        reject(new Error('已在监听中'));
        return;
      }

      this.isListening = true;
      console.log('开始语音识别...');

      // 模拟语音识别结果（实际需调用语音识别API）
      setTimeout(() => {
        this.isListening = false;
        const recognizedText = '今天天气不错，我想出门散步';
        resolve(recognizedText);
      }, 2000);
    });
  }

  // 停止语音识别
  stopListening(): void {
    this.isListening = false;
    console.log('停止语音识别');
  }

  // 处理语音命令
  processVoiceCommand(text: string): string {
    // 直接使用类型断言
    const commands = [
      { pattern: new RegExp(/打开.*首页/), action: 'navigateToHome' },
      { pattern: new RegExp(/打电话给(.+)/), action: 'makeCall' },
      { pattern: new RegExp(/发短信给(.+)/), action: 'sendSMS' },
      { pattern: new RegExp(/今天天气/), action: 'queryWeather' },
      { pattern: new RegExp(/现在几点/), action: 'queryTime' }
    ] as VoiceCommand[];

    for (const cmd of commands) {
      const match = text.match(cmd.pattern);
      if (match) {
        return `执行命令：${cmd.action}，参数：${match[1] || '无'}`;
      }
    }

    return '未识别到有效命令';
  }
}