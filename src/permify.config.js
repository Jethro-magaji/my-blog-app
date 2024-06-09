import { createClient } from '@permify/react-role';

const permifyConfig = {
  tenantId: 't1', // Replace with your Permify tenant ID
  endpoint: 'http://localhost:3478', // Replace if running Permify on a different port
};

export const permifyClient = createClient(permifyConfig);