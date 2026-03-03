import { UIContext } from '@kit.ArkUI';
import { PromptAction } from '@kit.ArkUI';
import { router } from '@kit.ArkUI';
import { TTSManager } from '../service/TTSManager';

@Entry
@Component
struct Login {
  @State welcomeText: string = "欢迎使用语音助手关怀版";
  @State buttonText: string = "点击登录";
  @State isAccessibilityMode: boolean = true;
  @State uiContext: UIContext = this.getUIContext();
  @State promptAction: PromptAction = this.uiContext.getPromptAction();

  // TTS管理器
  private ttsManager: TTSManager = TTSManager.getInstance();

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
      }).catch((error: Error) => {  // 明确指定错误类型为 Error
        console.error('播报失败:', error.message);
      });
    }
  }

  build() {
    Scroll(){
      Column() {
        // 顶部应用标题
        Text(this.welcomeText)
          .fontSize(36)
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.Blue)
          .margin({ top: 80, bottom: 50 })
          .textAlign(TextAlign.Center)
          .width('90%')

        // 应用图标
        Image($r('app.media.logo'))
          .width(150)
          .height(150)
          .margin({ bottom: 40 })
          .borderRadius(75)
          .border({ width: 4, color: Color.Orange })

        // 无障碍模式开关
        Row() {
          Text('无障碍模式')
            .fontSize(24)
            .fontColor(Color.Black)
            .margin({ right: 20 })

          Toggle({ type: ToggleType.Switch, isOn: this.isAccessibilityMode })
            .onChange((value: boolean) => {
              this.isAccessibilityMode = value;
              if (value) {
                this.ttsManager.speak('已开启无障碍模式');
              }
            })
        }
        .margin({ bottom: 40 })
        .width('80%')
        .justifyContent(FlexAlign.Center)

        // 登录按钮
        Button(this.buttonText)
          .width('70%')
          .height(70)
          .fontSize(28)
          .fontWeight(FontWeight.Bold)
          .backgroundColor(Color.Green)
          .borderRadius(35)
          .margin({ bottom: 20 })
          .onClick(() => {
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
          })

        // 跳过登录按钮
        Button('跳过登录')
          .width('50%')
          .height(50)
          .fontSize(20)
          .backgroundColor(Color.Transparent)
          .fontColor(Color.Gray)
          .margin({ top: 20 })
          .onClick(() => {
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
          })

        // 使用说明
        Text('使用说明：\n1. 开启无障碍模式可获得语音引导\n2. 点击屏幕任何位置可重复播报\n3. 音量键可控制语音播报')
          .fontSize(18)
          .fontColor(Color.Gray)
          .margin({ top: 50 })
          .width('85%')
          .textAlign(TextAlign.Start)
          .lineHeight(28)
      }
      .width('100%')
      .justifyContent(FlexAlign.Start)
      .padding({ left: 20, right: 20,  top: 20, bottom: 40 })

      // 点击屏幕任意位置重复播报
      .onClick(() => {
        if (this.isAccessibilityMode) {
          this.speakWelcome();
        }
      })
    }
    .height('100%')
    .width('100%')
    .backgroundColor('#F5F5F5')
  }

}