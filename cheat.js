  // --- Cheat Codes ---
  function openCheatModal() {
    openModal(
      '🔑 치트키 입력',
      `<p style="margin-bottom:8px; color:var(--muted);">치트키 코드를 입력하세요.</p>
       <input id="cheatInput" type="text" placeholder="코드 입력..." style="width:100%; padding:9px 12px; border-radius:8px; border:1px solid var(--border); background:var(--panel-2); color:#fff; font-weight:700;" />`,
      () => {
        const code = (document.getElementById('cheatInput')?.value || '').trim();
        if (!code) return;
        if (code === '384Du8667') {
          state.coins = Math.max(1000, state.coins * 10);
          showToast('🎉 치트키 적용: 보유 코인 10배!');
        } else if (code === '150800') {
          state.coins = Math.max(10000, state.coins * 100);
          showToast('🎉 치트키 적용: 보유 코인 100배!');
        } else if (code === '642097') {
          state.gems += 100000;
          showToast('💎 치트키 적용: 보석 +100,000개!');
        } else if (code === 'lucky7777777') {
          state.tickets += 100;
          showToast('🎫 치트키 적용: 골든티켓 +100개!');
        } else if (String(code || '').trim().toLowerCase() === '121248') {
          const tier = TIER_MAP['special'] || TIERS.find(t => String(t.id).toLowerCase() === 'special');
          const weaponName = '세계수의 힘을담은 세계수의 지팡이';
          const created = typeof createWeapon === 'function' ? createWeapon('special', weaponName) : null;
          const wandWeapon = (created && typeof created === 'object')
            ? {
                ...created,
                tierId: 'special',
                tierName: tier?.name || 'SPECIAL',
                name: weaponName,
                atk: created.atk || tier?.baseAtk || 25000000000,
                sell: created.sell || tier?.sell || 27000000000
              }
            : {
                id: 'w_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
                tierId: 'special',
                tierName: tier?.name || 'SPECIAL',
                name: weaponName,
                level: 1,
                star: 0,
                transcend: 0,
                atk: tier?.baseAtk || 25000000000,
                sell: tier?.sell || 27000000000
              };
          state.inventory.push(wandWeapon);
          if (typeof registerWeaponCodex === 'function') {
            registerWeaponCodex(wandWeapon.name);
          }
          if (typeof saveState === 'function') saveState();
          if (typeof updateAllUI === 'function') updateAllUI();
          showToast(`🌿 치트키 적용: [${wandWeapon.name}] 획득!`);
        } else if (code === 'hope7878') {
          const tier = TIER_MAP['special'] || TIERS.find(t => String(t.id).toLowerCase() === 'special');
          const weaponName = '희망과 꿈을 품은 대검 호피스트릿';
          const created = createWeapon('special', weaponName);
          const specialWeapon = (created && typeof created === 'object')
            ? {
                ...created,
                tierId: 'special',
                tierName: tier?.name || 'SPECIAL',
                name: weaponName,
                atk: created.atk || tier?.baseAtk || 25000000000,
                sell: created.sell || tier?.sell || 27000000000
              }
            : {
                id: 'w_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
                tierId: 'special',
                tierName: tier?.name || 'SPECIAL',
                name: weaponName,
                level: 1,
                star: 0,
                transcend: 0,
                atk: tier?.baseAtk || 25000000000,
                sell: tier?.sell || 27000000000
              };
          state.inventory.push(specialWeapon);
          if (typeof registerWeaponCodex === 'function') {
            registerWeaponCodex(specialWeapon.name);
          }
          showToast(`⚔️ 치트키 적용: [${specialWeapon.name}] 획득!`);
        } else {
          showToast('❌ 유효하지 않은 치트키입니다.');
          return;
        }
        saveState();
        updateAllUI();
      }
    );
    setTimeout(() => document.getElementById('cheatInput')?.focus(), 50);
  }
