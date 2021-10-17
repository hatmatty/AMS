# Class: Weapon

[server/components/Weapon](../wiki/server.components.Weapon).Weapon

## Hierarchy

- [`Essential`](../wiki/server.components.Essential.Essential)<[`ToolAttributes`](../wiki/server.components.Tool.ToolAttributes), [`WeaponInstance`](../wiki/server.components.Weapon.WeaponInstance)\>

  ↳ **`Weapon`**

## Table of contents

### Constructors

- [constructor](../wiki/server.components.Weapon.Weapon#constructor)

### Properties

- [Actions](../wiki/server.components.Weapon.Weapon#actions)
- [ActiveAnimation](../wiki/server.components.Weapon.Weapon#activeanimation)
- [Damage](../wiki/server.components.Weapon.Weapon#damage)
- [Direction](../wiki/server.components.Weapon.Weapon#direction)
- [Disable](../wiki/server.components.Weapon.Weapon#disable)
- [DisableAnimation](../wiki/server.components.Weapon.Weapon#disableanimation)
- [DisabledLimb](../wiki/server.components.Weapon.Weapon#disabledlimb)
- [Enable](../wiki/server.components.Weapon.Weapon#enable)
- [EnableAnimation](../wiki/server.components.Weapon.Weapon#enableanimation)
- [EnabledLimb](../wiki/server.components.Weapon.Weapon#enabledlimb)
- [Hitbox](../wiki/server.components.Weapon.Weapon#hitbox)
- [InputInfo](../wiki/server.components.Weapon.Weapon#inputinfo)
- [Player](../wiki/server.components.Weapon.Weapon#player)
- [PlayerDirection](../wiki/server.components.Weapon.Weapon#playerdirection)
- [StoredAnimations](../wiki/server.components.Weapon.Weapon#storedanimations)
- [attributes](../wiki/server.components.Weapon.Weapon#attributes)
- [id](../wiki/server.components.Weapon.Weapon#id)
- [instance](../wiki/server.components.Weapon.Weapon#instance)
- [janitor](../wiki/server.components.Weapon.Weapon#janitor)
- [maid](../wiki/server.components.Weapon.Weapon#maid)
- [state](../wiki/server.components.Weapon.Weapon#state)
- [stateChanged](../wiki/server.components.Weapon.Weapon#statechanged)
- [timeCreated](../wiki/server.components.Weapon.Weapon#timecreated)

### Methods

- [Draw](../wiki/server.components.Weapon.Weapon#draw)
- [GetAnimation](../wiki/server.components.Weapon.Weapon#getanimation)
- [GetDirection](../wiki/server.components.Weapon.Weapon#getdirection)
- [Init](../wiki/server.components.Weapon.Weapon#init)
- [PlayerInit](../wiki/server.components.Weapon.Weapon#playerinit)
- [Release](../wiki/server.components.Weapon.Weapon#release)
- [destroy](../wiki/server.components.Weapon.Weapon#destroy)
- [getState](../wiki/server.components.Weapon.Weapon#getstate)
- [onAttributeChanged](../wiki/server.components.Weapon.Weapon#onattributechanged)
- [onStart](../wiki/server.components.Weapon.Weapon#onstart)
- [setAttribute](../wiki/server.components.Weapon.Weapon#setattribute)
- [setInstance](../wiki/server.components.Weapon.Weapon#setinstance)
- [setState](../wiki/server.components.Weapon.Weapon#setstate)

## Constructors

### constructor

• **new Weapon**()

#### Overrides

[Essential](../wiki/server.components.Essential.Essential).[constructor](../wiki/server.components.Essential.Essential#constructor)

#### Defined in

[src/server/components/Weapon.ts:105](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Weapon.ts#L105)

## Properties

### Actions

• **Actions**: [`Actions`](../wiki/server.components.Tool.Actions)

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[Actions](../wiki/server.components.Essential.Essential#actions)

#### Defined in

[src/server/components/Essential.ts:113](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L113)

___

### ActiveAnimation

• `Optional` **ActiveAnimation**: `AnimationTrack`

#### Defined in

[src/server/components/Weapon.ts:51](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Weapon.ts#L51)

___

### Damage

• **Damage**: `number` = `0`

#### Defined in

[src/server/components/Weapon.ts:44](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Weapon.ts#L44)

___

### Direction

• **Direction**: `string` = `"@@INIT"`

#### Defined in

[src/server/components/Weapon.ts:43](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Weapon.ts#L43)

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

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[Disable](../wiki/server.components.Essential.Essential#disable)

#### Defined in

[src/server/components/Essential.ts:111](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L111)

___

### DisableAnimation

• `Protected` `Abstract` **DisableAnimation**: `number`

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[DisableAnimation](../wiki/server.components.Essential.Essential#disableanimation)

#### Defined in

[src/server/components/Essential.ts:10](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L10)

___

### DisabledLimb

• `Protected` `Abstract` **DisabledLimb**: [`CharacterLimb`](../wiki/shared.types#characterlimb)

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[DisabledLimb](../wiki/server.components.Essential.Essential#disabledlimb)

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

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[Enable](../wiki/server.components.Essential.Essential#enable)

#### Defined in

[src/server/components/Essential.ts:109](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L109)

___

### EnableAnimation

• `Protected` `Abstract` **EnableAnimation**: `number`

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[EnableAnimation](../wiki/server.components.Essential.Essential#enableanimation)

#### Defined in

[src/server/components/Essential.ts:9](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L9)

___

### EnabledLimb

• `Protected` `Abstract` **EnabledLimb**: [`CharacterLimb`](../wiki/shared.types#characterlimb)

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[EnabledLimb](../wiki/server.components.Essential.Essential#enabledlimb)

#### Defined in

[src/server/components/Essential.ts:11](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L11)

___

### Hitbox

• **Hitbox**: `HitboxObject`

#### Defined in

[src/server/components/Weapon.ts:45](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Weapon.ts#L45)

___

### InputInfo

• **InputInfo**: [`InputInfo`](../wiki/server.components.Tool#inputinfo)

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[InputInfo](../wiki/server.components.Essential.Essential#inputinfo)

#### Defined in

[src/server/components/Essential.ts:17](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L17)

___

### Player

• `Optional` **Player**: `Player`

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[Player](../wiki/server.components.Essential.Essential#player)

#### Defined in

src/server/components/Tool.ts:64

___

### PlayerDirection

• **PlayerDirection**: ``"DOWN"`` \| ``"UP"`` = `"DOWN"`

#### Defined in

[src/server/components/Weapon.ts:42](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Weapon.ts#L42)

___

### StoredAnimations

• **StoredAnimations**: `Object` = `{}`

#### Index signature

▪ [index: `string`]: `AnimationTrack`

#### Defined in

[src/server/components/Weapon.ts:47](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Weapon.ts#L47)

___

### attributes

• **attributes**: [`ToolAttributes`](../wiki/server.components.Tool.ToolAttributes)

Attributes attached to this instance.

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[attributes](../wiki/server.components.Essential.Essential#attributes)

#### Defined in

node_modules/@flamework/components/out/index.d.ts:20

___

### id

• **id**: `string`

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[id](../wiki/server.components.Essential.Essential#id)

#### Defined in

src/server/components/Tool.ts:61

___

### instance

• **instance**: [`WeaponInstance`](../wiki/server.components.Weapon.WeaponInstance)

The instance this component is attached to.
This should only be called in a component lifecycle event.

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[instance](../wiki/server.components.Essential.Essential#instance)

#### Defined in

node_modules/@flamework/components/out/index.d.ts:25

___

### janitor

• `Protected` **janitor**: `Janitor`<`void`\>

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[janitor](../wiki/server.components.Essential.Essential#janitor)

#### Defined in

src/server/components/Tool.ts:59

___

### maid

• **maid**: `Maid`

A maid that will be destroyed when the component is.

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[maid](../wiki/server.components.Essential.Essential#maid)

#### Defined in

node_modules/@flamework/components/out/index.d.ts:16

___

### state

• **state**: `string` = `"nil"`

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[state](../wiki/server.components.Essential.Essential#state)

#### Defined in

src/server/components/Tool.ts:62

___

### stateChanged

• **stateChanged**: `Signal`<`fn`, ``false``\>

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[stateChanged](../wiki/server.components.Essential.Essential#statechanged)

#### Defined in

src/server/components/Tool.ts:65

___

### timeCreated

• **timeCreated**: `number`

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[timeCreated](../wiki/server.components.Essential.Essential#timecreated)

#### Defined in

src/server/components/Tool.ts:63

## Methods

### Draw

▸ `Private` **Draw**(`End`, `janitor`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `End` | `Callback` |
| `janitor` | `Janitor`<`void`\> |

#### Returns

`void`

#### Defined in

[src/server/components/Weapon.ts:126](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Weapon.ts#L126)

___

### GetAnimation

▸ `Protected` `Abstract` **GetAnimation**(`direction`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `direction` | `string` |

#### Returns

`number`

#### Defined in

[src/server/components/Weapon.ts:40](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Weapon.ts#L40)

___

### GetDirection

▸ `Protected` `Abstract` **GetDirection**(`playerDirection`, `Direction`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `playerDirection` | ``"DOWN"`` \| ``"UP"`` |
| `Direction` | `string` |

#### Returns

`string`

#### Defined in

[src/server/components/Weapon.ts:39](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Weapon.ts#L39)

___

### Init

▸ **Init**(): `void`

#### Returns

`void`

#### Overrides

[Essential](../wiki/server.components.Essential.Essential).[Init](../wiki/server.components.Essential.Essential#init)

#### Defined in

[src/server/components/Weapon.ts:53](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Weapon.ts#L53)

___

### PlayerInit

▸ **PlayerInit**(): `void`

#### Returns

`void`

#### Overrides

[Essential](../wiki/server.components.Essential.Essential).[PlayerInit](../wiki/server.components.Essential.Essential#playerinit)

#### Defined in

[src/server/components/Weapon.ts:77](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Weapon.ts#L77)

___

### Release

▸ `Private` **Release**(`End`, `janitor`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `End` | `Callback` |
| `janitor` | `Janitor`<`void`\> |

#### Returns

`void`

#### Defined in

[src/server/components/Weapon.ts:159](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Weapon.ts#L159)

___

### destroy

▸ **destroy**(): `void`

Destroys this component instance.

#### Returns

`void`

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[destroy](../wiki/server.components.Essential.Essential#destroy)

#### Defined in

node_modules/@flamework/components/out/index.d.ts:39

___

### getState

▸ **getState**(): `string`

#### Returns

`string`

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[getState](../wiki/server.components.Essential.Essential#getstate)

#### Defined in

src/server/components/Tool.ts:67

___

### onAttributeChanged

▸ **onAttributeChanged**<`K`\>(`name`, `cb`): `void`

Connect a callback to the change of a specific attribute.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends ``"BUTTON_TOGGLE"`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `K` | The name of the attribute |
| `cb` | (`newValue`: [`ToolAttributes`](../wiki/server.components.Tool.ToolAttributes)[`K`], `oldValue`: [`ToolAttributes`](../wiki/server.components.Tool.ToolAttributes)[`K`]) => `void` | The callback |

#### Returns

`void`

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[onAttributeChanged](../wiki/server.components.Essential.Essential#onattributechanged)

#### Defined in

node_modules/@flamework/components/out/index.d.ts:35

___

### onStart

▸ **onStart**(): `void`

#### Returns

`void`

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[onStart](../wiki/server.components.Essential.Essential#onstart)

#### Defined in

src/server/components/Tool.ts:76

___

### setAttribute

▸ **setAttribute**<`T`\>(`key`, `value`, `postfix?`): [`ToolAttributes`](../wiki/server.components.Tool.ToolAttributes)[`T`]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends ``"BUTTON_TOGGLE"`` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `T` |
| `value` | [`ToolAttributes`](../wiki/server.components.Tool.ToolAttributes)[`T`] |
| `postfix?` | `boolean` |

#### Returns

[`ToolAttributes`](../wiki/server.components.Tool.ToolAttributes)[`T`]

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[setAttribute](../wiki/server.components.Essential.Essential#setattribute)

#### Defined in

node_modules/@flamework/components/out/index.d.ts:27

___

### setInstance

▸ **setInstance**(`instance`, `attributes`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | [`WeaponInstance`](../wiki/server.components.Weapon.WeaponInstance) |
| `attributes` | `unknown` |

#### Returns

`void`

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[setInstance](../wiki/server.components.Essential.Essential#setinstance)

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

[Essential](../wiki/server.components.Essential.Essential).[setState](../wiki/server.components.Essential.Essential#setstate)

#### Defined in

src/server/components/Tool.ts:71
