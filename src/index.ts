import { Client, Connection } from '@temporalio/client';
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
  const connection = process.env.NODE_ENV === 'production' ?
    {
      namespace: process.env.TEMPORAL_CLOUD_NAMESPACE,
      connection: await Connection.connect({
        address: process.env.TEMPORAL_CLOUD_ADDRESS,
      }),
      tls: {
        clientKey: fs.readFileSync('/creds/client.key'),
      }
    } : {}

  console.log("inside temporal endpoint")
  console.log({
    clientKey: fs.readFileSync('/creds/client.key'),
    namespace: process.env.TEMPORAL_CLOUD_NAMESPACE,
    address: process.env.TEMPORAL_CLOUD_ADDRESS,
  })

  const client = new Client({
    namespace: 'default',
    ...connection,
  });
  const workflowId = 'entity-workflow-id';

  //await client.workflow.start('testWorkflow', {
  //  workflowId,
  //  args: ['test-name'],
  //  taskQueue: 'test-queue',
  //})


  await client.workflow.signalWithStart(
    'entityWorkflow',
    {
      workflowId,
      taskQueue: 'entity-queue',
      signal: 'entity',
      signalArgs: [{
        name: 'test-name',
        jobId: uuid4(),
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
