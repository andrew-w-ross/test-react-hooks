[test-react-hooks - v*](../README.md) / CheckWrapperError

# Class: CheckWrapperError

Wrapper component passed in did not render it's children.

## Hierarchy

- *Error*

  ↳ **CheckWrapperError**

## Table of contents

### Constructors

- [constructor](checkwrappererror.md#constructor)

### Properties

- [message](checkwrappererror.md#message)
- [name](checkwrappererror.md#name)
- [stack](checkwrappererror.md#stack)
- [prepareStackTrace](checkwrappererror.md#preparestacktrace)
- [stackTraceLimit](checkwrappererror.md#stacktracelimit)

### Methods

- [captureStackTrace](checkwrappererror.md#capturestacktrace)
- [getErrorMessage](checkwrappererror.md#geterrormessage)

## Constructors

### constructor

\+ **new CheckWrapperError**(`wrapper`: *ComponentType*<any\>): [*CheckWrapperError*](checkwrappererror.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `wrapper` | *ComponentType*<any\> |

**Returns:** [*CheckWrapperError*](checkwrappererror.md)

Overrides: Error.constructor

Defined in: [src/models.ts:39](https://github.com/andrew-w-ross/test-react-hooks/blob/852bb0c/src/models.ts#L39)

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

▸ `Static` **getErrorMessage**(`wrapper`: *ComponentType*<any\>): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `wrapper` | *ComponentType*<any\> |

**Returns:** *string*

Defined in: [src/models.ts:44](https://github.com/andrew-w-ross/test-react-hooks/blob/852bb0c/src/models.ts#L44)
