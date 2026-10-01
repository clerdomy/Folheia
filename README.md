# Folheia

Leitor de livros em inglês com páginas em 3D, feito para quem está aprendendo o idioma. Clique numa palavra para ver a tradução e ouvir a pronúncia. Clique duas vezes numa frase para traduzi-la inteira. Você pode ler seus próprios PDFs e TXT ou escolher um livro gratuito na biblioteca, organizada do nível básico ao avançado.

O projeto inteiro é um único arquivo HTML, com CSS e JavaScript puros. Não há framework, etapa de build nem servidor obrigatório.

---

## Funcionalidades

### Leitura

- Livro em 3D com páginas que viram por animação. São duas páginas no computador e uma no celular.
- O texto do PDF ou TXT é reorganizado em páginas de livro, com tipografia própria para leitura longa.
- Ao mudar o tamanho da letra ou da janela, as páginas são remontadas sem perder o ponto de leitura.
- Navegação pelas setas da tela, pelas setas do teclado, pelos cantos dobrados das páginas, por deslizar o dedo no celular ou pela barra de progresso.
- Três temas de página: Papel, Sépia e Noite.

### Aprendizado

- **Clique numa palavra** para ver:
  - a tradução e os outros sentidos (substantivo, verbo…);
  - a transcrição fonética (IPA) e a definição em inglês;
  - a frase em que a palavra aparece.
- **Clique duas vezes** para traduzir a frase inteira. Cada palavra da frase também pode ser traduzida separadamente.
- **Selecione um trecho** com o mouse para traduzir exatamente esse trecho.
- **Como ler em português:** cada palavra e frase ganha uma leitura aproximada escrita com letras do português, por exemplo *water* → **uó**rer e *think* → think.
  - A sílaba forte aparece em negrito.
  - Os sons que não existem em português (th, r americano, é aberto…) ficam sublinhados e vêm com uma dica de como pronunciar.
  - A leitura é gerada a partir da transcrição fonética do dicionário, com regras do inglês americano.
  - Também cobre palavras flexionadas (walked, studies, singing) e as formas fracas comuns em frases (*of* → av, *the* → dha).
  - Pode ser desligada em Ajustes.
- **Ouça** a palavra ou a frase na velocidade normal ou lenta. Quando o dicionário tem gravação humana, aparece também o botão "Voz nativa".
- **Leitura em voz alta** das páginas, marcando a frase e a palavra que estão sendo faladas. As páginas viram sozinhas.
- **Vocabulário pessoal:**
  - salve palavras e frases com a tradução e o contexto;
  - as palavras salvas ficam sublinhadas no texto;
  - a lista pode ser exportada em CSV, que abre no Excel ou pode ser importada no Anki.
- **Nível estimado** do texto (A2, B1, B2 ou C1), calculado pela fórmula de legibilidade Flesch.

### Biblioteca

- **Por nível:** 22 clássicos selecionados em três prateleiras, Básico, Intermediário e Avançado, com descrição em português.
- **Buscar no acervo:** busca por título ou autor entre os mais de 70 mil livros do Project Gutenberg, com filtros por tema.
- **Minha estante:** todos os livros abertos, incluindo os PDFs e TXT da própria pessoa, com a porcentagem lida.

### Salvamento automático

- Reabre sozinho o último livro, na página onde a pessoa parou.
- Os livros ficam guardados no navegador e abrem mesmo sem internet.
- O mesmo arquivo é reconhecido mesmo se for renomeado.

---

## Como rodar

### Opção 1: abrir direto

Dê dois cliques em `leitor-ingles-3d.html`. O leitor, a tradução e a voz funcionam assim.

### Opção 2: servidor local (recomendado)

Alguns navegadores limitam recursos quando a página é aberta como arquivo (`file://`). Com um servidor local tudo se comporta como num site de verdade.

```bash
# com Node.js
npx serve .

# ou com Python
python -m http.server 8000
```

Depois acesse `http://localhost:8000/leitor-ingles-3d.html`.

### Publicar na internet

Renomeie o arquivo para `index.html` e envie para qualquer hospedagem de site estático, como GitHub Pages, Netlify, Vercel ou Cloudflare Pages. Não precisa de configuração adicional.

---

## Como usar

| Ação | Resultado |
| --- | --- |
| Clique numa palavra | Tradução, pronúncia, definição e contexto |
| Dois cliques numa palavra | Tradução da frase inteira |
| Três cliques | Tradução do parágrafo inteiro |
| Selecionar um trecho | Tradução só do trecho |
| Setas ← → ou PageUp/PageDown | Voltar ou avançar uma página |
| Deslizar o dedo (celular) | Voltar ou avançar uma página |
| Esc | Fechar a ficha, as gavetas ou a biblioteca |
| Botão **Ouvir página** | Leitura em voz alta com marcação da palavra |
| Botão **Lento** | Leitura em voz alta mais devagar |
| Botão **Biblioteca** | Livros gratuitos por nível, busca e estante |
| Botão **Abrir arquivo** | Abrir um PDF ou TXT (também dá para arrastar o arquivo para a tela) |

---

## Serviços externos

Todos são gratuitos e nenhum exige chave de acesso.

| Serviço | Uso | Observação |
| --- | --- | --- |
| [PDF.js](https://mozilla.github.io/pdf.js/) 3.11 | Extrair o texto dos PDFs | Carregado do cdnjs |
| Google Tradutor (endpoint público `translate_a/single`) | Tradução de palavras e frases | Não é uma API oficial e pode limitar o uso |
| [MyMemory](https://mymemory.translated.net/) | Tradução reserva, se o Google falhar | Tem limite diário |
| [Free Dictionary API](https://dictionaryapi.dev/) | Fonética, definições e áudio nativo | Somente inglês |
| Web Speech API | Voz sintetizada | Do próprio navegador; a qualidade varia |
| [Gutendex](https://gutendex.com/) | Catálogo e busca de livros | Funciona direto no navegador |
| [Project Gutenberg](https://www.gutenberg.org/) | Texto e capas dos livros | Veja a seção sobre CORS abaixo |
| Google Fonts | Fontes Literata e Instrument Sans | Há fontes reserva se não carregar |

---

## Armazenamento no navegador

Nada é enviado para servidor. Tudo fica no navegador da pessoa.

**localStorage** (dados pequenos):

| Chave | Conteúdo |
| --- | --- |
| `leitor-settings` | Idioma da tradução, voz, velocidades, tamanho da letra, tema |
| `leitor-vocab` | Palavras e frases salvas |
| `leitor-estante` | Livros da estante, com progresso e nível |
| `leitor-pos:<chave>` | Índice da primeira palavra visível de cada livro |
| `leitor-last` | Chave do último livro aberto |

**IndexedDB** (banco `leitor-livros`, tabela `books`):

| Chave | Conteúdo |
| --- | --- |
| `g<id>` | Texto completo de um livro do Gutenberg (ex.: `g1342`) |
| `f<hash>` | Texto extraído de um PDF ou TXT enviado pela pessoa |

A posição de leitura é salva como **índice de palavra**, e não como número de página. Por isso ela continua correta quando as páginas são remontadas em outro tamanho de tela ou de letra.

A chave `f<hash>` é uma impressão digital (cyrb53) do texto do arquivo. O mesmo conteúdo gera sempre a mesma chave, mesmo com outro nome de arquivo.

---

## Estrutura do código

Tudo está em `leitor-ingles-3d.html`, nesta ordem:

1. **CSS:** as variáveis de cor e tamanho ficam em `:root`. Os temas Sépia e Noite redefinem essas variáveis em `html[data-theme="..."]`.
2. **HTML:** barra superior, palco com o livro, ficha de tradução, gavetas de vocabulário e ajustes, biblioteca.
3. **JavaScript**, organizado em seções comentadas:

| Seção | Funções principais |
| --- | --- |
| Documento | `buildDoc()` divide o texto em parágrafos, palavras e frases |
| Extração de PDF | `extractPDF()` reconstrói linhas, parágrafos e títulos |
| Paginação | `paginate()` mede o texto numa página invisível e divide os parágrafos |
| Renderização | `pageHTML()`, `render()`, `goToWord()` |
| Virar páginas | `flip()` anima a folha em 3D com `rotateY` |
| Tradução e dicionário | `translate()`, `lookup()` |
| Como ler em português | `toPT()`, `ipaFor()`, `phraseGuide()`, tabelas `PT_V`, `PT_C`, `PT_MINI` |
| Voz | `speak()`, `startReading()`, `readNext()` |
| Ficha de tradução | `openWord()`, `openSentence()`, `openText()` |
| Vocabulário | `toggleVocab()`, `renderVocab()` |
| Texto do Gutenberg | `cleanGutenberg()`, `findStart()`, `estimateLevel()` |
| Cache e download | `idb`, `fetchBookText()` |
| Biblioteca | `LEVELS`, `renderLib()`, `searchCatalog()`, `readBook()` |
| Início | `reopenLast()`, `init()` |

---

## Personalização

- **Trocar o serviço de tradução:** edite a função `translate()`. Ela só precisa devolver `{ text, dict, src }`. Para produção, a API oficial do Google Cloud Translation ou a DeepL são mais estáveis, mas precisam de um servidor para esconder a chave.
- **Adicionar livros às prateleiras:** inclua itens no array `LEVELS`, com o número do livro no Gutenberg (`id`), título, autor e uma descrição curta (`blurb`).
- **Trocar o livro de demonstração:** edite a constante `DEMO`. Linhas que começam com `# ` viram títulos de capítulo.
- **Mudar cores e fontes:** altere as variáveis em `:root` e o link do Google Fonts no `<head>`.
- **Ajustar a leitura em português:** edite as tabelas `PT_V` (vogais), `PT_C` (consoantes) e `PT_MINI` (palavras comuns e formas fracas). As dicas de cada som ficam em `PT_TIPS`.
- **Mudar os ajustes padrão:** edite a constante `DEFAULTS` (idioma, velocidades, tamanho da letra, tema).
- **Mudar a capacidade da estante:** ajuste `SHELF_MAX` (padrão: 30 livros).

---

## Limitações conhecidas

- **Download dos livros do Gutenberg:**
  - O site do Gutenberg não libera acesso direto pelo navegador (bloqueio de CORS). Por isso `fetchBookText()` tenta proxies públicos gratuitos.
  - Esses proxies mudam de regras com frequência. O corsproxy.io, por exemplo, passou a funcionar de graça só em ambientes de desenvolvimento.
  - Quando todas as rotas falham, a ficha do livro mostra um link para baixar o `.txt` e abrir pelo botão **Abrir arquivo**.
  - A solução definitiva é um proxy próprio (veja o roteiro abaixo).
- **PDFs digitalizados** (feitos só de imagem) não têm texto para extrair. Eles precisam passar por OCR antes.
- **PDFs com duas colunas** podem sair com o texto um pouco fora de ordem.
- **Só inglês:** tradução, voz, dicionário e nível estimado assumem que o livro está em inglês. Um livro em outro idioma abre, mas as ferramentas de aprendizado não funcionam bem.
- **Dados por aparelho:** a estante e o vocabulário ficam só naquele navegador. Limpar os dados do site ou usar aba anônima apaga tudo.
- **Qualidade da voz:** depende do navegador e do sistema. Chrome e Edge têm as vozes em inglês mais naturais.

---

## Roteiro

- [ ] **Proxy próprio** (Cloudflare Worker gratuito) para baixar os livros do Gutenberg sem depender de serviços de terceiros.
- [ ] **Suporte a outros idiomas:** detectar o idioma do livro e ajustar tradução, voz e hifenização.
- [ ] **Modo áudio e vídeo:**
  - transcrever podcasts e vídeos no próprio navegador com Whisper (Transformers.js) ou importar legendas `.srt` e `.vtt`;
  - acompanhar o texto em tempo real, com repetição e câmera lenta da voz original.
- [ ] **Perguntas com IA** sobre qualquer trecho, por exemplo "por que ele usou *would* aqui?", usando o mesmo proxy próprio.
- [ ] **Sincronização entre aparelhos** com login (Firebase ou Supabase).

---

## Créditos

- Os livros da biblioteca são obras em domínio público disponibilizadas pelo [Project Gutenberg](https://www.gutenberg.org/). "Project Gutenberg" é marca registrada da Project Gutenberg Literary Archive Foundation. Este projeto não é afiliado nem endossado por ela.
- A história de demonstração, *The Keeper of Small Lights*, foi escrita especialmente para este projeto.
