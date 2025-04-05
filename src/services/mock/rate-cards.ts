import { RateData } from "@/types/shipping";

// Mock rate card data
export const mockRateCards: RateData[] = [
    {
        mode: "BLUE DART air-0.50kg",
        withinCity: { base: "37", additional: "36", rto: "37" },
        withinState: { base: "45", additional: "43", rto: "45" },
        metroToMetro: { base: "48", additional: "47", rto: "48" },
        restOfIndia: { base: "49", additional: "48", rto: "49" },
        northEastJK: { base: "64", additional: "62", rto: "64" },
        cod: "35",
        codPercent: "1.50"
    },
    {
        mode: "DELHIVERY surface-0.50kg",
        withinCity: { base: "32", additional: "30", rto: "32" },
        withinState: { base: "34", additional: "32", rto: "34" },
        metroToMetro: { base: "46", additional: "43", rto: "46" },
        restOfIndia: { base: "49", additional: "46", rto: "49" },
        northEastJK: { base: "68", additional: "64", rto: "68" },
        cod: "35",
        codPercent: "1.75"
    },
    {
        mode: "EKART express-0.50kg",
        withinCity: { base: "31", additional: "29", rto: "31" },
        withinState: { base: "34", additional: "31", rto: "34" },
        metroToMetro: { base: "38", additional: "36", rto: "38" },
        restOfIndia: { base: "40", additional: "38", rto: "40" },
        northEastJK: { base: "46", additional: "43", rto: "46" },
        cod: "30",
        codPercent: "1.20"
    },
    {
        mode: "XPRESSBEES surface-0.50kg",
        withinCity: { base: "27", additional: "16", rto: "25" },
        withinState: { base: "27", additional: "16", rto: "25" },
        metroToMetro: { base: "34", additional: "32", rto: "32" },
        restOfIndia: { base: "40", additional: "35", rto: "38" },
        northEastJK: { base: "47", additional: "27", rto: "43" },
        cod: "27",
        codPercent: "1.18"
    }
];

// Mock API function
export const fetchRateCards = async (): Promise<RateData[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockRateCards;
}; 