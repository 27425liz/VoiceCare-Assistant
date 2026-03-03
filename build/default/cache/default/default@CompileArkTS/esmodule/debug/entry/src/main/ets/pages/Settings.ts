if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Settings_Params {
    ttsSpeed?: number;
    ttsVolume?: number;
    ttsVoiceType?: number;
    fontSize?: number;
    highContrastMode?: boolean;
    voiceGuidance?: boolean;
    emergencyContacts?: string[];
    newContact?: string;
    ttsManager?: TTSManager;
    promptAction?: PromptAction;
}
import type { PromptAction } from "@ohos:arkui.UIContext";
import router from "@ohos:router";
import { TTSManager } from "@normalized:N&&&entry/src/main/ets/service/TTSManager&";
import { EmergencyHelper } from "@normalized:N&&&entry/src/main/ets/utils/Emergency&";
import type { DialogResponse } from '../dialog';
class Settings extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__ttsSpeed = new ObservedPropertySimplePU(3, this, "ttsSpeed");
        this.__ttsVolume = new ObservedPropertySimplePU(4, this, "ttsVolume");
        this.__ttsVoiceType = new ObservedPropertySimplePU(0, this, "ttsVoiceType");
        this.__fontSize = new ObservedPropertySimplePU(18, this, "fontSize");
        this.__highContrastMode = new ObservedPropertySimplePU(false, this, "highContrastMode");
        this.__voiceGuidance = new ObservedPropertySimplePU(true, this, "voiceGuidance");
        this.__emergencyContacts = new ObservedPropertyObjectPU(['13800138000', '13900139000'], this, "emergencyContacts");
        this.__newContact = new ObservedPropertySimplePU('', this, "newContact");
        this.ttsManager = TTSManager.getInstance();
        this.promptAction = this.getUIContext().getPromptAction();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Settings_Params) {
        if (params.ttsSpeed !== undefined) {
            this.ttsSpeed = params.ttsSpeed;
        }
        if (params.ttsVolume !== undefined) {
            this.ttsVolume = params.ttsVolume;
        }
        if (params.ttsVoiceType !== undefined) {
            this.ttsVoiceType = params.ttsVoiceType;
        }
        if (params.fontSize !== undefined) {
            this.fontSize = params.fontSize;
        }
        if (params.highContrastMode !== undefined) {
            this.highContrastMode = params.highContrastMode;
        }
        if (params.voiceGuidance !== undefined) {
            this.voiceGuidance = params.voiceGuidance;
        }
        if (params.emergencyContacts !== undefined) {
            this.emergencyContacts = params.emergencyContacts;
        }
        if (params.newContact !== undefined) {
            this.newContact = params.newContact;
        }
        if (params.ttsManager !== undefined) {
            this.ttsManager = params.ttsManager;
        }
        if (params.promptAction !== undefined) {
            this.promptAction = params.promptAction;
        }
    }
    updateStateVars(params: Settings_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__ttsSpeed.purgeDependencyOnElmtId(rmElmtId);
        this.__ttsVolume.purgeDependencyOnElmtId(rmElmtId);
        this.__ttsVoiceType.purgeDependencyOnElmtId(rmElmtId);
        this.__fontSize.purgeDependencyOnElmtId(rmElmtId);
        this.__highContrastMode.purgeDependencyOnElmtId(rmElmtId);
        this.__voiceGuidance.purgeDependencyOnElmtId(rmElmtId);
        this.__emergencyContacts.purgeDependencyOnElmtId(rmElmtId);
        this.__newContact.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__ttsSpeed.aboutToBeDeleted();
        this.__ttsVolume.aboutToBeDeleted();
        this.__ttsVoiceType.aboutToBeDeleted();
        this.__fontSize.aboutToBeDeleted();
        this.__highContrastMode.aboutToBeDeleted();
        this.__voiceGuidance.aboutToBeDeleted();
        this.__emergencyContacts.aboutToBeDeleted();
        this.__newContact.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __ttsSpeed: ObservedPropertySimplePU<number>;
    get ttsSpeed() {
        return this.__ttsSpeed.get();
    }
    set ttsSpeed(newValue: number) {
        this.__ttsSpeed.set(newValue);
    }
    private __ttsVolume: ObservedPropertySimplePU<number>;
    get ttsVolume() {
        return this.__ttsVolume.get();
    }
    set ttsVolume(newValue: number) {
        this.__ttsVolume.set(newValue);
    }
    private __ttsVoiceType: ObservedPropertySimplePU<number>;
    get ttsVoiceType() {
        return this.__ttsVoiceType.get();
    }
    set ttsVoiceType(newValue: number) {
        this.__ttsVoiceType.set(newValue);
    }
    private __fontSize: ObservedPropertySimplePU<number>;
    get fontSize() {
        return this.__fontSize.get();
    }
    set fontSize(newValue: number) {
        this.__fontSize.set(newValue);
    }
    private __highContrastMode: ObservedPropertySimplePU<boolean>;
    get highContrastMode() {
        return this.__highContrastMode.get();
    }
    set highContrastMode(newValue: boolean) {
        this.__highContrastMode.set(newValue);
    }
    private __voiceGuidance: ObservedPropertySimplePU<boolean>;
    get voiceGuidance() {
        return this.__voiceGuidance.get();
    }
    set voiceGuidance(newValue: boolean) {
        this.__voiceGuidance.set(newValue);
    }
    private __emergencyContacts: ObservedPropertyObjectPU<string[]>;
    get emergencyContacts() {
        return this.__emergencyContacts.get();
    }
    set emergencyContacts(newValue: string[]) {
        this.__emergencyContacts.set(newValue);
    }
    private __newContact: ObservedPropertySimplePU<string>;
    get newContact() {
        return this.__newContact.get();
    }
    set newContact(newValue: string) {
        this.__newContact.set(newValue);
    }
    private ttsManager: TTSManager;
    private promptAction: PromptAction;
    // 加载用户设置
    // 保存用户设置
    private saveSettings(): void {
        this.ttsManager.speak('设置已保存');
        this.promptAction.showToast({
            message: '设置已保存',
            duration: 2000
        });
    }
    // 添加紧急联系人
    private addEmergencyContact(): void {
        if (this.newContact.trim() && /^1[3-9]\d{9}$/.test(this.newContact)) {
            const newContacts = [...this.emergencyContacts, this.newContact];
            this.emergencyContacts.push(this.newContact);
            this.newContact = '';
            this.ttsManager.speak('紧急联系人已添加');
        }
        else {
            this.ttsManager.speak('请输入有效的手机号码');
        }
    }
    // 测试语音设置
    private testVoiceSettings(): void {
        const testText = '这是语音测试，当前语速和音量设置';
        this.ttsManager.speak(testText);
    }
    // 重置所有设置
    private resetSettings(): void {
        this.promptAction.showDialog({
            title: '确认重置',
            message: '确定要重置所有设置为默认值吗？',
            buttons: [
                {
                    text: '确认',
                    color: '#ff8ff687'
                },
                {
                    text: '取消',
                    color: '#ff000000'
                }
            ]
        }).then((value: DialogResponse) => {
            if (value.index === 0) { // 确认按钮是第一个
                this.ttsSpeed = 3;
                this.ttsVolume = 4;
                this.ttsVoiceType = 0;
                this.fontSize = 18;
                this.highContrastMode = false;
                this.voiceGuidance = true;
                this.ttsManager.speak('设置已重置为默认值');
            }
            else if (value.index === 1) { // 取消按钮是第二个
                this.ttsManager.speak('已取消重置');
            }
        }).catch((error: Error) => {
            console.error('对话框错误:', error.message);
            this.ttsManager.speak('对话框显示失败');
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.backgroundColor(this.highContrastMode ? Color.Black : '#F5F5F5');
            Scroll.scrollBar(BarState.Auto);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Center);
            Column.padding({ left: 10, right: 10, top: 20, bottom: 40 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题
            Text.create('设置');
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
            Scroll.create();
            Scroll.width('100%');
            Scroll.scrollable(ScrollDirection.Vertical);
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 语音设置
            Column.create();
            // 语音设置
            Column.width('95%');
            // 语音设置
            Column.padding(20);
            // 语音设置
            Column.backgroundColor(Color.White);
            // 语音设置
            Column.borderRadius(15);
            // 语音设置
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('语音设置');
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.Black);
            Text.margin({ bottom: 15 });
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 语速调节
            Row.create();
            // 语速调节
            Row.margin({ bottom: 15 });
            // 语速调节
            Row.width('100%');
            // 语速调节
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('语速');
            Text.fontSize(20);
            Text.fontColor(Color.Gray);
            Text.width(80);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Slider.create({
                value: this.ttsSpeed,
                min: 1,
                max: 5,
                step: 1,
                style: SliderStyle.OutSet
            });
            Slider.blockColor(Color.Blue);
            Slider.trackColor(Color.Gray);
            Slider.selectedColor(Color.Blue);
            Slider.width('60%');
            Slider.onChange((value: number) => {
                this.ttsSpeed = Math.round(value);
            });
        }, Slider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.ttsSpeed}档`);
            Text.fontSize(18);
            Text.fontColor(Color.Black);
            Text.margin({ left: 10 });
            Text.width(60);
        }, Text);
        Text.pop();
        // 语速调节
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 音量调节
            Row.create();
            // 音量调节
            Row.margin({ bottom: 15 });
            // 音量调节
            Row.width('100%');
            // 音量调节
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('音量');
            Text.fontSize(20);
            Text.fontColor(Color.Gray);
            Text.width(80);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Slider.create({
                value: this.ttsVolume,
                min: 1,
                max: 5,
                step: 1,
                style: SliderStyle.OutSet
            });
            Slider.blockColor(Color.Blue);
            Slider.trackColor(Color.Gray);
            Slider.selectedColor(Color.Blue);
            Slider.width('60%');
            Slider.onChange((value: number) => {
                this.ttsVolume = Math.round(value);
            });
        }, Slider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.ttsVolume}档`);
            Text.fontSize(18);
            Text.fontColor(Color.Black);
            Text.margin({ left: 10 });
            Text.width(60);
        }, Text);
        Text.pop();
        // 音量调节
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 音色选择
            Row.create();
            // 音色选择
            Row.margin({ bottom: 20 });
            // 音色选择
            Row.width('100%');
            // 音色选择
            Row.justifyContent(FlexAlign.Start);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('音色');
            Text.fontSize(20);
            Text.fontColor(Color.Gray);
            Text.width(80);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Radio.create({ value: 'female', group: 'voice' });
            Radio.checked(this.ttsVoiceType === 0);
            Radio.onChange((checked: boolean) => {
                if (checked) {
                    this.ttsVoiceType = 0;
                }
            });
        }, Radio);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('女声');
            Text.fontSize(18);
            Text.fontColor(Color.Black);
            Text.margin({ right: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Radio.create({ value: 'male', group: 'voice' });
            Radio.checked(this.ttsVoiceType === 1);
            Radio.onChange((checked: boolean) => {
                if (checked) {
                    this.ttsVoiceType = 1;
                }
            });
        }, Radio);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('男声');
            Text.fontSize(18);
            Text.fontColor(Color.Black);
        }, Text);
        Text.pop();
        // 音色选择
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 测试语音按钮
            Button.createWithLabel('测试语音设置');
            // 测试语音按钮
            Button.width('100%');
            // 测试语音按钮
            Button.height(50);
            // 测试语音按钮
            Button.fontSize(18);
            // 测试语音按钮
            Button.backgroundColor(Color.Blue);
            // 测试语音按钮
            Button.fontColor(Color.White);
            // 测试语音按钮
            Button.borderRadius(10);
            // 测试语音按钮
            Button.onClick(() => {
                this.testVoiceSettings();
            });
        }, Button);
        // 测试语音按钮
        Button.pop();
        // 语音设置
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 无障碍设置
            Column.create();
            // 无障碍设置
            Column.width('95%');
            // 无障碍设置
            Column.padding(20);
            // 无障碍设置
            Column.backgroundColor(Color.White);
            // 无障碍设置
            Column.borderRadius(15);
            // 无障碍设置
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('无障碍设置');
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.Black);
            Text.margin({ bottom: 15 });
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 字体大小
            Row.create();
            // 字体大小
            Row.margin({ bottom: 15 });
            // 字体大小
            Row.width('100%');
            // 字体大小
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('字体大小');
            Text.fontSize(20);
            Text.fontColor(Color.Gray);
            Text.width(120);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Slider.create({
                value: this.fontSize,
                min: 16,
                max: 24,
                step: 2,
                style: SliderStyle.OutSet
            });
            Slider.blockColor(Color.Green);
            Slider.trackColor(Color.Gray);
            Slider.selectedColor(Color.Green);
            Slider.width('50%');
            Slider.onChange((value: number) => {
                this.fontSize = Math.round(value / 2) * 2;
            });
        }, Slider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.fontSize}sp`);
            Text.fontSize(this.fontSize);
            Text.fontColor(Color.Black);
            Text.margin({ left: 10 });
        }, Text);
        Text.pop();
        // 字体大小
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 高对比度模式
            Row.create();
            // 高对比度模式
            Row.margin({ bottom: 15 });
            // 高对比度模式
            Row.width('100%');
            // 高对比度模式
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('高对比度模式');
            Text.fontSize(20);
            Text.fontColor(Color.Gray);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.highContrastMode });
            Toggle.onChange((value: boolean) => {
                this.highContrastMode = value;
                if (value) {
                    this.ttsManager.speak('已开启高对比度模式');
                }
            });
        }, Toggle);
        Toggle.pop();
        // 高对比度模式
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 语音引导
            Row.create();
            // 语音引导
            Row.margin({ bottom: 20 });
            // 语音引导
            Row.width('100%');
            // 语音引导
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('语音引导');
            Text.fontSize(20);
            Text.fontColor(Color.Gray);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.voiceGuidance });
            Toggle.onChange((value: boolean) => {
                this.voiceGuidance = value;
                if (value) {
                    this.ttsManager.speak('已开启语音引导');
                }
                else {
                    this.ttsManager.speak('已关闭语音引导');
                }
            });
        }, Toggle);
        Toggle.pop();
        // 语音引导
        Row.pop();
        // 无障碍设置
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 紧急联系人管理
            Column.create();
            // 紧急联系人管理
            Column.width('95%');
            // 紧急联系人管理
            Column.padding(20);
            // 紧急联系人管理
            Column.backgroundColor(Color.White);
            // 紧急联系人管理
            Column.borderRadius(15);
            // 紧急联系人管理
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('紧急联系人');
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.Black);
            Text.margin({ bottom: 15 });
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 添加联系人
            Row.create();
            // 添加联系人
            Row.margin({ bottom: 15 });
            // 添加联系人
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '输入手机号', text: this.newContact });
            TextInput.width('70%');
            TextInput.height(45);
            TextInput.fontSize(18);
            TextInput.border({ width: 1, color: Color.Gray });
            TextInput.onChange((value: string) => {
                this.newContact = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('添加');
            Button.width('25%');
            Button.height(45);
            Button.fontSize(18);
            Button.backgroundColor(Color.Green);
            Button.fontColor(Color.White);
            Button.margin({ left: 10 });
            Button.onClick(() => {
                this.addEmergencyContact();
            });
        }, Button);
        Button.pop();
        // 添加联系人
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 联系人列表
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const contact = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.padding(10);
                    Row.border({ width: 1, color: '#EEEEEE' });
                    Row.borderRadius(5);
                    Row.margin({ bottom: 5 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${index + 1}. ${contact}`);
                    Text.fontSize(18);
                    Text.fontColor(Color.Black);
                    Text.flexGrow(1);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel('呼叫');
                    Button.fontSize(14);
                    Button.padding({ left: 10, right: 10 });
                    Button.backgroundColor(Color.Blue);
                    Button.fontColor(Color.White);
                    Button.margin({ right: 5 });
                    Button.onClick(() => {
                        EmergencyHelper.emergencyCall();
                    });
                }, Button);
                Button.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel('删除');
                    Button.fontSize(14);
                    Button.padding({ left: 10, right: 10 });
                    Button.backgroundColor(Color.Red);
                    Button.fontColor(Color.White);
                    Button.onClick(() => {
                        this.emergencyContacts.splice(index, 1);
                        this.ttsManager.speak('已删除紧急联系人');
                    });
                }, Button);
                Button.pop();
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, this.emergencyContacts, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        // 联系人列表
        ForEach.pop();
        // 紧急联系人管理
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 操作按钮
            Column.create();
            // 操作按钮
            Column.width('95%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.margin({ bottom: 15 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('保存设置');
            Button.width('48%');
            Button.height(55);
            Button.fontSize(20);
            Button.backgroundColor(Color.Green);
            Button.fontColor(Color.White);
            Button.borderRadius(10);
            Button.onClick(() => {
                this.saveSettings();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('重置设置');
            Button.width('48%');
            Button.height(55);
            Button.fontSize(20);
            Button.backgroundColor(Color.Orange);
            Button.fontColor(Color.White);
            Button.borderRadius(10);
            Button.margin({ left: 10 });
            Button.onClick(() => {
                this.resetSettings();
            });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('返回首页');
            Button.width('100%');
            Button.height(55);
            Button.fontSize(20);
            Button.backgroundColor(Color.Blue);
            Button.fontColor(Color.White);
            Button.borderRadius(10);
            Button.onClick(() => {
                this.ttsManager.speak('返回首页').then(() => {
                    router.pushUrl({
                        url: 'pages/Home'
                    });
                });
            });
        }, Button);
        Button.pop();
        // 操作按钮
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 关于信息
            Column.create();
            // 关于信息
            Column.width('95%');
            // 关于信息
            Column.padding(20);
            // 关于信息
            Column.backgroundColor('#F0F8FF');
            // 关于信息
            Column.borderRadius(15);
            // 关于信息
            Column.margin({ top: 20, bottom: 40 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('关于语音助手关怀版');
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.Black);
            Text.margin({ bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('版本: 1.0.0\n开发者: 关怀科技团队\n联系方式: 400-123-4567\n更新日期: 2024年1月');
            Text.fontSize(16);
            Text.fontColor(Color.Gray);
            Text.lineHeight(24);
            Text.width('100%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        // 关于信息
        Column.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
        Scroll.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Settings";
    }
}
registerNamedRoute(() => new Settings(undefined, {}), "", { bundleName: "com.example.myapplication", moduleName: "entry", pagePath: "pages/Settings", pageFullPath: "entry/src/main/ets/pages/Settings", integratedHsp: "false", moduleType: "followWithHap" });
