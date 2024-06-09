const permify = require('@permify/permify-node');
const client = new permify.grpc.newClient({
    endpoint: 'localhost:3478' // Replace with your Permify server endpoint
});
client.data.write({
  tenantId: 't1', // Replace with your tenant ID
  metadata: {
    schemaVersion: 'cpi73hpisfs3ioefk1ag' 
  },
  tuples: [
    {
      entity: {
        type: 'post',
        id: '1'
      },
      relation: 'author',
      subject: {
        type: 'user',
        id: '1'
      }
    }
  ]
}).then((response) => {
  console.log('Relationship written:', response);
});