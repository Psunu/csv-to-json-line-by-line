const { Command } = require("commander");
const fs = require("fs");
const readline = require("readline");

const program = new Command();

program
  .argument("<source_path>", "source csv file path")
  .option("--out <path>", "output file path", "out.json")
  .option("--delimiter <char>", "text delimiter", ",")
  .option(
    "--string-token <char>",
    `string token can be passed like --string-token '"' or --string-token \"`
  );

program.parse();

runLineByLine(
  program.args[0],
  program.opts().out,
  program.opts().delimiter,
  program.opts().stringToken
);

async function runLineByLine(input, output, delimiter, stringToken) {
  const fileStream = fs.createReadStream(input);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let fd;
  try {
    fd = fs.openSync(output, "a");

    let fields;
    for await (const line of rl) {
      if (!fields) {
        fields = splitCsv(line, delimiter, stringToken);
        continue;
      }

      json = csvToJson(line, fields, delimiter, stringToken);
      fs.appendFileSync(fd, JSON.stringify(json));
    }
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
    console.log("done");
  }
}

function csvToJson(line, fields, delimiter, stringToken) {
  const splitted = splitCsv(line, delimiter, stringToken);
  let json = {};

  for (let i = 0; i < fields.length; i++) {
    json[fields[i]] = splitted[i];
  }

  return json;
}

function splitCsv(line, delimiter, stringToken) {
  line = line.replace("\uFEFF", "");
  let splitted;

  if (stringToken) {
    splitted = line.split(stringToken);
    splitted = splitted.filter((word) => word !== delimiter);
    if (!splitted[0]) splitted.splice(0, 1);
    if (!splitted[-1]) splitted.splice(-1, 1);
  } else {
    splitted = line.split(delimiter);
  }

  return splitted;
}
