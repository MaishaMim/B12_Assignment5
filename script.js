// script.js - Vanilla JS only
document.addEventListener('DOMContentLoaded', function () {
  // Navbar counters
  let likeCount = 0;
  let coinCount = 100;
  let copyCount = 2;

  const likeCountEl = document.getElementById('likeCount');
  const coinCountEl = document.getElementById('coinCount');
  const copyCountEl = document.getElementById('copyCount');
  const historyListEl = document.getElementById('historyList');
  const historyEmpty = document.getElementById('historyEmpty');
  const clearHistoryBtn = document.getElementById('clearHistory');

  // Update counters in DOM helper
  function updateCounters() {
    likeCountEl.textContent = String(likeCount);
    coinCountEl.textContent = String(coinCount);
    copyCountEl.textContent = String(copyCount);
  }
  updateCounters();

  // --- Heart behavior (increase navbar count) ---
  document.querySelectorAll('.card-heart').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      // increment navbar
      likeCount++;
      updateCounters();
      // toggle fill style locally
      const svg = btn.querySelector('.heart-icon');
      svg.classList.toggle('heart-filled');
    });
  });

  // --- Copy behavior (copy hotline number, increment copy count) ---
  document.querySelectorAll('.btn-copy').forEach(function (btn) {
    btn.addEventListener('click', async function (e) {
      e.stopPropagation();
      // find closest card and number
      const card = btn.closest('.card');
      if (!card) return;
      const number = card.dataset.number || card.querySelector('.text-2xl')?.textContent?.trim() || '';
      try {
        // copy to clipboard using modern API
        await navigator.clipboard.writeText(number);
        copyCount++;
        updateCounters();
        alert(`Copied: ${number}`);
      } catch (err) {
        // fallback method if clipboard API blocked
        const textarea = document.createElement('textarea');
        textarea.value = number;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          copyCount++;
          updateCounters();
          alert(`Copied (fallback): ${number}`);
        } catch (e2) {
          alert('Copy failed');
        }
        textarea.remove();
      }
    });
  });

  // --- Call behavior (charge coins, record history, alert) ---
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

      // Deduct coins
      coinCount -= 20;
      updateCounters();

      // Show alert (simulate calling)
      alert(`Calling ${serviceName} — ${number}`);

      // Create history entry with exact local time
      const timeStr = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });

      addHistory({
        name: serviceName,
        number: number,
        time: timeStr
      });
    });
  });

  // Append history entry to list (prepend)
  function addHistory(entry) {
    // remove empty message
    if (historyEmpty) historyEmpty.style.display = 'none';

    const item = document.createElement('div');
    item.className = 'history-item';

    // left: name & number
    const left = document.createElement('div');
    left.innerHTML = `<div class="text-sm font-medium">${escapeHtml(entry.name)}</div><div class="text-xs text-slate-500">${escapeHtml(entry.number)}</div>`;

    // right: time
    const right = document.createElement('div');
    right.innerHTML = `<div class="text-xs text-slate-400">${escapeHtml(entry.time)}</div>`;

    item.appendChild(left);
    item.appendChild(right);

    // prepend to top
    historyListEl.insertBefore(item, historyListEl.firstChild);
  }

  // Clear history
  clearHistoryBtn.addEventListener('click', function () {
    // Remove all history-item children and show empty
    const items = historyListEl.querySelectorAll('.history-item');
    items.forEach(i => i.remove());

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

  // Utility: escapeHtml to avoid XSS if data ever dynamic
  function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]); });
  }

});
