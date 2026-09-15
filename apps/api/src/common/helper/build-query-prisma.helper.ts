export function buildQueryPrisma(query: any) {
    let { page, pageSize, filters } = query || {};

    const pageDefault = 1;
    const pageSizeDefault = 3;

    // Đảm bảo là số
    page = Number(page);
    pageSize = Number(pageSize);

    // Nếu gửi chữ lên
    page = Number(page) || pageDefault;
    pageSize = Number(pageSize) || pageSizeDefault;

    // Nếu mà gửi số âm
    page = Math.max(page, pageDefault);
    pageSize = Math.max(pageSize, pageSizeDefault);

    try {
        filters = typeof filters === 'string' ? JSON.parse(filters) : filters;
    } catch (error) {
        console.log("Thông báo cho FE đang gửi định dạng json bị sai");
        filters = {};
    }

    // xử lý filters
    for (const [key, value] of Object.entries(filters || {})) {
        // string
        if (typeof value === "string") {
            console.log(`phát hiện key ${key}: có giá trị là string`, value);
            (filters as any)[key] = {
                contains: value,
            };
        }
    }

    const index = (page - 1) * pageSize;

    console.log("query", { page, pageSize, index, filters });

    const where = {
        ...(filters || {}),
        isDeleted: false,
    };

    return {
        page,
        pageSize,
        where,
        index,
    };
}
