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
 * 6. Inscrição de newsletter integrada ao Mailchimp (envio real via formulário oculto).
 * 
 * Todas as modificações foram documentadas em português, seguindo as diretrizes editoriais do Vinc.
 */

// --------------------------------------------------------------------------
// AUTORES DO BLOG
// --------------------------------------------------------------------------
const AUTHORS = {
  luiz_gustavo: {
    name: "Luiz Gustavo",
    avatarUrl: "../assets/icons/vinc_icon_256px_1.png",
    role: "Especialista em Segurança Digital & Dev Sênior",
    bio: "Co-fundador do Vinc, desenvolvedor e entusiasta de segurança da informação, dedicado a criar pontes seguras na comunicação jurídica nacional."
  },
  vinc_security: {
    name: "Vinc Security Team",
    avatarUrl: "../assets/icons/vinc_icon_256px_1.png",
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
        <p class="post-regra-ouro-sub">A tecnologia deve ser desenhada para eliminar a necessidade de adivinhação. No Vinc, a confiança é construída por meio de chaves de assinatura digital criptografadas de segurança automática, não por fotos de perfil ou palavras convincentes.</p>
      </div>

      <h2>Os Pilares Lógicos da nossa Infraestrutura</h2>
      <p>A arquitetura de software do Vinc baseia-se em engenharia de ponta que impede a manipulação fraudulenta de dados:</p>
      <ul>
        <li><strong>Autenticação Segura com Assinatura Digital:</strong> Cada operação financeira, envio de boleto ou aviso de atualização do processo é assinado digitalmente de forma única e segura, gerando chaves criptográficas de proteção de mão dupla.</li>
        <li><strong>Servidor Seguro como Central de Validação:</strong> Diferente de outros sistemas em que as regras de segurança rodam no celular do usuário (o que pode ser burlado caso o aparelho seja invadido), as regras de segurança e autenticação do Vinc são executadas e mantidas integralmente em nosso servidor em nuvem protegido, mantendo todas as suas informações em total isolamento.</li>
        <li><strong>Geração Dinâmica de Desafios:</strong> Quando o escritório envia uma mensagem importante, o Vinc cria uma confirmação instantânea chamada "Desafio Ativo de Segurança". O aplicativo do cliente valida essa assinatura digital de forma automática. Se as informações não baterem perfeitamente, o alerta de tentativa de golpe é disparado para você e para o escritório de advocacia.</li>
      </ul>

      <h2>Segurança Sem Complicação</h2>
      <p>Apesar da complexidade de criptografia por trás do Vinc, a experiência do usuário final é extremamente amigável. Toda a engrenagem roda em milissegundos, garantindo que o advogado e o cliente naveguem em um ecossistema protegido sem que isso adicione etapas complexas ou trave a rotina profissional do dia a dia.</p>
    `,
    seo: {
      metaTitle: "Zero Trust na Advocacia e Tecnologia Vinc | Blog",
      metaDesc: "Entenda os princípios de segurança Zero Trust e criptografia que tornam a plataforma Vinc o canal de comunicação jurídica mais seguro do mercado.",
      keywords: "zero trust advocacia, seguranca criptografica vinc, assinatura digital seguranca juridica, servidor unico verdade, vinc",
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
    id: "post-7",
    title: "Golpe do Falso Advogado: Como Criminosos Usam Nomes Reais para Aplicar Fraudes",
    slug: "golpe-falso-advogado-nomes-reais",
    excerpt: "Descubra como golpistas cruzam dados públicos reais com perfis falsos no WhatsApp e aprenda por que o Vinc usa o roteamento por vínculo para desarmar essa fraude.",
    category: CATEGORIES.ANATOMIA_GOLPES.name,
    categorySlug: CATEGORIES.ANATOMIA_GOLPES.slug,
    categoryIcon: CATEGORIES.ANATOMIA_GOLPES.icon,
    categoryColor: CATEGORIES.ANATOMIA_GOLPES.color,
    publishedAt: "16 Jul 2026",
    readingTime: 5,
    author: AUTHORS.vinc_security,
    featuredImage: "../assets/images/celular-escritorio.jpg",
    content: `
      <p>O <strong>Golpe do Falso Advogado</strong> é uma das ameaças que mais crescem no Brasil. O que torna essa fraude extremamente perigosa é que os golpistas não inventam personagens: eles usam nomes reais de advogados atuantes e dados verdadeiros de processos públicos para enganar os clientes.</p>

      <h2>A Engenharia Social por Trás do Nome Real</h2>
      <p>Criminosos monitoram os diários oficiais e plataformas de consulta processual. Ao identificar uma decisão favorável, como a expedição de um alvará ou precatório, eles buscam o nome do advogado responsável e o do cliente. Com ferramentas de enriquecimento de dados, localizam o WhatsApp do cliente e entram em contato se passando pelo profissional real.</p>
      <p>Eles copiam fotos de perfil, logotipos do escritório e até termos técnicos da petição para construir uma imagem de autoridade. O cliente, ao pesquisar o nome do advogado na internet, encontra o registro legítimo e acaba caindo na armadilha.</p>

      <div class="post-regra-ouro">
        <span class="post-regra-ouro-label">Regra de Ouro do Vinc</span>
        <p class="post-regra-ouro-text">Confirme antes de confiar.</p>
        <p class="post-regra-ouro-sub">O sistema Vinc não confia apenas no nome ou na foto de quem está enviando a mensagem. A confiança é validada por meio de relações reais de contrato criptografadas.</p>
      </div>

      <h2>Como o Vinc Protege: Roteamento por Vínculo</h2>
      <p>No Vinc, a segurança é baseada na verificação de um relacionamento ativo e formal:</p>
      <ul>
        <li><strong>Validação de Contrato Real:</strong> A plataforma vincula o <strong>Cliente</strong> diretamente ao seu <strong>Contrato</strong> e ao seu <strong>Advogado Responsável</strong> dentro do nosso sistema fechado.</li>
        <li><strong>Canais Blindados de Envio:</strong> Qualquer solicitação de pagamento ou atualização processual precisa partir do painel autenticado do escritório.</li>
        <li><strong>Zero Confiança em Nomes:</strong> Se uma mensagem chegar ao seu WhatsApp alegando ser do seu advogado, mas não estiver validada na plataforma Vinc, ela é considerada nula e insegura.</li>
      </ul>

      <h2>Por Que Essa Abordagem Desarma os Golpistas?</h2>
      <p>Como os criminosos não possuem acesso às chaves de segurança do Vinc nem ao canal autenticado da sociedade de advogados, eles são incapazes de simular o selo de confirmação digital. O cliente sabe instantaneamente que aquele contato externo é fraudulento.</p>

      <div class="post-signature" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border); text-align: center;">
        <p style="margin: 0 0 8px 0; font-weight: bold; color: var(--text-primary);">Vinc — confirme antes de confiar.</p>
        <p style="margin: 0; font-style: italic; color: var(--text-secondary); font-size: 14px;">Desenvolvido com foco total em soberania tecnológica e segurança jurídica.</p>
      </div>
    `,
    seo: {
      metaTitle: "Golpe do Falso Advogado e Uso de Nomes Reais | Blog Vinc",
      metaDesc: "Descubra como golpistas usam nomes reais de advogados e dados públicos para fraudar clientes, e como o roteamento por vínculo do Vinc impede essa prática.",
      keywords: "golpe do falso advogado, falsidade ideologica whatsapp, oab falso advogado, seguranca juridica, vinc",
    }
  },
  {
    id: "post-8",
    title: "Por que o Roteamento por Vínculo é Mais Seguro que Conversar Apenas pelo WhatsApp?",
    slug: "roteamento-por-vinculo-vs-whatsapp",
    excerpt: "Entenda a diferença crucial entre reconhecer um nome na tela e validar um relacionamento jurídico real com criptografia e servidores seguros.",
    category: CATEGORIES.TECNOLOGIA_DADOS.name,
    categorySlug: CATEGORIES.TECNOLOGIA_DADOS.slug,
    categoryIcon: CATEGORIES.TECNOLOGIA_DADOS.icon,
    categoryColor: CATEGORIES.TECNOLOGIA_DADOS.color,
    publishedAt: "16 Jul 2026",
    readingTime: 5,
    author: AUTHORS.luiz_gustavo,
    featuredImage: "../assets/images/vinc_infrastructure.jpg",
    content: `
      <p>O WhatsApp tornou-se a ferramenta de comunicação mais popular do país, mas sua flexibilidade também o transformou no canal favorito de estelionatários. Para combater fraudes, precisamos entender um conceito de segurança digital fundamental: a diferença entre <strong>identidade</strong> e <strong>vínculo</strong>.</p>

      <h2>Identidade versus Vínculo</h2>
      <p>No WhatsApp desprotegido, qualquer pessoa pode adotar a identidade que desejar. Um golpista compra um chip novo, baixa uma foto pública, digita o nome de um advogado renomado no perfil e pronto: ele "é" o advogado para qualquer leigo. Isso acontece porque o aplicativo apenas valida que aquele número de telefone está ativo, mas não verifica a legitimidade da profissão ou a relação com o cliente.</p>
      <p>O <strong>Roteamento por Vínculo do Vinc</strong> resolve esse problema. Em vez de simplesmente tentar confirmar quem é a pessoa do outro lado, o sistema valida criptograficamente se existe um relacionamento contratual ativo e legítimo entre aquele emissor específico e o destinatário.</p>

      <div class="post-regra-ouro">
        <span class="post-regra-ouro-label">Regra de Ouro do Vinc</span>
        <p class="post-regra-ouro-text">Confirme antes de confiar.</p>
        <p class="post-regra-ouro-sub">Não basta confirmar se o nome está correto. É necessário validar se a mensagem foi enviada de dentro do canal verificado e atrelada ao seu contrato de prestação de serviços.</p>
      </div>

      <h2>Servidor Seguro como Central da Verdade</h2>
      <p>No modelo do Vinc, as decisões de segurança não ocorrem no celular do cliente ou na rede do WhatsApp. Nosso <strong>servidor seguro</strong> em nuvem atua como a central de validação:</p>
      <ul>
        <li><strong>Confirmação Baseada em Contratos:</strong> O sistema checa se o advogado emissor está de fato autorizado pela sociedade contratada para tratar com o cliente em questão.</li>
        <li><strong>Criptografia de Mão Dupla:</strong> A mensagem ou boleto recebe um carimbo digital gerado pelo servidor, inviabilizando qualquer tipo de interceptação ou falsificação externa.</li>
        <li><strong>Ambiente Isolado:</strong> Informações críticas e chaves de acesso ficam blindadas em nosso banco de dados centralizado, impedindo que golpistas obtenham dados mesmo se o smartphone do usuário for comprometido.</li>
      </ul>

      <h2>Por que Abandonar Chats Desprotegidos?</h2>
      <p>Conversar apenas pelo WhatsApp deixa o cliente exposto a táticas de engenharia social de alta precisão. O roteamento por vínculo do Vinc remove o fator humano da checagem: o aplicativo faz a validação técnica de forma invisível, garantindo que você fale apenas com quem realmente tem direito de falar sobre seu processo jurídico.</p>

      <div class="post-signature" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border); text-align: center;">
        <p style="margin: 0 0 8px 0; font-weight: bold; color: var(--text-primary);">Vinc — confirme antes de confiar.</p>
        <p style="margin: 0; font-style: italic; color: var(--text-secondary); font-size: 14px;">Desenvolvido com foco total em soberania tecnológica e segurança jurídica.</p>
      </div>
    `,
    seo: {
      metaTitle: "Roteamento por Vínculo vs WhatsApp na Advocacia | Blog Vinc",
      metaDesc: "Descubra por que a validação de vínculos baseada em contratos e servidores seguros é imensamente superior ao uso de chats abertos do WhatsApp.",
      keywords: "roteamento por vinculo, whatsapp advocacia seguro, servidor seguro vinc, assinatura digital contratos, vinc",
    }
  },
  {
    id: "post-9",
    title: "Privacidade e LGPD: Por que as Notificações do Vinc Não Mostram Informações Sensíveis?",
    slug: "privacidade-lgpd-notificacoes-vinc",
    excerpt: "Descubra como o design inteligente e as notificações genéricas protegem suas informações e evitam a engenharia social visual de acordo com a LGPD.",
    category: CATEGORIES.CIBERSEGURANCA_COMPLIANCE.name,
    categorySlug: CATEGORIES.CIBERSEGURANCA_COMPLIANCE.slug,
    categoryIcon: CATEGORIES.CIBERSEGURANCA_COMPLIANCE.icon,
    categoryColor: CATEGORIES.CIBERSEGURANCA_COMPLIANCE.color,
    publishedAt: "16 Jul 2026",
    readingTime: 4,
    author: AUTHORS.vinc_security,
    featuredImage: "../assets/images/seguranca.jpg",
    content: `
      <p>Muitas pessoas estão acostumadas a ler o conteúdo completo de mensagens diretamente na tela bloqueada do celular. Embora prático, esse hábito representa um risco severo de segurança e privacidade, violando as diretrizes básicas da <strong>Lei Geral de Proteção de Dados (LGPD)</strong>. É por isso que as notificações do Vinc são desenhadas de forma diferente.</p>

      <h2>O Conceito de Notificações Genéricas</h2>
      <p>Quando o seu escritório de advocacia te envia um aviso ou um boleto importante, a notificação do Vinc que aparece na sua tela diz apenas algo como: <em>"Nova atualização de segurança pendente. Toque para verificar."</em></p>
      <p>Nós ocultamos intencionalmente o nome do advogado, o número do processo, valores financeiros ou detalhes do assunto. Essa abordagem simples e direta cumpre objetivos estratégicos:</p>
      <ul>
        <li><strong>Proteção da Tela Bloqueada:</strong> Impede que pessoas ao seu redor (em transporte público, reuniões ou em casa) visualizem dados particulares e sigilosos do seu processo jurídico.</li>
        <li><strong>Prevenção Contra Engenharia Social Visual:</strong> Evita que golpistas ou pessoas mal-intencionadas utilizem as informações que aparecem na tela do seu celular para criar novas abordagens de fraude.</li>
        <li><strong>Minimização de Dados:</strong> O Vinc segue o princípio de exibir apenas o estritamente necessário no ambiente externo, deixando as informações ricas protegidas atrás de uma camada de autenticação biométrica ou senha dentro do aplicativo.</li>
      </ul>

      <div class="post-regra-ouro">
        <span class="post-regra-ouro-label">Regra de Ouro do Vinc</span>
        <p class="post-regra-ouro-text">Confirme antes de confiar.</p>
        <p class="post-regra-ouro-sub">A privacidade de dados deve ser garantida em todas as esferas. O sigilo do seu processo começa no momento em que a tela do seu celular acende.</p>
      </div>

      <h2>Alinhamento com a LGPD e Segurança Corporativa</h2>
      <p>Para escritórios de advocacia, enviar informações de processos por notificações abertas pode ser interpretado como negligência em caso de auditorias de privacidade. O design seguro do Vinc auxilia as bancas de advocacia a estarem em total conformidade legal, oferecendo uma experiência de <em>Privacy by Design</em> (privacidade desde a concepção) para seus clientes finais.</p>
      <p>Para ler os detalhes, o usuário deve destravar o aparelho e acessar a plataforma autenticada. Segurança e privacidade andam de mãos dadas.</p>

      <div class="post-signature" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border); text-align: center;">
        <p style="margin: 0 0 8px 0; font-weight: bold; color: var(--text-primary);">Vinc — confirme antes de confiar.</p>
        <p style="margin: 0; font-style: italic; color: var(--text-secondary); font-size: 14px;">Desenvolvido com foco total em soberania tecnológica e segurança jurídica.</p>
      </div>
    `,
    seo: {
      metaTitle: "Notificações do Vinc e Conformidade LGPD | Blog Vinc",
      metaDesc: "Descubra como as notificações genéricas do Vinc protegem seus dados confidenciais de acordo com a LGPD, impedindo que bisbilhoteiros vejam dados processuais.",
      keywords: "lgpd notificacoes, privacidade de dados celular, notificacoes genericas, seguranca da informacao, vinc",
    }
  },
  {
    id: "post-10",
    title: "\"Escritório Ciente\": O Que Significa Marcar Ciência de um Relato?",
    slug: "escritorio-ciente-marcar-ciencia-relato",
    excerpt: "Esclareça o funcionamento e os limites do botão de ciência no painel do Vinc, garantindo total transparência e alinhamento entre clientes e advogados.",
    category: CATEGORIES.GUIA_FUNCIONALIDADES.name,
    categorySlug: CATEGORIES.GUIA_FUNCIONALIDADES.slug,
    categoryIcon: CATEGORIES.GUIA_FUNCIONALIDADES.icon,
    categoryColor: CATEGORIES.GUIA_FUNCIONALIDADES.color,
    publishedAt: "16 Jul 2026",
    readingTime: 4,
    author: AUTHORS.luiz_gustavo,
    featuredImage: "../assets/images/vinc_shield_client.jpg",
    content: `
      <p>A transparência é a chave para uma comunicação jurídica eficiente. No ecossistema do Vinc, quando um cliente identifica uma atividade suspeita ou um contato estranho e envia um aviso, o escritório de advocacia pode marcar aquele relato como <strong>\"Escritório Ciente\"</strong>. Mas você sabe exatamente o que esse botão significa e quais são as suas responsabilidades?</p>

      <h2>O Fluxo do Relato e Acompanhamento</h2>
      <p>Quando você recebe um contato suspeito no WhatsApp alegando ser do seu escritório e o reporta na plataforma Vinc, um alerta é gerado em tempo real no painel administrativo dos seus advogados. Ao visualizar a notificação, analisar o caso e tomar as providências internas cabíveis, o advogado clica no botão para sinalizar que o escritório está ciente da ocorrência.</p>
      <p>Isso garante que o cliente receba uma confirmação imediata de que seu alerta foi recebido e está sob verificação, fortalecendo o canal de comunicação direto e a relação de parceria contra os criminosos.</p>

      <div class="post-regra-ouro">
        <span class="post-regra-ouro-label">Regra de Ouro do Vinc</span>
        <p class="post-regra-ouro-text">Confirme antes de confiar.</p>
        <p class="post-regra-ouro-sub">A ciência mútua é o primeiro passo para conter golpes. O cliente avisa, o escritório avalia e o sistema documenta a interação com total segurança digital.</p>
      </div>

      <h2>O que \"Ciência\" NÃO Significa</h2>
      <p>Para evitar mal-entendidos e garantir a segurança jurídica, é fundamental esclarecer os limites dessa funcionalidade:</p>
      <ul>
        <li><strong>Não é uma decisão jurídica:</strong> Marcar ciência indica apenas o recebimento técnico do relato de segurança, e não uma orientação processual ou análise do mérito da causa.</li>
        <li><strong>Não confirma a identidade do suspeito:</strong> O selo de ciente apenas acusa que o escritório tomou conhecimento de que alguém tentou se passar por eles, mas não realiza investigações policiais automáticas sobre o autor da fraude.</li>
        <li><strong>Não encerra o caso:</strong> É apenas um marcador de progresso. O processo de investigação de um crime cibernético e o envio de boletins de ocorrência continuam seguindo os rituais tradicionais de segurança e assessoria jurídica.</li>
      </ul>
      <p>Em resumo, o status \"Escritório Ciente\" serve para aproximar o cliente de sua equipe jurídica, eliminando o silêncio que costuma gerar ansiedade e permitindo respostas ágeis em momentos críticos.</p>

      <div class="post-signature" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border); text-align: center;">
        <p style="margin: 0 0 8px 0; font-weight: bold; color: var(--text-primary);">Vinc — confirme antes de confiar.</p>
        <p style="margin: 0; font-style: italic; color: var(--text-secondary); font-size: 14px;">Desenvolvido com foco total em soberania tecnológica e segurança jurídica.</p>
      </div>
    `,
    seo: {
      metaTitle: "Entenda o Status de Escritório Ciente | Blog Vinc",
      metaDesc: "Descubra como o status de Escritório Ciente melhora o acompanhamento de relatos suspeitos e de segurança, fortalecendo a relação entre cliente e escritório.",
      keywords: "escritorio ciente, relato de seguranca vinc, monitoramento de golpes, transparencia juridica, vinc",
    }
  },
  {
    id: "post-11",
    title: "Por que o Vinc Não Possui Cadastro Público?",
    slug: "por-que-vinc-nao-possui-cadastro-publico",
    excerpt: "Descubra por que a entrada na plataforma ocorre apenas por meio de convites e chaves de ativação exclusivas, blindando a reputação dos escritórios parceiros.",
    category: CATEGORIES.GESTAO_REPUTACAO.name,
    categorySlug: CATEGORIES.GESTAO_REPUTACAO.slug,
    categoryIcon: CATEGORIES.GESTAO_REPUTACAO.icon,
    categoryColor: CATEGORIES.GESTAO_REPUTACAO.color,
    publishedAt: "16 Jul 2026",
    readingTime: 4,
    author: AUTHORS.luiz_gustavo,
    featuredImage: "../assets/images/vinc_advocacy_shield.jpg",
    content: `
      <p>Ao navegar pelo site do Vinc, você deve ter percebido que não existe um botão de \"Criar Conta Grátis\" ou \"Cadastre-se\" aberto ao público geral. Essa decisão arquitetônica não é um capricho de design, mas sim um pilar de segurança digital essencial para manter a integridade da nossa plataforma.</p>

      <h2>Proteção Contra Perfis Falsos e Engenharia Social</h2>
      <p>Plataformas com cadastro público e aberto sofrem constantemente com a criação de perfis falsos. Criminosos poderiam facilmente criar uma conta se passando por um advogado legítimo ou criar uma sociedade de advogados fantasma para aplicar golpes de dentro do próprio sistema, gerando falsos selos de verificação.</p>
      <p>Para evitar essa vulnerabilidade de forma definitiva, o Vinc adota uma política rígida de <strong>entrada restrita por convites e chaves de ativação exclusivas</strong>.</p>

      <div class="post-regra-ouro">
        <span class="post-regra-ouro-label">Regra de Ouro do Vinc</span>
        <p class="post-regra-ouro-text">Confirme antes de confiar.</p>
        <p class="post-regra-ouro-sub">A segurança de um ecossistema fechado reside na qualidade e veracidade de seus membros. Cada usuário da nossa rede passa por uma rigorosa validação prévia.</p>
      </div>

      <h2>Como Funciona o Fluxo de Homologação</h2>
      <p>Para que um escritório ou advogado autônomo ingresse na plataforma, a jornada segue um protocolo minucioso:</p>
      <ol>
        <li><strong>Solicitação de Chave de Ativação:</strong> O advogado preenche o formulário oficial de contato fornecendo seus dados institucionais e registro na OAB.</li>
        <li><strong>Auditoria Manual e Verificação Cadastral:</strong> Nosso time de segurança digital valida as credenciais processuais e cadastrais junto ao Cadastro Nacional de Advogados (CNA).</li>
        <li><strong>Emissão da Chave Única:</strong> Após a homologação, o escritório recebe uma chave eletrônica única e criptografada para ativar seu painel seguro.</li>
      </ol>
      <p>Esse modelo de controle absoluto impede fraudes na origem, garante a reputação dos escritórios credenciados e dá aos clientes finais a certeza de que estão falando em um ambiente 100% autêntico e livre de golpistas.</p>

      <div class="post-signature" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border); text-align: center;">
        <p style="margin: 0 0 8px 0; font-weight: bold; color: var(--text-primary);">Vinc — confirme antes de confiar.</p>
        <p style="margin: 0; font-style: italic; color: var(--text-secondary); font-size: 14px;">Desenvolvido com foco total em soberania tecnológica e segurança jurídica.</p>
      </div>
    `,
    seo: {
      metaTitle: "Por Que o Vinc Não Tem Cadastro Aberto | Blog Vinc",
      metaDesc: "Entenda por que o Vinc é um ecossistema fechado e acessível somente por meio de chaves de ativação homologadas e convites exclusivos.",
      keywords: "cadastro fechado vinc, chave de ativação oab, seguranca corporativa, blindagem contra golpistas, vinc",
    }
  },
  {
    id: "post-12",
    title: "Vinc: Blindando a Relação entre Advogados e Clientes contra Fraudes",
    slug: "vinc-blindando-relacao-advogados-clientes",
    excerpt: "No cenário jurídico atual, entenda como o ecossistema do Vinc protege a identidade do escritório e o patrimônio dos clientes através de relações de vínculos autenticados.",
    category: CATEGORIES.GESTAO_REPUTACAO.name,
    categorySlug: CATEGORIES.GESTAO_REPUTACAO.slug,
    categoryIcon: CATEGORIES.GESTAO_REPUTACAO.icon,
    categoryColor: CATEGORIES.GESTAO_REPUTACAO.color,
    publishedAt: "16 Jul 2026",
    readingTime: 4,
    author: AUTHORS.luiz_gustavo,
    featuredImage: "../assets/images/vinc_dashboard_mock.jpg",
    content: `
      <p>No cenário jurídico atual, a reputação e a marca de um escritório de advocacia são seus ativos mais preciosos. Contudo, essa credibilidade conquistada com anos de dedicação também se tornou o alvo principal de quadrilhas especializadas. Criminosos se apropriam de nomes de advogados reais e usam dados de processos públicos para enganar clientes em tentativas de golpes sofisticados.</p>

      <p>Nesse cenário de vulnerabilidade, o <strong>Vinc</strong> surge como a solução definitiva para reestabelecer a segurança e a integridade da comunicação, baseando sua atuação em uma regra de ouro inabalável: <strong>confirmar antes de confiar</strong>.</p>

      <h2>O que é o Vinc?</h2>
      <p>O Vinc é um ecossistema de prevenção a fraudes projetado especificamente para o ambiente jurídico. Diferente de chats e aplicativos de mensagens comuns que não possuem qualquer tipo de checagem profissional, o Vinc não tenta adivinhar ou presumir se um contato é seguro por fotos ou nomes de perfil. Em vez disso, nossa plataforma valida a existência de um <strong>vínculo real</strong> entre as partes antes de autorizar qualquer interação de segurança.</p>

      <div class="post-regra-ouro">
        <span class="post-regra-ouro-label">Regra de Ouro do Vinc</span>
        <p class="post-regra-ouro-text">Confirme antes de confiar.</p>
        <p class="post-regra-ouro-sub">A segurança não deve depender da intuição humana. Toda comunicação sensível precisa ser validada por uma infraestrutura dedicada a confirmar vínculos contratuais reais.</p>
      </div>

      <h2>A Tecnologia do Vínculo Real</h2>
      <p>O coração do Vinc é o seu sistema de roteamento inteligente de segurança. Quando um cliente final recebe uma abordagem duvidosa no dia a dia — como um pedido urgente de transferência via PIX, solicitações de documentos confidenciais ou comunicados sobre andamento processual —, ele simplesmente registra essa interação no aplicativo Vinc.</p>
      <p>A partir daí, a tecnologia inteligente entra em ação de maneira totalmente automatizada:</p>
      <ul>
        <li><strong>Isolamento do Nome:</strong> O sistema desconsidera totalmente o nome informado pelo contato suspeito, usando-o apenas como contexto complementar de análise.</li>
        <li><strong>Identificação de Vínculo:</strong> O sistema faz uma varredura em nossa base de dados centralizada e segura para identificar quais profissionais realmente possuem vínculo contratual legítimo e autorizado com aquele cliente específico.</li>
        <li><strong>Alerta Instantâneo:</strong> O Vinc envia automaticamente um alerta de verificação direto para o painel do advogado responsável cadastrado.</li>
        <li><strong>Confirmação Rápida:</strong> Com apenas alguns cliques no celular ou computador, o advogado confirma ou rejeita a autenticidade daquela solicitação.</li>
      </ul>
      <p>Esse processo inovador elimina por completo a eficácia das táticas mais comuns de engenharia social, tirando dos golpistas a capacidade de enganar as vítimas.</p>

      <h2>Benefícios Claros para Toda a Cadeia de Segurança</h2>
      <p>O modelo baseado em relações autenticadas gera valor imediato para todos os envolvidos na prestação de serviços jurídicos:</p>

      <h3>1. Tranquilidade e Autonomia para Clientes</h3>
      <ul>
        <li><strong>Fim da Incerteza:</strong> Alívio imediato e tranquilidade ao receber qualquer tipo de solicitação ou cobrança.</li>
        <li><strong>Transparência Total:</strong> Acompanhamento em tempo real do status de validação das suas interações de segurança.</li>
        <li><strong>Histórico Seguro:</strong> Acesso fácil ao registro de todas as consultas e confirmações realizadas ao longo do contrato.</li>
      </ul>

      <h3>2. Proteção de Identidade para Advogados</h3>
      <ul>
        <li><strong>Blindagem de Nome:</strong> Proteção ativa da identidade profissional e do registro na OAB de usos indevidos.</li>
        <li><strong>Alertas de Segurança:</strong> Notificações rápidas e seguras sobre contatos suspeitos realizados em nome do profissional.</li>
        <li><strong>Validação Ágil:</strong> Ferramentas fáceis que permitem responder às dúvidas de segurança dos clientes sem interromper a rotina de trabalho.</li>
      </ul>

      <h3>3. Governança e Controle para Escritórios</h3>
      <ul>
        <li><strong>Acesso Homologado:</strong> Cadastro estritamente fechado, sem permissão para entrada pública, mitigando a criação de contas ou identidades falsas na rede.</li>
        <li><strong>Gestão Centralizada:</strong> Painel de controle completo para administração de contratos de clientes, chaves de ativação e usuários autorizados da equipe.</li>
        <li><strong>Soberania Tecnológica:</strong> Domínio absoluto sobre os canais oficiais de comunicação, blindando a integridade da reputação institucional do escritório.</li>
      </ul>

      <h2>Segurança sem Concessões Tecnológicas</h2>
      <p>Para garantir que o sistema seja verdadeiramente imune a adulterações, toda a inteligência e as regras de segurança do Vinc estão hospedadas em nossos servidores protegidos (backend). Nenhuma validação ou decisão crítica é realizada localmente no aplicativo instalado no celular do usuário. Isso significa que mesmo em caso de perda, roubo ou invasão física do smartphone, as chaves criptográficas permanecem totalmente seguras e invioláveis na nuvem.</p>

      <h2>Conclusão</h2>
      <p>À medida que as tentativas de fraudes evoluem e se tornam mais convincentes, as barreiras de proteção precisam acompanhar essa evolução. O Vinc reduz drasticamente a superfície de ataque utilizada pelos estelionatários ao transformar a checagem de identidade em uma validação rigorosa de relacionamento real e legítimo.</p>
      <p>Mais do que simplesmente confirmar quem está falando, o Vinc certifica que aquela pessoa possui o direito e o vínculo real para falar com você.</p>

      <div class="post-cta-box" style="margin-top: 40px; padding: 24px; background-color: var(--ice-blue); border-left: 4px solid var(--blue); border-radius: 0 var(--radius-md) var(--radius-md) 0;">
        <h3 style="margin-top: 0; margin-bottom: 12px; color: var(--blue); font-size: 18px; font-weight: bold;">Quer conhecer uma nova forma de proteger clientes e escritórios?</h3>
        <p style="margin-bottom: 20px; color: var(--text-primary); font-size: 15px; line-height: 1.6;">Conheça o Vinc e descubra como um ecossistema baseado em vínculos reais pode reduzir drasticamente tentativas de fraudes e elevar a confiança mútua na comunicação jurídica.</p>
        <a href="/pages/contato.html" class="btn-primary" style="display: inline-block; text-decoration: none; font-size: 14px; padding: 10px 20px;">Solicitar chave de ativação</a>
      </div>

      <div class="post-signature" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border); text-align: center;">
        <p style="margin: 0 0 8px 0; font-weight: bold; color: var(--text-primary);">Vinc — confirme antes de confiar.</p>
        <p style="margin: 0; font-style: italic; color: var(--text-secondary); font-size: 14px;">Desenvolvido com foco total em soberania tecnológica e segurança jurídica.</p>
      </div>
    `,
    seo: {
      metaTitle: "Vinc: Blindando a Relação entre Advogados e Clientes contra Fraudes | Blog Vinc",
      metaDesc: "Descubra como o ecossistema do Vinc protege a identidade do escritório de advocacia e o patrimônio dos clientes através da tecnologia de vínculo contratual real.",
      keywords: "antifraude advocacia, roteamento de vinculo, blindagem de escritorio, chave de ativação vinc, seguranca juridica"
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
        "url": "https://www.vinc.com.br/assets/icons/vinc_icon_256px_1.png"
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

    <!-- Seção de Interação / Feedback (Fase 1) -->
    <section class="post-interaction-box" id="post-feedback-section" aria-labelledby="feedback-section-title">
      <h3 class="interaction-heading" id="feedback-section-title">📬 Compartilhe sua Opinião</h3>
      
      <form id="feedback-interaction-form" onsubmit="event.preventDefault();">
        <!-- ETAPA 1 — Avaliação do artigo -->
        <fieldset style="border: none; padding: 0; margin: 0 0 24px 0;">
          <legend class="interaction-subheading" style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary); margin-bottom: 12px;">Este artigo foi útil?</legend>
          <div class="rating-options" role="radiogroup" aria-label="Avaliação do artigo">
            <button type="button" class="rating-btn" data-rating="very-useful" role="radio" aria-checked="false" aria-label="Muito útil">
              <span class="emoji" aria-hidden="true">👍</span>
              <span>Muito útil</span>
            </button>
            <button type="button" class="rating-btn" data-rating="useful" role="radio" aria-checked="false" aria-label="Útil">
              <span class="emoji" aria-hidden="true">🙂</span>
              <span>Útil</span>
            </button>
            <button type="button" class="rating-btn" data-rating="so-so" role="radio" aria-checked="false" aria-label="Mais ou menos">
              <span class="emoji" aria-hidden="true">😐</span>
              <span>Mais ou menos</span>
            </button>
            <button type="button" class="rating-btn" data-rating="not-helpful" role="radio" aria-checked="false" aria-label="Não ajudou">
              <span class="emoji" aria-hidden="true">👎</span>
              <span>Não ajudou</span>
            </button>
          </div>
          <div id="rating-feedback-msg" class="feedback-message" style="display: none;" aria-live="polite"></div>
        </fieldset>

        <!-- ETAPA 2 — Interesse em novos conteúdos -->
        <fieldset style="border: none; padding: 0; margin: 0 0 24px 0;">
          <legend class="interaction-subheading" style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary); margin-bottom: 12px;">Gostaria de ler mais conteúdos sobre:</legend>
          <div class="topics-grid" id="topics-selection-grid">
            <label class="topic-label" id="label-golpes">
              <input type="checkbox" name="topics" value="Golpes digitais" id="checkbox-golpes">
              <span>Golpes digitais</span>
            </label>
            <label class="topic-label" id="label-seguranca">
              <input type="checkbox" name="topics" value="Segurança Jurídica" id="checkbox-seguranca">
              <span>Segurança Jurídica</span>
            </label>
            <label class="topic-label" id="label-lgpd">
              <input type="checkbox" name="topics" value="LGPD" id="checkbox-lgpd">
              <span>LGPD</span>
            </label>
            <label class="topic-label" id="label-ia">
              <input type="checkbox" name="topics" value="Inteligência Artificial" id="checkbox-ia">
              <span>Inteligência Artificial</span>
            </label>
            <label class="topic-label" id="label-escritorios">
              <input type="checkbox" name="topics" value="Escritórios de Advocacia" id="checkbox-escritorios">
              <span>Escritórios de Advocacia</span>
            </label>
            <label class="topic-label" id="label-clientes">
              <input type="checkbox" name="topics" value="Clientes" id="checkbox-clientes">
              <span>Clientes</span>
            </label>
            <label class="topic-label" id="label-advogados">
              <input type="checkbox" name="topics" value="Advogados" id="checkbox-advogados">
              <span>Advogados</span>
            </label>
            <label class="topic-label" id="label-engenharia">
              <input type="checkbox" name="topics" value="Engenharia Social" id="checkbox-engenharia">
              <span>Engenharia Social</span>
            </label>
            <label class="topic-label" id="label-seguranca-dig">
              <input type="checkbox" name="topics" value="Segurança Digital" id="checkbox-seguranca-dig">
              <span>Segurança Digital</span>
            </label>
            <label class="topic-label" id="label-outros">
              <input type="checkbox" name="topics" value="Outros" id="checkbox-outros">
              <span>Outros</span>
            </label>
          </div>
          <div id="topics-feedback-msg" class="feedback-message" style="display: none;" aria-live="polite"></div>
        </fieldset>

        <!-- ETAPA 3 — Sugestão de temas -->
        <div class="suggestions-box">
          <label for="suggestion-text" class="interaction-subheading" style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary); margin-bottom: 12px; display: block;">Sugestões ou Comentários (Opcional)</label>
          <textarea id="suggestion-text" class="suggestions-textarea" placeholder="Conte para nós suas sugestões de temas, comentários sobre o blog (ex: frequência de posts) ou feedbacks gerais." aria-label="Sua sugestão de temas ou comentários para o blog"></textarea>
          <button type="button" class="btn-primary btn-submit-suggestion" id="btn-send-suggestion" style="margin-top: 12px;">Enviar sugestão</button>
          <div id="suggestion-feedback-msg" class="feedback-message" style="display: none;" aria-live="polite"></div>
        </div>
      </form>
    </section>

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

  // Inicializa os event listeners do bloco de feedback/interação (Fase 1)
  initFeedbackSection(post);
}

/**
 * Inicializa a seção de feedback interativo do artigo (Fase 1)
 * Prepara a estrutura com IDs consistentes e separação de responsabilidades para futura integração com backend do Vinc.
 */
function initFeedbackSection(post) {
  const postId = post.id;
  const postTitle = post.title;
  const ratingButtons = document.querySelectorAll(".rating-btn");
  const checkboxes = document.querySelectorAll('.topic-label input[type="checkbox"]');
  const sendSuggestionBtn = document.getElementById("btn-send-suggestion");
  const suggestionTextarea = document.getElementById("suggestion-text");

  // Elementos de mensagem de feedback
  const ratingFeedbackMsg = document.getElementById("rating-feedback-msg");
  const topicsFeedbackMsg = document.getElementById("topics-feedback-msg");
  const suggestionFeedbackMsg = document.getElementById("suggestion-feedback-msg");

  // 1. Lógica da Avaliação (Etapa 1)
  ratingButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove classe ativa de todos e desmarca aria-checked
      ratingButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-checked", "false");
      });

      // Ativa o botão selecionado
      btn.classList.add("active");
      btn.setAttribute("aria-checked", "true");

      const ratingValue = btn.getAttribute("data-rating");

      // PONTO DE INTEGRAÇÃO FUTURA COM BACKEND:
      // POST /blog/articles/{postId}/rating => body: { rating: ratingValue }
      console.log(`[Vinc API - Future Rating Integration] Enviar avaliação do post ${postId}: ${ratingValue}`);

      // Exibir feedback visual elegante
      if (ratingFeedbackMsg) {
        ratingFeedbackMsg.style.display = "flex";
        ratingFeedbackMsg.className = "feedback-message success";
        ratingFeedbackMsg.innerHTML = "✨ Sua opinião nos ajuda a produzir conteúdos melhores. Obrigado pelo seu feedback!";
      }
    });
  });

  // 2. Lógica de Interesse em Novos Temas (Etapa 2)
  checkboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      const parentLabel = cb.closest(".topic-label");
      if (cb.checked) {
        parentLabel.classList.add("checked");
      } else {
        parentLabel.classList.remove("checked");
      }

      // Obtém todos os temas marcados
      const selectedTopics = Array.from(checkboxes)
        .filter(c => c.checked)
        .map(c => c.value);

      // PONTO DE INTEGRAÇÃO FUTURA COM BACKEND:
      // POST /blog/articles/{postId}/topics => body: { topics: selectedTopics }
      console.log(`[Vinc API - Future Topics Integration] Enviar temas de interesse para o post ${postId}:`, selectedTopics);

      // Exibir feedback visual discreto
      if (topicsFeedbackMsg) {
        topicsFeedbackMsg.style.display = "flex";
        topicsFeedbackMsg.className = "feedback-message info";
        topicsFeedbackMsg.innerHTML = `📌 Preferências de temas atualizadas com sucesso! (${selectedTopics.length} selecionado(s))`;
        if (selectedTopics.length === 0) {
          topicsFeedbackMsg.style.display = "none";
        }
      }
    });
  });

  // 3. Lógica de Sugestão de Temas (Etapa 3)
  if (sendSuggestionBtn && suggestionTextarea) {
    sendSuggestionBtn.addEventListener("click", () => {
      const text = suggestionTextarea.value.trim();
      const textToSend = text || "Nenhuma sugestão ou comentário enviado";

      // PONTO DE INTEGRAÇÃO FUTURA COM BACKEND:
      // POST /blog/articles/{postId}/suggestions => body: { suggestion: textToSend }
      console.log(`[Vinc API - Future Suggestion Integration] Enviar sugestão para o post ${postId}: ${textToSend}`);

      // Obter avaliação selecionada no momento
      const activeRatingBtn = document.querySelector(".rating-btn.active");
      const activeRatingLabel = activeRatingBtn ? activeRatingBtn.innerText.trim().replace(/\s+/g, " ") : "Nenhuma avaliação selecionada";

      // Obter temas de interesse selecionados
      const selectedTopics = Array.from(checkboxes)
        .filter(c => c.checked)
        .map(c => c.value);
      const topicsText = selectedTopics.length > 0 ? selectedTopics.join(", ") : "Nenhum tema selecionado";

      // Formatar corpo do e-mail com as respostas consolidadas
      const subject = encodeURIComponent(`Feedback do Blog Vinc - Artigo: ${postTitle}`);
      const body = encodeURIComponent(
        `Olá Luiz Gustavo,\n\n` +
        `Seguem as respostas coletadas na seção de feedback e interação do Blog do Vinc:\n\n` +
        `-----------------------------------------\n` +
        `Artigo Lido:\n` +
        `   => ${postTitle} (ID: ${postId})\n\n` +
        `1. Avaliação do Artigo:\n` +
        `   => ${activeRatingLabel}\n\n` +
        `2. Gostaria de ler mais sobre:\n` +
        `   => ${topicsText}\n\n` +
        `3. Sugestão ou Comentários:\n` +
        `   => ${textToSend}\n` +
        `-----------------------------------------\n\n` +
        `Enviado a partir do sistema de feedback interativo do Blog Vinc.`
      );

      // Dispara o envio de e-mail via mailto
      const mailtoUrl = `mailto:contato@luizgustavodev.com?subject=${subject}&body=${body}`;
      
      // Abre o cliente de e-mail do usuário de maneira segura
      const mailLink = document.createElement("a");
      mailLink.href = mailtoUrl;
      mailLink.target = "_blank";
      mailLink.click();

      // Exibir feedback visual de sucesso
      if (suggestionFeedbackMsg) {
        suggestionFeedbackMsg.style.display = "flex";
        suggestionFeedbackMsg.className = "feedback-message success";
        suggestionFeedbackMsg.style.borderLeft = "3px solid var(--verified-green)";
        suggestionFeedbackMsg.style.color = "var(--verified-green)";
        suggestionFeedbackMsg.innerHTML = "🎉 Sugestão enviada com sucesso. Obrigado pela sua contribuição!";
      }

      // Limpa o campo
      suggestionTextarea.value = "";
    });
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
// NEWSLETTER E CADASTRO (INTEGRAÇÃO MAILCHIMP)
// --------------------------------------------------------------------------

/**
 * Inicializa os formulários de inscrição da Newsletter (lateral e rodapé)
 */
function initNewsletter() {
  const forms = document.querySelectorAll(".newsletter-form");

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      const emailInput = form.querySelector('input[name="EMAIL"]');
      const feedback = form.nextElementSibling; // Elemento .newsletter-feedback seguinte

      if (!emailInput || !emailInput.value) {
        e.preventDefault();
        if (feedback) {
          feedback.textContent = "Por favor, digite um e-mail válido.";
          feedback.className = "newsletter-feedback error";
        }
        return;
      }

      // Não chamamos preventDefault: o <form> envia de verdade para o Mailchimp
      // (action + method já configurados no HTML) dentro do iframe oculto
      // "mc-newsletter-frame", sem sair da página. O Mailchimp não libera CORS
      // para o navegador ler a resposta, então a confirmação abaixo é otimista.
      if (feedback) {
        feedback.textContent = "Enviando inscrição...";
        feedback.className = "newsletter-feedback success";
      }

      setTimeout(() => {
        if (feedback) {
          feedback.textContent = "Inscrição enviada! Você já faz parte da nossa lista de segurança.";
          feedback.className = "newsletter-feedback success";
        }
        form.reset();
      }, 1200);
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
