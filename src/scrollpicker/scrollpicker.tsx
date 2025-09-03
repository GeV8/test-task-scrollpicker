import React, {useMemo, useState} from "react";
import ScrollColumn from "./ScrollColumn/scrollcolumn.tsx";
import "./style.css";

const ScrollPicker = () => {
    const searchParams = new URLSearchParams(window.location.search);

    const dates = useMemo(() => Array.from({length: 300}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - 150 + i);
        if (i === 500) return 'Today'
        return d.toDateString().slice(0, 10);
    }), []);
    const hours = useMemo(() => Array.from({length: 12}, (_, i) => (i + 1).toString()), []);
    const minutes= useMemo(() => Array.from({length: 12}, (_, i) => (i * 5).toString().padStart(2, "0")), []);
    const ampmOptions= useMemo(() => ["AM", "PM"], []);

    const qpDate = searchParams.get("date");
    const qpHour = searchParams.get("hour");
    const qpMinute = searchParams.get("minute");
    const qpAmPm = searchParams.get("ampm");

    const [day, setDay] = useState(dates.includes(qpDate || "") ? (qpDate as string) : dates[50]);
    const [hour, setHour] = useState(hours.includes(qpHour || "") ? (qpHour as string) : hours[0]);
    const [minute, setMinute] = useState(minutes.includes(qpMinute || "") ? (qpMinute as string) : minutes[0]);
    const [ampm, setAmPm] = useState(ampmOptions.includes(qpAmPm || "") ? (qpAmPm as string) : ampmOptions[0]);

    const handleSubmit = () => {
        console.log(`Selected: ${day}, ${hour}:${minute} ${ampm}`);
    };

    return (
        <div className="scrollpicker-root">
            <div className="scrollpicker-columns">
                <ScrollColumn values={dates} selected={day} onChange={setDay}/>
                <ScrollColumn values={hours} selected={hour} onChange={setHour}/>
                <ScrollColumn values={minutes} selected={minute} onChange={setMinute}/>
                <ScrollColumn values={ampmOptions} selected={ampm} onChange={setAmPm}/>
                <div className="scrollpicker-selection" aria-hidden="true" />
            </div>
            <button
                onClick={handleSubmit}
                className="scrollpicker-submit"
            >
                Submit
            </button>
        </div>
    );
};

export default ScrollPicker;
