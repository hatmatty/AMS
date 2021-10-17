# Class: Rotation

[server/services/Rotation](../wiki/server.services.Rotation).Rotation

Serves to replicate body rotation from the client to other clients by having the client send their joint CFrame info through a server event and then have that info sent to other clients within a distance of them back through a client event.

## Implements

- `OnInit`

## Table of contents

### Methods

- [onInit](../wiki/server.services.Rotation.Rotation#oninit)
- [GetPlayersWithinDist](../wiki/server.services.Rotation.Rotation#getplayerswithindist)
- [UpdateRotation](../wiki/server.services.Rotation.Rotation#updaterotation)

## Methods

### onInit

▸ **onInit**(): `void`

Hooks the UpdateRotation method to the UpdateRotation server event.

#### Returns

`void`

#### Implementation of

OnInit.onInit

#### Defined in

[src/server/services/Rotation.ts:13](https://github.com/hatmatty/AET/blob/5e435eb/src/server/services/Rotation.ts#L13)

___

### GetPlayersWithinDist

▸ `Static` `Private` **GetPlayersWithinDist**(`player`, `distance`): `Player`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `distance` | `number` |

#### Returns

`Player`[]

players that are within the distance passed in of the player passed in.

#### Defined in

[src/server/services/Rotation.ts:49](https://github.com/hatmatty/AET/blob/5e435eb/src/server/services/Rotation.ts#L49)

___

### UpdateRotation

▸ `Static` `Private` **UpdateRotation**(`player`, `waist`, `neck`, `leftshoulder`, `rightshoulder`): `void`

Takes in a player and their joint cframes and fires an UpdateRotation client event to everyone within a certain distance of that player so that the player's body rotation will replicate.

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `waist` | `CFrame` |
| `neck` | `CFrame` |
| `leftshoulder` | `CFrame` |
| `rightshoulder` | `CFrame` |

#### Returns

`void`

#### Defined in

[src/server/services/Rotation.ts:24](https://github.com/hatmatty/AET/blob/5e435eb/src/server/services/Rotation.ts#L24)
