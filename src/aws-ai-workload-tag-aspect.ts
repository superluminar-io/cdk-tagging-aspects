import { CfnResource } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { FilteringTagAspect, IResourceFilter } from './filtering-tag-aspect';

const AI_SERVICE_PREFIXES = [
  'AWS::SageMaker::',
  'AWS::Bedrock::',
  'AWS::Comprehend::',
];

/** @internal */
class AwsAiWorkloadFilter implements IResourceFilter {
  matches(node: IConstruct): boolean {
    if (!CfnResource.isCfnResource(node)) return false;
    const cfn = node as CfnResource;
    return AI_SERVICE_PREFIXES.some(prefix => cfn.cfnResourceType.startsWith(prefix));
  }
}

export class AwsAiWorkloadTagAspect extends FilteringTagAspect {
  constructor(tags: { [key: string]: string }) {
    super(tags, new AwsAiWorkloadFilter());
  }
}
