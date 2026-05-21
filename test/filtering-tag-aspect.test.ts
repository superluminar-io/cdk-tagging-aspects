import { App, Stack, CfnResource, Aspects } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { CfnBucket } from 'aws-cdk-lib/aws-s3';
import { IConstruct } from 'constructs';
import { FilteringTagAspect, IResourceFilter } from '../src/filtering-tag-aspect';

class AlwaysMatch implements IResourceFilter {
  matches(_node: IConstruct): boolean { return true; }
}

class NeverMatch implements IResourceFilter {
  matches(_node: IConstruct): boolean { return false; }
}

describe('FilteringTagAspect', () => {
  test('applies tag to CfnResource when filter matches', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new CfnBucket(stack, 'Bucket');

    Aspects.of(stack).add(new FilteringTagAspect({ env: 'prod' }, new AlwaysMatch()));

    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      Tags: Match.arrayWith([{ Key: 'env', Value: 'prod' }]),
    });
  });

  test('does not apply tags when filter does not match', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new CfnBucket(stack, 'Bucket');

    Aspects.of(stack).add(new FilteringTagAspect({ env: 'prod' }, new NeverMatch()));

    const resources = Template.fromStack(stack).findResources('AWS::S3::Bucket');
    expect(Object.values(resources)[0].Properties?.Tags).toBeUndefined();
  });

  test('does not crash when filter matches a non-taggable CfnResource', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new CfnResource(stack, 'Handle', {
      type: 'AWS::CloudFormation::WaitConditionHandle',
      properties: {},
    });

    Aspects.of(stack).add(new FilteringTagAspect({ env: 'prod' }, new AlwaysMatch()));

    expect(() => Template.fromStack(stack)).not.toThrow();
  });

  test('applies multiple tags when filter matches', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new CfnBucket(stack, 'Bucket');

    Aspects.of(stack).add(new FilteringTagAspect(
      { key1: 'val1', key2: 'val2' },
      new AlwaysMatch(),
    ));

    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      Tags: Match.arrayWith([
        { Key: 'key1', Value: 'val1' },
        { Key: 'key2', Value: 'val2' },
      ]),
    });
  });
});
