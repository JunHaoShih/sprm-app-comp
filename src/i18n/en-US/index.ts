export default {
  title: 'Simple Production Routing Management',
  menu: 'Menu',
  logout: 'Logout',
  actions: {
    action: 'Action',
    add: 'Add',
    adds: {
      newPart: 'Add new part',
      existingPart: 'Add existing part',
    },
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    inserts: {
      success: 'Insert success',
    },
    updates: {
      success: 'Update success',
    },
    deletes: {
      success: 'Delete success',
      confirm: 'Are you sure you want to delete',
      atLeastOne: 'You need to select at least one',
    },
    search: 'Search',
    checkout: 'Check out',
    checkouts: {
      success: 'Check out success',
      failed: 'Check out failed',
    },
    checkin: 'Check in',
    checkins: {
      success: 'Check in success',
      failed: 'Check in failed',
    },
    discard: 'Discard',
    discards: {
      confirm: 'Are you sure you want to discard all modified data?',
      success: 'Discard success',
      cannotDiscardFirstVersion: 'You cannot discard first version',
    },
    next: 'Next',
    previous: 'Previous',
  },
  base: {
    creator: 'Creater',
    modifier: 'Modifier',
    createDate: 'Create date',
    modifiedDate: 'Modifiy date',
  },
  parts: {
    title: 'Parts management',
    caption: 'Manage your parts',
    part: 'Part',
    routing: 'Routing',
    number: 'Number',
    name: 'Name',
    view: 'View',
    views: {
      design: 'Design',
      manufacturing: 'Manufacturing',
    },
    usage: 'Usage',
    usages: {
      new: 'New part usage',
      edit: 'Edit part usage',
      quantity: 'Usage quantity',
      selfAddNotAllowed: 'You cannot add yourself as child part',
      alreadyExist: 'Child part already exist',
      notExist: 'Part usage does not exist',
    },
    bom: 'BOM',
    info: 'Information',
    new: 'New part',
    search: 'Search part',
    versionMustCheckout: 'This part version does not checkout',
    mustSelectOne: 'Please select a part',
    wantToCheckOut: 'Part does not check out, do you want to check out?',
  },
  customs: {
    title: 'Customization',
    caption: 'Manage your settings',
    attributes: {
      title: 'Custom attributes',
      caption: 'Customize your aiiributes',
      attribteType: 'Attribte type',
      displayType: 'Display type',
      types: {
        string: 'String',
      },
      displays: {
        singleSelect: 'Single select',
        value: 'Value',
      },
      new: 'New custom attribute',
    },
    attributeLinks: {
      new: 'New attribute link',
      title: 'Attribute links',
      caption: 'Link your attributes to object types',
    },
    generic: {
      number: 'Number',
      name: 'Name',
      disable: 'Disable',
    },
  },
  iterable: {
    version: 'Version',
    history: 'History',
  },
  validations: {
    notNull: 'Cannot be empty',
    parts: {
      shorterThan3: 'Cannot be shorter than 3',
      longerThan50: 'Cannot be longer than 50',
      invalidChar: 'Only number, alphabets, dash and underscore are valid',
    },
    partUsages: {
      quantity: {
        atLeastOne: 'Quantity cannot smaller than 1',
        mustBeInteger: 'Quantity must be integer',
      },
    },
    customAttributes: {
      options: {
        longerThan20: 'Cannot be longer than 20',
        keyInvalidChar: 'Only number, uppercase alphabets, dash and underscore are valid',
        valueInvalidChar: 'Cannot cantain any invalid characters',
      },
      longerThan20: 'Cannot be longer than 20',
      numberInvalidChar: 'Only number, uppercase alphabets, dash and underscore are valid',
      nameInvalidChar: 'Cannot cantain any invalid characters',
    },
    languages: {
      longerThan20: 'Cannot be longer than 20',
      invalidChar: 'Only number, alphabets, dash and underscore are valid',
    },
  },
  columns: {
    display: 'Columns display',
    defaultColumn: 'Default column',
  },
  quantity: 'Quantity',
  remarks: 'Remarks',
  language: 'Language',
  key: 'Key',
  value: 'Value',
  info: 'Info',
  lang: {
    zhTW: '繁體中文(Traditional Chinese)',
    enUS: 'English',
  },
  errors: {
    unknown: 'Something went wrong',
  },
};
