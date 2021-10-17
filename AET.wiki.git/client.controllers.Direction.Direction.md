# Class: Direction

[client/controllers/Direction](../wiki/client.controllers.Direction).Direction

Manages the sending of what direction the player is facing (either "UP" or "DOWN") to the server thorugh the Direction event.

**`example`**

```
WRITTEN: player rotates their camera up, fast enough to trigger the "if (this.prevX !== x && math.abs(this.prevX - x) >= 0.02)" to evaluate to true which sets the direction to "UP" and fires the direction event with the direction.
```

## Implements

- `OnInit`

## Table of contents

### Properties

- [Direction](../wiki/client.controllers.Direction.Direction#direction)
- [prevX](../wiki/client.controllers.Direction.Direction#prevx)

### Methods

- [onInit](../wiki/client.controllers.Direction.Direction#oninit)

## Properties

### Direction

• `Private` **Direction**: ``"DOWN"`` \| ``"UP"`` = `"DOWN"`

stores the direction the player's camera is facing in

#### Defined in

[src/client/controllers/Direction.ts:22](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/Direction.ts#L22)

___

### prevX

• `Private` **prevX**: `number` = `0`

stores the amount of heartbeats the camera has moved in a direction

#### Defined in

[src/client/controllers/Direction.ts:24](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/Direction.ts#L24)

## Methods

### onInit

▸ **onInit**(): `void`

#### Returns

`void`

#### Implementation of

OnInit.onInit

#### Defined in

[src/client/controllers/Direction.ts:26](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/Direction.ts#L26)
