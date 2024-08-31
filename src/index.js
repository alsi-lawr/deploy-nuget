const core = require("@actions/core");
const exec = require("@actions/exec");
const script = require("./script");

async function run() {
  try {
    // Get inputs
    const project = core.getInput("project");
    const version = core.getInput("version");
    const nugetApiKey = core.getInput("nuget-api-key");
    const buildOnly = core.getInput("build-only");
    const dotnetVersion = core.getInput("dotnet-version");
    const workspace = process.env.GITHUB_WORKSPACE;
    const githubRefName = process.env.GITHUB_REF_NAME;
    const githubSha = process.env.GITHUB_SHA;

    // Define Docker image name
    const imageName = `mcr.microsoft.com/dotnet/sdk:${dotnetVersion}`;

    // Run the Docker container with the environment variables passed in
    // prettier-ignore
    await exec.exec('docker', [
      'run',
      '--rm',
      '-v', `${workspace}:/workspace`,
      '-e', `PROJECT_PATH=${project}`,
      '-e', `PACKAGE_VERSION=${version}`,
      '-e', `BUILD_ONLY=${buildOnly}`,
      '-e', `NUGET_API_KEY=${nugetApiKey}`,
      '-e', `GITHUB_REF_NAME=${githubRefName}`,
      '-e', `GITHUB_SHA=${githubSha}`,
      '-w', '/workspace',
      imageName,
      'bash', '-c', script
    ]);
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
