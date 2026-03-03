import textToSpeech from "@hms:ai.textToSpeech";
import type { BusinessError } from "@ohos:base";
export interface SpeakOptions {
    speed?: number;
    volume?: number;
    voiceType?: number;
}
// 定义TTS配置接口
export interface TTSConfig {
    language: string;
    person: number; // 0:女声, 1:男声
    speed: number; // 1-5级
    volume: number; // 1-5级
    online: boolean; // 是否在线合成
}
export class TTSManager {
    private ttsEngine: textToSpeech.TextToSpeechEngine | null = null;
    private isEngineCreated: boolean = false;
    private config: TTSConfig = {
        language: 'zh-CN',
        person: 0,
        speed: 3,
        volume: 4,
        online: false
    };
    // 单例模式
    private static instance: TTSManager;
    static getInstance(): TTSManager {
        if (!TTSManager.instance) {
            TTSManager.instance = new TTSManager();
        }
        return TTSManager.instance;
    }
    // 创建引擎（带重试机制）
    async createEngine(): Promise<boolean> {
        try {
            const params: textToSpeech.CreateEngineParams = {
                language: this.config.language,
                person: this.config.person,
                online: this.config.online ? 1 : 0,
                extraParams: {
                    "style": "elderly-care",
                    "locate": "CN",
                }
            };
            return new Promise((resolve) => {
                textToSpeech.createEngine(params, (err: BusinessError, engine: textToSpeech.TextToSpeechEngine) => {
                    if (!err && engine) {
                        this.ttsEngine = engine;
                        this.isEngineCreated = true;
                        this.setupListeners();
                        resolve(true);
                    }
                    else {
                        console.error('创建引擎失败:', err);
                        resolve(false);
                    }
                });
            });
        }
        catch (error) {
            console.error('创建引擎异常:', error);
            return false;
        }
    }
    private setupListeners(): void {
        if (!this.ttsEngine)
            return;
        const self = this; // 保存当前实例的引用
        const speakListener: textToSpeech.SpeakListener = {
            onStart(requestID: string, response: textToSpeech.StartResponse) {
                console.info(`开始播报，requestID:${requestID}`);
            },
            onComplete(requestID: string, response: textToSpeech.CompleteResponse) {
                console.info(`播报完成，requestID:${requestID}`);
            },
            onStop(requestID: string, response: textToSpeech.StopResponse) {
                console.info(`停止播报，requestID:${requestID}`);
            },
            onData(requestId: string, audio: ArrayBuffer, response: textToSpeech.SynthesisResponse) {
                console.info(`返回音频流, requestId: ${requestId}`);
            },
            onError: (requestId: string, errorCode: number, errorMessage: string) => {
                if (errorCode === 1002300007) {
                    self.isEngineCreated = false;
                }
                console.error(`错误回调, errorCode: ${errorCode}, errorMessage: ${errorMessage}`);
            }
        };
        this.ttsEngine.setListener(speakListener);
    }
    private async speakSegment(segment: string, options?: SpeakOptions): Promise<boolean> {
        // 暂时直接调用 speak 方法
        return await this.speak(segment);
    }
    public async speak(text: string): Promise<boolean> {
        if (!text || text.trim() === '') {
            console.warn('播报文本为空');
            return false;
        }
        if (!this.isEngineCreated) {
            const created = await this.createEngine();
            if (!created) {
                console.error('引擎创建失败，无法播报');
                return false;
            }
        }
        if (!this.ttsEngine) {
            console.error('TTS引擎未初始化');
            return false;
        }
        return new Promise((resolve) => {
            try {
                const extraParam: Record<string, Object> = {
                    "queueMode": 0,
                    "speed": this.config.speed,
                    "volume": this.config.volume,
                    "languageContext": this.config.language,
                    "audioType": "pcm",
                    "soundChannel": 3,
                    "playType": 1
                };
                const speakPar: textToSpeech.SpeakParams = {
                    requestId: 'speak_' + Date.now(),
                    extraParams: extraParam
                };
                this.ttsEngine?.speak(text, speakPar);
                resolve(true);
            }
            catch (error) {
                console.error('播报失败:', error);
                resolve(false);
            }
        });
    }
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // 智能播报（自动处理长文本）
    async smartSpeak(text: string, options?: SpeakOptions): Promise<void> {
        if (!this.isEngineCreated) {
            await this.createEngine();
        }
        // 简单分段 - 按标点符号分割
        const segments = text.split(/[。！？；，]/).filter(s => s.trim().length > 0);
        // 如果没分段成功，使用整个文本
        if (segments.length === 0) {
            segments.push(text);
        }
        for (const segment of segments) {
            await this.speak(segment); // 暂时直接使用 speak
            await this.delay(500);
        }
    }
    private splitTextForElderly(text: string): string[] {
        // 为老年人优化：短句、适当停顿
        return text.split(/[，。！？；]/).filter(s => s.trim().length > 0);
    }
}
