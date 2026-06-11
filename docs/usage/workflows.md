# Workflows

## Running a workflow

Creates a new workflow job and dispatches it to the runner. Returns the job in the
`pending` status; poll `client.workflows.jobs.getStatus(jobId)` to track progress.

```ts
const job = await client.workflows.run({
  workflowId: 'WF01',
  campaign: 'h8X2JxgrnEsu2U0dI8KN',
  pass: '7gXYr76u3Maaf9ugAdWk',
});
console.log(job.id);
```

## Getting a workflow job status

```ts
const status = await client.workflows.jobs.getStatus('JOB01');
console.log(status); // 'pending' | 'running' | 'success' | 'error'
```

## Listing and inspecting workflow jobs

```ts
const allJobs = await client.workflows.jobs.getAll('WF01');
const job = await client.workflows.jobs.getById('JOB01');
await client.workflows.jobs.update('JOB01', { status: 'success' });
await client.workflows.jobs.addLog('JOB01', { type: 'info', message: 'Completed' });
```
