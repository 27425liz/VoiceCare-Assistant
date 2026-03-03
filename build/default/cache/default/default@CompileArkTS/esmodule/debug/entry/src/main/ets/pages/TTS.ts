if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    originalText?: string;
    count?: number;
    uiContext?: UIContext;
    promptAction?: PromptAction;
    pcmPlayer?: PcmPlayer;
}
import textToSpeech from "@hms:ai.textToSpeech";
import type { BusinessError } from "@ohos:base";
import type { PromptAction } from "@ohos:arkui.UIContext";
import type { UIContext } from "@ohos:arkui.UIContext";
import PcmPlayer from "@normalized:N&&&entry/src/main/ets/pages/PcmPlayer&";
// 创建tts对象
let tts: textToSpeech.TextToSpeechEngine;
// 是否创建引擎，默认值为false
let engineCreated: boolean = false;
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__originalText = new ObservedPropertySimplePU("\n\t\t古人学问无遗力，少壮工夫老始成；\n\t\t"
        // + "纸上得来终觉浅，绝知此事要躬行。\n\t\t";
        //2. 创建引擎的次数
        , this, "originalText");
        this.__count = new ObservedPropertySimplePU(0
        // 3.创建上下文对象
        , this, "count");
        this.__uiContext = new ObservedPropertyObjectPU(this.getUIContext()
        // 4.获取弹框提示
        , this, "uiContext");
        this.__promptAction = new ObservedPropertyObjectPU(this.uiContext.getPromptAction()
        // 5.实例化pcm对象
        , this, "promptAction");
        this.pcmPlayer = new PcmPlayer();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.originalText !== undefined) {
            this.originalText = params.originalText;
        }
        if (params.count !== undefined) {
            this.count = params.count;
        }
        if (params.uiContext !== undefined) {
            this.uiContext = params.uiContext;
        }
        if (params.promptAction !== undefined) {
            this.promptAction = params.promptAction;
        }
        if (params.pcmPlayer !== undefined) {
            this.pcmPlayer = params.pcmPlayer;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__originalText.purgeDependencyOnElmtId(rmElmtId);
        this.__count.purgeDependencyOnElmtId(rmElmtId);
        this.__uiContext.purgeDependencyOnElmtId(rmElmtId);
        this.__promptAction.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__originalText.aboutToBeDeleted();
        this.__count.aboutToBeDeleted();
        this.__uiContext.aboutToBeDeleted();
        this.__promptAction.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 1.用户输入的文本内容
    private __originalText: ObservedPropertySimplePU<string>;
    get originalText() {
        return this.__originalText.get();
    }
    set originalText(newValue: string) {
        this.__originalText.set(newValue);
    }
    // + "纸上得来终觉浅，绝知此事要躬行。\n\t\t";
    //2. 创建引擎的次数
    private __count: ObservedPropertySimplePU<number>;
    get count() {
        return this.__count.get();
    }
    set count(newValue: number) {
        this.__count.set(newValue);
    }
    // 3.创建上下文对象
    private __uiContext: ObservedPropertyObjectPU<UIContext>;
    get uiContext() {
        return this.__uiContext.get();
    }
    set uiContext(newValue: UIContext) {
        this.__uiContext.set(newValue);
    }
    // 4.获取弹框提示
    private __promptAction: ObservedPropertyObjectPU<PromptAction>;
    get promptAction() {
        return this.__promptAction.get();
    }
    set promptAction(newValue: PromptAction) {
        this.__promptAction.set(newValue);
    }
    // 5.实例化pcm对象
    private pcmPlayer: PcmPlayer;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.justifyContent(FlexAlign.Center);
            Column.height('100%');
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //多行文本输入框组件
            TextArea.create({ placeholder: '请输入您要播报的文本内容', text: this.originalText });
            //多行文本输入框组件
            TextArea.border({
                width: 5,
                color: Color.Red,
                style: BorderStyle.Dotted
            });
            //多行文本输入框组件
            TextArea.onChange((val) => {
                this.originalText = val;
            });
        }, TextArea);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 15 });
            Column.margin({ top: 30 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //   调用接口的按钮
            Button.createWithLabel('创建tts引擎');
            //   调用接口的按钮
            Button.width("80%");
            //   调用接口的按钮
            Button.onClick(() => {
                //1.更改创建引擎的状态
                engineCreated = true;
                // 2.创建次数+1
                this.count++;
                //   3.创建引擎
                this.createByCallback();
                //   4.提示创建成功
                this.promptAction.showToast({
                    message: "引擎创建成功",
                    duration: 2000 //提示框的显示时长，单位ms
                });
            });
        }, Button);
        //   调用接口的按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('开始播报');
            Button.width("80%");
            Button.onClick(() => {
                if (engineCreated) {
                    //   在创建引擎的情况下播报
                    try {
                        this.speak();
                        this.promptAction.showToast({
                            message: "开始播报",
                            duration: 2000
                        });
                    }
                    catch (error) {
                        this.promptAction.showToast({
                            message: "开始播报异常",
                            duration: 2000
                        });
                    }
                }
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('stop');
            Button.width("80%");
            Button.onClick(() => {
                try {
                    //   判断引擎是否繁忙，是否在播报中
                    let isBusy: boolean = tts.isBusy();
                    // 判断渲染器是否繁忙
                    let isPlaying: boolean = this.pcmPlayer.isPlaying();
                    //   如果引擎繁忙，先暂停
                    //   stop() 临时终端的操作，仅仅停止当前的语音合成任务和播放流程，
                    //   关于TTS引擎的核心资源，例如引擎实例、配置的参数不会被释放，仍然保留在内存中
                    if (isBusy)
                        tts.stop();
                    if (isPlaying)
                        this.pcmPlayer.stop();
                    this.promptAction.showToast({
                        message: "stop"
                    });
                }
                catch (err) {
                    this.promptAction.showToast({
                        message: "stop failed"
                    });
                }
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('是否繁忙');
            Button.width("80%");
            Button.onClick(() => {
                try {
                    //   判断引擎是否繁忙，是否在播报中
                    let isBusy: boolean = tts.isBusy();
                    // 判断渲染器是否繁忙
                    let isPlaying: boolean = this.pcmPlayer.isPlaying();
                    this.promptAction.showToast({
                        message: "播报状态：" + isBusy + "渲染器：" + isPlaying
                    });
                }
                catch (err) {
                    this.promptAction.showToast({
                        message: "处理异常"
                    });
                }
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('shutdown');
            Button.width("80%");
            Button.onClick(() => {
                try {
                    //   释放音频渲染器所有资源
                    this.pcmPlayer.release();
                    // 释放引擎 彻底关闭TTS引擎，释放所有关联资源，是’生命周期结束‘的操作
                    tts.shutdown();
                    engineCreated = false;
                    this.promptAction.showToast({
                        message: "释放成功"
                    });
                }
                catch (err) {
                    this.promptAction.showToast({
                        message: "释放异常"
                    });
                }
            });
        }, Button);
        Button.pop();
        Column.pop();
        Column.pop();
    }
    //   创建引擎的回调函数
    private createByCallback() {
        //   1.创建引擎的参数
        let extraParam: Record<string, Object> = {
            "style": "interaction-broadcast",
            "locate": "CN",
            "name": "EngineName" //引擎名称
        };
        //   2.初始化参数
        let initParamInfo: textToSpeech.CreateEngineParams = {
            language: 'zh-CN',
            person: 0,
            online: 1,
            extraParams: extraParam
        };
        //   3.创建引擎
        try {
            textToSpeech.createEngine(initParamInfo, (err: BusinessError, textTS: textToSpeech.TextToSpeechEngine) => {
                if (!err) {
                    console.info('创建引擎成功');
                    tts = textTS;
                }
                else {
                    console.error(`code: ${err.code}, message: ${err.message}`);
                }
            });
        }
        catch (error) {
            console.error(`code: ${error.code}, message: ${error.message}`);
        }
    }
    //   开始播报的回调函数
    private speak() {
        let speakListener: textToSpeech.SpeakListener = {
            //   开始播报回调
            onStart(requestID: string, response: textToSpeech.StartResponse) {
                console.info(`开始播报，requestID:${requestID}，response：${JSON.stringify(response)}`);
            },
            // 合成完成及播报完成
            onComplete(requestID: string, response: textToSpeech.CompleteResponse) {
                console.info(`合成完成及播报完成，requestID:${requestID}，response：${JSON.stringify(response)}`);
            },
            //   停止播报
            onStop(requestID: string, response: textToSpeech.StopResponse) {
                console.info(`停止播报，requestID:${requestID}，response：${JSON.stringify(response)}`);
            },
            // 返回音频流
            onData(requestId: string, audio: ArrayBuffer, response: textToSpeech.SynthesisResponse) {
                console.info(`返回音频流, requestId: ${requestId} sequence: ${JSON.stringify(response)} audio: ${JSON.stringify(audio)}`);
            },
            // 错误回调
            onError(requestId: string, errorCode: number, errorMessage: string) {
                if (errorCode === 1002300007)
                    engineCreated = false;
                console.error(`错误回调, requestId: ${requestId} errorCode: ${errorCode} errorMessage: ${errorMessage}`);
            }
        };
        //   设置回调
        tts.setListener(speakListener);
        //   设置播报相关参数
        let extraParam: Record<string, Object> = {
            "queueMode": 0,
            "speed": 1,
            "volume": 2,
            "languageContext": 'zh-CN',
            "audioType": "pcm",
            "soundChannel": 3,
            "playType": 1
        };
        let speakPar: textToSpeech.SpeakParams = {
            requestId: '123456' + Date.now(),
            extraParams: extraParam
        };
        //   合成
        try {
            tts.speak(this.originalText, speakPar);
        }
        catch (error) {
            console.error(`code: ${error.code}, msg: ${error.message}`);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.example.myapplication", moduleName: "entry", pagePath: "pages/TTS", pageFullPath: "entry/src/main/ets/pages/TTS", integratedHsp: "false", moduleType: "followWithHap" });
