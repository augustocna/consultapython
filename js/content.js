/* =============================================================================
 *  CONTENT.JS  -  Conteúdo do site (categorias, tópicos e exemplos)
 * -----------------------------------------------------------------------------
 *  COMO ADICIONAR UM TÓPICO (dentro do "topics" de uma categoria)
 *
 *      {
 *          id: 'meu-topico',          // único e sem espaço: vira o link #meu-topico
 *          title: 'Título do tópico',
 *          level: B,                  // B = básico, I = intermediário
 *          tags: ['palavras', 'extras', 'para', 'busca'],
 *          summary: 'Uma ou duas frases explicando o assunto.',
 *          blocks: [ ...blocos ],
 *      },
 *
 *  BLOCOS DISPONÍVEIS
 *      code('Título', py`código`, py`saída`)    exemplo com botão copiar
 *                                               (a saída é opcional)
 *      bash('Título', py`comandos`)             comandos de terminal
 *      text('Parágrafo')
 *      list('item 1', 'item 2', ...)
 *      table(['Coluna 1', 'Coluna 2'], ['a', 'b'], ['c', 'd'])
 *      tip('Dica')     warn('Cuidado')     when('Quando usar')
 *
 *  NOS TEXTOS: `código` vira código e **texto** vira negrito.
 *  NO CÓDIGO: use py`...` (as barras \ ficam exatamente como estão).
 * ============================================================================= */

const CONTENT = (() => {
    'use strict';

    const py = String.raw;
    const B = 'basico';
    const I = 'intermediario';

    const code = (title, src, output = null, lang = null) => ({ type: 'code', title, code: src, output, lang });
    const bash = (title, src) => code(title, src, null, 'bash');
    const text = (t) => ({ type: 'text', text: t });
    const list = (...items) => ({ type: 'list', items });
    const table = (head, ...rows) => ({ type: 'table', head, rows });
    const tip = (t) => ({ type: 'tip', text: t });
    const warn = (t) => ({ type: 'warn', text: t });
    const when = (t) => ({ type: 'when', text: t });

    return [

/* =============================================================================
 * 1. PRIMEIROS PASSOS
 * ============================================================================= */
{
    id: 'primeiros-passos',
    icon: '🚀',
    title: 'Primeiros passos',
    description: 'Como o Python lê o seu código e como conversar com o usuário.',
    topics: [
        {
            id: 'comentarios-indentacao',
            title: 'Comentários e indentação',
            level: B,
            tags: ['comentario', 'recuo', 'espaços', 'tab', 'hashtag', '#'],
            summary: 'Comentários são anotações que o Python ignora. Indentação é o recuo que mostra o que está "dentro" de quê.',
            blocks: [
                code('Comentários', py`
# Comentário de uma linha: o Python ignora tudo depois do #
print('Olá!')  # também pode vir no fim da linha

'''
Texto entre três aspas pode ser usado
como comentário de várias linhas.
'''
`, py`
Olá!
`),
                code('Indentação (recuo de 4 espaços)', py`
idade = 20
if idade >= 18:
    print('Dentro do if')     # 4 espaços = está dentro
    print('Também dentro')
print('Fora do if')           # sem recuo = fora
`, py`
Dentro do if
Também dentro
Fora do if
`),
                warn('Esquecer o recuo depois de `:` ou misturar espaços com Tab gera `IndentationError`.'),
                tip('Configure o editor para inserir 4 espaços quando você apertar Tab.'),
            ],
        },
        {
            id: 'variaveis',
            title: 'Variáveis',
            level: B,
            tags: ['atribuição', 'nome', 'snake_case', 'guardar valor', '='],
            summary: 'Uma variável é um nome que guarda um valor. O sinal `=` significa "guarde isto aqui", não "igual".',
            blocks: [
                code('Criando e mudando variáveis', py`
nome = 'Ana'
idade = 17
altura = 1.65

idade = idade + 1      # pega o valor antigo, soma 1 e guarda de novo
print(nome, idade)
`, py`
Ana 18
`),
                code('Várias de uma vez', py`
x, y, z = 1, 2, 3
a = b = 0              # a e b valem 0
x, y = y, x            # troca os valores de x e y
print(x, y, z, a, b)
`, py`
2 1 3 0 0
`),
                table(['Nome', 'Pode?', 'Por quê'],
                    ['`nota_final`', 'Sim', 'letras, números e _'],
                    ['`2total`', 'Não', 'não pode começar com número'],
                    ['`nota final`', 'Não', 'não pode ter espaço'],
                    ['`for`', 'Não', 'é uma palavra reservada do Python'],
                ),
                tip('Use nomes que expliquem o conteúdo (`preco` em vez de `p`) no padrão snake_case: `nome_completo`.'),
                warn('`Nome` e `nome` são variáveis diferentes: o Python diferencia maiúsculas de minúsculas.'),
            ],
        },
        {
            id: 'print',
            title: 'Mostrando na tela: print e f-string',
            level: B,
            tags: ['saida', 'imprimir', 'mostrar', 'fstring', 'formatar', 'sep', 'end'],
            summary: '`print()` mostra valores na tela. A f-string é o jeito mais fácil de montar frases com variáveis.',
            blocks: [
                code('print básico', py`
print('Olá, mundo!')
print('Idade:', 18)            # a vírgula separa e coloca um espaço
print('a', 'b', 'c', sep='-')  # muda o separador
print('sem pular linha', end=' ')
print('continua aqui')
`, py`
Olá, mundo!
Idade: 18
a-b-c
sem pular linha continua aqui
`),
                code('f-string', py`
nome = 'Ana'
idade = 18
preco = 7.5

print(f'{nome} tem {idade} anos')
print(f'Ano que vem terá {idade + 1}')
print(f'Total: R$ {preco:.2f}')
`, py`
Ana tem 18 anos
Ano que vem terá 19
Total: R$ 7.50
`),
                tip('Coloque um `f` antes das aspas e as variáveis entre `{ }`. Dentro das chaves também pode ter contas.'),
            ],
        },
        {
            id: 'input',
            title: 'Lendo do teclado: input',
            level: B,
            tags: ['entrada', 'digitar', 'teclado', 'usuario', 'ler'],
            summary: '`input()` pausa o programa, espera o usuário digitar e devolve o que foi digitado.',
            blocks: [
                code('Lendo texto e números', py`
nome = input('Qual seu nome? ')
idade = int(input('Sua idade: '))        # converte para inteiro
altura = float(input('Sua altura: '))    # converte para decimal

print(f'{nome}, {idade} anos, {altura} m')
`),
                warn('`input()` SEMPRE devolve texto (`str`). Para fazer contas, converta com `int()` ou `float()`.'),
                code('Erro clássico', py`
idade = input('Idade: ')     # o usuário digita 17
print(idade + 1)             # TypeError: texto + número não dá
`),
            ],
        },
    ],
},

/* =============================================================================
 * 2. TIPOS DE DADOS
 * ============================================================================= */
{
    id: 'tipos',
    icon: '🧱',
    title: 'Tipos de dados',
    description: 'Todo valor tem um tipo, e o tipo define o que dá para fazer com ele.',
    topics: [
        {
            id: 'tipos-resumo',
            title: 'Resumo dos tipos básicos',
            level: B,
            tags: ['int', 'float', 'str', 'bool', 'none', 'type', 'isinstance', 'primitivos'],
            summary: 'Os tipos que você mais vai usar no dia a dia.',
            blocks: [
                table(['Tipo', 'Guarda', 'Exemplos', 'Converter com'],
                    ['`int`', 'número inteiro', '`-5`, `0`, `42`', "`int('42')`"],
                    ['`float`', 'número decimal', '`3.14`, `-0.5`', "`float('3.14')`"],
                    ['`str`', 'texto', "`'Olá'`, `''`", '`str(42)`'],
                    ['`bool`', 'verdadeiro ou falso', '`True`, `False`', '`bool(1)`'],
                    ['`None`', 'ausência de valor', '`None`', 'não se converte'],
                ),
                tip("Aspas simples e duplas funcionam igual no Python. Neste guia usamos sempre simples, e duplas só quando o texto tem um apóstrofo dentro: `\"Copo d'água\"`."),
                code('Descobrindo o tipo', py`
print(type(10))
print(type(3.5))
print(type('oi'))
print(type(True))
print(isinstance(10, int))
`, py`
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
True
`),
            ],
        },
        {
            id: 'numeros',
            title: 'Números: int e float',
            level: B,
            tags: ['inteiro', 'decimal', 'round', 'arredondar', 'abs', 'divisao', 'casas decimais'],
            summary: '`int` são números inteiros. `float` são números com casas decimais.',
            blocks: [
                code('Exemplos', py`
idade = 25            # int
preco = 19.90         # float
grande = 1_000_000    # o _ só ajuda a ler

print(10 / 3)         # divisão sempre dá float
print(round(10 / 3, 2))
print(abs(-7))
print(0.1 + 0.2)
`, py`
3.3333333333333335
3.33
7
0.30000000000000004
`),
                warn('O decimal é com ponto: `19.90`, nunca `19,90`.'),
                tip('`0.1 + 0.2` não dá exatamente `0.3` por causa de como o computador guarda decimais. Para mostrar, use `round()` ou `:.2f`.'),
                when('`int` para contar (idades, quantidades, posições). `float` para medidas, médias e porcentagens.'),
            ],
        },
        {
            id: 'bool-none',
            title: 'Booleanos e None',
            level: B,
            tags: ['true', 'false', 'verdadeiro', 'falso', 'nulo', 'vazio', 'is none'],
            summary: '`bool` só tem dois valores: `True` e `False`. `None` representa "nenhum valor".',
            blocks: [
                code('Exemplos', py`
aprovado = True
tem_desconto = False
print(10 > 5)            # comparações viram bool

resultado = None         # ainda não tem valor
if resultado is None:
    print('Ainda não calculado')
`, py`
True
Ainda não calculado
`),
                warn('Sempre com a primeira letra maiúscula: `True`, `False`, `None`.'),
                tip('Para testar se algo é `None`, use `is None` em vez de `== None`.'),
            ],
        },
        {
            id: 'conversao',
            title: 'Conversão de tipos',
            level: B,
            tags: ['converter', 'casting', 'int()', 'float()', 'str()', 'transformar'],
            summary: 'Para transformar um tipo em outro, use o nome do tipo como função.',
            blocks: [
                code('Exemplos', py`
print(int('10') + 5)      # texto -> inteiro
print(float('2.5') * 2)   # texto -> decimal
print(str(100) + '%')     # número -> texto
print(int(3.9))           # corta o decimal, não arredonda
print(round(3.9))         # arredonda
print(bool(0), bool(''), bool('oi'))
`, py`
15
5.0
100%
3
4
False False True
`),
                warn("`int('abc')` e `int('3.5')` dão `ValueError`. Para `'3.5'`, converta para float primeiro: `int(float('3.5'))`."),
            ],
        },
    ],
},

/* =============================================================================
 * 3. OPERADORES
 * ============================================================================= */
{
    id: 'operadores',
    icon: '➗',
    title: 'Operadores',
    description: 'Contas, comparações e combinações de condições.',
    topics: [
        {
            id: 'aritmeticos',
            title: 'Aritméticos e atribuição',
            level: B,
            tags: ['soma', 'subtração', 'multiplicação', 'divisão', 'resto', 'módulo', 'potência', '+=', 'par', 'ímpar'],
            summary: 'Os operadores para fazer contas, e os atalhos para atualizar uma variável.',
            blocks: [
                table(['Operador', 'Faz', 'Exemplo', 'Resultado'],
                    ['`+`', 'soma', '`5 + 2`', '`7`'],
                    ['`-`', 'subtração', '`5 - 2`', '`3`'],
                    ['`*`', 'multiplicação', '`5 * 2`', '`10`'],
                    ['`/`', 'divisão', '`5 / 2`', '`2.5`'],
                    ['`//`', 'divisão inteira', '`5 // 2`', '`2`'],
                    ['`%`', 'resto da divisão', '`5 % 2`', '`1`'],
                    ['`**`', 'potência', '`5 ** 2`', '`25`'],
                ),
                code('Atalhos de atribuição', py`
pontos = 10
pontos += 5     # pontos = pontos + 5   -> 15
pontos -= 3     # pontos = pontos - 3   -> 12
pontos *= 2     # pontos = pontos * 2   -> 24
pontos //= 5    # pontos = pontos // 5  -> 4
print(pontos)
`, py`
4
`),
                tip('`numero % 2 == 0` testa se o número é par. O `%` também serve para "a cada N vezes": `if i % 10 == 0`.'),
            ],
        },
        {
            id: 'comparacao',
            title: 'Comparação',
            level: B,
            tags: ['igual', 'diferente', 'maior', 'menor', '==', '!=', '>=', '<='],
            summary: 'Comparam dois valores e sempre devolvem `True` ou `False`.',
            blocks: [
                table(['Operador', 'Significa', 'Exemplo'],
                    ['`==`', 'igual a', '`5 == 5` → True'],
                    ['`!=`', 'diferente de', '`5 != 3` → True'],
                    ['`>`', 'maior que', '`5 > 3` → True'],
                    ['`<`', 'menor que', '`5 < 3` → False'],
                    ['`>=`', 'maior ou igual', '`5 >= 5` → True'],
                    ['`<=`', 'menor ou igual', '`3 <= 2` → False'],
                ),
                code('Comparações encadeadas', py`
idade = 15
print(12 <= idade < 18)     # entre 12 e 17?
print('abc' == 'ABC')       # diferencia maiúsculas
`, py`
True
False
`),
                warn('`=` guarda um valor e `==` compara. Escrever `if x = 5:` dá erro.'),
            ],
        },
        {
            id: 'logicos',
            title: 'Lógicos e pertencimento',
            level: B,
            tags: ['and', 'or', 'not', 'in', 'not in', 'e', 'ou', 'não', 'contém'],
            summary: 'Juntam ou invertem condições, e verificam se algo está dentro de outra coisa.',
            blocks: [
                list(
                    '`and`: True só se as **duas** forem verdadeiras',
                    '`or`: True se **pelo menos uma** for verdadeira',
                    '`not`: inverte o valor',
                    '`in` / `not in`: verifica se algo está dentro de outro',
                ),
                code('Exemplos', py`
idade = 20
tem_ingresso = True

print(idade >= 18 and tem_ingresso)
print(idade < 12 or idade > 60)
print(not tem_ingresso)
print('a' in 'banana')
print(3 not in [1, 2, 3])
`, py`
True
False
False
True
False
`),
                tip('`x == 1 or x == 2 or x == 3` fica bem mais limpo assim: `x in (1, 2, 3)`.'),
            ],
        },
    ],
},

/* =============================================================================
 * 4. STRINGS
 * ============================================================================= */
{
    id: 'strings',
    icon: '🔤',
    title: 'Strings (textos)',
    description: 'Tudo o que dá para fazer com texto.',
    topics: [
        {
            id: 'strings-indices',
            title: 'Índices e fatiamento',
            level: B,
            tags: ['posição', 'slice', 'fatiar', 'letra', 'inverter', 'len', 'tamanho'],
            summary: 'Cada caractere tem uma posição, começando em 0. Números negativos contam a partir do fim.',
            blocks: [
                code('Exemplos', py`
texto = 'Python'
#        012345

print(texto[0])       # primeira letra
print(texto[-1])      # última letra
print(texto[0:3])     # da posição 0 até ANTES da 3
print(texto[2:])      # da 2 até o fim
print(texto[::-1])    # de trás para frente
print(len(texto))     # quantidade de caracteres
`, py`
P
n
Pyt
thon
nohtyP
6
`),
                tip('Fatiamento: `[início:fim:passo]`. A posição do fim nunca entra.'),
                warn("Strings não podem ser alteradas: `texto[0] = 'J'` dá erro. Crie uma nova: `'J' + texto[1:]`."),
            ],
        },
        {
            id: 'strings-metodos',
            title: 'Métodos de string mais usados',
            level: B,
            tags: ['upper', 'lower', 'strip', 'split', 'join', 'replace', 'find', 'count', 'startswith', 'endswith', 'isdigit', 'title', 'maiúscula', 'minúscula'],
            summary: 'Funções prontas que toda string tem. Use com ponto: `texto.upper()`.',
            blocks: [
                table(['Método', 'Faz', 'Exemplo → resultado'],
                    ['`upper()` / `lower()`', 'maiúsculas / minúsculas', "`'Oi'.upper()` → `'OI'`"],
                    ['`title()`', 'primeira letra de cada palavra maiúscula', "`'ana souza'.title()` → `'Ana Souza'`"],
                    ['`strip()`', 'tira espaços das pontas', "`'  oi  '.strip()` → `'oi'`"],
                    ['`replace(a, b)`', 'troca a por b', "`'1,5'.replace(',', '.')` → `'1.5'`"],
                    ['`split(sep)`', 'quebra em uma lista', "`'a,b'.split(',')` → `['a', 'b']`"],
                    ['`sep.join(lista)`', 'junta uma lista em texto', "`'-'.join(['a', 'b'])` → `'a-b'`"],
                    ['`find(x)`', 'posição de x (-1 se não achar)', "`'banana'.find('n')` → `2`"],
                    ['`count(x)`', 'quantas vezes x aparece', "`'banana'.count('a')` → `3`"],
                    ['`startswith(x)` / `endswith(x)`', 'começa / termina com', "`'foto.png'.endswith('.png')` → `True`"],
                    ['`isdigit()`', 'só tem dígitos?', "`'123'.isdigit()` → `True`"],
                ),
                code('Limpando o que o usuário digitou', py`
resposta = input('Deseja continuar? ').strip().lower()
if resposta in ('s', 'sim'):
    print('Continuando...')

nota = float(input('Nota: ').replace(',', '.'))   # aceita 7,5 e 7.5
`),
                tip('Métodos de string não mudam a original: eles devolvem uma string nova. Guarde o resultado: `nome = nome.strip()`.'),
            ],
        },
        {
            id: 'strings-formatacao',
            title: 'Formatação avançada e textos especiais',
            level: I,
            tags: ['fstring', 'casas decimais', 'alinhar', 'porcentagem', 'milhar', 'zeros', 'multilinha', 'raw', 'barra invertida', 'escape', '\\n'],
            summary: 'Depois dos dois-pontos dentro da f-string você controla casas decimais, alinhamento e muito mais.',
            blocks: [
                code('Formatando números e alinhando', py`
preco = 1234.5
nome = 'Ana'
taxa = 0.256

print(f'{preco:.2f}')       # 2 casas decimais
print(f'{preco:,.2f}')      # separador de milhar
print(f'{taxa:.1%}')        # porcentagem
print(f'[{nome:>10}]')      # alinha à direita em 10 espaços
print(f'[{nome:<10}]')      # alinha à esquerda
print(f'[{nome:^10}]')      # centraliza
print(f'{7:03d}')           # completa com zeros
print(f'{preco=}')          # mostra nome e valor (ótimo para testar)
`, py`
1234.50
1,234.50
25.6%
[       Ana]
[Ana       ]
[   Ana    ]
007
preco=1234.5
`),
                code('Textos de várias linhas e caracteres especiais', py`
mensagem = '''Olá!
Este texto ocupa
várias linhas.'''

caminho = r'C:\pasta\novo'   # r = raw: a barra \ não vira comando
print('Linha 1\nLinha 2')    # \n pula linha e \t dá um tab
`, py`
Linha 1
Linha 2
`),
                tip("Para o padrão brasileiro (1.234,50): `f'{preco:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.')`."),
            ],
        },
    ],
},

/* =============================================================================
 * 5. COLEÇÕES
 * ============================================================================= */
{
    id: 'colecoes',
    icon: '📦',
    title: 'Coleções',
    description: 'Guardar vários valores em uma variável só: listas, tuplas, dicionários e conjuntos.',
    topics: [
        {
            id: 'colecoes-resumo',
            title: 'Qual coleção usar?',
            level: B,
            tags: ['list', 'tuple', 'dict', 'set', 'comparativo', 'mutável', 'imutável', 'ordenado', 'diferença'],
            summary: 'Comparativo rápido das quatro coleções do Python.',
            blocks: [
                table(['Tipo', 'Cria com', 'Pode alterar?', 'Tem ordem?', 'Aceita repetido?', 'Use para'],
                    ['`list`', '`[1, 2, 3]`', 'sim', 'sim', 'sim', 'grupo de itens que muda'],
                    ['`tuple`', '`(1, 2, 3)`', 'não', 'sim', 'sim', 'dados fixos (coordenadas, datas)'],
                    ['`dict`', "`{'chave': valor}`", 'sim', 'sim*', 'chave não', 'informações com nome (fichas)'],
                    ['`set`', '`{1, 2, 3}`', 'sim', 'não', 'não', 'tirar repetidos, comparar grupos'],
                ),
                text('* O dicionário guarda a ordem em que os itens foram inseridos, mas o acesso é sempre pela chave, nunca pela posição.'),
                warn('`{}` vazio cria um **dicionário**. Para um set vazio, use `set()`.'),
            ],
        },
        {
            id: 'listas',
            title: 'Listas (list)',
            level: B,
            tags: ['append', 'insert', 'remove', 'pop', 'sort', 'extend', 'index', 'count', 'del', 'array', 'vetor', 'adicionar', 'remover', 'ordenar'],
            summary: 'A coleção mais usada. Guarda itens em ordem, e você pode adicionar, remover e trocar à vontade.',
            blocks: [
                code('Criar e acessar', py`
frutas = ['maçã', 'banana', 'uva']

print(frutas[0])        # primeiro
print(frutas[-1])       # último
print(len(frutas))      # quantidade
print('uva' in frutas)  # está na lista?
`, py`
maçã
uva
3
True
`),
                code('Adicionar, remover e alterar', py`
frutas = ['maçã', 'banana']

frutas.append('uva')              # adiciona no fim
frutas.insert(0, 'kiwi')          # adiciona na posição 0
frutas.extend(['pera', 'manga'])  # adiciona vários
frutas[1] = 'melão'               # troca o item da posição 1
frutas.remove('banana')           # remove pelo valor
ultimo = frutas.pop()             # remove e devolve o último
del frutas[0]                     # remove pela posição

print(frutas, ultimo)
`, py`
['melão', 'uva', 'pera'] manga
`),
                code('Ordenar e outras operações', py`
notas = [7.5, 9.0, 5.5, 8.0]

notas.sort()                    # ordena a própria lista
print(notas)
notas.sort(reverse=True)        # do maior para o menor
print(notas)
print(sum(notas) / len(notas))  # média
print(max(notas), min(notas))
print(notas.index(9.0))         # posição do 9.0
print(notas.count(8.0))         # quantas vezes aparece
`, py`
[5.5, 7.5, 8.0, 9.0]
[9.0, 8.0, 7.5, 5.5]
7.5
9.0 5.5
0
1
`),
                warn('`lista.sort()` muda a lista e devolve `None`, então `x = lista.sort()` deixa `x` vazio. Para uma cópia ordenada, use `sorted(lista)`.'),
                when('Notas de uma turma, lista de tarefas, carrinho de compras: qualquer grupo de itens que pode crescer ou mudar.'),
            ],
        },
        {
            id: 'listas-fatiamento',
            title: 'Fatiamento, cópia e listas de listas',
            level: B,
            tags: ['slice', 'copy', 'copiar', 'matriz', 'tabela', 'lista dentro de lista', 'inverter'],
            summary: 'Pegar pedaços de uma lista, copiar do jeito certo e montar tabelas com listas dentro de listas.',
            blocks: [
                code('Fatiamento', py`
nums = [10, 20, 30, 40, 50]

print(nums[1:3])     # posições 1 e 2
print(nums[:2])      # os 2 primeiros
print(nums[-2:])     # os 2 últimos
print(nums[::2])     # de 2 em 2
print(nums[::-1])    # invertida
`, py`
[20, 30]
[10, 20]
[40, 50]
[10, 30, 50]
[50, 40, 30, 20, 10]
`),
                code('Cuidado ao copiar', py`
a = [1, 2, 3]
b = a          # b NÃO é cópia: é outro nome para a mesma lista
b.append(4)
print(a)

c = a.copy()   # agora sim uma cópia (ou a[:] ou list(a))
c.append(5)
print(a, c)
`, py`
[1, 2, 3, 4]
[1, 2, 3, 4] [1, 2, 3, 4, 5]
`),
                code('Lista de listas (matriz)', py`
matriz = [
    [1, 2, 3],
    [4, 5, 6],
]
print(matriz[1][2])    # linha 1, coluna 2
`, py`
6
`),
            ],
        },
        {
            id: 'tuplas',
            title: 'Tuplas (tuple)',
            level: B,
            tags: ['imutável', 'coordenada', 'desempacotar', 'fixo', 'parênteses'],
            summary: 'Parecida com a lista, mas não pode ser alterada depois de criada.',
            blocks: [
                code('Exemplos', py`
coordenada = (10, 20)
data = (14, 10, 2026)
unico = (5,)              # tupla de 1 item precisa da vírgula

print(coordenada[0])
x, y = coordenada         # desempacotar
print(x, y)
print(len(data))
`, py`
10
10 20
3
`),
                warn('Tuplas não podem ser alteradas: `coordenada[0] = 5` dá `TypeError`.'),
                when('Dados fixos que andam juntos: coordenadas, datas, cores RGB. Também para devolver vários valores de uma função.'),
            ],
        },
        {
            id: 'dicionarios',
            title: 'Dicionários (dict)',
            level: B,
            tags: ['chave', 'valor', 'get', 'items', 'keys', 'values', 'ficha', 'cadastro', 'contar', 'json', 'mapa'],
            summary: 'Guarda pares `chave: valor`, como uma ficha de cadastro. Você acessa cada valor pelo nome da chave.',
            blocks: [
                code('Criar, acessar e alterar', py`
aluno = {'nome': 'Ana', 'idade': 17, 'nota': 8.5}

print(aluno['nome'])
print(aluno.get('email'))               # None se não existir
print(aluno.get('email', 'sem email'))  # valor padrão

aluno['nota'] = 9.0            # chave existe: altera
aluno['email'] = 'ana@x.com'   # chave nova: adiciona
del aluno['idade']             # remove
print(aluno)
`, py`
Ana
None
sem email
{'nome': 'Ana', 'nota': 9.0, 'email': 'ana@x.com'}
`),
                code('Percorrendo', py`
precos = {'pão': 0.5, 'leite': 4.9, 'café': 18.0}

for produto, preco in precos.items():
    print(f'{produto}: R$ {preco:.2f}')

print(list(precos.keys()))
print('leite' in precos)     # procura nas CHAVES
`, py`
pão: R$ 0.50
leite: R$ 4.90
café: R$ 18.00
['pão', 'leite', 'café']
True
`),
                code('Contando coisas', py`
votos = ['Ana', 'Beto', 'Ana', 'Caio', 'Ana']
contagem = {}
for nome in votos:
    contagem[nome] = contagem.get(nome, 0) + 1
print(contagem)
`, py`
{'Ana': 3, 'Beto': 1, 'Caio': 1}
`),
                warn("`aluno['xyz']` dá `KeyError` se a chave não existir. Na dúvida, use `.get()`."),
                when('Quando cada informação tem um nome: cadastro de pessoa, produto com preço e estoque, contagem de votos.'),
            ],
        },
        {
            id: 'conjuntos',
            title: 'Conjuntos (set)',
            level: B,
            tags: ['únicos', 'repetidos', 'duplicados', 'interseção', 'união', 'diferença', 'add', 'discard'],
            summary: 'Coleção sem repetição e sem ordem. Ótima para tirar duplicados e comparar grupos.',
            blocks: [
                code('Exemplos', py`
numeros = {1, 2, 3, 3, 3}
print(numeros)               # os repetidos somem

numeros.add(4)
numeros.discard(10)          # remove sem dar erro se não existir
print(3 in numeros)

emails = ['a@x.com', 'b@x.com', 'a@x.com']
print(len(set(emails)))      # quantos são únicos
`, py`
{1, 2, 3}
True
2
`),
                code('Comparando grupos', py`
prova1 = {'Ana', 'Beto', 'Caio'}
prova2 = {'Beto', 'Caio', 'Duda'}

print(sorted(prova1 & prova2))   # fizeram as duas
print(sorted(prova1 | prova2))   # fizeram pelo menos uma
print(sorted(prova1 - prova2))   # só a prova 1
`, py`
['Beto', 'Caio']
['Ana', 'Beto', 'Caio', 'Duda']
['Ana']
`),
                tip('Sets de texto não têm ordem garantida. Use `sorted()` para mostrar em ordem.'),
                warn('`{}` cria um dicionário vazio. Um set vazio é `set()`.'),
            ],
        },
        {
            id: 'desempacotamento',
            title: 'Desempacotamento',
            level: I,
            tags: ['unpacking', 'asterisco', '*', 'trocar valores', 'juntar listas', 'spread'],
            summary: 'Separar os itens de uma coleção em várias variáveis de uma vez, ou espalhar uma coleção dentro de outra.',
            blocks: [
                code('Separando em variáveis', py`
nome, idade = ['Ana', 17]
primeiro, *resto = [1, 2, 3, 4]
*inicio, ultimo = [1, 2, 3, 4]
print(primeiro, resto)
print(inicio, ultimo)

a, b = 1, 2
a, b = b, a          # troca sem variável auxiliar
print(a, b)
`, py`
1 [2, 3, 4]
[1, 2, 3] 4
2 1
`),
                code('Juntando coleções', py`
lista = [*[1, 2], *[3, 4]]
dados = {**{'a': 1}, **{'b': 2}}
print(lista, dados)
`, py`
[1, 2, 3, 4] {'a': 1, 'b': 2}
`),
            ],
        },
    ],
},

/* =============================================================================
 * 6. CONDICIONAIS
 * ============================================================================= */
{
    id: 'condicionais',
    icon: '🔀',
    title: 'Condicionais',
    description: 'Fazer o programa tomar decisões.',
    topics: [
        {
            id: 'if-elif-else',
            title: 'if, elif e else',
            level: B,
            tags: ['se', 'senão', 'condição', 'decisão', 'desvio'],
            summary: 'Executa um bloco só se a condição for verdadeira. O Python testa de cima para baixo e para no primeiro `True`.',
            blocks: [
                code('Sintaxe', py`
if condicao:
    # roda se a condição for True
    ...
elif outra_condicao:
    # roda se a de cima for False e esta for True
    ...
else:
    # roda se nenhuma for True
    ...
`),
                list(
                    'Só o `if` é obrigatório. `elif` e `else` são opcionais.',
                    'Pode ter quantos `elif` quiser.',
                    'Não esqueça os dois-pontos `:` e os 4 espaços de recuo no bloco de dentro.',
                ),
                code('Classificando notas', py`
nota = 7.5

if nota >= 9:
    print('Excelente')
elif nota >= 7:
    print('Aprovado')
elif nota >= 5:
    print('Recuperação')
else:
    print('Reprovado')
`, py`
Aprovado
`),
                code('Juntando condições', py`
usuario = input('Usuário: ')
senha = input('Senha: ')

if usuario == 'admin' and senha == '1234':
    print('Login liberado')
else:
    print('Usuário ou senha incorretos')
`),
                code('if dentro de if', py`
idade = 20
tem_carteira = False

if idade >= 18:
    if tem_carteira:
        print('Pode dirigir')
    else:
        print('Precisa tirar a carteira')
else:
    print('Ainda não pode dirigir')
`, py`
Precisa tirar a carteira
`),
                when('Validar login, dar desconto por faixa de preço, classificar notas, checar se um número é par.'),
            ],
        },
        {
            id: 'ternario',
            title: 'if em uma linha (ternário)',
            level: I,
            tags: ['operador ternário', 'condicional em uma linha', 'inline'],
            summary: 'Escolhe entre dois valores em uma linha só.',
            blocks: [
                code('Exemplos', py`
idade = 20
status = 'maior' if idade >= 18 else 'menor'
print(status)

nota = 6
print('Aprovado' if nota >= 7 else 'Reprovado')
`, py`
maior
Reprovado
`),
                tip('Use só para escolhas simples entre dois valores. Se ficar difícil de ler, volte para o if normal.'),
            ],
        },
        {
            id: 'truthy-falsy',
            title: 'Valores que contam como verdadeiro ou falso',
            level: I,
            tags: ['truthy', 'falsy', 'vazio', 'lista vazia', 'texto vazio', 'zero'],
            summary: 'Todo valor pode ser usado como condição. Vazios e zero contam como `False`.',
            blocks: [
                table(['Conta como False', 'Conta como True'],
                    ['`0`, `0.0`', 'qualquer outro número'],
                    ["`''` (texto vazio)", 'texto com algo dentro'],
                    ['`[]`, `()`, `{}`, `set()`', 'coleção com itens'],
                    ['`None`, `False`', '`True`'],
                ),
                code('Exemplos', py`
nome = input('Nome: ').strip()
if not nome:
    print('Você não digitou nada!')

carrinho = []
if carrinho:
    print('Finalizar compra')
else:
    print('Carrinho vazio')
`),
            ],
        },
        {
            id: 'match-case',
            title: 'match-case',
            level: B,
            tags: ['switch', 'case', 'menu', 'opções', 'escolha', 'padrão', 'guarda', '3.10'],
            summary: 'Compara uma variável com vários valores possíveis. É um jeito limpo de escrever vários `if x == ...`. Precisa do Python 3.10 ou mais novo.',
            blocks: [
                code('Menu de opções', py`
opcao = input('Escolha 1, 2 ou 3: ')

match opcao:
    case '1':
        print('Novo jogo')
    case '2':
        print('Carregar jogo')
    case '3':
        print('Sair')
    case _:
        print('Opção inválida')
`),
                warn("Os cases são `'1'`, `'2'`, `'3'` COM aspas porque `input()` devolve texto."),
                code('Vários valores no mesmo case', py`
dia = 'sábado'

match dia:
    case 'sábado' | 'domingo':      # o | quer dizer OU
        print('Fim de semana!')
    case _:
        print('Dia útil')
`, py`
Fim de semana!
`),
                code('Case com condição extra (guarda)', py`
nota = 8.5

match nota:
    case n if n >= 9:
        print('Excelente')
    case n if n >= 7:
        print('Aprovado')
    case _:
        print('Reprovado')
`, py`
Aprovado
`),
                code('Desmontando tuplas', py`
ponto = (0, 5)

match ponto:
    case (0, 0):
        print('Origem')
    case (0, y):
        print(f'No eixo Y, em {y}')
    case (x, 0):
        print(f'No eixo X, em {x}')
    case (x, y):
        print(f'Em ({x}, {y})')
`, py`
No eixo Y, em 5
`),
                tip('`case _` funciona como o `else`: pega tudo que não bateu com os cases de cima.'),
                when('match-case: comparar UMA variável com valores exatos (menus, comandos, códigos). if-elif: faixas (`>`, `<`) ou condições diferentes juntas.'),
            ],
        },
    ],
},

/* =============================================================================
 * 7. REPETIÇÃO
 * ============================================================================= */
{
    id: 'repeticao',
    icon: '🔁',
    title: 'Repetição (loops)',
    description: 'Repetir um bloco de código sem precisar escrever de novo.',
    topics: [
        {
            id: 'for',
            title: 'for e range',
            level: B,
            tags: ['laço', 'loop', 'repetir', 'percorrer', 'iterar', 'tabuada', 'acumulador', 'contador'],
            summary: 'Repete o bloco PARA CADA item de uma coleção, ou um número certo de vezes com `range()`.',
            blocks: [
                code('Percorrendo uma coleção', py`
frutas = ['maçã', 'banana', 'uva']
for fruta in frutas:
    print(fruta)

for letra in 'Oi!':
    print(letra)
`, py`
maçã
banana
uva
O
i
!
`),
                table(['range', 'Gera'],
                    ['`range(5)`', '0, 1, 2, 3, 4'],
                    ['`range(1, 6)`', '1, 2, 3, 4, 5'],
                    ['`range(0, 10, 2)`', '0, 2, 4, 6, 8'],
                    ['`range(5, 0, -1)`', '5, 4, 3, 2, 1'],
                ),
                code('Repetindo N vezes', py`
for i in range(1, 6):
    print(f'{i} x 7 = {i * 7}')
`, py`
1 x 7 = 7
2 x 7 = 14
3 x 7 = 21
4 x 7 = 28
5 x 7 = 35
`),
                code('Acumulando valores', py`
numeros = [4, 8, 15, 16, 23, 42]
soma = 0
pares = 0
for n in numeros:
    soma += n
    if n % 2 == 0:
        pares += 1
print(f'Soma: {soma}, pares: {pares}')
`, py`
Soma: 108, pares: 4
`),
                tip('O `range` para ANTES do número final: `range(1, 6)` vai até 5.'),
                when('Quando você sabe quantas vezes vai repetir, ou quando vai percorrer uma coleção.'),
            ],
        },
        {
            id: 'while',
            title: 'while',
            level: B,
            tags: ['enquanto', 'laço', 'loop', 'repetir até', 'validar entrada', 'loop infinito'],
            summary: 'Repete o bloco ENQUANTO a condição for verdadeira.',
            blocks: [
                code('Contador', py`
contador = 1
while contador <= 3:
    print(contador)
    contador += 1
`, py`
1
2
3
`),
                code('Repetir até acertar', py`
senha = ''
while senha != 'python':
    senha = input('Digite a senha: ')
print('Acesso liberado!')
`),
                code('Validando o que o usuário digitou', py`
idade = int(input('Idade: '))
while idade < 0 or idade > 120:
    print('Idade inválida!')
    idade = int(input('Idade: '))
`),
                warn('Se a condição nunca virar `False`, o loop nunca para (loop infinito). Para interromper no terminal, aperte `Ctrl + C`.'),
                when('Quando você NÃO sabe quantas vezes vai repetir: depende do usuário ou de algo acontecer.'),
            ],
        },
        {
            id: 'break-continue',
            title: 'break, continue e else no loop',
            level: B,
            tags: ['parar', 'sair do loop', 'pular', 'interromper', 'menu', 'while true'],
            summary: 'Controlam o loop por dentro: sair na hora ou pular para a próxima volta.',
            blocks: [
                list(
                    '`break`: sai do loop na hora',
                    '`continue`: pula o resto desta volta e vai para a próxima',
                    '`else` no loop: roda se o loop terminou SEM passar por um `break`',
                ),
                code('break e continue', py`
for n in range(1, 10):
    if n == 3:
        continue      # pula o 3
    if n == 6:
        break         # para no 6
    print(n)
`, py`
1
2
4
5
`),
                code('Menu que repete até escolher sair', py`
while True:
    opcao = input('1-Jogar  2-Sair: ')
    if opcao == '2':
        break
    print('Jogando...')
print('Até mais!')
`),
                code('for com else', py`
numeros = [3, 7, 9]
for n in numeros:
    if n % 2 == 0:
        print('Achei um par:', n)
        break
else:
    print('Nenhum número par')
`, py`
Nenhum número par
`),
            ],
        },
        {
            id: 'enumerate-zip',
            title: 'enumerate e zip',
            level: I,
            tags: ['posição', 'índice', 'contador', 'duas listas', 'juntar', 'paralelo'],
            summary: '`enumerate` dá a posição junto com o valor. `zip` percorre duas ou mais coleções ao mesmo tempo.',
            blocks: [
                code('enumerate: posição + valor', py`
frutas = ['maçã', 'banana', 'uva']
for i, fruta in enumerate(frutas, start=1):
    print(f'{i}. {fruta}')
`, py`
1. maçã
2. banana
3. uva
`),
                code('zip: duas listas juntas', py`
nomes = ['Ana', 'Beto', 'Caio']
notas = [9.0, 7.5, 6.0]
for nome, nota in zip(nomes, notas):
    print(f'{nome}: {nota}')

boletim = dict(zip(nomes, notas))
print(boletim)
`, py`
Ana: 9.0
Beto: 7.5
Caio: 6.0
{'Ana': 9.0, 'Beto': 7.5, 'Caio': 6.0}
`),
                tip('O `zip` para quando a menor coleção acaba.'),
            ],
        },
        {
            id: 'loops-aninhados',
            title: 'Loops dentro de loops',
            level: I,
            tags: ['aninhado', 'nested', 'matriz', 'tabela', 'linha e coluna'],
            summary: 'Para cada volta do loop de fora, o loop de dentro roda inteiro.',
            blocks: [
                code('Tabela de multiplicação', py`
for i in range(1, 4):
    for j in range(1, 4):
        print(f'{i * j:3}', end='')
    print()        # pula linha no fim de cada linha
`, py`
  1  2  3
  2  4  6
  3  6  9
`),
            ],
        },
    ],
},

/* =============================================================================
 * 8. FUNÇÕES
 * ============================================================================= */
{
    id: 'funcoes',
    icon: '🧩',
    title: 'Funções',
    description: 'Blocos de código com nome, que você escreve uma vez e usa quantas vezes quiser.',
    topics: [
        {
            id: 'funcoes-basico',
            title: 'Criando funções e return',
            level: B,
            tags: ['def', 'return', 'retorno', 'chamar', 'parâmetro', 'argumento', 'print ou return'],
            summary: '`def` cria a função. `return` devolve um valor para quem chamou.',
            blocks: [
                code('Sintaxe', py`
def nome_da_funcao(parametro1, parametro2):
    # o que a função faz
    return resultado      # opcional: devolve um valor

nome_da_funcao(valor1, valor2)   # chamando (usando) a função
`),
                code('Sem retorno e com retorno', py`
def saudar(nome):
    print(f'Olá, {nome}!')

def somar(a, b):
    return a + b

saudar('Ana')
resultado = somar(3, 4)
print(resultado)
print(somar(10, 5) * 2)
`, py`
Olá, Ana!
7
30
`),
                code('Devolvendo vários valores', py`
def estatisticas(numeros):
    return min(numeros), max(numeros), sum(numeros) / len(numeros)

menor, maior, media = estatisticas([4, 8, 6])
print(menor, maior, media)
`, py`
4 8 6.0
`),
                tip('**print ou return?** `print` só mostra na tela. `return` devolve o valor para quem chamou, que pode guardar, fazer contas ou usar num if. Quando o Python chega no `return`, a função termina ali.'),
                warn('A função precisa ser criada (`def`) antes de ser chamada. E uma função sem `return` devolve `None`.'),
                when('Sempre que você copiar e colar o mesmo código, ou quando um pedaço do programa tem uma tarefa clara: calcular média, validar senha, mostrar menu.'),
            ],
        },
        {
            id: 'parametros',
            title: 'Parâmetros com valor padrão e nomeados',
            level: B,
            tags: ['default', 'padrão', 'opcional', 'argumento nomeado', 'keyword'],
            summary: 'Parâmetros podem ter um valor padrão (ficam opcionais) e podem ser passados pelo nome, em qualquer ordem.',
            blocks: [
                code('Exemplos', py`
def calcular_preco(valor, desconto=0, frete=10):
    return valor - valor * desconto / 100 + frete

print(calcular_preco(100))                  # usa os padrões
print(calcular_preco(100, 10))              # desconto = 10
print(calcular_preco(100, frete=0))         # pula o desconto
print(calcular_preco(frete=5, valor=50))    # pelo nome: ordem livre
`, py`
110.0
100.0
100.0
55.0
`),
                warn('Parâmetros com valor padrão vêm depois dos obrigatórios. E nunca use lista ou dicionário como padrão (`def f(x=[])`): use `None` e crie a lista dentro da função.'),
            ],
        },
        {
            id: 'args-kwargs',
            title: '*args e **kwargs',
            level: I,
            tags: ['args', 'kwargs', 'quantidade variável', 'vários argumentos', 'asterisco'],
            summary: 'Permitem que a função receba quantos argumentos quiser.',
            blocks: [
                code('Recebendo vários argumentos', py`
def somar_tudo(*numeros):           # recebe quantos quiser (tupla)
    return sum(numeros)

def ficha(**dados):                 # recebe pares nome=valor (dict)
    for chave, valor in dados.items():
        print(f'{chave}: {valor}')

print(somar_tudo(1, 2, 3, 4))
ficha(nome='Ana', idade=17)
`, py`
10
nome: Ana
idade: 17
`),
                code('Espalhando uma coleção nos argumentos', py`
def area(base, altura):
    return base * altura

medidas = [3, 4]
print(area(*medidas))                       # area(3, 4)
print(area(**{'base': 2, 'altura': 5}))     # area(base=2, altura=5)
`, py`
12
10
`),
            ],
        },
        {
            id: 'escopo',
            title: 'Escopo de variáveis',
            level: I,
            tags: ['global', 'local', 'escopo', 'variável dentro da função'],
            summary: 'Variáveis criadas dentro de uma função só existem lá dentro.',
            blocks: [
                code('Local e global', py`
total = 0                    # global: existe no programa todo

def adicionar(valor):
    resultado = valor * 2    # local: só existe dentro da função
    return resultado

total = adicionar(5)
print(total)
# print(resultado)  ->  NameError: só existia dentro da função
`, py`
10
`),
                tip('Prefira receber valores por parâmetro e devolver com `return` em vez de mexer em variáveis globais com `global`. O código fica mais fácil de testar e entender.'),
            ],
        },
        {
            id: 'lambda',
            title: 'Funções lambda',
            level: I,
            tags: ['função anônima', 'key', 'sort', 'ordenar por'],
            summary: 'Uma função pequena, sem nome, escrita em uma linha.',
            blocks: [
                code('Exemplos', py`
dobro = lambda x: x * 2
print(dobro(5))

alunos = [('Ana', 9.0), ('Beto', 7.5), ('Caio', 8.0)]
alunos.sort(key=lambda aluno: aluno[1], reverse=True)
print(alunos)
`, py`
10
[('Ana', 9.0), ('Caio', 8.0), ('Beto', 7.5)]
`),
                when('Funções de uma linha usadas uma vez só, principalmente como `key` em `sort`, `sorted`, `max` e `min`.'),
            ],
        },
        {
            id: 'type-hints',
            title: 'Type hints e docstrings',
            level: I,
            tags: ['tipagem', 'anotação', 'documentação', 'docstring', '->'],
            summary: 'Indicam os tipos esperados e documentam o que a função faz.',
            blocks: [
                code('Exemplo', py`
def calcular_media(notas: list[float]) -> float:
    '''Recebe uma lista de notas e devolve a média.'''
    return sum(notas) / len(notas)

print(calcular_media([7.0, 8.0, 9.0]))
print(calcular_media.__doc__)
`, py`
8.0
Recebe uma lista de notas e devolve a média.
`),
                tip('Type hints (`: float`, `-> float`) não mudam como o código roda. Eles servem de documentação e ajudam o editor a apontar erros.'),
            ],
        },
        {
            id: 'recursao',
            title: 'Recursão',
            level: I,
            tags: ['recursiva', 'fatorial', 'caso base', 'função que chama ela mesma'],
            summary: 'Uma função que chama a si mesma, resolvendo um problema em pedaços menores.',
            blocks: [
                code('Fatorial', py`
def fatorial(n):
    if n <= 1:          # caso base: onde a recursão para
        return 1
    return n * fatorial(n - 1)

print(fatorial(5))
`, py`
120
`),
                warn('Toda função recursiva precisa de um caso base. Sem ele, dá `RecursionError`.'),
            ],
        },
    ],
},

/* =============================================================================
 * 9. RECURSOS ÚTEIS
 * ============================================================================= */
{
    id: 'recursos',
    icon: '✨',
    title: 'Recursos úteis',
    description: 'Funções prontas e atalhos que deixam o código mais curto e limpo.',
    topics: [
        {
            id: 'embutidas',
            title: 'Funções embutidas mais úteis',
            level: B,
            tags: ['built-in', 'len', 'sum', 'min', 'max', 'sorted', 'reversed', 'abs', 'round', 'any', 'all', 'range'],
            summary: 'Funções que já vêm no Python, sem precisar importar nada.',
            blocks: [
                table(['Função', 'Faz', 'Exemplo → resultado'],
                    ['`len(x)`', 'tamanho', '`len([1, 2, 3])` → `3`'],
                    ['`sum(x)`', 'soma', '`sum([1, 2, 3])` → `6`'],
                    ['`min(x)` / `max(x)`', 'menor / maior', '`max([4, 9, 2])` → `9`'],
                    ['`sorted(x)`', 'cópia ordenada', '`sorted([3, 1, 2])` → `[1, 2, 3]`'],
                    ['`reversed(x)`', 'de trás para frente', '`list(reversed([1, 2]))` → `[2, 1]`'],
                    ['`abs(x)`', 'valor absoluto', '`abs(-5)` → `5`'],
                    ['`round(x, n)`', 'arredonda', '`round(3.14159, 2)` → `3.14`'],
                    ['`any(x)`', 'algum é True?', '`any([False, True])` → `True`'],
                    ['`all(x)`', 'todos são True?', '`all([True, False])` → `False`'],
                ),
                code('sorted, min e max com key', py`
palavras = ['banana', 'kiwi', 'abacaxi']
print(sorted(palavras))              # ordem alfabética
print(sorted(palavras, key=len))     # pelo tamanho
print(max(palavras, key=len))        # a mais longa
`, py`
['abacaxi', 'banana', 'kiwi']
['kiwi', 'banana', 'abacaxi']
abacaxi
`),
            ],
        },
        {
            id: 'comprehension',
            title: 'List comprehension',
            level: I,
            tags: ['compreensão de lista', 'dict comprehension', 'set comprehension', 'lista em uma linha', 'filtrar'],
            summary: 'Um jeito curto de criar uma coleção a partir de outra, em uma linha.',
            blocks: [
                code('Do jeito longo para o curto', py`
# jeito longo
quadrados = []
for n in range(1, 6):
    quadrados.append(n ** 2)

# com list comprehension
quadrados = [n ** 2 for n in range(1, 6)]
print(quadrados)
`, py`
[1, 4, 9, 16, 25]
`),
                code('Com filtro (if) e com if/else', py`
numeros = [1, 2, 3, 4, 5, 6]
pares = [n for n in numeros if n % 2 == 0]
rotulos = ['par' if n % 2 == 0 else 'ímpar' for n in numeros]
print(pares)
print(rotulos)
`, py`
[2, 4, 6]
['ímpar', 'par', 'ímpar', 'par', 'ímpar', 'par']
`),
                code('Dict e set comprehension', py`
nomes = ['ana', 'beto', 'caio']
tamanhos = {nome: len(nome) for nome in nomes}
iniciais = {nome[0].upper() for nome in nomes}
print(tamanhos)
print(sorted(iniciais))
`, py`
{'ana': 3, 'beto': 4, 'caio': 4}
['A', 'B', 'C']
`),
                tip('Leia assim: `[o que guardar for item in coleção if condição]`. Se ficar grande demais, volte para o for normal.'),
            ],
        },
        {
            id: 'map-filter',
            title: 'map e filter',
            level: I,
            tags: ['aplicar função', 'filtrar', 'transformar lista', 'ler vários números'],
            summary: '`map` aplica uma função em cada item. `filter` mantém só os itens que passam num teste.',
            blocks: [
                code('Exemplos', py`
textos = ['1', '2', '3']
numeros = list(map(int, textos))

precos = [10.0, 25.5, 8.0]
baratos = list(filter(lambda p: p < 20, precos))

print(numeros, baratos)
`, py`
[1, 2, 3] [10.0, 8.0]
`),
                tip('Truque muito usado: `a, b = map(int, input().split())` lê dois números digitados na mesma linha.'),
                tip('Na maioria dos casos, list comprehension fica mais legível: `[p for p in precos if p < 20]`.'),
            ],
        },
        {
            id: 'geradores',
            title: 'Geradores e yield',
            level: I,
            tags: ['generator', 'yield', 'memória', 'preguiçoso', 'lazy'],
            summary: 'Funções que entregam um valor de cada vez, sem guardar tudo na memória.',
            blocks: [
                code('Exemplo', py`
def contagem_regressiva(n):
    while n > 0:
        yield n        # entrega um valor e pausa aqui
        n -= 1

for numero in contagem_regressiva(3):
    print(numero)

total = sum(x ** 2 for x in range(1_000_000))   # não cria a lista inteira
`, py`
3
2
1
`),
                when('Quando há muitos dados e você quer processar um de cada vez. Por exemplo, ler um arquivo enorme linha por linha.'),
            ],
        },
    ],
},

/* =============================================================================
 * 10. MÓDULOS E PACOTES
 * ============================================================================= */
{
    id: 'modulos',
    icon: '📚',
    title: 'Módulos e pacotes',
    description: 'Reaproveitar código pronto, seu ou de outras pessoas.',
    topics: [
        {
            id: 'import',
            title: 'Importando módulos',
            level: B,
            tags: ['import', 'from', 'as', 'biblioteca', 'math', 'random'],
            summary: 'Um módulo é um arquivo com código pronto. Você traz para o seu programa com `import`.',
            blocks: [
                code('Formas de importar', py`
import math
from random import randint, choice
import datetime as dt

print(math.sqrt(16))
print(randint(1, 6))                         # número aleatório de 1 a 6
print(choice(['pedra', 'papel', 'tesoura']))
print(dt.date.today())
`),
                table(['Forma', 'Como usa'],
                    ['`import math`', '`math.sqrt(9)`'],
                    ['`from math import sqrt`', '`sqrt(9)`'],
                    ['`import math as m`', '`m.sqrt(9)`'],
                    ['`from math import *`', 'evite: não dá para saber de onde veio cada nome'],
                ),
            ],
        },
        {
            id: 'modulos-uteis',
            title: 'Módulos úteis: math, random e datetime',
            level: I,
            tags: ['math', 'random', 'datetime', 'data', 'hora', 'sortear', 'aleatório', 'strftime', 'timedelta', 'raiz'],
            summary: 'Alguns módulos da biblioteca padrão que aparecem o tempo todo.',
            blocks: [
                code('math', py`
import math

print(math.ceil(4.1), math.floor(4.9))   # arredonda para cima / para baixo
print(math.sqrt(81), math.pi)
`, py`
5 4
9.0 3.141592653589793
`),
                code('random', py`
import random

print(random.randint(1, 100))       # inteiro de 1 a 100
print(random.random())              # decimal entre 0 e 1
lista = [1, 2, 3, 4, 5]
random.shuffle(lista)               # embaralha a própria lista
print(random.sample(lista, 2))      # sorteia 2 sem repetir
`),
                code('datetime: datas e horas', py`
from datetime import datetime, date, timedelta

agora = datetime.now()
print(agora.strftime('%d/%m/%Y %H:%M'))     # padrão brasileiro

nascimento = date(2008, 5, 20)
hoje = date.today()
print((hoje - nascimento).days, 'dias de vida')

vencimento = hoje + timedelta(days=30)
natal = datetime.strptime('25/12/2026', '%d/%m/%Y')   # texto -> data
`),
                list(
                    '`%d` dia, `%m` mês, `%Y` ano com 4 dígitos',
                    '`%H` hora (0 a 23), `%M` minuto, `%S` segundo',
                    '`strftime`: data → texto. `strptime`: texto → data',
                ),
            ],
        },
        {
            id: 'criar-modulo',
            title: 'Criando seu próprio módulo e __name__',
            level: I,
            tags: ['módulo próprio', '__main__', '__name__', 'organizar arquivos', 'importar arquivo'],
            summary: 'Qualquer arquivo .py pode ser importado por outro arquivo da mesma pasta.',
            blocks: [
                code('Arquivo: calculos.py', py`
def somar(a, b):
    return a + b

if __name__ == '__main__':
    # só roda quando você executa ESTE arquivo diretamente
    print(somar(2, 3))
`),
                code('Arquivo: main.py (na mesma pasta)', py`
import calculos
from calculos import somar

print(calculos.somar(1, 1))
print(somar(5, 5))
`),
                tip("O bloco `if __name__ == '__main__':` evita que os testes e prints do módulo rodem quando ele é importado por outro arquivo."),
                warn('Não dê ao seu arquivo o nome de um módulo do Python (`random.py`, `math.py`). Senão o `import` pega o seu arquivo no lugar do original.'),
            ],
        },
        {
            id: 'pip-venv',
            title: 'pip e ambiente virtual (venv)',
            level: I,
            tags: ['pip', 'venv', 'instalar pacote', 'requirements', 'ambiente virtual', 'biblioteca externa'],
            summary: '`pip` instala bibliotecas de outras pessoas. O ambiente virtual deixa cada projeto com as suas.',
            blocks: [
                bash('Criar e ativar um ambiente virtual', py`
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux / macOS
source .venv/bin/activate
`),
                bash('Instalar pacotes', py`
pip install requests
pip install -r requirements.txt     # instala tudo de uma lista
pip freeze > requirements.txt       # salva a lista do projeto
pip list                            # mostra o que está instalado
`),
                tip('Um ambiente virtual por projeto evita conflito de versões entre projetos diferentes.'),
            ],
        },
    ],
},

/* =============================================================================
 * 11. EXCEÇÕES
 * ============================================================================= */
{
    id: 'excecoes',
    icon: '🛟',
    title: 'Exceções',
    description: 'Tratar erros para o programa não quebrar quando algo dá errado.',
    topics: [
        {
            id: 'try-except',
            title: 'try e except',
            level: B,
            tags: ['tratar erro', 'exceção', 'exception', 'erro', 'valueerror', 'zerodivisionerror', 'tente'],
            summary: 'O código que pode dar erro vai no `try`. Se der erro, o Python pula para o `except` em vez de encerrar o programa.',
            blocks: [
                code('Sintaxe', py`
try:
    # código que pode dar erro
    ...
except TipoDoErro:
    # o que fazer se der esse erro
    ...
`),
                code('Lendo um número com segurança', py`
try:
    idade = int(input('Idade: '))
    print(f'Ano que vem você terá {idade + 1}')
except ValueError:
    print('Digite apenas números!')
`),
                code('Repetir até digitar certo', py`
while True:
    try:
        numero = float(input('Digite um número: '))
        break
    except ValueError:
        print('Valor inválido, tente de novo.')

print(f'Você digitou {numero}')
`),
                code('Vários tipos de erro', py`
try:
    a = int(input('A: '))
    b = int(input('B: '))
    print(a / b)
except ValueError:
    print('Digite números inteiros.')
except ZeroDivisionError:
    print('Não dá para dividir por zero.')
except Exception as erro:
    print(f'Erro inesperado: {erro}')
`),
                warn('Evite `except:` sozinho, sem o tipo do erro. Ele esconde qualquer problema, inclusive bugs seus. Capture os erros que você espera.'),
            ],
        },
        {
            id: 'else-finally',
            title: 'else e finally',
            level: I,
            tags: ['finally', 'else', 'sempre executa', 'limpeza'],
            summary: '`else` roda se NÃO deu erro. `finally` roda sempre, com ou sem erro.',
            blocks: [
                code('Exemplo', py`
try:
    numero = int('42')
except ValueError:
    print('Não é número')
else:
    print('Deu certo:', numero)      # roda se NÃO deu erro
finally:
    print('Sempre roda')             # roda com ou sem erro
`, py`
Deu certo: 42
Sempre roda
`),
                when('`finally` serve para "arrumar a casa": fechar conexões, mostrar uma mensagem final. Com arquivos, o `with` já faz isso por você.'),
            ],
        },
        {
            id: 'excecoes-comuns',
            title: 'Exceções mais comuns',
            level: B,
            tags: ['valueerror', 'typeerror', 'indexerror', 'keyerror', 'nameerror', 'attributeerror', 'filenotfounderror', 'modulenotfounderror', 'lista de erros'],
            summary: 'Os erros que mais aparecem e o que cada um quer dizer.',
            blocks: [
                table(['Exceção', 'Quando acontece', 'Exemplo'],
                    ['`ValueError`', 'valor com formato errado', "`int('abc')`"],
                    ['`TypeError`', 'tipo errado na operação', "`'Idade: ' + 18`"],
                    ['`ZeroDivisionError`', 'divisão por zero', '`10 / 0`'],
                    ['`IndexError`', 'posição não existe na lista', '`[1, 2][5]`'],
                    ['`KeyError`', 'chave não existe no dicionário', "`{'a': 1}['b']`"],
                    ['`NameError`', 'variável não existe (ou nome errado)', '`print(nmoe)`'],
                    ['`AttributeError`', 'o objeto não tem esse método', "`'oi'.append('!')`"],
                    ['`FileNotFoundError`', 'arquivo não encontrado', "`open('nao_existe.txt')`"],
                    ['`ModuleNotFoundError`', 'módulo não instalado ou nome errado', '`import requets`'],
                    ['`IndentationError`', 'recuo errado', 'bloco sem os 4 espaços'],
                    ['`SyntaxError`', 'código escrito errado', 'faltou `:`, `)` ou aspas'],
                ),
                tip('Leia a mensagem de erro de baixo para cima: a última linha diz QUAL é o erro, e as linhas de cima mostram ONDE ele aconteceu.'),
            ],
        },
        {
            id: 'raise',
            title: 'Lançando erros com raise',
            level: I,
            tags: ['raise', 'lançar', 'gerar erro', 'validação'],
            summary: 'Você também pode gerar um erro de propósito quando algo não está certo.',
            blocks: [
                code('Exemplo', py`
def sacar(saldo, valor):
    if valor <= 0:
        raise ValueError('O valor do saque deve ser positivo')
    if valor > saldo:
        raise ValueError('Saldo insuficiente')
    return saldo - valor

try:
    sacar(100, 500)
except ValueError as erro:
    print(f'Não foi possível sacar: {erro}')
`, py`
Não foi possível sacar: Saldo insuficiente
`),
            ],
        },
        {
            id: 'excecao-personalizada',
            title: 'Criando suas próprias exceções',
            level: I,
            tags: ['exceção personalizada', 'custom exception', 'herdar exception', 'classe de erro'],
            summary: 'Uma classe que herda de `Exception` vira um novo tipo de erro.',
            blocks: [
                code('Exemplo', py`
class SaldoInsuficienteError(Exception):
    '''Erro para quando não há saldo suficiente.'''

def sacar(saldo, valor):
    if valor > saldo:
        raise SaldoInsuficienteError(f'Faltam R$ {valor - saldo:.2f}')
    return saldo - valor

try:
    sacar(50, 80)
except SaldoInsuficienteError as erro:
    print(erro)
`, py`
Faltam R$ 30.00
`),
                tip('Por convenção, o nome termina em `Error` e a classe herda de `Exception`.'),
            ],
        },
    ],
},

/* =============================================================================
 * 12. ARQUIVOS
 * ============================================================================= */
{
    id: 'arquivos',
    icon: '📁',
    title: 'Arquivos',
    description: 'Ler e gravar arquivos de texto, JSON e CSV, sem problema com acentos.',
    topics: [
        {
            id: 'abrir-arquivos',
            title: 'Abrindo arquivos: open, with e encoding',
            level: B,
            tags: ['open', 'with', 'encoding', 'utf-8', 'modo', 'r', 'w', 'a', 'acentos', 'unicodedecodeerror'],
            summary: 'Use sempre `with open(...)`: ele fecha o arquivo sozinho, mesmo se der erro.',
            blocks: [
                code('Sintaxe', py`
with open('arquivo.txt', 'r', encoding='utf-8') as arquivo:
    conteudo = arquivo.read()
# aqui fora o arquivo já foi fechado
`),
                table(['Modo', 'Faz', 'Se o arquivo não existir'],
                    ["`'r'`", 'ler (é o padrão)', 'dá `FileNotFoundError`'],
                    ["`'w'`", 'escrever (APAGA o conteúdo antigo)', 'cria'],
                    ["`'a'`", 'adicionar no final', 'cria'],
                    ["`'x'`", 'criar um arquivo novo', 'cria (dá erro se já existir)'],
                    ["`'r+'`", 'ler e escrever', 'dá erro'],
                    ["`'rb'` / `'wb'`", 'ler / escrever binário (imagens, PDFs)', 'igual a r / w'],
                ),
                warn("Sempre passe `encoding='utf-8'`. Sem ele, o Windows pode usar outra codificação e os acentos viram `Ã§Ã£o` ou dão `UnicodeDecodeError`."),
            ],
        },
        {
            id: 'ler-texto',
            title: 'Lendo arquivos de texto',
            level: B,
            tags: ['read', 'readlines', 'ler linha', 'splitlines', 'filenotfounderror', 'txt'],
            summary: 'Três formas de ler: tudo de uma vez, linha por linha ou como lista.',
            blocks: [
                code('Formas de ler', py`
# tudo de uma vez, como um texto só
with open('notas.txt', 'r', encoding='utf-8') as arquivo:
    conteudo = arquivo.read()

# linha por linha (melhor para arquivos grandes)
with open('notas.txt', 'r', encoding='utf-8') as arquivo:
    for linha in arquivo:
        print(linha.strip())     # strip() tira o \n do fim

# como lista de linhas
with open('notas.txt', 'r', encoding='utf-8') as arquivo:
    linhas = arquivo.read().splitlines()
`),
                code('Lendo com segurança', py`
try:
    with open('dados.txt', 'r', encoding='utf-8') as arquivo:
        print(arquivo.read())
except FileNotFoundError:
    print('Arquivo não encontrado. Confira o nome e a pasta.')
`),
                tip('O caminho é relativo à pasta de onde o programa é EXECUTADO, e não necessariamente onde o .py está. Na dúvida, use `pathlib` (veja mais abaixo).'),
            ],
        },
        {
            id: 'gravar-texto',
            title: 'Gravando arquivos de texto',
            level: B,
            tags: ['write', 'escrever', 'salvar', 'append', 'adicionar linha', 'txt'],
            summary: "`'w'` cria ou sobrescreve o arquivo. `'a'` adiciona no final sem apagar.",
            blocks: [
                code('Exemplos', py`
# 'w': cria o arquivo ou APAGA o que tinha e escreve do zero
with open('lista.txt', 'w', encoding='utf-8') as arquivo:
    arquivo.write('Primeira linha\n')
    arquivo.write('Segunda linha\n')

# 'a': adiciona no final sem apagar
with open('lista.txt', 'a', encoding='utf-8') as arquivo:
    arquivo.write('Linha nova\n')

# gravando uma lista, um item por linha
frutas = ['maçã', 'banana', 'uva']
with open('frutas.txt', 'w', encoding='utf-8') as arquivo:
    arquivo.write('\n'.join(frutas))
`),
                warn('`write()` não pula linha sozinho: coloque `\\n` no fim. E ele só aceita texto, então use `str()` ou f-string para gravar números.'),
            ],
        },
        {
            id: 'json-gravar',
            title: 'JSON: gravando dados',
            level: B,
            tags: ['json', 'dump', 'salvar dados', 'ensure_ascii', 'indent', 'utf-8', 'acentos', 'persistência'],
            summary: 'JSON é um formato de texto para guardar listas e dicionários. Ótimo para salvar os dados de um programa e carregar depois.',
            blocks: [
                code('Gravando uma lista de dicionários', py`
import json

alunos = [
    {'nome': 'Ana', 'nota': 9.5, 'aprovado': True},
    {'nome': 'João', 'nota': 6.0, 'aprovado': False},
]

with open('alunos.json', 'w', encoding='utf-8') as arquivo:
    json.dump(alunos, arquivo, ensure_ascii=False, indent=4)
`),
                code('Como fica o arquivo alunos.json', py`
[
    {
        "nome": "Ana",
        "nota": 9.5,
        "aprovado": true
    },
    {
        "nome": "João",
        "nota": 6.0,
        "aprovado": false
    }
]
`, null, 'json'),
                list(
                    "`encoding='utf-8'`: grava os acentos corretamente no arquivo",
                    '`ensure_ascii=False`: grava "João" em vez de "Jo\\u00e3o"',
                    '`indent=4`: deixa o arquivo organizado e fácil de ler',
                ),
                tip('Dentro do arquivo JSON as aspas são sempre duplas, é uma regra do formato. No seu código Python continue usando simples: o `json.dump` converte sozinho.'),
                table(['Python', 'JSON'],
                    ['`dict`', 'objeto `{}`'],
                    ['`list`, `tuple`', 'lista `[]`'],
                    ['`str`', 'texto `""`'],
                    ['`int`, `float`', 'número'],
                    ['`True` / `False`', '`true` / `false`'],
                    ['`None`', '`null`'],
                ),
                warn('JSON não guarda `set`, datas nem objetos de classe direto. Converta antes: `list(meu_set)`, `data.isoformat()`, `vars(objeto)`.'),
            ],
        },
        {
            id: 'json-ler',
            title: 'JSON: lendo dados',
            level: B,
            tags: ['json', 'load', 'loads', 'dumps', 'carregar', 'ler json', 'jsondecodeerror', 'string json'],
            summary: '`json.load` lê o arquivo e devolve listas e dicionários do Python, prontos para usar.',
            blocks: [
                code('Lendo o arquivo', py`
import json

with open('alunos.json', 'r', encoding='utf-8') as arquivo:
    alunos = json.load(arquivo)

for aluno in alunos:
    print(f'{aluno["nome"]}: {aluno["nota"]}')
`, py`
Ana: 9.5
João: 6.0
`),
                tip('Dentro da f-string, a chave do dicionário vai com aspas duplas porque a f-string já usa as simples. Repetir o mesmo tipo de aspas lá dentro só funciona a partir do Python 3.12.'),
                code('Carregar ou criar (padrão muito usado)', py`
import json
from pathlib import Path

ARQUIVO = Path('dados.json')

def carregar():
    if ARQUIVO.exists():
        with open(ARQUIVO, 'r', encoding='utf-8') as arquivo:
            return json.load(arquivo)
    return {'tarefas': []}          # valor inicial se ainda não existe

def salvar(dados):
    with open(ARQUIVO, 'w', encoding='utf-8') as arquivo:
        json.dump(dados, arquivo, ensure_ascii=False, indent=4)

dados = carregar()
dados['tarefas'].append('Estudar Python')
salvar(dados)
`),
                code('JSON dentro de uma string: loads e dumps', py`
import json

texto = '{"nome": "Ana", "idade": 17}'
dados = json.loads(texto)                          # texto -> dict
print(dados['nome'])

de_volta = json.dumps(dados, ensure_ascii=False)   # dict -> texto
print(de_volta)
`, py`
Ana
{"nome": "Ana", "idade": 17}
`),
                tip('Com **s** no fim (`loads`, `dumps`) trabalha com **s**tring. Sem o s (`load`, `dump`) trabalha com arquivo.'),
                warn('Se o arquivo JSON estiver mal formatado, `json.load` dá `json.JSONDecodeError`. Trate com try/except se o arquivo puder ser editado à mão.'),
            ],
        },
        {
            id: 'csv',
            title: 'CSV: planilhas simples',
            level: I,
            tags: ['csv', 'planilha', 'excel', 'writer', 'reader', 'dictreader', 'newline', 'delimiter', 'utf-8-sig'],
            summary: 'CSV é uma tabela em texto, com valores separados por vírgula. Abre no Excel.',
            blocks: [
                code('Gravando', py`
import csv

alunos = [['nome', 'nota'], ['Ana', 9.5], ['João', 6.0]]

with open('alunos.csv', 'w', encoding='utf-8', newline='') as arquivo:
    escritor = csv.writer(arquivo)
    escritor.writerows(alunos)
`),
                code('Lendo como dicionários', py`
import csv

with open('alunos.csv', 'r', encoding='utf-8', newline='') as arquivo:
    for linha in csv.DictReader(arquivo):
        print(linha['nome'], float(linha['nota']))
`, py`
Ana 9.5
João 6.0
`),
                warn("Use `newline=''` com CSV, senão aparecem linhas em branco extras no Windows. Tudo que vem do CSV é texto: converta números com `float()` ou `int()`."),
                tip("Para abrir certinho no Excel em português, use `delimiter=';'` e `encoding='utf-8-sig'`."),
            ],
        },
        {
            id: 'pathlib',
            title: 'Caminhos e pastas com pathlib',
            level: I,
            tags: ['pathlib', 'path', 'pasta', 'diretório', 'caminho', 'mkdir', 'exists', 'glob', '__file__'],
            summary: 'O jeito moderno de lidar com caminhos, pastas e arquivos.',
            blocks: [
                code('Exemplos', py`
from pathlib import Path

pasta = Path('dados')
pasta.mkdir(exist_ok=True)               # cria a pasta se não existir

arquivo = pasta / 'notas.txt'            # junta caminhos com /
arquivo.write_text('Ana;9.5\n', encoding='utf-8')
print(arquivo.read_text(encoding='utf-8').strip())

print(arquivo.exists())                  # existe?
print(arquivo.name, arquivo.suffix)      # nome e extensão
for item in pasta.glob('*.txt'):         # lista os arquivos .txt
    print(item)
`),
                tip("`Path(__file__).parent / 'dados.json'` encontra o arquivo ao lado do seu .py, não importa de onde o programa foi executado."),
            ],
        },
    ],
},

/* =============================================================================
 * 13. ORIENTAÇÃO A OBJETOS
 * ============================================================================= */
{
    id: 'poo',
    icon: '🏗️',
    title: 'Orientação a Objetos',
    description: 'POO: organizar o código em classes, moldes que juntam dados e comportamentos.',
    topics: [
        {
            id: 'classes-objetos',
            title: 'Classes e objetos',
            level: B,
            tags: ['class', 'objeto', 'instância', '__init__', 'self', 'construtor', 'atributo', 'método', 'poo', 'oop'],
            summary: 'A classe é o molde (a planta da casa). O objeto é o que você constrói com ela (cada casa). Cada objeto tem os seus próprios dados.',
            blocks: [
                code('Primeira classe', py`
class Cachorro:
    def __init__(self, nome, raca):    # roda ao criar o objeto
        self.nome = nome               # atributos: dados do objeto
        self.raca = raca

    def latir(self):                   # método: ação do objeto
        print(f'{self.nome} diz: Au au!')

rex = Cachorro('Rex', 'Vira-lata')     # criando objetos
bob = Cachorro('Bob', 'Poodle')

rex.latir()
print(bob.nome, bob.raca)
`, py`
Rex diz: Au au!
Bob Poodle
`),
                list(
                    '**Classe**: o molde. Nome em PascalCase: `ContaBancaria`',
                    '**Objeto** (ou instância): algo criado a partir da classe, como `rex`',
                    '**Atributo**: um dado do objeto, como `self.nome`',
                    '**Método**: uma função dentro da classe, como `latir()`',
                    '**`__init__`**: o construtor, roda sozinho quando o objeto é criado',
                    '**`self`**: o próprio objeto. Todo método recebe `self` como primeiro parâmetro',
                ),
                warn('Esqueceu o `self` no método? Dá `TypeError: ... takes 0 positional arguments but 1 was given`.'),
            ],
        },
        {
            id: 'atributos-metodos',
            title: 'Atributos e métodos na prática',
            level: B,
            tags: ['conta bancária', 'depositar', 'sacar', 'exemplo completo', 'estado do objeto'],
            summary: 'Um exemplo completo: os métodos leem e alteram os atributos do próprio objeto.',
            blocks: [
                code('Conta bancária', py`
class ContaBancaria:
    def __init__(self, titular, saldo=0):
        self.titular = titular
        self.saldo = saldo

    def depositar(self, valor):
        self.saldo += valor

    def sacar(self, valor):
        if valor > self.saldo:
            print('Saldo insuficiente')
            return False
        self.saldo -= valor
        return True

    def extrato(self):
        return f'{self.titular}: R$ {self.saldo:.2f}'

conta = ContaBancaria('Ana', 100)
conta.depositar(50)
conta.sacar(500)
conta.sacar(30)
print(conta.extrato())
`, py`
Saldo insuficiente
Ana: R$ 120.00
`),
            ],
        },
        {
            id: 'atributos-classe',
            title: 'Atributos de classe e de instância',
            level: I,
            tags: ['atributo de classe', 'compartilhado', 'contador de objetos', 'static'],
            summary: 'Atributos de classe são compartilhados por todos os objetos. Atributos de instância são de cada objeto.',
            blocks: [
                code('Exemplo', py`
class Aluno:
    escola = 'CNA'          # de classe: compartilhado por todos
    total = 0

    def __init__(self, nome):
        self.nome = nome    # de instância: cada objeto tem o seu
        Aluno.total += 1

a = Aluno('Ana')
b = Aluno('Beto')
print(a.escola, b.escola)
print(Aluno.total)
`, py`
CNA CNA
2
`),
            ],
        },
        {
            id: 'encapsulamento',
            title: 'Encapsulamento e @property',
            level: I,
            tags: ['privado', 'protegido', 'getter', 'setter', 'property', '_', '__', 'validação'],
            summary: 'Proteger os dados do objeto para que só sejam alterados do jeito certo.',
            blocks: [
                list(
                    '`nome`: público, pode usar à vontade',
                    '`_nome`: "protegido", um aviso de "não mexa por fora"',
                    '`__nome`: "privado", o Python dificulta o acesso de fora da classe',
                ),
                code('Validando com @property', py`
class Produto:
    def __init__(self, nome, preco):
        self.nome = nome
        self.preco = preco          # já passa pelo setter abaixo

    @property
    def preco(self):                # getter: produto.preco
        return self._preco

    @preco.setter
    def preco(self, valor):         # setter: produto.preco = 10
        if valor < 0:
            raise ValueError('Preço não pode ser negativo')
        self._preco = valor

p = Produto('Caneta', 2.5)
print(p.preco)
p.preco = 3.0
try:
    p.preco = -1
except ValueError as erro:
    print(erro)
`, py`
2.5
Preço não pode ser negativo
`),
                tip('Com `@property` você usa como se fosse um atributo (`p.preco`), mas por trás roda uma validação.'),
            ],
        },
        {
            id: 'heranca',
            title: 'Herança e super()',
            level: I,
            tags: ['herdar', 'classe pai', 'classe filha', 'super', 'sobrescrever', 'override', 'isinstance'],
            summary: 'Uma classe filha herda tudo da classe pai e pode adicionar ou mudar o que quiser.',
            blocks: [
                code('Exemplo', py`
class Animal:
    def __init__(self, nome):
        self.nome = nome

    def apresentar(self):
        return f'Eu sou {self.nome}'

    def falar(self):
        return '...'

class Gato(Animal):                  # Gato herda de Animal
    def __init__(self, nome, cor):
        super().__init__(nome)       # reaproveita o __init__ do pai
        self.cor = cor

    def falar(self):                 # sobrescreve o método do pai
        return 'Miau'

g = Gato('Mingau', 'branco')
print(g.apresentar())                # herdado de Animal
print(g.falar())                     # versão do Gato
print(isinstance(g, Animal))
`, py`
Eu sou Mingau
Miau
True
`),
                when('Quando uma classe "é um tipo de" outra: Gato é um Animal, ContaPoupanca é uma ContaBancaria. Se a relação for "tem um", use composição.'),
            ],
        },
        {
            id: 'polimorfismo',
            title: 'Polimorfismo',
            level: I,
            tags: ['mesmo método', 'comportamento diferente', 'formas', 'notimplementederror'],
            summary: 'Classes diferentes com o mesmo método, cada uma do seu jeito. Quem usa não precisa saber qual é qual.',
            blocks: [
                code('Exemplo', py`
class Forma:
    def area(self):
        raise NotImplementedError

class Retangulo(Forma):
    def __init__(self, base, altura):
        self.base, self.altura = base, altura

    def area(self):
        return self.base * self.altura

class Circulo(Forma):
    def __init__(self, raio):
        self.raio = raio

    def area(self):
        return 3.14159 * self.raio ** 2

formas = [Retangulo(3, 4), Circulo(1)]
for forma in formas:
    print(f'{type(forma).__name__}: {forma.area():.2f}')
`, py`
Retangulo: 12.00
Circulo: 3.14
`),
            ],
        },
        {
            id: 'composicao',
            title: 'Composição',
            level: I,
            tags: ['tem um', 'objeto dentro de objeto', 'has-a'],
            summary: 'Um objeto que tem outros objetos como atributos.',
            blocks: [
                code('Exemplo', py`
class Motor:
    def ligar(self):
        return 'Motor ligado'

class Carro:
    def __init__(self, modelo):
        self.modelo = modelo
        self.motor = Motor()        # Carro TEM UM Motor

    def ligar(self):
        return f'{self.modelo}: {self.motor.ligar()}'

print(Carro('Fusca').ligar())
`, py`
Fusca: Motor ligado
`),
            ],
        },
        {
            id: 'metodos-especiais',
            title: 'Métodos especiais (dunder)',
            level: I,
            tags: ['__str__', '__repr__', '__eq__', '__add__', '__len__', '__lt__', 'magic methods', 'dunder', 'print objeto'],
            summary: 'Métodos com dois sublinhados de cada lado que o Python chama sozinho em certas situações.',
            blocks: [
                code('Exemplo', py`
class Ponto:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __str__(self):              # usado pelo print()
        return f'({self.x}, {self.y})'

    def __repr__(self):             # usado no console e em listas
        return f'Ponto({self.x}, {self.y})'

    def __eq__(self, outro):        # usado pelo ==
        return self.x == outro.x and self.y == outro.y

    def __add__(self, outro):       # usado pelo +
        return Ponto(self.x + outro.x, self.y + outro.y)

a = Ponto(1, 2)
b = Ponto(3, 4)
print(a)
print(a + b)
print(a == Ponto(1, 2))
print([a, b])
`, py`
(1, 2)
(4, 6)
True
[Ponto(1, 2), Ponto(3, 4)]
`),
                table(['Método', 'É chamado quando'],
                    ['`__init__`', 'o objeto é criado'],
                    ['`__str__`', '`print(obj)` ou `str(obj)`'],
                    ['`__repr__`', 'o objeto aparece no console ou dentro de listas'],
                    ['`__eq__`', '`obj1 == obj2`'],
                    ['`__lt__`', '`obj1 < obj2` (permite usar `sorted`)'],
                    ['`__add__`', '`obj1 + obj2`'],
                    ['`__len__`', '`len(obj)`'],
                ),
            ],
        },
        {
            id: 'classmethod-staticmethod',
            title: '@classmethod e @staticmethod',
            level: I,
            tags: ['classmethod', 'staticmethod', 'cls', 'método de classe', 'método estático', 'construtor alternativo'],
            summary: 'Métodos que não dependem de um objeto específico.',
            blocks: [
                code('Exemplo', py`
class Data:
    def __init__(self, dia, mes, ano):
        self.dia, self.mes, self.ano = dia, mes, ano

    @classmethod
    def de_texto(cls, texto):          # outra forma de criar o objeto
        dia, mes, ano = map(int, texto.split('/'))
        return cls(dia, mes, ano)

    @staticmethod
    def eh_bissexto(ano):              # não usa self nem cls
        return ano % 4 == 0 and (ano % 100 != 0 or ano % 400 == 0)

d = Data.de_texto('25/12/2026')
print(d.dia, d.mes, d.ano)
print(Data.eh_bissexto(2024))
`, py`
25 12 2026
True
`),
                list(
                    '**Método normal**: recebe `self` (o objeto)',
                    '**@classmethod**: recebe `cls` (a classe). Usado para criar objetos de jeitos diferentes',
                    '**@staticmethod**: não recebe nenhum dos dois. É uma função comum que faz sentido ficar dentro da classe',
                ),
            ],
        },
        {
            id: 'abstratas',
            title: 'Classes abstratas',
            level: I,
            tags: ['abc', 'abstractmethod', 'interface', 'contrato', 'abstrata'],
            summary: 'Uma classe que serve só de modelo: obriga as filhas a ter certos métodos.',
            blocks: [
                code('Exemplo', py`
from abc import ABC, abstractmethod

class Pagamento(ABC):
    @abstractmethod
    def pagar(self, valor):
        '''Toda forma de pagamento PRECISA ter este método.'''

class Pix(Pagamento):
    def pagar(self, valor):
        print(f'Pix de R$ {valor:.2f} enviado')

Pix().pagar(50)
# Pagamento()  ->  TypeError: não dá para criar objeto de classe abstrata
`, py`
Pix de R$ 50.00 enviado
`),
            ],
        },
        {
            id: 'dataclass',
            title: '@dataclass',
            level: I,
            tags: ['dataclass', 'classe de dados', 'field', 'default_factory', 'menos código'],
            summary: 'Cria classes de dados sem precisar escrever `__init__`, `__repr__` e `__eq__` na mão.',
            blocks: [
                code('Exemplo', py`
from dataclasses import dataclass, field

@dataclass
class Aluno:
    nome: str
    nota: float = 0.0
    materias: list = field(default_factory=list)

    def aprovado(self):
        return self.nota >= 7

a = Aluno('Ana', 8.5)
print(a)
print(a.aprovado())
print(a == Aluno('Ana', 8.5))
`, py`
Aluno(nome='Ana', nota=8.5, materias=[])
True
True
`),
                when('Classes que servem principalmente para guardar dados: Produto, Aluno, Endereço.'),
            ],
        },
    ],
},

/* =============================================================================
 * 14. ERROS COMUNS E DICAS
 * ============================================================================= */
{
    id: 'ajuda',
    icon: '🩺',
    title: 'Erros comuns e dicas',
    description: 'O que fazer quando o código não funciona.',
    topics: [
        {
            id: 'ler-erro',
            title: 'Como ler uma mensagem de erro',
            level: B,
            tags: ['traceback', 'mensagem de erro', 'linha do erro', 'debug', 'depurar'],
            summary: 'A mensagem de erro diz exatamente o que aconteceu e onde. É só saber ler.',
            blocks: [
                code('Exemplo de erro', py`
Traceback (most recent call last):
  File "main.py", line 3, in <module>
    print('Idade: ' + idade)
TypeError: can only concatenate str (not "int") to str
`, null, 'plaintext'),
                list(
                    '**Última linha**: o tipo do erro e o motivo (`TypeError`: juntou texto com número)',
                    '**`line 3`**: a linha onde o erro aconteceu',
                    '**Trecho mostrado**: o código exato que quebrou',
                ),
                tip('Copie a última linha do erro e pesquise. Quase sempre alguém já teve o mesmo problema.'),
            ],
        },
        {
            id: 'erros-iniciante',
            title: 'Erros clássicos de iniciante',
            level: B,
            tags: ['syntaxerror', 'indentationerror', 'nameerror', 'typeerror', 'loop infinito', 'none', 'problema', 'não funciona'],
            summary: 'Os problemas que mais aparecem e como resolver cada um.',
            blocks: [
                table(['Problema', 'Causa', 'Solução'],
                    ["`SyntaxError: expected ':'`", 'faltou `:` no if, for, def...', 'coloque `:` no fim da linha'],
                    ['`IndentationError`', 'recuo errado', '4 espaços em tudo que está dentro do bloco'],
                    ['`NameError`', 'variável não criada ou nome errado', 'confira a grafia (maiúsculas contam)'],
                    ['`TypeError` com `+`', 'juntou texto com número', "use f-string: `f'Idade: {idade}'`"],
                    ['if com input nunca funciona', '`input()` devolve texto', "converta com `int()` ou compare com `'5'`"],
                    ['`IndexError`', 'a posição não existe', 'uma lista de 3 itens vai de 0 a 2'],
                    ['`KeyError`', 'a chave não existe', 'use `dicionario.get(chave)`'],
                    ['loop infinito', 'a condição do while nunca vira False', 'mude a variável dentro do loop'],
                    ['acentos estranhos no arquivo', 'faltou o encoding', "use `encoding='utf-8'` no open"],
                    ['a função devolve `None`', 'faltou o `return`', 'use `return` em vez de `print`'],
                ),
            ],
        },
        {
            id: 'boas-praticas',
            title: 'Boas práticas',
            level: B,
            tags: ['pep8', 'estilo', 'organização', 'nomes', 'código limpo', 'dicas'],
            summary: 'Hábitos que deixam o código mais fácil de ler e de consertar.',
            blocks: [
                list(
                    'Nomes claros: `media_turma` em vez de `mt`',
                    'snake_case para variáveis e funções, PascalCase para classes e MAIÚSCULAS para constantes: `TAXA_JUROS = 0.05`',
                    'Uma função, uma tarefa',
                    'Teste aos poucos: escreva um pedaço, rode, depois continue',
                    "Para descobrir o valor de uma variável, use `print(f'{x=}')`",
                    'Comente o PORQUÊ, não o óbvio',
                    'Siga o guia de estilo oficial do Python: a PEP 8',
                ),
            ],
        },
    ],
},

    ];
})();
