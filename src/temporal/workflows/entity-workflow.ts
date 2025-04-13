import {
  sleep,
  setHandler,
  defineSignal,
  startChild,
  proxyActivities
} from '@temporalio/workflow';


type WorkflowSignal = {
  name: string;
  jobId: string;
  data: unknown;
}


const entitySignal = defineSignal<[WorkflowSignal]>(
  'entity'
);

export const entityWorkflow = async () => {
  console.log('Running entity workflow');
  const pendingSignals: WorkflowSignal[] = [];

  setHandler(entitySignal, async (signal: WorkflowSignal) => {
    console.log('Received signal:', signal);
    pendingSignals.push(signal);
  })

  while (true) {
    console.log('Waiting for signal');
    const nextSignal = pendingSignals.shift()
    if (!nextSignal) break;


    const { getApiVersion } = proxyActivities({
      startToCloseTimeout: '1 minute',
    });
    const version = await getApiVersion();

    // Start child workflow
    const handle = await startChild('job', {
      args: [
        {
          name: nextSignal.name,
          jobId: nextSignal.jobId,
          data: nextSignal.data,
        }
      ],
      taskQueue: `product-queue-${version}`,
      workflowId: `job-${nextSignal.jobId}`,
    })
    await handle.result();

    await sleep(1000);
  }

  return 'Entity workflow completed';
}
