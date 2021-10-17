# Module: server/components/Weapon

## Table of contents

### Classes

- [Weapon](../wiki/server.components.Weapon.Weapon)

### Interfaces

- [WeaponInstance](../wiki/server.components.Weapon.WeaponInstance)

### Functions

- [AddDamageMiddleware](../wiki/server.components.Weapon#adddamagemiddleware)
- [AddDrawMiddleware](../wiki/server.components.Weapon#adddrawmiddleware)
- [AddHitMiddleware](../wiki/server.components.Weapon#addhitmiddleware)
- [AddSwingMiddleware](../wiki/server.components.Weapon#addswingmiddleware)

## Functions

### AddDamageMiddleware

▸ **AddDamageMiddleware**(`middleware`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `middleware` | `Middleware`<[[`Weapon`](../wiki/server.components.Weapon.Weapon), `Player`]\> |

#### Returns

`void`

#### Defined in

[src/server/modules/Middleware.ts:5](https://github.com/hatmatty/AET/blob/5e435eb/src/server/modules/Middleware.ts#L5)

___

### AddDrawMiddleware

▸ **AddDrawMiddleware**(`middleware`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `middleware` | `Middleware`<[[`Weapon`](../wiki/server.components.Weapon.Weapon)]\> |

#### Returns

`void`

#### Defined in

[src/server/modules/Middleware.ts:5](https://github.com/hatmatty/AET/blob/5e435eb/src/server/modules/Middleware.ts#L5)

___

### AddHitMiddleware

▸ **AddHitMiddleware**(`middleware`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `middleware` | `Middleware`<[[`Weapon`](../wiki/server.components.Weapon.Weapon), `Instance`, `Map`<`Instance`, `boolean`\>]\> |

#### Returns

`void`

#### Defined in

[src/server/modules/Middleware.ts:5](https://github.com/hatmatty/AET/blob/5e435eb/src/server/modules/Middleware.ts#L5)

___

### AddSwingMiddleware

▸ **AddSwingMiddleware**(`middleware`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `middleware` | `Middleware`<[[`Weapon`](../wiki/server.components.Weapon.Weapon)]\> |

#### Returns

`void`

#### Defined in

[src/server/modules/Middleware.ts:5](https://github.com/hatmatty/AET/blob/5e435eb/src/server/modules/Middleware.ts#L5)
