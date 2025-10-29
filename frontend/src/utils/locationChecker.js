export function getIslandGroupByRegionCode(regionCode) {
    const mapping = {
        "NCR": "Luzon",
        "CAR": "Luzon",
        "01": "Luzon",
        "02": "Luzon",
        "03": "Luzon",
        "4A": "Luzon",
        "4B": "Luzon",
        "05": "Luzon",
        "06": "Visayas",
        "07": "Visayas",
        "08": "Visayas",
        "09": "Mindanao",
        "10": "Mindanao",
        "11": "Mindanao",
        "12": "Mindanao",
        "13": "Mindanao",
        "BARMM": "Mindanao"
    };
    const normalized = regionCode.toUpperCase().trim();
    return mapping[normalized] || null;
}
