
export const scrollTo = (elementRef, behavior = "smooth") => {
    if (!elementRef?.current) return;

    elementRef.current.scrollIntoView({
        behavior,
        block: "start",
    });
};
