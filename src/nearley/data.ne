@preprocessor esmodule

@{%
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
%}

tokens -> _ token (__ token):* _ {% (items) => {
  return [
    items[1],
    ...items[2].map((items) => { return items[1] }),
  ]
} %}

token -> sumToken {% id %} | splitToken {% id %} | expressionToken {% id %} | addressToken {% id %} | valueToken {% id %} | byteToken {% id %}

sumToken -> "sum(" _ valueToken _ "," _ [1-4] _ ")" {% (items) => {
  return {
    type: "sum",
    numberOfBytes: parseInt(items[6]),
    operand: items[2],
  }
} %}

splitToken -> "split(" _ (addressToken | valueToken) _ "," _ tokens _ ")" {% (items) => {
  return {
    type: "split",
    separator: items[6],
    operand: items[2][0],
  }
} %}

expressionToken -> "[" [1-4] "]{" additionSubtractionExpression "}" {% (items) => { 
  return { 
    type: "expression", 
    numberOfBytes: parseInt(items[1]),
    expression: items[3],
  } 
} %}

addressToken -> "@" valueToken {% (items) => {
  return {
    type: "address",
    path: items[1].path,
  }
} %}

valueToken -> referenceComponents {% (items) => {
  return {
    type: "value",
    path: items[0],
  }
} %}

byteToken -> [0-9a-fA-F] [0-9a-fA-F] {% (items) => { 
  return { 
    type: "byte", 
    value: parseInt(items[0] + items[1], 16) 
  } 
} %}

additionSubtractionExpression -> additionSubtractionExpression _ ("+" | "-") _ multiplicationDivisionExpression {% expressionProcessor %} | multiplicationDivisionExpression {% id %}
multiplicationDivisionExpression -> multiplicationDivisionExpression _ ("*" | "/") _ bitShiftExpression {% expressionProcessor %} | bitShiftExpression {% id %}
bitShiftExpression -> bitShiftExpression _ ("<<" | ">>") _ parenthesesExpression {% expressionProcessor %} | parenthesesExpression {% id %}
parenthesesExpression -> expressionComponent {% id %} | "(" _ additionSubtractionExpression _ ")" {% (items) => { return items[2] } %}
expressionComponent -> valueToken {% id %} | hexNumber {% id %} | decimalNumer {% id %} | binaryNumber {% id %}

referenceComponents -> parentComponent "." referenceComponents {% combineComponents %} | includeComponents "." requiredComponent {% combineComponents %} | requiredComponent {% id %} 
includeComponents -> includeComponents "." includeComponent {% combineComponents %} | includeComponent {% (items) => { return [items[0]] } %} 
requiredComponent -> (valueComponent | indexComponent) {% (items) => { return [items[0][0]] } %}

parentComponent -> "parent" {% (items) => {
  return {
    type: "parent",
  }
} %}

includeComponent -> "#" identifier ("." ("first" | "last")):? {% (items) => {
  const result = {
    type: "include",
    name: items[1],
  }
  
  if (items[2] != undefined && items[2] != null) {
    result.specifier = items[2][1][0]
  }
  
  return result
} %}

valueComponent -> "$" identifier {% (items) => {
  return {
    type: "value",
    name: items[1],
  }
} %}

indexComponent -> "index" {% (items) => {
  return {
    type: "index",
  }
} %}

identifier -> [_a-zA-Z] [_a-zA-Z0-9]:* {% (items) => { return items[0] + (items[1] ?? []).join("") } %}
hexNumber -> "0x" [0-9a-fA-F]:+ {% (items) => { return parseInt(items[1].join(""), 16) } %}
decimalNumer -> [0-9]:+ {% (items) => { return parseInt(items[0].join("")) } %}
binaryNumber -> "0b" [01]:+ {% (items) => { return parseInt(items[1].join(""), 2) } %}
_ -> " ":* {% (items) => { return null } %}
__ -> " ":+ {% (items) => { return null } %}