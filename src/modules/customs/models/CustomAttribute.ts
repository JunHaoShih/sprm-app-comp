import { CustomizeInterface } from 'src/models/CustomizeInterface';
import { SelectOption } from 'src/models/SelectOption';

/**
 * 顯示類型
 */
export enum DisplayType {
  Value = 0,
  SingleSelect = 1,
}

/**
 * 屬性類型
 */
export enum AttributeType {
  String = 0,
}

export type AttributeTypeOption = SelectOption<AttributeType>

export type DisplayTypeOption = SelectOption<DisplayType>

/**
 * 自訂選項
 */
export interface CustomOption {
  key: string,
  value: string,
  languages: Record<string, string>,
}

/**
 * 自訂屬性
 */
export interface CustomAttribute extends CustomizeInterface {
  /**
   * 屬性類型
   */
  attributeType: AttributeType,
  /**
   * 顯示類型
   */
  displayType: DisplayType,
  /**
   * 是否停用
   */
  isDisabled: boolean,
  /**
   * 自訂選項清單
   */
  options: CustomOption[],
}
