export const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            id: payload.id,
            username: payload.username,
            role: payload.role,
            initials: payload.username ? payload.username.split(/[._\s]/).map(n => n[0]).join('').toUpperCase().substring(0, 2) : "U"
        };
    } catch (e) {
        console.error("Failed to decode token", e);
        return null;
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
};
