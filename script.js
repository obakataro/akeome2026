/* ================================
   1. セクションを切り替え
   ================================ */
function switchTab(sectionId) {
    document.querySelectorAll('main section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
    window.scrollTo(0, 0);
}

/* ================================
   2. カウントダウン
   ================================ */
function updateCountdown() {
    const target = new Date(new Date().getFullYear() + 1, 0, 1, 0, 0, 0).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
        document.getElementById('countdown-timer').innerHTML = "謹賀新年！あけましておめでとうございます";
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
}
setInterval(updateCountdown, 1000);
updateCountdown();

/* ================================
   3. 除夜の鐘
   ================================ */
let bellCount = 0;
let isPlaying = false;
let timeLeft = 20;
let timerId = null;

const kaneArea = document.getElementById('kane-touch-area');
const kaneVisual = document.getElementById('kane-visual');

function handleTap(e) {
    if (!isPlaying) return;
    if (e.cancelable) e.preventDefault();
    bellCount++;
    document.getElementById('kane-count').innerText = bellCount;
    kaneVisual.classList.remove('kane-shake');
    void kaneVisual.offsetWidth;
    kaneVisual.classList.add('kane-shake');
}

kaneArea.addEventListener('touchstart', handleTap, {passive: false});
kaneArea.addEventListener('mousedown', handleTap);

document.getElementById('btn-start-kane').addEventListener('click', function() {
    bellCount = 0;
    timeLeft = 20;
    isPlaying = true;
    this.style.display = 'none';
    document.getElementById('kane-count').innerText = "0";

    timerId = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').innerText = timeLeft;
        if (timeLeft <= 0) {
            isPlaying = false;
            clearInterval(timerId);
            alert(`修行終了！ 払った煩悩の数: ${bellCount}`);
            this.style.display = 'inline-block';
            this.innerText = "もう一度修行する";
        }
    }, 1000);
});

/* ================================
   4. おみくじ
   ================================ */
const kujiData = [
    {t:"大吉", d:"全ての願いが叶う最高の年になるでしょう。"},
    {t:"中吉", d:"努力が報われ、大きな実を結ぶ時期です。"},
    {t:"吉", d:"平穏ながらも幸せを感じられる一年です。"},
    {t:"末吉", d:"焦らずゆっくり進むのが吉です。"}
];

const omikujiBox = document.getElementById('omikuji-box');
const omikujiResultArea = document.getElementById('omikuji-result-area');
const omikujiCanvas = document.getElementById('omikuji-canvas');
const omikujiCtx = omikujiCanvas.getContext('2d');
const omikujiFallback = document.getElementById('omikuji-text-fallback');

function drawOmikuji(res) {
    omikujiCtx.clearRect(0,0,300,400);
    omikujiCtx.fillStyle = '#fff4e6';
    omikujiCtx.fillRect(0,0,300,400);
    omikujiCtx.fillStyle = '#c9171e';
    omikujiCtx.font = 'bold 40px "Noto Serif JP"';
    omikujiCtx.textAlign = 'center';
    omikujiCtx.fillText(res.t, 150, 150);
    omikujiCtx.fillStyle = '#333';
    omikujiCtx.font = '18px "Noto Serif JP"';
    wrapText(omikujiCtx, res.d, 150, 200, 260, 25);
    omikujiFallback.innerText = `${res.t} - ${res.d}`;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight){
    const words = text.split('');
    let line = '';
    let lines = [];
    for(let n = 0; n < words.length; n++) {
        const testLine = line + words[n];
        const metrics = ctx.measureText(testLine);
        if(metrics.width > maxWidth && n > 0){
            lines.push(line);
            line = words[n];
        } else {
            line = testLine;
        }
    }
    lines.push(line);
    for(let i=0;i<lines.length;i++){
        ctx.fillText(lines[i], x, y + i*lineHeight);
    }
}

document.getElementById('btn-draw-omikuji').addEventListener('click', () => {
    const res = kujiData[Math.floor(Math.random() * kujiData.length)];
    omikujiResultArea.classList.remove('hidden');
    drawOmikuji(res);
});

document.getElementById('btn-retry-omikuji').addEventListener('click', () => {
    omikujiResultArea.classList.add('hidden');
});

/* ================================
   5. 絵馬作成
   ================================ */
const emaCanvas = document.getElementById('ema-canvas');
const emaCtx = emaCanvas.getContext('2d');

function drawEma(wish='願い事を入力', name='') {
    emaCtx.fillStyle = '#f5e6c8';
    emaCtx.fillRect(0,0,400,300);
    emaCtx.strokeStyle = '#8c5e26';
    emaCtx.lineWidth = 15;
    emaCtx.strokeRect(0,0,400,300);
    emaCtx.fillStyle = '#333';
    emaCtx.textAlign = 'center';
    emaCtx.font = 'bold 30px "Noto Serif JP"';
    emaCtx.fillText(wish,200,140);
    emaCtx.font = '20px "Noto Serif JP"';
    emaCtx.fillText(name ? `奉納者：${name}` : "", 200, 240);
    emaCtx.fillStyle = '#c9171e';
    emaCtx.font = 'italic 16px serif';
    emaCtx.fillText('真似亞神社', 330, 280);
}
drawEma();

document.getElementById('btn-create-ema').addEventListener('click', () => {
    const w = document.getElementById('ema-wish').value;
    const n = document.getElementById('ema-name').value;
    drawEma(w,n);
});

document.getElementById('btn-download-ema').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'ema.png';
    link.href = emaCanvas.toDataURL();
    link.click();
});
