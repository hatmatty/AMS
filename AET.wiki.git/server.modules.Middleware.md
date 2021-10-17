# Module: server/modules/Middleware

## Table of contents

### Functions

- [GenerateMiddleware](../wiki/server.modules.Middleware#generatemiddleware)
- [RunMiddleware](../wiki/server.modules.Middleware#runmiddleware)

## Functions

### GenerateMiddleware

▸ **GenerateMiddleware**<`P`\>(): [`Middleware`<`P`\>[], (`middleware`: `Middleware`<`P`\>) => `void`]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends `unknown`[] |

#### Returns

[`Middleware`<`P`\>[], (`middleware`: `Middleware`<`P`\>) => `void`]

#### Defined in

[src/server/modules/Middleware.ts:3](https://github.com/hatmatty/AET/blob/5e435eb/src/server/modules/Middleware.ts#L3)

___

### RunMiddleware

▸ **RunMiddleware**<`P`, `T`\>(`Middleware`, ...`Args`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | extends `unknown`[] |
| `T` | extends `Middleware`<`P`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `Middleware` | `T`[] |
| `...Args` | `P` |

#### Returns

`void`

#### Defined in

[src/server/modules/Middleware.ts:12](https://github.com/hatmatty/AET/blob/5e435eb/src/server/modules/Middleware.ts#L12)
