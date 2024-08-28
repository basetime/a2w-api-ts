/**
 * Job status.
 */
export type JobStatus = 'preparing' | 'running' | 'success' | 'failed';

/**
 * Job mode.
 */
export type JobMode = 'import' | 'export';

/**
 * The details of a running job.
 */
export interface Job {
  /**
   * The ID of the job.
   */
  id: string;

  /**
   * The job status.
   */
  status: JobStatus;

  /**
   * Error message if the job failed.
   */
  error?: string;

  /**
   * The tasks in the job.
   */
  tasks: Task[];

  /**
   * The number of passes in the job.
   */
  passesCount: number;

  /**
   * Log messages for the job.
   */
  logs: string[];

  /**
   * The date the job finished.
   */
  finishedDate: Date | null;

  /**
   * The date the job was created.
   */
  createdDate: Date;
}

/**
 * A task in the job.
 */
export interface Task {
  /**
   * The ID of the task.
   */
  id: string;

  /**
   * Are we importing or exporting?
   */
  mode: 'import' | 'export';

  /**
   * The ID of the installed integration that processes the task.
   */
  integration: string;

  /**
   * The task configuration.
   */
  config: any;

  /**
   * The cloud file that's the input for the task.
   */
  inputFile: string;

  /**
   * The cloud file that's the output for the task.
   */
  outputFile: string;

  /**
   * The status of the task.
   */
  status: JobStatus;

  /**
   * The error message if the task failed.
   */
  error?: string;

  /**
   * The number of rows affected by the task.
   */
  rowsAffected: number;

  /**
   * The date the task was created.
   */
  createdDate: Date;

  /**
   * The date the task finished.
   */
  finishedDate: Date | null;
}
