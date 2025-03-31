import { cn } from "@/lib/utils";

interface RateData {
    mode: string;
    withinCity: {
        base: string;
        additional: string;
        rto: string;
    };
    withinState: {
        base: string;
        additional: string;
        rto: string;
    };
    metroToMetro: {
        base: string;
        additional: string;
        rto: string;
    };
    restOfIndia: {
        base: string;
        additional: string;
        rto: string;
    };
    northEastJK: {
        base: string;
        additional: string;
        rto: string;
    };
    cod: string;
    codPercent: string;
}

const rateData: RateData[] = [
    {
        mode: "Bluedart air-0.50",
        withinCity: { base: "37", additional: "36", rto: "37" },
        withinState: { base: "45", additional: "43", rto: "45" },
        metroToMetro: { base: "48", additional: "47", rto: "48" },
        restOfIndia: { base: "49", additional: "48", rto: "49" },
        northEastJK: { base: "64", additional: "62", rto: "64" },
        cod: "35",
        codPercent: "1.50"
    },
    {
        mode: "Delhivery surface-0.50",
        withinCity: { base: "32", additional: "30", rto: "32" },
        withinState: { base: "34", additional: "32", rto: "34" },
        metroToMetro: { base: "46", additional: "43", rto: "46" },
        restOfIndia: { base: "49", additional: "46", rto: "49" },
        northEastJK: { base: "68", additional: "64", rto: "68" },
        cod: "35",
        codPercent: "1.75"
    },
    {
        mode: "Delhivery surface-10.00",
        withinCity: { base: "189", additional: "22", rto: "189" },
        withinState: { base: "235", additional: "26", rto: "235" },
        metroToMetro: { base: "271", additional: "29", rto: "271" },
        restOfIndia: { base: "313", additional: "33", rto: "313" },
        northEastJK: { base: "367", additional: "40", rto: "367" },
        cod: "35",
        codPercent: "1.75"
    },
    {
        mode: "DTDC air-0.50",
        withinCity: { base: "30", additional: "30", rto: "26" },
        withinState: { base: "35", additional: "35", rto: "31" },
        metroToMetro: { base: "41", additional: "41", rto: "35" },
        restOfIndia: { base: "49", additional: "49", rto: "42" },
        northEastJK: { base: "62", additional: "62", rto: "53" },
        cod: "27",
        codPercent: "1.25"
    },
    {
        mode: "DTDC surface-0.50",
        withinCity: { base: "30", additional: "30", rto: "26" },
        withinState: { base: "30", additional: "30", rto: "26" },
        metroToMetro: { base: "35", additional: "35", rto: "31" },
        restOfIndia: { base: "39", additional: "39", rto: "33" },
        northEastJK: { base: "52", additional: "52", rto: "45" },
        cod: "27",
        codPercent: "1.25"
    },
    {
        mode: "DTDC surface-1.00",
        withinCity: { base: "49", additional: "48", rto: "49" },
        withinState: { base: "52", additional: "51", rto: "52" },
        metroToMetro: { base: "60", additional: "59", rto: "60" },
        restOfIndia: { base: "64", additional: "63", rto: "64" },
        northEastJK: { base: "87", additional: "86", rto: "87" },
        cod: "27",
        codPercent: "1.25"
    },
    {
        mode: "DTDC surface-2.00",
        withinCity: { base: "69", additional: "49", rto: "69" },
        withinState: { base: "74", additional: "52", rto: "74" },
        metroToMetro: { base: "89", additional: "60", rto: "89" },
        restOfIndia: { base: "99", additional: "64", rto: "99" },
        northEastJK: { base: "131", additional: "87", rto: "131" },
        cod: "27",
        codPercent: "1.25"
    },
    {
        mode: "DTDC surface-5.00",
        withinCity: { base: "141", additional: "49", rto: "141" },
        withinState: { base: "149", additional: "52", rto: "149" },
        metroToMetro: { base: "171", additional: "60", rto: "171" },
        restOfIndia: { base: "193", additional: "64", rto: "193" },
        northEastJK: { base: "227", additional: "87", rto: "227" },
        cod: "27",
        codPercent: "1.25"
    },
    {
        mode: "DTDC surface-10.00",
        withinCity: { base: "262", additional: "49", rto: "262" },
        withinState: { base: "275", additional: "52", rto: "275" },
        metroToMetro: { base: "325", additional: "60", rto: "325" },
        restOfIndia: { base: "369", additional: "64", rto: "369" },
        northEastJK: { base: "430", additional: "87", rto: "430" },
        cod: "27",
        codPercent: "1.25"
    },
    {
        mode: "EcomExpress surface-0.50",
        withinCity: { base: "30", additional: "28", rto: "30" },
        withinState: { base: "36", additional: "30", rto: "36" },
        metroToMetro: { base: "41", additional: "34", rto: "41" },
        restOfIndia: { base: "44", additional: "40", rto: "44" },
        northEastJK: { base: "51", additional: "45", rto: "51" },
        cod: "30",
        codPercent: "1.50"
    },
    {
        mode: "Ekart air-0.50",
        withinCity: { base: "31", additional: "29", rto: "31" },
        withinState: { base: "33", additional: "31", rto: "33" },
        metroToMetro: { base: "38", additional: "36", rto: "38" },
        restOfIndia: { base: "40", additional: "38", rto: "40" },
        northEastJK: { base: "45", additional: "43", rto: "45" },
        cod: "30",
        codPercent: "1.50"
    },
    {
        mode: "Ekart express-0.50",
        withinCity: { base: "31", additional: "29", rto: "31" },
        withinState: { base: "34", additional: "31", rto: "34" },
        metroToMetro: { base: "38", additional: "36", rto: "38" },
        restOfIndia: { base: "40", additional: "38", rto: "40" },
        northEastJK: { base: "46", additional: "43", rto: "46" },
        cod: "30",
        codPercent: "1.20"
    },
    {
        mode: "Xpressbees air-0.50",
        withinCity: { base: "27", additional: "16", rto: "25" },
        withinState: { base: "27", additional: "16", rto: "25" },
        metroToMetro: { base: "37", additional: "34", rto: "37" },
        restOfIndia: { base: "51", additional: "40", rto: "43" },
        northEastJK: { base: "55", additional: "47", rto: "47" },
        cod: "27",
        codPercent: "1.18"
    },
    {
        mode: "Xpressbees surface-0.50",
        withinCity: { base: "27", additional: "16", rto: "25" },
        withinState: { base: "27", additional: "16", rto: "25" },
        metroToMetro: { base: "34", additional: "32", rto: "32" },
        restOfIndia: { base: "40", additional: "35", rto: "38" },
        northEastJK: { base: "47", additional: "27", rto: "43" },
        cod: "27",
        codPercent: "1.18"
    },
    {
        mode: "Xpressbees surface-1.00",
        withinCity: { base: "40", additional: "30", rto: "36" },
        withinState: { base: "40", additional: "30", rto: "36" },
        metroToMetro: { base: "50", additional: "32", rto: "44" },
        restOfIndia: { base: "58", additional: "35", rto: "51" },
        northEastJK: { base: "69", additional: "38", rto: "60" },
        cod: "27",
        codPercent: "1.18"
    },
    {
        mode: "Xpressbees surface-2.00",
        withinCity: { base: "64", additional: "20", rto: "55" },
        withinState: { base: "64", additional: "20", rto: "55" },
        metroToMetro: { base: "69", additional: "21", rto: "62" },
        restOfIndia: { base: "76", additional: "25", rto: "68" },
        northEastJK: { base: "89", additional: "30", rto: "81" },
        cod: "27",
        codPercent: "1.18"
    },
    {
        mode: "Xpressbees surface-5.00",
        withinCity: { base: "98", additional: "18", rto: "88" },
        withinState: { base: "98", additional: "18", rto: "88" },
        metroToMetro: { base: "110", additional: "20", rto: "98" },
        restOfIndia: { base: "123", additional: "20", rto: "108" },
        northEastJK: { base: "149", additional: "25", rto: "132" },
        cod: "27",
        codPercent: "1.18"
    },
    {
        mode: "Xpressbees surface-10.00",
        withinCity: { base: "149", additional: "16", rto: "132" },
        withinState: { base: "149", additional: "16", rto: "132" },
        metroToMetro: { base: "161", additional: "17", rto: "144" },
        restOfIndia: { base: "174", additional: "18", rto: "153" },
        northEastJK: { base: "238", additional: "22", rto: "216" },
        cod: "27",
        codPercent: "1.18"
    },
    {
        mode: "Bluedart+ express-0.50",
        withinCity: { base: "30", additional: "30", rto: "30" },
        withinState: { base: "32", additional: "32", rto: "32" },
        metroToMetro: { base: "34", additional: "34", rto: "34" },
        restOfIndia: { base: "35", additional: "35", rto: "35" },
        northEastJK: { base: "45", additional: "45", rto: "45" },
        cod: "35",
        codPercent: "1.50"
    },
    {
        mode: "Bluedart+ express-1.00",
        withinCity: { base: "59", additional: "59", rto: "59" },
        withinState: { base: "63", additional: "63", rto: "63" },
        metroToMetro: { base: "67", additional: "67", rto: "67" },
        restOfIndia: { base: "69", additional: "69", rto: "69" },
        northEastJK: { base: "89", additional: "89", rto: "89" },
        cod: "35",
        codPercent: "1.50"
    },
    {
        mode: "eKart surface-0.50",
        withinCity: { base: "32", additional: "30", rto: "32" },
        withinState: { base: "34", additional: "32", rto: "34" },
        metroToMetro: { base: "39", additional: "37", rto: "39" },
        restOfIndia: { base: "41", additional: "39", rto: "41" },
        northEastJK: { base: "46", additional: "44", rto: "46" },
        cod: "30",
        codPercent: "1.20"
    }
];

const RateTable = () => {
    return (
        <div className="w-full overflow-x-auto pb-4">
            <table className="w-full border-collapse text-[10px]">
                {/* Main Headers */}
                <thead>
                    <tr>
                        <th className="bg-[#34105A] text-white font-medium p-1.5 border border-white w-[150px]" rowSpan={2}>
                            Mode/Zone
                        </th>
                        <th className="bg-[#34105A] text-white font-medium p-1.5 border border-white text-center" colSpan={3}>
                            WITHIN CITY
                        </th>
                        <th className="bg-[#34105A] text-white font-medium p-1.5 border border-white text-center" colSpan={3}>
                            WITHIN STATE
                        </th>
                        <th className="bg-[#34105A] text-white font-medium p-1.5 border border-white text-center" colSpan={3}>
                            METRO TO METRO
                        </th>
                        <th className="bg-[#34105A] text-white font-medium p-1.5 border border-white text-center" colSpan={3}>
                            REST OF INDIA
                        </th>
                        <th className="bg-[#34105A] text-white font-medium p-1.5 border border-white text-center" colSpan={3}>
                            NORTH EAST,J&K
                        </th>
                        <th className="bg-[#34105A] text-white font-medium p-1.5 border border-white text-center">
                            COD
                        </th>
                        <th className="bg-[#34105A] text-white font-medium p-1.5 border border-white text-center">
                            COD%
                        </th>
                    </tr>

                    {/* Sub Headers */}
                    <tr>
                        {/* WITHIN CITY */}
                        <th className="bg-[#9D80C0] text-white font-medium p-1.5 border border-white w-[60px]">
                            <div className="text-center">Base</div>
                        </th>
                        <th className="bg-[#9D80C0] text-white font-medium p-1.5 border border-white w-[60px]">
                            <div className="text-center">Additional</div>
                        </th>
                        <th className="bg-[#9D80C0] text-white font-medium p-1.5 border border-white w-[60px]">
                            <div className="text-center">Rto</div>
                        </th>
                        {/* WITHIN STATE */}
                        <th className="bg-[#9D80C0] text-white font-medium p-1.5 border border-white w-[60px]">
                            <div className="text-center">Base</div>
                        </th>
                        <th className="bg-[#9D80C0] text-white font-medium p-1.5 border border-white w-[60px]">
                            <div className="text-center">Additional</div>
                        </th>
                        <th className="bg-[#9D80C0] text-white font-medium p-1.5 border border-white w-[60px]">
                            <div className="text-center">Rto</div>
                        </th>
                        {/* METRO TO METRO */}
                        <th className="bg-[#9D80C0] text-white font-medium p-1.5 border border-white w-[60px]">
                            <div className="text-center">Base</div>
                        </th>
                        <th className="bg-[#9D80C0] text-white font-medium p-1.5 border border-white w-[60px]">
                            <div className="text-center">Additional</div>
                        </th>
                        <th className="bg-[#9D80C0] text-white font-medium p-1.5 border border-white w-[60px]">
                            <div className="text-center">Rto</div>
                        </th>
                        {/* REST OF INDIA */}
                        <th className="bg-[#9D80C0] text-white font-medium p-1.5 border border-white w-[60px]">
                            <div className="text-center">Base</div>
                        </th>
                        <th className="bg-[#9D80C0] text-white font-medium p-1.5 border border-white w-[60px]">
                            <div className="text-center">Additional</div>
                        </th>
                        <th className="bg-[#9D80C0] text-white font-medium p-1.5 border border-white w-[60px]">
                            <div className="text-center">Rto</div>
                        </th>
                        {/* NORTH EAST,J&K */}
                        <th className="bg-[#9D80C0] text-white font-medium p-1.5 border border-white w-[60px]">
                            <div className="text-center">Base</div>
                        </th>
                        <th className="bg-[#9D80C0] text-white font-medium p-1.5 border border-white w-[60px]">
                            <div className="text-center">Additional</div>
                        </th>
                        <th className="bg-[#9D80C0] text-white font-medium p-1.5 border border-white w-[60px]">
                            <div className="text-center">Rto</div>
                        </th>
                        {/* COD and COD% */}
                        <th className="bg-[#9D80C0] text-white font-medium p-1.5 border border-white w-[60px]">
                            <div className="text-center">COD</div>
                        </th>
                        <th className="bg-[#9D80C0] text-white font-medium p-1.5 border border-white w-[60px]">
                            <div className="text-center">COD%</div>
                        </th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                    {rateData.map((row, index) => (
                        <tr key={index} className={cn(
                            "text-center",
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        )}>
                            <td className="bg-[#9D80C0] text-white font-medium p-1.5 border border-white w-[150px]">
                                {row.mode}
                            </td>
                            {/* WITHIN CITY */}
                            <td className="p-1.5 border border-gray-200 bg-[#DFDBF0]">
                                {row.withinCity.base}
                            </td>
                            <td className="p-1.5 border border-gray-200 bg-[#DFDBF0]">
                                {row.withinCity.additional}
                            </td>
                            <td className="p-1.5 border border-gray-200 bg-[#DFDBF0]">
                                {row.withinCity.rto}
                            </td>
                            {/* WITHIN STATE */}
                            <td className="p-1.5 border border-gray-200">
                                {row.withinState.base}
                            </td>
                            <td className="p-1.5 border border-gray-200">
                                {row.withinState.additional}
                            </td>
                            <td className="p-1.5 border border-gray-200">
                                {row.withinState.rto}
                            </td>
                            {/* METRO TO METRO */}
                            <td className="p-1.5 border border-gray-200 bg-[#DFDBF0]">
                                {row.metroToMetro.base}
                            </td>
                            <td className="p-1.5 border border-gray-200 bg-[#DFDBF0]">
                                {row.metroToMetro.additional}
                            </td>
                            <td className="p-1.5 border border-gray-200 bg-[#DFDBF0]">
                                {row.metroToMetro.rto}
                            </td>
                            {/* REST OF INDIA */}
                            <td className="p-1.5 border border-gray-200">
                                {row.restOfIndia.base}
                            </td>
                            <td className="p-1.5 border border-gray-200">
                                {row.restOfIndia.additional}
                            </td>
                            <td className="p-1.5 border border-gray-200">
                                {row.restOfIndia.rto}
                            </td>
                            {/* NORTH EAST,J&K */}
                            <td className="p-1.5 border border-gray-200 bg-[#DFDBF0]">
                                {row.northEastJK.base}
                            </td>
                            <td className="p-1.5 border border-gray-200 bg-[#DFDBF0]">
                                {row.northEastJK.additional}
                            </td>
                            <td className="p-1.5 border border-gray-200 bg-[#DFDBF0]">
                                {row.northEastJK.rto}
                            </td>
                            {/* COD and COD% */}
                            <td className="p-1.5 border border-gray-200">
                                {row.cod}
                            </td>
                            <td className="p-1.5 border border-gray-200">
                                {row.codPercent}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RateTable; 