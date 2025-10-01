# 🛵 Challenge Mottu

❗ATENÇÃO: O PROJETO AINDA ESTA EM DESENVOLVIMENTO

Integrantes:
+ [Nicolas Dobbeck Mendes RM: 557605](https://github.com/NicolasDobbeck)
+ [Thiago Henry Dias RM: 554522](https://github.com/lavithiluan)
+ [José Bezerra Bastos Neto RM: 559221](https://github.com/jjosebastos)

Apresentamos aqui o resultado de um projeto desenvolvido para a Mottu, com o propósito fundamental de revolucionar o mapeamento geográfico e o rastreamento em tempo real de suas motos. Em um cenário onde a gestão de grandes frotas de veículos se apresenta como um desafio complexo, a ausência de um sistema centralizado e em tempo real para monitorar esses ativos pode acarretar em perdas significativas de tempo na localização de veículos, uma gestão ineficiente de toda a frota, elevação de custos operacionais e uma tomada de decisões prejudicada pela falta de dados precisos. Foi pensando em mitigar essas dificuldades que concebemos este sistema.<br> <br>
Nossa solução visa otimizar o monitoramento da frota da Mottu, oferecendo uma visão clara e dinâmica da distribuição e do status de cada veículo. Para isso, o sistema permite que cada pátio seja representado como uma área geográfica delimitada no mapa interativo da aplicação. Dentro desses pátios, o rastreamento em tempo real se torna uma realidade palpável. Marcadores visuais sobre o mapa indicam a localização exata de cada moto, seja ela estacionada em um pátio ou em trânsito. Essa funcionalidade proporciona uma visão dinâmica da posição atual de toda a frota, permitindo que um operador identifique instantaneamente a moto e sua posição atual.<br><br>
A implementação deste sistema representa um avanço significativo para a Mottu, trazendo consigo uma série de benefícios que impactam diretamente a eficiência e a economia da operação. A eficiência operacional é aprimorada substancialmente, uma vez que o acesso rápido à localização e ao status das motos elimina a necessidade de buscas manuais, agilizando processos como a retirada de veículos e a organização de manutenções.<br><br>
Este projeto vai além de um simples sistema de rastreamento; ele representa um passo fundamental na evolução da gestão de frotas para a Mottu. Ao oferecer uma visão clara e em tempo real de seus ativos, a solução empodera a empresa a operar com uma eficiência sem precedentes, otimizando recursos e respondendo dinamicamente às demandas do mercado. Acreditamos que essa capacidade de monitoramento inteligente não só melhora as operações diárias, mas também abre portas para inovações futuras, contribuindo significativamente para um cenário de mobilidade urbana mais conectado, seguro e eficiente. Este é um projeto que, ao aprimorar a capacidade de gerenciamento da Mottu, contribui para um futuro onde a logística de frotas é mais inteligente e responsiva.

##  Funcionalidades Principais

Este projeto foi desenvolvido para oferecer uma solução completa e robusta para o gerenciamento de frotas de motocicletas, com uma interface intuitiva e funcionalidades poderosas.

###  Sistema de Autenticação e Segurança
Um sistema de autenticação completo e seguro, utilizando nosso **backend dedicado em conjunto com o Firebase** para garantir a proteção dos dados do usuário.

-   **Cadastro de Usuários:** Permite que novos usuários criem uma conta de forma rápida e segura, com validação de dados para garantir a integridade das informações.
-   **Login Seguro:** Autenticação baseada em credenciais, garantindo que apenas usuários autorizados tenham acesso ao sistema.
-   **Logout:** Encerramento seguro da sessão do usuário, protegendo a conta contra acessos não autorizados.

###  Gerenciamento e Monitoramento do Pátio
O coração da aplicação, oferecendo uma visão clara e interativa das operações no pátio.

-   **Visualização do Pátio:** Um mapa esquemático exibe a disposição de todas as motocicletas no pátio, organizadas por setores para facilitar a localização.
-   **Alteração de Status Interativa:** Com um simples toque, é possível alterar o status de cada motocicleta (ex: `Livre`, `Em Manutenção`, `Problema`), atualizando a informação em tempo real para toda a equipe.
-   **Monitoramento em Tempo Real (Simulado):** Uma tela de mapa dinâmico exibe a localização das motocicletas em trânsito, utilizando dados simulados para demonstrar a capacidade de rastreamento da frota.

###  Administração de Filiais
Um módulo administrativo completo para o gerenciamento de filiais, permitindo total controle sobre as unidades da empresa.

-   **Criar:** Adicionar novas filiais ao sistema.
-   **Ler:** Visualizar uma lista de todas as filiais cadastradas com seus respectivos detalhes.
-   **Atualizar:** Editar as informações de filiais existentes.
-   **Deletar:** Remover filiais que não estão mais em operação.

###  Painel de Controle do Usuário
Uma área dedicada para que o usuário gerencie suas preferências e informações pessoais.

-   **Gerenciamento de Conta:** O usuário pode visualizar e atualizar suas informações de cadastro, como nome e senha, mantendo seus dados sempre corretos.
-   **Personalização de Tema:** Oferece a opção de alternar entre os temas **Claro (Light Mode)** e **Escuro (Dark Mode)**, proporcionando maior conforto visual e adaptando a interface às preferências do usuário.

```
.
├── .expo/
├── assets/
├── node_modules/
├── src/
│   ├── components/
│   │   ├── DevCard.tsx
│   │   └── FilialFormModal.tsx
│   ├── config/
│   │   └── firebaseConfig.ts
│   ├── navigation/
│   │   ├── AuthStack.tsx
│   │   ├── ProfileStack.tsx
│   │   ├── Tabs.tsx
│   │   └── types.ts
│   ├── screens/
│   │   ├── AccountSettings.tsx
│   │   ├── Developers.tsx
│   │   ├── FiliaisScreen.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── PatioMapping.tsx
│   │   ├── Profile.tsx
│   │   ├── RealtimeMap.tsx
│   │   └── Register.tsx
│   └── services/
│       ├── api.ts
│       ├── authService.ts
│       ├── filialService.ts
│       └── motoService.ts
├── .gitignore
├── app.json
├── App.tsx
├── babel.config.js
├── index.ts
├── package-lock.json
├── package.json
└── react-query.ts
```
```bash
git clone https://github.com/NicolasDobbeck/mottu-challenge.git
cd mottu-challenge
```
```bash
npm install
# ou
yarn install
```

```bash
npx expo start
```

