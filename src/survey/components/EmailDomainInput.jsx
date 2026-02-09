import React, { useEffect, useMemo, useState } from "react";
import { EMAIL_DOMAINS } from "../constants";
import { styles } from "../styles/maseratiStyles";

export default function EmailDomainInput({ value, onChange }) {
    const [usuario, setUsuario] = useState("");
    const [dominio, setDominio] = useState(EMAIL_DOMAINS[0]);

    // sync desde value externo
    useEffect(() => {
        const v = String(value || "").trim();
        if (!v) return;

        const [u, d] = v.split("@");
        if (typeof u === "string" && u !== usuario) setUsuario(u);
        if (typeof d === "string" && EMAIL_DOMAINS.includes(d) && d !== dominio)
            setDominio(d);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const email = useMemo(() => {
        const u = usuario.trim();
        if (!u) return "";
        return `${u}@${dominio}`;
    }, [usuario, dominio]);

    const error = useMemo(() => {
        const u = usuario.trim();
        if (!u) return "";
        if (!/^[a-zA-Z0-9._-]+$/.test(u))
            return "Solo letras, números, punto (.), guion (-) y guion bajo (_).";
        if (u.startsWith(".") || u.endsWith("."))
            return "No puede empezar o terminar con punto.";
        if (u.includes("..")) return "No puede tener dos puntos seguidos.";
        return "";
    }, [usuario]);

    // ✅ evita loop: solo subir si cambia vs value
    useEffect(() => {
        if (error) return;
        const current = String(value || "");
        if (email !== current) onChange(email);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email, error, value]);

    return (
        <div className="d-flex flex-column gap-2">
            <div className="d-flex flex-column flex-sm-row gap-2">
                <input
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="usuario"
                    className="form-control"
                    style={styles.inputDark}
                />

                <div className="d-flex gap-2">
                    <div style={styles.atBadge}>@</div>

                    <select
                        value={dominio}
                        onChange={(e) => setDominio(e.target.value)}
                        className="form-select"
                        style={styles.selectDark}
                    >
                        {EMAIL_DOMAINS.map((d) => (
                            <option
                                key={d}
                                value={d}
                                style={{ backgroundColor: "#0b1220", color: "white" }}
                            >
                                {d}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error ? (
                <div className="small" style={{ color: "#ff6b6b" }}>
                    {error}
                </div>
            ) : (
                <div className="small text-white-50">
                    Correo completo: <span className="text-white">{email || "—"}</span>
                </div>
            )}
        </div>
    );
}
