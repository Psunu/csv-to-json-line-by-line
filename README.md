# csv-to-json-line-by-line
대용량 csv 파일을 json 형식으로 변환하기 위한 툴입니다.  
When you convert huge size of csv to json.

데이터를 한 줄씩 불러와 json 형식으로 변환합니다. 이후 변환이 완료되면 GC에 의해 memory에서 제거됩니다.  
It will only load data line by line and after converted to json, GC will release it from memory.

# Usage
```
Usage: csv_to_json [options] <source_path>

Arguments:
  source_path            source csv file path

Options:
  --out <path>           output file path (default: "out.json")
  --delimiter <char>     text delimiter (default: ",")
  --string-token <char>  string token can be passed like --string-token '"' or --string-token "
  -h, --help             display help for command
```
