import { useEffect } from "react";

export function ScrollOnTop() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []); // empty dependency → runs once on mount

    return <div>My page content...</div>;
}
