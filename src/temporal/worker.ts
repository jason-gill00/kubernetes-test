import { Worker } from '@temporalio/worker';
import * as activities from './activities';

const run = async () => {
  const entityWorker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: 'entity-queue',
  });


  const version = process.env.VERSION || 'unknown';

  const productWorker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: `product-queue-${version}`,
  });


  const entityWorkerRunPromise = entityWorker.run();
  const productWorkerRunPromise = productWorker.run();

  await Promise.all([entityWorkerRunPromise, productWorkerRunPromise]);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
