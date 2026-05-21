# @superluminar-io/cdk-tagging-aspects

CDK aspects for applying tags to resources matching a custom filter. Ships a general-purpose `FilteringTagAspect` and a ready-made `AwsAiWorkloadTagAspect` for AWS partner AI workload compliance tagging.

## Installation

```sh
npm install @superluminar-io/cdk-tagging-aspects
```

## Usage

### AwsAiWorkloadTagAspect

Tags all resources belonging to Amazon SageMaker, Amazon Bedrock, Amazon Bedrock AgentCore, and Amazon Comprehend. Use this to meet AWS partner funded-workload tagging requirements.

```typescript
import { App, Aspects } from 'aws-cdk-lib';
import { AwsAiWorkloadTagAspect } from '@superluminar-io/cdk-tagging-aspects';

const app = new App();
// ... define your stacks ...

Aspects.of(app).add(new AwsAiWorkloadTagAspect({
  'partner:funded': 'true',
  'project': 'my-ai-app',
}));
```

### Custom filter with FilteringTagAspect

Apply tags only to resources matching your own criteria:

```typescript
import { CfnResource } from 'aws-cdk-lib';
import { Aspects } from 'aws-cdk-lib';
import { FilteringTagAspect, IResourceFilter } from '@superluminar-io/cdk-tagging-aspects';
import { IConstruct } from 'constructs';

class MyFilter implements IResourceFilter {
  matches(node: IConstruct): boolean {
    return CfnResource.isCfnResource(node) &&
      node.cfnResourceType.startsWith('AWS::DynamoDB::');
  }
}

Aspects.of(stack).add(new FilteringTagAspect(
  { 'cost-center': '42' },
  new MyFilter(),
));
```

## Notes

- The `IResourceFilter.matches` method is called for every node in the construct tree, including non-`CfnResource` nodes (stacks, L2 constructs, etc.). Tags are only applied to nodes that are both matched by the filter AND are taggable `CfnResource` instances.
- Amazon Bedrock resources implement CDK's `ITaggableV2` interface. Tags are rendered in the synthesized CloudFormation template as a key/value map instead of the standard `[{Key, Value}]` array. Both formats are valid CloudFormation; deployment behavior is identical.
