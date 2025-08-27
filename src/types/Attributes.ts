/**
 * Represents an attribute collection.
 */
export interface Attributes {
  /**
   * The items of the attribute.
   */
  items: AttributeItem[];
}

/**
 * The possible types of attributes.
 */
export type AttributeType = 'text' | 'boolean' | 'number';

/**
 * A single attribute.
 */
export interface AttributeItem {
  /**
   * A unique key for the attribute.
   */
  key: string;

  /**
   * Description of the attribute.
   */
  description: string;

  /**
   * The value of the attribute.
   */
  value: string | boolean;

  /**
   * The type of the value.
   */
  type: AttributeType;
}
