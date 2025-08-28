/**
 * Represents information about a scanner device.
 */
export interface ScannerDeviceInfo {
  /**
   * The actual device manufacturer of the product or hardware.
   * This value of this field may be `null` if it cannot be determined.
   */
  manufacturer: string | null;

  /**
   * The human-friendly name of the device model. This is the name
   * that people would typically use to refer to the device rather
   * than a programmatic model identifier.
   *
   * This value of this field may be `null` if it cannot be determined.
   */
  model: string | null;

  /**
   * The human-readable OS version string. Note that the version
   * string may not always contain three numbers separated by dots.
   */
  osVersion: string;

  /**
   * The human-readable name of the device, which may be set
   * by the device's user. If the device name is unavailable,
   * particularly on web, this value is `null`.
   */
  device: string | null;

  /**
   * The human-readable name of the device, which may be set
   * by the device's user. If the device name is unavailable,
   * particularly on web, this value is `null`.
   */
  deviceName: string | null;
}
