const fs = require("fs");
const csv = require("csv-parser");

(async () => {
  const arr = await parse("./Untitled/Feuil2-Table 1.csv");
  let count = 0;
  console.log("export const DRUG_LIST = [");
  for (let i = 0; i < arr.length; i++) {
    try {
      const y = arr[i];
      console.log(y, ",");
    } catch (e) {
      console.log("e", e);
    }
    count++;
  }
  console.log("];");
  process.exit(1);
})();

function parse(file) {
  let arr = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv({ separator: ";" }))
      .on("data", async (row) => {
        let newRow = {};
        try {
          const obj = {};

          Object.keys(row).map((key) => {
            newRow[key.trim()] = row[key]; // fix weird bug with the key REGION
          });
          obj.id = newRow["name"];
          const r = newRow["name"].match(/(.*)\((.*)\)/);

          if (r && r[1]) obj.name1 = r[1].trim();
          if (r && r[2]) obj.name2 = r[2].trim();
          if (!obj.name1) obj.name1 = newRow["name"].trim();

          if (newRow["posology"]) obj.values = newRow["posology"].split(",").map((e) => e.trim());
          arr.push(obj);
        } catch (e) {
          console.log("e", e);
        }
      })
      .on("end", async () => {
        resolve(arr);
      });
  });
}
