# CDK Tagging Aspects — Design Spec

**Date:** 2026-05-21

## Problem

AWS partners whose workloads are funded by AWS must tag resources belonging to specific AWS services. Rather than duplicating tagging logic across every CDK project, this library provides reusable CDK aspects that can be installed from a package registry.

## Goals

- Provide a reusable, publishable CDK aspect library
- Support all CDK-supported languages (TypeScript, Python, Java, Go, .NET) via JSII
- Ship a general-purpose core aspect and at least one ready-made concrete aspect
- Publish publicly to npm (and other language registries via jsii-pacmak)

## Architecture

Option A (selected): Core aspect + named concrete aspects.

Three public exports:

1. **`IResourceFilter`** — interface with `matches(node: IConstruct): boolean`
2. **`FilteringTagAspect`** — core aspect implementing `IAspect`; applies tags to nodes that pass the filter
3. **`AwsAiWorkloadTagAspect`** — extends `FilteringTagAspect` with a built-in filter for AWS AI services

## API

```typescript
interface IResourceFilter {
  matches(node: IConstruct): boolean;
}

class FilteringTagAspect implements IAspect {
  constructor(tags: { [key: string]: string }, filter: IResourceFilter);
  visit(node: IConstruct): void;
}

class AwsAiWorkloadTagAspect extends FilteringTagAspect {
  constructor(tags: { [key: string]: string });
}
```

### How `visit` works

CDK invokes `visit` on every node in the construct tree automatically — no manual recursion needed. `visit` calls `filter.matches(node)` and, if `true`, applies each tag via `cdk.Tags.of(node).add(key, value)`.

### `AwsAiWorkloadTagAspect` filter

Matches `CfnResource` nodes whose `cfnResourceType` starts with any of:

- `AWS::SageMaker::`
- `AWS::Bedrock::` (covers Bedrock and Bedrock AgentCore)
- `AWS::Comprehend::`

## Usage Examples

```typescript
// Ready-made AI workload aspect
Aspects.of(app).add(new AwsAiWorkloadTagAspect({
  'partner:funded': 'true',
  'project': 'my-ai-app',
}));

// Custom filter
Aspects.of(stack).add(new FilteringTagAspect(
  { 'cost-center': '42' },
  { matches: (node) => node instanceof MySpecialConstruct }
));
```

## Testing

Jest unit tests (JSII default):

1. `FilteringTagAspect` applies tags when filter returns `true`
2. `FilteringTagAspect` skips tags when filter returns `false`
3. `AwsAiWorkloadTagAspect` tags a `CfnResource` with type `AWS::Bedrock::Agent`
4. `AwsAiWorkloadTagAspect` does NOT tag a `CfnResource` with type `AWS::S3::Bucket`

## Publishing

- JSII TypeScript project
- `jsii-pacmak` generates Python, Java, Go, .NET packages
- npm package name: `cdk-tagging-aspects`
- GitHub Actions: run tests on PR, publish to npm (and other registries) on tag push
