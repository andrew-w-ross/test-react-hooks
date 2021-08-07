[test-react-hooks - v3.0.4](../README.md) / CheckWrapperError

# Class: CheckWrapperError

Wrapper component passed in did not render it's children.

## Hierarchy

- `Error`

  ↳ **`CheckWrapperError`**

## Table of contents

### Constructors

- [constructor](CheckWrapperError.md#constructor)

### Properties

- [message](CheckWrapperError.md#message)
- [name](CheckWrapperError.md#name)
- [stack](CheckWrapperError.md#stack)
- [prepareStackTrace](CheckWrapperError.md#preparestacktrace)
- [stackTraceLimit](CheckWrapperError.md#stacktracelimit)

### Methods

- [captureStackTrace](CheckWrapperError.md#capturestacktrace)
- [getErrorMessage](CheckWrapperError.md#geterrormessage)

## Constructors

### constructor

• **new CheckWrapperError**(`wrapper`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `wrapper` | `ComponentType`<`any`\> |

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

▸ `Static` **getErrorMessage**(`wrapper`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `wrapper` | `ComponentType`<`any`\> |

#### Returns

`string`
