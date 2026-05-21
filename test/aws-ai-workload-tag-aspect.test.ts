import { App, Stack, CfnResource } from 'aws-cdk-lib';
import { Aspects } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { AwsAiWorkloadTagAspect } from '../src/aws-ai-workload-tag-aspect';

function makeStack(): Stack {
  return new Stack(new App(), 'Stack');
}

describe('AwsAiWorkloadTagAspect', () => {
  test('tags AWS::Bedrock::Agent resources', () => {
    const stack = makeStack();
    new CfnResource(stack, 'BedrockAgent', { type: 'AWS::Bedrock::Agent', properties: {} });

    Aspects.of(stack).add(new AwsAiWorkloadTagAspect({ 'partner:funded': 'true' }));

    Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
      Tags: Match.arrayWith([{ Key: 'partner:funded', Value: 'true' }]),
    });
  });

  test('tags AWS::SageMaker::Model resources', () => {
    const stack = makeStack();
    new CfnResource(stack, 'SageMakerModel', { type: 'AWS::SageMaker::Model', properties: {} });

    Aspects.of(stack).add(new AwsAiWorkloadTagAspect({ 'partner:funded': 'true' }));

    Template.fromStack(stack).hasResourceProperties('AWS::SageMaker::Model', {
      Tags: Match.arrayWith([{ Key: 'partner:funded', Value: 'true' }]),
    });
  });

  test('tags AWS::Comprehend::DocumentClassifier resources', () => {
    const stack = makeStack();
    new CfnResource(stack, 'Comprehend', {
      type: 'AWS::Comprehend::DocumentClassifier',
      properties: {},
    });

    Aspects.of(stack).add(new AwsAiWorkloadTagAspect({ 'partner:funded': 'true' }));

    Template.fromStack(stack).hasResourceProperties('AWS::Comprehend::DocumentClassifier', {
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
