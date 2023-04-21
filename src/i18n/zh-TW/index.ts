export default {
  title: 'Simple Production Routing Management',
  menu: '選單',
  logout: '登出',
  actions: {
    action: '動作',
    add: '新增',
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
    bom: 'BOM',
    info: '資訊',
    new: '新增料件',
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
    checkout: '出庫',
  },
  validations: {
    notNull: '不可為空',
    parts: {
      notNull: '不可為空',
      shorterThan3: '字數不可少於3',
      longerThan50: '字數不可大於50',
      invalidChar: '只能含有0-9、aA-zZ、-、_',
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
  remarks: '備註',
  language: '語言',
  info: '資訊',
  key: '鍵',
  value: '值',
  lang: {
    zhTW: '繁體中文',
    enUS: 'English(英文)',
  },
};
