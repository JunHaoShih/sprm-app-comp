/* eslint-disable no-extend-native */
export {};
declare global {
    interface Date {
        /**
         * 將{HH:MM}格式的字串加入Date
         * @param timeString
         */
        addByString(timeString: string): Date;
        /**
         * 轉換成Unix timestamp
         */
        toUnixTimestampMilliseconds(): number;

        /**
         * 只取得日期部份的時間
         */
        getDateWithoutTime(): Date;

        /**
         * 複製一個Date物件
         */
        clone(): Date;
        /**
         * Get date string
         */
        getDateStr(): string;
    }
}

Date.prototype.clone = function clone(): Date {
  return new Date(+this);
};

Date.prototype.getDateWithoutTime = function getDateWithoutTime(): Date {
  return new Date(this.getFullYear(), this.getMonth(), this.getDate());
};

Date.prototype.toUnixTimestampMilliseconds = function toUnixTimestampMilliseconds(): number {
  return this.valueOf();
};

Date.prototype.getDateStr = function getDateStr(): string {
  const dateStr = new Date(this).toISOString().split('T')[0];
  return dateStr;
};
