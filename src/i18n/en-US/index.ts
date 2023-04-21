export default {
  title: 'Simple Production Routing Management',
  menu: 'Menu',
  logout: 'Logout',
  actions: {
    action: 'Action',
    add: 'Add',
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
    bom: 'BOM',
    info: 'Information',
    new: 'New part',
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
    checkout: 'Checkout',
  },
  validations: {
    notNull: 'Cannot be empty',
    parts: {
      shorterThan3: 'Cannot be shorter than 3',
      longerThan50: 'Cannot be longer than 50',
      invalidChar: 'Only number, alphabets, dash and underscore are valid',
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
  remarks: 'Remarks',
  language: 'Language',
  key: 'Key',
  value: 'Value',
  info: 'Info',
  lang: {
    zhTW: '繁體中文(Traditional Chinese)',
    enUS: 'English',
  },
};
