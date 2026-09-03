(() => {
  const profile = JSON.parse(localStorage.getItem(window.CAREER_PROFILE_KEY) || 'null');
  if (!profile) { location.replace('profile.html'); return; }
  const paths = window.CAREER_PATHS;
  // Keep scoring explicit and readable; education is a light signal, interests are stronger.
  const ranked = [...paths].map(path => ({ path, score: (path.interests || []).filter(i => (profile.interests || []).includes(i)).length * 4 + ((path.education || []).includes(profile.education) ? 2 : 0) })).sort((a,b) => b.score - a.score);
  const recommendations = document.getElementById('recommendations');
  const content = document.getElementById('roadmapContent');
  document.getElementById('greeting').textContent = `${profile.name || 'Your'} career roadmap starts here.`;
  document.getElementById('intro').textContent = `We matched your ${profile.education || 'education'} background and interests to practical paths. Start with one small action this week, then build momentum.`;
  const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const renderRecommendations = () => { recommendations.innerHTML = ranked.slice(0, 3).map((item, index) => `<button class="app-card recommendation ${index === 0 ? 'active' : ''}" data-path="${item.path.id}"><span class="app-card-icon">${item.path.icon}</span><h3>${esc(item.path.title)}</h3><p>${esc(item.path.tagline)}</p><span class="small muted">${item.score ? item.score + ' fit points' : 'Explore this path'}</span></button>`).join(''); };
  const renderPath = id => {
    const path = paths.find(item => item.id === id) || ranked[0].path;
    document.querySelectorAll('.recommendation').forEach(card => card.classList.toggle('active', card.dataset.path === path.id));
    document.getElementById('fitBadge').textContent = `${path.icon} ${path.title}`;
    content.innerHTML = `<div class="roadmap-main"><article class="roadmap-card"><h2>🎯 Your end-to-end journey</h2><div class="step-list">${path.milestones.map((milestone, index) => `<div class="step"><span class="step-marker">${index + 1}</span><div><h3>${esc(milestone)}</h3><p>${esc(path.actions[index] || 'Keep building evidence of your progress and ask for feedback.')}</p></div></div>`).join('')}</div></article><article class="roadmap-card"><h2>What you need</h2><ul class="guidance-list">${path.requirements.map(item => `<li>${esc(item)}</li>`).join('')}</ul></article></div><aside class="roadmap-side"><article class="roadmap-card"><div class="profile-chip"><span class="avatar">${esc((profile.name || 'S').slice(0,1).toUpperCase())}</span><div><strong>${esc(profile.name || 'Student')}</strong><div class="small muted">${esc(profile.location || 'Your community')} · ${esc(profile.education || 'Student')}</div></div></div>${profile.goal ? `<p class="small muted" style="margin:14px 0 0"><strong>Your goal:</strong> ${esc(profile.goal)}</p>` : ''}</article><article class="roadmap-card"><h2>Do this next</h2><ul class="guidance-list">${path.actions.slice(0,3).map(item => `<li>${esc(item)}</li>`).join('')}</ul><a class="app-btn app-btn-primary" style="width:100%;margin-top:18px" href="jobs.html">Find matching opportunities →</a></article><article class="roadmap-card"><h2>Watch out for</h2><ul class="guidance-list danger-list">${path.avoid.map(item => `<li>${esc(item)}</li>`).join('')}</ul></article><article class="roadmap-card"><h2>Trusted starting points</h2><ul class="guidance-list">${path.resources.map(item => `<li>${esc(item)}</li>`).join('')}</ul></article></aside>`;
  };
  renderRecommendations(); renderPath(ranked[0].path.id);
  recommendations.addEventListener('click', event => { const card = event.target.closest('[data-path]'); if (card) renderPath(card.dataset.path); });
})();
