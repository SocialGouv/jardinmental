import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { colors } from '../utils/colors';

interface StatusBarState {
    backgroundColor: string;
    isCustomColor: boolean;
}

interface StatusBarContextType {
    backgroundColor: string;
    setCustomColor: (color: string) => void;
    resetToDefault: () => void;
    isCustomColor: boolean;
}

type StatusBarAction =
    | { type: 'SET_CUSTOM_COLOR'; payload: string }
    | { type: 'SET_DEFAULT_COLOR'; payload: string }
    | { type: 'RESET_TO_DEFAULT' };

const initialState: StatusBarState = {
    backgroundColor: colors.LIGHT_BLUE,
    isCustomColor: false,
};

const statusBarReducer = (state: StatusBarState, action: StatusBarAction): StatusBarState => {
    switch (action.type) {
        case 'SET_CUSTOM_COLOR':
            return {
                ...state,
                backgroundColor: action.payload,
                isCustomColor: true
            };

        case 'SET_DEFAULT_COLOR':
            return {
                ...state,
                backgroundColor: action.payload,
                isCustomColor: false
            };

        case 'RESET_TO_DEFAULT':
            return {
                ...state,
                isCustomColor: false
            };

        default:
            return state;
    }
};

const StatusBarContext = createContext<StatusBarContextType | undefined>(undefined);

interface StatusBarProviderProps {
    children: ReactNode;
}

export const StatusBarProvider: React.FC<StatusBarProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(statusBarReducer, initialState);

    const setCustomColor = (color: string) => {
        dispatch({ type: 'SET_CUSTOM_COLOR', payload: color });
    };

    const resetToDefault = () => {
        dispatch({ type: 'RESET_TO_DEFAULT' });
    };

    // This method is used by the router to set the default color based on route
    const setDefaultColor = (color: string) => {
        if (!state.isCustomColor) {
            dispatch({ type: 'SET_DEFAULT_COLOR', payload: color });
        }
    };

    const contextValue: StatusBarContextType = {
        backgroundColor: state.backgroundColor,
        setCustomColor,
        resetToDefault,
        isCustomColor: state.isCustomColor,
    };

    // Add setDefaultColor to the context for internal use by router
    const extendedContextValue = {
        ...contextValue,
        setDefaultColor,
    };

    return (
        <StatusBarContext.Provider value={extendedContextValue as any}>
            {children}
        </StatusBarContext.Provider>
    );
};

export const useStatusBar = (): StatusBarContextType => {
    const context = useContext(StatusBarContext);
    if (!context) {
        throw new Error('useStatusBar must be used within StatusBarProvider');
    }
    return context;
};

// Internal hook for router use
export const useStatusBarInternal = () => {
    const context = useContext(StatusBarContext);
    if (!context) {
        throw new Error('useStatusBarInternal must be used within StatusBarProvider');
    }
    return context as StatusBarContextType & { setDefaultColor: (color: string) => void };
};

export default StatusBarContext;
