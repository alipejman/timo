// Global authentication utilities with COOKIE support
window.AuthUtils = {
  // Cookie utilities
  setCookie: function(name, value, days = 7) {
    console.log(`AuthUtils - Setting cookie: ${name} = ${value ? 'exists' : 'null'}`);
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    const cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    document.cookie = cookieString;
    console.log(`AuthUtils - Cookie set: ${cookieString}`);
    
    // Verify cookie was set
    const verifyCookie = this.getCookie(name);
    console.log(`AuthUtils - Cookie verification: ${name} = ${verifyCookie ? 'exists' : 'missing'}`);
  },

  getCookie: function(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    console.log(`AuthUtils - All cookies: ${document.cookie}`);
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        const value = c.substring(nameEQ.length, c.length);
        console.log(`AuthUtils - Found cookie ${name}: ${value ? 'exists' : 'null'}`);
        return value;
      }
    }
    console.log(`AuthUtils - Cookie ${name} not found`);
    return null;
  },

  deleteCookie: function(name) {
    console.log(`AuthUtils - Deleting cookie: ${name}`);
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  },

  // Get authentication headers
  getAuthHeaders: function() {
    console.log('AuthUtils - Getting auth headers...');
    
    // Try cookie first
    const cookieToken = this.getCookie('token');
    console.log('AuthUtils - Token from cookie:', cookieToken ? 'exists' : 'missing');
    
    // Try localStorage as fallback
    const localToken = localStorage.getItem('token');
    console.log('AuthUtils - Token from localStorage:', localToken ? 'exists' : 'missing');
    
    // Use cookie token if available, otherwise localStorage
    const token = cookieToken || localToken;
    console.log('AuthUtils - Using token:', token ? 'exists' : 'missing');
    console.log('AuthUtils - Token value:', token);
    
    if (!token) {
      console.error('AuthUtils - No token found in cookies or localStorage');
      console.log('AuthUtils - All cookies:', document.cookie);
      console.log('AuthUtils - localStorage contents:', {
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user'),
        allKeys: Object.keys(localStorage)
      });
      return null;
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    console.log('AuthUtils - Generated headers:', headers);
    return headers;
  },

  // Check if user is authenticated
  isAuthenticated: function() {
    const cookieToken = this.getCookie('token');
    const localToken = localStorage.getItem('token');
    const isAuth = !!(cookieToken || localToken);
    console.log('AuthUtils - Authentication check:', {
      cookieToken: !!cookieToken,
      localToken: !!localToken,
      isAuthenticated: isAuth
    });
    return isAuth;
  },

  // Redirect to login if not authenticated
  requireAuth: function() {
    console.log('AuthUtils - Checking authentication requirement...');
    if (!this.isAuthenticated()) {
      console.log('AuthUtils - User not authenticated, redirecting to login');
      window.location.href = 'login.html';
      return false;
    }
    console.log('AuthUtils - User is authenticated');
    return true;
  },

        // Clear authentication data
        logout: function() {
          console.log('AuthUtils - Logging out user...');
          this.deleteCookie('token');
          this.deleteCookie('user');
          localStorage.clear(); // Clear ALL localStorage
          console.log('AuthUtils - User logged out, all tokens cleared');
          window.location.href = 'login.html';
        },

  // Store authentication data
  storeAuth: function(token, user) {
    console.log('AuthUtils - Storing authentication data...');
    console.log('AuthUtils - Token to store:', token ? 'exists' : 'null');
    console.log('AuthUtils - User to store:', user);
    
    // Store in both cookie and localStorage for compatibility
    this.setCookie('token', token, 7); // 7 days
    this.setCookie('user', JSON.stringify(user), 7);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    console.log('AuthUtils - Authentication data stored successfully');
  }
};

// Global function for backward compatibility
window.getAuthHeaders = function() {
  return window.AuthUtils.getAuthHeaders();
};
