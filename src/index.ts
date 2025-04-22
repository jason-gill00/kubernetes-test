import { Client, Connection, WorkflowIdReusePolicy } from '@temporalio/client';
import { uuid4 } from '@temporalio/workflow';
import express from 'express';
import * as fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_req, res) => {
  res.send('Hello from TypeScript Express server! Testttttt 123');
});

app.get('/version', (_req, res) => {
  // Get version from container
  const version = process.env.VERSION || 'unknown';
  console.log('Version:', version);
  res.send(version);
});

app.get('/temporal', async (_req, res) => {

  console.log("inside temporal endpoint")
  const connection = process.env.NODE_ENV === 'production' ?
    {
      namespace: 'test-playground.muu9r',
      connection: await Connection.connect({
        address: process.env.TEMPORAL_CLOUD_ADDRESS,
        tls: {},
        apiKey: process.env.TEMPORAL_CLOUD_API_KEY,
      }),
    } : {}

  console.log(connection)

  const client = new Client({
    ...connection,
  });
  const workflowId = 'entity-workflow-id-123';


  await client.workflow.signalWithStart(
    'entityWorkflow',
    {
      workflowId,
      taskQueue: 'entity-queue',
      signal: 'entity',
      signalArgs: [{
        name: 'test-name',
        jobId: 'foo-bar',
        data: {
          foo: 'bar',
        },
      }],
    }
  )

  res.send('Made a request to temporal');
});

app.get('/temporal-2', async (_req, res) => {

  console.log("inside temporal endpoint")
  const connection = process.env.NODE_ENV === 'production' ?
    {
      namespace: 'test-playground.muu9r',
      connection: await Connection.connect({
        address: process.env.TEMPORAL_CLOUD_ADDRESS,
        tls: {},
        apiKey: process.env.TEMPORAL_CLOUD_API_KEY,
      }),
    } : {}

  console.log(connection)

  const client = new Client({
    ...connection,
  });
  const workflowId = 'entity-workflow-id-456';


  await client.workflow.signalWithStart(
    'entityWorkflow',
    {
      workflowId,
      taskQueue: 'entity-queue',
      signal: 'entity',
      signalArgs: [{
        name: 'test-nameworkflow2',
        jobId: 'foo-bar-workflow-2',
        data: {
          foo: 'bar',
        },
      }],
    }
  )

  res.send('Made a request to temporal');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
