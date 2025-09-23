/**
 * Represents a message to display in the workflow.
 */
export interface WorkflowMessage {
  /**
   * The type of message.
   */
  type: 'info' | 'error' | 'warn' | 'marker-start' | 'marker-end';

  /**
   * The message to display.
   */
  message: string;
}
