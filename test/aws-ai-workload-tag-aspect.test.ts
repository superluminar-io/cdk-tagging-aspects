import { App, Stack, CfnResource } from 'aws-cdk-lib';
import { Aspects } from 'aws-cdk-lib';
import { CfnAgent } from 'aws-cdk-lib/aws-bedrock';
import { CfnModel } from 'aws-cdk-lib/aws-sagemaker';
import { CfnFlywheel } from 'aws-cdk-lib/aws-comprehend';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { AwsAiWorkloadTagAspect } from '../src/aws-ai-workload-tag-aspect';

function makeStack(): Stack {
  return new Stack(new App(), 'Stack');
}

describe('AwsAiWorkloadTagAspect', () => {
  test('tags AWS::Bedrock::Agent resources', () => {
    const stack = makeStack();
    new CfnAgent(stack, 'BedrockAgent', { agentName: 'test-agent' });

    Aspects.of(stack).add(new AwsAiWorkloadTagAspect({ 'partner:funded': 'true' }));

    // Bedrock implements ITaggableV2: CDK renders tags as a key/value map, not the CloudFormation array format
    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
      Tags: Match.objectLike({ 'partner:funded': 'true' }),
    });
  });

  test('tags AWS::SageMaker::Model resources', () => {
    const stack = makeStack();
    new CfnModel(stack, 'SageMakerModel', {});

    Aspects.of(stack).add(new AwsAiWorkloadTagAspect({ 'partner:funded': 'true' }));

    Template.fromStack(stack).hasResourceProperties('AWS::SageMaker::Model', {
      Tags: Match.arrayWith([{ Key: 'partner:funded', Value: 'true' }]),
    });
  });

  test('tags AWS::Comprehend::Flywheel resources', () => {
    const stack = makeStack();
    new CfnFlywheel(stack, 'ComprehendFlywheel', {
      flywheelName: 'test-flywheel',
      dataAccessRoleArn: 'arn:aws:iam::123456789012:role/test-role',
      dataLakeS3Uri: 's3://test-bucket/data',
    });

    Aspects.of(stack).add(new AwsAiWorkloadTagAspect({ 'partner:funded': 'true' }));

    Template.fromStack(stack).hasResourceProperties('AWS::Comprehend::Flywheel', {
      Tags: Match.arrayWith([{ Key: 'partner:funded', Value: 'true' }]),
    });
  });

  test('does NOT tag AWS::S3::Bucket resources', () => {
    const stack = makeStack();
    new CfnResource(stack, 'Bucket', { type: 'AWS::S3::Bucket', properties: {} });

    Aspects.of(stack).add(new AwsAiWorkloadTagAspect({ 'partner:funded': 'true' }));

    const resources = Template.fromStack(stack).findResources('AWS::S3::Bucket');
    expect(Object.values(resources)[0].Properties?.Tags).toBeUndefined();
  });

  test('does NOT tag AWS::Lambda::Function resources', () => {
    const stack = makeStack();
    new CfnResource(stack, 'Lambda', { type: 'AWS::Lambda::Function', properties: {} });

    Aspects.of(stack).add(new AwsAiWorkloadTagAspect({ 'partner:funded': 'true' }));

    const resources = Template.fromStack(stack).findResources('AWS::Lambda::Function');
    expect(Object.values(resources)[0].Properties?.Tags).toBeUndefined();
  });
});
