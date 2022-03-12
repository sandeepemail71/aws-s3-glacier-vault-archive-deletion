# aws-s3-glacier-vault-archive-deletion
aws-s3-glacier-vault-archive-deletion

### Why this is created
I have to delete 4 lacks archive from aws glacier vault, So i wrote this cript to do that

### Steps to run Script
1. in `index.js` update these two variable ` const vaultName = 'glacier_vault_name';
  const accountId = '401743534234';`
2. run `npm install`
3. run `node index.js`

### Before run this script you have to setup aws client after that only this script will work
