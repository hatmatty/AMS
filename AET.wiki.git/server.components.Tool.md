# Module: server/components/Tool

## Table of contents

### Classes

- [Tool](../wiki/server.components.Tool.Tool)

### Interfaces

- [Actions](../wiki/server.components.Tool.Actions)
- [ToolAttributes](../wiki/server.components.Tool.ToolAttributes)
- [ToolInstance](../wiki/server.components.Tool.ToolInstance)

### Type aliases

- [ActionInfo](../wiki/server.components.Tool#actioninfo)
- [ITool](../wiki/server.components.Tool#itool)
- [InputInfo](../wiki/server.components.Tool#inputinfo)

### Variables

- [ToolAdded](../wiki/server.components.Tool#tooladded)

## Type aliases

### ActionInfo

Ƭ **ActionInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Action` | `string` |
| `Mobile?` | `Object` |

#### Defined in

src/server/components/Tool.ts:17

___

### ITool

Ƭ **ITool**: [`Tool`](../wiki/server.components.Tool.Tool)<[`ToolAttributes`](../wiki/server.components.Tool.ToolAttributes), [`ToolInstance`](../wiki/server.components.Tool.ToolInstance)\>

#### Defined in

src/server/components/Tool.ts:15

___

### InputInfo

Ƭ **InputInfo**: `Object`

#### Index signature

▪ [toolState: `string`]: { [UserInputState: string]: { [UserInput: string]: [`ActionInfo`](../wiki/server.components.Tool#actioninfo);  };  }

#### Defined in

src/server/components/Tool.ts:22

## Variables

### ToolAdded

• **ToolAdded**: `Signal`<`ToolSignal`, ``false``\>

#### Defined in

src/server/components/Tool.ts:46
