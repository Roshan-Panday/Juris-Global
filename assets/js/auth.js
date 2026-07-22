
/* ── AUTHENTICATION & RBAC MODULE ── */
// Seed default users if none exist
if (!localStorage.getItem('juris_users')) {
  localStorage.setItem('juris_users', JSON.stringify([
    { username: 'admin', password: 'btoa_admin123', role: 'admin' },
    { username: 'editor', password: 'btoa_editor123', role: 'editor' }
  ]));
}

const Auth = {
  getUsers: () => JSON.parse(localStorage.getItem('juris_users') || '[]'),
  saveUsers: (users) => localStorage.setItem('juris_users', JSON.stringify(users)),
  
  getCurrentUser: () => {
    const user = localStorage.getItem('juris_current_user');
    return user ? JSON.parse(user) : null;
  },

  login: (username, password) => {
    // Check lockout
    const lockout = localStorage.getItem('juris_lockout');
    if (lockout && Date.now() < parseInt(lockout)) {
      const remaining = Math.ceil((parseInt(lockout) - Date.now()) / 60000);
      return { success: false, msg: `Too many attempts. Locked out for ${remaining} minutes.` };
    }

    const users = Auth.getUsers();
    // Simulate hashed password check (using a simple prefix check for demo purposes)
    const user = users.find(u => u.username === username && u.password === 'btoa_' + password);

    if (user) {
      localStorage.setItem('juris_current_user', JSON.stringify({ username: user.username, role: user.role }));
      localStorage.removeItem('juris_login_attempts');
      return { success: true, role: user.role };
    } else {
      let attempts = parseInt(localStorage.getItem('juris_login_attempts') || '0') + 1;
      localStorage.setItem('juris_login_attempts', attempts.toString());
      if (attempts >= 3) {
        localStorage.setItem('juris_lockout', (Date.now() + 15 * 60000).toString()); // 15 mins
        return { success: false, msg: 'Account locked for 15 minutes due to 3 failed attempts.' };
      }
      return { success: false, msg: `Invalid credentials. Attempt ${attempts}/3.` };
    }
  },

  logout: () => {
    localStorage.removeItem('juris_current_user');
    window.location.href = 'login.html';
  },

  requireAuth: (allowedRoles = ['admin', 'editor']) => {
    const user = Auth.getCurrentUser();
    if (!user || !allowedRoles.includes(user.role)) {
      window.location.href = 'login.html';
    }
  },

  addUser: (currentAdmin, newUsername, newPassword, newRole) => {
    if (currentAdmin.role !== 'admin') return { success: false, msg: 'Permission denied.' };
    const users = Auth.getUsers();
    if (users.some(u => u.username === newUsername)) return { success: false, msg: 'User already exists.' };
    users.push({ username: newUsername, password: 'btoa_' + newPassword, role: newRole });
    Auth.saveUsers(users);
    return { success: true };
  },

  deleteUser: (currentAdmin, targetUsername) => {
    if (currentAdmin.role !== 'admin') return { success: false, msg: 'Permission denied.' };
    if (targetUsername === currentAdmin.username) return { success: false, msg: 'Cannot delete yourself.' };
    let users = Auth.getUsers();
    users = users.filter(u => u.username !== targetUsername);
    Auth.saveUsers(users);
    return { success: true };
  }
};
