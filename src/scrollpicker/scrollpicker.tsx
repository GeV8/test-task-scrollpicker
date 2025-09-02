import React, {useEffect, useRef, useState} from "react";

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

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


    return (
        <div
            ref={containerRef}
            onWheel={(e) => {
            }}
            style={{
                height: ITEM_HEIGHT * VISIBLE_ITEMS,
                overflowY: "scroll",
                textAlign: "center",
                scrollbarWidth: "none",
            }}
        >
            <div
                style={{paddingTop: ITEM_HEIGHT * 2, paddingBottom: ITEM_HEIGHT * 2}}
            >
                {values.map((val, i) => (
                    <div
                        key={i}
                        style={{
                            height: ITEM_HEIGHT,
                            width: '200px',
                            lineHeight: ITEM_HEIGHT + "px",
                            fontSize: selected === val ? "20px" : "16px",
                            fontWeight: selected === val ? "bold" : "normal",
                            color: selected === val ? "#000" : "#aaa",
                        }}
                    >
                        {val}
                    </div>
                ))}
            </div>
        </div>
    );
};

const ScrollPicker = () => {
    const searchParams = new URLSearchParams(window.location.search);

    const initialDate = searchParams.get("date") || "Today";
    const initialHour = searchParams.get("hour") || "5";
    const initialMinute = searchParams.get("minute") || "00";
    const initialAmPm = searchParams.get("ampm") || "PM";

    const [day, setDay] = useState(initialDate);
    const [hour, setHour] = useState(initialHour);
    const [minute, setMinute] = useState(initialMinute);
    const [ampm, setAmPm] = useState(initialAmPm);

    const dates = Array.from({length: 100}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d.toDateString();
    });

    const hours = Array.from({length: 12}, (_, i) => (i + 1).toString());
    const minutes = Array.from({length: 60}, (_, i) =>
        i.toString().padStart(2, "0")
    );
    const ampmOptions = ["AM", "PM"];

    const handleSubmit = () => {
        console.log(`Selected: ${day}, ${hour}:${minute} ${ampm}`);
    };

    return (
        <div style={{textAlign: "center", padding: 20}}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 10,
                    borderTop: "1px solid #ddd",
                    borderBottom: "1px solid #ddd",
                }}
            >
                <ScrollColumn values={dates} selected={day} onChange={setDay}/>
                <ScrollColumn values={hours} selected={hour} onChange={setHour}/>
                <ScrollColumn values={minutes} selected={minute} onChange={setMinute}/>
                <ScrollColumn values={ampmOptions} selected={ampm} onChange={setAmPm}/>
            </div>
            <button
                onClick={handleSubmit}
                style={{marginTop: 20, padding: "10px 20px", fontSize: "18px"}}
            >
                Submit
            </button>
        </div>
    );
};

export default ScrollPicker;
