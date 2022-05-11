const fs = require("fs");
const readline = require("readline");

const Options = {
  in: "--in",
  out: "--out",
  delimiter: "--delimiter",
  stringToken: "--string-token",
};

let settings = {
  out: "out.json",
  delimiter: ",",
};

try {
  parseOptions();
} catch (e) {
  console.log(e);
  console.log(
    `usage : node csv_to_json --in <source_path> --out <output_path> --delimiter <delimiter> --string-token <string_token>
      --in option is mandatory
      --string-token can be passed like --string-token '"' --string-token \"
      `
  );
  process.exit(1);
}

console.log(settings);
runLineByLine(
  settings.in,
  settings.out,
  settings.delimiter,
  settings.stringToken
);

function parseOptions() {
  for (const key in Options) {
    const index = process.argv.indexOf(Options[key]);
    if (index === -1) {
      if (Options[key] === Options.in) throw "--in option is required";
      continue;
    }
    settings[key] = process.argv[index + 1];
  }
}

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
