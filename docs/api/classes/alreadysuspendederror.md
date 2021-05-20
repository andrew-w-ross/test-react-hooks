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

Defined in: [src/models.ts:17](https://github.com/andrew-w-ross/test-react-hooks/blob/bc5d020/src/models.ts#L17)

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

___

### getErrorMessage

▸ `Static` **getErrorMessage**(`applyArgs`: *any*[]): *string*

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `applyArgs` | *any*[] | Arguments sent to {@see Reflect.apply} |

**Returns:** *string*

Defined in: [src/models.ts:26](https://github.com/andrew-w-ross/test-react-hooks/blob/bc5d020/src/models.ts#L26)
