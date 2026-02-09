import { API_BASE } from "./constants";

export async function submitPublicSurvey({ surveyId, answers }) {
    const res = await fetch(`${API_BASE}/public/surveys/${surveyId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "No se pudo enviar la encuesta.");
    }

    return true;
}
