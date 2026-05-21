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

CDK invokes `visit` on every node in the construct tree automatically — no manual recursion needed. `visit` calls `filter.matches(node)` and, if `true` and the node is a `CfnResource`, applies each tag via `TagManager.of(node).setTag(key, value)`. Using `TagManager.of()` (rather than `TagManager.isTaggable()`) handles both `ITaggable` and `ITaggableV2` resources — Bedrock implements `ITaggableV2`.

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

- JSII TypeScript project; `jsii-pacmak` generates Python, Java, Go, .NET packages (non-npm registries deferred)
- npm package name: `@superluminar-io/cdk-tagging-aspects`
- OIDC keyless npm publishing via `NPM_TRUSTED_PUBLISHER=true` (no `NPM_TOKEN` stored in GitHub Secrets)
- npmjs.com must have GitHub Actions configured as a trusted publisher for the package

## Release Process

Releases are explicit and human-approved. No push to `main` triggers a release automatically.

### Versioning principles

| Change type | Bump |
|---|---|
| Breaking public API change | major |
| New method on an open class, new optional parameter, new aspect/filter class | minor |
| Bug fix, dependency update, no API change | patch |

Note: adding a new AWS service prefix to `AwsAiWorkloadTagAspect` (e.g., a new AI service) is **minor** — it is new taggable functionality that existing code does not break.

### Workflow

1. **Create a release PR** — run the `create-release-pr` workflow in GitHub Actions (`Actions → create-release-pr → Run workflow`). Select bump type (`auto` = detect from commit history, or override with `patch`/`minor`/`major`). The workflow:
   - Analyses conventional commits since the last tag to determine the recommended bump type
   - Computes the next version
   - Creates a branch `release/vX.Y.Z` with a single empty conventional commit encoding the bump type
   - Opens a PR titled `chore: release vX.Y.Z (patch|minor|major)`

2. **Review and merge** — inspect the PR (it lists commits since last release). Use **squash merge** to preserve the conventional commit message on `main`.

3. **Automatic publish** — the `release-on-merge` workflow detects the squash-merged release commit on `main` and triggers `release.yml` via `workflow_dispatch`. `release.yml` runs `npx projen release`, which uses standard-version to bump the version, update `CHANGELOG.md`, build and package the JSII artifacts, then publishes to npm and creates a GitHub Release.

### Commit convention (for accurate bump detection)

Use conventional commit prefixes so `create-release-pr` can propose the right bump:

- `fix: ` → patch
- `feat: ` → minor
- `feat!: ` or `BREAKING CHANGE` in commit body → major
- `chore: `, `docs: `, `test: ` → no bump (patch is used as fallback)

### Re-enabling other registries

PyPI, Maven, NuGet, and Go publishing are disabled until registry accounts are set up. To re-enable, add the corresponding `publishTo*` block to `.projenrc.ts` (see comments) and run `npx projen`.
