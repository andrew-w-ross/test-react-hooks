[test-react-hooks - v*](../README.md) / UnknownError

# Class: UnknownError

Something has gone wrong please report this issue.

## Hierarchy

- *Error*

  ↳ **UnknownError**

## Table of contents

### Constructors

- [constructor](unknownerror.md#constructor)

### Properties

- [message](unknownerror.md#message)
- [name](unknownerror.md#name)
- [stack](unknownerror.md#stack)
- [prepareStackTrace](unknownerror.md#preparestacktrace)
- [stackTraceLimit](unknownerror.md#stacktracelimit)

### Methods

- [captureStackTrace](unknownerror.md#capturestacktrace)

## Constructors

### constructor

\+ **new UnknownError**(): [*UnknownError*](unknownerror.md)

**Returns:** [*UnknownError*](unknownerror.md)

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
