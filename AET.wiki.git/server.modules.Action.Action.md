# Class: Action

[server/modules/Action](../wiki/server.modules.Action).Action

Groups a start and end function into an action which is utilized through the .Started and .Ended connections to track the state of the action.

**`typeparm`** T - The tool that this action will be used on.

## Table of contents

### Constructors

- [constructor](../wiki/server.modules.Action.Action#constructor)

### Properties

- [Ended](../wiki/server.modules.Action.Action#ended)
- [Started](../wiki/server.modules.Action.Action#started)
- [Status](../wiki/server.modules.Action.Action#status)
- [\_end](../wiki/server.modules.Action.Action#_end)
- [\_start](../wiki/server.modules.Action.Action#_start)
- [janitor](../wiki/server.modules.Action.Action#janitor)
- [state](../wiki/server.modules.Action.Action#state)

### Methods

- [End](../wiki/server.modules.Action.Action#end)
- [Start](../wiki/server.modules.Action.Action#start)

## Constructors

### constructor

• **new Action**(`Start`, `End?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `Start` | (`End`: `Callback`, `janitor`: `Janitor`<`void`\>) => `void` |
| `End?` | () => `void` |

#### Defined in

[src/server/modules/Action.ts:29](https://github.com/hatmatty/AET/blob/5e435eb/src/server/modules/Action.ts#L29)

## Properties

### Ended

• **Ended**: `Signal`<`fn`, ``false``\>

use this to connect to when the tool ends

#### Defined in

[src/server/modules/Action.ts:18](https://github.com/hatmatty/AET/blob/5e435eb/src/server/modules/Action.ts#L18)

___

### Started

• **Started**: `Signal`<`fn`, ``false``\>

use this to connect to when the tool starts

#### Defined in

[src/server/modules/Action.ts:16](https://github.com/hatmatty/AET/blob/5e435eb/src/server/modules/Action.ts#L16)

___

### Status

• **Status**: `undefined` \| ``"STARTED"`` \| ``"ENDED"``

use this to find whether the action has began / ended

#### Defined in

[src/server/modules/Action.ts:14](https://github.com/hatmatty/AET/blob/5e435eb/src/server/modules/Action.ts#L14)

___

### \_end

• `Optional` **\_end**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[src/server/modules/Action.ts:27](https://github.com/hatmatty/AET/blob/5e435eb/src/server/modules/Action.ts#L27)

___

### \_start

• **\_start**: (`End`: `Callback`, `janitor`: `Janitor`<`void`\>) => `void`

#### Type declaration

▸ (`End`, `janitor`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `End` | `Callback` |
| `janitor` | `Janitor`<`void`\> |

##### Returns

`void`

#### Defined in

[src/server/modules/Action.ts:26](https://github.com/hatmatty/AET/blob/5e435eb/src/server/modules/Action.ts#L26)

___

### janitor

• `Protected` **janitor**: `Janitor`<`void`\>

many actions use a janitor so one is added by default

#### Defined in

[src/server/modules/Action.ts:20](https://github.com/hatmatty/AET/blob/5e435eb/src/server/modules/Action.ts#L20)

___

### state

• `Protected` `Optional` **state**: `Object`

#### Index signature

▪ [index: `string`]: `string` \| `number`

#### Defined in

[src/server/modules/Action.ts:22](https://github.com/hatmatty/AET/blob/5e435eb/src/server/modules/Action.ts#L22)

## Methods

### End

▸ **End**(): `void`

calls the _end() function, sets the status to "ENDED" and fires the Ended signal

#### Returns

`void`

#### Defined in

[src/server/modules/Action.ts:49](https://github.com/hatmatty/AET/blob/5e435eb/src/server/modules/Action.ts#L49)

___

### Start

▸ **Start**(): `void`

calls the _start() function, sets the status to "STARTED" and fires the Started signal

#### Returns

`void`

#### Defined in

[src/server/modules/Action.ts:37](https://github.com/hatmatty/AET/blob/5e435eb/src/server/modules/Action.ts#L37)
