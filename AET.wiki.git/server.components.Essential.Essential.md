# Class: Essential<A, I\>

[server/components/Essential](../wiki/server.components.Essential).Essential

## Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`ToolAttributes`](../wiki/server.components.Tool.ToolAttributes) |
| `I` | extends [`ToolInstance`](../wiki/server.components.Tool.ToolInstance) |

## Hierarchy

- [`Tool`](../wiki/server.components.Tool.Tool)<`A`, `I`\>

  ↳ **`Essential`**

  ↳↳ [`Shield`](../wiki/server.components.Shield.Shield)

  ↳↳ [`Weapon`](../wiki/server.components.Weapon.Weapon)

## Table of contents

### Constructors

- [constructor](../wiki/server.components.Essential.Essential#constructor)

### Properties

- [Actions](../wiki/server.components.Essential.Essential#actions)
- [Disable](../wiki/server.components.Essential.Essential#disable)
- [DisableAnimation](../wiki/server.components.Essential.Essential#disableanimation)
- [DisabledLimb](../wiki/server.components.Essential.Essential#disabledlimb)
- [Enable](../wiki/server.components.Essential.Essential#enable)
- [EnableAnimation](../wiki/server.components.Essential.Essential#enableanimation)
- [EnabledLimb](../wiki/server.components.Essential.Essential#enabledlimb)
- [EssentialAnimation](../wiki/server.components.Essential.Essential#essentialanimation)
- [InputInfo](../wiki/server.components.Essential.Essential#inputinfo)
- [Motor6D](../wiki/server.components.Essential.Essential#motor6d)
- [Player](../wiki/server.components.Essential.Essential#player)
- [attributes](../wiki/server.components.Essential.Essential#attributes)
- [id](../wiki/server.components.Essential.Essential#id)
- [instance](../wiki/server.components.Essential.Essential#instance)
- [janitor](../wiki/server.components.Essential.Essential#janitor)
- [maid](../wiki/server.components.Essential.Essential#maid)
- [state](../wiki/server.components.Essential.Essential#state)
- [stateChanged](../wiki/server.components.Essential.Essential#statechanged)
- [timeCreated](../wiki/server.components.Essential.Essential#timecreated)

### Methods

- [GetLimb](../wiki/server.components.Essential.Essential#getlimb)
- [Init](../wiki/server.components.Essential.Essential#init)
- [PlayerInit](../wiki/server.components.Essential.Essential#playerinit)
- [SetMotor6D](../wiki/server.components.Essential.Essential#setmotor6d)
- [Setup](../wiki/server.components.Essential.Essential#setup)
- [create](../wiki/server.components.Essential.Essential#create)
- [destroy](../wiki/server.components.Essential.Essential#destroy)
- [getState](../wiki/server.components.Essential.Essential#getstate)
- [onAttributeChanged](../wiki/server.components.Essential.Essential#onattributechanged)
- [onStart](../wiki/server.components.Essential.Essential#onstart)
- [setAttribute](../wiki/server.components.Essential.Essential#setattribute)
- [setInstance](../wiki/server.components.Essential.Essential#setinstance)
- [setState](../wiki/server.components.Essential.Essential#setstate)

## Constructors

### constructor

• **new Essential**<`A`, `I`\>()

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends [`ToolAttributes`](../wiki/server.components.Tool.ToolAttributes) |
| `I` | extends [`ToolInstance`](../wiki/server.components.Tool.ToolInstance)<`I`\> |

#### Inherited from

[Tool](../wiki/server.components.Tool.Tool).[constructor](../wiki/server.components.Tool.Tool#constructor)

## Properties

### Actions

• **Actions**: [`Actions`](../wiki/server.components.Tool.Actions)

#### Overrides

[Tool](../wiki/server.components.Tool.Tool).[Actions](../wiki/server.components.Tool.Tool#actions)

#### Defined in

[src/server/components/Essential.ts:113](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L113)

___

### Disable

• **Disable**: (`End`: `Callback`) => `void`

#### Type declaration

▸ (`End`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `End` | `Callback` |

##### Returns

`void`

#### Defined in

[src/server/components/Essential.ts:111](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L111)

___

### DisableAnimation

• `Protected` `Abstract` **DisableAnimation**: `number`

#### Defined in

[src/server/components/Essential.ts:10](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L10)

___

### DisabledLimb

• `Protected` `Abstract` **DisabledLimb**: [`CharacterLimb`](../wiki/shared.types#characterlimb)

#### Defined in

[src/server/components/Essential.ts:12](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L12)

___

### Enable

• **Enable**: (`End`: `Callback`) => `void`

#### Type declaration

▸ (`End`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `End` | `Callback` |

##### Returns

`void`

#### Defined in

[src/server/components/Essential.ts:109](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L109)

___

### EnableAnimation

• `Protected` `Abstract` **EnableAnimation**: `number`

#### Defined in

[src/server/components/Essential.ts:9](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L9)

___

### EnabledLimb

• `Protected` `Abstract` **EnabledLimb**: [`CharacterLimb`](../wiki/shared.types#characterlimb)

#### Defined in

[src/server/components/Essential.ts:11](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L11)

___

### EssentialAnimation

• `Private` `Optional` **EssentialAnimation**: `AnimationTrack`

#### Defined in

[src/server/components/Essential.ts:14](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L14)

___

### InputInfo

• **InputInfo**: [`InputInfo`](../wiki/server.components.Tool#inputinfo)

#### Overrides

[Tool](../wiki/server.components.Tool.Tool).[InputInfo](../wiki/server.components.Tool.Tool#inputinfo)

#### Defined in

[src/server/components/Essential.ts:17](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L17)

___

### Motor6D

• `Private` `Optional` **Motor6D**: `Motor6D`

#### Defined in

[src/server/components/Essential.ts:15](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L15)

___

### Player

• `Optional` **Player**: `Player`

#### Inherited from

[Tool](../wiki/server.components.Tool.Tool).[Player](../wiki/server.components.Tool.Tool#player)

#### Defined in

src/server/components/Tool.ts:64

___

### attributes

• **attributes**: `A`

Attributes attached to this instance.

#### Inherited from

[Tool](../wiki/server.components.Tool.Tool).[attributes](../wiki/server.components.Tool.Tool#attributes)

#### Defined in

node_modules/@flamework/components/out/index.d.ts:20

___

### id

• **id**: `string`

#### Inherited from

[Tool](../wiki/server.components.Tool.Tool).[id](../wiki/server.components.Tool.Tool#id)

#### Defined in

src/server/components/Tool.ts:61

___

### instance

• **instance**: `I`

The instance this component is attached to.
This should only be called in a component lifecycle event.

#### Inherited from

[Tool](../wiki/server.components.Tool.Tool).[instance](../wiki/server.components.Tool.Tool#instance)

#### Defined in

node_modules/@flamework/components/out/index.d.ts:25

___

### janitor

• `Protected` **janitor**: `Janitor`<`void`\>

#### Inherited from

[Tool](../wiki/server.components.Tool.Tool).[janitor](../wiki/server.components.Tool.Tool#janitor)

#### Defined in

src/server/components/Tool.ts:59

___

### maid

• **maid**: `Maid`

A maid that will be destroyed when the component is.

#### Inherited from

[Tool](../wiki/server.components.Tool.Tool).[maid](../wiki/server.components.Tool.Tool#maid)

#### Defined in

node_modules/@flamework/components/out/index.d.ts:16

___

### state

• **state**: `string` = `"nil"`

#### Inherited from

[Tool](../wiki/server.components.Tool.Tool).[state](../wiki/server.components.Tool.Tool#state)

#### Defined in

src/server/components/Tool.ts:62

___

### stateChanged

• **stateChanged**: `Signal`<`fn`, ``false``\>

#### Inherited from

[Tool](../wiki/server.components.Tool.Tool).[stateChanged](../wiki/server.components.Tool.Tool#statechanged)

#### Defined in

src/server/components/Tool.ts:65

___

### timeCreated

• **timeCreated**: `number`

#### Inherited from

[Tool](../wiki/server.components.Tool.Tool).[timeCreated](../wiki/server.components.Tool.Tool#timecreated)

#### Defined in

src/server/components/Tool.ts:63

## Methods

### GetLimb

▸ `Private` **GetLimb**(`limbName`): `BasePart`

#### Parameters

| Name | Type |
| :------ | :------ |
| `limbName` | [`CharacterLimb`](../wiki/shared.types#characterlimb) |

#### Returns

`BasePart`

#### Defined in

[src/server/components/Essential.ts:41](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L41)

___

### Init

▸ `Optional` `Abstract` **Init**(): `void`

#### Returns

`void`

#### Inherited from

[Tool](../wiki/server.components.Tool.Tool).[Init](../wiki/server.components.Tool.Tool#init)

#### Defined in

src/server/components/Tool.ts:56

___

### PlayerInit

▸ `Optional` `Abstract` **PlayerInit**(): `void`

#### Returns

`void`

#### Inherited from

[Tool](../wiki/server.components.Tool.Tool).[PlayerInit](../wiki/server.components.Tool.Tool#playerinit)

#### Defined in

src/server/components/Tool.ts:57

___

### SetMotor6D

▸ `Private` **SetMotor6D**(`limb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `limb` | `BasePart` |

#### Returns

`void`

#### Defined in

[src/server/components/Essential.ts:61](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L61)

___

### Setup

▸ `Private` **Setup**(): `void`

#### Returns

`void`

#### Defined in

[src/server/components/Essential.ts:71](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L71)

___

### create

▸ `Private` **create**(`option`): (`End`: `Callback`) => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | ``"Enable"`` \| ``"Disable"`` |

#### Returns

`fn`

▸ (`End`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `End` | `Callback` |

##### Returns

`void`

#### Defined in

[src/server/components/Essential.ts:80](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L80)

___

### destroy

▸ **destroy**(): `void`

Destroys this component instance.

#### Returns

`void`

#### Inherited from

[Tool](../wiki/server.components.Tool.Tool).[destroy](../wiki/server.components.Tool.Tool#destroy)

#### Defined in

node_modules/@flamework/components/out/index.d.ts:39

___

### getState

▸ **getState**(): `string`

#### Returns

`string`

#### Inherited from

[Tool](../wiki/server.components.Tool.Tool).[getState](../wiki/server.components.Tool.Tool#getstate)

#### Defined in

src/server/components/Tool.ts:67

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

[Tool](../wiki/server.components.Tool.Tool).[onAttributeChanged](../wiki/server.components.Tool.Tool#onattributechanged)

#### Defined in

node_modules/@flamework/components/out/index.d.ts:35

___

### onStart

▸ **onStart**(): `void`

#### Returns

`void`

#### Inherited from

[Tool](../wiki/server.components.Tool.Tool).[onStart](../wiki/server.components.Tool.Tool#onstart)

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

[Tool](../wiki/server.components.Tool.Tool).[setAttribute](../wiki/server.components.Tool.Tool#setattribute)

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

[Tool](../wiki/server.components.Tool.Tool).[setInstance](../wiki/server.components.Tool.Tool#setinstance)

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

#### Inherited from

[Tool](../wiki/server.components.Tool.Tool).[setState](../wiki/server.components.Tool.Tool#setstate)

#### Defined in

src/server/components/Tool.ts:71
