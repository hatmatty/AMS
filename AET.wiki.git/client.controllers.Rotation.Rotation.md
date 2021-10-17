# Class: Rotation

[client/controllers/Rotation](../wiki/client.controllers.Rotation).Rotation

Handles the rotation of a player's body to match the direction of their camera.

## Implements

- `OnInit`

## Table of contents

### Properties

- [Enabled](../wiki/client.controllers.Rotation.Rotation#enabled)
- [delay](../wiki/client.controllers.Rotation.Rotation#delay)
- [janitor](../wiki/client.controllers.Rotation.Rotation#janitor)

### Methods

- [Start](../wiki/client.controllers.Rotation.Rotation#start)
- [Stop](../wiki/client.controllers.Rotation.Rotation#stop)
- [UpdateOwnRotation](../wiki/client.controllers.Rotation.Rotation#updateownrotation)
- [onInit](../wiki/client.controllers.Rotation.Rotation#oninit)
- [CapX](../wiki/client.controllers.Rotation.Rotation#capx)
- [CapY](../wiki/client.controllers.Rotation.Rotation#capy)
- [Tween](../wiki/client.controllers.Rotation.Rotation#tween)
- [UpdateOtherRotation](../wiki/client.controllers.Rotation.Rotation#updateotherrotation)

## Properties

### Enabled

• **Enabled**: `boolean` = `true`

Other controllers can access this Enabled property to disable the body rotator

#### Defined in

[src/client/controllers/Rotation.ts:20](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/Rotation.ts#L20)

___

### delay

• `Private` **delay**: `number` = `0.1`

#### Defined in

[src/client/controllers/Rotation.ts:22](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/Rotation.ts#L22)

___

### janitor

• `Private` **janitor**: `Janitor`<`void`\>

#### Defined in

[src/client/controllers/Rotation.ts:21](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/Rotation.ts#L21)

## Methods

### Start

▸ **Start**(`character`): `void`

Starts the character's rotation by connecting the renderstepped event to the this.UpdateOwnRotation method and fires an event every this.delay seconds which informs the server of the player's new body rotation

#### Parameters

| Name | Type |
| :------ | :------ |
| `character` | `Model` |

#### Returns

`void`

#### Defined in

[src/client/controllers/Rotation.ts:46](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/Rotation.ts#L46)

___

### Stop

▸ `Private` **Stop**(): `void`

Simply calls cleanup on the janitor to stop any connected events such as the renderstepped event which is added in Start()

#### Returns

`void`

#### Defined in

[src/client/controllers/Rotation.ts:280](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/Rotation.ts#L280)

___

### UpdateOwnRotation

▸ **UpdateOwnRotation**(`NeckYOffset?`, `RightShoulderXOffset?`, `RightShoulderYOffset?`, `LeftShoulderXOffset?`, `LeftShoulderYOffset?`): `void`

Takes in a set of default offsets which should have been gathered before setting this as this could possibly alter the offsets and then updates the cframes of the limbs to face the same direction the camera is facing.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `NeckYOffset` | `number` | `0` |
| `RightShoulderXOffset` | `number` | `0` |
| `RightShoulderYOffset` | `number` | `0` |
| `LeftShoulderXOffset` | `number` | `0` |
| `LeftShoulderYOffset` | `number` | `0` |

#### Returns

`void`

#### Defined in

[src/client/controllers/Rotation.ts:124](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/Rotation.ts#L124)

___

### onInit

▸ **onInit**(): `void`

Manages the starting of the BodyRotation when the player's character is created and connects to the UpdateRotation client event for when the rotation of other character's updates so that it replicates here.

#### Returns

`void`

#### Implementation of

OnInit.onInit

#### Defined in

[src/client/controllers/Rotation.ts:27](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/Rotation.ts#L27)

___

### CapX

▸ `Static` `Private` **CapX**(`value`): `number`

Is used to clamp X rotation values.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`number`

a number between -0.5 and 0.5.

#### Defined in

[src/client/controllers/Rotation.ts:299](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/Rotation.ts#L299)

___

### CapY

▸ `Static` `Private` **CapY**(`value`): `number`

Is used to clamp Y rotation values.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`number`

a number which if negative is divded by 3 to make it less negative and then clamped to be between -0.5 and 0.5.

#### Defined in

[src/client/controllers/Rotation.ts:288](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/Rotation.ts#L288)

___

### Tween

▸ `Static` `Private` **Tween**(`joint`, `NewCFrame`, `time?`): `void`

Tweens the joint's cframe to be the newcframe over the a period of time equvalent which is the time parameter

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `joint` | `Motor6D` | `undefined` |
| `NewCFrame` | `CFrame` | `undefined` |
| `time` | `number` | `0.25` |

#### Returns

`void`

#### Defined in

[src/client/controllers/Rotation.ts:306](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/Rotation.ts#L306)

___

### UpdateOtherRotation

▸ `Static` `Private` **UpdateOtherRotation**(`player`, `neckCFrame`, `waistCFrame`, `leftShoulderCFrame`, `rightShoulderCFrame`): `void`

takes in a player and their joints as parameters and finds the motor6ds for the cframes on the character of the player argument and tweens the motor6ds C0 to equal the CFrame passed in

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `neckCFrame` | `CFrame` |
| `waistCFrame` | `CFrame` |
| `leftShoulderCFrame` | `CFrame` |
| `rightShoulderCFrame` | `CFrame` |

#### Returns

`void`

#### Defined in

[src/client/controllers/Rotation.ts:224](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/Rotation.ts#L224)
