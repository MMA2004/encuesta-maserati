import React from "react";

export default function StarsInput({ value, onChange }) {
    const n = Math.max(0, Math.min(5, Number(value ?? 0)));

    return (
        <div className="d-flex align-items-center gap-2">
            <div className="d-inline-flex align-items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                    const filled = i < n;
                    return (
                        <button
                            key={i}
                            type="button"
                            className="btn btn-link p-0"
                            onClick={() => onChange(i + 1)}
                            style={{
                                textDecoration: "none",
                                lineHeight: 1,
                                transform: "translateY(-1px)",
                            }}
                            aria-label={`Calificar ${i + 1} estrellas`}
                        >
                            <i
                                className={`bi ${
                                    filled ? "bi-star-fill" : "bi-star"
                                } text-warning`}
                                style={{ fontSize: 22 }}
                            />
                        </button>
                    );
                })}
            </div>

            <div className="text-white-50 small">{n}/5</div>

            <button
                type="button"
                className="btn btn-sm btn-outline-light ms-auto"
                onClick={() => onChange(0)}
                style={{ opacity: 0.9, borderRadius: 12 }}
            >
                Limpiar
            </button>
        </div>
    );
}
