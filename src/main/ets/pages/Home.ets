import { UIContext } from '@kit.ArkUI';
import { PromptAction } from '@kit.ArkUI';
import { router } from '@kit.ArkUI';
import { textToSpeech } from '@kit.CoreSpeechKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { EmergencyHelper } from '../utils/Emergency';
import { storage } from '../utils/LocalStorage';

interface DialogResponse {
  index: number;
}

interface TabItem {
  title: string;
}

// 创建全局TTS对象
let tts: textToSpeech.TextToSpeechEngine;
let engineCreated: boolean = false;

@Entry(storage)
@Component
struct Home {
  @State currentTime: string = '00:00';
  @State weatherInfo: string = '晴，25℃';
  @State dateInfo: string = '2024年1月1日 星期一';
  @State isEmergencyMode: boolean = false;
  @State promptAction: PromptAction = this.getUIContext().getPromptAction();
  @State showHelpDialog: boolean = false;
  @State currentTab: number = 0; // 当前选中的选项卡索引
  @State originalText: string = '请输入要播报的文本内容';

  @LocalStorageProp('highContrastMode') highContrastMode: boolean = true;
  @LocalStorageProp('voiceGuidance') voiceGuidance: boolean = true;
  @LocalStorageProp('emergencyContacts') emergencyContacts: string[] = ['13800138000', '13900139000'];

  private timer: number = 0;

  // 选项卡配置 - 删除表情图标，只保留文字
  private tabs: TabItem[] = [
    { title: '快捷短语' },
    { title: '语音识别' },
    { title: '文本播报' },
    { title: '设置' },
    { title: '帮助' }
  ];

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
      "style": "interaction-broadcast", //交互广播
      "locate": "CN", //位置
      "name": "EngineName" //引擎名称
    };

    let initParamInfo: textToSpeech.CreateEngineParams = {
      language: 'zh-CN',
      person: 0, //女生音色
      online: 1, //离线合成
      extraParams: extraParam
    };

    try {
      textToSpeech.createEngine(initParamInfo, (err: BusinessError, textTS: textToSpeech.TextToSpeechEngine) => {
        if (!err) {
          console.info('创建引擎成功');
          tts = textTS;
          engineCreated = true;
        } else {
          console.error(`code: ${err.code}, message: ${err.message}`);
        }
      });
    } catch (error) {
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
        if (errorCode === 1002300007) engineCreated = false;
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
      requestId: '123456' + Date.now(), //时间戳拼接，防止id重复
      extraParams: extraParam
    };

    try {
      tts.speak(text, speakPar);
    } catch (error) {
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
    } catch (err) {
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

  build() {
    Column() {
      // 顶部信息栏 - 完全不变
      Column() {
        Text('语音助手关怀版')
          .fontSize(28)
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.Blue)
          .margin({ bottom: 10 })

        Text(this.dateInfo)
          .fontSize(22)
          .fontColor(Color.Gray)
          .margin({ bottom: 5 })

        Row() {
          Text(this.currentTime)
            .fontSize(48)
            .fontWeight(FontWeight.Bold)
            .fontColor(Color.Black)
            .margin({ right: 20 })

          Column() {
            Text('天气')
              .fontSize(16)
              .fontColor(Color.Gray)
            Text(this.weatherInfo)
              .fontSize(20)
              .fontColor(Color.Black)
          }
        }
      }
      .width('100%')
      .padding(20)
      .backgroundColor(Color.White)
      .borderRadius(20)
      .margin({ top: 10, bottom: 30 })

      // 主体区域：左右分栏
      Row({ space: 0 }) {
        // 左侧选项卡区域（宽度35%）
        this.buildLeftTabs()

        // 右侧内容区域（宽度65%）
        this.buildRightContent()
      }
      .height('68%')
      .width('100%')
      .backgroundColor(Color.White)
      .borderRadius(20)

    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
    .onClick(() => {
      this.speakHomeInfo();
    })
  }

  // 构建左侧选项卡
  @Builder
  buildLeftTabs() {
    Column({ space: 5 }) {
      // 用户头像和问候语
      Column() {
        Image($r('app.media.logo'))
          .width(70)
          .height(70)
          .borderRadius(35)
          .objectFit(ImageFit.Contain)

        Text('您好，请选择功能')
          .fontSize(22)
          .fontColor('#666666')
          .margin({ top: 10 })
      }
      .padding({ top: 20, bottom: 20 })
      .backgroundColor('#F8F9FA')
      .width('100%')
      .alignItems(HorizontalAlign.Center)

      // 选项卡列表 - 删除图标，只显示文字
      List({ space: 5 }) {
        ForEach(this.tabs, (item: TabItem, index: number) => {
          ListItem() {
            this.buildTabItem(item, index)
          }
          .borderRadius(10)
          .backgroundColor(this.currentTab === index ? '#1890FF' : Color.Transparent)
        }, (item: TabItem) => item.title)
      }
      .height('70%')
      .width('100%')
      .listDirection(Axis.Vertical)
      .divider({ strokeWidth: 0 })
    }
    .width('35%') // 稍微加宽确保文字完全显示
    .height('100%')
    .backgroundColor('#F8F9FA')
    .padding({ right: 5 })
  }

  // 构建单个选项卡项 - 简化，只显示文字
  @Builder
  buildTabItem(tab: TabItem, index: number) {
    Row() {
      // 标题 - 大字体，居中对齐
      Text(tab.title)
        .fontSize(26)
        .fontColor(this.currentTab === index ? Color.White : '#333333')
        .fontWeight(FontWeight.Medium)
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
        .textAlign(TextAlign.Center)
    }
    .padding({ left: 10, right: 10, top: 25, bottom: 25 })
    .width('100%')
    .justifyContent(FlexAlign.Center)
    .onClick(() => {
      this.currentTab = index;
      // 切换时播报选项卡名称
      this.speakText(`进入${tab.title}功能`);
    })
  }

  // 构建右侧内容区域 - 添加Scroll
  @Builder
  buildRightContent() {
    Scroll() {
      Column({ space: 0 }) {
        // 根据当前选中的选项卡显示不同内容
        if (this.currentTab === 0) {
          this.buildQuickPhrasesContent() // 快捷短语
        } else if (this.currentTab === 1) {
          this.buildSTTContent() // 语音识别
        } else if (this.currentTab === 2) {
          this.buildTTSContent() // 文本播报
        } else if (this.currentTab === 3) {
          this.buildSettingsContent() // 设置
        } else {
          this.buildHelpContent() // 帮助
        }
      }
      .width('100%')
    }
    .width('65%')
    .height('100%')
    .backgroundColor(Color.White)
    .padding(20)
  }

  // 快捷短语内容 - 一行只放一个，大按钮
  @Builder
  buildQuickPhrasesContent() {
    Column({ space: 15 }) {
      Text('快捷短语')
        .fontSize(32)
        .fontWeight(FontWeight.Bold)
        .fontColor(Color.Black)
        .width('100%')
        .textAlign(TextAlign.Start)
        .margin({ bottom: 20 })

      // 每个短语单独一行，大按钮
      Column({ space: 15 }) {
        // 现在几点
        Button('现在几点')
          .width('90%')
          .height(70)
          .fontSize(28)
          .fontWeight(FontWeight.Medium)
          .backgroundColor('#4CAF50')
          .fontColor(Color.White)
          .onClick(() => {
            this.speakText(`现在是${this.currentTime}`);
          })

        // 今天日期
        Button('今天日期')
          .width('90%')
          .height(70)
          .fontSize(28)
          .fontWeight(FontWeight.Medium)
          .backgroundColor('#2196F3')
          .fontColor(Color.White)
          .onClick(() => {
            this.speakText(`今天是${this.dateInfo}`);
          })

        // 拨打电话
        Button('拨打电话')
          .width('90%')
          .height(70)
          .fontSize(28)
          .fontWeight(FontWeight.Medium)
          .backgroundColor('#FF9800')
          .fontColor(Color.White)
          .onClick(() => {
            this.speakText('请在设置中设置联系人电话');
          })

        // 我要吃药
        Button('我要吃药')
          .width('90%')
          .height(70)
          .fontSize(28)
          .fontWeight(FontWeight.Medium)
          .backgroundColor('#9C27B0')
          .fontColor(Color.White)
          .onClick(() => {
            this.speakText('记得按时吃药，注意药品说明');
          })

        // 阅读新闻
        Button('阅读新闻')
          .width('90%')
          .height(70)
          .fontSize(28)
          .fontWeight(FontWeight.Medium)
          .backgroundColor('#607D8B')
          .fontColor(Color.White)
          .onClick(() => {
            this.speakText('今天的重要新闻：本地天气晴好，适宜外出活动');
          })

        // 停止播报
        Button('停止播报')
          .width('90%')
          .height(70)
          .fontSize(28)
          .fontWeight(FontWeight.Medium)
          .backgroundColor('#795548')
          .fontColor(Color.White)
          .onClick(() => {
            this.stopSpeak();
          })
      }
      .width('100%')
      .alignItems(HorizontalAlign.Center)

      // 紧急呼救按钮 - 放在快捷短语页面
      Button('紧急呼救')
        .width('90%')
        .height(80)
        .fontSize(30) // 放大字体
        .fontWeight(FontWeight.Bold)
        .backgroundColor(this.isEmergencyMode ? Color.Red : '#FF5252')
        .fontColor(Color.White)
        .borderRadius(40)
        .margin({ top: 30, bottom: 20 })
        .onClick(() => {
          EmergencyHelper.emergencyCall();
          EmergencyHelper.sendEmergencySMS();
          this.speakText('已发送紧急求助信息，正在联系家人');
          this.promptAction.showToast({
            message: '紧急求助信息已发送',
            duration: 3000
          });
        })
    }
    .width('100%')
    .alignItems(HorizontalAlign.Center)
  }

  // 语音识别内容 - 大按钮，点击跳转
  @Builder
  buildSTTContent() {
    Column({ space: 25 }) {
      Text('语音识别')
        .fontSize(32)
        .fontWeight(FontWeight.Bold)
        .fontColor(Color.Black)
        .width('100%')
        .textAlign(TextAlign.Start)

      Text('点击下方按钮开始语音识别')
        .fontSize(24)
        .fontColor(Color.Gray)
        .width('100%')
        .textAlign(TextAlign.Start)
        .margin({ bottom: 40 })

      // 大图标按钮 - 点击跳转到详细页面
      Column() {
        Image($r('app.media.STT'))
          .width(120)
          .height(120)
          .margin({ bottom: 20 })

        Text('开始语音识别')
          .fontSize(28)
          .fontColor(Color.Black)
          .fontWeight(FontWeight.Medium)
      }
      .width('100%')
      .height(250)
      .justifyContent(FlexAlign.Center)
      .alignItems(HorizontalAlign.Center)
      .backgroundColor('#E3F2FD')
      .borderRadius(25)
      .onClick(() => {
        this.navigateTo('STT', '语音识别功能');
      })

      Text('功能说明：通过说话控制应用，支持以下命令：\n• "现在几点" - 播报时间\n• "今天日期" - 播报日期\n• "我要吃药" - 提醒服药\n• "阅读新闻" - 播报新闻')
        .fontSize(22)
        .fontColor('#666666')
        .width('100%')
        .textAlign(TextAlign.Start)
        .margin({ top: 40 })
    }
    .width('100%')
    .justifyContent(FlexAlign.Center)
    .padding({ bottom: 30 })
  }

  // 文本播报内容 - 大按钮，点击跳转（恢复原来的风格）
  @Builder
  buildTTSContent() {
    Column({ space: 25 }) {
      Text('文本播报')
        .fontSize(32)
        .fontWeight(FontWeight.Bold)
        .fontColor(Color.Black)
        .width('100%')
        .textAlign(TextAlign.Start)

      Text('点击下方按钮进入文本播报功能')
        .fontSize(24)
        .fontColor(Color.Gray)
        .width('100%')
        .textAlign(TextAlign.Start)
        .margin({ bottom: 40 })

      // 大图标按钮 - 点击跳转到详细页面
      Column() {
        Image($r('app.media.TTS'))
          .width(120)
          .height(120)
          .margin({ bottom: 20 })

        Text('开始文本播报')
          .fontSize(28)
          .fontColor(Color.Black)
          .fontWeight(FontWeight.Medium)
      }
      .width('100%')
      .height(250)
      .justifyContent(FlexAlign.Center)
      .alignItems(HorizontalAlign.Center)
      .backgroundColor('#E8F5E9')
      .borderRadius(25)
      .onClick(() => {
        this.navigateTo('TTS', '文本播报功能');
      })

      Text('功能说明：将文字转换为语音播放，支持：\n• 输入任意文字进行播报\n• 调整语速、音量和音色\n• 保存常用播报内容\n• 定时播报提醒')
        .fontSize(22)
        .fontColor('#666666')
        .width('100%')
        .textAlign(TextAlign.Start)
        .margin({ top: 40 })
    }
    .width('100%')
    .justifyContent(FlexAlign.Center)
    .padding({ bottom: 30 })
  }

  // 设置内容 - 大按钮，点击跳转（恢复原来的风格）
  @Builder
  buildSettingsContent() {
    Column({ space: 25 }) {
      Text('设置')
        .fontSize(32)
        .fontWeight(FontWeight.Bold)
        .fontColor(Color.Black)
        .width('100%')
        .textAlign(TextAlign.Start)

      Text('点击下方按钮进入详细设置')
        .fontSize(24)
        .fontColor(Color.Gray)
        .width('100%')
        .textAlign(TextAlign.Start)
        .margin({ bottom: 40 })

      // 大图标按钮 - 点击跳转到详细页面
      Column() {
        Image($r('app.media.settings'))
          .width(120)
          .height(120)
          .margin({ bottom: 20 })

        Text('进入详细设置')
          .fontSize(28)
          .fontColor(Color.Black)
          .fontWeight(FontWeight.Medium)
      }
      .width('100%')
      .height(250)
      .justifyContent(FlexAlign.Center)
      .alignItems(HorizontalAlign.Center)
      .backgroundColor('#FFF3E0')
      .borderRadius(25)
      .onClick(() => {
        this.navigateTo('Settings', '设置功能');
      })

      Text('设置项包括：\n• 语音参数：语速、音量、音色\n• 显示设置：字体大小、高对比度\n• 无障碍：语音引导、触摸反馈\n• 紧急联系人：添加/修改联系人\n• 快捷短语：管理常用短语')
        .fontSize(22)
        .fontColor('#666666')
        .width('100%')
        .textAlign(TextAlign.Start)
        .margin({ top: 40 })
    }
    .width('100%')
    .justifyContent(FlexAlign.Center)
    .padding({ bottom: 30 })
  }

  // 帮助内容 - 大按钮，点击弹出帮助对话框
  @Builder
  buildHelpContent() {
    Column({ space: 25 }) {
      Text('使用帮助')
        .fontSize(32)
        .fontWeight(FontWeight.Bold)
        .fontColor(Color.Black)
        .width('100%')
        .textAlign(TextAlign.Start)

      Text('点击下方按钮查看使用帮助')
        .fontSize(24)
        .fontColor(Color.Gray)
        .width('100%')
        .textAlign(TextAlign.Start)
        .margin({ bottom: 40 })

      // 大图标按钮 - 点击弹出帮助对话框
      Column() {
        Image($r('app.media.help'))
          .width(120)
          .height(120)
          .margin({ bottom: 20 })

        Text('查看详细帮助')
          .fontSize(28)
          .fontColor(Color.Black)
          .fontWeight(FontWeight.Medium)
      }
      .width('100%')
      .height(250)
      .justifyContent(FlexAlign.Center)
      .alignItems(HorizontalAlign.Center)
      .backgroundColor('#F3E5F5')
      .borderRadius(25)
      .onClick(() => {
        this.showHelp();
      })

      Text('主要功能说明：\n• 文本播报：将文字转换为语音播放\n• 语音识别：通过说话控制应用\n• 紧急呼救：一键联系紧急联系人\n• 快捷短语：快速播报常用语句\n• 设置：调整各项参数')
        .fontSize(22)
        .fontColor('#666666')
        .width('100%')
        .textAlign(TextAlign.Start)
        .margin({ top: 40 })
    }
    .width('100%')
    .justifyContent(FlexAlign.Center)
    .padding({ bottom: 30 })
  }
}