export const getPagination = (page = 1, limit = 10) => {
    const take = Math.min(parseInt(limit) || 10, 100);
    const skip = (Math.max(parseInt(page) || 1, 1) - 1) * take;

    return { skip, take };
};
