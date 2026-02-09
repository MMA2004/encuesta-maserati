import React from "react";
import StarsInput from "./StarsInput";
import Choice5Input from "./Choice5Input";
import EmailDomainInput from "./EmailDomainInput";
import { styles } from "../styles/maseratiStyles";

export default function QuestionBlock({
    q,
    value,
    onChange,
    commentQ,
    showComment,
    commentValue,
    onCommentChange,
}) {
    return (
        <div>
            <div className="d-flex align-items-start justify-content-between gap-3">
                <div className="w-100">
                    <label className="form-label mb-2 msr-label" style={styles.label}>
                        {q.label}{" "}
                        {q.required && (
                            <span className="text-danger" title="Obligatorio">
                                *
                            </span>
                        )}
                        {!q.required && (
                            <span className="text-white-50 small ms-2" style={{ letterSpacing: "0.02em" }}>
                                (opcional)
                            </span>
                        )}
                    </label>

                    {q.help && <div className="text-white-50 small mb-2">{q.help}</div>}
                </div>
            </div>

            {q.type === "stars" && <StarsInput value={value} onChange={onChange} />}

            {q.type === "choice5" && (
                <Choice5Input value={value} onChange={onChange} />
            )}

            {q.type === "email" && (
                <EmailDomainInput value={value} onChange={onChange} />
            )}

            {q.type === "text" && (
                <textarea
                    className="form-control"
                    rows={4}
                    value={value}
                    placeholder={q.placeholder || ""}
                    onChange={(e) => onChange(e.target.value)}
                    style={styles.textarea}
                />
            )}

            {commentQ && showComment && (
                <div className="mt-3">
                    <div className="d-flex align-items-center justify-content-between">
                        <label className="form-label mb-2 msr-label-muted" style={styles.labelMuted}>
                            {commentQ.label}
                        </label>
                        <span className="text-white-50 small">(opcional)</span>
                    </div>

                    <textarea
                        className="form-control"
                        rows={3}
                        value={commentValue}
                        placeholder="Cuéntenos qué ocurrió…"
                        onChange={(e) => onCommentChange(e.target.value)}
                        style={styles.textarea}
                    />
                </div>
            )}

            <div style={styles.divider} />
        </div>
    );
}
