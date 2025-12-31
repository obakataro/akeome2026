/* ================================
   1. タブ切り替え機能
   ================================ */
function switchTab(sectionId) {
    const sections = document.querySelectorAll('main section');
    sections.forEach(sec => sec.classList.add('hidden'));
    const target = document.getElementById(sectionId);
    if (target) target.classList.remove('hidden');
}

/* ================================
   2. カウントダウン機能
   ================================ */
function startCountdown() {
    const now = new Date();
    const nextYear = now.getFullYear() + 1;
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
   3. 除夜の鐘ゲーム (NEW!)
   ================================ */
let kaneScore = 0;
let kaneTime = 10;
let kaneTimerInterval;
let isGamePlaying = false;

// ハイスコアの読み込み
const savedScore = localStorage.getItem('kaneHighScore');
if(savedScore) {
    document.getElementById('kane-highscore').innerText = savedScore;
}

const btnHitKane = document.getElementById('btn-hit-kane');
const bellVisual = document.getElementById('bell-visual');
const displayScore = document.getElementById('kane-score');
const displayTime = document.getElementById('kane-time');

// ゲーム開始
document.getElementById('btn-start-kane').addEventListener('click', () => {
    if(isGamePlaying) return;
    
    // リセット
    kaneScore = 0;
    kaneTime = 10;
    isGamePlaying = true;
    displayScore.innerText = kaneScore;
    displayTime.innerText = kaneTime;
    btnHitKane.disabled = false; // ボタン有効化
    
    // タイマースタート
    kaneTimerInterval = setInterval(() => {
        kaneTime--;
        displayTime.innerText = kaneTime;
        if(kaneTime <= 0) {
            finishKaneGame();
        }
    }, 1000);
});

// 鐘を打つ
btnHitKane.addEventListener('click', () => {
    if(!isGamePlaying) return;
    kaneScore++;
    displayScore.innerText = kaneScore;

    // アニメーション演出
    bellVisual.classList.remove('bell-hit-anim');
    void bellVisual.offsetWidth; // リフロー発生
    bellVisual.classList.add('bell-hit-anim');
    
    // 効果音を入れるならここで playAudio();
});

// ゲーム終了処理
function finishKaneGame() {
    clearInterval(kaneTimerInterval);
    isGamePlaying = false;
    btnHitKane.disabled = true;

    // ハイスコア更新判定
    const currentHigh = parseInt(localStorage.getItem('kaneHighScore') || '0');
    if(kaneScore > currentHigh) {
        localStorage.setItem('kaneHighScore', kaneScore);
        document.getElementById('kane-highscore').innerText = kaneScore;
        alert(`新記録！ ${kaneScore}回突きました！\n煩悩が吹き飛びました！`);
    } else {
        alert(`終了！ ${kaneScore}回突きました。`);
    }
}

/* ================================
   4. おみくじ機能 (Canvas画像生成版)
   ================================ */
const omikujiResults = [
    { type: '大吉', detail: '願望：思うがまま' },
    { type: '中吉', detail: '待人：来るでしょう' },
    { type: '小吉', detail: '学問：油断大敵' },
    { type: '吉', detail: '商売：焦らずとも良し' },
    { type: '凶', detail: '健康：夜更かし禁止' }
];

const omiCanvas = document.getElementById('omikuji-canvas');
const omiCtx = omiCanvas.getContext('2d');

function drawOmikujiCanvas(result) {
    // 背景（和紙っぽい色）
    omiCtx.fillStyle = '#fffaf0';
    omiCtx.fillRect(0, 0, omiCanvas.width, omiCanvas.height);

    // 外枠（二重線）
    omiCtx.strokeStyle = '#c9171e';
    omiCtx.lineWidth = 5;
    omiCtx.strokeRect(10, 10, omiCanvas.width - 20, omiCanvas.height - 20);
    omiCtx.lineWidth = 1;
    omiCtx.strokeRect(15, 15, omiCanvas.width - 30, omiCanvas.height - 30);

    // タイトル
    omiCtx.fillStyle = '#c9171e';
    omiCtx.font = 'bold 20px "Noto Serif JP"';
    omiCtx.textAlign = 'center';
    omiCtx.fillText('真似亞神社 運勢', omiCanvas.width / 2, 50);

    // 結果（大きく）
    omiCtx.fillStyle = '#000';
    omiCtx.font = 'bold 80px "Noto Serif JP"';
    omiCtx.fillText(result.type, omiCanvas.width / 2, 160);

    // 装飾線
    omiCtx.beginPath();
    omiCtx.moveTo(50, 190);
    omiCtx.lineTo(250, 190);
    omiCtx.strokeStyle = '#d4af37';
    omiCtx.lineWidth = 3;
    omiCtx.stroke();

    // 詳細テキスト
    omiCtx.font = '18px "Noto Serif JP"';
    omiCtx.fillStyle = '#333';
    omiCtx.fillText(result.detail, omiCanvas.width / 2, 240);
    
    // 日付
    const today = new Date();
    const dateStr = `${today.getFullYear()}年1月1日`;
    omiCtx.font = '14px "Noto Serif JP"';
    omiCtx.fillStyle = '#666';
    omiCtx.fillText(dateStr, omiCanvas.width / 2, 350);
}

// 引くボタン
document.getElementById('btn-draw-omikuji').addEventListener('click', () => {
    const box = document.getElementById('omikuji-box');
    const resultArea = document.getElementById('omikuji-result-area');
    const drawBtn = document.getElementById('btn-draw-omikuji');

    // アニメーション
    box.style.transform = 'rotate(20deg)';
    setTimeout(() => box.style.transform = 'rotate(-20deg)', 100);
    setTimeout(() => box.style.transform = 'rotate(0deg)', 200);

    // 抽選
    const random = Math.floor(Math.random() * omikujiResults.length);
    const result = omikujiResults[random];

    setTimeout(() => {
        // UI切り替え
        box.classList.add('hidden');
        drawBtn.classList.add('hidden');
        resultArea.classList.remove('hidden');

        // Canvas描画
        drawOmikujiCanvas(result);
    }, 300);
});

// リトライボタン
document.getElementById('btn-retry-omikuji').addEventListener('click', () => {
    document.getElementById('omikuji-result-area').classList.add('hidden');
    document.getElementById('omikuji-box').classList.remove('hidden');
    document.getElementById('btn-draw-omikuji').classList.remove('hidden');
});

// DLボタン
document.getElementById('btn-download-omikuji').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'omikuji_result.png';
    link.href = omiCanvas.toDataURL();
    link.click();
});


/* ================================
   5. 絵馬作成機能 (Canvas)
   ================================ */
const emaCanvas = document.getElementById('ema-canvas');
const emaCtx = emaCanvas.getContext('2d');

function drawEma(wishText = '', nameText = '') {
    // 背景
    emaCtx.fillStyle = '#f2d29b';
    emaCtx.fillRect(0, 0, emaCanvas.width, emaCanvas.height);
    
    // 枠
    emaCtx.lineWidth = 10;
    emaCtx.strokeStyle = '#8c5e26';
    emaCtx.strokeRect(0, 0, emaCanvas.width, emaCanvas.height);

    // 紐
    emaCtx.beginPath();
    emaCtx.moveTo(emaCanvas.width / 2, 0);
    emaCtx.lineTo(emaCanvas.width / 2, 40);
    emaCtx.lineWidth = 5;
    emaCtx.strokeStyle = '#c9171e';
    emaCtx.stroke();

    // 神社名
    emaCtx.fillStyle = '#000';
    emaCtx.font = '20px "Noto Serif JP"';
    emaCtx.textAlign = 'right';
    emaCtx.fillText('真似亞神社', emaCanvas.width - 20, emaCanvas.height - 20);

    // テキスト
    emaCtx.fillStyle = '#000';
    emaCtx.textAlign = 'center';
    emaCtx.font = 'bold 40px "Noto Serif JP"';
    emaCtx.fillText(wishText, emaCanvas.width / 2, 140);

    emaCtx.font = '24px "Noto Serif JP"';
    emaCtx.textAlign = 'left';
    emaCtx.fillText(nameText ? `奉納：${nameText}` : '', 40, 240);
}

// 初期描画
drawEma('願い事を入力', '');

// 作成ボタン
document.getElementById('btn-create-ema').addEventListener('click', () => {
    const wish = document.getElementById('ema-wish').value || '願い事なし';
    const name = document.getElementById('ema-name').value || '匿名';
    drawEma(wish, name);
});

// DLボタン
document.getElementById('btn-download-ema').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'ema_maniea_shrine.png';
    link.href = emaCanvas.toDataURL();
    link.click();
});
