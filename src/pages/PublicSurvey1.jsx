import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_SURVEYS_API_BASE;

/* =========================
   Config de la encuesta (frontend)
========================= */
const QUESTIONS = [
    {
        questionId: "q_rating",
        type: "stars",
        label: "Calificación general de su visita",
        required: true,
        help: "0 = muy insatisfecho, 5 = excelente.",
    },
    {
        questionId: "q_experiencia_showroom",
        type: "choice5",
        label: "¿Cómo fue tu experiencia en el showroom?",
        required: true,
    },
    {
        questionId: "q_comentarios_experiencia_showroom",
        type: "text_comentario",
        label: "Comentarios sobre tu experiencia en el showroom",
        required: false,
        parentQuestionId: "q_experiencia_showroom",
    },
    {
        questionId: "q_demostración_de_producto",
        type: "choice5",
        label: "¿Cómo fue la demostración del producto?",
        required: true,
    },
    {
        questionId: "q_comentarios_demostración_de_producto",
        type: "text_comentario",
        label: "Comentarios sobre la demostración del producto",
        required: false,
        parentQuestionId: "q_demostración_de_producto",
    },
    {
        questionId: "q_eventos_maserati",
        type: "email",
        label: "¿Quieres conocer más sobre los próximos eventos Maserati?",
        required: false,
    },
    {
        questionId: "q_comentarios_generales",
        type: "text",
        label: "Comentarios generales",
        required: false,
        placeholder: "Cuéntenos qué fue lo mejor y qué podemos mejorar…",
    },
];

const CHOICES_5 = ["Muy bueno", "Bueno", "Regular", "Malo", "Muy malo"];
const NEGATIVE_CHOICES = new Set(["Malo", "Muy malo"]);

/* =========================
   UI helpers
========================= */
function TridentMark() {
    return (
        <svg
            width="44"
            height="58"
            viewBox="0 0 100 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.92 }}
            aria-hidden="true"
        >
            <path
                d="M50 130V80M50 80C50 80 20 60 20 20M50 80C50 80 80 60 80 20"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="square"
            />
            <path d="M45 10L50 5L55 10" stroke="white" strokeWidth="2" />
            <path d="M15 20L20 15L25 20" stroke="white" strokeWidth="2" />
            <path d="M75 20L80 15L85 20" stroke="white" strokeWidth="2" />
        </svg>
    );
}

function StarsInput({ value, onChange }) {
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
                                className={`bi ${filled ? "bi-star-fill" : "bi-star"} text-warning`}
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

function Choice5Input({ value, onChange }) {
    // Grid 2 columnas en móvil; en pantallas >=576px, 3 columnas (más compacto)
    return (
        <div className="msr-choice-grid">
            {CHOICES_5.map((c) => {
                const active = value === c;
                return (
                    <button
                        key={c}
                        type="button"
                        className={`btn btn-sm ${active ? "btn-light text-dark" : "btn-outline-light"}`}
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

function ChoiceEmail({ value, onChange }) {
    const DOMINIOS = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "icloud.com", "proton.me", "empresa.com"];

    const [usuario, setUsuario] = useState("");
    const [dominio, setDominio] = useState(DOMINIOS[0]);

    // Si el padre cambia el value (ej: reset), sincroniza
    useEffect(() => {
        const v = String(value || "").trim();
        if (!v) return;

        const [u, d] = v.split("@");
        if (typeof u === "string" && u !== usuario) setUsuario(u);
        if (typeof d === "string" && DOMINIOS.includes(d) && d !== dominio) setDominio(d);
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
        if (!/^[a-zA-Z0-9._-]+$/.test(u)) return "Solo letras, números, punto (.), guion (-) y guion bajo (_).";
        if (u.startsWith(".") || u.endsWith(".")) return "No puede empezar o terminar con punto.";
        if (u.includes("..")) return "No puede tener dos puntos seguidos.";
        return "";
    }, [usuario]);

    // ✅ Evita loop: solo sube al padre si cambió vs value actual
    useEffect(() => {
        if (error) return;
        const current = String(value || "");
        if (email !== current) onChange(email);
        // ⚠️ intencionalmente NO ponemos onChange en deps para evitar re-disparo por función inline
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email, error, value]);

    return (
        <div className="d-flex flex-column gap-2">
            {/* En móvil: apilado. En >=sm: en fila */}
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
                        {DOMINIOS.map((d) => (
                            <option key={d} value={d} style={{ backgroundColor: "#0b1220", color: "white" }}>
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

/* =========================
   Página
========================= */
export default function PublicSurvey1() {
    const { surveyId } = useParams(); // /s/:surveyId
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");

    // Mapa comentario -> parent
    const commentByParent = useMemo(() => {
        const map = {};
        for (const q of QUESTIONS) {
            if (q.type === "text_comentario" && q.parentQuestionId) {
                map[q.parentQuestionId] = q;
            }
        }
        return map;
    }, []);

    // state answers
    const initial = useMemo(() => {
        const obj = {};
        for (const q of QUESTIONS) obj[q.questionId] = q.type === "stars" ? 0 : "";
        return obj;
    }, []);
    const [values, setValues] = useState(initial);

    const setVal = useCallback((questionId, v) => {
        setValues((prev) => ({ ...prev, [questionId]: v }));
    }, []);

    // ✅ Limpia comentarios cuando el parent NO es Malo/Muy malo
    useEffect(() => {
        setValues((prev) => {
            let changed = false;
            const next = { ...prev };

            for (const parentId of Object.keys(commentByParent)) {
                const parentValue = String(prev[parentId] || "");
                const commentQ = commentByParent[parentId];

                const shouldShow = NEGATIVE_CHOICES.has(parentValue);
                if (!shouldShow && String(prev[commentQ.questionId] || "").trim() !== "") {
                    next[commentQ.questionId] = "";
                    changed = true;
                }
            }

            return changed ? next : prev;
        });
    }, [commentByParent, values]);

    const missingRequired = useMemo(() => {
        const missing = [];
        for (const q of QUESTIONS) {
            if (!q.required) continue;

            const v = values[q.questionId];
            const empty = q.type === "stars" ? Number(v || 0) <= 0 : String(v || "").trim() === "";

            if (empty) missing.push(q.label);
        }
        return missing;
    }, [values]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!surveyId) {
            setError("Encuesta inválida (falta ID).");
            return;
        }

        if (missingRequired.length > 0) {
            setError("Por favor complete los campos obligatorios.");
            return;
        }

        // answers:
        // - text_comentario solo se manda si su parent está Malo/Muy malo
        const answers = QUESTIONS.flatMap((q) => {
            if (q.type === "text_comentario") {
                const parentId = q.parentQuestionId;
                const parentValue = String(values[parentId] || "");
                const shouldSend = NEGATIVE_CHOICES.has(parentValue);
                if (!shouldSend) return [];
            }

            return [
                {
                    questionId: q.questionId,
                    type: q.type,
                    label: q.label,
                    value: q.type === "stars" ? Number(values[q.questionId] || 0) : values[q.questionId],
                },
            ];
        });

        try {
            setSubmitting(true);

            const res = await fetch(`${API_BASE}/public/surveys/${surveyId}/respond`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || "No se pudo enviar la encuesta.");
            }

            setDone(true);
        } catch (err) {
            setError(err?.message || "Error al enviar.");
        } finally {
            setSubmitting(false);
        }
    }

    if (done) {
        return (
            <div style={styles.page}>
                <style>{styles.responsiveCss}</style>

                <div style={styles.bgGlowA} />
                <div style={styles.bgGlowB} />
                <div className="msr-noise" style={styles.noise} />

                <div className="container py-4 px-3" style={{ maxWidth: 720 }}>
                    <div className="text-center mb-3">
                        <TridentMark />
                        <div className="mt-2 msr-title" style={styles.brandTitle}>
                            MASERATI
                        </div>
                        <div className="msr-sub" style={styles.brandSub}>
                            Gracias por su visita
                        </div>
                    </div>

                    <div className="card border-0 shadow-lg" style={styles.card}>
                        <div className="card-body p-3 p-md-5 text-center">
                            <i className="bi bi-check2-circle text-success" style={{ fontSize: 42 }} />
                            <h3 className="mt-3 mb-2" style={{ letterSpacing: "0.06em" }}>
                                Respuesta enviada
                            </h3>
                            <p className="text-white-50 mb-0">Apreciamos su tiempo. Su opinión nos ayuda a mejorar la experiencia.</p>
                        </div>
                    </div>

                    <div className="text-center mt-3 text-white-50" style={{ fontSize: 11, letterSpacing: "0.12em" }}>
                        Maserati S.p.A. © {new Date().getFullYear()}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <style>{styles.responsiveCss}</style>

            {/* Atmosfera */}
            <div style={styles.bgGlowA} />
            <div style={styles.bgGlowB} />
            <div className="msr-noise" style={styles.noise} />

            <div className="container py-4 px-3" style={{ maxWidth: 820 }}>
                {/* Header */}
                <div className="text-center mb-3">
                    <TridentMark />
                    <div className="mt-2 msr-title" style={styles.brandTitle}>
                        MASERATI
                    </div>
                    <div className="msr-sub" style={styles.brandSub}>
                        Satisfacción de la experiencia en concesionario
                    </div>
                </div>

                {/* Card */}
                <div className="card border-0 shadow-lg" style={styles.card}>
                    <div className="card-body p-3 p-md-5">
                        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                            <div>
                                <div className="text-white-50 small" style={{ letterSpacing: "0.14em" }}>
                                    ENCUESTA
                                </div>
                                <h2 className="mb-0" style={{ fontWeight: 650, letterSpacing: "0.03em", fontSize: 22 }}>
                                    Su opinión importa
                                </h2>
                            </div>

                            <span className="badge rounded-pill text-bg-dark" style={{ letterSpacing: "0.10em" }}>
                2 min
              </span>
                        </div>

                        {error && (
                            <div className="alert alert-danger">
                                <i className="bi bi-exclamation-triangle me-2" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="d-grid gap-4">
                            {QUESTIONS.filter((q) => q.type !== "text_comentario").map((q) => {
                                const commentQ = q.type === "choice5" ? commentByParent[q.questionId] : null;

                                const shouldShowComment =
                                    q.type === "choice5" && NEGATIVE_CHOICES.has(String(values[q.questionId] || ""));

                                return (
                                    <div key={q.questionId}>
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

                                        {q.type === "stars" && (
                                            <StarsInput value={values[q.questionId]} onChange={(v) => setVal(q.questionId, v)} />
                                        )}

                                        {q.type === "choice5" && (
                                            <Choice5Input value={values[q.questionId]} onChange={(v) => setVal(q.questionId, v)} />
                                        )}

                                        {q.type === "email" && (
                                            <ChoiceEmail value={values[q.questionId]} onChange={(v) => setVal(q.questionId, v)} />
                                        )}

                                        {q.type === "text" && (
                                            <textarea
                                                className="form-control"
                                                rows={4}
                                                value={values[q.questionId]}
                                                placeholder={q.placeholder || ""}
                                                onChange={(e) => setVal(q.questionId, e.target.value)}
                                                style={styles.textarea}
                                            />
                                        )}

                                        {/* Comentario condicional debajo de su choice5 */}
                                        {commentQ && shouldShowComment && (
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
                                                    value={values[commentQ.questionId]}
                                                    placeholder="Cuéntenos qué ocurrió…"
                                                    onChange={(e) => setVal(commentQ.questionId, e.target.value)}
                                                    style={styles.textarea}
                                                />
                                            </div>
                                        )}

                                        <div style={styles.divider} />
                                    </div>
                                );
                            })}

                            {missingRequired.length > 0 && (
                                <div className="text-warning small">
                                    <i className="bi bi-info-circle me-2" />
                                    Falta completar: <span className="text-white-50">{missingRequired.join(" • ")}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-light w-100 py-3"
                                disabled={submitting || missingRequired.length > 0}
                                style={styles.submit}
                            >
                                {submitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Enviando…
                                    </>
                                ) : (
                                    <>
                                        Enviar respuesta <i className="bi bi-arrow-right ms-2" />
                                    </>
                                )}
                            </button>

                            <div className="text-center text-white-50" style={{ fontSize: 12 }}>
                                Esta encuesta es anónima. Sus datos se usan únicamente para mejorar el servicio.
                            </div>
                        </form>
                    </div>
                </div>

                <div className="text-center mt-3 text-white-50" style={{ fontSize: 11, letterSpacing: "0.12em" }}>
                    Maserati S.p.A. © {new Date().getFullYear()}
                </div>
            </div>
        </div>
    );
}

/* =========================
   Estilos (mobile-first)
========================= */
const styles = {
    page: {
        minHeight: "100vh",
        background: "#000814",
        color: "white",
        position: "relative",
        overflow: "hidden",
        fontFamily:
            'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    },
    bgGlowA: {
        position: "absolute",
        inset: 0,
        background: "radial-gradient(800px 400px at 15% 10%, rgba(21, 75, 155, 0.32), transparent 60%)",
        pointerEvents: "none",
    },
    bgGlowB: {
        position: "absolute",
        inset: 0,
        background: "radial-gradient(900px 500px at 85% 85%, rgba(11, 37, 69, 0.42), transparent 65%)",
        pointerEvents: "none",
    },
    noise: {
        position: "absolute",
        inset: 0,
        opacity: 0.02,
        backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
        pointerEvents: "none",
    },
    card: {
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        borderRadius: 18,
    },
    brandTitle: {
        fontSize: 24,
        letterSpacing: "0.22em",
        fontWeight: 650,
        fontFamily: "Georgia, 'Times New Roman', Times, serif",
    },
    brandSub: {
        marginTop: 4,
        fontSize: 10,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.60)",
    },
    label: {
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontSize: 11,
        color: "rgba(255,255,255,0.78)",
    },
    labelMuted: {
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontSize: 11,
        color: "rgba(255,255,255,0.60)",
    },
    textarea: {
        background: "rgba(0,0,0,0.25)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14,
        boxShadow: "none",
    },
    divider: {
        height: 1,
        background: "rgba(255,255,255,0.08)",
        marginTop: 16,
    },
    submit: {
        borderRadius: 14,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontWeight: 750,
    },

    // Inputs dark para el email (móvil)
    inputDark: {
        background: "rgba(0,0,0,0.25)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14,
        boxShadow: "none",
    },
    atBadge: {
        padding: "0 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14,
        background: "rgba(0,0,0,0.25)",
        color: "white",
        fontWeight: 800,
        userSelect: "none",
        minWidth: 44,
    },
    selectDark: {
        backgroundColor: "rgba(0,0,0,0.25)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14,
        boxShadow: "none",
        outline: "none",
        cursor: "pointer",
        // Quitar borde/flecha nativos (evita “borde blanco”)
        appearance: "none",
        WebkitAppearance: "none",
        MozAppearance: "none",
        paddingRight: 34,
        minWidth: 170,
    },

    // CSS responsive + fixes
    responsiveCss: `
    /* grid para opciones */
    .msr-choice-grid{
      display:grid;
      grid-template-columns: repeat(2, minmax(0,1fr));
      gap:10px;
    }
    @media (min-width: 576px){
      .msr-choice-grid{ grid-template-columns: repeat(3, minmax(0,1fr)); }
    }

    /* bajar el ruido en mobile */
    @media (max-width: 576px){
      .msr-noise{ display:none !important; }
      .msr-title{ letter-spacing: 0.16em !important; font-size: 22px !important; }
      .msr-sub{ letter-spacing: 0.10em !important; font-size: 10px !important; }
      .msr-label{ letter-spacing: 0.05em !important; font-size: 11px !important; }
      .msr-label-muted{ letter-spacing: 0.05em !important; font-size: 11px !important; }
    }

    /* quitar focus glow bootstrap en select/input si sale borde raro */
    .form-control:focus, .form-select:focus{
      box-shadow: none !important;
      outline: none !important;
    }
  `,
};
