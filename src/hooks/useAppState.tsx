import { useEffect, useRef } from 'react';
import { AppState, NativeEventSubscription } from 'react-native';
import useIsMounted from './useIsMounted';

//  Argument "backgroundHandler" should be a function and it will execute when app goes in background
//  Argument "foregroundHandler" should be a function and it will execute when app come back in foreground
export function useAppState(backgroundHandler, foregroundHandler) {
	const appStateRef = useRef<NativeEventSubscription>();
	const appState = useRef(AppState.currentState);
	const isMounted = useIsMounted();

	useEffect(() => {
		appStateRef.current = AppState.addEventListener('change', (nextState) => {
			if (!isMounted()) return;
			if (appState.current.match(/active/) && nextState.match(/inactive|background/)) {
				backgroundHandler?.();
			} else if (appState.current.match(/inactive|background/) && nextState.match(/active/)) {
				foregroundHandler?.();
			}
			appState.current = nextState;
		});
		return () => appStateRef.current?.remove();
	}, []);

	return [appState];
}
