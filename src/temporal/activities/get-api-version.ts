export const getApiVersion = async () => {
  const version = process.env.VERSION || 'unknown';
  return version;
}
