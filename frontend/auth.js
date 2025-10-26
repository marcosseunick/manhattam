// Sistema de autenticação e redirecionamento

// Verificar se usuário está logado
function verificarUsuario() {
  const usuario = localStorage.getItem('usuario');
  if (!usuario) {
    window.location.href = 'login.html';
    return null;
  }
  return JSON.parse(usuario);
}

// Verificar se monitor está logado
function verificarMonitor() {
  const monitor = localStorage.getItem('monitor');
  if (!monitor) {
    window.location.href = 'login.html';
    return null;
  }
  return JSON.parse(monitor);
}

// Verificar se é admin senior
function verificarAdminSenior() {
  const monitor = verificarMonitor();
  if (!monitor) return null;
  
  if (monitor.nivel !== 'admin_senior') {
    alert('Acesso negado. Apenas Admin Sênior pode acessar esta página.');
    window.location.href = 'painel_adm.html';
    return null;
  }
  
  return monitor;
}

// Fazer logout
function fazerLogout() {
  localStorage.removeItem('usuario');
  localStorage.removeItem('monitor');
  window.location.href = 'login.html';
}

// Verificar tipo de usuário e redirecionar se necessário
function verificarTipoUsuario() {
  const usuario = localStorage.getItem('usuario');
  const monitor = localStorage.getItem('monitor');
  
  const currentPage = window.location.pathname.split('/').pop();
  
  // Se está na página de login e já está logado, redirecionar
  if (currentPage === 'login.html') {
    if (usuario) {
      window.location.href = 'selecionar-interesse.html';
      return;
    }
    if (monitor) {
      const monitorData = JSON.parse(monitor);
      if (monitorData.nivel === 'admin_senior') {
        window.location.href = 'painel_adm_senior.html';
      } else {
        window.location.href = 'painel_adm.html';
      }
      return;
    }
  }
  
  // Se está na página de seleção de interesse
  if (currentPage === 'selecionar-interesse.html') {
    if (!usuario) {
      window.location.href = 'login.html';
      return;
    }
    if (monitor) {
      window.location.href = 'painel_adm.html';
      return;
    }
  }
  
  // Se está no painel do usuário
  if (currentPage === 'painel_usuario.html') {
    if (!usuario) {
      window.location.href = 'login.html';
      return;
    }
    if (monitor) {
      window.location.href = 'painel_adm.html';
      return;
    }
  }
  
  // Se está no painel admin
  if (currentPage === 'painel_adm.html') {
    if (!monitor) {
      window.location.href = 'login.html';
      return;
    }
    if (usuario) {
      window.location.href = 'painel_usuario.html';
      return;
    }
  }
  
  // Se está no painel admin senior
  if (currentPage === 'painel_adm_senior.html') {
    if (!monitor) {
      window.location.href = 'login.html';
      return;
    }
    const monitorData = JSON.parse(monitor);
    if (monitorData.nivel !== 'admin_senior') {
      window.location.href = 'painel_adm.html';
      return;
    }
    if (usuario) {
      window.location.href = 'painel_usuario.html';
      return;
    }
  }
}

// Executar verificação quando carregar
document.addEventListener('DOMContentLoaded', verificarTipoUsuario);

