if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Home_Params {
    currentTime?: string;
    weatherInfo?: string;
    dateInfo?: string;
    isEmergencyMode?: boolean;
    promptAction?: PromptAction;
    showHelpDialog?: boolean;
    currentTab?: number;
    originalText?: string;
    highContrastMode?: boolean;
    voiceGuidance?: boolean;
    emergencyContacts?: string[];
    timer?: number;
    tabs?: TabItem[];
}
import type { PromptAction } from "@ohos:arkui.UIContext";
import router from "@ohos:router";
import textToSpeech from "@hms:ai.textToSpeech";
import type { BusinessError } from "@ohos:base";
import { EmergencyHelper } from "@normalized:N&&&entry/src/main/ets/utils/Emergency&";
import { storage } from "@normalized:N&&&entry/src/main/ets/utils/LocalStorage&";
interface DialogResponse {
    index: number;
}
interface TabItem {
    title: string;
}
// 创建全局TTS对象
let tts: textToSpeech.TextToSpeechEngine;
let engineCreated: boolean = false;
class Home extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentTime = new ObservedPropertySimplePU('00:00', this, "currentTime");
        this.__weatherInfo = new ObservedPropertySimplePU('晴，25℃', this, "weatherInfo");
        this.__dateInfo = new ObservedPropertySimplePU('2024年1月1日 星期一', this, "dateInfo");
        this.__isEmergencyMode = new ObservedPropertySimplePU(false, this, "isEmergencyMode");
        this.__promptAction = new ObservedPropertyObjectPU(this.getUIContext().getPromptAction(), this, "promptAction");
        this.__showHelpDialog = new ObservedPropertySimplePU(false, this, "showHelpDialog");
        this.__currentTab = new ObservedPropertySimplePU(0, this, "currentTab");
        this.__originalText = new ObservedPropertySimplePU('请输入要播报的文本内容', this, "originalText");
        this.timer = 0;
        this.tabs = [
            { title: '快捷短语' },
            { title: '语音识别' },
            { title: '文本播报' },
            { title: '设置' },
            { title: '帮助' }
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Home_Params) {
        if (params.currentTime !== undefined) {
            this.currentTime = params.currentTime;
        }
        if (params.weatherInfo !== undefined) {
            this.weatherInfo = params.weatherInfo;
        }
        if (params.dateInfo !== undefined) {
            this.dateInfo = params.dateInfo;
        }
        if (params.isEmergencyMode !== undefined) {
            this.isEmergencyMode = params.isEmergencyMode;
        }
        if (params.promptAction !== undefined) {
            this.promptAction = params.promptAction;
        }
        if (params.showHelpDialog !== undefined) {
            this.showHelpDialog = params.showHelpDialog;
        }
        if (params.currentTab !== undefined) {
            this.currentTab = params.currentTab;
        }
        if (params.originalText !== undefined) {
            this.originalText = params.originalText;
        }
        if (params.timer !== undefined) {
            this.timer = params.timer;
        }
        if (params.tabs !== undefined) {
            this.tabs = params.tabs;
        }
    }
    updateStateVars(params: Home_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentTime.purgeDependencyOnElmtId(rmElmtId);
        this.__weatherInfo.purgeDependencyOnElmtId(rmElmtId);
        this.__dateInfo.purgeDependencyOnElmtId(rmElmtId);
        this.__isEmergencyMode.purgeDependencyOnElmtId(rmElmtId);
        this.__promptAction.purgeDependencyOnElmtId(rmElmtId);
        this.__showHelpDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__currentTab.purgeDependencyOnElmtId(rmElmtId);
        this.__originalText.purgeDependencyOnElmtId(rmElmtId);
        this.__highContrastMode.purgeDependencyOnElmtId(rmElmtId);
        this.__voiceGuidance.purgeDependencyOnElmtId(rmElmtId);
        this.__emergencyContacts.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentTime.aboutToBeDeleted();
        this.__weatherInfo.aboutToBeDeleted();
        this.__dateInfo.aboutToBeDeleted();
        this.__isEmergencyMode.aboutToBeDeleted();
        this.__promptAction.aboutToBeDeleted();
        this.__showHelpDialog.aboutToBeDeleted();
        this.__currentTab.aboutToBeDeleted();
        this.__originalText.aboutToBeDeleted();
        this.__highContrastMode.aboutToBeDeleted();
        this.__voiceGuidance.aboutToBeDeleted();
        this.__emergencyContacts.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentTime: ObservedPropertySimplePU<string>;
    get currentTime() {
        return this.__currentTime.get();
    }
    set currentTime(newValue: string) {
        this.__currentTime.set(newValue);
    }
    private __weatherInfo: ObservedPropertySimplePU<string>;
    get weatherInfo() {
        return this.__weatherInfo.get();
    }
    set weatherInfo(newValue: string) {
        this.__weatherInfo.set(newValue);
    }
    private __dateInfo: ObservedPropertySimplePU<string>;
    get dateInfo() {
        return this.__dateInfo.get();
    }
    set dateInfo(newValue: string) {
        this.__dateInfo.set(newValue);
    }
    private __isEmergencyMode: ObservedPropertySimplePU<boolean>;
    get isEmergencyMode() {
        return this.__isEmergencyMode.get();
    }
    set isEmergencyMode(newValue: boolean) {
        this.__isEmergencyMode.set(newValue);
    }
    private __promptAction: ObservedPropertyObjectPU<PromptAction>;
    get promptAction() {
        return this.__promptAction.get();
    }
    set promptAction(newValue: PromptAction) {
        this.__promptAction.set(newValue);
    }
    private __showHelpDialog: ObservedPropertySimplePU<boolean>;
    get showHelpDialog() {
        return this.__showHelpDialog.get();
    }
    set showHelpDialog(newValue: boolean) {
        this.__showHelpDialog.set(newValue);
    }
    private __currentTab: ObservedPropertySimplePU<number>; // 当前选中的选项卡索引
    get currentTab() {
        return this.__currentTab.get();
    }
    set currentTab(newValue: number) {
        this.__currentTab.set(newValue);
    }
    private __originalText: ObservedPropertySimplePU<string>;
    get originalText() {
        return this.__originalText.get();
    }
    set originalText(newValue: string) {
        this.__originalText.set(newValue);
    }
    private __highContrastMode: ObservedPropertyAbstractPU<boolean> = this.createLocalStorageProp<boolean>('highContrastMode', true, "highContrastMode");
    get highContrastMode() {
        return this.__highContrastMode.get();
    }
    set highContrastMode(newValue: boolean) {
        this.__highContrastMode.set(newValue);
    }
    private __voiceGuidance: ObservedPropertyAbstractPU<boolean> = this.createLocalStorageProp<boolean>('voiceGuidance', true, "voiceGuidance");
    get voiceGuidance() {
        return this.__voiceGuidance.get();
    }
    set voiceGuidance(newValue: boolean) {
        this.__voiceGuidance.set(newValue);
    }
    private __emergencyContacts: ObservedPropertyAbstractPU<string[]> = this.createLocalStorageProp<string[]>('emergencyContacts', ['13800138000', '13900139000'], "emergencyContacts");
    get emergencyContacts() {
        return this.__emergencyContacts.get();
    }
    set emergencyContacts(newValue: string[]) {
        this.__emergencyContacts.set(newValue);
    }
    private timer: number;
    // 选项卡配置 - 删除表情图标，只保留文字
    private tabs: TabItem[];
    aboutToAppear(): void {
        this.updateTime();
        this.timer = setInterval(() => {
            this.updateTime();
        }, 60000); // 每分钟更新一次
        // 页面加载时播报
        this.speakHomeInfo();
        // 自动创建TTS引擎
        this.createTtsEngine();
    }
    aboutToDisappear(): void {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    // 更新时间
    private updateTime(): void {
        const now = new Date();
        this.currentTime = now.getHours().toString().padStart(2, '0') + ':' +
            now.getMinutes().toString().padStart(2, '0');
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        const weekday = weekdays[now.getDay()];
        this.dateInfo = `${year}年${month}月${day}日 星期${weekday}`;
    }
    // 播报首页信息
    private speakHomeInfo(): void {
        const info = `现在是${this.currentTime}，${this.dateInfo}，天气${this.weatherInfo}。请选择您需要的功能。`;
        this.speakText(info);
    }
    // 创建TTS引擎（参照TTS.txt）
    private createTtsEngine(): void {
        if (engineCreated) {
            return;
        }
        let extraParam: Record<string, Object> = {
            "style": "interaction-broadcast",
            "locate": "CN",
            "name": "EngineName" //引擎名称
        };
        let initParamInfo: textToSpeech.CreateEngineParams = {
            language: 'zh-CN',
            person: 0,
            online: 1,
            extraParams: extraParam
        };
        try {
            textToSpeech.createEngine(initParamInfo, (err: BusinessError, textTS: textToSpeech.TextToSpeechEngine) => {
                if (!err) {
                    console.info('创建引擎成功');
                    tts = textTS;
                    engineCreated = true;
                }
                else {
                    console.error(`code: ${err.code}, message: ${err.message}`);
                }
            });
        }
        catch (error) {
            const businessError = error as BusinessError;
            console.error(`code: ${businessError.code}, message: ${businessError.message}`);
        }
    }
    // 播报文本（参照TTS.txt）
    private speakText(text: string): void {
        if (!engineCreated || !tts) {
            return;
        }
        let speakListener: textToSpeech.SpeakListener = {
            // 开始播报回调
            onStart(requestID: string, response: textToSpeech.StartResponse) {
                console.info(`开始播报，requestID:${requestID}，response：${JSON.stringify(response)}`);
            },
            // 合成完成及播报完成
            onComplete(requestID: string, response: textToSpeech.CompleteResponse) {
                console.info(`合成完成及播报完成，requestID:${requestID}，response：${JSON.stringify(response)}`);
            },
            // 停止播报
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
        // 设置回调
        tts.setListener(speakListener);
        // 设置播报相关参数
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
        try {
            tts.speak(text, speakPar);
        }
        catch (error) {
            const businessError = error as BusinessError;
            console.error(`code: ${businessError.code}, msg: ${businessError.message}`);
        }
    }
    // 停止播报
    private stopSpeak(): void {
        if (!engineCreated || !tts) {
            return;
        }
        try {
            let isBusy: boolean = tts.isBusy();
            if (isBusy) {
                tts.stop();
            }
        }
        catch (err) {
            const businessError = err as BusinessError;
            console.error(`code: ${businessError.code}, message: ${businessError.message}`);
        }
    }
    // 导航到其他页面
    private navigateTo(page: string, pageName: string): void {
        this.speakText(`进入${pageName}`);
        setTimeout(() => {
            router.pushUrl({
                url: `pages/${page}`
            });
        }, 1000);
    }
    private showHelp(): void {
        this.speakText('打开使用帮助');
        this.promptAction.showDialog({
            title: '使用帮助',
            message: '主要功能说明：\n\n' +
                '1. 文本播报：将文字转换为语音播放\n' +
                '2. 语音识别：通过说话控制应用\n' +
                '3. 紧急呼救：一键联系紧急联系人\n' +
                '4. 设置：调整语音参数和显示设置\n\n' +
                '操作指南：\n' +
                '• 点击屏幕任意位置可重复播报\n' +
                '• 音量键可控制语音播报音量\n' +
                '• 开启无障碍模式获得完整语音引导',
            buttons: [
                {
                    text: '知道了',
                    color: '#ff81e989'
                }
            ]
        }).then((value: DialogResponse) => {
            this.speakText('已关闭帮助');
        }).catch((error: Error) => {
            console.error('帮助对话框错误:', error.message);
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
            Column.onClick(() => {
                this.speakHomeInfo();
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部信息栏 - 完全不变
            Column.create();
            // 顶部信息栏 - 完全不变
            Column.width('100%');
            // 顶部信息栏 - 完全不变
            Column.padding(20);
            // 顶部信息栏 - 完全不变
            Column.backgroundColor(Color.White);
            // 顶部信息栏 - 完全不变
            Column.borderRadius(20);
            // 顶部信息栏 - 完全不变
            Column.margin({ top: 10, bottom: 30 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('语音助手关怀版');
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.Blue);
            Text.margin({ bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.dateInfo);
            Text.fontSize(22);
            Text.fontColor(Color.Gray);
            Text.margin({ bottom: 5 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.currentTime);
            Text.fontSize(48);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.Black);
            Text.margin({ right: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('天气');
            Text.fontSize(16);
            Text.fontColor(Color.Gray);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.weatherInfo);
            Text.fontSize(20);
            Text.fontColor(Color.Black);
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        // 顶部信息栏 - 完全不变
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主体区域：左右分栏
            Row.create({ space: 0 });
            // 主体区域：左右分栏
            Row.height('68%');
            // 主体区域：左右分栏
            Row.width('100%');
            // 主体区域：左右分栏
            Row.backgroundColor(Color.White);
            // 主体区域：左右分栏
            Row.borderRadius(20);
        }, Row);
        // 左侧选项卡区域（宽度35%）
        this.buildLeftTabs.bind(this)();
        // 右侧内容区域（宽度65%）
        this.buildRightContent.bind(this)();
        // 主体区域：左右分栏
        Row.pop();
        Column.pop();
    }
    // 构建左侧选项卡
    buildLeftTabs(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 5 });
            Column.width('35%');
            Column.height('100%');
            Column.backgroundColor('#F8F9FA');
            Column.padding({ right: 5 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户头像和问候语
            Column.create();
            // 用户头像和问候语
            Column.padding({ top: 20, bottom: 20 });
            // 用户头像和问候语
            Column.backgroundColor('#F8F9FA');
            // 用户头像和问候语
            Column.width('100%');
            // 用户头像和问候语
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            Image.width(70);
            Image.height(70);
            Image.borderRadius(35);
            Image.objectFit(ImageFit.Contain);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('您好，请选择功能');
            Text.fontSize(22);
            Text.fontColor('#666666');
            Text.margin({ top: 10 });
        }, Text);
        Text.pop();
        // 用户头像和问候语
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 选项卡列表 - 删除图标，只显示文字
            List.create({ space: 5 });
            // 选项卡列表 - 删除图标，只显示文字
            List.height('70%');
            // 选项卡列表 - 删除图标，只显示文字
            List.width('100%');
            // 选项卡列表 - 删除图标，只显示文字
            List.listDirection(Axis.Vertical);
            // 选项卡列表 - 删除图标，只显示文字
            List.divider({ strokeWidth: 0 });
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
                        ListItem.borderRadius(10);
                        ListItem.backgroundColor(this.currentTab === index ? '#1890FF' : Color.Transparent);
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.buildTabItem.bind(this)(item, index);
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.tabs, forEachItemGenFunction, (item: TabItem) => item.title, true, false);
        }, ForEach);
        ForEach.pop();
        // 选项卡列表 - 删除图标，只显示文字
        List.pop();
        Column.pop();
    }
    // 构建单个选项卡项 - 简化，只显示文字
    buildTabItem(tab: TabItem, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({ left: 10, right: 10, top: 25, bottom: 25 });
            Row.width('100%');
            Row.justifyContent(FlexAlign.Center);
            Row.onClick(() => {
                this.currentTab = index;
                // 切换时播报选项卡名称
                this.speakText(`进入${tab.title}功能`);
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题 - 大字体，居中对齐
            Text.create(tab.title);
            // 标题 - 大字体，居中对齐
            Text.fontSize(26);
            // 标题 - 大字体，居中对齐
            Text.fontColor(this.currentTab === index ? Color.White : '#333333');
            // 标题 - 大字体，居中对齐
            Text.fontWeight(FontWeight.Medium);
            // 标题 - 大字体，居中对齐
            Text.maxLines(1);
            // 标题 - 大字体，居中对齐
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            // 标题 - 大字体，居中对齐
            Text.textAlign(TextAlign.Center);
        }, Text);
        // 标题 - 大字体，居中对齐
        Text.pop();
        Row.pop();
    }
    // 构建右侧内容区域 - 添加Scroll
    buildRightContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('65%');
            Scroll.height('100%');
            Scroll.backgroundColor(Color.White);
            Scroll.padding(20);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 0 });
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 根据当前选中的选项卡显示不同内容
            if (this.currentTab === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildQuickPhrasesContent.bind(this)() // 快捷短语
                    ;
                });
            }
            else if (this.currentTab === 1) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.buildSTTContent.bind(this)() // 语音识别
                    ;
                });
            }
            else if (this.currentTab === 2) {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.buildTTSContent.bind(this)() // 文本播报
                    ;
                });
            }
            else if (this.currentTab === 3) {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.buildSettingsContent.bind(this)() // 设置
                    ;
                });
            }
            else {
                this.ifElseBranchUpdateFunction(4, () => {
                    this.buildHelpContent.bind(this)() // 帮助
                    ;
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Scroll.pop();
    }
    // 快捷短语内容 - 一行只放一个，大按钮
    buildQuickPhrasesContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 15 });
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('快捷短语');
            Text.fontSize(32);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.Black);
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
            Text.margin({ bottom: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 每个短语单独一行，大按钮
            Column.create({ space: 15 });
            // 每个短语单独一行，大按钮
            Column.width('100%');
            // 每个短语单独一行，大按钮
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 现在几点
            Button.createWithLabel('现在几点');
            // 现在几点
            Button.width('90%');
            // 现在几点
            Button.height(70);
            // 现在几点
            Button.fontSize(28);
            // 现在几点
            Button.fontWeight(FontWeight.Medium);
            // 现在几点
            Button.backgroundColor('#4CAF50');
            // 现在几点
            Button.fontColor(Color.White);
            // 现在几点
            Button.onClick(() => {
                this.speakText(`现在是${this.currentTime}`);
            });
        }, Button);
        // 现在几点
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 今天日期
            Button.createWithLabel('今天日期');
            // 今天日期
            Button.width('90%');
            // 今天日期
            Button.height(70);
            // 今天日期
            Button.fontSize(28);
            // 今天日期
            Button.fontWeight(FontWeight.Medium);
            // 今天日期
            Button.backgroundColor('#2196F3');
            // 今天日期
            Button.fontColor(Color.White);
            // 今天日期
            Button.onClick(() => {
                this.speakText(`今天是${this.dateInfo}`);
            });
        }, Button);
        // 今天日期
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 拨打电话
            Button.createWithLabel('拨打电话');
            // 拨打电话
            Button.width('90%');
            // 拨打电话
            Button.height(70);
            // 拨打电话
            Button.fontSize(28);
            // 拨打电话
            Button.fontWeight(FontWeight.Medium);
            // 拨打电话
            Button.backgroundColor('#FF9800');
            // 拨打电话
            Button.fontColor(Color.White);
            // 拨打电话
            Button.onClick(() => {
                this.speakText('请在设置中设置联系人电话');
            });
        }, Button);
        // 拨打电话
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 我要吃药
            Button.createWithLabel('我要吃药');
            // 我要吃药
            Button.width('90%');
            // 我要吃药
            Button.height(70);
            // 我要吃药
            Button.fontSize(28);
            // 我要吃药
            Button.fontWeight(FontWeight.Medium);
            // 我要吃药
            Button.backgroundColor('#9C27B0');
            // 我要吃药
            Button.fontColor(Color.White);
            // 我要吃药
            Button.onClick(() => {
                this.speakText('记得按时吃药，注意药品说明');
            });
        }, Button);
        // 我要吃药
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 阅读新闻
            Button.createWithLabel('阅读新闻');
            // 阅读新闻
            Button.width('90%');
            // 阅读新闻
            Button.height(70);
            // 阅读新闻
            Button.fontSize(28);
            // 阅读新闻
            Button.fontWeight(FontWeight.Medium);
            // 阅读新闻
            Button.backgroundColor('#607D8B');
            // 阅读新闻
            Button.fontColor(Color.White);
            // 阅读新闻
            Button.onClick(() => {
                this.speakText('今天的重要新闻：本地天气晴好，适宜外出活动');
            });
        }, Button);
        // 阅读新闻
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 停止播报
            Button.createWithLabel('停止播报');
            // 停止播报
            Button.width('90%');
            // 停止播报
            Button.height(70);
            // 停止播报
            Button.fontSize(28);
            // 停止播报
            Button.fontWeight(FontWeight.Medium);
            // 停止播报
            Button.backgroundColor('#795548');
            // 停止播报
            Button.fontColor(Color.White);
            // 停止播报
            Button.onClick(() => {
                this.stopSpeak();
            });
        }, Button);
        // 停止播报
        Button.pop();
        // 每个短语单独一行，大按钮
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 紧急呼救按钮 - 放在快捷短语页面
            Button.createWithLabel('紧急呼救');
            // 紧急呼救按钮 - 放在快捷短语页面
            Button.width('90%');
            // 紧急呼救按钮 - 放在快捷短语页面
            Button.height(80);
            // 紧急呼救按钮 - 放在快捷短语页面
            Button.fontSize(30);
            // 紧急呼救按钮 - 放在快捷短语页面
            Button.fontWeight(FontWeight.Bold);
            // 紧急呼救按钮 - 放在快捷短语页面
            Button.backgroundColor(this.isEmergencyMode ? Color.Red : '#FF5252');
            // 紧急呼救按钮 - 放在快捷短语页面
            Button.fontColor(Color.White);
            // 紧急呼救按钮 - 放在快捷短语页面
            Button.borderRadius(40);
            // 紧急呼救按钮 - 放在快捷短语页面
            Button.margin({ top: 30, bottom: 20 });
            // 紧急呼救按钮 - 放在快捷短语页面
            Button.onClick(() => {
                EmergencyHelper.emergencyCall();
                EmergencyHelper.sendEmergencySMS();
                this.speakText('已发送紧急求助信息，正在联系家人');
                this.promptAction.showToast({
                    message: '紧急求助信息已发送',
                    duration: 3000
                });
            });
        }, Button);
        // 紧急呼救按钮 - 放在快捷短语页面
        Button.pop();
        Column.pop();
    }
    // 语音识别内容 - 大按钮，点击跳转
    buildSTTContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 25 });
            Column.width('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.padding({ bottom: 30 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('语音识别');
            Text.fontSize(32);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.Black);
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('点击下方按钮开始语音识别');
            Text.fontSize(24);
            Text.fontColor(Color.Gray);
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
            Text.margin({ bottom: 40 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 大图标按钮 - 点击跳转到详细页面
            Column.create();
            // 大图标按钮 - 点击跳转到详细页面
            Column.width('100%');
            // 大图标按钮 - 点击跳转到详细页面
            Column.height(250);
            // 大图标按钮 - 点击跳转到详细页面
            Column.justifyContent(FlexAlign.Center);
            // 大图标按钮 - 点击跳转到详细页面
            Column.alignItems(HorizontalAlign.Center);
            // 大图标按钮 - 点击跳转到详细页面
            Column.backgroundColor('#E3F2FD');
            // 大图标按钮 - 点击跳转到详细页面
            Column.borderRadius(25);
            // 大图标按钮 - 点击跳转到详细页面
            Column.onClick(() => {
                this.navigateTo('STT', '语音识别功能');
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777225, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            Image.width(120);
            Image.height(120);
            Image.margin({ bottom: 20 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('开始语音识别');
            Text.fontSize(28);
            Text.fontColor(Color.Black);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        // 大图标按钮 - 点击跳转到详细页面
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('功能说明：通过说话控制应用，支持以下命令：\n• "现在几点" - 播报时间\n• "今天日期" - 播报日期\n• "我要吃药" - 提醒服药\n• "阅读新闻" - 播报新闻');
            Text.fontSize(22);
            Text.fontColor('#666666');
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
            Text.margin({ top: 40 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    // 文本播报内容 - 大按钮，点击跳转（恢复原来的风格）
    buildTTSContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 25 });
            Column.width('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.padding({ bottom: 30 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('文本播报');
            Text.fontSize(32);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.Black);
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('点击下方按钮进入文本播报功能');
            Text.fontSize(24);
            Text.fontColor(Color.Gray);
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
            Text.margin({ bottom: 40 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 大图标按钮 - 点击跳转到详细页面
            Column.create();
            // 大图标按钮 - 点击跳转到详细页面
            Column.width('100%');
            // 大图标按钮 - 点击跳转到详细页面
            Column.height(250);
            // 大图标按钮 - 点击跳转到详细页面
            Column.justifyContent(FlexAlign.Center);
            // 大图标按钮 - 点击跳转到详细页面
            Column.alignItems(HorizontalAlign.Center);
            // 大图标按钮 - 点击跳转到详细页面
            Column.backgroundColor('#E8F5E9');
            // 大图标按钮 - 点击跳转到详细页面
            Column.borderRadius(25);
            // 大图标按钮 - 点击跳转到详细页面
            Column.onClick(() => {
                this.navigateTo('TTS', '文本播报功能');
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777226, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            Image.width(120);
            Image.height(120);
            Image.margin({ bottom: 20 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('开始文本播报');
            Text.fontSize(28);
            Text.fontColor(Color.Black);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        // 大图标按钮 - 点击跳转到详细页面
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('功能说明：将文字转换为语音播放，支持：\n• 输入任意文字进行播报\n• 调整语速、音量和音色\n• 保存常用播报内容\n• 定时播报提醒');
            Text.fontSize(22);
            Text.fontColor('#666666');
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
            Text.margin({ top: 40 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    // 设置内容 - 大按钮，点击跳转（恢复原来的风格）
    buildSettingsContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 25 });
            Column.width('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.padding({ bottom: 30 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('设置');
            Text.fontSize(32);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.Black);
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('点击下方按钮进入详细设置');
            Text.fontSize(24);
            Text.fontColor(Color.Gray);
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
            Text.margin({ bottom: 40 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 大图标按钮 - 点击跳转到详细页面
            Column.create();
            // 大图标按钮 - 点击跳转到详细页面
            Column.width('100%');
            // 大图标按钮 - 点击跳转到详细页面
            Column.height(250);
            // 大图标按钮 - 点击跳转到详细页面
            Column.justifyContent(FlexAlign.Center);
            // 大图标按钮 - 点击跳转到详细页面
            Column.alignItems(HorizontalAlign.Center);
            // 大图标按钮 - 点击跳转到详细页面
            Column.backgroundColor('#FFF3E0');
            // 大图标按钮 - 点击跳转到详细页面
            Column.borderRadius(25);
            // 大图标按钮 - 点击跳转到详细页面
            Column.onClick(() => {
                this.navigateTo('Settings', '设置功能');
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777229, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            Image.width(120);
            Image.height(120);
            Image.margin({ bottom: 20 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('进入详细设置');
            Text.fontSize(28);
            Text.fontColor(Color.Black);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        // 大图标按钮 - 点击跳转到详细页面
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('设置项包括：\n• 语音参数：语速、音量、音色\n• 显示设置：字体大小、高对比度\n• 无障碍：语音引导、触摸反馈\n• 紧急联系人：添加/修改联系人\n• 快捷短语：管理常用短语');
            Text.fontSize(22);
            Text.fontColor('#666666');
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
            Text.margin({ top: 40 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    // 帮助内容 - 大按钮，点击弹出帮助对话框
    buildHelpContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 25 });
            Column.width('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.padding({ bottom: 30 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('使用帮助');
            Text.fontSize(32);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.Black);
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('点击下方按钮查看使用帮助');
            Text.fontSize(24);
            Text.fontColor(Color.Gray);
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
            Text.margin({ bottom: 40 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 大图标按钮 - 点击弹出帮助对话框
            Column.create();
            // 大图标按钮 - 点击弹出帮助对话框
            Column.width('100%');
            // 大图标按钮 - 点击弹出帮助对话框
            Column.height(250);
            // 大图标按钮 - 点击弹出帮助对话框
            Column.justifyContent(FlexAlign.Center);
            // 大图标按钮 - 点击弹出帮助对话框
            Column.alignItems(HorizontalAlign.Center);
            // 大图标按钮 - 点击弹出帮助对话框
            Column.backgroundColor('#F3E5F5');
            // 大图标按钮 - 点击弹出帮助对话框
            Column.borderRadius(25);
            // 大图标按钮 - 点击弹出帮助对话框
            Column.onClick(() => {
                this.showHelp();
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777227, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            Image.width(120);
            Image.height(120);
            Image.margin({ bottom: 20 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('查看详细帮助');
            Text.fontSize(28);
            Text.fontColor(Color.Black);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        // 大图标按钮 - 点击弹出帮助对话框
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('主要功能说明：\n• 文本播报：将文字转换为语音播放\n• 语音识别：通过说话控制应用\n• 紧急呼救：一键联系紧急联系人\n• 快捷短语：快速播报常用语句\n• 设置：调整各项参数');
            Text.fontSize(22);
            Text.fontColor('#666666');
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
            Text.margin({ top: 40 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Home";
    }
}
if (storage && storage.routeName != undefined && storage.storage != undefined) {
    registerNamedRoute(() => new Home(undefined, {}, storage.useSharedStorage ? LocalStorage.getShared() : storage.storage), storage.routeName, { bundleName: "com.example.myapplication", moduleName: "entry", pagePath: "pages/Home", pageFullPath: "entry/src/main/ets/pages/Home", integratedHsp: "false", moduleType: "followWithHap" });
}
else if (storage && storage.routeName != undefined && storage.storage == undefined) {
    registerNamedRoute(() => new Home(undefined, {}, storage.useSharedStorage ? LocalStorage.getShared() : storage.storage), storage.routeName, { bundleName: "com.example.myapplication", moduleName: "entry", pagePath: "pages/Home", pageFullPath: "entry/src/main/ets/pages/Home", integratedHsp: "false", moduleType: "followWithHap" });
}
else if (storage && storage.routeName == undefined && storage.storage != undefined) {
    registerNamedRoute(() => new Home(undefined, {}, storage.useSharedStorage ? LocalStorage.getShared() : storage.storage), "", { bundleName: "com.example.myapplication", moduleName: "entry", pagePath: "pages/Home", pageFullPath: "entry/src/main/ets/pages/Home", integratedHsp: "false", moduleType: "followWithHap" });
}
else if (storage && storage.useSharedStorage != undefined) {
    registerNamedRoute(() => new Home(undefined, {}, storage.useSharedStorage ? LocalStorage.getShared() : undefined), "", { bundleName: "com.example.myapplication", moduleName: "entry", pagePath: "pages/Home", pageFullPath: "entry/src/main/ets/pages/Home", integratedHsp: "false", moduleType: "followWithHap" });
}
else {
    registerNamedRoute(() => new Home(undefined, {}, storage), "", { bundleName: "com.example.myapplication", moduleName: "entry", pagePath: "pages/Home", pageFullPath: "entry/src/main/ets/pages/Home", integratedHsp: "false", moduleType: "followWithHap" });
}
