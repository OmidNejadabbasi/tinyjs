import lexer as lex

exp = """
[25/(3*40) + {300-20} -16.5]
{(300-250)<(400-500)}
20 & 30 | 50
# This is a comment
"""

tokens = lex.lex(exp)
for tok in tokens:
    print(tok)