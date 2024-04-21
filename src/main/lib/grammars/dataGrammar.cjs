// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
function id(x) { return x[0]; }

const expressionProcessor = (items) => {
  return { 
    left: items[0], 
    operator: items[2][0], 
    right: items[4] 
  }
}

const combineComponents = (items) => {
  return [
    ...[items[0]].flat(),
    ...[items[2]].flat(),
  ]
}
let Lexer = undefined;
let ParserRules = [
    {"name": "tokens$ebnf$1", "symbols": []},
    {"name": "tokens$ebnf$1$subexpression$1", "symbols": ["__", "token"]},
    {"name": "tokens$ebnf$1", "symbols": ["tokens$ebnf$1", "tokens$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tokens", "symbols": ["_", "token", "tokens$ebnf$1", "_"], "postprocess":  (items) => {
          return [
            items[1],
            ...items[2].map((items) => { return items[1] }),
          ]
        } },
    {"name": "token", "symbols": ["sumToken"], "postprocess": id},
    {"name": "token", "symbols": ["splitToken"], "postprocess": id},
    {"name": "token", "symbols": ["expressionToken"], "postprocess": id},
    {"name": "token", "symbols": ["addressToken"], "postprocess": id},
    {"name": "token", "symbols": ["valueToken"], "postprocess": id},
    {"name": "token", "symbols": ["byteToken"], "postprocess": id},
    {"name": "sumToken$string$1", "symbols": [{"literal":"s"}, {"literal":"u"}, {"literal":"m"}, {"literal":"("}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "sumToken", "symbols": ["sumToken$string$1", "_", "valueToken", "_", {"literal":","}, "_", /[1-4]/, "_", {"literal":")"}], "postprocess":  (items) => {
          return {
            type: "sum",
            numberOfBytes: parseInt(items[6]),
            operand: items[2],
          }
        } },
    {"name": "splitToken$string$1", "symbols": [{"literal":"s"}, {"literal":"p"}, {"literal":"l"}, {"literal":"i"}, {"literal":"t"}, {"literal":"("}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "splitToken$subexpression$1", "symbols": ["addressToken"]},
    {"name": "splitToken$subexpression$1", "symbols": ["valueToken"]},
    {"name": "splitToken", "symbols": ["splitToken$string$1", "_", "splitToken$subexpression$1", "_", {"literal":","}, "_", "tokens", "_", {"literal":")"}], "postprocess":  (items) => {
          return {
            type: "split",
            separator: items[6],
            operand: items[2][0],
          }
        } },
    {"name": "expressionToken$string$1", "symbols": [{"literal":"]"}, {"literal":"{"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "expressionToken", "symbols": [{"literal":"["}, /[1-4]/, "expressionToken$string$1", "additionSubtractionExpression", {"literal":"}"}], "postprocess":  (items) => { 
          return { 
            type: "expression", 
            numberOfBytes: parseInt(items[1]),
            expression: items[3],
          } 
        } },
    {"name": "addressToken", "symbols": [{"literal":"@"}, "valueToken"], "postprocess":  (items) => {
          return {
            type: "address",
            path: items[1].path,
          }
        } },
    {"name": "valueToken", "symbols": ["referenceComponents"], "postprocess":  (items) => {
          return {
            type: "value",
            path: items[0],
          }
        } },
    {"name": "byteToken", "symbols": [/[0-9a-fA-F]/, /[0-9a-fA-F]/], "postprocess":  (items) => { 
          return { 
            type: "byte", 
            value: parseInt(items[0] + items[1], 16) 
          } 
        } },
    {"name": "additionSubtractionExpression$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "additionSubtractionExpression$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "additionSubtractionExpression", "symbols": ["additionSubtractionExpression", "_", "additionSubtractionExpression$subexpression$1", "_", "multiplicationDivisionExpression"], "postprocess": expressionProcessor},
    {"name": "additionSubtractionExpression", "symbols": ["multiplicationDivisionExpression"], "postprocess": id},
    {"name": "multiplicationDivisionExpression$subexpression$1", "symbols": [{"literal":"*"}]},
    {"name": "multiplicationDivisionExpression$subexpression$1", "symbols": [{"literal":"/"}]},
    {"name": "multiplicationDivisionExpression", "symbols": ["multiplicationDivisionExpression", "_", "multiplicationDivisionExpression$subexpression$1", "_", "bitShiftExpression"], "postprocess": expressionProcessor},
    {"name": "multiplicationDivisionExpression", "symbols": ["bitShiftExpression"], "postprocess": id},
    {"name": "bitShiftExpression$subexpression$1$string$1", "symbols": [{"literal":"<"}, {"literal":"<"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "bitShiftExpression$subexpression$1", "symbols": ["bitShiftExpression$subexpression$1$string$1"]},
    {"name": "bitShiftExpression$subexpression$1$string$2", "symbols": [{"literal":">"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "bitShiftExpression$subexpression$1", "symbols": ["bitShiftExpression$subexpression$1$string$2"]},
    {"name": "bitShiftExpression", "symbols": ["bitShiftExpression", "_", "bitShiftExpression$subexpression$1", "_", "parenthesesExpression"], "postprocess": expressionProcessor},
    {"name": "bitShiftExpression", "symbols": ["parenthesesExpression"], "postprocess": id},
    {"name": "parenthesesExpression", "symbols": ["expressionComponent"], "postprocess": id},
    {"name": "parenthesesExpression", "symbols": [{"literal":"("}, "_", "additionSubtractionExpression", "_", {"literal":")"}], "postprocess": (items) => { return items[2] }},
    {"name": "expressionComponent", "symbols": ["valueToken"], "postprocess": id},
    {"name": "expressionComponent", "symbols": ["hexNumber"], "postprocess": id},
    {"name": "expressionComponent", "symbols": ["decimalNumer"], "postprocess": id},
    {"name": "expressionComponent", "symbols": ["binaryNumber"], "postprocess": id},
    {"name": "referenceComponents", "symbols": ["parentComponent", {"literal":"."}, "referenceComponents"], "postprocess": combineComponents},
    {"name": "referenceComponents", "symbols": ["includeComponents", {"literal":"."}, "requiredComponent"], "postprocess": combineComponents},
    {"name": "referenceComponents", "symbols": ["requiredComponent"], "postprocess": id},
    {"name": "includeComponents", "symbols": ["includeComponents", {"literal":"."}, "includeComponent"], "postprocess": combineComponents},
    {"name": "includeComponents", "symbols": ["includeComponent"], "postprocess": (items) => { return [items[0]] }},
    {"name": "requiredComponent$subexpression$1", "symbols": ["valueComponent"]},
    {"name": "requiredComponent$subexpression$1", "symbols": ["indexComponent"]},
    {"name": "requiredComponent", "symbols": ["requiredComponent$subexpression$1"], "postprocess": (items) => { return [items[0][0]] }},
    {"name": "parentComponent$string$1", "symbols": [{"literal":"p"}, {"literal":"a"}, {"literal":"r"}, {"literal":"e"}, {"literal":"n"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "parentComponent", "symbols": ["parentComponent$string$1"], "postprocess":  (items) => {
          return {
            type: "parent",
          }
        } },
    {"name": "includeComponent$ebnf$1$subexpression$1$subexpression$1$string$1", "symbols": [{"literal":"f"}, {"literal":"i"}, {"literal":"r"}, {"literal":"s"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "includeComponent$ebnf$1$subexpression$1$subexpression$1", "symbols": ["includeComponent$ebnf$1$subexpression$1$subexpression$1$string$1"]},
    {"name": "includeComponent$ebnf$1$subexpression$1$subexpression$1$string$2", "symbols": [{"literal":"l"}, {"literal":"a"}, {"literal":"s"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "includeComponent$ebnf$1$subexpression$1$subexpression$1", "symbols": ["includeComponent$ebnf$1$subexpression$1$subexpression$1$string$2"]},
    {"name": "includeComponent$ebnf$1$subexpression$1", "symbols": [{"literal":"."}, "includeComponent$ebnf$1$subexpression$1$subexpression$1"]},
    {"name": "includeComponent$ebnf$1", "symbols": ["includeComponent$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "includeComponent$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "includeComponent", "symbols": [{"literal":"#"}, "identifier", "includeComponent$ebnf$1"], "postprocess":  (items) => {
          const result = {
            type: "include",
            name: items[1],
          }
          
          if (items[2] != undefined && items[2] != null) {
            result.specifier = items[2][1][0]
          }
          
          return result
        } },
    {"name": "valueComponent", "symbols": [{"literal":"$"}, "identifier"], "postprocess":  (items) => {
          return {
            type: "value",
            name: items[1],
          }
        } },
    {"name": "indexComponent$string$1", "symbols": [{"literal":"i"}, {"literal":"n"}, {"literal":"d"}, {"literal":"e"}, {"literal":"x"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "indexComponent", "symbols": ["indexComponent$string$1"], "postprocess":  (items) => {
          return {
            type: "index",
          }
        } },
    {"name": "identifier$ebnf$1", "symbols": []},
    {"name": "identifier$ebnf$1", "symbols": ["identifier$ebnf$1", /[_a-zA-Z0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "identifier", "symbols": [/[_a-zA-Z]/, "identifier$ebnf$1"], "postprocess": (items) => { return items[0] + (items[1] ?? []).join("") }},
    {"name": "hexNumber$string$1", "symbols": [{"literal":"0"}, {"literal":"x"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "hexNumber$ebnf$1", "symbols": [/[0-9a-fA-F]/]},
    {"name": "hexNumber$ebnf$1", "symbols": ["hexNumber$ebnf$1", /[0-9a-fA-F]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "hexNumber", "symbols": ["hexNumber$string$1", "hexNumber$ebnf$1"], "postprocess": (items) => { return parseInt(items[1].join(""), 16) }},
    {"name": "decimalNumer$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "decimalNumer$ebnf$1", "symbols": ["decimalNumer$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "decimalNumer", "symbols": ["decimalNumer$ebnf$1"], "postprocess": (items) => { return parseInt(items[0].join("")) }},
    {"name": "binaryNumber$string$1", "symbols": [{"literal":"0"}, {"literal":"b"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "binaryNumber$ebnf$1", "symbols": [/[01]/]},
    {"name": "binaryNumber$ebnf$1", "symbols": ["binaryNumber$ebnf$1", /[01]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "binaryNumber", "symbols": ["binaryNumber$string$1", "binaryNumber$ebnf$1"], "postprocess": (items) => { return parseInt(items[1].join(""), 2) }},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", {"literal":" "}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": (items) => { return null }},
    {"name": "__$ebnf$1", "symbols": [{"literal":" "}]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", {"literal":" "}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": (items) => { return null }}
];
let ParserStart = "tokens";
export default { Lexer, ParserRules, ParserStart };
