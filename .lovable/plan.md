# Plano de redesign da tela de Orçamento

## Objetivo
Transformar a tela atual de orçamento em uma interface moderna, legível e menos densa, sem esconder os dados financeiros que a construtora precisa consultar. O redesign respeitará os temas light e dark e servirá de base para as próximas telas do sistema.

## Direção visual proposta
- **Tom**: corporativo, mas leve — confiável como uma planilha de obra, mas com o refinamento de um SaaS moderno.
- **Paleta**: base neutra (cinzas frios e branco/off-white) com acentos em azul-profissional para ações primárias e verde-saturo apenas para valores positivos/lucro. No dark, superfícies escuras com contraste alto.
- **Tipografia**: fonte sans-serif clean, com pesos claros para rótulos e pesos fortes para valores monetários.
- **Densidade**: manter a densidade de dados, mas criar mais "respiro" através de espaçamento, agrupamento e hierarquia.

## Problemas da tela atual que serão resolvidos
1. **Tudo parece ter o mesmo peso visual**: título, valores, botões e tabela competem por atenção.
2. **Tabela muito larga e cansativa**: 13+ colunas expostas de uma vez, sem hierarquia entre dados operacionais e financeiros.
3. **Cores sem propósito claro**: azul em praticamente todos os números e verde em muitos lugares diluem o significado.
4. **Botões de ação misturados**: ações primárias, secundárias e destrutivas aparecem lado a lado com o mesmo destaque.
5. **Status pouco evidente**: a tag "aprovado" é pequena e não comunica bem o estado do orçamento.

## Estrutura da nova tela

### 1. Header do orçamento
- Título "Orçamento inicial" em destaque.
- Linha secundária com ID, data e status em uma tag/badge bem visível (cor semântica: verde para aprovado, amarelo para pendente, vermelho para rejeitado).
- Botão de voltar discreto.

### 2. Cards de métricas principais
- 5 cards em uma linha responsiva.
- "Valor Total" como card principal/destaque (maior ou com acento de cor).
- Cada card terá:
  - rótulo em texto pequeno e cor muted;
  - valor em destaque;
  - cor do valor conforme semântica (verde apenas para saldo/lucro, neutro para os demais).

### 3. Barra de ações
- Agrupar botões por intenção:
  - **Primário**: "Gerar proposta" (destaque máximo).
  - **Secundário**: "Aprovar", "Configurar proposta", "Exportar CSV".
  - **Terciário/destrutivo**: "Adicionar serviço", "Rejeitar", "Excluir orçamento" (menor destaque, ícones).
- Usar dropdown ou "mais ações" em telas menores para não poluir.

### 4. Tabela de serviços
- Manter os grupos (Implantação de Obra, Aluguéis, Projeto Executivo) como seções expansíveis/cards separados.
- Melhorar a legibilidade:
  - cabeçalho com fundo sutil e texto em muted;
  - linhas zebradas ou com separadores leves;
  - alinhamento à direita para valores;
  - descrição fixa à esquerda em scroll horizontal.
- **Colunas com hierarquia visual**:
  - Descrição, Unid, Qtde, Unit. Venda, Total: sempre visíveis.
  - Mat. Unit, Mat. Total, MO Unit, MO Total: agrupadas sob um cabeçalho "Custo".
  - Nf, Roy, Saldo, % Lucro: agrupadas sob "Impostos e Resultado".
- Destacar o **Saldo** e **% Lucro** como as colunas mais importantes (cor verde sutil, negrito).
- Inputs editáveis (qtde, unit. venda, etc.) com estilo limpo e foco visível.

### 5. Tema light e dark
- Implementar variáveis CSS semanticamente nomeadas.
- No dark: fundo escuro, superfícies em cinza-escuro, texto em branco/cinza-claro, acentos preservados.
- Garantir contraste adequado em ambos os temas.

## Implementação em fases

### Fase 1 — Fundação visual
- Definir tokens de design no `src/styles.css` (cores, espaçamento, sombras, tipografia).
- Ajustar o `__root.tsx` para suportar tema light/dark (classe `.dark` no html/body).
- Criar componentes base reutilizáveis: `MetricCard`, `SectionCard`, `StatusBadge`, `ActionBar`.

### Fase 2 — Tela de orçamento
- Reescrever `src/routes/index.tsx` para renderizar a tela de orçamento.
- Implementar header, cards de métricas, barra de ações e tabela com dados estáticos de exemplo (baseados na imagem).
- Aplicar scroll horizontal na tabela e colunas fixas para descrição.

### Fase 3 — Interatividade e refinamento
- Tornar as seções da tabela expansíveis/colapsáveis.
- Adicionar hover states nas linhas e células editáveis.
- Ajustar responsividade para desktop e tablet (mobile manterá cards simplificados ou scroll horizontal).
- Revisar contraste e espaçamento.

### Fase 4 — Validação
- Verificar build e typecheck.
- Capturar preview para confirmar que a hierarquia visual e a legibilidade melhoraram.

## Critérios de sucesso
- Todos os dados da imagem original continuam visíveis.
- A leitura da tabela é menos cansativa (hierarquia, agrupamento, cores semânticas).
- Ações principais são identificáveis em um relance.
- Tema light e dark funcionam de forma consistente.
- A tela serve como referência visual para as próximas telas do sistema.

## Notas técnicas
- Projeto usa TanStack Start + Tailwind v4: tokens de design serão definidos no `src/styles.css` com `@theme inline` e cores em `oklch`.
- Não usaremos bibliotecas de UI pesadas; os componentes serão construídos com Tailwind e shadcn/ui quando útil.
- Dados serão mockados inicialmente; integração com backend pode ser feita posteriormente sem alterar a estrutura visual.