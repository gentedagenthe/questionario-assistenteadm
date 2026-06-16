import React, { useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const TOTAL_ETAPAS = 5;

const estilos = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f4f7fb; color: #1a1a2e; }

  .wrap { max-width: 680px; margin: 0 auto; padding: 24px 16px 60px; }

  .header { text-align: center; margin-bottom: 32px; }
  .logo-texto { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 2rem; color: #1B6FAB; letter-spacing: -1px; }
  .logo-n { color: #6BBF4E; }
  .tagline { font-size: 0.78rem; color: #888; letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }
  .subtitulo-vaga { font-size: 0.9rem; color: #1B6FAB; font-weight: 600; margin-top: 6px; }

  .card-vaga { background: #fff; border-radius: 16px; padding: 32px 28px; box-shadow: 0 2px 16px rgba(27,111,171,0.08); margin-bottom: 24px; }
  .titulo-vaga { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.7rem; color: #1B6FAB; margin-bottom: 4px; }
  .sub-vaga { font-size: 0.9rem; color: #666; margin-bottom: 24px; }
  .grid-info { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .info-card { background: #f4f7fb; border-radius: 10px; padding: 14px 16px; }
  .info-icon { font-size: 1.2rem; margin-bottom: 4px; }
  .info-label { font-size: 0.72rem; color: #888; text-transform: uppercase; letter-spacing: 1px; }
  .info-valor { font-size: 0.95rem; font-weight: 600; color: #1a1a2e; margin-top: 2px; }
  .secao-titulo { font-size: 0.78rem; font-weight: 700; color: #1B6FAB; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; }
  .lista-beneficios { list-style: none; margin-bottom: 24px; }
  .lista-beneficios li { display: flex; align-items: center; gap: 8px; font-size: 0.92rem; color: #444; padding: 5px 0; }
  .check { color: #6BBF4E; font-weight: 700; font-size: 1rem; }
  .lista-requisitos { list-style: none; margin-bottom: 28px; }
  .lista-requisitos li { display: flex; align-items: flex-start; gap: 8px; font-size: 0.9rem; color: #444; padding: 5px 0; line-height: 1.5; }
  .btn-candidatar { width: 100%; background: #1B6FAB; color: #fff; border: none; border-radius: 10px; padding: 16px; font-size: 1rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .btn-candidatar:hover { background: #155a8a; }

  .card-lgpd { background: #fff; border-radius: 16px; padding: 32px 28px; box-shadow: 0 2px 16px rgba(27,111,171,0.08); }
  .lgpd-icon { font-size: 2rem; margin-bottom: 12px; }
  .lgpd-titulo { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.2rem; color: #1B6FAB; margin-bottom: 16px; }
  .lgpd-texto { font-size: 0.88rem; color: #555; line-height: 1.8; margin-bottom: 20px; }
  .lgpd-texto strong { color: #1a1a2e; }
  .lgpd-check { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 20px; cursor: pointer; }
  .lgpd-check input { width: 18px; height: 18px; margin-top: 2px; accent-color: #1B6FAB; cursor: pointer; flex-shrink: 0; }
  .lgpd-check span { font-size: 0.88rem; color: #333; line-height: 1.6; }
  .erro-lgpd { color: #e53935; font-size: 0.82rem; margin-bottom: 12px; }
  .btn-iniciar { width: 100%; background: #6BBF4E; color: #fff; border: none; border-radius: 10px; padding: 16px; font-size: 1rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .btn-iniciar:hover { background: #57a33e; }

  .progresso-wrap { margin-bottom: 28px; }
  .progresso-bar-bg { background: #e0eaf4; border-radius: 99px; height: 6px; margin-bottom: 8px; }
  .progresso-bar { background: linear-gradient(90deg, #1B6FAB, #6BBF4E); border-radius: 99px; height: 6px; transition: width 0.4s; }
  .progresso-texto { font-size: 0.78rem; color: #888; text-align: right; }

  .card-etapa { background: #fff; border-radius: 16px; padding: 32px 28px; box-shadow: 0 2px 16px rgba(27,111,171,0.08); }
  .etapa-titulo { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.4rem; color: #1B6FAB; margin-bottom: 4px; }
  .etapa-sub { font-size: 0.88rem; color: #888; margin-bottom: 28px; }

  .campo { margin-bottom: 20px; }
  .campo label { display: block; font-size: 0.85rem; font-weight: 600; color: #333; margin-bottom: 6px; }
  .obrigatorio { color: #e53935; margin-left: 2px; }
  .campo input, .campo select, .campo textarea {
    width: 100%; padding: 12px 14px; border: 1.5px solid #dde3ed; border-radius: 8px;
    font-size: 0.92rem; font-family: 'DM Sans', sans-serif; color: #1a1a2e;
    background: #fafbfc; transition: border-color 0.2s; outline: none;
  }
  .campo input:focus, .campo select:focus, .campo textarea:focus { border-color: #1B6FAB; background: #fff; }
  .campo textarea { resize: vertical; min-height: 100px; }
  .campo select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%231B6FAB' d='M6 8L0 0h12z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
  .campo-erro input, .campo-erro select, .campo-erro textarea { border-color: #e53935; }
  .msg-erro { color: #e53935; font-size: 0.78rem; margin-top: 4px; }

  .campo-condicional { background: #f0f6ff; border-left: 3px solid #1B6FAB; border-radius: 0 8px 8px 0; padding: 16px 18px; margin-top: -12px; margin-bottom: 20px; }

  .nav-btns { display: flex; gap: 12px; margin-top: 28px; }
  .btn-voltar { flex: 1; background: #f4f7fb; color: #1B6FAB; border: 1.5px solid #d0dcea; border-radius: 10px; padding: 14px; font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .btn-voltar:hover { background: #e0eaf4; }
  .btn-continuar { flex: 2; background: #1B6FAB; color: #fff; border: none; border-radius: 10px; padding: 14px; font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .btn-continuar:hover { background: #155a8a; }
  .btn-enviar { flex: 2; background: #6BBF4E; color: #fff; border: none; border-radius: 10px; padding: 14px; font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
  .btn-enviar:hover { background: #57a33e; }
  .btn-enviar:disabled { background: #aaa; cursor: not-allowed; }

  .card-sucesso { background: #fff; border-radius: 16px; padding: 48px 28px; box-shadow: 0 2px 16px rgba(27,111,171,0.08); text-align: center; }
  .sucesso-icon { font-size: 3.5rem; margin-bottom: 16px; }
  .sucesso-titulo { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.5rem; color: #1B6FAB; margin-bottom: 12px; }
  .sucesso-texto { font-size: 0.92rem; color: #555; line-height: 1.8; }

  .footer { text-align: center; margin-top: 32px; font-size: 0.78rem; color: #aaa; }

  @media (max-width: 480px) {
    .grid-info { grid-template-columns: 1fr 1fr; gap: 8px; }
    .card-vaga, .card-lgpd, .card-etapa { padding: 24px 18px; }
  }
`;

const campoVazio = (v) => !v || v.trim() === '' || v === 'Selecione...';

const CampoWrapper = ({ id, label, obrig, erro, children }) => (
  <div className={`campo${erro ? ' campo-erro' : ''}`}>
    <label htmlFor={id}>{label}{obrig && <span className="obrigatorio"> *</span>}</label>
    {children}
    {erro && <div className="msg-erro">{erro}</div>}
  </div>
);

const CampoInput = ({ id, label, obrig, erro, value, onChange, type = 'text', placeholder = '' }) => (
  <CampoWrapper id={id} label={label} obrig={obrig} erro={erro}>
    <input id={id} type={type} value={value} placeholder={placeholder} onChange={onChange} autoComplete="off" />
  </CampoWrapper>
);

const CampoSelect = ({ id, label, obrig, erro, value, onChange, opcoes }) => (
  <CampoWrapper id={id} label={label} obrig={obrig} erro={erro}>
    <select id={id} value={value} onChange={onChange}>
      <option value="">Selecione...</option>
      {opcoes.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </CampoWrapper>
);

const CampoTextarea = ({ id, label, obrig, erro, value, onChange, placeholder = '' }) => (
  <CampoWrapper id={id} label={label} obrig={obrig} erro={erro}>
    <textarea
      id={id} value={value} placeholder={placeholder} onChange={onChange} rows={4}
      onKeyDown={e => { if (e.key === 'Enter') e.stopPropagation(); }}
    />
  </CampoWrapper>
);

export default function Questionario() {
  const [tela, setTela] = useState('vaga');
  const [lgpdAceite, setLgpdAceite] = useState(false);
  const [lgpdErro, setLgpdErro] = useState(false);
  const [etapa, setEtapa] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');
  const [erros, setErros] = useState({});

  const [dados, setDados] = useState({
    nome: '', cpf: '', email: '', telefone: '', idade: '',
    estado_civil: '', filhos: '', cidade: '', bairro: '', mora_com: '', cnh: '',
    escolaridade: '', curso_superior: '', situacao_atual: '', atividades_autonomo: '',
    tempo_experiencia_adm: '', tipo_empresa_atuou: '', experiencia_transportadora: '',
    empresas_cargos_periodos: '',
    nivel_excel: '', nivel_word: '', sistemas_utilizados: '', conhecimento_cte: '',
    uso_ia: '', gosta_calculos: '',
    como_lida_feedback: '', como_organiza_tarefas: '', ja_cometeu_erro: '',
    ponto_forte: '', ponto_melhoria: '',
    motivacao_vaga: '', objetivo_dois_anos: '', disponibilidade_horario: '',
    disponibilidade_sabado: '', prazo_inicio: '', pretensao_salarial: '',
    outro_processo: '', informacoes_adicionais: ''
  });

  const set = useCallback((campo, valor) => {
    setDados(prev => ({ ...prev, [campo]: valor }));
  }, []);

  const formatarCPF = (v) => {
    const n = v.replace(/\D/g, '').slice(0, 11);
    if (n.length <= 3) return n;
    if (n.length <= 6) return `${n.slice(0,3)}.${n.slice(3)}`;
    if (n.length <= 9) return `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6)}`;
    return `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6,9)}-${n.slice(9)}`;
  };

  const hNome        = useCallback((e) => set('nome', e.target.value), [set]);
  const hCPF         = useCallback((e) => set('cpf', formatarCPF(e.target.value)), [set]);
  const hEmail       = useCallback((e) => set('email', e.target.value), [set]);
  const hTel         = useCallback((e) => set('telefone', e.target.value), [set]);
  const hIdade       = useCallback((e) => set('idade', e.target.value), [set]);
  const hEstCiv      = useCallback((e) => set('estado_civil', e.target.value), [set]);
  const hFilhos      = useCallback((e) => set('filhos', e.target.value), [set]);
  const hCidade      = useCallback((e) => set('cidade', e.target.value), [set]);
  const hBairro      = useCallback((e) => set('bairro', e.target.value), [set]);
  const hMoraCom     = useCallback((e) => set('mora_com', e.target.value), [set]);
  const hCNH         = useCallback((e) => set('cnh', e.target.value), [set]);

  const hEscolaridade  = useCallback((e) => set('escolaridade', e.target.value), [set]);
  const hCurso         = useCallback((e) => set('curso_superior', e.target.value), [set]);
  const hSituacao      = useCallback((e) => set('situacao_atual', e.target.value), [set]);
  const hAtivAuto      = useCallback((e) => set('atividades_autonomo', e.target.value), [set]);
  const hTempoExp      = useCallback((e) => set('tempo_experiencia_adm', e.target.value), [set]);
  const hTipoEmp       = useCallback((e) => set('tipo_empresa_atuou', e.target.value), [set]);
  const hExpTransp     = useCallback((e) => set('experiencia_transportadora', e.target.value), [set]);
  const hEmpresas      = useCallback((e) => set('empresas_cargos_periodos', e.target.value), [set]);

  const hExcel         = useCallback((e) => set('nivel_excel', e.target.value), [set]);
  const hWord          = useCallback((e) => set('nivel_word', e.target.value), [set]);
  const hSistemas      = useCallback((e) => set('sistemas_utilizados', e.target.value), [set]);
  const hCte           = useCallback((e) => set('conhecimento_cte', e.target.value), [set]);
  const hIA            = useCallback((e) => set('uso_ia', e.target.value), [set]);
  const hCalculos      = useCallback((e) => set('gosta_calculos', e.target.value), [set]);

  const hFeedback      = useCallback((e) => set('como_lida_feedback', e.target.value), [set]);
  const hTarefas       = useCallback((e) => set('como_organiza_tarefas', e.target.value), [set]);
  const hErro          = useCallback((e) => set('ja_cometeu_erro', e.target.value), [set]);
  const hForte         = useCallback((e) => set('ponto_forte', e.target.value), [set]);
  const hMelhoria      = useCallback((e) => set('ponto_melhoria', e.target.value), [set]);

  const hMotivacao     = useCallback((e) => set('motivacao_vaga', e.target.value), [set]);
  const hObjetivo      = useCallback((e) => set('objetivo_dois_anos', e.target.value), [set]);
  const hDispHor       = useCallback((e) => set('disponibilidade_horario', e.target.value), [set]);
  const hDispSab       = useCallback((e) => set('disponibilidade_sabado', e.target.value), [set]);
  const hPrazo         = useCallback((e) => set('prazo_inicio', e.target.value), [set]);
  const hPretensao     = useCallback((e) => set('pretensao_salarial', e.target.value), [set]);
  const hOutroProc     = useCallback((e) => set('outro_processo', e.target.value), [set]);
  const hInfoAdic      = useCallback((e) => set('informacoes_adicionais', e.target.value), [set]);

  const validarEtapa = () => {
    const e = {};
    if (etapa === 1) {
      if (campoVazio(dados.nome))         e.nome = 'Campo obrigatório';
      if (campoVazio(dados.cpf) || dados.cpf.replace(/\D/g,'').length < 11) e.cpf = 'CPF inválido';
      if (campoVazio(dados.email))        e.email = 'Campo obrigatório';
      if (campoVazio(dados.telefone))     e.telefone = 'Campo obrigatório';
      if (campoVazio(dados.idade))        e.idade = 'Campo obrigatório';
      if (campoVazio(dados.estado_civil)) e.estado_civil = 'Campo obrigatório';
      if (campoVazio(dados.filhos))       e.filhos = 'Campo obrigatório';
      if (campoVazio(dados.cidade))       e.cidade = 'Campo obrigatório';
      if (campoVazio(dados.bairro))       e.bairro = 'Campo obrigatório';
      if (campoVazio(dados.mora_com))     e.mora_com = 'Campo obrigatório';
      if (campoVazio(dados.cnh))          e.cnh = 'Campo obrigatório';
    }
    if (etapa === 2) {
      if (campoVazio(dados.escolaridade))             e.escolaridade = 'Campo obrigatório';
      if (campoVazio(dados.situacao_atual))           e.situacao_atual = 'Campo obrigatório';
      if (dados.situacao_atual === 'Autônomo(a) / Freelancer' && campoVazio(dados.atividades_autonomo))
        e.atividades_autonomo = 'Campo obrigatório';
      if (campoVazio(dados.tempo_experiencia_adm))    e.tempo_experiencia_adm = 'Campo obrigatório';
      if (campoVazio(dados.tipo_empresa_atuou))       e.tipo_empresa_atuou = 'Campo obrigatório';
      if (campoVazio(dados.experiencia_transportadora)) e.experiencia_transportadora = 'Campo obrigatório';
      if (campoVazio(dados.empresas_cargos_periodos)) e.empresas_cargos_periodos = 'Campo obrigatório';
    }
    if (etapa === 3) {
      if (campoVazio(dados.nivel_excel))         e.nivel_excel = 'Campo obrigatório';
      if (campoVazio(dados.nivel_word))          e.nivel_word = 'Campo obrigatório';
      if (campoVazio(dados.sistemas_utilizados)) e.sistemas_utilizados = 'Campo obrigatório';
      if (campoVazio(dados.conhecimento_cte))    e.conhecimento_cte = 'Campo obrigatório';
      if (campoVazio(dados.gosta_calculos))      e.gosta_calculos = 'Campo obrigatório';
    }
    if (etapa === 4) {
      if (campoVazio(dados.como_lida_feedback))    e.como_lida_feedback = 'Campo obrigatório';
      if (campoVazio(dados.como_organiza_tarefas)) e.como_organiza_tarefas = 'Campo obrigatório';
      if (campoVazio(dados.ja_cometeu_erro))       e.ja_cometeu_erro = 'Campo obrigatório';
      if (campoVazio(dados.ponto_forte))           e.ponto_forte = 'Campo obrigatório';
    }
    if (etapa === 5) {
      if (campoVazio(dados.motivacao_vaga))          e.motivacao_vaga = 'Campo obrigatório';
      if (campoVazio(dados.objetivo_dois_anos))      e.objetivo_dois_anos = 'Campo obrigatório';
      if (campoVazio(dados.disponibilidade_horario)) e.disponibilidade_horario = 'Campo obrigatório';
      if (campoVazio(dados.disponibilidade_sabado))  e.disponibilidade_sabado = 'Campo obrigatório';
      if (campoVazio(dados.pretensao_salarial))      e.pretensao_salarial = 'Campo obrigatório';
    }
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const avancar = () => {
    if (!validarEtapa()) { window.scrollTo(0, 0); return; }
    setEtapa(e => e + 1);
    window.scrollTo(0, 0);
  };

  const voltar = () => { setEtapa(e => e - 1); window.scrollTo(0, 0); };

  const enviar = async () => {
    if (!validarEtapa()) { window.scrollTo(0, 0); return; }
    setEnviando(true);
    setErroEnvio('');
    const { error } = await supabase.from('candidatos_assistente_adm').insert([{ ...dados, lgpd_aceite: true }]);
    setEnviando(false);
    if (error) { setErroEnvio('Ocorreu um erro ao enviar. Por favor, tente novamente.'); return; }
    setTela('sucesso');
    window.scrollTo(0, 0);
  };

  const bloquearEnter = (e) => { if (e.key === 'Enter') e.preventDefault(); };

  return (
    <>
      <style>{estilos}</style>
      <div className="wrap">

        <div className="header">
          <div className="logo-texto">ge<span className="logo-n">n</span>the</div>
          <div className="tagline">gente que entende de gente</div>
          {tela === 'form' && <div className="subtitulo-vaga">Assistente Administrativo · Campo Grande/MS</div>}
        </div>

        {/* TELA DA VAGA */}
        {tela === 'vaga' && (
          <div className="card-vaga">
            <div className="titulo-vaga">Assistente Administrativo</div>
            <div className="sub-vaga">Transportadora · Campo Grande/MS</div>
            <div className="grid-info">
              <div className="info-card"><div className="info-icon">📄</div><div className="info-label">Contratação</div><div className="info-valor">CLT</div></div>
              <div className="info-card"><div className="info-icon">💰</div><div className="info-label">Salário</div><div className="info-valor">R$ 2.600,00</div></div>
              <div className="info-card"><div className="info-icon">🕗</div><div className="info-label">Horário</div><div className="info-valor">Seg a Sex · 08h às 18h</div></div>
              <div className="info-card"><div className="info-icon">📍</div><div className="info-label">Local</div><div className="info-valor">Campo Grande/MS</div></div>
            </div>
            <div className="secao-titulo">🎁 Benefícios</div>
            <ul className="lista-beneficios">
              <li><span className="check">✓</span> Cesta básica</li>
              <li><span className="check">✓</span> Plano Assistencial Capital Saúde</li>
              <li><span className="check">✓</span> Seguro de vida</li>
            </ul>
            <div className="secao-titulo">📚 Requisitos</div>
            <ul className="lista-requisitos">
              <li><span className="check">✓</span> Ensino Médio Completo</li>
              <li><span className="check">✓</span> Informática básica: Word e Excel</li>
              <li><span className="check">✓</span> Noções de sistemas e aplicativos</li>
              <li><span className="check">✓</span> Gostar e ter facilidade com cálculos</li>
              <li><span className="check">✓</span> Diferencial: conhecimento em inteligência artificial</li>
            </ul>
            <button className="btn-candidatar" onClick={() => { setTela('lgpd'); window.scrollTo(0, 0); }}>
              Candidate-se agora →
            </button>
          </div>
        )}

        {/* LGPD */}
        {tela === 'lgpd' && (
          <div className="card-lgpd">
            <div className="lgpd-icon">🔒</div>
            <div className="lgpd-titulo">Proteção de Dados — LGPD</div>
            <div className="lgpd-texto">
              As informações fornecidas neste questionário serão utilizadas exclusivamente para fins de seleção e recrutamento pela <strong>Genthe Consultoria</strong>, em conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD)</strong>.<br /><br />
              Seus dados serão tratados com segurança, sigilo e responsabilidade. Não serão compartilhados com terceiros sem sua autorização prévia e expressa, exceto com a empresa contratante vinculada a este processo seletivo.<br /><br />
              Você poderá solicitar a correção, atualização ou exclusão dos seus dados a qualquer momento pelo e-mail <strong>contato@genthe.com.br</strong>.
            </div>
            <label className="lgpd-check">
              <input type="checkbox" checked={lgpdAceite} onChange={e => { setLgpdAceite(e.target.checked); setLgpdErro(false); }} />
              <span>Li e concordo com o tratamento dos meus dados pessoais para participação neste processo seletivo, conforme a LGPD.</span>
            </label>
            {lgpdErro && <div className="erro-lgpd">É necessário concordar com os termos para continuar.</div>}
            <button className="btn-iniciar" onClick={() => {
              if (!lgpdAceite) { setLgpdErro(true); return; }
              setTela('form'); window.scrollTo(0, 0);
            }}>Iniciar questionário →</button>
          </div>
        )}

        {/* FORMULÁRIO */}
        {tela === 'form' && (
          <>
            <div className="progresso-wrap">
              <div className="progresso-bar-bg">
                <div className="progresso-bar" style={{ width: `${(etapa / TOTAL_ETAPAS) * 100}%` }} />
              </div>
              <div className="progresso-texto">Etapa {etapa} de {TOTAL_ETAPAS}</div>
            </div>

            <div className="card-etapa" onKeyDown={bloquearEnter}>

              {/* ETAPA 1 */}
              {etapa === 1 && (
                <>
                  <div className="etapa-titulo">Dados Pessoais</div>
                  <div className="etapa-sub">Vamos começar com suas informações básicas.</div>
                  <CampoInput id="nome" label="Nome completo" obrig erro={erros.nome} value={dados.nome} onChange={hNome} />
                  <CampoInput id="cpf" label="CPF" obrig erro={erros.cpf} value={dados.cpf} onChange={hCPF} placeholder="000.000.000-00" />
                  <CampoInput id="email" label="E-mail" obrig erro={erros.email} value={dados.email} onChange={hEmail} type="email" />
                  <CampoInput id="telefone" label="Telefone / WhatsApp" obrig erro={erros.telefone} value={dados.telefone} onChange={hTel} />
                  <CampoInput id="idade" label="Idade" obrig erro={erros.idade} value={dados.idade} onChange={hIdade} />
                  <CampoSelect id="estado_civil" label="Estado civil" obrig erro={erros.estado_civil} value={dados.estado_civil} onChange={hEstCiv}
                    opcoes={['Solteiro(a)','Casado(a)','União estável','Divorciado(a)','Viúvo(a)']} />
                  <CampoSelect id="filhos" label="Possui filhos?" obrig erro={erros.filhos} value={dados.filhos} onChange={hFilhos}
                    opcoes={['Não','Sim, 1 filho','Sim, 2 filhos','Sim, 3 ou mais filhos']} />
                  <CampoInput id="cidade" label="Cidade" obrig erro={erros.cidade} value={dados.cidade} onChange={hCidade} />
                  <CampoInput id="bairro" label="Bairro" obrig erro={erros.bairro} value={dados.bairro} onChange={hBairro} />
                  <CampoTextarea id="mora_com" label="Com quem mora atualmente?" obrig erro={erros.mora_com} value={dados.mora_com} onChange={hMoraCom}
                    placeholder="Ex: sozinho(a), com cônjuge, com família..." />
                  <CampoSelect id="cnh" label="Possui CNH?" obrig erro={erros.cnh} value={dados.cnh} onChange={hCNH}
                    opcoes={['Não possuo','Sim — categoria A','Sim — categoria B','Sim — categorias A e B','Sim — categoria C ou superior']} />
                </>
              )}

              {/* ETAPA 2 */}
              {etapa === 2 && (
                <>
                  <div className="etapa-titulo">Formação e Experiência</div>
                  <div className="etapa-sub">Conte-nos sobre sua trajetória acadêmica e profissional.</div>
                  <CampoSelect id="escolaridade" label="Qual é sua escolaridade?" obrig erro={erros.escolaridade} value={dados.escolaridade} onChange={hEscolaridade}
                    opcoes={['Ensino Médio completo','Ensino Superior incompleto','Ensino Superior completo','Pós-graduação']} />
                  <CampoInput id="curso_superior" label="Se estiver cursando ou concluiu ensino superior, qual o curso e a instituição?"
                    erro={erros.curso_superior} value={dados.curso_superior} onChange={hCurso}
                    placeholder="Ex: Logística — UFMS, cursando 3º semestre" />
                  <CampoSelect id="situacao_atual" label="Qual é sua situação profissional atual?" obrig erro={erros.situacao_atual} value={dados.situacao_atual} onChange={hSituacao}
                    opcoes={['Empregado(a) CLT','Autônomo(a) / Freelancer','Desempregado(a)']} />
                  {dados.situacao_atual === 'Autônomo(a) / Freelancer' && (
                    <div className="campo-condicional">
                      <CampoTextarea id="atividades_autonomo" label="Quais atividades você realiza como autônomo(a)?" obrig
                        erro={erros.atividades_autonomo} value={dados.atividades_autonomo} onChange={hAtivAuto}
                        placeholder="Descreva os serviços que presta, para quem e com que frequência..." />
                    </div>
                  )}
                  <CampoSelect id="tempo_experiencia_adm" label="Há quanto tempo você atua em funções administrativas?" obrig erro={erros.tempo_experiencia_adm} value={dados.tempo_experiencia_adm} onChange={hTempoExp}
                    opcoes={['Não possuo experiência administrativa','Menos de 6 meses','Entre 6 meses e 1 ano','Entre 1 e 3 anos','Acima de 3 anos']} />
                  <CampoSelect id="tipo_empresa_atuou" label="Em qual tipo de empresa você já atuou?" obrig erro={erros.tipo_empresa_atuou} value={dados.tipo_empresa_atuou} onChange={hTipoEmp}
                    opcoes={['Transportadora / Logística','Comércio / Varejo','Indústria','Serviços / Escritório','Outro segmento']} />
                  <CampoSelect id="experiencia_transportadora" label="Você já trabalhou em transportadora ou empresa de logística?" obrig erro={erros.experiencia_transportadora} value={dados.experiencia_transportadora} onChange={hExpTransp}
                    opcoes={['Sim, tenho experiência direta em transportadora','Sim, atuei em empresa de logística','Não, mas tenho interesse e disponibilidade para aprender','Não tenho experiência na área']} />
                  <CampoTextarea id="empresas_cargos_periodos" label="Cite as empresas onde trabalhou, o cargo e o período de cada experiência" obrig
                    erro={erros.empresas_cargos_periodos} value={dados.empresas_cargos_periodos} onChange={hEmpresas}
                    placeholder="Ex: Transportadora XYZ — Auxiliar Administrativo — Jan/2022 a Mar/2024" />
                </>
              )}

              {/* ETAPA 3 */}
              {etapa === 3 && (
                <>
                  <div className="etapa-titulo">Competências Técnicas</div>
                  <div className="etapa-sub">Vamos entender seus conhecimentos em ferramentas e sistemas.</div>
                  <CampoSelect id="nivel_excel" label="Como você avalia seu conhecimento em Excel?" obrig erro={erros.nivel_excel} value={dados.nivel_excel} onChange={hExcel}
                    opcoes={['Não sei usar','Básico (digitar, formatar, soma simples)','Intermediário (PROCV, filtros, tabela dinâmica)','Avançado (macros, dashboards, funções complexas)']} />
                  <CampoSelect id="nivel_word" label="Como você avalia seu conhecimento em Word?" obrig erro={erros.nivel_word} value={dados.nivel_word} onChange={hWord}
                    opcoes={['Não sei usar','Básico (digitar e formatar textos simples)','Intermediário (tabelas, sumário, estilos)','Avançado (mala direta, macros, documentos complexos)']} />
                  <CampoTextarea id="sistemas_utilizados" label="Quais sistemas ou aplicativos você já utilizou no trabalho?" obrig
                    erro={erros.sistemas_utilizados} value={dados.sistemas_utilizados} onChange={hSistemas}
                    placeholder="Ex: SAP — lançamento de notas fiscais; TOTVS — controle de estoque; Portais de parceiros..." />
                  <CampoTextarea id="conhecimento_cte" label="Você conhece ou já emitiu CT-e ou documentos operacionais de transportadora?" obrig
                    erro={erros.conhecimento_cte} value={dados.conhecimento_cte} onChange={hCte}
                    placeholder="Descreva o que já fez ou informe que não possui experiência nesse documento específico..." />
                  <CampoSelect id="gosta_calculos" label="Você tem facilidade e gosta de trabalhar com cálculos e números?" obrig erro={erros.gosta_calculos} value={dados.gosta_calculos} onChange={hCalculos}
                    opcoes={['Sim, tenho muita facilidade e gosto muito','Sim, tenho facilidade razoável','Tenho alguma dificuldade mas me esforço','Não tenho facilidade com cálculos']} />
                  <CampoTextarea id="uso_ia" label="Você utiliza alguma ferramenta de inteligência artificial no dia a dia?"
                    erro={erros.uso_ia} value={dados.uso_ia} onChange={hIA}
                    placeholder="Ex: ChatGPT para redigir textos, Copilot para resumir documentos... Ou: ainda não utilizo." />
                </>
              )}

              {/* ETAPA 4 */}
              {etapa === 4 && (
                <>
                  <div className="etapa-titulo">Perfil e Comportamento</div>
                  <div className="etapa-sub">Queremos entender como você trabalha e se relaciona com o ambiente profissional.</div>
                  <CampoTextarea id="como_lida_feedback" label="Como você lida com feedbacks e correções no trabalho?" obrig
                    erro={erros.como_lida_feedback} value={dados.como_lida_feedback} onChange={hFeedback}
                    placeholder="Descreva sua postura ao receber uma crítica ou sugestão de melhoria..." />
                  <CampoTextarea id="como_organiza_tarefas" label="Como você organiza suas tarefas quando há várias demandas ao mesmo tempo?" obrig
                    erro={erros.como_organiza_tarefas} value={dados.como_organiza_tarefas} onChange={hTarefas}
                    placeholder="Descreva seu método de organização e priorização..." />
                  <CampoTextarea id="ja_cometeu_erro" label="Você já cometeu um erro no trabalho? O que aconteceu e como resolveu?" obrig
                    erro={erros.ja_cometeu_erro} value={dados.ja_cometeu_erro} onChange={hErro}
                    placeholder="Seja honesto(a). Queremos entender como você age quando algo dá errado..." />
                  <CampoTextarea id="ponto_forte" label="Qual é o seu maior ponto forte para esta vaga? Por quê?" obrig
                    erro={erros.ponto_forte} value={dados.ponto_forte} onChange={hForte}
                    placeholder="Descreva o que você considera ser seu diferencial para esta função..." />
                  <CampoTextarea id="ponto_melhoria" label="Em qual aspecto você ainda tem mais a desenvolver profissionalmente?"
                    erro={erros.ponto_melhoria} value={dados.ponto_melhoria} onChange={hMelhoria}
                    placeholder="Seja sincero(a). O que você ainda quer aprender ou melhorar?" />
                </>
              )}

              {/* ETAPA 5 */}
              {etapa === 5 && (
                <>
                  <div className="etapa-titulo">Motivação e Disponibilidade</div>
                  <div className="etapa-sub">Últimas informações antes de concluir.</div>
                  <CampoTextarea id="motivacao_vaga" label="Por que você tem interesse nesta vaga em uma transportadora?" obrig
                    erro={erros.motivacao_vaga} value={dados.motivacao_vaga} onChange={hMotivacao}
                    placeholder="Conte o que te motivou a se candidatar a esta oportunidade..." />
                  <CampoTextarea id="objetivo_dois_anos" label="Qual é o seu objetivo profissional nos próximos dois anos?" obrig
                    erro={erros.objetivo_dois_anos} value={dados.objetivo_dois_anos} onChange={hObjetivo}
                    placeholder="Descreva onde quer estar profissionalmente daqui a dois anos..." />
                  <CampoSelect id="disponibilidade_horario" label="O horário é de segunda a sexta, 08h às 18h. Você tem disponibilidade?" obrig
                    erro={erros.disponibilidade_horario} value={dados.disponibilidade_horario} onChange={hDispHor}
                    opcoes={['Sim, total disponibilidade','Sim, com ressalvas','Não tenho disponibilidade']} />
                  <CampoSelect id="disponibilidade_sabado" label="Os sábados alternados são em home office, por demanda. Você tem disponibilidade?" obrig
                    erro={erros.disponibilidade_sabado} value={dados.disponibilidade_sabado} onChange={hDispSab}
                    opcoes={['Sim, sem restrições','Sim, com ressalvas','Não tenho disponibilidade aos sábados']} />
                  <CampoInput id="prazo_inicio" label="Caso esteja empregado(a), qual é seu prazo de aviso prévio ou disponibilidade para início?"
                    erro={erros.prazo_inicio} value={dados.prazo_inicio} onChange={hPrazo}
                    placeholder="Ex: imediata, 15 dias, 30 dias..." />
                  <CampoInput id="pretensao_salarial" label="Qual é a sua pretensão salarial?" obrig
                    erro={erros.pretensao_salarial} value={dados.pretensao_salarial} onChange={hPretensao}
                    placeholder="R$ " />
                  <CampoSelect id="outro_processo" label="Você está participando de outro processo seletivo no momento?"
                    erro={erros.outro_processo} value={dados.outro_processo} onChange={hOutroProc}
                    opcoes={['Não','Sim']} />
                  <CampoTextarea id="informacoes_adicionais" label="Há algo mais que gostaria de compartilhar sobre você ou sua candidatura?"
                    erro={erros.informacoes_adicionais} value={dados.informacoes_adicionais} onChange={hInfoAdic}
                    placeholder="Opcional — compartilhe qualquer informação que considere relevante..." />
                  {erroEnvio && <div className="msg-erro" style={{ marginBottom: '12px' }}>{erroEnvio}</div>}
                </>
              )}

              <div className="nav-btns">
                {etapa > 1 && <button className="btn-voltar" type="button" onClick={voltar}>← Voltar</button>}
                {etapa < TOTAL_ETAPAS && <button className="btn-continuar" type="button" onClick={avancar}>Continuar →</button>}
                {etapa === TOTAL_ETAPAS && (
                  <button className="btn-enviar" type="button" onClick={enviar} disabled={enviando}>
                    {enviando ? 'Enviando...' : 'Enviar questionário ✓'}
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* SUCESSO */}
        {tela === 'sucesso' && (
          <div className="card-sucesso">
            <div className="sucesso-icon">✅</div>
            <div className="sucesso-titulo">Questionário enviado!</div>
            <div className="sucesso-texto">
              Obrigado pela participação. Nossa equipe analisará suas respostas e, se houver compatibilidade com a vaga de <strong>Assistente Administrativo</strong>, entraremos em contato em breve.<br /><br />
              <strong>Genthe — que entende de gente.</strong>
            </div>
          </div>
        )}

        <div className="footer">genthe.com.br · contato@genthe.com.br</div>
      </div>
    </>
  );
}
