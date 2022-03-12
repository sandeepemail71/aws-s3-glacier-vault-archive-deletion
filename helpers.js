'use strict';
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const getJsonFile = (filePath, encoding = 'utf8') => (
  new Promise((resolve, reject) => {
    fs.readFile(filePath, encoding, (err, contents) => {
      if (err) {
        return reject(err);
      }
      resolve(contents);
    });
  })
    .then(JSON.parse)
);

const checkStatusOfInitiateJob = async (jobId = '', vaultName = '', accountId = '') => {
  try {
    const { stdout, stderr } = await exec(`aws glacier describe-job --vault-name ${vaultName} --account-id ${accountId} --job-id '${jobId}'`);
    return { stdout, stderr };
  } catch (error) {
    console.error(error, "====error")
    return {
      error
    }
  }
};

const initiateJobForInventoryRetrieval = async (vaultName = '', accountId = '') => {
  try {
    const { stdout, stderr } = await exec(`aws glacier initiate-job --vault-name ${vaultName} --account-id ${accountId} --job-parameters '{"Type": "inventory-retrieval"}'`);
    return { stdout, stderr };
  } catch (error) {
    console.error(error, "====error")
    return {
      error
    }
  }
};

const getJobOutput = async (jobId = '', vaultName = '', accountId = '') => {
  try {
    const { stdout, stderr } = await exec(`aws glacier get-job-output --vault-name ${vaultName} --account-id ${accountId} --job-id '${jobId}' ./output.json`);
    return { stdout, stderr };
  } catch (error) {
    console.error(error, "====error")
    return {
      error
    }
  }
};

const deleteArchive = async (archiveId = '', vaultName = '', accountId = '') => {
  try {
    const { stdout, stderr } = await exec(`aws glacier delete-archive --vault-name ${vaultName} --account-id ${accountId} --archive-id ${archiveId}`);
    return { stdout, stderr };
  } catch (error) {
    console.error(error, "====error")
    return {
      error
    }
  }
}

// getJsonFile('/home/sandeep/workspace/aws-s3-glacier-vault-archive-deletion-master/output.json').then(async (data) => {
//   console.log(data, "====data")
// }).catch(err => console.log(err))

module.exports = {
  checkStatusOfInitiateJob,
  getJsonFile,
  initiateJobForInventoryRetrieval,
  getJobOutput,
  deleteArchive,
}