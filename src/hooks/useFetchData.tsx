import { useState, useRef, useEffect } from 'react';

const useFetchData = (fetcher, { params, onSuccess, onFailure, enabled = true } = {}) => {
    const [{ loading, error, data }, setState] = useState({
        loading: true,
        error: undefined,
        data: undefined,
    });

    const mountedRef = useRef(true);

    const fetchData = (fetchParams = {}) => {
        setState({
            loading: true,
            error: undefined,
        });
        fetcher(fetchParams)
            .then((response) => {
                if (mountedRef.current) {
                    onSuccess?.(response);
                    setState({
                        loading: false,
                        error: undefined,
                        data: response,
                    });
                }
            })
            .catch((err) => {
                if (mountedRef.current) {
                    onFailure?.(err);
                    setState({
                        loading: false,
                        error: err,
                    });
                }
            });
    };

    useEffect(() => {
        mountedRef.current = true;
        if (enabled) {
            fetchData(params);
        }
        return () => {
            mountedRef.current = false;
        };
    }, [enabled]);

    return {
        loading,
        error,
        data,
        reload: fetchData,
        setState,
    };
};

export default useFetchData;
