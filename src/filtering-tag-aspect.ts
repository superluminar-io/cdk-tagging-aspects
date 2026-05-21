import { IAspect, CfnResource, TagManager } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';

export interface IResourceFilter {
  /**
   * Called for every node in the construct tree, including non-CfnResource nodes.
   * Implementations should check node type before accessing CfnResource-specific APIs.
   */
  matches(node: IConstruct): boolean;
}

export class FilteringTagAspect implements IAspect {
  private readonly tags: { [key: string]: string };
  private readonly filter: IResourceFilter;

  constructor(tags: { [key: string]: string }, filter: IResourceFilter) {
    this.tags = tags;
    this.filter = filter;
  }

  public visit(node: IConstruct): void {
    if (!this.filter.matches(node)) return;
    if (!CfnResource.isCfnResource(node)) return;
    if (!TagManager.isTaggable(node)) return;
    for (const [key, value] of Object.entries(this.tags)) {
      node.tags.setTag(key, value);
    }
  }
}
