
import { PromptAction } from '@kit.ArkUI';
import { router } from '@kit.ArkUI';
import { TTSManager } from '../service/TTSManager';
// import { UserConfig, UserSettings } from '../model/UserConfig';
import { EmergencyHelper } from '../utils/Emergency';
import { DialogResponse } from '../dialog';
import { storage } from '../utils/LocalStorage';

@Entry
@Component
struct Settings {
  @State ttsSpeed: number = 3;
  @State ttsVolume: number = 4;
  @State ttsVoiceType: number = 0;
  @State fontSize: number = 18;
  @State highContrastMode: boolean = false;
  @State voiceGuidance: boolean = true;
  @State emergencyContacts: string[] = ['13800138000', '13900139000'];
  @State newContact: string = '';

  private ttsManager: TTSManager = TTSManager.getInstance();
  private promptAction: PromptAction = this.getUIContext().getPromptAction();

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
    } else {
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
      if (value.index === 0) {  // 确认按钮是第一个
        this.ttsSpeed = 3;
        this.ttsVolume = 4;
        this.ttsVoiceType = 0;
        this.fontSize = 18;
        this.highContrastMode = false;
        this.voiceGuidance = true;
        this.ttsManager.speak('设置已重置为默认值');
      } else if (value.index === 1) {  // 取消按钮是第二个
        this.ttsManager.speak('已取消重置');
      }
    }).catch((error: Error) => {
      console.error('对话框错误:', error.message);
      this.ttsManager.speak('对话框显示失败');
    });
  }

  build() {
    Scroll() {
      Column() {
        // 标题
        Text('设置')
          .fontSize(30)
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.Blue)
          .margin({ top: 20, bottom: 20 })

        Scroll() {
          Column() {
            // 语音设置
            Column() {
              Text('语音设置')
                .fontSize(24)
                .fontWeight(FontWeight.Bold)
                .fontColor(Color.Black)
                .margin({ bottom: 15 })
                .width('100%')
                .textAlign(TextAlign.Start)

              // 语速调节
              Row() {
                Text('语速')
                  .fontSize(20)
                  .fontColor(Color.Gray)
                  .width(80)

                Slider({
                  value: this.ttsSpeed,
                  min: 1,
                  max: 5,
                  step: 1,
                  style: SliderStyle.OutSet
                })
                  .blockColor(Color.Blue)
                  .trackColor(Color.Gray)
                  .selectedColor(Color.Blue)
                  .width('60%')
                  .onChange((value: number) => {
                    this.ttsSpeed = Math.round(value);
                  })

                Text(`${this.ttsSpeed}档`)
                  .fontSize(18)
                  .fontColor(Color.Black)
                  .margin({ left: 10 })
                  .width(60)
              }
              .margin({ bottom: 15 })
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)

              // 音量调节
              Row() {
                Text('音量')
                  .fontSize(20)
                  .fontColor(Color.Gray)
                  .width(80)

                Slider({
                  value: this.ttsVolume,
                  min: 1,
                  max: 5,
                  step: 1,
                  style: SliderStyle.OutSet
                })
                  .blockColor(Color.Blue)
                  .trackColor(Color.Gray)
                  .selectedColor(Color.Blue)
                  .width('60%')
                  .onChange((value: number) => {
                    this.ttsVolume = Math.round(value);
                  })

                Text(`${this.ttsVolume}档`)
                  .fontSize(18)
                  .fontColor(Color.Black)
                  .margin({ left: 10 })
                  .width(60)
              }
              .margin({ bottom: 15 })
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)

              // 音色选择
              Row() {
                Text('音色')
                  .fontSize(20)
                  .fontColor(Color.Gray)
                  .width(80)

                Radio({ value: 'female', group: 'voice' })
                  .checked(this.ttsVoiceType === 0)
                  .onChange((checked: boolean) => {
                    if (checked) {
                      this.ttsVoiceType = 0;
                    }
                  })

                Text('女声')
                  .fontSize(18)
                  .fontColor(Color.Black)
                  .margin({ right: 20 })

                Radio({ value: 'male', group: 'voice' })
                  .checked(this.ttsVoiceType === 1)
                  .onChange((checked: boolean) => {
                    if (checked) {
                      this.ttsVoiceType = 1;
                    }
                  })

                Text('男声')
                  .fontSize(18)
                  .fontColor(Color.Black)
              }
              .margin({ bottom: 20 })
              .width('100%')
              .justifyContent(FlexAlign.Start)

              // 测试语音按钮
              Button('测试语音设置')
                .width('100%')
                .height(50)
                .fontSize(18)
                .backgroundColor(Color.Blue)
                .fontColor(Color.White)
                .borderRadius(10)
                .onClick(() => {
                  this.testVoiceSettings();
                })
            }
            .width('95%')
            .padding(20)
            .backgroundColor(Color.White)
            .borderRadius(15)
            .margin({ bottom: 20 })

            // 无障碍设置
            Column() {
              Text('无障碍设置')
                .fontSize(24)
                .fontWeight(FontWeight.Bold)
                .fontColor(Color.Black)
                .margin({ bottom: 15 })
                .width('100%')
                .textAlign(TextAlign.Start)

              // 字体大小
              Row() {
                Text('字体大小')
                  .fontSize(20)
                  .fontColor(Color.Gray)
                  .width(120)

                Slider({
                  value: this.fontSize,
                  min: 16,
                  max: 24,
                  step: 2,
                  style: SliderStyle.OutSet
                })
                  .blockColor(Color.Green)
                  .trackColor(Color.Gray)
                  .selectedColor(Color.Green)
                  .width('50%')
                  .onChange((value: number) => {
                    this.fontSize = Math.round(value / 2) * 2;
                  })

                Text(`${this.fontSize}sp`)
                  .fontSize(this.fontSize)
                  .fontColor(Color.Black)
                  .margin({ left: 10 })
              }
              .margin({ bottom: 15 })
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)

              // 高对比度模式
              Row() {
                Text('高对比度模式')
                  .fontSize(20)
                  .fontColor(Color.Gray)

                Toggle({ type: ToggleType.Switch, isOn: this.highContrastMode })
                  .onChange((value: boolean) => {
                    this.highContrastMode = value;
                    if (value) {
                      this.ttsManager.speak('已开启高对比度模式');
                    }
                  })
              }
              .margin({ bottom: 15 })
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)

              // 语音引导
              Row() {
                Text('语音引导')
                  .fontSize(20)
                  .fontColor(Color.Gray)

                Toggle({ type: ToggleType.Switch, isOn: this.voiceGuidance })
                  .onChange((value: boolean) => {
                    this.voiceGuidance = value;
                    if (value) {
                      this.ttsManager.speak('已开启语音引导');
                    } else {
                      this.ttsManager.speak('已关闭语音引导');
                    }
                  })
              }
              .margin({ bottom: 20 })
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)
            }
            .width('95%')
            .padding(20)
            .backgroundColor(Color.White)
            .borderRadius(15)
            .margin({ bottom: 20 })

            // 紧急联系人管理
            Column() {
              Text('紧急联系人')
                .fontSize(24)
                .fontWeight(FontWeight.Bold)
                .fontColor(Color.Black)
                .margin({ bottom: 15 })
                .width('100%')
                .textAlign(TextAlign.Start)

              // 添加联系人
              Row() {
                TextInput({ placeholder: '输入手机号', text: this.newContact })
                  .width('70%')
                  .height(45)
                  .fontSize(18)
                  .border({ width: 1, color: Color.Gray })
                  .onChange((value: string) => {
                    this.newContact = value;
                  })

                Button('添加')
                  .width('25%')
                  .height(45)
                  .fontSize(18)
                  .backgroundColor(Color.Green)
                  .fontColor(Color.White)
                  .margin({ left: 10 })
                  .onClick(() => {
                    this.addEmergencyContact();
                  })
              }
              .margin({ bottom: 15 })
              .width('100%')

              // 联系人列表
              ForEach(this.emergencyContacts, (contact: string, index: number) => {
                Row() {
                  Text(`${index + 1}. ${contact}`)
                    .fontSize(18)
                    .fontColor(Color.Black)
                    .flexGrow(1)

                  Button('呼叫')
                    .fontSize(14)
                    .padding({ left: 10, right: 10 })
                    .backgroundColor(Color.Blue)
                    .fontColor(Color.White)
                    .margin({ right: 5 })
                    .onClick(() => {
                      EmergencyHelper.emergencyCall();
                    })

                  Button('删除')
                    .fontSize(14)
                    .padding({ left: 10, right: 10 })
                    .backgroundColor(Color.Red)
                    .fontColor(Color.White)
                    .onClick(() => {
                      this.emergencyContacts.splice(index, 1);
                      this.ttsManager.speak('已删除紧急联系人');
                    })
                }
                .width('100%')
                .padding(10)
                .border({ width: 1, color: '#EEEEEE' })
                .borderRadius(5)
                .margin({ bottom: 5 })
              })
            }
            .width('95%')
            .padding(20)
            .backgroundColor(Color.White)
            .borderRadius(15)
            .margin({ bottom: 20 })

            // 操作按钮
            Column() {
              Row() {
                Button('保存设置')
                  .width('48%')
                  .height(55)
                  .fontSize(20)
                  .backgroundColor(Color.Green)
                  .fontColor(Color.White)
                  .borderRadius(10)
                  .onClick(() => {
                    this.saveSettings();
                  })

                Button('重置设置')
                  .width('48%')
                  .height(55)
                  .fontSize(20)
                  .backgroundColor(Color.Orange)
                  .fontColor(Color.White)
                  .borderRadius(10)
                  .margin({ left: 10 })
                  .onClick(() => {
                    this.resetSettings();
                  })
              }
              .margin({ bottom: 15 })

              Button('返回首页')
                .width('100%')
                .height(55)
                .fontSize(20)
                .backgroundColor(Color.Blue)
                .fontColor(Color.White)
                .borderRadius(10)
                .onClick(() => {
                  this.ttsManager.speak('返回首页').then(() => {
                    router.pushUrl({
                      url: 'pages/Home'
                    });
                  });
                })
            }
            .width('95%')

            // 关于信息
            Column() {
              Text('关于语音助手关怀版')
                .fontSize(22)
                .fontWeight(FontWeight.Bold)
                .fontColor(Color.Black)
                .margin({ bottom: 10 })

              Text('版本: 1.0.0\n开发者: 关怀科技团队\n联系方式: 400-123-4567\n更新日期: 2024年1月')
                .fontSize(16)
                .fontColor(Color.Gray)
                .lineHeight(24)
                .width('100%')
                .textAlign(TextAlign.Start)
            }
            .width('95%')
            .padding(20)
            .backgroundColor('#F0F8FF')
            .borderRadius(15)
            .margin({ top: 20, bottom: 40 })
          }
          .width('100%')
          .alignItems(HorizontalAlign.Center)
        }
        .width('100%')
        .scrollable(ScrollDirection.Vertical)
        .scrollBar(BarState.Off)
      }
      .width('100%')
      .alignItems(HorizontalAlign.Center)
      .padding({ left: 10, right: 10 , top: 20, bottom: 40})
    }
    .width('100%')
    .height('100%')
    .backgroundColor(this.highContrastMode ? Color.Black : '#F5F5F5')
    .scrollBar(BarState.Auto)
  }
}