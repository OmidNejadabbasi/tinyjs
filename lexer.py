
import ply.lex as lexer  #library import
# List of token names.   This is always required
tokens = [
# OPERATORS #
'PLUS' ,        # +
'MINUS' ,       # -
'MULTIPLY',     # *
'DIVIDE',       # /
'MODULO',       # %


'NOT',          # ~
'EQUALS',       # =

# COMPARATORS #
'LT',           # <
'GT',           # >
'LTE',          # <=
'GTE',          # >=
'DOUBLEEQUAL',  # ==
'NE',           # !=
'AND',          # &
'OR' ,          # |                                                
# BRACKETS #

'LPAREN',       # (
'RPAREN',       # )
'LBRACE',       # [
'RBRACE',       # ]
'BLOCKSTART',   # {
'BLOCKEND',     # }
# DATA TYPES#

'INTEGER',      # int
'FLOAT',       # dbl

'COMMENT',  # --


]

t_PLUS    = r'\+'
t_MINUS   = r'-'
t_MULTIPLY   = r'\*'
t_DIVIDE  = r'/'
t_MODULO = r'%'
t_LPAREN  = r'\('
t_RPAREN  = r'\)'
t_LBRACE = r'\['
t_RBRACE = r'\]'
t_BLOCKSTART = r'\{'
t_BLOCKEND = r'\}'
t_NOT = r'\~'
t_EQUALS = r'\='
t_GT = r'\>'
t_LT = r'\<'
t_LTE = r'\<\='
t_GTE = r'\>\='
t_DOUBLEEQUAL = r'\=\='
t_NE = r'\!\='
t_AND = r'\&'
t_OR = r'\|'
t_COMMENT = r'\#.*'            
t_ignore  = ' \t' 


#Rules for INTEGER and FLOAT tokens
def t_INTEGER(t):
    r'\d+'
    t.value = int(t.value)    
    return t

def t_FLOAT(t):
    r'(\d*\.\d+)|(\d+\.\d*)'
    
    t.value = float(t.value)
    return t        

# Define a rule so we can track line numbers
def t_newline(t):
    r'\n+'
    t.lexer.lineno += len(t.value)

# Error handling rule
def t_error(t):
    print("Illegal character '%s'" % t.value[0])
    t.lexer.skip(1)



def lex(program):
    lexerInstance = lexer.lex()
    lexerInstance.input(program)
    return lexerInstance
