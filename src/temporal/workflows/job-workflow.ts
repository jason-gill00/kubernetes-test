import {
  sleep
} from '@temporalio/workflow';

export const job = async (args: {
  name: string;
  jobId: string;
  data: unknown;
}) => {
  console.log('Running job workflow', args);
  await sleep(10000);
  return `Job workflow for ${args.name} completed`;
}
