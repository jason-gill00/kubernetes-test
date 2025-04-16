import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities';
import * as fs from 'fs';

const run = async () => {
  console.log("RUNNING WORKER")
  // set timeout to an hour
  const timeout = 60 * 60 * 1000;
  await new Promise((resolve) => setTimeout(resolve, timeout));
  //console.log({
  //  address: process.env.TEMPORAL_CLOUD_ADDRESS,
  //  apiKey: process.env.TEMPORAL_CLOUD_API_KEY,
  //})
  const connection = process.env.NODE_ENV === 'production' ?
    {
      connection: await NativeConnection.connect({
        address: process.env.TEMPORAL_CLOUD_ADDRESS,
        tls: {},
        apiKey: process.env.TEMPORAL_CLOUD_API_KEY,
      }),
    } : {}

  const entityWorker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities,
    namespace: 'test-playground',
    taskQueue: 'entity-queue',
    ...connection,
  });

  //
  //const version = process.env.VERSION || 'unknown';
  //
  //const productWorker = await Worker.create({
  //  workflowsPath: require.resolve('./workflows'),
  //  activities,
  //  taskQueue: `product-queue-${version}`,
  //  ...connection,
  //});
  //
  //
  //const entityWorkerRunPromise = entityWorker.run();
  //const productWorkerRunPromise = productWorker.run();
  //
  //console.log('Workers started');
  //
  //await Promise.all([entityWorkerRunPromise, productWorkerRunPromise]);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
