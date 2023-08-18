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
      existingProcess: '加入現有製程',
    },
    edit: '編輯',
    delete: '刪除',
    cancel: '取消',
    confirm: '確定',
    inserts: {
      success: '新增成功',
    },
    update: '更新',
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
    checkouts: {
      success: '簽出成功',
      failed: '簽出失敗',
    },
    checkin: '簽入',
    checkins: {
      success: '簽入成功',
      failed: '簽入失敗',
    },
    discard: '捨棄',
    discards: {
      confirm: '確定要捨棄所有編輯資料?',
      dataLossWarning: '捨棄編輯資料將無法還原',
      success: '捨棄成功',
      cannotDiscardFirstVersion: '無法捨棄第一版資料',
    },
    next: '下一步',
    previous: '上一步',
    draft: '草稿',
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
    version: '料件版本',
    routing: '工藝路徑',
    routings: {
      name: '工藝路徑名稱',
      version: '工藝路徑版本',
      new: '新增工藝路徑',
      process: '路徑製程',
      processes: {
        new: '新增路徑製程',
        edit: '編輯路徑製程',
        number: '路徑製程編號',
      },
      usage: '工藝路徑使用關係',
      wantToCheckOut: '工藝路徑尚未出庫，是否要出庫?',
    },
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
      edit: '編輯使用關係',
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
    wantToCheckOut: '料件尚未出庫，是否要出庫?',
    notExist: '料件不存在',
    alreadyInUse: '料件經在使用',
  },
  processes: {
    title: '製程管理',
    caption: '管理製程與相關資訊',
    process: '製程',
    number: '製程編號',
    name: '製程名稱',
    processType: '製程類型',
    makeType: '製造類型',
    defaultImportTime: '預設進站時間(毫秒)',
    defaultExportTime: '預設出站時間(毫秒)',
    new: '新增製程',
    search: '搜尋製程',
    notExist: '製程不存在',
    alreadyInUse: '製程已經在使用',
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
    history: '歷史',
    latest: '最新',
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
    processes: {
      shorterThan2: '字數不可少於2',
      longerThan20: '字數不可大於20',
      invalidChar: '不可含有任何非法字元',
    },
    cannotSmallerThan0: '不可小於0',
    cannotSmallerThan6: '不可小於6',
    cannotLongerThan20: '字數不可大於20',
    cannotLongerThan50: '字數不可大於50',
    invalidChar: '不可含有任何非法字元',
  },
  columns: {
    display: '欄位顯示',
    defaultColumn: '預設欄位',
  },
  permissions: {
    option: '項目',
    management: '權限管理',
    accessDenied: '拒絕訪問',
  },
  users: {
    user: '使用者',
    title: '使用者管理',
    caption: '管理所有使用者',
    username: '使用者名稱',
    password: '密碼',
    fullName: '全名',
    isAdmin: '管理員',
  },
  admins: {
    title: '管理面板',
  },
  sideBars: {
    expand: '展開側邊欄',
    collapse: '縮小側邊欄',
  },
  cruds: {
    create: '新增',
    read: '查詢',
    update: '修改',
    delete: '刪除',
  },
  home: '首頁',
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
  notifications: {
    permissionChangedPleaseRefresh: '您的權限已經被修改，請重新整理網頁',
  },
};
