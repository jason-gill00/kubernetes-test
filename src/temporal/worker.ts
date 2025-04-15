import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities';
import * as fs from 'fs';

const run = async () => {
  const connection = process.env.NODE_ENV === 'production' ?
    {
      connection: await NativeConnection.connect({
        address: process.env.TEMPORAL_CLOUD_ADDRESS,
      }),
      tls: {
        clientKey: fs.readFileSync('/creds/client.key'),
      }
    } : {}

  const entityWorker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities,
    namespace: 'test-playground',
    taskQueue: 'entity-queue',
    ...connection,
  });


  const version = process.env.VERSION || 'unknown';

  const productWorker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: `product-queue-${version}`,
    ...connection,
  });


  const entityWorkerRunPromise = entityWorker.run();
  const productWorkerRunPromise = productWorker.run();

  await Promise.all([entityWorkerRunPromise, productWorkerRunPromise]);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
