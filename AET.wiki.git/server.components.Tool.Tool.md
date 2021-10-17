# Class: Tool<A, I\>

[server/components/Tool](../wiki/server.components.Tool).Tool

## Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`ToolAttributes`](../wiki/server.components.Tool.ToolAttributes) |
| `I` | extends [`ToolInstance`](../wiki/server.components.Tool.ToolInstance) |

## Hierarchy

- `BaseComponent`<`A`, `I`\>

  ↳ **`Tool`**

  ↳↳ [`Essential`](../wiki/server.components.Essential.Essential)

## Implements

- `OnStart`

## Table of contents

### Constructors

- [constructor](../wiki/server.components.Tool.Tool#constructor)

### Properties

- [Actions](../wiki/server.components.Tool.Tool#actions)
- [ButtonedInputInfo](../wiki/server.components.Tool.Tool#buttonedinputinfo)
- [InputInfo](../wiki/server.components.Tool.Tool#inputinfo)
- [Player](../wiki/server.components.Tool.Tool#player)
- [attributes](../wiki/server.components.Tool.Tool#attributes)
- [id](../wiki/server.components.Tool.Tool#id)
- [instance](../wiki/server.components.Tool.Tool#instance)
- [janitor](../wiki/server.components.Tool.Tool#janitor)
- [maid](../wiki/server.components.Tool.Tool#maid)
- [state](../wiki/server.components.Tool.Tool#state)
- [stateChanged](../wiki/server.components.Tool.Tool#statechanged)
- [timeCreated](../wiki/server.components.Tool.Tool#timecreated)

### Methods

- [AddAction](../wiki/server.components.Tool.Tool#addaction)
- [GetActionInfo](../wiki/server.components.Tool.Tool#getactioninfo)
- [Init](../wiki/server.components.Tool.Tool#init)
- [InitPlayer](../wiki/server.components.Tool.Tool#initplayer)
- [InitWorkspace](../wiki/server.components.Tool.Tool#initworkspace)
- [Input](../wiki/server.components.Tool.Tool#input)
- [ManageAncestry](../wiki/server.components.Tool.Tool#manageancestry)
- [ManageButtons](../wiki/server.components.Tool.Tool#managebuttons)
- [PlayerInit](../wiki/server.components.Tool.Tool#playerinit)
- [RequirePlayer](../wiki/server.components.Tool.Tool#requireplayer)
- [SetupInput](../wiki/server.components.Tool.Tool#setupinput)
- [UpdateAncestry](../wiki/server.components.Tool.Tool#updateancestry)
- [UpdateButtons](../wiki/server.components.Tool.Tool#updatebuttons)
- [destroy](../wiki/server.components.Tool.Tool#destroy)
- [fillButtonsInTable](../wiki/server.components.Tool.Tool#fillbuttonsintable)
- [getState](../wiki/server.components.Tool.Tool#getstate)
- [isButton](../wiki/server.components.Tool.Tool#isbutton)
- [onAttributeChanged](../wiki/server.components.Tool.Tool#onattributechanged)
- [onStart](../wiki/server.components.Tool.Tool#onstart)
- [setAttribute](../wiki/server.components.Tool.Tool#setattribute)
- [setInstance](../wiki/server.components.Tool.Tool#setinstance)
- [setState](../wiki/server.components.Tool.Tool#setstate)

## Constructors

### constructor

• **new Tool**<`A`, `I`\>()

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`ToolAttributes`](../wiki/server.components.Tool.ToolAttributes) |
| `I` | extends [`ToolInstance`](../wiki/server.components.Tool.ToolInstance)<`I`\> |

#### Inherited from

BaseComponent<A, I\>.constructor

## Properties

### Actions

• `Abstract` **Actions**: [`Actions`](../wiki/server.components.Tool.Actions)

#### Defined in

src/server/components/Tool.ts:54

___

### ButtonedInputInfo

• `Private` `Optional` **ButtonedInputInfo**: [`InputInfo`](../wiki/server.components.Tool#inputinfo)

#### Defined in

src/server/components/Tool.ts:60

___

### InputInfo

• `Abstract` **InputInfo**: [`InputInfo`](../wiki/server.components.Tool#inputinfo)

#### Defined in

src/server/components/Tool.ts:55

___

### Player

• `Optional` **Player**: `Player`

#### Defined in

src/server/components/Tool.ts:64

___

### attributes

• **attributes**: `A`

Attributes attached to this instance.

#### Inherited from

BaseComponent.attributes

#### Defined in

node_modules/@flamework/components/out/index.d.ts:20

___

### id

• **id**: `string`

#### Defined in

src/server/components/Tool.ts:61

___

### instance

• **instance**: `I`

The instance this component is attached to.
This should only be called in a component lifecycle event.

#### Inherited from

BaseComponent.instance

#### Defined in

node_modules/@flamework/components/out/index.d.ts:25

___

### janitor

• `Protected` **janitor**: `Janitor`<`void`\>

#### Defined in

src/server/components/Tool.ts:59

___

### maid

• **maid**: `Maid`

A maid that will be destroyed when the component is.

#### Inherited from

BaseComponent.maid

#### Defined in

node_modules/@flamework/components/out/index.d.ts:16

___

### state

• **state**: `string` = `"nil"`

#### Defined in

src/server/components/Tool.ts:62

___

### stateChanged

• **stateChanged**: `Signal`<`fn`, ``false``\>

#### Defined in

src/server/components/Tool.ts:65

___

### timeCreated

• **timeCreated**: `number`

#### Defined in

src/server/components/Tool.ts:63

## Methods

### AddAction

▸ `Private` **AddAction**(`Action`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `Action` | [`Action`](../wiki/server.modules.Action.Action) |

#### Returns

`void`

#### Defined in

src/server/components/Tool.ts:168

___

### GetActionInfo

▸ `Private` **GetActionInfo**(`toolState`, `input`): `undefined` \| [`ActionInfo`](../wiki/server.components.Tool#actioninfo)

#### Parameters

| Name | Type |
| :------ | :------ |
| `toolState` | `string` |
| `input` | `Object` |
| `input.Input` | `string` |
| `input.State` | `string` |

#### Returns

`undefined` \| [`ActionInfo`](../wiki/server.components.Tool#actioninfo)

#### Defined in

src/server/components/Tool.ts:172

___

### Init

▸ `Optional` `Abstract` **Init**(): `void`

#### Returns

`void`

#### Defined in

src/server/components/Tool.ts:56

___

### InitPlayer

▸ `Private` **InitPlayer**(): `void`

#### Returns

`void`

#### Defined in

src/server/components/Tool.ts:130

___

### InitWorkspace

▸ `Private` **InitWorkspace**(): `void`

#### Returns

`void`

#### Defined in

src/server/components/Tool.ts:140

___

### Input

▸ `Private` **Input**(`state`, `input`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `string` |
| `input` | `Object` |
| `input.Input` | `string` |
| `input.State` | `string` |

#### Returns

`void`

#### Defined in

src/server/components/Tool.ts:154

___

### ManageAncestry

▸ `Private` **ManageAncestry**(): `void`

#### Returns

`void`

#### Defined in

src/server/components/Tool.ts:103

___

### ManageButtons

▸ `Private` **ManageButtons**(): `void`

#### Returns

`void`

#### Defined in

src/server/components/Tool.ts:92

___

### PlayerInit

▸ `Optional` `Abstract` **PlayerInit**(): `void`

#### Returns

`void`

#### Defined in

src/server/components/Tool.ts:57

___

### RequirePlayer

▸ `Private` **RequirePlayer**(): `Player`

#### Returns

`Player`

#### Defined in

src/server/components/Tool.ts:122

___

### SetupInput

▸ `Private` **SetupInput**(): `RBXScriptConnection`

#### Returns

`RBXScriptConnection`

#### Defined in

src/server/components/Tool.ts:144

___

### UpdateAncestry

▸ `Private` **UpdateAncestry**(): `void`

#### Returns

`void`

#### Defined in

src/server/components/Tool.ts:108

___

### UpdateButtons

▸ `Private` **UpdateButtons**(): `void`

updates the ButtonedInputInfo to be accurate to newly assigned buttons

#### Returns

`void`

#### Defined in

src/server/components/Tool.ts:189

___

### destroy

▸ **destroy**(): `void`

Destroys this component instance.

#### Returns

`void`

#### Inherited from

BaseComponent.destroy

#### Defined in

node_modules/@flamework/components/out/index.d.ts:39

___

### fillButtonsInTable

▸ `Private` **fillButtonsInTable**<`T`\>(`Table`): `T`

Takes in a table and loops through its indexes and values. Ensures that all of it's indexes if buttons are set to their actual attribute value and if any of it's values are tables that their indexes are also checked and made sure that any buttons in their indexes are set to their actual attribute values aswell.

**`example`**

```typescript
const Table: InputInfo = {
		Holstered: {
			Begin: {
				BUTTON_TOGGLE: {
					Action = "Equip"
				}
			}
		}
}

const ButtonedInputInfo = fillButtonsInTable(Table) where this.attributes = { BUTTON_TOGGLE: "One" } // "One" being representative of the 1 key on the keyboard

// what ButtonedInputInfo is equal to:
// notice the purpose is to remove all BUTTON_ and replace them with their actual value
{
		Holstered: {
			Begin: {
				One: {
					Action = "Equip"
				}
			}
		}
	}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `Table` | `T` | a table which has a string index |

#### Returns

`T`

A Table who's indexes if buttons were replaced by their actual value

#### Defined in

src/server/components/Tool.ts:228

___

### getState

▸ **getState**(): `string`

#### Returns

`string`

#### Defined in

src/server/components/Tool.ts:67

___

### isButton

▸ `Private` **isButton**(`str`): `boolean`

returns if the string is an identifier for a button

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`boolean`

#### Defined in

src/server/components/Tool.ts:251

___

### onAttributeChanged

▸ **onAttributeChanged**<`K`\>(`name`, `cb`): `void`

Connect a callback to the change of a specific attribute.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `K` | The name of the attribute |
| `cb` | (`newValue`: `A`[`K`], `oldValue`: `A`[`K`]) => `void` | The callback |

#### Returns

`void`

#### Inherited from

BaseComponent.onAttributeChanged

#### Defined in

node_modules/@flamework/components/out/index.d.ts:35

___

### onStart

▸ **onStart**(): `void`

#### Returns

`void`

#### Implementation of

OnStart.onStart

#### Defined in

src/server/components/Tool.ts:76

___

### setAttribute

▸ **setAttribute**<`T`\>(`key`, `value`, `postfix?`): `A`[`T`]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `T` |
| `value` | `A`[`T`] |
| `postfix?` | `boolean` |

#### Returns

`A`[`T`]

#### Inherited from

BaseComponent.setAttribute

#### Defined in

node_modules/@flamework/components/out/index.d.ts:27

___

### setInstance

▸ **setInstance**(`instance`, `attributes`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | `I` |
| `attributes` | `unknown` |

#### Returns

`void`

#### Inherited from

BaseComponent.setInstance

#### Defined in

node_modules/@flamework/components/out/index.d.ts:26

___

### setState

▸ **setState**(`state`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `string` |

#### Returns

`void`

#### Defined in

src/server/components/Tool.ts:71
