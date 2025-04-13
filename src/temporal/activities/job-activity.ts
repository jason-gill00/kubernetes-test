export const jobActivity = async () => {
  console.log('Running job activity');
  // Simulate some work
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return 'Job activity completed';
}
