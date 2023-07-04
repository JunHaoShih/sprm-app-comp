import { CustomAttribute, DisplayType } from 'src/modules/customs/models/CustomAttribute';

export const customValueRecordService = {
  /**
   * Parse object to record with custom values
   * @param record Target object (Please parse object to record first)
   * @param customAttributes Object's custom attributes
   * @param customValues Object's custom values
   * @param lang i18n language
   * @returns Record with custom values
   */
  toRecord: (
    record: Record<string, unknown>,
    customAttributes: CustomAttribute[],
    customValues: Record<string, string>,
    lang: string,
  ) => {
    Object.keys(customValues).forEach((key) => {
      const targetAttribute = customAttributes.find((attr) => attr.number === key);
      if (!targetAttribute) {
        return;
      }
      if (targetAttribute.displayType !== DisplayType.SingleSelect) {
        const currentValue = customValues[key];
        record[key] = currentValue;
        return;
      }
      // Get single select option
      const currentValue = customValues[key];
      const targetOption = targetAttribute.options.find(
        (option) => option.key === currentValue,
      );
      // Display raw value if option is not found
      if (!targetOption) {
        record[key] = currentValue;
        return;
      }
      // Get display value of current language
      const display = targetOption.languages[lang];
      if (display) {
        // Display language
        record[key] = display;
      } else {
        // Show default value if language display not found
        record[key] = targetOption.value;
      }
    });
    return record;
  },
};
