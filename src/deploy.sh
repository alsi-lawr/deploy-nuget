#!/bin/bash

PROJECT_PATH=$1
PACKAGE_VERSION=$2
BUILD_ONLY=$3
echo "Deploying package in $PROJECT_PATH with version $PACKAGE_VERSION"
echo "Dotnet version used: "
dotnet --version

dotnet restore -s "https://api.nuget.org/v3/index.json" $PROJECT_PATH
dotnet add $PROJECT_PATH package Microsoft.SourceLink.GitHub
dotnet build $PROJECT_PATH -c Release \
  /p:ContinuousIntegrationBuild=true \
  /p:EmbedUntrackedSources=true \
  /p:PublishRepositoryUrl=true \
  /p:GenerateDocumentationFile=true \
  /p:IncludeSymbols=true \
  /p:SymbolPackageFormat=snupkg \
  /p:NoWarn=CS1591 \
  /p:RepositoryBranch=$GITHUB_REF_NAME \
  /p:RepositoryCommit=$GITHUB_SHA \
  /p:GeneratePackageOnBuild=true \
  /p:Version=$PACKAGE_VERSION \
  /p:BaseOutputPath=bin/ \
  --no-incremental

if [ "$BUILD_ONLY" = "true" ]; then
  exit 0
fi

dotnet nuget push "$PROJECT_PATH/bin/Release/*.nupkg"\
    --source https://api.nuget.org/v3/index.json\
    --api-key $NUGET_API_KEY

