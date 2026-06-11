# Workflows

## `run(body): Promise<WorkflowJob>`

Runs a workflow. Creates a new workflow job and dispatches it to the runner. The returned job will be in the `pending` status; poll `client.workflows.jobs.getStatus(jobId)` to track progress.

```ts
const job = await client.workflows.run({
  workflowId: 'WF01',
  campaign: 'h8X2JxgrnEsu2U0dI8KN',
  pass: '7gXYr76u3Maaf9ugAdWk',
});
console.log(job.id);
```

## `jobs.getStatus(jobId): Promise<WorkflowJobStatus>`

Returns the current status of a workflow job.

```ts
const status = await client.workflows.jobs.getStatus('JOB01');
console.log(status); // 'pending' | 'running' | 'success' | 'error'
```

## `jobs.getAll(workflowId): Promise<WorkflowJob[]>`

Returns the jobs for a workflow.

```ts
const allJobs = await client.workflows.jobs.getAll('WF01');
console.log(allJobs);
```

## `jobs.getById(jobId): Promise<WorkflowJob>`

Returns the details for a job.

```ts
const job = await client.workflows.jobs.getById('JOB01');
console.log(job);
```

## `jobs.update(jobId, body): Promise<WorkflowJob>`

Updates a job.

```ts
await client.workflows.jobs.update('JOB01', { status: 'success' });
```

## `jobs.addLog(jobId, message): Promise<WorkflowJob>`

Logs a message to a workflow job.

```ts
await client.workflows.jobs.addLog('JOB01', { type: 'info', message: 'Completed' });
```
