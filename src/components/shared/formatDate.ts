export function formatDate(value?: string | Date): string {
    if (!value) return "No disponible";
    
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "No disponible";
    
    return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}