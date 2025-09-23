/**
 * Entity for the workflows collection.
 */
export interface Workflow {
  /**
   * The workflow ID.
   */
  id: string;

  /**
   * The ID of the organization that owns the workflow.
   */
  organizationId: string;

  /**
   * The scanner app associated with the workflow.
   */
  scannerAppId: string | null;

  /**
   * The name of the workflow.
   */
  name: string;

  /**
   * The description of the workflow.
   */
  description: string;

  /**
   * The code to run.
   */
  code: string;

  /**
   * The date the workflow was created.
   */
  createdDate: Date;
}
