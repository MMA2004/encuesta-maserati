import React from "react";
import { CHOICES_5 } from "../constants";

export default function Choice5Input({ value, onChange }) {
    return (
        <div className="msr-choice-grid">
            {CHOICES_5.map((c) => {
                const active = value === c;
                return (
                    <button
                        key={c}
                        type="button"
                        className={`btn btn-sm ${
                            active ? "btn-light text-dark" : "btn-outline-light"
                        }`}
                        onClick={() => onChange(c)}
                        style={{
                            borderRadius: 14,
                            padding: "10px 12px",
                            width: "100%",
                        }}
                    >
                        {c}
                    </button>
                );
            })}
        </div>
    );
}
