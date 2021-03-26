import { Component } from 'react';

export type ErrorBoundaryProps = {
    onError?: (err: Error) => void
}

type ErrorState = { 
    hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorState>{

    state = {hasError: false};

    static getDerivedStateFromError(_error: Error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }    

    componentDidCatch(error:Error){
        this.props.onError?.(error);
    }

    render(){
        if(this.state.hasError){
            return null;
        }

        //I think returning undefined is an error
        return this.props.children ?? null;
    }
}