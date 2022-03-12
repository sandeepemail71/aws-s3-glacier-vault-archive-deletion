const {
  checkStatusOfInitiateJob,
  initiateJobForInventoryRetrieval,
  getJobOutput,
  getJsonFile,
  deleteArchive,
 } = require('./helpers');
const { parseData } = require('./utils');

const init = async () => {
  const vaultName = 'glacier_vault_name';
  const accountId = '401743534234';

  const { stdout: job, stderr: jobError } = await initiateJobForInventoryRetrieval(vaultName, accountId);
  console.log(`Initiated Job Details: ${job}`);
  if (!jobError) {
    const parsedJobObj = parseData(job);

    const { jobId = '' } = parsedJobObj || {};
    console.log('jobId:', jobId);

    if (jobId) {
      const timerId = setInterval(async () => {
        const { stdout: jobStatus, stderr: jobStatusError } = await checkStatusOfInitiateJob(jobId, vaultName, accountId);
        console.log('Job status:', jobStatus);

        if (!jobStatusError) {
          const parsedJobStatus = parseData(jobStatus);

          const { Completed, StatusCode } = parsedJobStatus;

          if (Completed == true) {
            const { stdout: jobOutput, stderr: jobOutputError } = await getJobOutput(jobId, vaultName, accountId);

            if (!jobOutputError) {
              const parsedJobOutput = parseData(jobOutput);
              console.log('parsedJobOutput:', parsedJobOutput);

              getJsonFile('./output.json').then(async (data) => {
                const archiveList = data.ArchiveList || [];

                for (let i = 0; i < archiveList.length; i++) {
                  console.log("before await")
                  await deleteArchive(archiveList[i].ArchiveId, vaultName, accountId)
                  console.log("after await")
                }
              }).catch(err => console.log(err))
            } else {
              console.log('jobOutputError:', jobOutputError);
            }
            clearInterval(timerId);
          }
        }
      }, 10 * 60 * 1000);

    }
  }
}

init();
