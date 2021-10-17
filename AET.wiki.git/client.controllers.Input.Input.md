# Class: Input

[client/controllers/Input](../wiki/client.controllers.Input).Input

Manages the sending of input events from the client to the server through the Input server event.

## Implements

- `OnInit`

## Table of contents

### Methods

- [onInit](../wiki/client.controllers.Input.Input#oninit)
- [createInputEvent](../wiki/client.controllers.Input.Input#createinputevent)

## Methods

### onInit

▸ **onInit**(): `void`

Calls createInputEvent on UserInputService.InputBegan and UserInputService.InputEnded

#### Returns

`void`

#### Implementation of

OnInit.onInit

#### Defined in

[src/client/controllers/Input.ts:14](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/Input.ts#L14)

___

### createInputEvent

▸ `Static` `Private` **createInputEvent**(`event`): `void`

takes either a UserInputService.InputBegan or InputEnded event and then connects it to a function which fires an event with an inputobject if the input was not processed by the game.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `RBXScriptSignal`<`fn`\> | UserInputService event (inputbegan/inputended) |

#### Returns

`void`

#### Defined in

[src/client/controllers/Input.ts:25](https://github.com/hatmatty/AET/blob/5e435eb/src/client/controllers/Input.ts#L25)
