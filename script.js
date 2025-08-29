document.addEventListener('DOMContentLoaded', function () {
  
  let likeCount = 0;
  let coinCount = 100;
  let copyCount = 0;

  const likeCountEl = document.getElementById('likeCount');
  const coinCountEl = document.getElementById('coinCount');
  const copyCountEl = document.getElementById('copyCount');
  const historyListEl = document.getElementById('historyList');
  const historyEmpty = document.getElementById('historyEmpty');
  const clearHistoryBtn = document.getElementById('clearHistory');

  function updateCounters() {
    likeCountEl.textContent = String(likeCount);
    coinCountEl.textContent = String(coinCount);
    copyCountEl.textContent = String(copyCount);
  }
  updateCounters();

  
  document.querySelectorAll('.card-heart').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      likeCount++;
      updateCounters();
      const svg = btn.querySelector('.heart-icon');
      svg.classList.toggle('heart-filled');
    });
  });

  
  document.querySelectorAll('.btn-copy').forEach(function (btn) {
    btn.addEventListener('click', async function (e) {
      e.stopPropagation();
      const card = btn.closest('.card');
      if (!card) return;
      const number = card.dataset.number || card.querySelector('.text-2xl')?.textContent?.trim() || '';
      try {
        await navigator.clipboard.writeText(number);
        copyCount++;
        updateCounters();
        alert(`Copied: ${number}`);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = number;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          copyCount++;
          updateCounters();
          alert(`Copied (fallback): ${number}`);
        } catch {
          alert('Copy failed');
        }
        textarea.remove();
      }
    });
  });

  
  document.querySelectorAll('.btn-call').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const card = btn.closest('.card');
      if (!card) return;
      const serviceName = card.dataset.service || 'Service';
      const number = card.dataset.number || card.querySelector('.text-2xl')?.textContent?.trim() || '';

      if (coinCount < 20) {
        alert('Insufficient coins. Each call costs 20 coins.');
        return;
      }

      coinCount -= 20;
      updateCounters();

      alert(`Calling ${serviceName} — ${number}`);

      const timeStr = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });
      addHistory({ name: serviceName, number, time: timeStr });
    });
  });

  
  function addHistory(entry) {
    if (historyEmpty) historyEmpty.style.display = 'none';

    const item = document.createElement('div');
    item.className = 'history-item';

    const left = document.createElement('div');
    left.innerHTML =
      `<div class="text-sm font-medium">${escapeHtml(entry.name)}</div>
       <div class="text-xs text-slate-500">${escapeHtml(entry.number)}</div>`;

    const right = document.createElement('div');
    right.innerHTML = `<div class="text-xs text-slate-400">${escapeHtml(entry.time)}</div>`;

    item.appendChild(left);
    item.appendChild(right);
    historyListEl.insertBefore(item, historyListEl.firstChild);
  }

  
  clearHistoryBtn.addEventListener('click', function () {
    historyListEl.querySelectorAll('.history-item').forEach(i => i.remove());
    if (historyEmpty) {
      historyEmpty.style.display = 'block';
    } else {
      const empty = document.createElement('div');
      empty.id = 'historyEmpty';
      empty.className = 'text-xs text-slate-400';
      empty.textContent = 'No call history yet.';
      historyListEl.appendChild(empty);
    }
  });

  
  function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
});
