import React from "react";
import { useParams } from "react-router-dom";

import { QUESTIONS, NEGATIVE_CHOICES } from "../survey/constants";
import { styles } from "../survey/styles/maseratiStyles";

import DoneScreen from "../survey/components/DoneScreen";
import QuestionBlock from "../survey/components/QuestionBlock";
import { useSurveyForm } from "../survey/hooks/useSurveyForm";

import Logo from "../../LOGO_MASERATI.jpg"

export default function MaseratiSurvey() {
    const { surveyId } = useParams();

    const {
        submitting,
        done,
        error,
        values,
        setVal,
        missingRequired,
        commentByParent,
        submit,
    } = useSurveyForm({ surveyId });

    if (done) return <DoneScreen />;

    return (
        <div style={styles.page}>
            <style>{styles.responsiveCss}</style>

            <div style={styles.bgGlowA} />
            <div style={styles.bgGlowB} />
            <div className="msr-noise" style={styles.noise} />

            <div className="container-fluid py-4 px-3">
                <div className="text-center mb-3">
                    <img alt={"Logo maserti"} src={Logo} style={styles.img}/>
                    <div className="msr-sub" style={styles.brandSub}>
                        Satisfacción de la experiencia en concesionario
                    </div>
                </div>

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

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                submit();
                            }}
                            className="d-grid gap-4"
                        >
                            {QUESTIONS.filter((q) => q.type !== "text_comentario").map((q) => {
                                const commentQ = q.type === "choice5" ? commentByParent[q.questionId] : null;
                                const showComment =
                                    q.type === "choice5" &&
                                    NEGATIVE_CHOICES.has(String(values[q.questionId] || ""));

                                return (
                                    <QuestionBlock
                                        key={q.questionId}
                                        q={q}
                                        value={values[q.questionId]}
                                        onChange={(v) => setVal(q.questionId, v)}
                                        commentQ={commentQ}
                                        showComment={Boolean(commentQ && showComment)}
                                        commentValue={commentQ ? values[commentQ.questionId] : ""}
                                        onCommentChange={(v) => commentQ && setVal(commentQ.questionId, v)}
                                    />
                                );
                            })}

                            {missingRequired.length > 0 && (
                                <div className="text-warning small">
                                    <i className="bi bi-info-circle me-2" />
                                    Falta completar:{" "}
                                    <span className="text-white-50">{missingRequired.join(" • ")}</span>
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
                    Powered by Gibra Company
                </div>
            </div>
        </div>
    );
}
