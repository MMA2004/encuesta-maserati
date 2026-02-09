import { useCallback, useEffect, useMemo, useState } from "react";
import { NEGATIVE_CHOICES, QUESTIONS } from "../constants";
import { submitPublicSurvey } from "../api";

export function useSurveyForm({ surveyId }) {
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");

    const commentByParent = useMemo(() => {
        const map = {};
        for (const q of QUESTIONS) {
            if (q.type === "text_comentario" && q.parentQuestionId) {
                map[q.parentQuestionId] = q;
            }
        }
        return map;
    }, []);

    const initial = useMemo(() => {
        const obj = {};
        for (const q of QUESTIONS) obj[q.questionId] = q.type === "stars" ? 0 : "";
        return obj;
    }, []);

    const [values, setValues] = useState(initial);

    const setVal = useCallback((questionId, v) => {
        setValues((prev) => ({ ...prev, [questionId]: v }));
    }, []);

    // Limpia comentarios cuando parent ya no es Malo/Muy malo
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
            const empty =
                q.type === "stars" ? Number(v || 0) <= 0 : String(v || "").trim() === "";
            if (empty) missing.push(q.label);
        }
        return missing;
    }, [values]);

    const buildAnswers = useCallback(() => {
        return QUESTIONS.flatMap((q) => {
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
                    value:
                        q.type === "stars"
                            ? Number(values[q.questionId] || 0)
                            : values[q.questionId],
                },
            ];
        });
    }, [values]);

    const submit = useCallback(async () => {
        setError("");

        if (!surveyId) {
            setError("Encuesta inválida (falta ID).");
            return;
        }

        if (missingRequired.length > 0) {
            setError("Por favor complete los campos obligatorios.");
            return;
        }

        try {
            setSubmitting(true);
            const answers = buildAnswers();
            await submitPublicSurvey({ surveyId, answers });
            setDone(true);
        } catch (err) {
            setError(err?.message || "Error al enviar.");
        } finally {
            setSubmitting(false);
        }
    }, [surveyId, missingRequired.length, buildAnswers]);

    return {
        submitting,
        done,
        error,
        values,
        setVal,
        missingRequired,
        commentByParent,
        submit,
    };
}
