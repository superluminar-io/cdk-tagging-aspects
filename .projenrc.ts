import { awscdk } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'superluminar GmbH',
  authorAddress: 'info@superluminar.io',
  authorOrganization: true,
  cdkVersion: '2.0.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.7.0',
  name: 'cdk-tagging-aspects',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/superluminar-io/cdk-tagging-aspects.git',
  description: 'CDK aspects for applying tags to resources matching a custom filter',
  license: 'MIT',
  keywords: ['cdk', 'aws', 'tagging', 'aspects', 'compliance'],
  publishToPypi: {
    distName: 'cdk-tagging-aspects',
    module: 'cdk_tagging_aspects',
  },
  publishToMaven: {
    mavenGroupId: 'io.superluminar',
    javaPackage: 'io.superluminar.cdktaggingaspects',
    mavenArtifactId: 'cdk-tagging-aspects',
  },
  publishToNuget: {
    dotNetNamespace: 'Superluminar.CdkTaggingAspects',
    packageId: 'Superluminar.CdkTaggingAspects',
  },
  publishToGo: {
    gitUserName: 'superluminar-io',
    gitUserEmail: 'info@superluminar.io',
    moduleName: 'github.com/superluminar-io/cdk-tagging-aspects-go',
  },
});

project.addPackageIgnore('/docs/');
project.gitignore.addPatterns('package-lock.json');

project.synth();
