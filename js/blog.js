/**
 * ==========================================================================
 * JS: SISTEMA DE BLOG DO VINC (CENTRO DE CONHECIMENTO ANTIFRAUDE)
 * ==========================================================================
 * Este script gerencia toda a lógica de funcionamento do blog do Vinc.
 * Ele controla:
 * 1. Base de dados de artigos (simulação de CMS/Prisma) adaptada às 6 novas categorias editoriais.
 * 2. Listagem de posts, destaque dinâmico e filtragem inteligente (busca + categorias).
 * 3. Detalhamento de artigos com SEO dinâmico, meta tags e dados estruturados (JSON-LD).
 * 4. Geração automática e dinâmica do Índice de Conteúdo (Table of Contents) baseado em tags H2.
 * 5. Barra lateral (sidebar) responsiva com posts populares, contagem por categorias e nuvem de tags.
 * 6. Inscrição simulada de newsletter.
 * 
 * Todas as modificações foram documentadas em português, seguindo as diretrizes editoriais do Vinc.
 */

// --------------------------------------------------------------------------
// AUTORES DO BLOG
// --------------------------------------------------------------------------
const AUTHORS = {
  luiz_gustavo: {
    name: "Luiz Gustavo",
    avatarUrl: "../assets/icons/vinc_icon_256px.png",
    role: "Especialista em Segurança Digital & Dev Sênior",
    bio: "Co-fundador do Vinc, desenvolvedor e entusiasta de segurança da informação, dedicado a criar pontes seguras na comunicação jurídica nacional."
  },
  vinc_security: {
    name: "Vinc Security Team",
    avatarUrl: "../assets/icons/vinc_icon_256px.png",
    role: "Time de Inteligência Antifraude",
    bio: "Equipe técnica de analistas de segurança do Vinc, focada no monitoramento constante de novas ameaças, engenharia social e vazamento de dados judiciais."
  }
};

// --------------------------------------------------------------------------
// CATEGORIAS DO NOVO MODELO EDITORIAL (Mapeamento de Metadados)
// --------------------------------------------------------------------------
const CATEGORIES = {
  ANATOMIA_GOLPES: {
    name: "Anatomia de Golpes e Alertas",
    slug: "anatomia-golpes",
    description: "Educação preventiva para identificar e desarmar golpes de engenharia social.",
    icon: "🚨",
    color: "#e11d48" // Vermelho/Laranja Carmim para Alertas
  },
  GESTAO_REPUTACAO: {
    name: "Gestão de Reputação para Advogados",
    slug: "gestao-reputacao",
    description: "Estratégias para proteger a identidade digital profissional e a confiança do cliente.",
    icon: "🛡️",
    color: "#2563eb" // Azul Profundo para Confiança
  },
  TECNOLOGIA_DADOS: {
    name: "Tecnologia e Soberania de Dados",
    slug: "tecnologia-dados",
    description: "Detalhamento acessível sobre criptografia, segurança e arquitetura de dados.",
    icon: "⚙️",
    color: "#0d9488" // Verde Azulado para Tecnologia
  },
  GUIA_FUNCIONALIDADES: {
    name: "Guia de Funcionalidades e Onboarding",
    slug: "guia-funcionalidades",
    description: "Manuais passo a passo para extrair o máximo de segurança da plataforma Vinc.",
    icon: "📖",
    color: "#d97706" // Âmbar para Educação Operacional
  },
  CIBERSEGURANCA_COMPLIANCE: {
    name: "Cibersegurança e Compliance (LGPD)",
    slug: "ciberseguranca-compliance",
    description: "Conformidade jurídica, governança de privacidade e as melhores práticas digitais.",
    icon: "🔒",
    color: "#4f46e5" // Índigo para Compliance
  },
  CASOS_SUCESSO: {
    name: "Casos de Sucesso e Segurança Jurídica",
    slug: "casos-sucesso",
    description: "Histórias e análises baseadas em simulações e dados anonimizados de segurança real.",
    icon: "🤝",
    color: "#16a34a" // Verde Esmeralda para Sucesso
  }
};

// --------------------------------------------------------------------------
// BANCO DE DADOS DE ARTIGOS (Fleshed-out, informativo, sem linguagem alarmista)
// --------------------------------------------------------------------------
const BLOG_POSTS = [
  {
    id: "post-1",
    title: "O Golpe do Falso Advogado no WhatsApp: Como Criminosos Exploram a Ansiedade Processual",
    slug: "golpe-falso-advogado-whatsapp",
    excerpt: "Entenda detalhadamente a engenharia social por trás do golpe do falso advogado no WhatsApp e aprenda a identificar os gatilhos psicológicos usados por quadrilhas.",
    category: CATEGORIES.ANATOMIA_GOLPES.name,
    categorySlug: CATEGORIES.ANATOMIA_GOLPES.slug,
    categoryIcon: CATEGORIES.ANATOMIA_GOLPES.icon,
    categoryColor: CATEGORIES.ANATOMIA_GOLPES.color,
    publishedAt: "15 Jul 2026",
    readingTime: 6,
    author: AUTHORS.vinc_security,
    featuredImage: "../assets/images/celular-escritorio.jpg",
    content: `
      <p>Nos últimos meses, houve um crescimento vertiginoso em golpes virtuais direcionados a clientes que possuem processos na Justiça brasileira. O mais recorrente deles é o chamado <strong>Golpe do Falso Advogado</strong>, aplicado principalmente através de aplicativos de mensagens como o WhatsApp. Para combater esse mal, a filosofia do Vinc é direta e imutável: <strong>Confirme antes de confiar</strong>.</p>
      
      <h2>Como Funciona a Mecânica do Golpe?</h2>
      <p>O golpe não se baseia em uma quebra de segurança de servidores bancários ou criptografia de sistemas. É uma fraude baseada puramente na <strong>engenharia social</strong>. Os criminosos acessam diários oficiais públicos, coletam nomes de clientes que têm direito a receber algum dinheiro (alvarás expedidos, precatórios, revisões salariais) e localizam o contato de telefone desses clientes na internet. Em seguida, criam um perfil de WhatsApp idêntico ao do advogado ou escritório do cliente, copiando fotos, logotipos oficiais e descrições institucionais legítimas.</p>
      
      <div class="post-regra-ouro">
        <span class="post-regra-ouro-label">Regra de Ouro do Vinc</span>
        <p class="post-regra-ouro-text">Confirme antes de confiar.</p>
        <p class="post-regra-ouro-sub">O fato de uma pessoa conhecer o número do seu processo ou citar termos jurídicos complexos não valida sua identidade. Exija sempre validação multifator.</p>
      </div>

      <h2>Os Principais Gatilhos Usados por Criminosos</h2>
      <p>Estelionatários dependem de reações precipitadas das vítimas. Para isso, aplicam táticas refinadas:</p>
      <ul>
        <li><strong>Gatilho de Urgência Extrema:</strong> O golpista afirma que os valores do alvará estão liberados, mas que o lote expira no mesmo dia. Isso impede a vítima de pensar ou de ligar para o escritório de forma calma.</li>
        <li><strong>Falsa Autoridade:</strong> Utilização de termos complexos, fotos de tribunais ou logotipos da OAB para convencer a vítima de que se trata de uma comunicação solene.</li>
        <li><strong>Custas Antecipadas:</strong> A mentira de que, para liberar a quantia total, o cliente precisa depositar um valor correspondente a taxas de cartório, guias tributárias (como DARF ou ITCD) ou taxas fictícias via Pix.</li>
      </ul>

      <h2>Ações Práticas para se Proteger</h2>
      <p>Caso receba qualquer solicitação financeira repentina, siga estas recomendações fundamentais:</p>
      <ol>
        <li><strong>Não faça pagamentos imediatos:</strong> Advogados idôneos não cobram Pix ou transferências para liberar alvarás judiciais.</li>
        <li><strong>Não retorne o contato pelo mesmo número:</strong> Se um perfil novo te mandar mensagem dizendo ser do seu advogado, não faça perguntas ou ligações por ele. Procure os canais oficiais estabelecidos na sua procuração original.</li>
        <li><strong>Utilize a Autenticação do Vinc:</strong> Escritórios credenciados ao Vinc fornecem um selo eletrônico e um QR Code único de comunicação. Qualquer mensagem fora da plataforma Vinc deve ser considerada altamente suspeita.</li>
      </ol>

      <div class="post-faq-box" style="margin-top: 30px; padding: 20px; background-color: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md);">
        <h3 style="margin-top: 0;">FAQ Rápido sobre o Golpe</h3>
        <p><strong>P: Advogados cobram taxas por Pix para liberar alvarás?</strong><br>R: Não. No Brasil, o recebimento de valores judiciais é feito diretamente na conta do beneficiário ou do advogado com poderes específicos. Quaisquer custas oficiais são emitidas através de guias bancárias dos próprios tribunais.</p>
        <p><strong>P: Como os criminosos sabem meu nome e meu processo?</strong><br>R: Os andamentos processuais no Brasil são públicos pela Constituição Federal. Isso permite que robôs vasculhem publicações oficiais para extrair nomes e dados que, infelizmente, são cruzados com vazamentos gerais na web para achar seu telefone.</p>
      </div>
    `,
    seo: {
      metaTitle: "O Golpe do Falso Advogado no WhatsApp | Blog Vinc",
      metaDesc: "Descubra como funciona o golpe do falso advogado no WhatsApp. Entenda a engenharia social e aprenda a se blindar com as dicas práticas do Vinc.",
      keywords: "golpe do falso advogado, falso advogado whatsapp, golpe do pix alvara, engenharia social juridica, vinc",
    }
  },
  {
    id: "post-2",
    title: "Blindagem de Marca Jurídica: Como Proteger a Reputação do Seu Escritório Contra Golpes Digitais",
    slug: "blindagem-de-marca-juridica-protecao-reputacao",
    excerpt: "A reputação de um escritório é seu maior patrimônio. Veja como a falsidade ideológica pode prejudicar sua banca e como adotar uma postura proativa.",
    category: CATEGORIES.GESTAO_REPUTACAO.name,
    categorySlug: CATEGORIES.GESTAO_REPUTACAO.slug,
    categoryIcon: CATEGORIES.GESTAO_REPUTACAO.icon,
    categoryColor: CATEGORIES.GESTAO_REPUTACAO.color,
    publishedAt: "12 Jul 2026",
    readingTime: 5,
    author: AUTHORS.luiz_gustavo,
    featuredImage: "../assets/images/escritorios1.jpg",
    content: `
      <p>Levar décadas para estruturar uma carreira de sucesso e assistir a uma crise de confiança acontecer em minutos por culpa de golpistas que se passam por seus profissionais. Esse tem sido o maior temor de gestores e sócios de bancas jurídicas em todo o país. Proteger sua marca jurídica é proteger a estabilidade do seu negócio.</p>
      
      <h2>A Responsabilidade das Bancas de Advocacia</h2>
      <p>Embora a fraude seja praticada por criminosos externos, os tribunais já têm julgado que escritórios de advocacia possuem o dever de zelar pela confidencialidade dos dados de seus processos e, principalmente, por canais de comunicação seguros com seus clientes. A ausência de alertas claros ou canais verificados pode gerar prejuízos financeiros e também abalos éticos imensuráveis à imagem corporativa do escritório.</p>
      
      <div class="post-regra-ouro">
        <span class="post-regra-ouro-label">Regra de Ouro do Vinc</span>
        <p class="post-regra-ouro-text">Confirme antes de confiar.</p>
        <p class="post-regra-ouro-sub">Implementar um canal antifraude oficial como o Vinc não é apenas tecnologia, é um ato de governança, responsabilidade social e valorização da carteira de clientes.</p>
      </div>

      <h2>3 Passos Práticos para a Gestão de Reputação</h2>
      <p>Para evitar que a marca do seu escritório seja usada em golpes virtuais de clonagem, adote medidas robustas:</p>
      <ul>
        <li><strong>Políticas de Zero Confiança (Zero Trust):</strong> Oriente formalmente seus clientes desde a assinatura do contrato que toda cobrança financeira de custas ou atualizações críticas de alvará serão realizadas por canais autenticados e específicos, e que o escritório nunca solicita transações urgentes sem agendamento prévio.</li>
        <li><strong>Educação Ativa do Cliente:</strong> Envie materiais informativos periódicos. Utilize e-mails, cartilhas de segurança e alertas nas redes sociais para reiterar as diretrizes de segurança da banca.</li>
        <li><strong>Uso de Certificação e Plataformas Verificadas:</strong> Assim como bancos e grandes empresas utilizam sistemas dedicados para validação, escritórios modernos utilizam o Vinc como o canal imutável e oficial de comunicação, eliminando a margem de erro provocada pelo WhatsApp desprotegido.</li>
      </ul>

      <h2>A Tecnologia como Diferencial Competitivo</h2>
      <p>Em um mercado competitivo, a segurança digital tornou-se um dos maiores diferenciais de valor de uma banca de advocacia. Oferecer aos clientes a paz de espírito de que sua comunicação é totalmente blindada gera fidelização, fortalece a reputação e demonstra compromisso com a excelência técnica e com a LGPD.</p>
    `,
    seo: {
      metaTitle: "Proteção de Marca e Reputação Jurídica | Vinc",
      metaDesc: "Descubra como blindar a reputação do seu escritório de advocacia contra golpes de falsidade ideológica e golpes de engenharia social no WhatsApp.",
      keywords: "reputacao juridica, blindagem de marca escritorio, golpistas oab, seguranca escritorio advocacia, vinc",
    }
  },
  {
    id: "post-3",
    title: "Zero Trust na Advocacia: Entenda a Arquitetura Tecnológica do Vinc e por que Ela é Inviolável",
    slug: "zero-trust-na-advocacia-arquitetura-vinc",
    excerpt: "Explore os bastidores tecnológicos da plataforma Vinc. Saiba por que adotamos o paradigma Zero Trust e como a criptografia assegura nossa operação.",
    category: CATEGORIES.TECNOLOGIA_DADOS.name,
    categorySlug: CATEGORIES.TECNOLOGIA_DADOS.slug,
    categoryIcon: CATEGORIES.TECNOLOGIA_DADOS.icon,
    categoryColor: CATEGORIES.TECNOLOGIA_DADOS.color,
    publishedAt: "10 Jul 2026",
    readingTime: 7,
    author: AUTHORS.luiz_gustavo,
    featuredImage: "../assets/images/vinc_infrastructure.jpg",
    content: `
      <p>Muitas soluções de segurança tentam mitigar as fraudes criando listas negras de spammers ou tentando adivinhar se um número de WhatsApp é falso usando heurísticas simples. Essa abordagem está ultrapassada. O Vinc foi arquitetado sobre o paradigma de <strong>Zero Trust</strong> (Nunca Confiar, Sempre Verificar), oferecendo uma barreira lógica inquebrável contra golpistas.</p>
      
      <h2>O que é o Paradigma Zero Trust?</h2>
      <p>No conceito tradicional de segurança, uma rede ou canal (como o WhatsApp) é considerado confiável após uma verificação inicial básica. No Zero Trust, partimos do princípio oposto: <strong>qualquer requisição, mensagem ou contato externo é considerado potencialmente falso ou comprometido</strong>, não importando se possui uma foto de perfil correta ou se tem acesso a dados reais do processo judicial. A identidade do emissor deve ser atestada e validada criptograficamente a cada interação sensível.</p>
      
      <div class="post-regra-ouro">
        <span class="post-regra-ouro-label">Regra de Ouro do Vinc</span>
        <p class="post-regra-ouro-text">Confirme antes de confiar.</p>
        <p class="post-regra-ouro-sub">A tecnologia deve ser desenhada para eliminar a necessidade de adivinhação. No Vinc, a confiança é construída por meio de tokens criptográficos, não por fotos de perfil ou palavras convincentes.</p>
      </div>

      <h2>Os Pilares Lógicos da nossa Infraestrutura</h2>
      <p>A arquitetura de software do Vinc baseia-se em engenharia de ponta que impede a manipulação fraudulenta de dados:</p>
      <ul>
        <li><strong>Autenticação Descentralizada via Token (JWT):</strong> Cada operação financeira, envio de boleto ou agendamento de atualização processual é assinado eletronicamente no nosso backend, gerando chaves criptográficas de mão dupla.</li>
        <li><strong>O Backend como Fonte Única da Verdade:</strong> Diferente de outros softwares onde o aplicativo cliente (como o Flutter) decide permissões ou validações localmente (o que permite burlar o sistema se o celular do cliente for hackeado), as regras de segurança e autenticação são executadas e mantidas integralmente no nosso servidor protegido em Cloud, isolando as credenciais sensíveis.</li>
        <li><strong>Geração Dinâmica de Desafios:</strong> Quando o escritório envia uma mensagem crítica, o Vinc gera um "Desafio Ativo de Segurança". O cliente final, utilizando o painel seguro do Vinc, valida o token gerado. Se as chaves não coincidirem perfeitamente, o alerta de fraude é disparado instantaneamente para ambas as partes.</li>
      </ul>

      <h2>Segurança Sem Complicação</h2>
      <p>Apesar da complexidade de criptografia por trás do Vinc, a experiência do usuário final é extremamente amigável. Toda a engrenagem roda em milissegundos, garantindo que o advogado e o cliente naveguem em um ecossistema protegido sem que isso adicione etapas complexas ou trave a rotina profissional do dia a dia.</p>
    `,
    seo: {
      metaTitle: "Zero Trust na Advocacia e Tecnologia Vinc | Blog",
      metaDesc: "Entenda os princípios de segurança Zero Trust e criptografia que tornam a plataforma Vinc o canal de comunicação jurídica mais seguro do mercado.",
      keywords: "zero trust advocacia, seguranca criptografica vinc, jwt seguranca juridica, backend unico verdade, vinc",
    }
  },
  {
    id: "post-4",
    title: "Guia de Onboarding Vinc: Como Ativar Seu Canal Oficial de Comunicação Segura",
    slug: "guia-onboarding-vinc-como-ativar-canal-seguro",
    excerpt: "Aprenda passo a passo a configurar e ativar o Vinc no seu escritório de advocacia. Um tutorial completo para advogados e clientes darem os primeiros passos.",
    category: CATEGORIES.GUIA_FUNCIONALIDADES.name,
    categorySlug: CATEGORIES.GUIA_FUNCIONALIDADES.slug,
    categoryIcon: CATEGORIES.GUIA_FUNCIONALIDADES.icon,
    categoryColor: CATEGORIES.GUIA_FUNCIONALIDADES.color,
    publishedAt: "08 Jul 2026",
    readingTime: 4,
    author: AUTHORS.luiz_gustavo,
    featuredImage: "../assets/images/vinc_shield_client.jpg",
    content: `
      <p>Começar a utilizar a plataforma de blindagem digital do Vinc é um processo simples, rápido e estruturado para que sua banca jurídica decole com total segurança jurídica em poucos minutos. Siga este guia prático de onboarding para registrar seu escritório, convidar seus profissionais e cadastrar seus primeiros clientes.</p>
      
      <h2>Passo 1: Solicitação e Ativação da Chave Corporativa</h2>
      <p>O processo começa com a validação da sociedade de advogados ou profissional autônomo. Acesse a página de contato e solicite sua <strong>Chave de Ativação do Vinc</strong>. Nosso time de auditoria verificará o registro profissional na OAB de sua seccional correspondente. Uma vez homologado, você receberá por e-mail suas credenciais de administrador da plataforma.</p>
      
      <div class="post-regra-ouro">
        <span class="post-regra-ouro-label">Regra de Ouro do Vinc</span>
        <p class="post-regra-ouro-text">Confirme antes de confiar.</p>
        <p class="post-regra-ouro-sub">A segurança de ponta a ponta exige controle estrito de acessos. Cada chave gerada é exclusiva para o CNPJ ou CPF do advogado devidamente registrado.</p>
      </div>

      <h2>Passo 2: Configurando seu Painel de Gestão (Escritório Ciente)</h2>
      <p>Ao logar no painel administrativo do Vinc, configure o perfil institucional da sua marca:</p>
      <ul>
        <li><strong>Cadastre os Contatos Oficiais:</strong> Registre todos os números de telefone corporativos e contas oficiais que sua equipe utiliza. Isso cria o banco de dados oficial contra o qual o sistema fará a checagem dupla de segurança.</li>
        <li><strong>Habilite seus Advogados:</strong> Adicione os profissionais e assistentes autorizados a emitirem ordens de verificação ou envio de boletos. Cada usuário terá permissões restritas e rastreáveis.</li>
      </ul>

      <h2>Passo 3: Convidando e Conectando Seus Clientes</h2>
      <p>A segurança é uma via de mão dupla. Para conectar um cliente ao seu canal seguro, o fluxo estruturado segue três etapas rápidas:</p>
      <ol>
        <li><strong>Envio do Convite Único:</strong> O escritório cadastra o e-mail ou CPF do cliente no painel do Vinc e envia um link único de convite e boas-vindas.</li>
        <li><strong>Instalação/Acesso do Cliente:</strong> O cliente acessa o painel do Vinc no celular ou navegador de forma leve, sem necessidade de downloads complicados.</li>
        <li><strong>Pareamento Seguro:</strong> O sistema realiza o vínculo oficial: <em>Cliente ➔ Contrato de Prestação de Serviços ➔ Advogados Associados</em>. A partir desse instante, qualquer comunicação suspeita fora da árvore de vinculação do Vinc acenderá o sinal de alerta no celular do cliente.</li>
      </ol>

      <p>Pronto! O canal de comunicação do seu escritório está ativado e totalmente protegido contra golpes digitais.</p>
    `,
    seo: {
      metaTitle: "Guia de Onboarding e Ativação do Vinc | Blog",
      metaDesc: "Siga o passo a passo de configuração e onboarding da plataforma Vinc. Saiba como ativar chaves, registrar advogados e proteger seus clientes de forma simples.",
      keywords: "onboarding vinc, ativar canal seguro advocacia, guia seguranca vinc, painel escritorio ciente",
    }
  },
  {
    id: "post-5",
    title: "Privacidade e Conformidade: Como o Vinc Auxilia Escritórios de Advocacia a Atender à LGPD",
    slug: "privacidade-conformidade-lgpd-vinc-advocacia",
    excerpt: "Entenda a relação profunda entre segurança da informação jurídica, Lei Geral de Proteção de Dados (LGPD) e o ecossistema tecnológico do Vinc.",
    category: CATEGORIES.CIBERSEGURANCA_COMPLIANCE.name,
    categorySlug: CATEGORIES.CIBERSEGURANCA_COMPLIANCE.slug,
    categoryIcon: CATEGORIES.CIBERSEGURANCA_COMPLIANCE.icon,
    categoryColor: CATEGORIES.CIBERSEGURANCA_COMPLIANCE.color,
    publishedAt: "05 Jul 2026",
    readingTime: 6,
    author: AUTHORS.vinc_security,
    featuredImage: "../assets/images/seguranca.jpg",
    content: `
      <p>Escritórios de advocacia gerenciam dados pessoais altamente sensíveis: prontuários médicos, contratos comerciais, folhas de pagamento, acordos de divórcio e informações processuais protegidas por segredo de justiça. Sob as regras rígidas da <strong>Lei Geral de Proteção de Dados (LGPD)</strong>, as bancas jurídicas têm o dever legal de implementar medidas robustas de governança contra vazamentos e acessos não autorizados.</p>
      
      <h2>O Papel do Vinc no Escudo da Privacidade</h2>
      <p>O Vinc atua como um parceiro estratégico para o encarregado de dados (DPO) e para os sócios do escritório. Em vez de transmitir guias, dados bancários de clientes ou cópias de certidões por canais abertos e vulneráveis de e-mail e chats de redes sociais que armazenam dados sem conformidade, o Vinc estabelece um canal proprietário e criptografado com total auditoria de acessos.</p>
      
      <div class="post-regra-ouro">
        <span class="post-regra-ouro-label">Regra de Ouro do Vinc</span>
        <p class="post-regra-ouro-text">Confirme antes de confiar.</p>
        <p class="post-regra-ouro-sub">A conformidade com a LGPD exige que a segurança da informação seja aplicada desde o desenho do sistema (Privacy by Design). No Vinc, esse é o nosso core business.</p>
      </div>

      <h2>Como o Vinc Garante Conformidade Legal e Técnica?</h2>
      <p>Nosso ecossistema implementa controles técnicos rigorosos baseados nas melhores práticas da norma ISO 27001:</p>
      <ul>
        <li><strong>Gerenciamento Estrito de Sessões:</strong> O acesso dos advogados e colaboradores ao painel administrativo expira automaticamente após períodos de inatividade, minimizando os riscos de vazamento por esquecimento de telas abertas.</li>
        <li><strong>Notificações Push Seguras:</strong> O envio de solicitações críticas de verificação é feito através de alertas diretos que não expõem dados sensíveis na tela de bloqueio do celular, prevenindo a engenharia social visual.</li>
        <li><strong>Logs de Auditoria Imutáveis:</strong> Todas as requisições financeiras, validações de boletos e confirmações de identidade geram logs detalhados e auditáveis que indicam o autor, data, hora e IP do dispositivo emissor. Em caso de incidentes, o escritório possui provas sólidas de sua governança ativa e zelo técnico.</li>
      </ul>

      <h2>Mitigação de Multas e Penalidades</h2>
      <p>A Autoridade Nacional de Proteção de Dados (ANPD) avalia o nível de cooperação e as defesas tecnológicas implementadas pelas empresas ao aplicar penalidades em casos de incidentes. Escritórios de advocacia que utilizam ferramentas estruturadas de segurança como o Vinc demonstram que adotaram atitudes preventivas contra vazamento de dados, diminuindo consideravelmente os riscos de multas graves.</p>
    `,
    seo: {
      metaTitle: "Conformidade LGPD para Escritórios de Advocacia | Vinc",
      metaDesc: "Descubra como a plataforma Vinc auxilia escritórios a cumprir os requisitos da LGPD através de criptografia, gerenciamento de sessões e auditoria ativa.",
      keywords: "lgpd advocacia, segurança da informação juridica, conformidade anpd, dpo escritorio, vinc",
    }
  },
  {
    id: "post-6",
    title: "Estudo de Caso: Como um Cliente de São Paulo Identificou um Boleto Falso e Evitou um Prejuízo de R$ 38.000",
    slug: "estudo-de-caso-evitou-boleto-falso-prejuizo",
    excerpt: "Uma simulação baseada em fatos anonimizados que demonstra o poder real de prevenção da plataforma Vinc diante de uma engenharia social sofisticada.",
    category: CATEGORIES.CASOS_SUCESSO.name,
    categorySlug: CATEGORIES.CASOS_SUCESSO.slug,
    categoryIcon: CATEGORIES.CASOS_SUCESSO.icon,
    categoryColor: CATEGORIES.CASOS_SUCESSO.color,
    publishedAt: "01 Jul 2026",
    readingTime: 5,
    author: AUTHORS.vinc_security,
    featuredImage: "../assets/images/vinc_advocacy_shield.jpg",
    content: `
      <p>Para ilustrar o impacto prático de um ecossistema verificado de segurança, compartilhamos o estudo de caso de uma tentativa de estelionato neutralizada pela plataforma Vinc. Visando resguardar a privacidade, todos os nomes, valores precisos e dados geográficos foram modificados e anonimizados, servindo como um material estritamente educativo.</p>
      
      <h2>A Abordagem: Engenharia Social de Alta Precisão</h2>
      <p>Um empresário de São Paulo, autor de um processo societário complexo de alta expressão financeira, recebeu um contato telefônico por WhatsApp de uma conta comercial que utilizava a imagem corporativa do escritório de advocacia responsável por sua defesa técnica. O interlocutor, fingindo ser o assistente financeiro sênior da banca, informou em tom muito cordial que "a sentença favorável havia sido assinada pelo juiz", mas que a liberação dos depósitos judiciais exigia a quitação de custas tributárias cartorárias urgentes.</p>
      
      <h2>A Armadilha: O Boleto Adulterado</h2>
      <p>Para facilitar a transação, o suposto profissional enviou um arquivo de boleto bancário no formato PDF no valor de <strong>R$ 38.000</strong>. O documento apresentava dados perfeitos: o logotipo do banco emitente correto, o nome do escritório como cedente, e os dados pessoais do cliente como sacado. Visualmente, o documento era impecável e extremamente convincente.</p>
      
      <div class="post-regra-ouro">
        <span class="post-regra-ouro-label">Regra de Ouro do Vinc</span>
        <p class="post-regra-ouro-text">Confirme antes de confiar.</p>
        <p class="post-regra-ouro-sub">Mesmo que um documento de cobrança apresente seu nome, seu CPF e o nome correto do seu advogado, valide a transação antes de transferir qualquer recurso.</p>
      </div>

      <h2>A Prevenção: O Vinc Entra em Ação</h2>
      <p>Instruído pela banca jurídica desde o início da prestação de serviços a seguir o protocolo de segurança, o empresário não realizou o pagamento imediato do boleto. Ele acessou seu painel seguro do Vinc, onde o escritório havia integrado seu canal oficial de cobrança.</p>
      <p>Ao conferir a aba de solicitações financeiras pendentes no Vinc, o cliente percebeu que **não constava nenhum boleto ou ordem de cobrança cadastrada** para aquela data ou valor. Diante disso, ele utilizou a ferramenta de scanner criptográfico do Vinc para escanear a linha digitável do boleto recebido por WhatsApp. O sistema indicou imediatamente que o beneficiário real de destino dos fundos era uma conta de pessoa física estranha de uma fintech de pagamento no interior do país, e não a conta judicial do escritório parceiro.</p>
      
      <h2>O Desfecho: Prejuízo Zero e Segurança Fortalecida</h2>
      <p>O cliente reportou imediatamente o contato fraudulento através do botão de alerta de suspeitas no Vinc. O escritório de advocacia, de posse das informações enviadas e do número do golpista, pôde orientar os demais clientes e registrar boletim de ocorrência junto à delegacia de crimes cibernéticos de forma ágil, com total auditoria de logs e evidências. A filosofia de **confirmar antes de confiar** salvou o patrimônio de um cliente e blindou a integridade da marca do escritório.</p>
    `,
    seo: {
      metaTitle: "Como Cliente Evitou Golpe do Boleto de R$ 38.000 | Vinc",
      metaDesc: "Veja neste caso prático anonimizado como as chaves de verificação de boletos e canais oficiais do Vinc impediram uma fraude financeira sofisticada de R$ 38.000.",
      keywords: "estudo de caso golpe do boleto, evitar boleto falso, seguranca pagamento advocacia, vinc",
    }
  }
];

// --------------------------------------------------------------------------
// LÓGICA DE GERENCIAMENTO DE ESTADO E RENDERIZAÇÃO DO BLOG (LISTAGEM)
// --------------------------------------------------------------------------
let activeCategory = "Todos";
let searchQuery = "";

/**
 * Filtra e renderiza os artigos na listagem principal do blog
 * Com suporte às novas cores, ícones e tags personalizadas.
 */
function renderBlogPosts() {
  const postsContainer = document.getElementById("blog-posts-container");
  const featuredContainer = document.getElementById("featured-post-container");
  if (!postsContainer) return; // Se não estiver na página de listagem, sai da função

  // Filtragem dos posts ativos com base na categoria e termo de pesquisa
  const filtered = BLOG_POSTS.filter((post) => {
    const matchesCategory = activeCategory === "Todos" || post.category === activeCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isFiltering = activeCategory !== "Todos" || searchQuery !== "";

  // Estado vazio de busca
  if (filtered.length === 0) {
    if (featuredContainer) featuredContainer.style.display = "none";
    postsContainer.innerHTML = `
      <div class="empty-state" id="blog-empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3>Nenhum artigo encontrado</h3>
        <p>Tente alterar as palavras-chave ou selecionar outra categoria.</p>
      </div>
    `;
    return;
  }

  let postsToGrid = [...filtered];

  // Renderização do Artigo Destaque Superior (somente quando não estiver aplicando filtros)
  if (!isFiltering && featuredContainer) {
    featuredContainer.style.display = "block";
    const featuredPost = filtered[0];
    postsToGrid = filtered.slice(1); // O restante dos artigos vai para a grade (grid)

    featuredContainer.innerHTML = `
      <article class="featured-card" id="featured-card-item">
        <a href="artigo-detalhes.html?slug=${featuredPost.slug}" class="featured-img-link" aria-label="Ler artigo em destaque: ${featuredPost.title}">
          <img src="${featuredPost.featuredImage}" alt="Capa: ${featuredPost.title}" class="featured-img" loading="lazy">
        </a>
        <div class="featured-content">
          <div class="meta-info">
            <span class="blog-badge" style="background-color: ${featuredPost.categoryColor}15; color: ${featuredPost.categoryColor}; border-left: 2px solid ${featuredPost.categoryColor};">
              ${featuredPost.categoryIcon} ${featuredPost.category}
            </span>
            <span>${featuredPost.publishedAt}</span>
            <span>•</span>
            <span>${featuredPost.readingTime} min de leitura</span>
          </div>
          <h2 class="featured-title">
            <a href="artigo-detalhes.html?slug=${featuredPost.slug}">${featuredPost.title}</a>
          </h2>
          <p class="featured-excerpt">${featuredPost.excerpt}</p>
          <div class="featured-footer">
            <div class="author-info">
              <img src="${featuredPost.author.avatarUrl}" alt="Avatar de ${featuredPost.author.name}" class="author-avatar" width="36" height="36">
              <div>
                <span class="author-name" style="display: block;">${featuredPost.author.name}</span>
                <span style="font-size: 11px; color: var(--text-secondary); font-weight: 300;">${featuredPost.author.role}</span>
              </div>
            </div>
            <a href="artigo-detalhes.html?slug=${featuredPost.slug}" class="btn-primary btn-small" id="btn-read-featured">Ler artigo</a>
          </div>
        </div>
      </article>
    `;
  } else if (featuredContainer) {
    featuredContainer.style.display = "none";
  }

  // Renderização da grade de artigos (Grid responsivo)
  postsContainer.innerHTML = `
    <div class="articles-grid" id="articles-grid-container">
      ${postsToGrid.map((post) => `
        <article class="article-card" id="article-card-${post.id}">
          <a href="artigo-detalhes.html?slug=${post.slug}" class="article-img-link" aria-label="Ler artigo: ${post.title}">
            <img src="${post.featuredImage}" alt="Capa: ${post.title}" class="article-img" loading="lazy">
          </a>
          <div class="article-content">
            <div class="meta-info">
              <span class="blog-badge" style="background-color: ${post.categoryColor}15; color: ${post.categoryColor}; border-left: 2px solid ${post.categoryColor}; padding: 3px 8px; font-size: 11px;">
                ${post.categoryIcon} ${post.category}
              </span>
              <span>${post.publishedAt}</span>
            </div>
            <h3 class="article-title">
              <a href="artigo-detalhes.html?slug=${post.slug}">${post.title}</a>
            </h3>
            <p class="article-excerpt">${post.excerpt}</p>
            <div class="article-footer">
              <div class="author-info">
                <img src="${post.author.avatarUrl}" alt="Avatar de ${post.author.name}" class="author-avatar" width="28" height="28" loading="lazy">
                <span class="author-name" style="font-size: 13px;">${post.author.name}</span>
              </div>
              <a href="artigo-detalhes.html?slug=${post.slug}" class="btn-secondary btn-small" style="padding: 6px 14px; font-size: 13px;" id="btn-read-more-${post.id}">Ler mais</a>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

/**
 * Inicializa os botões de filtro superior das categorias e o input de busca
 */
function initBlogControls() {
  const categoryContainer = document.getElementById("category-filters-wrap");
  const searchInput = document.getElementById("blog-search-input");

  if (categoryContainer) {
    // Monta a estrutura de pílulas incluindo o ícone de cada categoria
    categoryContainer.innerHTML = `
      <button class="category-btn ${activeCategory === "Todos" ? 'active' : ''}" data-category="Todos">🏷️ Todos</button>
      ${Object.values(CATEGORIES).map((cat) => `
        <button class="category-btn ${cat.name === activeCategory ? 'active' : ''}" data-category="${cat.name}">
          <span style="color: ${cat.color}; margin-right: 4px;">${cat.icon}</span> ${cat.name}
        </button>
      `).join('')}
    `;

    categoryContainer.querySelectorAll(".category-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        categoryContainer.querySelectorAll(".category-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.getAttribute("data-category");
        renderBlogPosts();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      renderBlogPosts();
    });
  }
}

// --------------------------------------------------------------------------
// LÓGICA DE DETALHES DO ARTIGO (SEO + GERAÇÃO DINÂMICA DE ÍNDICE)
// --------------------------------------------------------------------------

/**
 * Carrega e injeta dinamicamente o artigo detalhado, atualizando os metadados de SEO
 * e gerando automaticamente o Índice de Conteúdo (Table of Contents) do artigo.
 */
function loadSinglePost() {
  const singlePostContainer = document.getElementById("single-post-container");
  if (!singlePostContainer) return; // Se não estiver na página de artigo-detalhes, sai

  // Extrai o parâmetro slug da URL
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("slug");

  if (!slug) {
    renderSinglePostNotFound();
    return;
  }

  // Busca o post no banco local correspondente ao slug
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    renderSinglePostNotFound();
    return;
  }

  // 1. Atualizar Tags de SEO e Metadados dinamicamente para melhor indexação
  document.title = `${post.title} | Blog Vinc`;
  
  let metaDescTag = document.querySelector('meta[name="description"]');
  if (metaDescTag) {
    metaDescTag.setAttribute("content", post.seo.metaDesc);
  } else {
    metaDescTag = document.createElement("meta");
    metaDescTag.setAttribute("name", "description");
    metaDescTag.setAttribute("content", post.seo.metaDesc);
    document.head.appendChild(metaDescTag);
  }

  // Atualizar Open Graph (Facebook, WhatsApp, LinkedIn)
  updateMetaTag("property", "og:title", `${post.title} | Vinc`);
  updateMetaTag("property", "og:description", post.seo.metaDesc);
  updateMetaTag("property", "og:url", window.location.href);

  // Injetar dados estruturados JSON-LD do Schema.org para indexação do Google
  const schemaScript = document.createElement("script");
  schemaScript.type = "application/ld+json";
  schemaScript.text = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": [post.featuredImage],
    "datePublished": "2026-07-15T09:00:00-03:00",
    "author": [{
      "@type": "Person",
      "name": post.author.name,
      "jobTitle": post.author.role
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Vinc",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.vinc.com.br/assets/icons/vinc_icon_512px.png"
      }
    },
    "description": post.seo.metaDesc,
    "articleBody": post.content.replace(/<[^>]*>/g, '') // Remove HTML para gerar texto cru para o buscador
  });
  document.head.appendChild(schemaScript);

  // 2. Renderizar o layout básico do post
  singlePostContainer.innerHTML = `
    <!-- Link de retorno para a listagem -->
    <a href="blog.html" class="back-to-blog" id="btn-back-to-blog">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      Voltar para o Blog
    </a>

    <!-- Navegação em Breadcrumbs (Acessibilidade e SEO) -->
    <nav class="breadcrumbs" aria-label="Navegação de trilha (Breadcrumbs)" id="post-breadcrumbs">
      <a href="../index.html">Início</a>
      <span class="breadcrumbs-separator">/</span>
      <a href="blog.html">Blog</a>
      <span class="breadcrumbs-separator">/</span>
      <span class="breadcrumbs-current" style="color: ${post.categoryColor}; font-weight: 700;">${post.category}</span>
    </nav>

    <!-- Cabeçalho Principal do Artigo -->
    <header class="post-header" id="post-title-header">
      <div class="post-header-meta">
        <span class="blog-badge" style="background-color: ${post.categoryColor}15; color: ${post.categoryColor}; border-left: 2px solid ${post.categoryColor};">
          ${post.categoryIcon} ${post.category}
        </span>
        <span style="color: var(--text-secondary); font-size: 14px;">${post.publishedAt}</span>
        <span style="color: var(--border);">|</span>
        <span style="color: var(--text-secondary); font-size: 14px;">${post.readingTime} min de leitura</span>
      </div>
      <h1 class="post-title" id="post-main-title">${post.title}</h1>
    </header>

    <!-- Capa do Artigo -->
    <div class="post-cover-wrap" id="post-cover-image">
      <img src="${post.featuredImage}" alt="Capa: ${post.title}" class="post-cover">
    </div>

    <!-- Corpo de Texto do Artigo -->
    <article class="post-body" id="post-text-body">
      ${post.content}
    </article>

    <!-- Caixa de Apresentação de Autor -->
    <section class="post-author-box" aria-labelledby="author-heading" id="post-author-section">
      <img src="${post.author.avatarUrl}" alt="Foto de ${post.author.name}" class="post-author-avatar" width="80" height="80">
      <div class="post-author-info">
        <h4 id="author-heading" style="margin: 0 0 4px 0;">${post.author.name}</h4>
        <p class="post-author-role">${post.author.role}</p>
        <p class="post-author-bio">${post.author.bio}</p>
      </div>
    </section>

    <!-- Artigos Relacionados (Sempre linkados para evitar posts isolados) -->
    <section class="related-posts" aria-labelledby="related-heading" id="post-related-section">
      <h3 class="related-title" id="related-heading">Artigos Relacionados</h3>
      <div class="articles-grid" id="related-articles-grid">
        ${renderRelatedPostsMarkup(post)}
      </div>
    </section>
  `;

  // 3. Geração Automática do Índice de Conteúdo (Table of Contents - TOC)
  const postBody = document.getElementById("post-text-body");
  if (postBody) {
    const headings = postBody.querySelectorAll("h2");
    if (headings.length > 0) {
      const tocContainer = document.createElement("div");
      tocContainer.className = "post-toc";
      tocContainer.innerHTML = `
        <h4 class="toc-title">📍 Índice do Artigo</h4>
        <ul class="toc-list">
          ${Array.from(headings).map((h, index) => {
            const headingId = `topico-${index + 1}`;
            h.id = headingId; // Seta o id dinâmico no elemento H2 do texto
            return `
              <li>
                <a href="#${headingId}" class="toc-link">
                  <span class="toc-bullet">▶</span> ${h.textContent}
                </a>
              </li>
            `;
          }).join('')}
        </ul>
      `;
      // Injeta o Índice de Conteúdo logo no topo do texto do artigo para melhorar UX
      postBody.insertBefore(tocContainer, postBody.firstChild);
    }
  }
}

/**
 * Auxiliar para atualizar tags meta dinâmicas de SEO
 */
function updateMetaTag(attribute, value, content) {
  let tag = document.querySelector(`meta[${attribute}="${value}"]`);
  if (tag) {
    tag.setAttribute("content", content);
  } else {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, value);
    tag.setAttribute("content", content);
    document.head.appendChild(tag);
  }
}

/**
 * Retorna o HTML estruturado para até 3 artigos relacionados na mesma categoria
 * Promove uma excelente malha de links internos inteligentes para maximizar SEO.
 */
function renderRelatedPostsMarkup(currentPost) {
  // Busca posts da mesma categoria (excluindo o post ativo)
  let related = BLOG_POSTS.filter((p) => p.id !== currentPost.id && p.category === currentPost.category);
  
  // Caso não existam posts suficientes na mesma categoria, preenche com os demais
  if (related.length < 3) {
    const extra = BLOG_POSTS.filter((p) => p.id !== currentPost.id && p.category !== currentPost.category);
    related = [...related, ...extra].slice(0, 3);
  } else {
    related = related.slice(0, 3);
  }

  return related.map((post) => `
    <article class="article-card" id="related-card-${post.id}">
      <a href="artigo-detalhes.html?slug=${post.slug}" class="article-img-link" aria-label="Artigo Relacionado: ${post.title}">
        <img src="${post.featuredImage}" alt="Capa: ${post.title}" class="article-img" loading="lazy">
      </a>
      <div class="article-content" style="padding: 20px;">
        <div class="meta-info" style="font-size: 12px; margin-bottom: 8px;">
          <span class="blog-badge" style="font-size: 10px; padding: 2px 6px; background-color: ${post.categoryColor}15; color: ${post.categoryColor};">
            ${post.categoryIcon} ${post.category}
          </span>
          <span>${post.publishedAt}</span>
        </div>
        <h4 class="article-title" style="font-size: 1rem; margin-top: 4px; margin-bottom: 8px;">
          <a href="artigo-detalhes.html?slug=${post.slug}">${post.title}</a>
        </h4>
        <a href="artigo-detalhes.html?slug=${post.slug}" class="btn-secondary btn-small" style="padding: 4px 10px; font-size: 12px; align-self: flex-start; margin-top: auto;" id="btn-read-related-${post.id}">Ler mais</a>
      </div>
    </article>
  `).join('');
}

/**
 * Interface limpa amigável exibida caso o artigo não seja localizado
 */
function renderSinglePostNotFound() {
  const container = document.getElementById("single-post-container");
  if (!container) return;

  container.innerHTML = `
    <div class="empty-state" style="margin: 60px 0;" id="post-not-found-state">
      <div class="empty-state-icon">⚠️</div>
      <h3>Artigo não encontrado</h3>
      <p>O endereço acessado pode ter sido alterado ou o artigo foi temporariamente arquivado.</p>
      <a href="blog.html" class="btn-primary" style="margin-top: 20px; display: inline-block;">Voltar para o Blog</a>
    </div>
  `;
}

// --------------------------------------------------------------------------
// NEWSLETTER E CADASTRO (SIMULAÇÃO CLIENT-SIDE)
// --------------------------------------------------------------------------

/**
 * Inicializa os formulários de inscrição da Newsletter (lateral e rodapé)
 */
function initNewsletter() {
  const forms = document.querySelectorAll(".newsletter-form");
  
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const emailInput = form.querySelector('input[type="email"]');
      const nameInput = form.querySelector('input[type="text"]');
      const feedback = form.nextElementSibling; // Elemento .newsletter-feedback seguinte
      
      if (!emailInput || !emailInput.value) {
        if (feedback) {
          feedback.textContent = "Por favor, digite um e-mail válido.";
          feedback.className = "newsletter-feedback error";
        }
        return;
      }

      const email = emailInput.value.trim();
      const name = nameInput ? nameInput.value.trim() : "";
      
      if (feedback) {
        feedback.textContent = "Abrindo seu cliente de e-mail...";
        feedback.className = "newsletter-feedback success";
      }

      // Constrói o link mailto para enviar os dados para o e-mail do desenvolvedor
      const subject = encodeURIComponent("Inscrição na Newsletter de Segurança - Vinc");
      const body = encodeURIComponent(`Olá Luiz Gustavo,\n\nGostaria de me cadastrar na newsletter de segurança e prevenção a fraudes da Vinc.\n\nNome: ${name}\nE-mail: ${email}\n\nAtenciosamente,\n${name}`);
      const mailtoUrl = `mailto:contato@luizgustavodev.com?subject=${subject}&body=${body}`;

      // Abre o cliente de e-mail padrão com as informações preenchidas
      window.location.href = mailtoUrl;

      // Executa a confirmação visual na tela
      setTimeout(() => {
        if (feedback) {
          feedback.textContent = "E-mail de cadastro gerado com sucesso! Confirme o envio no seu aplicativo de e-mail.";
          feedback.className = "newsletter-feedback success";
        }
        // Limpa os campos após o envio
        emailInput.value = "";
        if (nameInput) nameInput.value = "";
      }, 1000);
    });
  });
}

// --------------------------------------------------------------------------
// SIDEBAR (BARRA LATERAL): POPULARES, CONTADORES E TAG CLOUD
// --------------------------------------------------------------------------

/**
 * Alimenta dinamicamente os widgets da Sidebar reutilizando o mesmo banco de dados central.
 */
function initSidebar() {
  const popularContainer = document.getElementById("popular-posts-list");
  const categoriesContainer = document.getElementById("sidebar-categories-list");
  const tagsContainer = document.getElementById("sidebar-tags-cloud");

  // 1. Popula a lista de Artigos Populares (ordenados de forma simulada)
  if (popularContainer) {
    const popularPosts = [...BLOG_POSTS].slice(0, 4);
    popularContainer.innerHTML = popularPosts.map((post, idx) => `
      <li class="popular-item" id="popular-item-${post.id}">
        <span class="popular-number" style="color: ${post.categoryColor}; opacity: 0.4;">0${idx + 1}</span>
        <div class="popular-item-content">
          <a href="artigo-detalhes.html?slug=${post.slug}" class="popular-item-title">${post.title}</a>
          <span class="popular-item-meta">${post.publishedAt} • ${post.readingTime} min</span>
        </div>
      </li>
    `).join('');
  }

  // 2. Popula e faz a contagem de posts por categoria na barra lateral
  if (categoriesContainer) {
    const counts = {};
    BLOG_POSTS.forEach((post) => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });

    categoriesContainer.innerHTML = Object.values(CATEGORIES).map((cat) => {
      const count = counts[cat.name] || 0;
      return `
        <li class="sidebar-cat-item" id="sidebar-cat-item-${cat.slug}">
          <a href="blog.html" class="sidebar-cat-link" data-category="${cat.name}">
            <span style="color: ${cat.color};">${cat.icon}</span> ${cat.name}
          </a>
          <span class="sidebar-cat-count">${count}</span>
        </li>
      `;
    }).join('');

    // Permite que cliques nas categorias da sidebar realizem filtros em tempo real
    categoriesContainer.querySelectorAll(".sidebar-cat-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        const listPostsContainer = document.getElementById("blog-posts-container");
        if (listPostsContainer) {
          e.preventDefault();
          activeCategory = link.getAttribute("data-category");
          
          // Altera o estado visual correspondente na barra superior de categorias
          const filterButtons = document.querySelectorAll("#category-filters-wrap .category-btn");
          filterButtons.forEach((btn) => {
            if (btn.getAttribute("data-category") === activeCategory) {
              btn.classList.add("active");
            } else {
              btn.classList.remove("active");
            }
          });
          
          renderBlogPosts();
          listPostsContainer.scrollIntoView({ behavior: 'smooth' });
        } else {
          // Se estiver nos detalhes, armazena para carregar filtrado na Home do blog
          sessionStorage.setItem("active_category_filter", link.getAttribute("data-category"));
        }
      });
    });
  }

  // 3. Nuvem de Tags Dinâmica
  if (tagsContainer) {
    const tags = ["Pix", "WhatsApp", "Golpe", "Segurança", "Advogado", "LGPD", "Engenharia Social", "Fraude", "Alvará", "Processo Judicial", "Governança", "Zero Trust", "Criptografia"];
    tagsContainer.innerHTML = tags.map((tag) => `
      <a href="blog.html" class="tag-badge" data-tag="${tag}">#${tag}</a>
    `).join('');

    tagsContainer.querySelectorAll(".tag-badge").forEach((badge) => {
      badge.addEventListener("click", (e) => {
        const listPostsContainer = document.getElementById("blog-posts-container");
        if (listPostsContainer) {
          e.preventDefault();
          const tagValue = badge.getAttribute("data-tag");
          const searchInput = document.getElementById("blog-search-input");
          if (searchInput) {
            searchInput.value = tagValue;
            searchQuery = tagValue;
            renderBlogPosts();
            listPostsContainer.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          sessionStorage.setItem("active_tag_search", badge.getAttribute("data-tag"));
        }
      });
    });
  }
}

// --------------------------------------------------------------------------
// INICIALIZAÇÃO CENTRAL DO BLOG (DOM CONTENT LOADED)
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Carrega filtros de categoria salvos de outras páginas
  const savedCategory = sessionStorage.getItem("active_category_filter");
  if (savedCategory) {
    activeCategory = savedCategory;
    sessionStorage.removeItem("active_category_filter");
  }

  // Carrega termos de busca de tags salvos de outras páginas
  const savedTag = sessionStorage.getItem("active_tag_search");
  if (savedTag) {
    searchQuery = savedTag;
    sessionStorage.removeItem("active_tag_search");
    const searchInput = document.getElementById("blog-search-input");
    if (searchInput) searchInput.value = savedTag;
  }

  // Aciona a renderização de componentes e lógica
  initBlogControls();
  renderBlogPosts();
  loadSinglePost();
  initSidebar();
  initNewsletter();
});
