# Deploy to NuGet

This reusable action builds a .NET project and deploys the resulting package to NuGet. It supports configuration for custom project paths and versioning, and securely handles the NuGet API key as a secret.

## Usage

Simply use this action in your workflow by specifying the project file path, version, and your NuGet API key.

### Inputs

- `deploy-nuget-project`: **Required**. The path to the `.csproj` file of the .NET project that you want to build and deploy.
- `version`: **Required**. The version to assign to the NuGet package. Typically, this is dynamically generated from tags or other versioning strategies.
- `nuget-api-key`: **Required**. The NuGet API key used to push the package to NuGet.org. This should be stored securely as a GitHub Secret.
- `dotnet-version`: **Optional**. The .NET SDK version to use. Defaults to `8.0`.
- `build-only`: **Optional**. If `true`, only build the project, do not deploy. Defaults to `false`.

### Example

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      
      - name: Deploy to NuGet
        uses: alsi-lawr/deploy-nuget@v1
        with:
          deploy-nuget-project: 'src/MyProject'  # Specify the correct path to your project file directory
          version: 1.0.${{ github.run_number }}  # Example using the run number
          nuget-api-key: ${{ secrets.NUGET_API_KEY }}  # NuGet API key stored as a secret
          dotnet-version: '8.0'
```

### Security

- **NuGet API Key:** The `nuget-api-key` input should always be stored as a secret to avoid exposing sensitive information. You can add this secret in your GitHub repository settings under `Settings` > `Secrets and variables` > `Actions`.

### Additional Notes

- This action leverages Docker to run inside a .NET SDK container, ensuring a consistent build environment.
- The action automatically restores NuGet packages, adds `Microsoft.SourceLink.GitHub`, and builds the project with various settings optimized for CI/CD environments.

## Contributing

Contributions are welcome! Please refer to the [contributing guidelines](./docs/CONTRIBUTING.md) for more information.
