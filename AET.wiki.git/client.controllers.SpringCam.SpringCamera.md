# Class: SpringCamera

[client/controllers/SpringCam](../wiki/client.controllers.SpringCam).SpringCamera

Manages the creation of a spring-based camera on a player's character

## Implements

- `OnInit`

## Table of contents

### Properties

- [janitor](../wiki/client.controllers.SpringCam.SpringCamera#janitor)

### Methods

- [Create](../wiki/client.controllers.SpringCam.SpringCamera#create)
- [Destroy](../wiki/client.controllers.SpringCam.SpringCamera#destroy)
- [onInit](../wiki/client.controllers.SpringCam.SpringCamera#oninit)
- [UpdateCamera](../wiki/client.controllers.SpringCam.SpringCamera#updatecamera)

## Properties

### janitor

• `Private` **janitor**: `Janitor`<`void`\>

#### Defined in

[src/client/controllers/SpringCam.ts:15](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/SpringCam.ts#L15)

## Methods

### Create

▸ `Private` **Create**(): `void`

Creates the spring camera on the player's head by creating a subject basepart and connecting it's position to a spring which moves to the player's head. Updates the camera on render stepped by calling UpdateCamera with the subject and spring.

#### Returns

`void`

#### Defined in

[src/client/controllers/SpringCam.ts:36](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/SpringCam.ts#L36)

___

### Destroy

▸ `Private` **Destroy**(): `void`

Destroys the camera by cleaning up the janitor which has the subject added if the Create() method was ran and unbinds the UpdateSubject function from renderstepped.

#### Returns

`void`

#### Defined in

[src/client/controllers/SpringCam.ts:123](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/SpringCam.ts#L123)

___

### onInit

▸ **onInit**(): `void`

calls creates the camera by calling Create() when a player's character is loaded in and destroys the camera by calling Destroy() when the player's character is removed.

#### Returns

`void`

#### Implementation of

OnInit.onInit

#### Defined in

[src/client/controllers/SpringCam.ts:20](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/SpringCam.ts#L20)

___

### UpdateCamera

▸ `Static` `Private` **UpdateCamera**(`deltaTime`, `spring`, `subject`): `void`

Updates the camera by setting the goal of the spring and updating the position of the subject.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `deltaTime` | `number` | - |
| `spring` | [`export=`](../wiki/shared.modules.spring#export=)<`Vector3`\> | a spring which will have it's goal set to the player's head |
| `subject` | `BasePart` | an invisible basepart which will take on the same position as the spring and is the subject of the player's camera |

#### Returns

`void`

#### Defined in

[src/client/controllers/SpringCam.ts:80](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/SpringCam.ts#L80)
