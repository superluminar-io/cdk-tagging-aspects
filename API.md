# API Reference <a name="API Reference" id="api-reference"></a>



## Classes <a name="Classes" id="Classes"></a>

### AwsAiWorkloadTagAspect <a name="AwsAiWorkloadTagAspect" id="@superluminar-io/cdk-tagging-aspects.AwsAiWorkloadTagAspect"></a>

#### Initializers <a name="Initializers" id="@superluminar-io/cdk-tagging-aspects.AwsAiWorkloadTagAspect.Initializer"></a>

```typescript
import { AwsAiWorkloadTagAspect } from '@superluminar-io/cdk-tagging-aspects'

new AwsAiWorkloadTagAspect(tags: {[ key: string ]: string})
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@superluminar-io/cdk-tagging-aspects.AwsAiWorkloadTagAspect.Initializer.parameter.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |

---

##### `tags`<sup>Required</sup> <a name="tags" id="@superluminar-io/cdk-tagging-aspects.AwsAiWorkloadTagAspect.Initializer.parameter.tags"></a>

- *Type:* {[ key: string ]: string}

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@superluminar-io/cdk-tagging-aspects.AwsAiWorkloadTagAspect.visit">visit</a></code> | All aspects can visit an IConstruct. |

---

##### `visit` <a name="visit" id="@superluminar-io/cdk-tagging-aspects.AwsAiWorkloadTagAspect.visit"></a>

```typescript
public visit(node: IConstruct): void
```

All aspects can visit an IConstruct.

###### `node`<sup>Required</sup> <a name="node" id="@superluminar-io/cdk-tagging-aspects.AwsAiWorkloadTagAspect.visit.parameter.node"></a>

- *Type:* constructs.IConstruct

---




### FilteringTagAspect <a name="FilteringTagAspect" id="@superluminar-io/cdk-tagging-aspects.FilteringTagAspect"></a>

- *Implements:* aws-cdk-lib.IAspect

#### Initializers <a name="Initializers" id="@superluminar-io/cdk-tagging-aspects.FilteringTagAspect.Initializer"></a>

```typescript
import { FilteringTagAspect } from '@superluminar-io/cdk-tagging-aspects'

new FilteringTagAspect(tags: {[ key: string ]: string}, filter: IResourceFilter)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@superluminar-io/cdk-tagging-aspects.FilteringTagAspect.Initializer.parameter.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |
| <code><a href="#@superluminar-io/cdk-tagging-aspects.FilteringTagAspect.Initializer.parameter.filter">filter</a></code> | <code><a href="#@superluminar-io/cdk-tagging-aspects.IResourceFilter">IResourceFilter</a></code> | *No description.* |

---

##### `tags`<sup>Required</sup> <a name="tags" id="@superluminar-io/cdk-tagging-aspects.FilteringTagAspect.Initializer.parameter.tags"></a>

- *Type:* {[ key: string ]: string}

---

##### `filter`<sup>Required</sup> <a name="filter" id="@superluminar-io/cdk-tagging-aspects.FilteringTagAspect.Initializer.parameter.filter"></a>

- *Type:* <a href="#@superluminar-io/cdk-tagging-aspects.IResourceFilter">IResourceFilter</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@superluminar-io/cdk-tagging-aspects.FilteringTagAspect.visit">visit</a></code> | All aspects can visit an IConstruct. |

---

##### `visit` <a name="visit" id="@superluminar-io/cdk-tagging-aspects.FilteringTagAspect.visit"></a>

```typescript
public visit(node: IConstruct): void
```

All aspects can visit an IConstruct.

###### `node`<sup>Required</sup> <a name="node" id="@superluminar-io/cdk-tagging-aspects.FilteringTagAspect.visit.parameter.node"></a>

- *Type:* constructs.IConstruct

---




## Protocols <a name="Protocols" id="Protocols"></a>

### IResourceFilter <a name="IResourceFilter" id="@superluminar-io/cdk-tagging-aspects.IResourceFilter"></a>

- *Implemented By:* <a href="#@superluminar-io/cdk-tagging-aspects.IResourceFilter">IResourceFilter</a>

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@superluminar-io/cdk-tagging-aspects.IResourceFilter.matches">matches</a></code> | Called for every node in the construct tree, including non-CfnResource nodes. |

---

##### `matches` <a name="matches" id="@superluminar-io/cdk-tagging-aspects.IResourceFilter.matches"></a>

```typescript
public matches(node: IConstruct): boolean
```

Called for every node in the construct tree, including non-CfnResource nodes.

Implementations should check node type before accessing CfnResource-specific APIs.

###### `node`<sup>Required</sup> <a name="node" id="@superluminar-io/cdk-tagging-aspects.IResourceFilter.matches.parameter.node"></a>

- *Type:* constructs.IConstruct

---


