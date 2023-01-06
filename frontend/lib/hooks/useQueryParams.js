import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

const useQueryParams = () => {
    const router = useRouter();
    const urlParams = useSearchParams();

    const params = useMemo(() => {
        const placeholder = {};

        for (const [key, value] of urlParams) {
            placeholder[key] = value;
        };

        return placeholder;
    }, [urlParams]);

    const updateParams = useCallback((updatedParams) => {
        const current = new URLSearchParams(urlParams.toString());
        for (const key in updatedParams) {
	    if (!!current.get(key)) {
                current.delete(key);
	    }

            if (typeof(updatedParams[key]) !== 'undefined') {
		current.append(key, updatedParams[key]);
	    }
        }
        router.push(`/?${current.toString()}`);
    }, [urlParams, router]);

    return {
        params,
        updateParams
    };

}

export default useQueryParams;
