/**
 * Matches the contract already used in shipments.service.js:
 *   const { skip, take } = getPagination(page, limit);
 */
export const getPagination = (page, limit) => {
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));

    return {
        skip: (parsedPage - 1) * parsedLimit,
        take: parsedLimit,
    };
};
