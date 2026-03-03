if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Login_Params {
    welcomeText?: string;
    buttonText?: string;
    isAccessibilityMode?: boolean;
    uiContext?: UIContext;
    promptAction?: PromptAction;
    ttsManager?: TTSManager;
}
import type { UIContext } from "@ohos:arkui.UIContext";
import type { PromptAction } from "@ohos:arkui.UIContext";
import router from "@ohos:router";
import { TTSManager } from "@normalized:N&&&entry/src/main/ets/service/TTSManager&";
class Login extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__welcomeText = new ObservedPropertySimplePU("欢迎使用语音助手关怀版", this, "welcomeText");
        this.__buttonText = new ObservedPropertySimplePU("点击登录", this, "buttonText");
        this.__isAccessibilityMode = new ObservedPropertySimplePU(true, this, "isAccessibilityMode");
        this.__uiContext = new ObservedPropertyObjectPU(this.getUIContext(), this, "uiContext");
        this.__promptAction = new ObservedPropertyObjectPU(this.uiContext.getPromptAction(), this, "promptAction");
        this.ttsManager = TTSManager.getInstance();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Login_Params) {
        if (params.welcomeText !== undefined) {
            this.welcomeText = params.welcomeText;
        }
        if (params.buttonText !== undefined) {
            this.buttonText = params.buttonText;
        }
        if (params.isAccessibilityMode !== undefined) {
            this.isAccessibilityMode = params.isAccessibilityMode;
        }
        if (params.uiContext !== undefined) {
            this.uiContext = params.uiContext;
        }
        if (params.promptAction !== undefined) {
            this.promptAction = params.promptAction;
        }
        if (params.ttsManager !== undefined) {
            this.ttsManager = params.ttsManager;
        }
    }
    updateStateVars(params: Login_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__welcomeText.purgeDependencyOnElmtId(rmElmtId);
        this.__buttonText.purgeDependencyOnElmtId(rmElmtId);
        this.__isAccessibilityMode.purgeDependencyOnElmtId(rmElmtId);
        this.__uiContext.purgeDependencyOnElmtId(rmElmtId);
        this.__promptAction.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__welcomeText.aboutToBeDeleted();
        this.__buttonText.aboutToBeDeleted();
        this.__isAccessibilityMode.aboutToBeDeleted();
        this.__uiContext.aboutToBeDeleted();
        this.__promptAction.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __welcomeText: ObservedPropertySimplePU<string>;
    get welcomeText() {
        return this.__welcomeText.get();
    }
    set welcomeText(newValue: string) {
        this.__welcomeText.set(newValue);
    }
    private __buttonText: ObservedPropertySimplePU<string>;
    get buttonText() {
        return this.__buttonText.get();
    }
    set buttonText(newValue: string) {
        this.__buttonText.set(newValue);
    }
    private __isAccessibilityMode: ObservedPropertySimplePU<boolean>;
    get isAccessibilityMode() {
        return this.__isAccessibilityMode.get();
    }
    set isAccessibilityMode(newValue: boolean) {
        this.__isAccessibilityMode.set(newValue);
    }
    private __uiContext: ObservedPropertyObjectPU<UIContext>;
    get uiContext() {
        return this.__uiContext.get();
    }
    set uiContext(newValue: UIContext) {
        this.__uiContext.set(newValue);
    }
    private __promptAction: ObservedPropertyObjectPU<PromptAction>;
    get promptAction() {
        return this.__promptAction.get();
    }
    set promptAction(newValue: PromptAction) {
        this.__promptAction.set(newValue);
    }
    // TTS管理器
    private ttsManager: TTSManager;
    aboutToAppear(): void {
        // 页面显示时自动播报欢迎语
        this.speakWelcome();
    }
    // 播报欢迎语
    private speakWelcome(): void {
        if (this.isAccessibilityMode) {
            const fullText = `${this.welcomeText}。${this.buttonText}`;
            this.ttsManager.speak(fullText).then(() => {
                console.info('欢迎语播报完成');
            }).catch((error: Error) => {
                console.error('播报失败:', error.message);
            });
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.height('100%');
            Scroll.width('100%');
            Scroll.backgroundColor('#F5F5F5');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.justifyContent(FlexAlign.Start);
            Column.padding({ left: 20, right: 20, top: 20, bottom: 40 });
            Column.onClick(() => {
                if (this.isAccessibilityMode) {
                    this.speakWelcome();
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部应用标题
            Text.create(this.welcomeText);
            // 顶部应用标题
            Text.fontSize(36);
            // 顶部应用标题
            Text.fontWeight(FontWeight.Bold);
            // 顶部应用标题
            Text.fontColor(Color.Blue);
            // 顶部应用标题
            Text.margin({ top: 80, bottom: 50 });
            // 顶部应用标题
            Text.textAlign(TextAlign.Center);
            // 顶部应用标题
            Text.width('90%');
        }, Text);
        // 顶部应用标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 应用图标
            Image.create({ "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            // 应用图标
            Image.width(150);
            // 应用图标
            Image.height(150);
            // 应用图标
            Image.margin({ bottom: 40 });
            // 应用图标
            Image.borderRadius(75);
            // 应用图标
            Image.border({ width: 4, color: Color.Orange });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 无障碍模式开关
            Row.create();
            // 无障碍模式开关
            Row.margin({ bottom: 40 });
            // 无障碍模式开关
            Row.width('80%');
            // 无障碍模式开关
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('无障碍模式');
            Text.fontSize(24);
            Text.fontColor(Color.Black);
            Text.margin({ right: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.isAccessibilityMode });
            Toggle.onChange((value: boolean) => {
                this.isAccessibilityMode = value;
                if (value) {
                    this.ttsManager.speak('已开启无障碍模式');
                }
            });
        }, Toggle);
        Toggle.pop();
        // 无障碍模式开关
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 登录按钮
            Button.createWithLabel(this.buttonText);
            // 登录按钮
            Button.width('70%');
            // 登录按钮
            Button.height(70);
            // 登录按钮
            Button.fontSize(28);
            // 登录按钮
            Button.fontWeight(FontWeight.Bold);
            // 登录按钮
            Button.backgroundColor(Color.Green);
            // 登录按钮
            Button.borderRadius(35);
            // 登录按钮
            Button.margin({ bottom: 20 });
            // 登录按钮
            Button.onClick(() => {
                this.promptAction.showToast({
                    message: '登录成功，正在跳转...',
                    duration: 1500
                });
                // 播报登录成功
                if (this.isAccessibilityMode) {
                    this.ttsManager.speak('登录成功，即将进入主页面');
                }
                // 延迟跳转，让用户听到提示
                setTimeout(() => {
                    router.pushUrl({
                        url: 'pages/Home'
                    });
                }, 1800);
            });
        }, Button);
        // 登录按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 跳过登录按钮
            Button.createWithLabel('跳过登录');
            // 跳过登录按钮
            Button.width('50%');
            // 跳过登录按钮
            Button.height(50);
            // 跳过登录按钮
            Button.fontSize(20);
            // 跳过登录按钮
            Button.backgroundColor(Color.Transparent);
            // 跳过登录按钮
            Button.fontColor(Color.Gray);
            // 跳过登录按钮
            Button.margin({ top: 20 });
            // 跳过登录按钮
            Button.onClick(() => {
                this.promptAction.showToast({
                    message: '跳过登录，进入主页面',
                    duration: 1500
                });
                if (this.isAccessibilityMode) {
                    this.ttsManager.speak('已跳过登录，进入主页面');
                }
                setTimeout(() => {
                    router.pushUrl({
                        url: 'pages/Home'
                    });
                }, 1800);
            });
        }, Button);
        // 跳过登录按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 使用说明
            Text.create('使用说明：\n1. 开启无障碍模式可获得语音引导\n2. 点击屏幕任何位置可重复播报\n3. 音量键可控制语音播报');
            // 使用说明
            Text.fontSize(18);
            // 使用说明
            Text.fontColor(Color.Gray);
            // 使用说明
            Text.margin({ top: 50 });
            // 使用说明
            Text.width('85%');
            // 使用说明
            Text.textAlign(TextAlign.Start);
            // 使用说明
            Text.lineHeight(28);
        }, Text);
        // 使用说明
        Text.pop();
        Column.pop();
        Scroll.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Login";
    }
}
registerNamedRoute(() => new Login(undefined, {}), "", { bundleName: "com.example.myapplication", moduleName: "entry", pagePath: "pages/Login", pageFullPath: "entry/src/main/ets/pages/Login", integratedHsp: "false", moduleType: "followWithHap" });
