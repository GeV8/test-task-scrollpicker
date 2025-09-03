import { useEffect, useRef, useMemo } from "react";
import "./style.css";

const ITEM_HEIGHT = 50;

const ScrollColumn = (
    {
        values,
        selected,
        onChange,
    }:
    {
        values: string[];
        selected: string;
        onChange: (val: string) => void;
    }
) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollEndTimer = useRef<number | null>(null);
    const isUserScrolling = useRef(false);

    const extendedValues = useMemo(() => [...values, ...values, ...values], [values]);
    const originalLength = values.length;

    const clamp = (i: number) => Math.max(0, Math.min(extendedValues.length - 1, i));
    const indexFromScroll = (st: number) => clamp(Math.round(st / ITEM_HEIGHT));
    const scrollToIndex = (i: number, behavior: ScrollBehavior = "smooth") => {
        containerRef.current?.scrollTo({ top: i * ITEM_HEIGHT, behavior });
    };

    useEffect(() => {
        if (!containerRef.current) return;
        const idx = values.indexOf(selected);
        if (idx < 0) return;
        scrollToIndex(idx + originalLength, "auto");
    }, [selected, values, originalLength]);

    const handleScroll = () => {
        if (!containerRef.current) return;
        isUserScrolling.current = true;

        let scrollTop = containerRef.current.scrollTop;
        const totalHeight = ITEM_HEIGHT * originalLength;

        // Зацикливание: если дошли до верхнего или нижнего дубликата
        if (scrollTop >= totalHeight * 2) {
            containerRef.current.scrollTop = scrollTop - totalHeight;
            scrollTop -= totalHeight;
        } else if (scrollTop < totalHeight) {
            containerRef.current.scrollTop = scrollTop + totalHeight;
            scrollTop += totalHeight;
        }

        const idx = indexFromScroll(scrollTop) % originalLength;
        onChange(values[idx]);

        if (scrollEndTimer.current) window.clearTimeout(scrollEndTimer.current);
        scrollEndTimer.current = window.setTimeout(() => {
            isUserScrolling.current = false;
            const snapIdx = indexFromScroll(containerRef.current!.scrollTop) % originalLength;
            scrollToIndex(snapIdx + originalLength, "smooth"); // snap к середине
        }, 80);
    };

    return (
        <div
            ref={containerRef}
            className="scrollcolumn-container"
            role="listbox"
            tabIndex={0}
            aria-label="Scroll picker column"
            onScroll={handleScroll}
        >
            <div className="scrollcolumn-inner">
                {extendedValues.map((val, i) => (
                    <div
                        key={i}
                        role="option"
                        aria-selected={selected === val}
                        className={
                            "scrollcolumn-item" +
                            (selected === val ? " scrollcolumn-item-selected" : "")
                        }
                        onClick={() => {
                            onChange(val);
                            scrollToIndex(i);
                        }}
                    >
                        {val}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScrollColumn;
