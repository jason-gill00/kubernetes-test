import {
  sleep,
  setHandler,
  defineSignal,
  startChild,
  proxyActivities,
  patched,
  deprecatePatch
} from '@temporalio/workflow';


type WorkflowSignal = {
  name: string;
  jobId: string;
  data: unknown;
}


const entitySignal = defineSignal<[WorkflowSignal]>(
  'entity'
);

const patchId = 'wait-for-healthy-worker-v1'


async function waitForAvailableWorker(getApiVersion: () => Promise<string>): Promise<string> {
  while (true) {
    const version = await getApiVersion();
    const taskQueue = `product-queue-${version}`;

    const { pingActivity } = proxyActivities<{ pingActivity(): Promise<void> }>({
      startToCloseTimeout: '3s',
      taskQueue,
    });

    try {
      await pingActivity();
      return version; // ✅ Found a healthy worker for this version
    } catch {
      console.log(`No worker active for ${taskQueue}. Retrying...`);
      await sleep(1000); // wait and retry
    }
  }
}

export const entityWorkflow = async () => {
  // try {
  console.log('Running entity workflow');
  const pendingSignals: WorkflowSignal[] = [];

  setHandler(entitySignal, async (signal: WorkflowSignal) => {
    console.log('Received signal:', signal);
    pendingSignals.push(signal);
  })

  //if (patched('test-1')) {
  //  console.log("IN NEW FLOW: test-1")
  //}

  while (true) {
    console.log('Waiting for signal v2');
    const nextSignal = pendingSignals.shift()
    if (!nextSignal) break;


    const { getApiVersion } = proxyActivities({
      startToCloseTimeout: '1 minute',
    });

    let version: string;

    // console.log(patched(patchId))

    // deprecatePatch(patchId)

    if (patched(patchId)) {
     console.log("IN NEW FLOW ")
    version = await waitForAvailableWorker(getApiVersion);
    } else {
    version = await getApiVersion();
    }
    const productQueue = `product-queue-${version}`;


    // Start child workflow
    const handle = await startChild('job', {
      args: [
        {
          name: nextSignal.name,
          jobId: nextSignal.jobId,
          data: nextSignal.data,
        }
      ],
      taskQueue: productQueue,
      workflowId: `job-${nextSignal.jobId}`,
    })
    await handle.result();

    await sleep(1000);
  }

// } catch(err) {
//     console.error('Error in entity workflow:', err);
//   }

  return 'Entity workflow completed';
}
