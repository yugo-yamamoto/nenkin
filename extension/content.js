(function () {
  document.addEventListener('paste', function (e) {
    if (e.target.id !== 'txtHoujinNo') return;
    e.stopImmediatePropagation();
    e.preventDefault();
    var text = (e.clipboardData || window.clipboardData).getData('text');
    var field = e.target;
    var start = field.selectionStart;
    var end   = field.selectionEnd;
    field.value = field.value.slice(0, start) + text + field.value.slice(end);
    field.selectionStart = field.selectionEnd = start + text.length;
    field.dispatchEvent(new Event('input',  { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
  }, true);

  // 「クリップボードから入力」ボタンを追加
  var field = document.getElementById('txtHoujinNo');
  if (!field) return;

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = '📋 クリップボードから入力';
  btn.style.cssText = 'margin-left:8px; padding:4px 10px; cursor:pointer;';

  btn.addEventListener('click', function () {
    navigator.clipboard.readText().then(function (text) {
      // 法人番号で検索するラジオボタンを選択
      var radio = document.getElementById('hdnSearchCriteria3');
      if (radio) radio.click();

      field.value = text.trim();
      field.dispatchEvent(new Event('input',  { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
    }).catch(function () {
      alert('クリップボードの読み取りに失敗しました。\nブラウザのアドレスバー左のアイコンから「クリップボード」を許可してください。');
    });
  });

  var preview = document.createElement('span');
  preview.style.cssText = 'margin-left:8px; color:gray; font-size:0.9em;';

  function updatePreview() {
    navigator.clipboard.readText().then(function (text) {
      var trimmed = text.trim();
      preview.textContent = /^\d{13}$/.test(trimmed) ? trimmed : '';
    }).catch(function () {
      preview.textContent = '';
    });
  }

  field.insertAdjacentElement('afterend', preview);
  field.insertAdjacentElement('afterend', btn);

  updatePreview();
  field.addEventListener('focus', updatePreview);
})();
