const permify = require('@permify/permify-node');
const client = new permify.grpc.newClient({
    endpoint: 'localhost:3478' // Replace with your Permify server endpoint
});
client.schema.write({
  tenantId: 't1', // Replace with your tenant ID
  schema: `
      entity user {}
      entity post {
          relation author @user
          action view = author
          action create = author
          action edit = author
          action delete = author
      }
  `
}).then((response) => {
  console.log('Schema written:', response);
});