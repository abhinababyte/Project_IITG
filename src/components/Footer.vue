<template>
  <footer class="site-footer">
    <div class="footer-content">
      <!-- Column 1: Brand -->
      <div class="footer-col brand-col">
        <div class="logo">
          <span class="brand-name"><strong>Eco</strong>Campus</span>
        </div>
        <p class="brand-desc">
          Empowering campuses to measure, understand, and reduce emissions through data-driven behavioral nudges.
        </p>
        <div class="social-icons">
          <a href="#" class="social-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="#" class="social-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          </a>
          <a href="#" class="social-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
        </div>
      </div>

      <!-- Column 2: Company -->
      <div class="footer-col">
        <h4>Company</h4>
        <ul class="footer-links">
          <li><a href="#" @click.prevent="$emit('navigate', 'about')">About Us</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#" @click.prevent="$emit('navigate', 'about')">Team</a></li>
          <li><a href="#">EcoCampus One</a></li>
        </ul>
      </div>

      <!-- Column 3: Contact -->
      <div class="footer-col">
        <h4>Contact</h4>
        <ul class="footer-links">
          <li><a href="#">Help & Support</a></li>
          <li><a href="#">Partner with us</a></li>
          <li><a href="#" @click.prevent="$emit('navigate', 'contact')">Contact Us</a></li>
        </ul>
      </div>

      <!-- Column 4: Legal -->
      <div class="footer-col">
        <h4>Legal</h4>
        <ul class="footer-links">
          <li><a href="#">Terms & Conditions</a></li>
          <li><a href="#">Cookie Policy</a></li>
          <li><a href="#">Privacy Policy</a></li>
        </ul>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>© 2026 Project EcoCampus by Codex Gigas. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  /* Dark, slightly transparent background for the glass/premium feel matching the image */
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #e2e8f0;
  padding: 4rem 2rem 1.5rem;
  margin-top: 4rem;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  
  /* Make sure it sits above the background but below the fixed ticker */
  position: relative;
  z-index: 10;
  
  /* Extra padding at bottom so the fixed ticker doesn't hide the copyright */
  padding-bottom: 60px;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.brand-col {
  padding-right: 2rem;
}

.logo {
  margin-bottom: 1rem;
}

.brand-name {
  font-size: 1.75rem;
  color: white;
}
.brand-name strong {
  font-weight: 800;
}

.brand-desc {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.social-icons {
  display: flex;
  gap: 1rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  transition: all 0.2s;
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.footer-col h4 {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-links a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--primary-color, #10b981);
}

.footer-bottom {
  max-width: 1200px;
  margin: 3rem auto 0;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.footer-bottom p {
  color: #64748b;
  font-size: 0.85rem;
  margin: 0;
}

@media (max-width: 900px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
  .brand-col {
    padding-right: 0;
  }
}
</style>
