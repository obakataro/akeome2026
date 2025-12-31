/* ================================
   1. タブ切り替え機能
   ================================ */
function switchTab(sectionId) {
    // 全てのセクションを隠す
    const sections = document.querySelectorAll('main section');
    sections.forEach(sec => sec.classList.add('hidden'));

    // 指定されたセクションを表示
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
    }
}

/* ================================
   2. カウントダウン機能
   ================================ */
function startCountdown() {
    // 次の1月1日を設定
    const now = new Date();
    let nextYear = now.getFullYear() + 1;
    // もし現在が1月1日なら、来年ではなく今年の終わりに設定するなど調整可能
    // ここではシンプルに「次の年の1月1日」を目指します
    const targetDate = new Date(nextYear, 0, 1, 0, 0, 0).getTime();

    const timer = setInterval(() => {
        const current = new Date().getTime();
        const diff = targetDate - current;

        if (diff < 0) {
            clearInterval(timer);
            document.querySelector('.countdown-box h2').innerText = "あけましておめでとうございます！";
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(d).padStart(2, '0');
        document.getElementById('hours').innerText = String(h).padStart(2, '0');
        document.getElementById('minutes').innerText = String(m).padStart(2, '0');
        document.getElementById('seconds').innerText = String(s).padStart(2, '0');
    }, 1000);
}

startCountdown();

/* ================================
   3. おみくじ機能
   ================================ */
const omikujiResults = [
    { type: '大吉', detail: '願い事：思うがままに叶うでしょう' },
    { type: '中吉', detail: '待ち人：音信あり 来る' },
    { type: '小吉', detail: '学問：安心して勉強せよ' },
    { type: '吉', detail: '商売：利益あり 騒ぐな' },
    { type: '凶', detail: '健康：養生せよ' }
];

document.getElementById('btn-draw-omikuji').addEventListener('click', () => {
    const box = document.getElementById('omikuji-box');
    const resultDiv = document.getElementById('omikuji-result');
    const resultText = document.getElementById('result-text');
    const resultDetail = document.getElementById('result-detail');

    // 簡易アニメーション
    box.style.transform = 'rotate(20deg)';
    setTimeout(() => box.style.transform = 'rotate(-20deg)', 100);
    setTimeout(() => box.style.transform = 'rotate(0deg)', 200);

    // ランダム抽選
    const random = Math.floor(Math.random() * omikujiResults.length);
    const result = omikujiResults[random];

    // 結果表示
    setTimeout(() => {
        resultText.innerText = result.type;
        resultDetail.innerText = result.detail;
        resultDiv.classList.remove('hidden');
    }, 300);
});

/* ================================
   4. 絵馬作成機能 (Canvas)
   ================================ */
const canvas = document.getElementById('ema-canvas');
const ctx = canvas.getContext('2d');

// 絵馬の初期描画
function drawEma(wishText = '', nameText = '') {
    // 1. 背景（木の板）を描画
    ctx.fillStyle = '#f2d29b'; // 木の色
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 木枠の線
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#8c5e26';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // 紐（赤）
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, 40);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#c9171e';
    ctx.stroke();

    // 神社名
    ctx.fillStyle = '#000';
    ctx.font = '20px "Noto Serif JP"';
    ctx.textAlign = 'right';
    ctx.fillText('真似亞神社', canvas.width - 20, canvas.height - 20);

    // 2. ユーザーの入力テキスト描画
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    
    // 願い事（大きく）
    ctx.font = 'bold 40px "Noto Serif JP"';
    ctx.fillText(wishText, canvas.width / 2, 140);

    // 名前（少し小さく）
    ctx.font = '24px "Noto Serif JP"';
    ctx.textAlign = 'left';
    ctx.fillText(nameText ? `奉納：${nameText}` : '', 40, 240);
}

// 初期状態を描画
drawEma('願い事を入力', '');

// 作成ボタンクリック時
document.getElementById('btn-create-ema').addEventListener('click', () => {
    const wish = document.getElementById('ema-wish').value || '願い事なし';
    const name = document.getElementById('ema-name').value || '匿名';
    drawEma(wish, name);
});

// ダウンロード機能
document.getElementById('btn-download-ema').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'ema_maniea_shrine.png';
    link.href = canvas.toDataURL();
    link.click();
});
