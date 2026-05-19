import { Colors } from "./Colors";

export interface VisualProps{
    icon: string;
    color: string;
    bg: string;
}

const palette = {
    //module 1
    reciprocity: { icon: 'hand-heart', color: '#2E7D32', bg: '#E8F5E9' },     
    scarcity: { icon: 'timer-sand', color: '#EF6C00', bg: '#FFF3E0' },        
    socialProof: { icon: 'account-group', color: '#0288D1', bg: '#E1F5FE' },  
    authority: { icon: 'shield-star', color: '#6A1B9A', bg: '#F3E5F5' },      
    commitment: { icon: 'handshake', color: '#00695C', bg: '#E0F2F1' },       
    liking: { icon: 'emoticon-wink', color: '#C2185B', bg: '#FCE4EC' },       
    unity: { icon: 'home-heart', color: '#37474F', bg: '#ECEFF1' },           
    fear: { icon: 'alert-octagon', color: '#C62828', bg: '#FFEBEE' },         
    greed: { icon: 'cash-multiple', color: '#F9A825', bg: '#FFFDE7' },        
    curiosity: { icon: 'magnify', color: '#1565C0', bg: '#E3F2FD' },       
    empathy: { icon: 'heart-broken', color: '#D84315', bg: '#FBE9E7' },       
    guilt: { icon: 'scale-balance', color: '#4E342E', bg: '#EFEBE9' },        
    spoofing: { icon: 'incognito', color: '#212121', bg: '#F5F5F5' },         

    //module 2
    homographs: { icon: 'swap-horizontal', color: '#D32F2F', bg: '#FFEBEE' },
    protocols: { icon: 'shield-lock-open', color: '#E65100', bg: '#FFF3E0' },
    subdomains: { icon: 'sitemap', color: '#7B1FA2', bg: '#F3E5F5' },
    tlds: { icon: 'cloud-alert', color: '#5D4037', bg: '#EFEBE9' },

    //module 3
    combination: { icon: 'flask-outline', color: '#00796B', bg: '#E0F2F1' },
    typos: { icon: 'spellcheck', color: '#689F38', bg: '#F1F8E9' },
    awareness: { icon: 'shield-search', color: '#0288D1', bg: '#E1F5FE' },

    //module 4
    priority: { icon: 'lightning-bolt', color: '#E65100', bg: '#FFF3E0' },
    mindset: { icon: 'brain', color: '#1565C0', bg: '#E3F2FD' },
    incibe: { icon: 'bullhorn', color: '#00838F', bg: '#E0F7FA' },
    police: { icon: 'police-badge', color: '#283593', bg: '#E8EAF6' },
    hygiene: { icon: 'security', color: '#2E7D32', bg: '#E8F5E9' },
    updates: { icon: 'update', color: '#AFB42B', bg: '#F9FBE7' },
    mitigation: { icon: 'two-factor-authentication', color: '#C2185B', bg: '#FCE4EC' },

    default: { icon: 'book-open-page-variant', color: Colors.primary, bg: '#F0F4FF' }
};

export const getCardVisuals = (concept: string): VisualProps => {
    const normalize = concept.toLowerCase().trim();

    //module 1
    if (normalize.includes('reciprocidad')) return palette.reciprocity;
    if (normalize.includes('escasez')) return palette.scarcity;
    if (normalize.includes('prueba social')) return palette.socialProof;
    if (normalize.includes('autoridad')) return palette.authority;
    if (normalize.includes('compromiso')) return palette.commitment;
    if (normalize.includes('simpatía')) return palette.liking;
    if (normalize.includes('unidad')) return palette.unity;
    if (normalize.includes('miedo') || normalize.includes('pánico')) return palette.fear;
    if (normalize.includes('codicia')) return palette.greed;
    if (normalize.includes('curiosidad')) return palette.curiosity;
    if (normalize.includes('empatía') || normalize.includes('tragedia')) return palette.empathy;
    if (normalize.includes('culpa')) return palette.guilt;
    if (normalize.includes('suplantación')) return palette.spoofing;

    //module 2
    if (normalize.includes('homógrafos')) return palette.homographs;
    if (normalize.includes('http')) return palette.protocols;
    if (normalize.includes('subdominio')) return palette.subdomains;
    if (normalize.includes('tld')) return palette.tlds;

    //module 3
    if (normalize.includes('combinación')) return palette.combination;
    if (normalize.includes('otras técnicas')) return palette.typos;
    if (normalize.includes('cuenta')) return palette.awareness;

    //module 4
    if (normalize.includes('priorizar')) return palette.priority;
    if (normalize.includes('hábito')) return palette.mindset;
    if (normalize.includes('incibe')) return palette.incibe;
    if (normalize.includes('policía') || normalize.includes('guardia civil')) return palette.police;
    if (normalize.includes('higiene')) return palette.hygiene;
    if (normalize.includes('actualizac')) return palette.updates;
    if (normalize.includes('reducir')) return palette.mitigation;

    return palette.default;
};