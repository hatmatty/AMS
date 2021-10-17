# Class: ToolService

[server/services/ToolService](../wiki/server.services.ToolService).ToolService

## Implements

- `OnInit`

## Table of contents

### Constructors

- [constructor](../wiki/server.services.ToolService.ToolService#constructor)

### Properties

- [store](../wiki/server.services.ToolService.ToolService#store)

### Methods

- [InitStore](../wiki/server.services.ToolService.ToolService#initstore)
- [InitTool](../wiki/server.services.ToolService.ToolService#inittool)
- [addTool](../wiki/server.services.ToolService.ToolService#addtool)
- [onInit](../wiki/server.services.ToolService.ToolService#oninit)

## Constructors

### constructor

• **new ToolService**()

## Properties

### store

• **store**: `Store`<[`State`](../wiki/server.services.ToolService.State), `Actions`\>

#### Defined in

[src/server/services/ToolService.ts:107](https://github.com/hatmatty/AET/blob/5e435eb/src/server/services/ToolService.ts#L107)

## Methods

### InitStore

▸ `Private` **InitStore**(): `void`

#### Returns

`void`

#### Defined in

[src/server/services/ToolService.ts:113](https://github.com/hatmatty/AET/blob/5e435eb/src/server/services/ToolService.ts#L113)

___

### InitTool

▸ **InitTool**(`tool`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `tool` | [`ITool`](../wiki/server.components.Tool#itool) |

#### Returns

`void`

#### Defined in

[src/server/services/ToolService.ts:132](https://github.com/hatmatty/AET/blob/5e435eb/src/server/services/ToolService.ts#L132)

___

### addTool

▸ **addTool**(`toolName`, `parent`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `toolName` | ``"Shield"`` \| ``"Kopis"`` \| ``"Sparta"`` \| ``"Athens"`` |
| `parent` | `Instance` \| `Player` |

#### Returns

`void`

#### Defined in

[src/server/services/ToolService.ts:158](https://github.com/hatmatty/AET/blob/5e435eb/src/server/services/ToolService.ts#L158)

___

### onInit

▸ **onInit**(): `void`

#### Returns

`void`

#### Implementation of

OnInit.onInit

#### Defined in

[src/server/services/ToolService.ts:109](https://github.com/hatmatty/AET/blob/5e435eb/src/server/services/ToolService.ts#L109)
