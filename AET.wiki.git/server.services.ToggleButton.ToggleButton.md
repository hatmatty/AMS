# Class: ToggleButton

[server/services/ToggleButton](../wiki/server.services.ToggleButton).ToggleButton

## Implements

- `OnInit`

## Table of contents

### Constructors

- [constructor](../wiki/server.services.ToggleButton.ToggleButton#constructor)

### Methods

- [ConfigureToggleButtons](../wiki/server.services.ToggleButton.ToggleButton#configuretogglebuttons)
- [GetPlayerFromUserName](../wiki/server.services.ToggleButton.ToggleButton#getplayerfromusername)
- [getOrder](../wiki/server.services.ToggleButton.ToggleButton#getorder)
- [onInit](../wiki/server.services.ToggleButton.ToggleButton#oninit)

## Constructors

### constructor

• **new ToggleButton**()

## Methods

### ConfigureToggleButtons

▸ `Private` **ConfigureToggleButtons**(`state`, `parent`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`State`](../wiki/server.services.ToolService.State) |
| `parent` | `string` |

#### Returns

`void`

#### Defined in

[src/server/services/ToggleButton.ts:15](https://github.com/hatmatty/AET/blob/5e435eb/src/server/services/ToggleButton.ts#L15)

___

### GetPlayerFromUserName

▸ `Private` **GetPlayerFromUserName**(`playerName`): `undefined` \| `Player`

#### Parameters

| Name | Type |
| :------ | :------ |
| `playerName` | `string` |

#### Returns

`undefined` \| `Player`

#### Defined in

[src/server/services/ToggleButton.ts:59](https://github.com/hatmatty/AET/blob/5e435eb/src/server/services/ToggleButton.ts#L59)

___

### getOrder

▸ `Private` **getOrder**(`tool`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `tool` | [`ITool`](../wiki/server.components.Tool#itool) |

#### Returns

`number`

#### Defined in

[src/server/services/ToggleButton.ts:52](https://github.com/hatmatty/AET/blob/5e435eb/src/server/services/ToggleButton.ts#L52)

___

### onInit

▸ **onInit**(): `void`

#### Returns

`void`

#### Implementation of

OnInit.onInit

#### Defined in

[src/server/services/ToggleButton.ts:10](https://github.com/hatmatty/AET/blob/5e435eb/src/server/services/ToggleButton.ts#L10)
