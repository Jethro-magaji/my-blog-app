const permify = require('@permify/permify-node');
const client = new permify.grpc.newClient({
    endpoint: 'localhost:3478' // Replace with your Permify server endpoint
});
client.permission.check({
  tenantId: 't1', // Replace with your tenant ID
  metadata: {
    schemaVersion: 'cpi73hpisfs3ioefk1ag' 
  },
  subjectType: 'user',
  subjectId: '2', // The admin user ID
  actions: [
    {
      entity: 'post',
      action: 'edit',
      allowed: true
    }
  ]
}).then((response) => {
  console.log('Permission granted:', response);
});