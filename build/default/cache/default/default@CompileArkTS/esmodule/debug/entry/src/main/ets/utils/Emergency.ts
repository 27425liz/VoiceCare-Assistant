// 作用：处理紧急呼救相关功能
export class EmergencyHelper {
    private static emergencyContacts: string[] = ['13800138000', '13900139000'];
    // 一键呼救
    static emergencyCall(): void {
        // 拨打第一个紧急联系人
        console.log(`正在拨打紧急联系人: ${EmergencyHelper.emergencyContacts[0]}`);
    }
    // 发送求助短信
    static sendEmergencySMS(): void {
        const message = `紧急求助！我需要帮助。位置：北京市朝阳区。时间：${new Date().toLocaleString()}`;
        EmergencyHelper.emergencyContacts.forEach(contact => {
            // 调用系统短信接口
            console.log(`向 ${contact} 发送短信：${message}`);
        });
    }
    // 添加紧急联系人
    static addEmergencyContact(phone: string): void {
        if (EmergencyHelper.validatePhone(phone)) {
            EmergencyHelper.emergencyContacts.push(phone);
        }
    }
    private static callNumber(phone: string): void {
        // 调用系统拨号接口
        console.log(`正在拨打：${phone}`);
    }
    private static validatePhone(phone: string): boolean {
        return /^1[3-9]\d{9}$/.test(phone);
    }
}
