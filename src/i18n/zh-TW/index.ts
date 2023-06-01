export default {
  title: 'Simple Production Routing Management',
  menu: '選單',
  logout: '登出',
  actions: {
    action: '動作',
    add: '新增',
    adds: {
      newPart: '加入新料件',
      existingPart: '加入現有料件',
    },
    edit: '編輯',
    delete: '刪除',
    cancel: '取消',
    confirm: '確定',
    inserts: {
      success: '新增成功',
    },
    updates: {
      success: '更新成功',
    },
    deletes: {
      success: '刪除成功',
      confirm: '確定刪除',
      atLeastOne: '至少要選擇一筆',
    },
    search: '搜尋',
    checkout: '簽出',
    checkin: '簽入',
    next: '下一步',
    previous: '上一步',
  },
  base: {
    creator: '建立者',
    modifier: '修改者',
    createDate: '建立日期',
    modifiedDate: '修改日期',
  },
  parts: {
    title: '料件管理',
    caption: '管理料件以及其他關連',
    part: '料件',
    routing: '產品途程',
    number: '料號',
    name: '料件名稱',
    view: 'View',
    views: {
      design: '設計',
      manufacturing: '製造',
    },
    usage: '使用關係',
    usages: {
      new: '新增使用關係',
      quantity: '使用數量',
      selfAddNotAllowed: '不可將自己加入子料件',
      alreadyExist: '子料件已存在',
      notExist: '使用關係不存在',
    },
    bom: 'BOM',
    info: '資訊',
    new: '新增料件',
    search: '搜尋料件',
    versionMustCheckout: '料件版本尚未簽出',
    mustSelectOne: '請選擇一個料件',
  },
  customs: {
    title: '自定義',
    caption: '管理自訂屬性',
    attributes: {
      title: '自定義屬性',
      caption: '設定您的自定義屬性',
      attribteType: '屬性類型',
      displayType: '顯示類型',
      types: {
        string: '字串',
      },
      displays: {
        singleSelect: '單選',
        value: '值',
      },
      new: '新增自訂屬性',
    },
    attributeLinks: {
      new: '新增屬性關聯',
      title: '屬性關聯',
      caption: '關聯你的自訂屬性到指定物件類別',
    },
    generic: {
      number: '編號',
      name: '名稱',
      disable: '停用',
    },
  },
  iterable: {
    version: '版本',
  },
  validations: {
    notNull: '不可為空',
    parts: {
      notNull: '不可為空',
      shorterThan3: '字數不可少於3',
      longerThan50: '字數不可大於50',
      invalidChar: '只能含有0-9、aA-zZ、-、_',
    },
    partUsages: {
      quantity: {
        atLeastOne: '使用數量不可小於1',
        mustBeInteger: '使用數量必須是整數',
      },
    },
    customAttributes: {
      options: {
        longerThan20: '字數不可大於20',
        keyInvalidChar: '只能含有0-9、A-Z、-、_',
        valueInvalidChar: '不可含有任何非法字元',
      },
      longerThan20: '字數不可大於20',
      numberInvalidChar: '只能含有0-9、A-Z、-、_',
      nameInvalidChar: '不可含有任何非法字元',
    },
    languages: {
      longerThan20: '字數不可大於20',
      invalidChar: '不可含有任何非法字元',
    },
  },
  columns: {
    display: '欄位顯示',
    defaultColumn: '預設欄位',
  },
  quantity: '數量',
  remarks: '備註',
  language: '語言',
  info: '資訊',
  key: '鍵',
  value: '值',
  lang: {
    zhTW: '繁體中文',
    enUS: 'English(英文)',
  },
  errors: {
    unknown: '不明錯誤',
  },
};
