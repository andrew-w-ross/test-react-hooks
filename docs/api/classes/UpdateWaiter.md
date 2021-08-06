[test-react-hooks - v3.0.1](../README.md) / UpdateWaiter

# Class: UpdateWaiter

UpdateWaiter is a fluent api that will resolve when it's conditions are met.

## Hierarchy

- `Promise`<`void`\>

  ↳ **`UpdateWaiter`**

## Table of contents

### Properties

- [[toStringTag]](UpdateWaiter.md#[tostringtag])
- [[species]](UpdateWaiter.md#[species])

### Methods

- [act](UpdateWaiter.md#act)
- [addWaiter](UpdateWaiter.md#addwaiter)
- [catch](UpdateWaiter.md#catch)
- [debounce](UpdateWaiter.md#debounce)
- [finally](UpdateWaiter.md#finally)
- [then](UpdateWaiter.md#then)
- [updateCount](UpdateWaiter.md#updatecount)
- [waitAll](UpdateWaiter.md#waitall)
- [waitRace](UpdateWaiter.md#waitrace)
- [all](UpdateWaiter.md#all)
- [allSettled](UpdateWaiter.md#allsettled)
- [any](UpdateWaiter.md#any)
- [race](UpdateWaiter.md#race)
- [reject](UpdateWaiter.md#reject)
- [resolve](UpdateWaiter.md#resolve)

## Properties

### [toStringTag]

• `Readonly` **[toStringTag]**: `string`

#### Inherited from

Promise.\_\_@toStringTag@198

___

### [species]

▪ `Static` `Readonly` **[species]**: `PromiseConstructor`

#### Inherited from

Promise.\_\_@species@245

## Methods

### act

▸ **act**(`actFn`): [`UpdateWaiter`](UpdateWaiter.md)

Function that is called before waiting starts, wrapped in act.

#### Parameters

| Name | Type |
| :------ | :------ |
| `actFn` | () => `any` |

#### Returns

[`UpdateWaiter`](UpdateWaiter.md)

___

### addWaiter

▸ **addWaiter**(`waitFn`): [`UpdateWaiter`](UpdateWaiter.md)

**`example`**
//Wait for 10ms
createWaiter().addWaiter((updateObserver) => new Promise((resolve) => setTimeout(resolve, 10)));

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `waitFn` | (`updateObserver`: `Observable`<[`UpdateEvent`](../README.md#updateevent)\>) => `ObservableInput`<`any`\> | function that takes in an {Observable<UpdateEvent>} and returns an {Observable<any>} or a {Promise} |

#### Returns

[`UpdateWaiter`](UpdateWaiter.md)

___

### catch

▸ **catch**<`TResult`\>(`onrejected?`): `Promise`<`void` \| `TResult`\>

Attaches a callback for only the rejection of the Promise.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `never` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onrejected?` | ``null`` \| (`reason`: `any`) => `TResult` \| `PromiseLike`<`TResult`\> | The callback to execute when the Promise is rejected. |

#### Returns

`Promise`<`void` \| `TResult`\>

A Promise for the completion of the callback.

#### Inherited from

Promise.catch

___

### debounce

▸ **debounce**(`ms?`): `this`

Waits for the updates to stop for a certain amount of time before stopping.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `ms` | `number` | `3` | Time to wait in ms |

#### Returns

`this`

___

### finally

▸ **finally**(`onfinally?`): `Promise`<`void`\>

Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
resolved value cannot be modified from the callback.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onfinally?` | ``null`` \| () => `void` | The callback to execute when the Promise is settled (fulfilled or rejected). |

#### Returns

`Promise`<`void`\>

A Promise for the completion of the callback.

#### Inherited from

Promise.finally

___

### then

▸ **then**<`TResult1`, `TResult2`\>(`onfulfilled?`, `onrejected?`): `Promise`<`TResult1` \| `TResult2`\>

Attaches callbacks for the resolution and/or rejection of the Promise.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult1` | `void` |
| `TResult2` | `never` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onfulfilled?` | ``null`` \| (`value`: `void`) => `TResult1` \| `PromiseLike`<`TResult1`\> | The callback to execute when the Promise is resolved. |
| `onrejected?` | ``null`` \| (`reason`: `any`) => `TResult2` \| `PromiseLike`<`TResult2`\> | The callback to execute when the Promise is rejected. |

#### Returns

`Promise`<`TResult1` \| `TResult2`\>

A Promise for the completion of which ever callback is executed.

#### Inherited from

Promise.then

___

### updateCount

▸ **updateCount**(`count?`): `this`

Waits for a certain amount of updates before resolving.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `count` | `number` | `1` | Amount of update to wait for. |

#### Returns

`this`

___

### waitAll

▸ **waitAll**(): [`UpdateWaiter`](UpdateWaiter.md)

Waits for all of the waiters to resolve before resolving

#### Returns

[`UpdateWaiter`](UpdateWaiter.md)

___

### waitRace

▸ **waitRace**(): [`UpdateWaiter`](UpdateWaiter.md)

Waits for one of the waiters to resolve before resolving

#### Returns

[`UpdateWaiter`](UpdateWaiter.md)

___

### all

▸ `Static` **all**<`T`\>(`values`): `Promise`<`T`[]\>

Creates a Promise that is resolved with an array of results when all of the provided Promises
resolve, or rejected when any Promise is rejected.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `Iterable`<`T` \| `PromiseLike`<`T`\>\> | An iterable of Promises. |

#### Returns

`Promise`<`T`[]\>

A new Promise.

#### Inherited from

Promise.all

▸ `Static` **all**<`T1`, `T2`, `T3`, `T4`, `T5`, `T6`, `T7`, `T8`, `T9`, `T10`\>(`values`): `Promise`<[`T1`, `T2`, `T3`, `T4`, `T5`, `T6`, `T7`, `T8`, `T9`, `T10`]\>

Creates a Promise that is resolved with an array of results when all of the provided Promises
resolve, or rejected when any Promise is rejected.

#### Type parameters

| Name |
| :------ |
| `T1` |
| `T2` |
| `T3` |
| `T4` |
| `T5` |
| `T6` |
| `T7` |
| `T8` |
| `T9` |
| `T10` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | readonly [`T1` \| `PromiseLike`<`T1`\>, `T2` \| `PromiseLike`<`T2`\>, `T3` \| `PromiseLike`<`T3`\>, `T4` \| `PromiseLike`<`T4`\>, `T5` \| `PromiseLike`<`T5`\>, `T6` \| `PromiseLike`<`T6`\>, `T7` \| `PromiseLike`<`T7`\>, `T8` \| `PromiseLike`<`T8`\>, `T9` \| `PromiseLike`<`T9`\>, `T10` \| `PromiseLike`<`T10`\>] | An array of Promises. |

#### Returns

`Promise`<[`T1`, `T2`, `T3`, `T4`, `T5`, `T6`, `T7`, `T8`, `T9`, `T10`]\>

A new Promise.

#### Inherited from

Promise.all

▸ `Static` **all**<`T1`, `T2`, `T3`, `T4`, `T5`, `T6`, `T7`, `T8`, `T9`\>(`values`): `Promise`<[`T1`, `T2`, `T3`, `T4`, `T5`, `T6`, `T7`, `T8`, `T9`]\>

Creates a Promise that is resolved with an array of results when all of the provided Promises
resolve, or rejected when any Promise is rejected.

#### Type parameters

| Name |
| :------ |
| `T1` |
| `T2` |
| `T3` |
| `T4` |
| `T5` |
| `T6` |
| `T7` |
| `T8` |
| `T9` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | readonly [`T1` \| `PromiseLike`<`T1`\>, `T2` \| `PromiseLike`<`T2`\>, `T3` \| `PromiseLike`<`T3`\>, `T4` \| `PromiseLike`<`T4`\>, `T5` \| `PromiseLike`<`T5`\>, `T6` \| `PromiseLike`<`T6`\>, `T7` \| `PromiseLike`<`T7`\>, `T8` \| `PromiseLike`<`T8`\>, `T9` \| `PromiseLike`<`T9`\>] | An array of Promises. |

#### Returns

`Promise`<[`T1`, `T2`, `T3`, `T4`, `T5`, `T6`, `T7`, `T8`, `T9`]\>

A new Promise.

#### Inherited from

Promise.all

▸ `Static` **all**<`T1`, `T2`, `T3`, `T4`, `T5`, `T6`, `T7`, `T8`\>(`values`): `Promise`<[`T1`, `T2`, `T3`, `T4`, `T5`, `T6`, `T7`, `T8`]\>

Creates a Promise that is resolved with an array of results when all of the provided Promises
resolve, or rejected when any Promise is rejected.

#### Type parameters

| Name |
| :------ |
| `T1` |
| `T2` |
| `T3` |
| `T4` |
| `T5` |
| `T6` |
| `T7` |
| `T8` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | readonly [`T1` \| `PromiseLike`<`T1`\>, `T2` \| `PromiseLike`<`T2`\>, `T3` \| `PromiseLike`<`T3`\>, `T4` \| `PromiseLike`<`T4`\>, `T5` \| `PromiseLike`<`T5`\>, `T6` \| `PromiseLike`<`T6`\>, `T7` \| `PromiseLike`<`T7`\>, `T8` \| `PromiseLike`<`T8`\>] | An array of Promises. |

#### Returns

`Promise`<[`T1`, `T2`, `T3`, `T4`, `T5`, `T6`, `T7`, `T8`]\>

A new Promise.

#### Inherited from

Promise.all

▸ `Static` **all**<`T1`, `T2`, `T3`, `T4`, `T5`, `T6`, `T7`\>(`values`): `Promise`<[`T1`, `T2`, `T3`, `T4`, `T5`, `T6`, `T7`]\>

Creates a Promise that is resolved with an array of results when all of the provided Promises
resolve, or rejected when any Promise is rejected.

#### Type parameters

| Name |
| :------ |
| `T1` |
| `T2` |
| `T3` |
| `T4` |
| `T5` |
| `T6` |
| `T7` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | readonly [`T1` \| `PromiseLike`<`T1`\>, `T2` \| `PromiseLike`<`T2`\>, `T3` \| `PromiseLike`<`T3`\>, `T4` \| `PromiseLike`<`T4`\>, `T5` \| `PromiseLike`<`T5`\>, `T6` \| `PromiseLike`<`T6`\>, `T7` \| `PromiseLike`<`T7`\>] | An array of Promises. |

#### Returns

`Promise`<[`T1`, `T2`, `T3`, `T4`, `T5`, `T6`, `T7`]\>

A new Promise.

#### Inherited from

Promise.all

▸ `Static` **all**<`T1`, `T2`, `T3`, `T4`, `T5`, `T6`\>(`values`): `Promise`<[`T1`, `T2`, `T3`, `T4`, `T5`, `T6`]\>

Creates a Promise that is resolved with an array of results when all of the provided Promises
resolve, or rejected when any Promise is rejected.

#### Type parameters

| Name |
| :------ |
| `T1` |
| `T2` |
| `T3` |
| `T4` |
| `T5` |
| `T6` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | readonly [`T1` \| `PromiseLike`<`T1`\>, `T2` \| `PromiseLike`<`T2`\>, `T3` \| `PromiseLike`<`T3`\>, `T4` \| `PromiseLike`<`T4`\>, `T5` \| `PromiseLike`<`T5`\>, `T6` \| `PromiseLike`<`T6`\>] | An array of Promises. |

#### Returns

`Promise`<[`T1`, `T2`, `T3`, `T4`, `T5`, `T6`]\>

A new Promise.

#### Inherited from

Promise.all

▸ `Static` **all**<`T1`, `T2`, `T3`, `T4`, `T5`\>(`values`): `Promise`<[`T1`, `T2`, `T3`, `T4`, `T5`]\>

Creates a Promise that is resolved with an array of results when all of the provided Promises
resolve, or rejected when any Promise is rejected.

#### Type parameters

| Name |
| :------ |
| `T1` |
| `T2` |
| `T3` |
| `T4` |
| `T5` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | readonly [`T1` \| `PromiseLike`<`T1`\>, `T2` \| `PromiseLike`<`T2`\>, `T3` \| `PromiseLike`<`T3`\>, `T4` \| `PromiseLike`<`T4`\>, `T5` \| `PromiseLike`<`T5`\>] | An array of Promises. |

#### Returns

`Promise`<[`T1`, `T2`, `T3`, `T4`, `T5`]\>

A new Promise.

#### Inherited from

Promise.all

▸ `Static` **all**<`T1`, `T2`, `T3`, `T4`\>(`values`): `Promise`<[`T1`, `T2`, `T3`, `T4`]\>

Creates a Promise that is resolved with an array of results when all of the provided Promises
resolve, or rejected when any Promise is rejected.

#### Type parameters

| Name |
| :------ |
| `T1` |
| `T2` |
| `T3` |
| `T4` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | readonly [`T1` \| `PromiseLike`<`T1`\>, `T2` \| `PromiseLike`<`T2`\>, `T3` \| `PromiseLike`<`T3`\>, `T4` \| `PromiseLike`<`T4`\>] | An array of Promises. |

#### Returns

`Promise`<[`T1`, `T2`, `T3`, `T4`]\>

A new Promise.

#### Inherited from

Promise.all

▸ `Static` **all**<`T1`, `T2`, `T3`\>(`values`): `Promise`<[`T1`, `T2`, `T3`]\>

Creates a Promise that is resolved with an array of results when all of the provided Promises
resolve, or rejected when any Promise is rejected.

#### Type parameters

| Name |
| :------ |
| `T1` |
| `T2` |
| `T3` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | readonly [`T1` \| `PromiseLike`<`T1`\>, `T2` \| `PromiseLike`<`T2`\>, `T3` \| `PromiseLike`<`T3`\>] | An array of Promises. |

#### Returns

`Promise`<[`T1`, `T2`, `T3`]\>

A new Promise.

#### Inherited from

Promise.all

▸ `Static` **all**<`T1`, `T2`\>(`values`): `Promise`<[`T1`, `T2`]\>

Creates a Promise that is resolved with an array of results when all of the provided Promises
resolve, or rejected when any Promise is rejected.

#### Type parameters

| Name |
| :------ |
| `T1` |
| `T2` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | readonly [`T1` \| `PromiseLike`<`T1`\>, `T2` \| `PromiseLike`<`T2`\>] | An array of Promises. |

#### Returns

`Promise`<[`T1`, `T2`]\>

A new Promise.

#### Inherited from

Promise.all

▸ `Static` **all**<`T`\>(`values`): `Promise`<`T`[]\>

Creates a Promise that is resolved with an array of results when all of the provided Promises
resolve, or rejected when any Promise is rejected.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | readonly (`T` \| `PromiseLike`<`T`\>)[] | An array of Promises. |

#### Returns

`Promise`<`T`[]\>

A new Promise.

#### Inherited from

Promise.all

___

### allSettled

▸ `Static` **allSettled**<`T`\>(`values`): `Promise`<{ -readonly[P in string \| number \| symbol]: PromiseSettledResult<T[P] extends PromiseLike<U\> ? U : T[P]\>}\>

Creates a Promise that is resolved with an array of results when all
of the provided Promises resolve or reject.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends readonly `unknown`[] \| readonly [`unknown`] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `T` | An array of Promises. |

#### Returns

`Promise`<{ -readonly[P in string \| number \| symbol]: PromiseSettledResult<T[P] extends PromiseLike<U\> ? U : T[P]\>}\>

A new Promise.

#### Inherited from

Promise.allSettled

▸ `Static` **allSettled**<`T`\>(`values`): `Promise`<`PromiseSettledResult`<`T` extends `PromiseLike`<`U`\> ? `U` : `T`\>[]\>

Creates a Promise that is resolved with an array of results when all
of the provided Promises resolve or reject.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `Iterable`<`T`\> | An array of Promises. |

#### Returns

`Promise`<`PromiseSettledResult`<`T` extends `PromiseLike`<`U`\> ? `U` : `T`\>[]\>

A new Promise.

#### Inherited from

Promise.allSettled

___

### any

▸ `Static` **any**<`T`\>(`values`): `Promise`<`T`\>

The any function returns a promise that is fulfilled by the first given promise to be fulfilled, or rejected with an AggregateError containing an array of rejection reasons if all of the given promises are rejected. It resolves all elements of the passed iterable to promises as it runs this algorithm.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | (`T` \| `PromiseLike`<`T`\>)[] \| `Iterable`<`T` \| `PromiseLike`<`T`\>\> | An array or iterable of Promises. |

#### Returns

`Promise`<`T`\>

A new Promise.

#### Inherited from

Promise.any

___

### race

▸ `Static` **race**<`T`\>(`values`): `Promise`<`T` extends `PromiseLike`<`U`\> ? `U` : `T`\>

Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
or rejected.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `Iterable`<`T`\> | An iterable of Promises. |

#### Returns

`Promise`<`T` extends `PromiseLike`<`U`\> ? `U` : `T`\>

A new Promise.

#### Inherited from

Promise.race

▸ `Static` **race**<`T`\>(`values`): `Promise`<`T`\>

Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
or rejected.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `Iterable`<`T` \| `PromiseLike`<`T`\>\> | An iterable of Promises. |

#### Returns

`Promise`<`T`\>

A new Promise.

#### Inherited from

Promise.race

▸ `Static` **race**<`T`\>(`values`): `Promise`<`T` extends `PromiseLike`<`U`\> ? `U` : `T`\>

Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
or rejected.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | readonly `T`[] | An array of Promises. |

#### Returns

`Promise`<`T` extends `PromiseLike`<`U`\> ? `U` : `T`\>

A new Promise.

#### Inherited from

Promise.race

___

### reject

▸ `Static` **reject**<`T`\>(`reason?`): `Promise`<`T`\>

Creates a new rejected promise for the provided reason.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `never` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `reason?` | `any` | The reason the promise was rejected. |

#### Returns

`Promise`<`T`\>

A new rejected Promise.

#### Inherited from

Promise.reject

___

### resolve

▸ `Static` **resolve**(): `Promise`<`void`\>

Creates a new resolved promise.

#### Returns

`Promise`<`void`\>

A resolved promise.

#### Inherited from

Promise.resolve

▸ `Static` **resolve**<`T`\>(`value`): `Promise`<`T`\>

Creates a new resolved promise for the provided value.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `T` \| `PromiseLike`<`T`\> | A promise. |

#### Returns

`Promise`<`T`\>

A promise whose internal state matches the provided promise.

#### Inherited from

Promise.resolve
