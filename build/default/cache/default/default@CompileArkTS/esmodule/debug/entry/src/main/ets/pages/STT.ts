if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface STT_Params {
    recognizedText?: string;
    isListening?: boolean;
    commandResult?: string;
    historyList?: string[];
    promptAction?: PromptAction;
    ttsManager?: TTSManager;
    sttManager?: STTManager;
}
import type { PromptAction } from "@ohos:arkui.UIContext";
import { TTSManager } from "@normalized:N&&&entry/src/main/ets/service/TTSManager&";
import { STTManager } from "@normalized:N&&&entry/src/main/ets/service/STTManager&";
class STT extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__recognizedText = new ObservedPropertySimplePU('点击下方按钮开始说话', this, "recognizedText");
        this.__isListening = new ObservedPropertySimplePU(false, this, "isListening");
        this.__commandResult = new ObservedPropertySimplePU('', this, "commandResult");
        this.__historyList = new ObservedPropertyObjectPU([
            '今天天气不错',
            '帮我打电话给儿子',
            '现在几点钟了'
        ], this, "historyList");
        this.__promptAction = new ObservedPropertyObjectPU(this.getUIContext().getPromptAction(), this, "promptAction");
        this.ttsManager = TTSManager.getInstance();
        this.sttManager = STTManager.getInstance();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: STT_Params) {
        if (params.recognizedText !== undefined) {
            this.recognizedText = params.recognizedText;
        }
        if (params.isListening !== undefined) {
            this.isListening = params.isListening;
        }
        if (params.commandResult !== undefined) {
            this.commandResult = params.commandResult;
        }
        if (params.historyList !== undefined) {
            this.historyList = params.historyList;
        }
        if (params.promptAction !== undefined) {
            this.promptAction = params.promptAction;
        }
        if (params.ttsManager !== undefined) {
            this.ttsManager = params.ttsManager;
        }
        if (params.sttManager !== undefined) {
            this.sttManager = params.sttManager;
        }
    }
    updateStateVars(params: STT_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__recognizedText.purgeDependencyOnElmtId(rmElmtId);
        this.__isListening.purgeDependencyOnElmtId(rmElmtId);
        this.__commandResult.purgeDependencyOnElmtId(rmElmtId);
        this.__historyList.purgeDependencyOnElmtId(rmElmtId);
        this.__promptAction.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__recognizedText.aboutToBeDeleted();
        this.__isListening.aboutToBeDeleted();
        this.__commandResult.aboutToBeDeleted();
        this.__historyList.aboutToBeDeleted();
        this.__promptAction.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __recognizedText: ObservedPropertySimplePU<string>;
    get recognizedText() {
        return this.__recognizedText.get();
    }
    set recognizedText(newValue: string) {
        this.__recognizedText.set(newValue);
    }
    private __isListening: ObservedPropertySimplePU<boolean>;
    get isListening() {
        return this.__isListening.get();
    }
    set isListening(newValue: boolean) {
        this.__isListening.set(newValue);
    }
    private __commandResult: ObservedPropertySimplePU<string>;
    get commandResult() {
        return this.__commandResult.get();
    }
    set commandResult(newValue: string) {
        this.__commandResult.set(newValue);
    }
    private __historyList: ObservedPropertyObjectPU<string[]>;
    get historyList() {
        return this.__historyList.get();
    }
    set historyList(newValue: string[]) {
        this.__historyList.set(newValue);
    }
    private __promptAction: ObservedPropertyObjectPU<PromptAction>;
    get promptAction() {
        return this.__promptAction.get();
    }
    set promptAction(newValue: PromptAction) {
        this.__promptAction.set(newValue);
    }
    private ttsManager: TTSManager;
    private sttManager: STTManager;
    aboutToAppear(): void {
        this.ttsManager.speak('语音识别功能，点击麦克风按钮开始说话');
    }
    // 开始/停止语音识别
    private toggleListening(): void {
        if (!this.isListening) {
            this.startListening();
        }
        else {
            this.stopListening();
        }
    }
    // 开始语音识别
    private startListening(): void {
        this.isListening = true;
        this.recognizedText = '正在聆听...请说话（5秒后自动停止）';
        this.ttsManager.speak('请开始说话');
        // 模拟语音识别过程
        const listeningDuration = 5000;
        this.sttManager.startListening().then((text) => {
            this.recognizedText = text;
            this.isListening = false;
            // 添加到历史记录
            this.addToHistory(text);
            // 处理语音命令
            const commandResponse = this.sttManager.processVoiceCommand(text);
            this.commandResult = commandResponse;
            // 播报结果
            this.ttsManager.speak(`您说的是：${text}。${commandResponse}`);
        }).catch((error: Error) => {
            console.error('语音识别失败:', error);
            this.recognizedText = '识别失败，请重试';
            this.isListening = false;
            this.ttsManager.speak('识别失败，请重试');
        });
    }
    // 停止语音识别
    private stopListening(): void {
        this.isListening = false;
        this.recognizedText = '已停止聆听';
        this.sttManager.stopListening();
        this.ttsManager.speak('已停止聆听');
    }
    // 添加到历史记录
    private addToHistory(text: string): void {
        this.historyList.unshift(text);
        if (this.historyList.length > 10) {
            this.historyList.pop();
        }
    }
    // 清空历史记录
    private clearHistory(): void {
        this.historyList = [];
        this.ttsManager.speak('已清空历史记录');
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.backgroundColor('#F5F5F5');
            Scroll.scrollBar(BarState.Auto);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.justifyContent(FlexAlign.Start);
            Column.padding({ left: 20, right: 20, top: 20, bottom: 40 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题
            Text.create('语音识别');
            // 标题
            Text.fontSize(30);
            // 标题
            Text.fontWeight(FontWeight.Bold);
            // 标题
            Text.fontColor(Color.Blue);
            // 标题
            Text.margin({ top: 20, bottom: 20 });
        }, Text);
        // 标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 状态指示
            Row.create();
            // 状态指示
            Row.margin({ bottom: 20 });
            // 状态指示
            Row.width('90%');
            // 状态指示
            Row.justifyContent(FlexAlign.Start);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('状态：');
            Text.fontSize(20);
            Text.fontColor(Color.Gray);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.isListening ? '聆听中...' : '待命');
            Text.fontSize(20);
            Text.fontColor(this.isListening ? Color.Red : Color.Green);
            Text.margin({ left: 10 });
        }, Text);
        Text.pop();
        // 状态指示
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 识别结果显示框
            Text.create(this.recognizedText);
            // 识别结果显示框
            Text.fontSize(22);
            // 识别结果显示框
            Text.fontColor(Color.Black);
            // 识别结果显示框
            Text.width('90%');
            // 识别结果显示框
            Text.height(150);
            // 识别结果显示框
            Text.padding(15);
            // 识别结果显示框
            Text.backgroundColor(Color.White);
            // 识别结果显示框
            Text.border({ width: 2, color: Color.Blue, style: BorderStyle.Solid });
            // 识别结果显示框
            Text.borderRadius(10);
            // 识别结果显示框
            Text.textAlign(TextAlign.Start);
            // 识别结果显示框
            Text.margin({ bottom: 20 });
        }, Text);
        // 识别结果显示框
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 命令执行结果
            if (this.commandResult) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('执行结果：' + this.commandResult);
                        Text.fontSize(18);
                        Text.fontColor(Color.Green);
                        Text.width('90%');
                        Text.padding(10);
                        Text.backgroundColor('#E8F5E9');
                        Text.borderRadius(10);
                        Text.margin({ bottom: 20 });
                        Text.textAlign(TextAlign.Start);
                    }, Text);
                    Text.pop();
                });
            }
            // 麦克风按钮
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 麦克风按钮
            Button.createWithLabel(this.isListening ? '停止识别' : '开始说话');
            // 麦克风按钮
            Button.width(200);
            // 麦克风按钮
            Button.height(200);
            // 麦克风按钮
            Button.fontSize(24);
            // 麦克风按钮
            Button.fontWeight(FontWeight.Bold);
            // 麦克风按钮
            Button.backgroundColor(this.isListening ? Color.Red : Color.Green);
            // 麦克风按钮
            Button.fontColor(Color.White);
            // 麦克风按钮
            Button.borderRadius(100);
            // 麦克风按钮
            Button.margin({ bottom: 30 });
            // 麦克风按钮
            Button.onClick(() => {
                this.toggleListening();
            });
        }, Button);
        // 麦克风按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 历史记录标题
            Row.create();
            // 历史记录标题
            Row.width('90%');
            // 历史记录标题
            Row.justifyContent(FlexAlign.SpaceBetween);
            // 历史记录标题
            Row.margin({ bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('历史记录');
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.Black);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('清空');
            Button.fontSize(16);
            Button.padding({ left: 10, right: 10 });
            Button.margin({ left: 10 });
            Button.backgroundColor(Color.Transparent);
            Button.fontColor(Color.Red);
            Button.border({ width: 1, color: Color.Red });
            Button.onClick(() => {
                this.clearHistory();
            });
        }, Button);
        Button.pop();
        // 历史记录标题
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 历史记录列表
            List.create();
            // 历史记录列表
            List.width('90%');
            // 历史记录列表
            List.height(200);
            // 历史记录列表
            List.margin({ bottom: 20 });
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                {
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ListItem.create(deepRenderFunction, true);
                        if (!isInitialRender) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        ListItem.create(deepRenderFunction, true);
                        ListItem.border({ width: 1, color: '#EEEEEE', style: BorderStyle.Solid });
                        ListItem.borderRadius(5);
                        ListItem.margin({ bottom: 5 });
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create();
                            Row.width('100%');
                            Row.padding(10);
                            Row.justifyContent(FlexAlign.SpaceBetween);
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(`${index + 1}. ${item}`);
                            Text.fontSize(18);
                            Text.fontColor(Color.Gray);
                            Text.textAlign(TextAlign.Start);
                            Text.margin({ right: 10 });
                            Text.flexGrow(1);
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Button.createWithLabel('播报');
                            Button.fontSize(14);
                            Button.padding({ left: 8, right: 8 });
                            Button.backgroundColor(Color.Blue);
                            Button.fontColor(Color.White);
                            Button.onClick(() => {
                                this.ttsManager.speak(item);
                            });
                        }, Button);
                        Button.pop();
                        Row.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.historyList, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        // 历史记录列表
        List.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 语音命令示例
            Column.create();
            // 语音命令示例
            Column.width('90%');
            // 语音命令示例
            Column.padding(15);
            // 语音命令示例
            Column.backgroundColor('#FFF8E1');
            // 语音命令示例
            Column.borderRadius(10);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('可用语音命令示例：');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.Black);
            Text.margin({ bottom: 10 });
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('• "打开首页" - 返回主页面\n• "打电话给张三" - 拨打电话\n• "现在几点" - 查询时间\n• "今天天气" - 查询天气\n• "我要吃药" - 用药提醒');
            Text.fontSize(16);
            Text.fontColor(Color.Gray);
            Text.lineHeight(24);
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        // 语音命令示例
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.height('100%');
            Column.flexGrow(1);
        }, Column);
        Column.pop();
        Column.pop();
        Scroll.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "STT";
    }
}
registerNamedRoute(() => new STT(undefined, {}), "", { bundleName: "com.example.myapplication", moduleName: "entry", pagePath: "pages/STT", pageFullPath: "entry/src/main/ets/pages/STT", integratedHsp: "false", moduleType: "followWithHap" });
