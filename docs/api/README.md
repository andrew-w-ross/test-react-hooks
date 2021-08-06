test-react-hooks - v3.0.1

# test-react-hooks - v3.0.1

## Table of contents

### Classes

- [AlreadyExecutedError](classes/AlreadyExecutedError.md)
- [AlreadySuspendedError](classes/AlreadySuspendedError.md)
- [CheckWrapperError](classes/CheckWrapperError.md)
- [UnknownError](classes/UnknownError.md)
- [UpdateWaiter](classes/UpdateWaiter.md)

### Type aliases

- [CreateTestProxyOptions](README.md#createtestproxyoptions)
- [DefaultCreateTestProxyOptions](README.md#defaultcreatetestproxyoptions)
- [Suspended](README.md#suspended)
- [TestHook](README.md#testhook)
- [TestProxyControl](README.md#testproxycontrol)
- [UpdateEvent](README.md#updateevent)
- [WrapperComponent](README.md#wrappercomponent)

### Variables

- [DEFAULT\_OPTIONS](README.md#default_options)
- [SUSPENDED](README.md#suspended)

### Functions

- [act](README.md#act)
- [cleanUp](README.md#cleanup)
- [createTestProxy](README.md#createtestproxy)

## Type aliases

### CreateTestProxyOptions

Ƭ **CreateTestProxyOptions**: `Partial`<`Omit`<[`DefaultCreateTestProxyOptions`](README.md#defaultcreatetestproxyoptions), ``"waiterDefault"``\>\>

___

### DefaultCreateTestProxyOptions

Ƭ **DefaultCreateTestProxyOptions**: `Object`

Options for [createTestProxy](README.md#createtestproxy)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `actFn` | typeof [`act`](README.md#act) | The act function that react needs, use this if you need to use multiple react [multiple-renderers](https://reactjs.org/docs/testing-recipes.html#multiple-renderers) |
| `autoInvokeSuspense` | `boolean` | When a proxied function that is not in the initial render call suspends it has to be invoked after the promise resolves to see if it ultimately failed. If this is set to false {@link waitForNextUpdate} will not reject on error and instead the next invocation will throw. |
| `strict` | `boolean` | Should the proxy throw an error or print a warning, defaults to true. |
| `testRendererOptions?` | `TestRendererOptions` | Options that are forwarded to [react-test-renderer](https://reactjs.org/docs/test-renderer.html) |
| `wrapper` | [`WrapperComponent`](README.md#wrappercomponent) | Wrapper component for the hook callback, make sure children is rendered |
| `waiterDefault` | (`waiter`: [`UpdateWaiter`](classes/UpdateWaiter.md)) => `any` | - |

___

### Suspended

Ƭ **Suspended**: typeof [`SUSPENDED`](README.md#suspended)

Type alias for the [SUSPENDED](README.md#suspended) symbol

___

### TestHook

Ƭ **TestHook**: (...`args`: `any`[]) => `any`

#### Type declaration

▸ (...`args`): `any`

Type definition for a hook

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`any`

___

### TestProxyControl

Ƭ **TestProxyControl**: `ReturnType`<typeof [`createTestProxy`](README.md#createtestproxy)\>[``1``]

___

### UpdateEvent

Ƭ **UpdateEvent**: { `async`: `boolean` ; `error?`: `undefined`  } \| { `async?`: `undefined` ; `error`: `Error`  }

Update events while rendering
 If async is true then the update is happening in response to something other than a direct call to the hook.
 If error is defined then something went wrong.

___

### WrapperComponent

Ƭ **WrapperComponent**: `ComponentType`<`Object`\>

Wrapper component to take in and render the children

## Variables

### DEFAULT\_OPTIONS

• `Const` **DEFAULT\_OPTIONS**: [`DefaultCreateTestProxyOptions`](README.md#defaultcreatetestproxyoptions)

___

### SUSPENDED

• `Const` **SUSPENDED**: typeof [`SUSPENDED`](README.md#suspended)

Symbol that is returned if the call to that function is suspended.

## Functions

### act

▸ **act**(`callback`): `Promise`<`undefined`\>

Wrap any code rendering and triggering updates to your components into `act()` calls.

Ensures that the behavior in your tests matches what happens in the browser
more closely by executing pending `useEffect`s before returning. This also
reduces the amount of re-renders done.

**`see`** https://reactjs.org/blog/2019/02/06/react-v16.8.0.html#testing-hooks

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | () => `Promise`<`VoidOrUndefinedOnly`\> | An asynchronous, void callback that will execute as a single, complete React commit. |

#### Returns

`Promise`<`undefined`\>

▸ **act**(`callback`): `DebugPromiseLike`

Wrap any code rendering and triggering updates to your components into `act()` calls.

Ensures that the behavior in your tests matches what happens in the browser
more closely by executing pending `useEffect`s before returning. This also
reduces the amount of re-renders done.

**`see`** https://reactjs.org/blog/2019/02/06/react-v16.8.0.html#testing-hooks

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | () => `VoidOrUndefinedOnly` | A synchronous, void callback that will execute as a single, complete React commit. |

#### Returns

`DebugPromiseLike`

___

### cleanUp

▸ **cleanUp**(): `void`

#### Returns

`void`

___

### createTestProxy

▸ **createTestProxy**<`THook`\>(`hook`, `options?`): readonly [`THook`, { `unmount`: () => `void` ; `waitForNextUpdate`: () => [`UpdateWaiter`](classes/UpdateWaiter.md) ; `wrapper`:   }]

Main function for `test-react-hooks`
Creates a proxy hook and a control object for that hook
Proxy hook will rerender when called and wrap calls in act when appropriate

**`export`**

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `THook` | extends [`TestHook`](README.md#testhook) | type of the hook to proxy, should be inferred from hook argument |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hook` | `THook` | to proxy |
| `options` | [`CreateTestProxyOptions`](README.md#createtestproxyoptions) | - |

#### Returns

readonly [`THook`, { `unmount`: () => `void` ; `waitForNextUpdate`: () => [`UpdateWaiter`](classes/UpdateWaiter.md) ; `wrapper`:   }]

tuple where the first result is the proxied hook and the second is the control object.
