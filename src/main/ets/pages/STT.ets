import { UIContext } from '@kit.ArkUI';
import { PromptAction } from '@kit.ArkUI';
import { router } from '@kit.ArkUI';
import { TTSManager } from '../service/TTSManager';
import { STTManager } from '../service/STTManager';

@Entry
@Component
struct STT {
  @State recognizedText: string = '点击下方按钮开始说话';
  @State isListening: boolean = false;
  @State commandResult: string = '';
  @State historyList: string[] = [
    '今天天气不错',
    '帮我打电话给儿子',
    '现在几点钟了'
  ];
  @State promptAction: PromptAction = this.getUIContext().getPromptAction();

  private ttsManager: TTSManager = TTSManager.getInstance();
  private sttManager: STTManager = STTManager.getInstance();

  aboutToAppear(): void {
    this.ttsManager.speak('语音识别功能，点击麦克风按钮开始说话');
  }

  // 开始/停止语音识别
  private toggleListening(): void {
    if (!this.isListening) {
      this.startListening();
    } else {
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
    }).catch((error:Error) => {
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

  build() {
    Scroll() {
      Column() {
        // 标题
        Text('语音识别')
          .fontSize(30)
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.Blue)
          .margin({ top: 20, bottom: 20 })

        // 状态指示
        Row() {
          Text('状态：')
            .fontSize(20)
            .fontColor(Color.Gray)

          Text(this.isListening ? '聆听中...' : '待命')
            .fontSize(20)
            .fontColor(this.isListening ? Color.Red : Color.Green)
            .margin({ left: 10 })
        }
        .margin({ bottom: 20 })
        .width('90%')
        .justifyContent(FlexAlign.Start)

        // 识别结果显示框
        Text(this.recognizedText)
          .fontSize(22)
          .fontColor(Color.Black)
          .width('90%')
          .height(150)
          .padding(15)
          .backgroundColor(Color.White)
          .border({ width: 2, color: Color.Blue, style: BorderStyle.Solid })
          .borderRadius(10)
          .textAlign(TextAlign.Start)
          .margin({ bottom: 20 })

        // 命令执行结果
        if (this.commandResult) {
          Text('执行结果：' + this.commandResult)
            .fontSize(18)
            .fontColor(Color.Green)
            .width('90%')
            .padding(10)
            .backgroundColor('#E8F5E9')
            .borderRadius(10)
            .margin({ bottom: 20 })
            .textAlign(TextAlign.Start)
        }

        // 麦克风按钮
        Button(this.isListening ? '停止识别' : '开始说话')
          .width(200)
          .height(200)
          .fontSize(24)
          .fontWeight(FontWeight.Bold)
          .backgroundColor(this.isListening ? Color.Red : Color.Green)
          .fontColor(Color.White)
          .borderRadius(100)
          .margin({ bottom: 30 })
          .onClick(() => {
            this.toggleListening();
          })

        // 历史记录标题
        Row() {
          Text('历史记录')
            .fontSize(22)
            .fontWeight(FontWeight.Bold)
            .fontColor(Color.Black)

          Button('清空')
            .fontSize(16)
            .padding({ left: 10, right: 10 })
            .margin({ left: 10 })
            .backgroundColor(Color.Transparent)
            .fontColor(Color.Red)
            .border({ width: 1, color: Color.Red })
            .onClick(() => {
              this.clearHistory();
            })
        }
        .width('90%')
        .justifyContent(FlexAlign.SpaceBetween)
        .margin({ bottom: 10 })

        // 历史记录列表
        List() {
          ForEach(this.historyList, (item: string, index: number) => {
            ListItem() {
              Row() {
                Text(`${index + 1}. ${item}`)
                  .fontSize(18)
                  .fontColor(Color.Gray)
                  .textAlign(TextAlign.Start)
                  .margin({ right: 10 })
                  .flexGrow(1)

                Button('播报')
                  .fontSize(14)
                  .padding({ left: 8, right: 8 })
                  .backgroundColor(Color.Blue)
                  .fontColor(Color.White)
                  .onClick(() => {
                    this.ttsManager.speak(item);
                  })
              }
              .width('100%')
              .padding(10)
              .justifyContent(FlexAlign.SpaceBetween)
            }
            .border({ width: 1, color: '#EEEEEE', style: BorderStyle.Solid })
            .borderRadius(5)
            .margin({ bottom: 5 })
          })
        }
        .width('90%')
        .height(200)
        .margin({ bottom: 20 })

        // 语音命令示例
        Column() {
          Text('可用语音命令示例：')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor(Color.Black)
            .margin({ bottom: 10 })
            .width('100%')
            .textAlign(TextAlign.Start)

          Text('• "打开首页" - 返回主页面\n• "打电话给张三" - 拨打电话\n• "现在几点" - 查询时间\n• "今天天气" - 查询天气\n• "我要吃药" - 用药提醒')
            .fontSize(16)
            .fontColor(Color.Gray)
            .lineHeight(24)
            .width('100%')
            .textAlign(TextAlign.Start)
        }
        .width('90%')
        .padding(15)
        .backgroundColor('#FFF8E1')
        .borderRadius(10)

        Column() {}.height('100%').flexGrow(1)

      }
      .width('100%')
      .justifyContent(FlexAlign.Start)
      .padding({ left: 20, right: 20 , top: 20, bottom: 40})
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
    .scrollBar(BarState.Auto)
  }
}