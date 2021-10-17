# Class: Shield

[server/components/Shield](../wiki/server.components.Shield).Shield

## Hierarchy

- [`Essential`](../wiki/server.components.Essential.Essential)<[`ToolAttributes`](../wiki/server.components.Tool.ToolAttributes), `ShieldInstance`\>

  ↳ **`Shield`**

## Table of contents

### Constructors

- [constructor](../wiki/server.components.Shield.Shield#constructor)

### Properties

- [Actions](../wiki/server.components.Shield.Shield#actions)
- [Disable](../wiki/server.components.Shield.Shield#disable)
- [DisableAnimation](../wiki/server.components.Shield.Shield#disableanimation)
- [DisabledLimb](../wiki/server.components.Shield.Shield#disabledlimb)
- [Enable](../wiki/server.components.Shield.Shield#enable)
- [EnableAnimation](../wiki/server.components.Shield.Shield#enableanimation)
- [EnabledLimb](../wiki/server.components.Shield.Shield#enabledlimb)
- [InputInfo](../wiki/server.components.Shield.Shield#inputinfo)
- [Player](../wiki/server.components.Shield.Shield#player)
- [attributes](../wiki/server.components.Shield.Shield#attributes)
- [id](../wiki/server.components.Shield.Shield#id)
- [instance](../wiki/server.components.Shield.Shield#instance)
- [janitor](../wiki/server.components.Shield.Shield#janitor)
- [maid](../wiki/server.components.Shield.Shield#maid)
- [state](../wiki/server.components.Shield.Shield#state)
- [stateChanged](../wiki/server.components.Shield.Shield#statechanged)
- [timeCreated](../wiki/server.components.Shield.Shield#timecreated)

### Methods

- [Block](../wiki/server.components.Shield.Shield#block)
- [EndBlock](../wiki/server.components.Shield.Shield#endblock)
- [Init](../wiki/server.components.Shield.Shield#init)
- [PlayerInit](../wiki/server.components.Shield.Shield#playerinit)
- [destroy](../wiki/server.components.Shield.Shield#destroy)
- [getState](../wiki/server.components.Shield.Shield#getstate)
- [onAttributeChanged](../wiki/server.components.Shield.Shield#onattributechanged)
- [onStart](../wiki/server.components.Shield.Shield#onstart)
- [setAttribute](../wiki/server.components.Shield.Shield#setattribute)
- [setInstance](../wiki/server.components.Shield.Shield#setinstance)
- [setState](../wiki/server.components.Shield.Shield#setstate)

## Constructors

### constructor

• **new Shield**()

#### Overrides

[Essential](../wiki/server.components.Essential.Essential).[constructor](../wiki/server.components.Essential.Essential#constructor)

#### Defined in

[src/server/components/Shield.ts:31](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Shield.ts#L31)

## Properties

### Actions

• **Actions**: [`Actions`](../wiki/server.components.Tool.Actions)

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[Actions](../wiki/server.components.Essential.Essential#actions)

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

#### Inherited from

[Essential](../wiki/server.components.Essential.Essential).[Disable](../wiki/server.components.Essential.Essential#disable)

#### Defined in

[src/server/components/Essential.ts:111](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Essential.ts#L111)

___

### DisableAnimation

• **DisableAnimation**: `number` = `Config.Animations.Shield.Holster`

#### Overrides

[Essential](../wiki/server.components.Essential.Essential).[DisableAnimation](../wiki/server.components.Essential.Essential#disableanimation)

#### Defined in

[src/server/components/Shield.ts:26](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Shield.ts#L26)

___

### DisabledLimb

• **DisabledLimb**: [`CharacterLimb`](../wiki/shared.types#characterlimb)

#### Overrides

[Essential](../wiki/server.components.Essential.Essential).[DisabledLimb](../wiki/server.components.Essential.Essential#disabledlimb)

#### Defined in

[src/server/components/Shield.ts:29](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Shield.ts#L29)

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

• **EnableAnimation**: `number` = `Config.Animations.Shield.Equip`

#### Overrides

[Essential](../wiki/server.components.Essential.Essential).[EnableAnimation](../wiki/server.components.Essential.Essential#enableanimation)

#### Defined in

[src/server/components/Shield.ts:25](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Shield.ts#L25)

___

### EnabledLimb

• **EnabledLimb**: [`CharacterLimb`](../wiki/shared.types#characterlimb)

#### Overrides

[Essential](../wiki/server.components.Essential.Essential).[EnabledLimb](../wiki/server.components.Essential.Essential#enabledlimb)

#### Defined in

[src/server/components/Shield.ts:28](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Shield.ts#L28)

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

• **instance**: `ShieldInstance`

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

### Block

▸ `Private` **Block**(`End`, `janitor`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `End` | `Callback` |
| `janitor` | `Janitor`<`void`\> |

#### Returns

`void`

#### Defined in

[src/server/components/Shield.ts:51](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Shield.ts#L51)

___

### EndBlock

▸ `Private` **EndBlock**(`End`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `End` | `Callback` |

#### Returns

`void`

#### Defined in

[src/server/components/Shield.ts:59](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Shield.ts#L59)

___

### Init

▸ **Init**(): `void`

#### Returns

`void`

#### Overrides

[Essential](../wiki/server.components.Essential.Essential).[Init](../wiki/server.components.Essential.Essential#init)

#### Defined in

[src/server/components/Shield.ts:65](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Shield.ts#L65)

___

### PlayerInit

▸ **PlayerInit**(): `void`

#### Returns

`void`

#### Overrides

[Essential](../wiki/server.components.Essential.Essential).[PlayerInit](../wiki/server.components.Essential.Essential#playerinit)

#### Defined in

[src/server/components/Shield.ts:85](https://github.com/hatmatty/AET/blob/5e435eb/src/server/components/Shield.ts#L85)

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
| `instance` | `ShieldInstance` |
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
