[test-react-hooks - v*](../README.md) / AlreadySuspendedError

# Class: AlreadySuspendedError

Thrown if a hook is already in a suspended state.
Probably means that you'll need to wait for the suspension to complete.

## Hierarchy

- *Error*

  ↳ **AlreadySuspendedError**

## Table of contents

### Constructors

- [constructor](alreadysuspendederror.md#constructor)

### Properties

- [message](alreadysuspendederror.md#message)
- [name](alreadysuspendederror.md#name)
- [stack](alreadysuspendederror.md#stack)
- [prepareStackTrace](alreadysuspendederror.md#preparestacktrace)
- [stackTraceLimit](alreadysuspendederror.md#stacktracelimit)

### Methods

- [captureStackTrace](alreadysuspendederror.md#capturestacktrace)
- [getErrorMessage](alreadysuspendederror.md#geterrormessage)

## Constructors

### constructor

\+ **new AlreadySuspendedError**(`applyArgs`: *any*[]): [*AlreadySuspendedError*](alreadysuspendederror.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `applyArgs` | *any*[] |

**Returns:** [*AlreadySuspendedError*](alreadysuspendederror.md)

Overrides: Error.constructor

## Properties

### message

• **message**: *string*

Inherited from: Error.message

___

### name

• **name**: *string*

Inherited from: Error.name

___

### stack

• `Optional` **stack**: *string*

Inherited from: Error.stack

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: Error, `stackTraces`: CallSite[]) => *any*

Optional override for formatting stack traces

**`see`** https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Type declaration

▸ (`err`: Error, `stackTraces`: CallSite[]): *any*

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | Error |
| `stackTraces` | CallSite[] |

**Returns:** *any*

Inherited from: Error.prepareStackTrace

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: *number*

Inherited from: Error.stackTraceLimit

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`: *object*, `constructorOpt?`: Function): *void*

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | *object* |
| `constructorOpt?` | Function |

**Returns:** *void*

Inherited from: Error.captureStackTrace

___

### getErrorMessage

▸ `Static` **getErrorMessage**(`applyArgs`: *any*[]): *string*

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `applyArgs` | *any*[] | Arguments sent to {@see Reflect.apply} |

**Returns:** *string*
