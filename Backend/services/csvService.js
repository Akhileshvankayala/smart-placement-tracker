import fs from "fs";
import Papa from "papaparse";

// ======================================
// Parse CSV File
// ======================================
export const parseCSV = (filePath) => {

    // Read File
    const file = fs.readFileSync(filePath, "utf8");

    // Parse CSV
    const parsedData = Papa.parse(file, {
        header: true,
        skipEmptyLines: true
    });

    return parsedData.data;
};