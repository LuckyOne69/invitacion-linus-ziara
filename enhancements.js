(() => {
  const panel = document.getElementById('invitation');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reduced.matches) {
    panel.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    }), {root:panel, threshold:0.08});
    panel.querySelectorAll('.slip').forEach(el => observer.observe(el));
  }
  let pending = false;
  panel.addEventListener('scroll', () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      panel.style.setProperty('--progress', panel.scrollTop / Math.max(1,panel.scrollHeight-panel.clientHeight));
      pending = false;
    });
  }, {passive:true});
  const audio = document.getElementById('bgm');
  const syncMusic = () => {
    document.getElementById('iconPlay').style.display = audio.paused ? '' : 'none';
    document.getElementById('iconPause').style.display = audio.paused ? 'none' : '';
    document.getElementById('musicBtn').setAttribute('aria-label',audio.paused ? 'Reproducir música' : 'Pausar música');
    document.getElementById('musicBtn').setAttribute('aria-pressed',String(!audio.paused));
  };
  syncMusic(); ['play','pause','error'].forEach(event => audio.addEventListener(event,syncMusic));
  const params = new URLSearchParams(location.search);
  const rawCapacity = params.get('personas') || '1';
  const capacity = /^\d+$/.test(rawCapacity) ? Math.max(1, Math.min(50, Number(rawCapacity))) : 1;
  document.getElementById('guestCapacity').textContent = 'Invitación válida para ' + capacity + (capacity === 1 ? ' persona' : ' personas');
  document.querySelector('.capacity-note').textContent = capacity === 1 ? 'Hemos reservado este lugar especialmente para ti.' : 'Hemos reservado estos ' + capacity + ' lugares especialmente para ustedes.';
  const partySize = document.getElementById('rsvpPartySize');
  partySize.replaceChildren(...Array.from({length:capacity}, (_, i) => new Option((i+1) + (i === 0 ? ' persona' : ' personas'), String(i+1))));
  partySize.value = String(capacity);
  const attendance = document.getElementById('rsvpAttendance');
  attendance.addEventListener('change', () => { document.getElementById('partySizeField').hidden = attendance.value === 'no'; partySize.disabled = attendance.value === 'no'; });
  const guest = new URLSearchParams(location.search).get('para') || new URLSearchParams(location.search).get('nombre');
  if (guest) document.getElementById('rsvpName').value = guest.trim().slice(0,180);
  ['rsvpName','rsvpPhone'].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => input.setCustomValidity(input.value.trim() ? '' : 'Completa este campo.'));
  });
  document.getElementById('calendarBtn').addEventListener('click', () => {
    const content = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Linus y Ziara//Invitacion//ES','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:linus-ziara-20261107@invitation.local','DTSTAMP:20260911T000000Z','DTSTART:20261107T202000Z','SUMMARY:Boda de Linus y Ziara','LOCATION:En casa de los novios','DESCRIPTION:Formal de noche. Hora local: 4:20 PM (República Dominicana).','URL:https://www.google.com/maps?q=18.35875%2C-70.169000','END:VEVENT','END:VCALENDAR',''].join('\r\n');
    const url = URL.createObjectURL(new Blob([content],{type:'text/calendar;charset=utf-8'}));
    const link = document.createElement('a'); link.href=url;link.download='Boda-Linus-y-Ziara.ics';document.body.append(link);link.click();link.remove();setTimeout(() => URL.revokeObjectURL(url),10000);
  });
  document.querySelectorAll('img').forEach(img => { img.decoding='async'; if (!img.closest('.stage,.slip--hero')) img.loading='lazy'; });
})();
