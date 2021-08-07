[test-react-hooks - v3.0.4](../README.md) / AlreadySuspendedError

# Class: AlreadySuspendedError

Thrown if a hook is already in a suspended state.
Probably means that you'll need to wait for the suspension to complete.

## Hierarchy

- `Error`

  ↳ **`AlreadySuspendedError`**

## Table of contents

### Constructors

- [constructor](AlreadySuspendedError.md#constructor)

### Properties

- [message](AlreadySuspendedError.md#message)
- [name](AlreadySuspendedError.md#name)
- [stack](AlreadySuspendedError.md#stack)
- [prepareStackTrace](AlreadySuspendedError.md#preparestacktrace)
- [stackTraceLimit](AlreadySuspendedError.md#stacktracelimit)

### Methods

- [captureStackTrace](AlreadySuspendedError.md#capturestacktrace)
- [getErrorMessage](AlreadySuspendedError.md#geterrormessage)

## Constructors

### constructor

• **new AlreadySuspendedError**(`applyArgs?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `applyArgs?` | `unknown`[] |

#### Overrides

Error.constructor

## Properties

### message

• **message**: `string`

#### Inherited from

Error.message

___

### name

• **name**: `string`

#### Inherited from

Error.name

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

___

### getErrorMessage

▸ `Static` **getErrorMessage**(`applyArgs?`): `string`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `applyArgs?` | `unknown`[] | Arguments sent to {@link Reflect.apply} |

#### Returns

`string`
