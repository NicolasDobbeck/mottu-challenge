# 🛵 Challenge MottuFlux

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

#### Sistema de Autenticação e Segurança
Um sistema de autenticação completo e seguro, utilizando nosso **backend dedicado em conjunto com o Firebase** para garantir a proteção dos dados do usuário.

* **Cadastro e Login:** Sistema de registro e login de usuários com validação de dados e tratamento de erros.
* **Autenticação JWT:** O login no Firebase gera um token que é trocado por um token JWT do backend, usado para autenticar todas as requisições à API.
* **Logout:** Encerramento seguro da sessão do usuário.

#### Gerenciamento de Pátios e Motos (CRUD Completo)
O coração da aplicação, permitindo total controle administrativo sobre pátios e suas respectivas frotas.

* **CRUD de Pátios:** Uma tela dedicada permite Listar, Criar, Editar e Deletar Pátios, associando cada um a uma filial existente.
* **Mapeamento de Pátio (Grid):** Ao selecionar um pátio, o usuário vê o **Grid de Mapeamento** visual, mostrando todas as motos organizadas por setores (A, B, C, D) e status (Livre, Problema, Manutenção).
* **CRUD de Motos:** Diretamente da tela do Grid, o usuário pode:
    * **Adicionar** uma nova moto (via FAB `+`).
    * **Editar** uma moto existente (clicando nela).
    * **Deletar** uma moto (clicando e segurando).
* **Alteração Rápida de Status:** O modal de edição também permite a troca rápida de status (Livre, Problema, Manutenção).

#### Administração de Filiais
Um módulo administrativo completo para o gerenciamento de filiais.

* **Criar:** Adicionar novas filiais ao sistema.
* **Ler:** Visualizar uma lista de todas as filiais cadastradas.
* **Atualizar:** Editar as informações de filiais existentes.
* **Deletar:** Remover filiais do sistema.

#### Notificações Push
Integração com **Expo Push Notifications** para manter os usuários informados.

* **Registro de Dispositivo:** Após o login, o app registra o dispositivo do usuário no backend para receber notificações.
* **Notificações de Ações:** O sistema envia uma notificação push para todos os usuários registrados quando uma nova filial é criada .

#### Painel de Controle e Personalização
Uma área dedicada para que o usuário gerencie suas preferências e informações.

* **Gerenciamento de Conta:** O usuário pode visualizar e atualizar suas informações de cadastro (nome, senha).
* **Personalização de Tema:** Suporte completo aos temas **Claro (Light Mode)** e **Escuro (Dark Mode)**.
* **Internacionalização (i18n):** O aplicativo suporta **Português (pt)** e **Espanhol (es)**, detectando automaticamente o idioma do dispositivo e permitindo a troca manual pelo usuário.
* **Tela "Sobre o App":** Exibe informações da versão do aplicativo e o **hash do commit** do Git (injetado durante o build `eas build`).

#### Monitoramento (Simulado)
* **Mapa em Tempo Real:** Uma tela de mapa dinâmico exibe a localização simulada de motocicletas em trânsito, demonstrando a capacidade de rastreamento da frota.
```
.
├── .expo/
├── android/
├── assets/
├── node_modules/
├── src/
│   ├── components/
│   │   ├── DevCard.tsx
│   │   ├── FilialFormModal.tsx
│   │   ├── MotoFormModal.tsx
│   │   └── PatioFormModal.tsx
│   ├── config/
│   │   └── firebaseConfig.ts
│   ├── navigation/
│   │   ├── AuthStack.tsx
│   │   ├── PatioStack.tsx
│   │   ├── ProfileStack.tsx
│   │   ├── Tabs.tsx
│   │   └── types.ts
│   ├── screens/
│   │   ├── AboutScreen.tsx
│   │   ├── AccountSettings.tsx
│   │   ├── Developers.tsx
│   │   ├── FiliaisScreen.tsx
│   │   ├── Home.tsx
│   │   ├── LanguageSettings.tsx
│   │   ├── Login.tsx
│   │   ├── MotoListScreen.tsx
│   │   ├── PatioListScreen.tsx
│   │   ├── Profile.tsx
│   │   ├── RealtimeMap.tsx
│   │   └── Register.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── filialService.ts
│   │   ├── i18n.ts
│   │   ├── motoService.ts
│   │   ├── notificationService.ts
│   │   └── patioService.ts
│   └── translations/
│       ├── es.json
│       └── pt.json
├── .gitignore
├── app.json
├── App.tsx
├── babel.config.js
├── eas.json
├── index.ts
├── package-lock.json
├── package.json
├── README.md
├── react-query.ts
└── tsconfig.json
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



