export const API_BASE = import.meta.env.VITE_SURVEYS_API_BASE;

export const QUESTIONS = [
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
        questionId: "q_demostracion_producto",
        type: "choice5",
        label: "¿Cómo fue la demostración del producto?",
        required: true,
    },
    {
        questionId: "q_comentarios_demostracion_producto",
        type: "text_comentario",
        label: "Comentarios sobre la demostración del producto",
        required: false,
        parentQuestionId: "q_demostracion_producto",
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

export const CHOICES_5 = ["Muy bueno", "Bueno", "Regular", "Malo", "Muy malo"];
export const NEGATIVE_CHOICES = new Set(["Malo", "Muy malo"]);

export const EMAIL_DOMAINS = [
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com",
    "icloud.com",
    "proton.me",
    "empresa.com",
];