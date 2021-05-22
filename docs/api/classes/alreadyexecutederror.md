[test-react-hooks - v*](../README.md) / AlreadyExecutedError

# Class: AlreadyExecutedError

## Hierarchy

- *Error*

  ↳ **AlreadyExecutedError**

## Table of contents

### Constructors

- [constructor](alreadyexecutederror.md#constructor)

### Properties

- [message](alreadyexecutederror.md#message)
- [name](alreadyexecutederror.md#name)
- [stack](alreadyexecutederror.md#stack)
- [prepareStackTrace](alreadyexecutederror.md#preparestacktrace)
- [stackTraceLimit](alreadyexecutederror.md#stacktracelimit)

### Methods

- [captureStackTrace](alreadyexecutederror.md#capturestacktrace)

## Constructors

### constructor

\+ **new AlreadyExecutedError**(): [*AlreadyExecutedError*](alreadyexecutederror.md)

**Returns:** [*AlreadyExecutedError*](alreadyexecutederror.md)

Overrides: Error.constructor

Defined in: [src/models.ts:36](https://github.com/andrew-w-ross/test-react-hooks/blob/d41c3e5/src/models.ts#L36)

## Properties

### message

• **message**: *string*

Inherited from: Error.message

Defined in: node_modules/typescript/lib/lib.es5.d.ts:974

___

### name

• **name**: *string*

Inherited from: Error.name

Defined in: node_modules/typescript/lib/lib.es5.d.ts:973

___

### stack

• `Optional` **stack**: *string*

Inherited from: Error.stack

Defined in: node_modules/typescript/lib/lib.es5.d.ts:975

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

Defined in: node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: *number*

Inherited from: Error.stackTraceLimit

Defined in: node_modules/@types/node/globals.d.ts:13

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

Defined in: node_modules/@types/node/globals.d.ts:4
