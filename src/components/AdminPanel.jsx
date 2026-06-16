import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const SENHA_ADMIN = process.env.REACT_APP_ADMIN_PASSWORD || 'genthe2026';

const estilos = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f4f7fb; color: #1a1a2e; }

  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .login-card { background: #fff; border-radius: 16px; padding: 40px 36px; box-shadow: 0 4px 24px rgba(27,111,171,0.10); width: 100%; max-width: 380px; text-align: center; }
  .login-logo { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 2rem; color: #1B6FAB; letter-spacing: -1px; margin-bottom: 4px; }
  .login-n { color: #6BBF4E; }
  .login-titulo { font-size: 1rem; color: #555; margin-bottom: 28px; }
  .login-card input { width: 100%; padding: 12px 14px; border: 1.5px solid #dde3ed; border-radius: 8px; font-size: 0.95rem; font-family: 'DM Sans', sans-serif; outline: none; margin-bottom: 14px; }
  .login-card input:focus { border-color: #1B6FAB; }
  .login-btn { width: 100%; background: #1B6FAB; color: #fff; border: none; border-radius: 8px; padding: 13px; font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .login-btn:hover { background: #155a8a; }
  .login-erro { color: #e53935; font-size: 0.82rem; margin-bottom: 10px; }

  .admin-wrap { max-width: 1100px; margin: 0 auto; padding: 24px 16px 60px; }

  .admin-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
  .admin-titulo { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.5rem; color: #1B6FAB; }
  .admin-subtitulo { font-size: 0.85rem; color: #888; margin-top: 2px; }
  .btn-sair { background: #f4f7fb; color: #555; border: 1.5px solid #dde3ed; border-radius: 8px; padding: 8px 16px; font-size: 0.85rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .btn-sair:hover { background: #e0eaf4; }

  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px; }
  .stat-card { background: #fff; border-radius: 12px; padding: 16px 18px; box-shadow: 0 2px 8px rgba(27,111,171,0.06); }
  .stat-numero { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 2rem; color: #1B6FAB; }
  .stat-label { font-size: 0.78rem; color: #888; margin-top: 2px; }

  .filtros-wrap { background: #fff; border-radius: 12px; padding: 18px 20px; box-shadow: 0 2px 8px rgba(27,111,171,0.06); margin-bottom: 20px; display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; }
  .filtro-grupo { display: flex; flex-direction: column; gap: 4px; }
  .filtro-grupo label { font-size: 0.78rem; font-weight: 600; color: #555; }
  .filtro-grupo input, .filtro-grupo select { padding: 8px 12px; border: 1.5px solid #dde3ed; border-radius: 8px; font-size: 0.88rem; font-family: 'DM Sans', sans-serif; outline: none; background: #fafbfc; }
  .filtro-grupo input:focus, .filtro-grupo select:focus { border-color: #1B6FAB; }
  .btn-limpar { background: #f4f7fb; color: #1B6FAB; border: 1.5px solid #d0dcea; border-radius: 8px; padding: 8px 16px; font-size: 0.85rem; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; align-self: flex-end; }

  .tabela-wrap { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(27,111,171,0.06); overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
  thead th { background: #1B6FAB; color: #fff; padding: 12px 14px; text-align: left; font-weight: 700; white-space: nowrap; }
  tbody tr { border-bottom: 1px solid #f0f4f8; transition: background 0.15s; }
  tbody tr:hover { background: #f4f7fb; }
  tbody td { padding: 11px 14px; vertical-align: middle; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.76rem; font-weight: 700; }
  .badge-novo { background: #e3f2fd; color: #1565c0; }
  .badge-indicado { background: #e8f5e9; color: #2e7d32; }
  .badge-entrevista { background: #fff8e1; color: #f57f17; }
  .badge-reprovado { background: #fce4ec; color: #c62828; }
  .badge-banco { background: #f3e5f5; color: #6a1b9a; }
  .btn-ver { background: #1B6FAB; color: #fff; border: none; border-radius: 6px; padding: 5px 12px; font-size: 0.8rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .btn-ver:hover { background: #155a8a; }
  .vazio { text-align: center; padding: 48px; color: #aaa; font-size: 0.95rem; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: flex-start; justify-content: center; z-index: 1000; padding: 20px; overflow-y: auto; }
  .modal { background: #fff; border-radius: 16px; width: 100%; max-width: 720px; padding: 32px 28px; position: relative; margin: auto; }
  .modal-fechar { position: absolute; top: 16px; right: 20px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #888; line-height: 1; }
  .modal-fechar:hover { color: #333; }
  .modal-nome { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.4rem; color: #1B6FAB; margin-bottom: 4px; }
  .modal-cargo { font-size: 0.88rem; color: #888; margin-bottom: 20px; }
  .modal-secao { font-size: 0.78rem; font-weight: 700; color: #1B6FAB; text-transform: uppercase; letter-spacing: 1.5px; margin: 20px 0 10px; border-bottom: 2px solid #e8f0f8; padding-bottom: 4px; }
  .modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 24px; }
  .modal-item label { font-size: 0.76rem; color: #888; display: block; margin-bottom: 2px; }
  .modal-item span { font-size: 0.9rem; color: #1a1a2e; font-weight: 500; }
  .modal-item-full { grid-column: 1 / -1; }
  .modal-item-full label { font-size: 0.76rem; color: #888; display: block; margin-bottom: 4px; }
  .modal-item-full p { font-size: 0.9rem; color: #333; line-height: 1.7; background: #f8fafc; border-radius: 8px; padding: 10px 14px; }
  .modal-acoes { display: flex; gap: 10px; margin-top: 24px; flex-wrap: wrap; align-items: center; }
  .select-status { padding: 9px 14px; border: 1.5px solid #dde3ed; border-radius: 8px; font-size: 0.88rem; font-family: 'DM Sans', sans-serif; outline: none; background: #fafbfc; }
  .select-status:focus { border-color: #1B6FAB; }
  .btn-salvar { background: #6BBF4E; color: #fff; border: none; border-radius: 8px; padding: 9px 20px; font-size: 0.88rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .btn-salvar:hover { background: #57a33e; }
  .btn-wpp { background: #25D366; color: #fff; border: none; border-radius: 8px; padding: 9px 18px; font-size: 0.85rem; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .btn-wpp:hover { background: #1ebe5a; }
  .obs-area { width: 100%; padding: 10px 12px; border: 1.5px solid #dde3ed; border-radius: 8px; font-size: 0.88rem; font-family: 'DM Sans', sans-serif; resize: vertical; min-height: 80px; outline: none; margin-top: 10px; }
  .obs-area:focus { border-color: #1B6FAB; }
  .salvando { font-size: 0.8rem; color: #6BBF4E; margin-left: 8px; }

  @media (max-width: 600px) {
    .modal-grid { grid-template-columns: 1fr; }
    .modal { padding: 24px 18px; }
  }
`;

const STATUS_OPCOES = ['Novo','Indicado para entrevista','Em entrevista','Aprovado','Reprovado','Banco de talentos'];

const badgeClass = (s) => {
  if (!s || s === 'Novo') return 'badge badge-novo';
  if (s === 'Indicado para entrevista' || s === 'Em entrevista') return 'badge badge-entrevista';
  if (s === 'Aprovado') return 'badge badge-indicado';
  if (s === 'Reprovado') return 'badge badge-reprovado';
  if (s === 'Banco de talentos') return 'badge badge-banco';
  return 'badge badge-novo';
};

function formatarData(d) {
  if (!d) return '';
  return new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function gerarMensagemWpp(c) {
  return `*CANDIDATO — ASSISTENTE ADMINISTRATIVO*\n` +
    `👤 *Nome:* ${c.nome || ''}\n` +
    `📧 *E-mail:* ${c.email || ''}\n` +
    `📱 *Telefone:* ${c.telefone || ''}\n` +
    `🎂 *Idade:* ${c.idade || ''}\n` +
    `💍 *Estado civil:* ${c.estado_civil || ''}\n` +
    `👶 *Filhos:* ${c.filhos || ''}\n` +
    `📍 *Cidade/Bairro:* ${c.cidade || ''} — ${c.bairro || ''}\n` +
    `🚗 *CNH:* ${c.cnh || ''}\n\n` +
    `📚 *FORMAÇÃO E EXPERIÊNCIA*\n` +
    `Escolaridade: ${c.escolaridade || ''}\n` +
    `Curso superior: ${c.curso_superior || 'Não informado'}\n` +
    `Situação atual: ${c.situacao_atual || ''}${c.atividades_autonomo ? `\nAtividades autônomo: ${c.atividades_autonomo}` : ''}\n` +
    `Tempo experiência adm.: ${c.tempo_experiencia_adm || ''}\n` +
    `Tipo de empresa: ${c.tipo_empresa_atuou || ''}\n` +
    `Experiência em transportadora: ${c.experiencia_transportadora || ''}\n` +
    `Empresas/cargos/períodos: ${c.empresas_cargos_periodos || ''}\n\n` +
    `💻 *COMPETÊNCIAS TÉCNICAS*\n` +
    `Excel: ${c.nivel_excel || ''}\n` +
    `Word: ${c.nivel_word || ''}\n` +
    `Sistemas: ${c.sistemas_utilizados || ''}\n` +
    `CT-e / docs operacionais: ${c.conhecimento_cte || ''}\n` +
    `Cálculos: ${c.gosta_calculos || ''}\n` +
    `Inteligência artificial: ${c.uso_ia || 'Não informado'}\n\n` +
    `🧠 *PERFIL E COMPORTAMENTO*\n` +
    `Feedback: ${c.como_lida_feedback || ''}\n` +
    `Organização: ${c.como_organiza_tarefas || ''}\n` +
    `Erro no trabalho: ${c.ja_cometeu_erro || ''}\n` +
    `Ponto forte: ${c.ponto_forte || ''}\n` +
    `Ponto de melhoria: ${c.ponto_melhoria || 'Não informado'}\n\n` +
    `🗓️ *DISPONIBILIDADE*\n` +
    `Situação atual: ${c.situacao_atual || ''}\n` +
    `Disponibilidade horário: ${c.disponibilidade_horario || ''}\n` +
    `Disponibilidade sábado: ${c.disponibilidade_sabado || ''}\n` +
    `Prazo para início: ${c.prazo_inicio || 'Não informado'}\n` +
    `Pretensão salarial: ${c.pretensao_salarial || ''}\n` +
    `Outro processo seletivo: ${c.outro_processo || 'Não informado'}\n` +
    (c.informacoes_adicionais ? `\n📝 *INFORMAÇÕES ADICIONAIS*\n${c.informacoes_adicionais}\n` : '') +
    `\n📅 Enviado em: ${formatarData(c.created_at)}.`;
}

export default function AdminPanel() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState('');
  const [erroSenha, setErroSenha] = useState(false);

  const [candidatos, setCandidatos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroExp, setFiltroExp] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [candidatoSel, setCandidatoSel] = useState(null);
  const [statusEd, setStatusEd] = useState('');
  const [obsEd, setObsEd] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    const { data } = await supabase
      .from('candidatos_assistente_adm')
      .select('*')
      .order('created_at', { ascending: false });
    setCandidatos(data || []);
    setCarregando(false);
  }, []);

  useEffect(() => { if (autenticado) carregar(); }, [autenticado, carregar]);

  const login = () => {
    if (senha === SENHA_ADMIN) { setAutenticado(true); setErroSenha(false); }
    else { setErroSenha(true); }
  };

  const abrirModal = (c) => {
    setCandidatoSel(c);
    setStatusEd(c.status || 'Novo');
    setObsEd(c.observacoes || '');
    setModalAberto(true);
  };

  const fecharModal = () => { setModalAberto(false); setCandidatoSel(null); };

  const salvarStatus = async () => {
    if (!candidatoSel) return;
    setSalvando(true);
    await supabase.from('candidatos_assistente_adm')
      .update({ status: statusEd, observacoes: obsEd })
      .eq('id', candidatoSel.id);
    setSalvando(false);
    setCandidatos(prev => prev.map(c => c.id === candidatoSel.id ? { ...c, status: statusEd, observacoes: obsEd } : c));
    setCandidatoSel(prev => ({ ...prev, status: statusEd, observacoes: obsEd }));
  };

  const copiarWpp = () => {
    if (!candidatoSel) return;
    navigator.clipboard.writeText(gerarMensagemWpp(candidatoSel));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const candidatosFiltrados = candidatos.filter(c => {
    const texto = busca.toLowerCase();
    const matchBusca = !busca ||
      (c.nome || '').toLowerCase().includes(texto) ||
      (c.email || '').toLowerCase().includes(texto) ||
      (c.bairro || '').toLowerCase().includes(texto);
    const matchStatus = !filtroStatus || (c.status || 'Novo') === filtroStatus;
    const matchExp = !filtroExp || (c.experiencia_transportadora || '').includes(filtroExp);
    return matchBusca && matchStatus && matchExp;
  });

  const totalNovos = candidatos.filter(c => !c.status || c.status === 'Novo').length;
  const totalIndicados = candidatos.filter(c => c.status === 'Indicado para entrevista').length;
  const totalAprovados = candidatos.filter(c => c.status === 'Aprovado').length;
  const totalComTransp = candidatos.filter(c => (c.experiencia_transportadora || '').startsWith('Sim')).length;

  if (!autenticado) {
    return (
      <>
        <style>{estilos}</style>
        <div className="login-wrap">
          <div className="login-card">
            <div className="login-logo">ge<span className="login-n">n</span>the</div>
            <div className="login-titulo">Painel Administrativo<br />Assistente Administrativo</div>
            {erroSenha && <div className="login-erro">Senha incorreta.</div>}
            <input
              type="password" placeholder="Senha de acesso"
              value={senha} onChange={e => setSenha(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
            />
            <button className="login-btn" onClick={login}>Entrar</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{estilos}</style>
      <div className="admin-wrap">

        <div className="admin-header">
          <div>
            <div className="admin-titulo">Painel — Assistente Administrativo</div>
            <div className="admin-subtitulo">Transportadora · Campo Grande/MS</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-sair" onClick={carregar}>↻ Atualizar</button>
            <button className="btn-sair" onClick={() => setAutenticado(false)}>Sair</button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-numero">{candidatos.length}</div><div className="stat-label">Total de candidatos</div></div>
          <div className="stat-card"><div className="stat-numero">{totalNovos}</div><div className="stat-label">Novos / não classificados</div></div>
          <div className="stat-card"><div className="stat-numero">{totalIndicados}</div><div className="stat-label">Indicados para entrevista</div></div>
          <div className="stat-card"><div className="stat-numero">{totalAprovados}</div><div className="stat-label">Aprovados</div></div>
          <div className="stat-card"><div className="stat-numero">{totalComTransp}</div><div className="stat-label">Com exp. em transportadora</div></div>
        </div>

        <div className="filtros-wrap">
          <div className="filtro-grupo">
            <label>Buscar</label>
            <input type="text" placeholder="Nome, e-mail ou bairro..." value={busca} onChange={e => setBusca(e.target.value)} style={{ minWidth: 220 }} />
          </div>
          <div className="filtro-grupo">
            <label>Status</label>
            <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
              <option value="">Todos</option>
              {STATUS_OPCOES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="filtro-grupo">
            <label>Exp. transportadora</label>
            <select value={filtroExp} onChange={e => setFiltroExp(e.target.value)}>
              <option value="">Todos</option>
              <option value="Sim, tenho experiência direta">Experiência direta</option>
              <option value="Sim, atuei em empresa de logística">Logística</option>
              <option value="Não, mas">Sem exp., mas interesse</option>
              <option value="Não tenho">Sem experiência</option>
            </select>
          </div>
          <button className="btn-limpar" onClick={() => { setBusca(''); setFiltroStatus(''); setFiltroExp(''); }}>Limpar</button>
        </div>

        <div className="tabela-wrap">
          {carregando ? (
            <div className="vazio">Carregando candidatos...</div>
          ) : candidatosFiltrados.length === 0 ? (
            <div className="vazio">Nenhum candidato encontrado.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cidade/Bairro</th>
                  <th>Idade</th>
                  <th>Excel</th>
                  <th>Exp. Transportadora</th>
                  <th>Pretensão</th>
                  <th>Status</th>
                  <th>Enviado em</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {candidatosFiltrados.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.nome}</strong></td>
                    <td>{c.cidade}{c.bairro ? ` / ${c.bairro}` : ''}</td>
                    <td>{c.idade}</td>
                    <td>{c.nivel_excel ? c.nivel_excel.split(' ')[0] : '—'}</td>
                    <td style={{ maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.experiencia_transportadora || '—'}
                    </td>
                    <td>{c.pretensao_salarial || '—'}</td>
                    <td><span className={badgeClass(c.status)}>{c.status || 'Novo'}</span></td>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatarData(c.created_at)}</td>
                    <td><button className="btn-ver" onClick={() => abrirModal(c)}>Ver</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* MODAL */}
      {modalAberto && candidatoSel && (
        <div className="modal-overlay" onClick={e => { if (e.target.className === 'modal-overlay') fecharModal(); }}>
          <div className="modal">
            <button className="modal-fechar" onClick={fecharModal}>×</button>
            <div className="modal-nome">{candidatoSel.nome}</div>
            <div className="modal-cargo">Candidato — Assistente Administrativo · {formatarData(candidatoSel.created_at)}</div>

            <div className="modal-secao">Dados Pessoais</div>
            <div className="modal-grid">
              <div className="modal-item"><label>E-mail</label><span>{candidatoSel.email}</span></div>
              <div className="modal-item"><label>Telefone</label><span>{candidatoSel.telefone}</span></div>
              <div className="modal-item"><label>Idade</label><span>{candidatoSel.idade}</span></div>
              <div className="modal-item"><label>Estado civil</label><span>{candidatoSel.estado_civil}</span></div>
              <div className="modal-item"><label>Filhos</label><span>{candidatoSel.filhos}</span></div>
              <div className="modal-item"><label>Cidade / Bairro</label><span>{candidatoSel.cidade} / {candidatoSel.bairro}</span></div>
              <div className="modal-item"><label>CNH</label><span>{candidatoSel.cnh}</span></div>
              <div className="modal-item-full"><label>Com quem mora</label><p>{candidatoSel.mora_com}</p></div>
            </div>

            <div className="modal-secao">Formação e Experiência</div>
            <div className="modal-grid">
              <div className="modal-item"><label>Escolaridade</label><span>{candidatoSel.escolaridade}</span></div>
              <div className="modal-item"><label>Curso superior</label><span>{candidatoSel.curso_superior || '—'}</span></div>
              <div className="modal-item"><label>Situação atual</label><span>{candidatoSel.situacao_atual}</span></div>
              <div className="modal-item"><label>Tempo exp. adm.</label><span>{candidatoSel.tempo_experiencia_adm}</span></div>
              <div className="modal-item"><label>Tipo de empresa</label><span>{candidatoSel.tipo_empresa_atuou}</span></div>
              <div className="modal-item"><label>Exp. transportadora</label><span>{candidatoSel.experiencia_transportadora}</span></div>
              {candidatoSel.atividades_autonomo && (
                <div className="modal-item-full"><label>Atividades como autônomo(a)</label><p>{candidatoSel.atividades_autonomo}</p></div>
              )}
              <div className="modal-item-full"><label>Empresas / cargos / períodos</label><p>{candidatoSel.empresas_cargos_periodos}</p></div>
            </div>

            <div className="modal-secao">Competências Técnicas</div>
            <div className="modal-grid">
              <div className="modal-item"><label>Excel</label><span>{candidatoSel.nivel_excel}</span></div>
              <div className="modal-item"><label>Word</label><span>{candidatoSel.nivel_word}</span></div>
              <div className="modal-item"><label>Cálculos</label><span>{candidatoSel.gosta_calculos}</span></div>
              <div className="modal-item-full"><label>Sistemas utilizados</label><p>{candidatoSel.sistemas_utilizados}</p></div>
              <div className="modal-item-full"><label>CT-e / documentos operacionais</label><p>{candidatoSel.conhecimento_cte}</p></div>
              {candidatoSel.uso_ia && <div className="modal-item-full"><label>Uso de IA</label><p>{candidatoSel.uso_ia}</p></div>}
            </div>

            <div className="modal-secao">Perfil e Comportamento</div>
            <div className="modal-grid">
              <div className="modal-item-full"><label>Como lida com feedbacks</label><p>{candidatoSel.como_lida_feedback}</p></div>
              <div className="modal-item-full"><label>Como organiza tarefas</label><p>{candidatoSel.como_organiza_tarefas}</p></div>
              <div className="modal-item-full"><label>Erro no trabalho</label><p>{candidatoSel.ja_cometeu_erro}</p></div>
              <div className="modal-item-full"><label>Ponto forte</label><p>{candidatoSel.ponto_forte}</p></div>
              {candidatoSel.ponto_melhoria && <div className="modal-item-full"><label>Ponto de melhoria</label><p>{candidatoSel.ponto_melhoria}</p></div>}
            </div>

            <div className="modal-secao">Motivação e Disponibilidade</div>
            <div className="modal-grid">
              <div className="modal-item-full"><label>Motivação para a vaga</label><p>{candidatoSel.motivacao_vaga}</p></div>
              <div className="modal-item-full"><label>Objetivo em 2 anos</label><p>{candidatoSel.objetivo_dois_anos}</p></div>
              <div className="modal-item"><label>Disp. horário</label><span>{candidatoSel.disponibilidade_horario}</span></div>
              <div className="modal-item"><label>Disp. sábados</label><span>{candidatoSel.disponibilidade_sabado}</span></div>
              <div className="modal-item"><label>Prazo para início</label><span>{candidatoSel.prazo_inicio || '—'}</span></div>
              <div className="modal-item"><label>Pretensão salarial</label><span>{candidatoSel.pretensao_salarial}</span></div>
              <div className="modal-item"><label>Outro processo</label><span>{candidatoSel.outro_processo || '—'}</span></div>
              {candidatoSel.informacoes_adicionais && (
                <div className="modal-item-full"><label>Informações adicionais</label><p>{candidatoSel.informacoes_adicionais}</p></div>
              )}
            </div>

            <div className="modal-secao">Classificação e Observações</div>
            <div className="modal-acoes">
              <select className="select-status" value={statusEd} onChange={e => setStatusEd(e.target.value)}>
                {STATUS_OPCOES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="btn-salvar" onClick={salvarStatus}>
                {salvando ? 'Salvando...' : 'Salvar status'}
              </button>
              <button className="btn-wpp" onClick={copiarWpp}>
                {copiado ? '✓ Copiado!' : '📋 Copiar para WhatsApp'}
              </button>
            </div>
            <textarea
              className="obs-area"
              placeholder="Observações internas sobre este candidato..."
              value={obsEd}
              onChange={e => setObsEd(e.target.value)}
            />
          </div>
        </div>
      )}
    </>
  );
}
