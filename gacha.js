  // --- Gacha Logic ---
  const PULL_UNIT_COST = 100;

  function rollStandardOnce() {
    const luck = getTotalLuck();
    // Apply luck multiplier to non-D/C tiers while normalizing
    const weighted = TIERS.map(t => {
      const mult = (t.id === 'd' || t.id === 'c') ? 1 : luck;
      return { tier: t, weight: t.prob * mult };
    });
    const sum = weighted.reduce((acc, x) => acc + x.weight, 0);
    let r = Math.random() * sum;
    for (const item of weighted) {
      if (r < item.weight) return item.tier;
      r -= item.weight;
    }
    return TIER_MAP.d;
  }

  function rollGoldenOnce() {
    // S tier and above ONLY, completely ignoring Luck enchant
    const sPlus = TIERS.filter(t => ['s','ss','sss','sssp','z','secret','celestial','transcendent','divine','void'].includes(t.id));
    const sum = sPlus.reduce((acc, t) => acc + t.prob, 0);
    let r = Math.random() * sum;
    for (const t of sPlus) {
      if (r < t.prob) return t;
      r -= t.prob;
    }
    return TIER_MAP.s;
  }

  function doStandardPull(count) {
    const cost = count * PULL_UNIT_COST;
    if (state.coins < cost) {
      showToast('코인이 부족합니다!');
      return;
    }
    state.coins -= cost;
    const summary = {};
    let bestWeapon = null;
    let bestRank = -1;

    for (let i = 0; i < count; i++) {
      const t = rollStandardOnce();
      const w = createWeapon(t.id);
      state.inventory.push(w);
      registerWeaponCodex(w.name);
      summary[t.name] = (summary[t.name] || 0) + 1;
      const rank = TIERS.findIndex(x => x.id === t.id);
      if (rank > bestRank) {
        bestRank = rank;
        bestWeapon = w;
      }
    }
    showPullResult(`일반 ${fmt(count)}회 뽑기 결과`, summary, bestWeapon);
    saveState();
    updateAllUI();
  }

  function doGoldenPull(mode) {
    const count = mode === 'all' ? state.tickets : mode;
    if (count <= 0 || state.tickets < count) {
      showToast('골든티켓이 부족합니다! (마왕 처치 시 +10개 획득)');
      return;
    }
    state.tickets -= count;
    const summary = {};
    let bestWeapon = null;
    let bestRank = -1;

    for (let i = 0; i < count; i++) {
      const t = rollGoldenOnce();
      const w = createWeapon(t.id);
      state.inventory.push(w);
      registerWeaponCodex(w.name);
      summary[t.name] = (summary[t.name] || 0) + 1;
      const rank = TIERS.findIndex(x => x.id === t.id);
      if (rank > bestRank) {
        bestRank = rank;
        bestWeapon = w;
      }
    }
    showPullResult(`🎫 골든 ${fmt(count)}회 뽑기 결과 (S등급 이상 확정)`, summary, bestWeapon);
    saveState();
    updateAllUI();
  }

  function showPullResult(title, summary, bestWeapon) {
    const card = document.getElementById('lastPullCard');
    const box = document.getElementById('lastPullSummary');
    card.style.display = 'block';
    const badges = Object.entries(summary)
      .map(([tierName, cnt]) => {
        const t = TIERS.find(x => x.name === tierName);
        return `<span class="${t ? t.cls : ''}" style="font-weight:800; margin-right:8px;">[${tierName}] ${fmt(cnt)}개</span>`;
      })
      .join(' ');
    const bestHtml = bestWeapon
      ? `<div style="margin-top:6px;">최고 획득: <strong class="${getWeaponNameClass(bestWeapon)}">[${TIER_MAP[bestWeapon.tier].name}] ${bestWeapon.name}</strong> (⚔️ ${fmt(getWeaponAtk(bestWeapon))})</div>`
      : '';
    box.innerHTML = `<div style="font-weight:800; color:#fbbf24; margin-bottom:4px;">${title}</div><div>${badges}</div>${bestHtml}`;
  }
