import { useEffect, useRef } from "react";
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

    const clamp = (i: number) => Math.max(0, Math.min(values.length - 1, i));
    const indexFromScroll = (st: number) => clamp(Math.round(st / ITEM_HEIGHT));
    const scrollToIndex = (i: number, behavior: ScrollBehavior = "smooth") => {
        containerRef.current?.scrollTo({ top: i * ITEM_HEIGHT, behavior });
    };

    useEffect(() => {
        if (!containerRef.current) return;
        const idx = values.indexOf(selected);
        if (idx < 0) return;
        if (isUserScrolling.current) return;
        const target = idx * ITEM_HEIGHT;
        if (Math.abs(containerRef.current.scrollTop - target) > 1) {
            scrollToIndex(idx, "auto");
        }
    }, [selected, values]);

    return (
        <div
            ref={containerRef}
            className="scrollcolumn-container"
            role="listbox"
            tabIndex={0}
            aria-label="Scroll picker column"
            onScroll={() => {
                if (!containerRef.current) return;
                isUserScrolling.current = true;

                const sc = containerRef.current.scrollTop;
                const idx = indexFromScroll(sc);
                onChange(values[idx]);

                if (scrollEndTimer.current) window.clearTimeout(scrollEndTimer.current);
                scrollEndTimer.current = window.setTimeout(() => {
                    isUserScrolling.current = false;
                    // Снэп к ближайшему элементу
                    const snapIdx = indexFromScroll(containerRef.current!.scrollTop);
                    scrollToIndex(snapIdx);
                }, 80);
            }}
        >
            <div className="scrollcolumn-inner">
                {values.map((val, i) => (
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
