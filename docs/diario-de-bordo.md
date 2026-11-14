# Diário de bordo — uso de IA no Eco em Foco

**Data:** 13/11/2026

**Projeto:** Eco em Foco

**Ferramenta de IA:** Manus AI

## Registro

A IA foi utilizada como apoio à auditoria técnica do site Eco em Foco. A tarefa incluiu executar o Nu Html Checker e o Lighthouse na página inicial, examinar o código-fonte e propor correções relacionadas à acessibilidade e ao carregamento de imagens.

Com base nos resultados, foram preparadas alterações para que o nome acessível da marca acompanhe seu texto visível, oferecer a imagem de capa em WebP mantendo o JPG original como alternativa, e remover atributos HTML inválidos encontrados no formulário de contato e no iframe da página de mídia.

## Verificação

As dez páginas HTML do repositório foram verificadas com o Nu Html Checker após as correções: **zero erros e zero avisos**. A versão local da branch foi auditada pelo Lighthouse 13.6.0 em configuração mobile simulada, com resultados de **99 em Performance, 100 em Acessibilidade, 96 em Boas práticas e 100 em SEO**. Esses resultados são automatizados e podem variar conforme o ambiente.

A imagem de capa convertida passou de 249.311 bytes para 89.192 bytes, redução de aproximadamente **64,2%**. O crédito existente ao Wikimedia Commons foi mantido.

## Transparência sobre a IA

A IA auxiliou na análise, na preparação das alterações e na execução das validações automatizadas. Os resultados foram registrados junto das alterações para facilitar a conferência. A revisão humana do pull request ainda está pendente; este registro não afirma que o código foi aprovado ou integrado à branch principal.
