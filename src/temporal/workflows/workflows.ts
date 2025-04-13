import { proxyActivities } from "@temporalio/workflow";

export const testWorkflow = async (name: string) => {
  const { testActivity } = proxyActivities({
    startToCloseTimeout: '1 minute',
  });
  console.log(`Running test workflow for ${name}`);

  await testActivity(name);
  // Add your test workflow logic here
  return `Test workflow for ${name} completed`;
} 
