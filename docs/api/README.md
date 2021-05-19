test-react-hooks - v*

# test-react-hooks - v*

## Table of contents

### Classes

- [AlreadySuspendedError](classes/alreadysuspendederror.md)
- [CheckWrapperError](classes/checkwrappererror.md)
- [UnknownError](classes/unknownerror.md)

### Type aliases

- [CreateTestProxyOptions](README.md#createtestproxyoptions)
- [Suspended](README.md#suspended)
- [TestHook](README.md#testhook)
- [TestProxyControl](README.md#testproxycontrol)
- [WrapperComponent](README.md#wrappercomponent)

### Variables

- [SUSPENDED](README.md#suspended)

### Functions

- [act](README.md#act)
- [cleanUp](README.md#cleanup)
- [createTestProxy](README.md#createtestproxy)

## Type aliases

### CreateTestProxyOptions

Ƭ **CreateTestProxyOptions**: *object*

Options for [createTestProxy](README.md#createtestproxy)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `actFn?` | *typeof* [*act*](README.md#act) | The act function that react needs, use this if you need to use multiple react [multiple-renderers](https://reactjs.org/docs/testing-recipes.html#multiple-renderers) |
| `autoInvokeSuspense?` | *boolean* | When a proxied function that is not in the initial render call suspends it has to be invoked after the promise resolves to see if it ultimately failed. If this is set to false {@link waitForNextUpdate} will not reject on error and instead the next invocation will throw. |
| `strict?` | *boolean* | Should the proxy throw an error or print a warning, defaults to true. |
| `testRendererOptions?` | TestRendererOptions | Options that are forwarded to [react-test-renderer](https://reactjs.org/docs/test-renderer.html) |
| `wrapper?` | [*WrapperComponent*](README.md#wrappercomponent) | Wrapper component for the hook callback, make sure children is rendered |

Defined in: [src/createTestProxy.tsx:49](https://github.com/andrew-w-ross/test-react-hooks/blob/852bb0c/src/createTestProxy.tsx#L49)

___

### Suspended

Ƭ **Suspended**: *typeof* [*SUSPENDED*](README.md#suspended)

Type alias for the [SUSPENDED](README.md#suspended) symbol

Defined in: [src/models.ts:11](https://github.com/andrew-w-ross/test-react-hooks/blob/852bb0c/src/models.ts#L11)

___

### TestHook

Ƭ **TestHook**: (...`args`: *any*[]) => *any*

#### Type declaration

▸ (...`args`: *any*[]): *any*

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | *any*[] |

**Returns:** *any*

Defined in: [src/createTestProxy.tsx:44](https://github.com/andrew-w-ross/test-react-hooks/blob/852bb0c/src/createTestProxy.tsx#L44)

___

### TestProxyControl

Ƭ **TestProxyControl**: *ReturnType*<*typeof* [*createTestProxy*](README.md#createtestproxy)\>[``1``]

Defined in: [src/createTestProxy.tsx:211](https://github.com/andrew-w-ross/test-react-hooks/blob/852bb0c/src/createTestProxy.tsx#L211)

___

### WrapperComponent

Ƭ **WrapperComponent**: *ComponentType*<{ `children`: ReactNode  }\>

Wrapper component to take in and render the children

Defined in: [src/createTestProxy.tsx:40](https://github.com/andrew-w-ross/test-react-hooks/blob/852bb0c/src/createTestProxy.tsx#L40)

## Variables

### SUSPENDED

• `Const` **SUSPENDED**: *typeof* [*SUSPENDED*](README.md#suspended)

Symbol that is returned if the call to that function is suspended.

Defined in: [src/models.ts:6](https://github.com/andrew-w-ross/test-react-hooks/blob/852bb0c/src/models.ts#L6)

## Functions

### act

▸ **act**(`callback`: () => *Promise*<VoidOrUndefinedOnly\>): *Promise*<undefined\>

Wrap any code rendering and triggering updates to your components into `act()` calls.

Ensures that the behavior in your tests matches what happens in the browser
more closely by executing pending `useEffect`s before returning. This also
reduces the amount of re-renders done.

**`see`** https://reactjs.org/blog/2019/02/06/react-v16.8.0.html#testing-hooks

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | () => *Promise*<VoidOrUndefinedOnly\> | An asynchronous, void callback that will execute as a single, complete React commit. |

**Returns:** *Promise*<undefined\>

Defined in: node_modules/@types/react-test-renderer/index.d.ts:75

▸ **act**(`callback`: () => VoidOrUndefinedOnly): DebugPromiseLike

Wrap any code rendering and triggering updates to your components into `act()` calls.

Ensures that the behavior in your tests matches what happens in the browser
more closely by executing pending `useEffect`s before returning. This also
reduces the amount of re-renders done.

**`see`** https://reactjs.org/blog/2019/02/06/react-v16.8.0.html#testing-hooks

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | () => VoidOrUndefinedOnly | A synchronous, void callback that will execute as a single, complete React commit. |

**Returns:** DebugPromiseLike

Defined in: node_modules/@types/react-test-renderer/index.d.ts:87

___

### cleanUp

▸ **cleanUp**(): *void*

**Returns:** *void*

Defined in: [src/createTestProxy.tsx:14](https://github.com/andrew-w-ross/test-react-hooks/blob/852bb0c/src/createTestProxy.tsx#L14)

___

### createTestProxy

▸ **createTestProxy**<THook\>(`hook`: THook, `options?`: [*CreateTestProxyOptions*](README.md#createtestproxyoptions)): readonly [THook, { `unmount`: () => *void* ; `waitForNextUpdate`: () => *UpdateWaiter* ; `wrapper`:   }]

Main function for `test-react-hooks`
Creates a proxy hook and a control object for that hook
Proxy hook will rerender when called and wrap calls in act when appropriate

**`export`**

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `THook` | [*TestHook*](README.md#testhook) | type of the hook to proxy, should be inferred from hook argument |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `hook` | THook | - | to proxy |
| `options` | [*CreateTestProxyOptions*](README.md#createtestproxyoptions) | {} | - |

**Returns:** readonly [THook, { `unmount`: () => *void* ; `waitForNextUpdate`: () => *UpdateWaiter* ; `wrapper`:   }]

tuple where the first result is the proxied hook and the second is the control object.

Defined in: [src/createTestProxy.tsx:88](https://github.com/andrew-w-ross/test-react-hooks/blob/852bb0c/src/createTestProxy.tsx#L88)
