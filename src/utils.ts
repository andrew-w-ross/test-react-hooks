import { act } from "react-test-renderer";

export function randomNumber(){
    return Date.now() + Math.floor(Math.random() * 100000);
}

const NO_RESULT = Symbol("NO_RESULT");

export function returnAct<TResult>(actFn:() => TResult) : TResult{
    let result: typeof NO_RESULT | TResult = NO_RESULT;

    act(() => {
        result = actFn();        
    });

    if(result === NO_RESULT){
        throw new Error('Act was not called');
    }

    return result;
}