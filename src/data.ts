import { Product, Testimonial, BudgetRequest, CompanySettings, PortfolioItem } from './types';

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Placa de Sinalização de Segurança Fotoluminescente',
    category: 'sinalizacao',
    description: 'Placas de saída de emergência, extintores e rotas de fuga que brilham no escuro em conformidade com as normas ABNT NBR 13434.',
    image: '/foto-vinil-3.jpg',
    priceEstimate: 'Sob consulta (Média R$ 25,00/unid)',
    features: ['Plástico PVC anti-chamas', 'Alta fotoluminescência', 'Fácil fixação com fita dupla face', 'Resistente a raios UV']
  },
  {
    id: 'prod-2',
    name: 'Camisetas Promocionais e Uniformes (Serigrafia)',
    category: 'serigrafia',
    description: 'Personalização de vestuário em alta definição. Perfeito para eventos, uniformes empresariais e ações promocionais de alta durabilidade.',
    image: '/insta-nova-4.jpg',
    priceEstimate: 'A partir de R$ 18,00 (mínimo 20 peças)',
    features: ['Tinta plastisol ou toque zero', 'Tecido 100% algodão ou poliéster', 'Estamparia em até 4 cores', 'Excelente durabilidade na lavagem']
  },
  {
    id: 'prod-3',
    name: 'Adesivo de Vinil Recortado Eletronicamente',
    category: 'adesivos',
    description: 'Adesivos personalizados de vinil em alta resolução para rótulos, decorações, identificações e brindes. Resistentes à água e calor.',
    image: '/foto-vinil-2.jpg',
    priceEstimate: 'Calculado por m² (Média R$ 45,00/m²)',
    features: ['Vinil premium calandrado', 'Recorte digital preciso', 'Opção brilhante ou fosco', 'Fácil aplicação sem bolhas']
  },
  {
    id: 'prod-4',
    name: 'Banner Comercial em Lona com Bastão e Cordão',
    category: 'comunicacao',
    description: 'Banners de alta definição para frentes de lojas, eventos, apresentações acadêmicas ou promoções de produtos.',
    image: '/foto-vinil-3.jpg',
    priceEstimate: 'Média R$ 35,00 (tamanho 80x120cm)',
    features: ['Lona resistente de 440g', 'Impressão digital solvente', 'Acabamento com madeira e ponteiras', 'Alta saturação de cores']
  },
  {
    id: 'prod-5',
    name: 'Placa de Sinalização de Trânsito e Loteamentos',
    category: 'sinalizacao',
    description: 'Placas indicativas e regulamentares para condomínios, estacionamentos privados, rodovias e sinalização de vias urbanas.',
    image: '/foto-vinil-4.jpg',
    priceEstimate: 'Sob consulta',
    features: ['Chapa de aço galvanizado ou ACM', 'Película refletiva grau comercial', 'Altamente resistente a intempéries', 'Fixação em postes ou paredes']
  },
  {
    id: 'prod-6',
    name: 'Adesivação de Veículos e Frotas',
    category: 'comunicacao',
    description: 'Sua marca em movimento. Adesivagem parcial ou total de carros, furgões e caminhões com vinil automotivo de alta durabilidade.',
    image: '/foto-vinil-1.jpg',
    priceEstimate: 'Orçamento sob medida',
    features: ['Vinil automotivo antibolhas', 'Verniz protetivo UV opcional', 'Instalação profissional especializada', 'Remoção limpa sem danificar a pintura']
  },
  {
    id: 'prod-7',
    name: 'Sacolas Ecológicas Personalizadas',
    category: 'serigrafia',
    description: 'Sacolas de TNT ou Algodão Cru estampadas com a sua marca. Ideais para feiras, eventos corporativos e embalagem de produtos diferenciados.',
    image: '/foto-vinil-2.jpg',
    priceEstimate: 'A partir de R$ 4,50 (mínimo 50 peças)',
    features: ['Cores de tecido variadas', 'Estamparia em Silk Screen', 'Costura reforçada de alta resistência', 'Amigável ao meio ambiente']
  },
  {
    id: 'prod-8',
    name: 'Rótulos Adesivos de Alta Resistência para Embalagens',
    category: 'adesivos',
    description: 'Adesivos em bobina ou cartela para cervejas artesanais, cosméticos, alimentos e produtos químicos que necessitam de resistência a umidade.',
    image: '/foto-vinil-4.jpg',
    priceEstimate: 'Orçamento com base em quantidade e tamanho',
    features: ['Material bopp brilhoso, fosco ou metalizado', 'Corte especial a laser', 'Adesivo permanente forte', 'Resistente a congelamento']
  },
  {
    id: 'prod-9',
    name: 'Película Tintada / Profissional',
    category: 'peliculas',
    description: 'Linha de entrada com ótimo custo-benefício. Reduz luminosidade, oferece privacidade e proteção solar básica para residências e veículos.',
    image: '/pelicula-tintada.jpg',
    priceEstimate: 'A partir de R$ 112,00 (rolo 7,5M)',
    features: ['Proteção UV 30% a 50%', 'Redução de luminosidade', 'Fácil instalação', 'Ideal para residências e comércio', '1 ano de garantia']
  },
  {
    id: 'prod-10',
    name: 'Película Carbono / Cerâmica',
    category: 'peliculas',
    description: 'Linha premium com alta rejeição de infravermelho. Não interfere em GPS, rádio ou Bluetooth. Cor uniforme e durabilidade superior.',
    image: '/pelicula-compass.jpg',
    priceEstimate: 'A partir de R$ 189,00 (rolo 7,5M)',
    features: ['Alta rejeição de calor (IR)', 'Bloqueia 99% dos raios UV', 'Não interfere em sinais eletrônicos', 'Não desbota com o tempo', 'Até 15 anos de garantia']
  },
  {
    id: 'prod-11',
    name: 'Película Prata Espelhada',
    category: 'peliculas',
    description: 'Campeã em conforto térmico — reflete até 80% da energia solar. Acabamento cromado em ambas as faces, ideal para fachadas modernas e prédios comerciais.',
    image: '/pelicula-prata.jpg',
    priceEstimate: 'A partir de R$ 275,00 (rolo 7,5M)',
    features: ['Rejeita até 80% da energia solar', 'Efeito espelho externo durante o dia', 'Blindagem contra desbotamento de móveis', 'Reduz drasticamente o uso de ar-condicionado', '5 anos de garantia']
  },
  {
    id: 'prod-12',
    name: 'Película Titanium / Super Titanium',
    category: 'peliculas',
    description: 'Tecnologia de metais nobres com visual luxuoso e moderno. Reflexo metalizado escurecido com visibilidade interna superior às películas comuns.',
    image: '/pelicula-titanium.jpg',
    priceEstimate: 'A partir de R$ 275,00 (rolo 7,5M)',
    features: ['Visual extremamente luxuoso', 'Metais nobres refletem o calor antes de atravessar o vidro', 'Visibilidade interna superior', 'Cor não desbota nem fica roxa', '5 anos de garantia']
  },
  {
    id: 'prod-13',
    name: 'Película Jateado (Privacidade)',
    category: 'peliculas',
    description: 'Imita o visual de vidro jateado de forma reversível e econômica. Oferece privacidade sem bloquear totalmente a luz. Ideal para banheiros, escritórios e divisórias.',
    image: '/insta-nova-3.jpg',
    priceEstimate: 'A partir de R$ 260,00 (rolo 7,5M)',
    features: ['Efeito vidro jateado cristal', 'Privacidade sem bloquear a luz', 'Aplicação reversível', 'Ideal para divisórias e banheiros', 'Entregamos em toda a Grande Vitória']
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Roberto Camargo',
    company: 'Construtora Camargo & Associados',
    rating: 5,
    comment: 'Excelente atendimento! Encomendamos toda a sinalização de segurança fotoluminescente para um condomínio de 4 blocos. Entrega pontual e produtos em conformidade com todas as normas do Corpo de Bombeiros.',
    approved: true,
    createdAt: '2026-05-12T14:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'test-2',
    name: 'Ana Júlia Ramos',
    company: 'Café & Grão Cafeteria',
    rating: 5,
    comment: 'Fizemos os uniformes da nossa equipe de baristas e garçons por serigrafia e as sacolas personalizadas. A qualidade do silk nas camisetas é sensacional, já lavamos dezenas de vezes e as estampas continuam como novas.',
    approved: true,
    createdAt: '2026-06-02T10:15:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'test-3',
    name: 'Lucas Ferreira',
    company: 'Veloce Logística',
    rating: 4,
    comment: 'Fizemos a adesivação de 5 utilitários da nossa frota. O vinil aplicado é excelente e o acabamento dos recortes nas curvas do veículo ficou muito profissional. Altamente recomendado.',
    approved: true,
    createdAt: '2026-06-20T17:45:00Z',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
  }
];

export const initialBudgetRequests: BudgetRequest[] = [
  {
    id: 'ORC-9582',
    customerName: 'Marcus Silva Prado',
    customerEmail: 'marcus.prado@engenhariabrasil.com',
    customerPhone: '(11) 98765-4321',
    customerCompany: 'EB Engenharia e Infraestrutura',
    items: [
      {
        id: 'prod-1',
        name: 'Placa de Sinalização de Segurança Fotoluminescente',
        category: 'sinalizacao',
        quantity: 45,
        observations: 'Sendo 20 placas de saída de emergência de 24x12cm e 25 placas indicadoras de extintor de 20x20cm.'
      }
    ],
    status: 'pending',
    createdAt: '2026-06-24T14:15:00-07:00',
    notes: 'Cliente precisa para vistoria no dia 15 do próximo mês. Solicitação recebida pelo site.',
    totalEstimate: 1125.00
  },
  {
    id: 'ORC-9581',
    customerName: 'Beatriz Vasconcellos',
    customerEmail: 'contato@vibeclothing.com.br',
    customerPhone: '(21) 99888-7766',
    customerCompany: 'Vibe Clothing Ltda',
    items: [
      {
        id: 'prod-2',
        name: 'Camisetas Promocionais e Uniformes (Serigrafia)',
        category: 'serigrafia',
        quantity: 100,
        observations: 'Frente estampada em 1 cor (logo pequeno) e costas com estampa grande em 2 cores. Camisetas na cor preta, tamanhos variados.'
      }
    ],
    status: 'review',
    createdAt: '2026-06-23T11:02:00-07:00',
    notes: 'Estamos cotando tecido 100% algodão fio 30.1 penteado.',
    totalEstimate: 2200.00
  },
  {
    id: 'ORC-9580',
    customerName: 'Rodrigo Antunes Mendonça',
    customerEmail: 'comercial@mendoncaalimentos.com',
    customerPhone: '(31) 97555-1122',
    customerCompany: 'Mendonça Embutidos e Laticínios',
    items: [
      {
        id: 'prod-8',
        name: 'Rótulos Adesivos de Alta Resistência para Embalagens',
        category: 'adesivos',
        quantity: 1500,
        observations: 'Material BOPP Brilhante com corte redondo de 8cm de diâmetro. Enviamos a arte em vetor por e-mail.'
      }
    ],
    status: 'approved',
    createdAt: '2026-06-22T09:40:00-07:00',
    notes: 'Preço de R$ 0,45 por rótulo aprovado pelo cliente. Produção agendada.',
    totalEstimate: 675.00
  },
  {
    id: 'ORC-9579',
    customerName: 'Gabriela Souza',
    customerEmail: 'gabriela.souza@outlook.com',
    customerPhone: '(11) 98111-2233',
    items: [
      {
        id: 'prod-4',
        name: 'Banner Comercial em Lona com Bastão e Cordão',
        category: 'comunicacao',
        quantity: 2,
        width: 100,
        height: 150,
        observations: 'Banners para festa de aniversário infantil. Mandaremos foto do tema.'
      }
    ],
    status: 'completed',
    createdAt: '2026-06-20T15:20:00-07:00',
    notes: 'Entregues e pagos no balcão. Cliente extremamente satisfeito.',
    totalEstimate: 120.00
  }
];

export const initialPortfolioItems: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Adesivação e uniformes — Moto Vix',
    category: 'Comunicação Visual',
    image: '/hero-equipe.jpg',
    description: 'Atendimento e entrega de projeto para a Moto Vix em Serra-ES.'
  },
  {
    id: 'port-2',
    title: 'Estoque de vinil colorido',
    category: 'Adesivos & Vinil',
    image: '/foto-vinil-2.jpg',
    description: 'Rolos de vinil adesivo em diversas cores para recorte e plotagem.'
  },
  {
    id: 'port-3',
    title: 'Vinil em rolos — linha profissional',
    category: 'Adesivos & Vinil',
    image: '/foto-vinil-3.jpg',
    description: 'Linha profissional de vinil para comunicação visual e adesivação.'
  },
  {
    id: 'port-4',
    title: 'Películas metalizadas — estoque',
    category: 'Películas',
    image: '/foto-vinil-1.jpg',
    description: 'Rolos de película metalizada disponíveis em diversas opacidades.'
  },
  {
    id: 'port-5',
    title: 'Vinil decorativo efeito mármore',
    category: 'Adesivos & Vinil',
    image: '/foto-vinil-4.jpg',
    description: 'Vinil decorativo branco com veios dourados para móveis e superfícies.'
  },
  {
    id: 'port-6',
    title: 'Adesivo mosaico aplicado em cozinha',
    category: 'Adesivos & Vinil',
    image: '/foto-vinil-5.jpg',
    description: 'Aplicação de adesivo mosaico decorativo em área de cozinha residencial.'
  },
  {
    id: 'port-7',
    title: 'Cozinha transformada com película jateada',
    category: 'Películas',
    image: '/insta-nova-3.jpg',
    description: 'Resultado de aplicação de película jateada em armários de cozinha moderna. Acabamento elegante e privacidade sem bloquear a luz.'
  },
  {
    id: 'port-8',
    title: 'Dentro da JC — variedade de materiais',
    category: 'Adesivos & Vinil',
    image: '/insta-nova-2.jpg',
    description: 'Estoque completo de vinil e adesivos coloridos disponíveis na loja para pronta entrega.'
  }
];

export const defaultCompanySettings: CompanySettings = {
  name: 'JC Sinalização e Serigrafia',
  phone: '5527992526272',
  phoneFormatted: '(27) 99252-6272',
  phoneLandline: '(27) 3058-1522',
  email: '',
  address: 'Centro Comercial Planalto — Pátio do Posto Triângulo, Rod. Gov. Mário Covas, Planalto de Carapina, Serra - ES, CEP 29162-703',
  hours: 'Seg. a Sex.: 08h às 18h | Sábado: 08h às 12h | Domingo: Fechado',
  instagram: 'https://www.instagram.com/jc_adesivos',
  facebook: '',
  locationUrl: 'https://maps.google.com/maps?q=Planalto+de+Carapina+Serra+ES+29162-703&t=&z=15&ie=UTF8&iwloc=&output=embed',
  latitude: -20.1306,
  longitude: -40.2786
};
