[test-react-hooks - v*](../README.md) / UpdateWaiter

# Class: UpdateWaiter

UpdateWaiter is a fluent api that will resolve when it's conditions are met.

## Hierarchy

- *Promise*<void\>

  ↳ **UpdateWaiter**

## Table of contents

### Constructors

- [constructor](updatewaiter.md#constructor)

### Properties

- [[Symbol.toStringTag]](updatewaiter.md#[symbol.tostringtag])
- [\_actFn](updatewaiter.md#_actfn)
- [executed](updatewaiter.md#executed)
- [waitMode](updatewaiter.md#waitmode)
- [waiters](updatewaiter.md#waiters)
- [[Symbol.species]](updatewaiter.md#[symbol.species])

### Methods

- [act](updatewaiter.md#act)
- [addWaiter](updatewaiter.md#addwaiter)
- [catch](updatewaiter.md#catch)
- [debounce](updatewaiter.md#debounce)
- [finally](updatewaiter.md#finally)
- [then](updatewaiter.md#then)
- [updateCount](updatewaiter.md#updatecount)
- [waitAll](updatewaiter.md#waitall)
- [waitRace](updatewaiter.md#waitrace)
- [all](updatewaiter.md#all)
- [allSettled](updatewaiter.md#allsettled)
- [any](updatewaiter.md#any)
- [race](updatewaiter.md#race)
- [reject](updatewaiter.md#reject)
- [resolve](updatewaiter.md#resolve)

## Constructors

### constructor

\+ **new UpdateWaiter**(`executor`: (`resolve`: (`value`: *void* \| *PromiseLike*<void\>) => *void*, `reject`: (`reason?`: *any*) => *void*) => *void*, `updateObserver`: *Observable*<UpdateEvent\>): [*UpdateWaiter*](updatewaiter.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `executor` | (`resolve`: (`value`: *void* \| *PromiseLike*<void\>) => *void*, `reject`: (`reason?`: *any*) => *void*) => *void* |
| `updateObserver` | *Observable*<UpdateEvent\> |

**Returns:** [*UpdateWaiter*](updatewaiter.md)

Overrides: Promise&lt;void\&gt;.constructor

Defined in: [src/updateWaiter.ts:35](https://github.com/andrew-w-ross/test-react-hooks/blob/d41c3e5/src/updateWaiter.ts#L35)

## Properties

### [Symbol.toStringTag]

• `Readonly` **[Symbol.toStringTag]**: *string*

Inherited from: Promise.\_\_@toStringTag

Defined in: node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:174

___

### \_actFn

• `Optional` **\_actFn**: () => *any*

#### Type declaration

▸ (): *any*

**Returns:** *any*

Defined in: [src/updateWaiter.ts:35](https://github.com/andrew-w-ross/test-react-hooks/blob/d41c3e5/src/updateWaiter.ts#L35)

___

### executed

• **executed**: *boolean*= false

Defined in: [src/updateWaiter.ts:32](https://github.com/andrew-w-ross/test-react-hooks/blob/d41c3e5/src/updateWaiter.ts#L32)

___

### waitMode

• **waitMode**: WaitMode= "all"

Defined in: [src/updateWaiter.ts:34](https://github.com/andrew-w-ross/test-react-hooks/blob/d41c3e5/src/updateWaiter.ts#L34)

___

### waiters

• **waiters**: *ObservableInput*<any\>[]= []

Defined in: [src/updateWaiter.ts:33](https://github.com/andrew-w-ross/test-react-hooks/blob/d41c3e5/src/updateWaiter.ts#L33)

___

### [Symbol.species]

▪ `Static` `Readonly` **[Symbol.species]**: PromiseConstructor

Inherited from: Promise.\_\_@species

Defined in: node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:178

## Methods

### act

▸ **act**(`actFn`: () => *any*): [*UpdateWaiter*](updatewaiter.md)

Function that is called before waiting starts, wrapped in act.

#### Parameters

| Name | Type |
| :------ | :------ |
| `actFn` | () => *any* |

**Returns:** [*UpdateWaiter*](updatewaiter.md)

Defined in: [src/updateWaiter.ts:70](https://github.com/andrew-w-ross/test-react-hooks/blob/d41c3e5/src/updateWaiter.ts#L70)

___

### addWaiter

▸ **addWaiter**(`waitFn`: (`updateObserver`: *Observable*<UpdateEvent\>) => *ObservableInput*<any\>): [*UpdateWaiter*](updatewaiter.md)

**`example`**
//Wait for 10ms
createWaiter().addWaiter((updateObserver) => new Promise((resolve) => setTimeout(resolve, 10)));

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `waitFn` | (`updateObserver`: *Observable*<UpdateEvent\>) => *ObservableInput*<any\> | function that takes in an {Observable<UpdateEvent>} and returns an {Observable<any>} or a {Promise} |

**Returns:** [*UpdateWaiter*](updatewaiter.md)

Defined in: [src/updateWaiter.ts:53](https://github.com/andrew-w-ross/test-react-hooks/blob/d41c3e5/src/updateWaiter.ts#L53)

___

### catch

▸ **catch**<TResult\>(`onrejected?`: ``null`` \| (`reason`: *any*) => TResult \| *PromiseLike*<TResult\>): *Promise*<void \| TResult\>

Attaches a callback for only the rejection of the Promise.

#### Type parameters

| Name | Default |
| :------ | :------ |
| `TResult` | *never* |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onrejected?` | ``null`` \| (`reason`: *any*) => TResult \| *PromiseLike*<TResult\> | The callback to execute when the Promise is rejected. |

**Returns:** *Promise*<void \| TResult\>

A Promise for the completion of the callback.

Inherited from: Promise.catch

Defined in: node_modules/typescript/lib/lib.es5.d.ts:1460

___

### debounce

▸ **debounce**(`ms?`: *number*): *this*

Waits for the updates to stop for a certain amount of time before stopping.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `ms` | *number* | 3 | Time to wait in ms |

**Returns:** *this*

Defined in: [src/updateWaiter.ts:84](https://github.com/andrew-w-ross/test-react-hooks/blob/d41c3e5/src/updateWaiter.ts#L84)

___

### finally

▸ **finally**(`onfinally?`: ``null`` \| () => *void*): *Promise*<void\>

Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
resolved value cannot be modified from the callback.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onfinally?` | ``null`` \| () => *void* | The callback to execute when the Promise is settled (fulfilled or rejected). |

**Returns:** *Promise*<void\>

A Promise for the completion of the callback.

Inherited from: Promise.finally

Defined in: node_modules/typescript/lib/lib.es2018.promise.d.ts:31

___

### then

▸ **then**<TResult1, TResult2\>(`onfulfilled?`: ``null`` \| (`value`: *void*) => TResult1 \| *PromiseLike*<TResult1\>, `onrejected?`: ``null`` \| (`reason`: *any*) => TResult2 \| *PromiseLike*<TResult2\>): *Promise*<TResult1 \| TResult2\>

Attaches callbacks for the resolution and/or rejection of the Promise.

#### Type parameters

| Name | Default |
| :------ | :------ |
| `TResult1` | *void* |
| `TResult2` | *never* |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onfulfilled?` | ``null`` \| (`value`: *void*) => TResult1 \| *PromiseLike*<TResult1\> | The callback to execute when the Promise is resolved. |
| `onrejected?` | ``null`` \| (`reason`: *any*) => TResult2 \| *PromiseLike*<TResult2\> | The callback to execute when the Promise is rejected. |

**Returns:** *Promise*<TResult1 \| TResult2\>

A Promise for the completion of which ever callback is executed.

Inherited from: Promise.then

Defined in: node_modules/typescript/lib/lib.es5.d.ts:1453

___

### updateCount

▸ **updateCount**(`count?`: *number*): *this*

Waits for a certain amount of updates before resolving.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `count` | *number* | 1 | Amount of update to wait for. |

**Returns:** *this*

Defined in: [src/updateWaiter.ts:96](https://github.com/andrew-w-ross/test-react-hooks/blob/d41c3e5/src/updateWaiter.ts#L96)

___

### waitAll

▸ **waitAll**(): [*UpdateWaiter*](updatewaiter.md)

Waits for all of the waiters to resolve before resolving

**Returns:** [*UpdateWaiter*](updatewaiter.md)

Defined in: [src/updateWaiter.ts:107](https://github.com/andrew-w-ross/test-react-hooks/blob/d41c3e5/src/updateWaiter.ts#L107)

___

### waitRace

▸ **waitRace**(): [*UpdateWaiter*](updatewaiter.md)

Waits for one of the waiters to resolve before resolving

**Returns:** [*UpdateWaiter*](updatewaiter.md)

Defined in: [src/updateWaiter.ts:115](https://github.com/andrew-w-ross/test-react-hooks/blob/d41c3e5/src/updateWaiter.ts#L115)

___

### all

▸ `Static` **all**<T\>(`values`: *Iterable*<T \| PromiseLike<T\>\>): *Promise*<T[]\>

Creates a Promise that is resolved with an array of results when all of the provided Promises
resolve, or rejected when any Promise is rejected.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | *Iterable*<T \| PromiseLike<T\>\> | An iterable of Promises. |

**Returns:** *Promise*<T[]\>

A new Promise.

Inherited from: Promise.all

Defined in: node_modules/typescript/lib/lib.es2015.iterable.d.ts:226

▸ `Static` **all**<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10\>(`values`: readonly [T1 \| *PromiseLike*<T1\>, T2 \| *PromiseLike*<T2\>, T3 \| *PromiseLike*<T3\>, T4 \| *PromiseLike*<T4\>, T5 \| *PromiseLike*<T5\>, T6 \| *PromiseLike*<T6\>, T7 \| *PromiseLike*<T7\>, T8 \| *PromiseLike*<T8\>, T9 \| *PromiseLike*<T9\>, T10 \| *PromiseLike*<T10\>]): *Promise*<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]\>

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
| `values` | readonly [T1 \| *PromiseLike*<T1\>, T2 \| *PromiseLike*<T2\>, T3 \| *PromiseLike*<T3\>, T4 \| *PromiseLike*<T4\>, T5 \| *PromiseLike*<T5\>, T6 \| *PromiseLike*<T6\>, T7 \| *PromiseLike*<T7\>, T8 \| *PromiseLike*<T8\>, T9 \| *PromiseLike*<T9\>, T10 \| *PromiseLike*<T10\>] | An array of Promises. |

**Returns:** *Promise*<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]\>

A new Promise.

Inherited from: Promise.all

Defined in: node_modules/typescript/lib/lib.es2015.promise.d.ts:41

▸ `Static` **all**<T1, T2, T3, T4, T5, T6, T7, T8, T9\>(`values`: readonly [T1 \| *PromiseLike*<T1\>, T2 \| *PromiseLike*<T2\>, T3 \| *PromiseLike*<T3\>, T4 \| *PromiseLike*<T4\>, T5 \| *PromiseLike*<T5\>, T6 \| *PromiseLike*<T6\>, T7 \| *PromiseLike*<T7\>, T8 \| *PromiseLike*<T8\>, T9 \| *PromiseLike*<T9\>]): *Promise*<[T1, T2, T3, T4, T5, T6, T7, T8, T9]\>

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
| `values` | readonly [T1 \| *PromiseLike*<T1\>, T2 \| *PromiseLike*<T2\>, T3 \| *PromiseLike*<T3\>, T4 \| *PromiseLike*<T4\>, T5 \| *PromiseLike*<T5\>, T6 \| *PromiseLike*<T6\>, T7 \| *PromiseLike*<T7\>, T8 \| *PromiseLike*<T8\>, T9 \| *PromiseLike*<T9\>] | An array of Promises. |

**Returns:** *Promise*<[T1, T2, T3, T4, T5, T6, T7, T8, T9]\>

A new Promise.

Inherited from: Promise.all

Defined in: node_modules/typescript/lib/lib.es2015.promise.d.ts:49

▸ `Static` **all**<T1, T2, T3, T4, T5, T6, T7, T8\>(`values`: readonly [T1 \| *PromiseLike*<T1\>, T2 \| *PromiseLike*<T2\>, T3 \| *PromiseLike*<T3\>, T4 \| *PromiseLike*<T4\>, T5 \| *PromiseLike*<T5\>, T6 \| *PromiseLike*<T6\>, T7 \| *PromiseLike*<T7\>, T8 \| *PromiseLike*<T8\>]): *Promise*<[T1, T2, T3, T4, T5, T6, T7, T8]\>

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
| `values` | readonly [T1 \| *PromiseLike*<T1\>, T2 \| *PromiseLike*<T2\>, T3 \| *PromiseLike*<T3\>, T4 \| *PromiseLike*<T4\>, T5 \| *PromiseLike*<T5\>, T6 \| *PromiseLike*<T6\>, T7 \| *PromiseLike*<T7\>, T8 \| *PromiseLike*<T8\>] | An array of Promises. |

**Returns:** *Promise*<[T1, T2, T3, T4, T5, T6, T7, T8]\>

A new Promise.

Inherited from: Promise.all

Defined in: node_modules/typescript/lib/lib.es2015.promise.d.ts:57

▸ `Static` **all**<T1, T2, T3, T4, T5, T6, T7\>(`values`: readonly [T1 \| *PromiseLike*<T1\>, T2 \| *PromiseLike*<T2\>, T3 \| *PromiseLike*<T3\>, T4 \| *PromiseLike*<T4\>, T5 \| *PromiseLike*<T5\>, T6 \| *PromiseLike*<T6\>, T7 \| *PromiseLike*<T7\>]): *Promise*<[T1, T2, T3, T4, T5, T6, T7]\>

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
| `values` | readonly [T1 \| *PromiseLike*<T1\>, T2 \| *PromiseLike*<T2\>, T3 \| *PromiseLike*<T3\>, T4 \| *PromiseLike*<T4\>, T5 \| *PromiseLike*<T5\>, T6 \| *PromiseLike*<T6\>, T7 \| *PromiseLike*<T7\>] | An array of Promises. |

**Returns:** *Promise*<[T1, T2, T3, T4, T5, T6, T7]\>

A new Promise.

Inherited from: Promise.all

Defined in: node_modules/typescript/lib/lib.es2015.promise.d.ts:65

▸ `Static` **all**<T1, T2, T3, T4, T5, T6\>(`values`: readonly [T1 \| *PromiseLike*<T1\>, T2 \| *PromiseLike*<T2\>, T3 \| *PromiseLike*<T3\>, T4 \| *PromiseLike*<T4\>, T5 \| *PromiseLike*<T5\>, T6 \| *PromiseLike*<T6\>]): *Promise*<[T1, T2, T3, T4, T5, T6]\>

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
| `values` | readonly [T1 \| *PromiseLike*<T1\>, T2 \| *PromiseLike*<T2\>, T3 \| *PromiseLike*<T3\>, T4 \| *PromiseLike*<T4\>, T5 \| *PromiseLike*<T5\>, T6 \| *PromiseLike*<T6\>] | An array of Promises. |

**Returns:** *Promise*<[T1, T2, T3, T4, T5, T6]\>

A new Promise.

Inherited from: Promise.all

Defined in: node_modules/typescript/lib/lib.es2015.promise.d.ts:73

▸ `Static` **all**<T1, T2, T3, T4, T5\>(`values`: readonly [T1 \| *PromiseLike*<T1\>, T2 \| *PromiseLike*<T2\>, T3 \| *PromiseLike*<T3\>, T4 \| *PromiseLike*<T4\>, T5 \| *PromiseLike*<T5\>]): *Promise*<[T1, T2, T3, T4, T5]\>

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
| `values` | readonly [T1 \| *PromiseLike*<T1\>, T2 \| *PromiseLike*<T2\>, T3 \| *PromiseLike*<T3\>, T4 \| *PromiseLike*<T4\>, T5 \| *PromiseLike*<T5\>] | An array of Promises. |

**Returns:** *Promise*<[T1, T2, T3, T4, T5]\>

A new Promise.

Inherited from: Promise.all

Defined in: node_modules/typescript/lib/lib.es2015.promise.d.ts:81

▸ `Static` **all**<T1, T2, T3, T4\>(`values`: readonly [T1 \| *PromiseLike*<T1\>, T2 \| *PromiseLike*<T2\>, T3 \| *PromiseLike*<T3\>, T4 \| *PromiseLike*<T4\>]): *Promise*<[T1, T2, T3, T4]\>

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
| `values` | readonly [T1 \| *PromiseLike*<T1\>, T2 \| *PromiseLike*<T2\>, T3 \| *PromiseLike*<T3\>, T4 \| *PromiseLike*<T4\>] | An array of Promises. |

**Returns:** *Promise*<[T1, T2, T3, T4]\>

A new Promise.

Inherited from: Promise.all

Defined in: node_modules/typescript/lib/lib.es2015.promise.d.ts:89

▸ `Static` **all**<T1, T2, T3\>(`values`: readonly [T1 \| *PromiseLike*<T1\>, T2 \| *PromiseLike*<T2\>, T3 \| *PromiseLike*<T3\>]): *Promise*<[T1, T2, T3]\>

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
| `values` | readonly [T1 \| *PromiseLike*<T1\>, T2 \| *PromiseLike*<T2\>, T3 \| *PromiseLike*<T3\>] | An array of Promises. |

**Returns:** *Promise*<[T1, T2, T3]\>

A new Promise.

Inherited from: Promise.all

Defined in: node_modules/typescript/lib/lib.es2015.promise.d.ts:97

▸ `Static` **all**<T1, T2\>(`values`: readonly [T1 \| *PromiseLike*<T1\>, T2 \| *PromiseLike*<T2\>]): *Promise*<[T1, T2]\>

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
| `values` | readonly [T1 \| *PromiseLike*<T1\>, T2 \| *PromiseLike*<T2\>] | An array of Promises. |

**Returns:** *Promise*<[T1, T2]\>

A new Promise.

Inherited from: Promise.all

Defined in: node_modules/typescript/lib/lib.es2015.promise.d.ts:105

▸ `Static` **all**<T\>(`values`: readonly (T \| *PromiseLike*<T\>)[]): *Promise*<T[]\>

Creates a Promise that is resolved with an array of results when all of the provided Promises
resolve, or rejected when any Promise is rejected.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | readonly (T \| *PromiseLike*<T\>)[] | An array of Promises. |

**Returns:** *Promise*<T[]\>

A new Promise.

Inherited from: Promise.all

Defined in: node_modules/typescript/lib/lib.es2015.promise.d.ts:113

___

### allSettled

▸ `Static` **allSettled**<T\>(`values`: T): *Promise*<{ -readonly[P in string \| number \| symbol]: PromiseSettledResult<T[P] extends PromiseLike<U\> ? U : T[P]\>}\>

Creates a Promise that is resolved with an array of results when all
of the provided Promises resolve or reject.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | readonly *unknown*[] \| readonly [*unknown*] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | T | An array of Promises. |

**Returns:** *Promise*<{ -readonly[P in string \| number \| symbol]: PromiseSettledResult<T[P] extends PromiseLike<U\> ? U : T[P]\>}\>

A new Promise.

Inherited from: Promise.allSettled

Defined in: node_modules/typescript/lib/lib.es2020.promise.d.ts:40

▸ `Static` **allSettled**<T\>(`values`: *Iterable*<T\>): *Promise*<PromiseSettledResult<T *extends* *PromiseLike*<U\> ? U : T\>[]\>

Creates a Promise that is resolved with an array of results when all
of the provided Promises resolve or reject.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | *Iterable*<T\> | An array of Promises. |

**Returns:** *Promise*<PromiseSettledResult<T *extends* *PromiseLike*<U\> ? U : T\>[]\>

A new Promise.

Inherited from: Promise.allSettled

Defined in: node_modules/typescript/lib/lib.es2020.promise.d.ts:49

___

### any

▸ `Static` **any**<T\>(`values`: (T \| *PromiseLike*<T\>)[] \| *Iterable*<T \| PromiseLike<T\>\>): *Promise*<T\>

The any function returns a promise that is fulfilled by the first given promise to be fulfilled, or rejected with an AggregateError containing an array of rejection reasons if all of the given promises are rejected. It resolves all elements of the passed iterable to promises as it runs this algorithm.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | (T \| *PromiseLike*<T\>)[] \| *Iterable*<T \| PromiseLike<T\>\> | An array or iterable of Promises. |

**Returns:** *Promise*<T\>

A new Promise.

Inherited from: Promise.any

Defined in: node_modules/typescript/lib/lib.esnext.promise.d.ts:42

___

### race

▸ `Static` **race**<T\>(`values`: *Iterable*<T\>): *Promise*<T *extends* *PromiseLike*<U\> ? U : T\>

Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
or rejected.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | *Iterable*<T\> | An iterable of Promises. |

**Returns:** *Promise*<T *extends* *PromiseLike*<U\> ? U : T\>

A new Promise.

Inherited from: Promise.race

Defined in: node_modules/typescript/lib/lib.es2015.iterable.d.ts:234

▸ `Static` **race**<T\>(`values`: *Iterable*<T \| PromiseLike<T\>\>): *Promise*<T\>

Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
or rejected.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | *Iterable*<T \| PromiseLike<T\>\> | An iterable of Promises. |

**Returns:** *Promise*<T\>

A new Promise.

Inherited from: Promise.race

Defined in: node_modules/typescript/lib/lib.es2015.iterable.d.ts:242

▸ `Static` **race**<T\>(`values`: readonly T[]): *Promise*<T *extends* *PromiseLike*<U\> ? U : T\>

Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
or rejected.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | readonly T[] | An array of Promises. |

**Returns:** *Promise*<T *extends* *PromiseLike*<U\> ? U : T\>

A new Promise.

Inherited from: Promise.race

Defined in: node_modules/typescript/lib/lib.es2015.promise.d.ts:124

___

### reject

▸ `Static` **reject**<T\>(`reason?`: *any*): *Promise*<T\>

Creates a new rejected promise for the provided reason.

#### Type parameters

| Name | Default |
| :------ | :------ |
| `T` | *never* |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `reason?` | *any* | The reason the promise was rejected. |

**Returns:** *Promise*<T\>

A new rejected Promise.

Inherited from: Promise.reject

Defined in: node_modules/typescript/lib/lib.es2015.promise.d.ts:134

___

### resolve

▸ `Static` **resolve**(): *Promise*<void\>

Creates a new resolved promise.

**Returns:** *Promise*<void\>

A resolved promise.

Inherited from: Promise.resolve

Defined in: node_modules/typescript/lib/lib.es2015.promise.d.ts:140

▸ `Static` **resolve**<T\>(`value`: T \| *PromiseLike*<T\>): *Promise*<T\>

Creates a new resolved promise for the provided value.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | T \| *PromiseLike*<T\> | A promise. |

**Returns:** *Promise*<T\>

A promise whose internal state matches the provided promise.

Inherited from: Promise.resolve

Defined in: node_modules/typescript/lib/lib.es2015.promise.d.ts:147
