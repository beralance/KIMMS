import { useEffect } from "react";

export function ScrollOnTop() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return <div>My page content...</div>;
}
