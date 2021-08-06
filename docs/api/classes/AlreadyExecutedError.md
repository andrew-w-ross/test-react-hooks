[test-react-hooks - v3.0.1](../README.md) / AlreadyExecutedError

# Class: AlreadyExecutedError

## Hierarchy

- `Error`

  ↳ **`AlreadyExecutedError`**

## Table of contents

### Constructors

- [constructor](AlreadyExecutedError.md#constructor)

### Properties

- [message](AlreadyExecutedError.md#message)
- [name](AlreadyExecutedError.md#name)
- [stack](AlreadyExecutedError.md#stack)
- [prepareStackTrace](AlreadyExecutedError.md#preparestacktrace)
- [stackTraceLimit](AlreadyExecutedError.md#stacktracelimit)

### Methods

- [captureStackTrace](AlreadyExecutedError.md#capturestacktrace)

## Constructors

### constructor

• **new AlreadyExecutedError**()

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
