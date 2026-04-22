/* ============================================
   Terminal Portfolio - JavaScript
   Pixel art, glitch animations, interactions
   ============================================ */

// ── Navigation ──
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Pixel Art Drawing Helpers ──
function drawPixel(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * size, y * size, size, size);
}

// ── Animated Pixel Avatar with Mouse Tracking ──
let mouseX = 0.5, mouseY = 0.5; // 0~1 normalized
let avatarFrame = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
});

document.addEventListener('touchmove', (e) => {
    if (e.touches.length) {
        mouseX = e.touches[0].clientX / window.innerWidth;
        mouseY = e.touches[0].clientY / window.innerHeight;
    }
}, { passive: true });

function startAvatarAnimation(canvas) {
    canvas.width = 192;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    const s = 6;

    // 좌우 걷기 스탑모션 상태
    let walkPos = 0.5; // 0~1 범위 (씬 내 위치비율)
    let walkDir = 1;   // 1=오른쪽, -1=왼쪽
    const walkSpeed = 0.002;

    function updateWalk() {
        walkPos += walkSpeed * walkDir;
        if (walkPos > 0.85) { walkPos = 0.85; walkDir = -1; }
        if (walkPos < 0.15) { walkPos = 0.15; walkDir = 1; }
        // 씬 내 left 위치 계산
        const scene = canvas.parentElement;
        if (scene) {
            const sceneW = scene.offsetWidth;
            const avatarW = 192;
            const leftPx = walkPos * (sceneW - avatarW);
            canvas.style.left = leftPx + 'px';
            // 방향 전환 (좌우 반전)
            canvas.style.transform = walkDir === -1 ? 'scaleX(-1)' : 'scaleX(1)';
        }
    }

    // 걷기 다리 프레임 (0~3 스탑모션)
    function getWalkLegFrame() {
        return Math.floor(avatarFrame / 10) % 4;
    }

    function drawFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        avatarFrame++;
        updateWalk();

        // 숨쉬기: 상체가 살짝 위아래
        const breathOffset = Math.sin(avatarFrame * 0.04) * 0.4;
        // 마우스 방향: -1 ~ 1
        const lookX = (mouseX - 0.5) * 2;
        const lookY = (mouseY - 0.5) * 2;
        // 눈동자 오프셋 (픽셀 단위, 최대 1칸 이동)
        const eyeOffX = Math.round(Math.max(-1, Math.min(1, lookX)));
        const eyeOffY = Math.round(Math.max(-1, Math.min(1, lookY * 0.5)));
        // 머리 기울기
        const headTilt = lookX * 1.5;

        const hair = '#222255';
        const skin = '#FFCC99';
        const skinShadow = '#DDAA77';
        const shirt = '#0000CC';
        const shirtLight = '#3333DD';
        const pants = '#333366';
        const glassFr = '#3333AA';
        const glass = '#5555FF';
        const white = '#FFFFFF';
        const pupil = '#000088';
        const mouth = '#FF6666';
        const shoes = '#444444';
        const laptop = '#888888';
        const screenGlow = '#00FFFF';
        const deskColor = '#443322';

        // ─── 전체 머리/상체를 save/transform ───
        ctx.save();
        // 머리 기울기 적용 (미세하게)
        ctx.translate(96, 60);
        ctx.rotate(headTilt * Math.PI / 180);
        ctx.translate(-96, -60 + breathOffset);

        // ─── Hair ───
        for (let x = 10; x <= 21; x++) drawPixel(ctx, x, 2, s, hair);
        for (let x = 9; x <= 22; x++) drawPixel(ctx, x, 3, s, hair);
        for (let x = 8; x <= 23; x++) drawPixel(ctx, x, 4, s, hair);
        for (let x = 8; x <= 23; x++) drawPixel(ctx, x, 5, s, hair);
        for (let y = 6; y <= 10; y++) { drawPixel(ctx, 8, y, s, hair); drawPixel(ctx, 23, y, s, hair); }
        for (let y = 6; y <= 8; y++) { drawPixel(ctx, 9, y, s, hair); drawPixel(ctx, 22, y, s, hair); }

        // ─── Face ───
        for (let y = 6; y <= 14; y++) {
            for (let x = 10; x <= 21; x++) drawPixel(ctx, x, y, s, skin);
        }
        for (let x = 10; x <= 21; x++) drawPixel(ctx, x, 14, s, skinShadow);
        for (let x = 11; x <= 20; x++) drawPixel(ctx, x, 15, s, skinShadow);
        for (let x = 12; x <= 19; x++) drawPixel(ctx, x, 15, s, skin);

        // ─── Ears ───
        drawPixel(ctx, 9, 9, s, skin); drawPixel(ctx, 9, 10, s, skin);
        drawPixel(ctx, 22, 9, s, skin); drawPixel(ctx, 22, 10, s, skin);

        // ─── Eyebrows (미세하게 움직임) ───
        const browOff = eyeOffY < 0 ? -1 : 0;
        for (let x = 11; x <= 14; x++) drawPixel(ctx, x, 7 + browOff, s, hair);
        for (let x = 17; x <= 20; x++) drawPixel(ctx, x, 7 + browOff, s, hair);

        // ─── Glasses ───
        for (let x = 11; x <= 14; x++) { drawPixel(ctx, x, 8, s, glassFr); drawPixel(ctx, x, 11, s, glassFr); }
        drawPixel(ctx, 11, 9, s, glassFr); drawPixel(ctx, 11, 10, s, glassFr);
        drawPixel(ctx, 14, 9, s, glassFr); drawPixel(ctx, 14, 10, s, glassFr);
        drawPixel(ctx, 12, 9, s, glass); drawPixel(ctx, 13, 9, s, glass);
        drawPixel(ctx, 12, 10, s, glass); drawPixel(ctx, 13, 10, s, glass);
        for (let x = 17; x <= 20; x++) { drawPixel(ctx, x, 8, s, glassFr); drawPixel(ctx, x, 11, s, glassFr); }
        drawPixel(ctx, 17, 9, s, glassFr); drawPixel(ctx, 17, 10, s, glassFr);
        drawPixel(ctx, 20, 9, s, glassFr); drawPixel(ctx, 20, 10, s, glassFr);
        drawPixel(ctx, 18, 9, s, glass); drawPixel(ctx, 19, 9, s, glass);
        drawPixel(ctx, 18, 10, s, glass); drawPixel(ctx, 19, 10, s, glass);
        drawPixel(ctx, 15, 9, s, glassFr); drawPixel(ctx, 16, 9, s, glassFr);
        drawPixel(ctx, 10, 9, s, glassFr); drawPixel(ctx, 21, 9, s, glassFr);

        // ─── Eyes (마우스 따라가기!) ───
        // 왼쪽 눈: 기본 12,9 ~ 13,10 범위에서 pupil 이동
        const leftPupilX = 12 + eyeOffX;
        const leftPupilY = 9 + eyeOffY;
        drawPixel(ctx, leftPupilX, leftPupilY, s, white);
        drawPixel(ctx, leftPupilX + 1, leftPupilY, s, pupil);
        // 오른쪽 눈
        const rightPupilX = 18 + eyeOffX;
        const rightPupilY = 9 + eyeOffY;
        drawPixel(ctx, rightPupilX, rightPupilY, s, white);
        drawPixel(ctx, rightPupilX + 1, rightPupilY, s, pupil);

        // 깜빡임 (약 5초마다 0.2초간)
        if (avatarFrame % 300 < 6) {
            // 눈 감기: 안경 위에 가로줄
            for (let x = 12; x <= 13; x++) drawPixel(ctx, x, 10, s, glassFr);
            for (let x = 18; x <= 19; x++) drawPixel(ctx, x, 10, s, glassFr);
        }

        // ─── Nose ───
        drawPixel(ctx, 15, 11, s, skinShadow); drawPixel(ctx, 16, 11, s, skinShadow);
        drawPixel(ctx, 15, 12, s, skinShadow);

        // ─── Mouth (미소 → 마우스 가까우면 웃음) ───
        const dist = Math.sqrt(Math.pow(mouseX - 0.5, 2) + Math.pow(mouseY - 0.3, 2));
        if (dist < 0.2) {
            // 큰 미소 😄
            drawPixel(ctx, 13, 13, s, mouth); drawPixel(ctx, 18, 13, s, mouth);
            for (let x = 14; x <= 17; x++) drawPixel(ctx, x, 13, s, '#FF4444');
            for (let x = 14; x <= 17; x++) drawPixel(ctx, x, 14, s, '#FF4444');
        } else {
            // 기본 미소
            for (let x = 13; x <= 18; x++) drawPixel(ctx, x, 13, s, mouth);
            for (let x = 14; x <= 17; x++) drawPixel(ctx, x, 14, s, '#FF4444');
        }

        // ─── Neck ───
        for (let x = 14; x <= 17; x++) { drawPixel(ctx, x, 16, s, skin); drawPixel(ctx, x, 17, s, skin); }

        ctx.restore(); // 머리 기울기 복원

        // ─── 하체는 고정 (숨쉬기 offset만) ───
        ctx.save();
        ctx.translate(0, breathOffset * 0.3);

        // ─── Shirt ───
        for (let x = 12; x <= 19; x++) drawPixel(ctx, x, 18, s, white);
        drawPixel(ctx, 15, 19, s, white); drawPixel(ctx, 16, 19, s, white);
        for (let y = 18; y <= 26; y++) {
            for (let x = 8; x <= 23; x++) {
                if (y === 18 && x >= 12 && x <= 19) continue;
                drawPixel(ctx, x, y, s, shirt);
            }
        }
        for (let y = 20; y <= 24; y++) {
            drawPixel(ctx, 15, y, s, shirtLight);
            drawPixel(ctx, 16, y, s, shirtLight);
        }

        // ─── Arms ───
        for (let y = 19; y <= 25; y++) {
            drawPixel(ctx, 7, y, s, shirt); drawPixel(ctx, 6, y, s, shirt);
            drawPixel(ctx, 24, y, s, shirt); drawPixel(ctx, 25, y, s, shirt);
        }
        // 타이핑 모션: 손이 미세하게 위아래
        const typeOff = Math.round(Math.sin(avatarFrame * 0.15) * 0.5);
        for (let x = 5; x <= 7; x++) { drawPixel(ctx, x, 26 + typeOff, s, skin); drawPixel(ctx, x, 27 + typeOff, s, skin); }
        for (let x = 24; x <= 26; x++) { drawPixel(ctx, x, 26 - typeOff, s, skin); drawPixel(ctx, x, 27 - typeOff, s, skin); }

        ctx.restore();

        // ─── 고정 요소 (desk, laptop, accessories) ───
        // Chair
        for (let y = 18; y <= 28; y++) {
            drawPixel(ctx, 5, y, s, '#444466'); drawPixel(ctx, 26, y, s, '#444466');
        }
        drawPixel(ctx, 5, 17, s, '#555577'); drawPixel(ctx, 26, 17, s, '#555577');

        // Desk
        for (let x = 3; x <= 28; x++) drawPixel(ctx, x, 28, s, deskColor);
        for (let x = 3; x <= 28; x++) drawPixel(ctx, x, 29, s, '#332211');

        // Laptop
        for (let x = 10; x <= 21; x++) drawPixel(ctx, x, 23, s, '#555555');
        for (let y = 24; y <= 27; y++) {
            drawPixel(ctx, 10, y, s, '#555555'); drawPixel(ctx, 21, y, s, '#555555');
            for (let x = 11; x <= 20; x++) drawPixel(ctx, x, y, s, '#111133');
        }
        // 화면 코드라인 (반짝임)
        const codeFlicker = avatarFrame % 60 < 30;
        for (let x = 12; x <= 16; x++) drawPixel(ctx, x, 25, s, codeFlicker ? screenGlow : '#00CCCC');
        for (let x = 12; x <= 18; x++) drawPixel(ctx, x, 26, s, codeFlicker ? '#00FF00' : '#00CC00');
        for (let x = 12; x <= 14; x++) drawPixel(ctx, x, 27, s, '#FFFF00');
        // 커서 깜빡
        if (avatarFrame % 40 < 20) drawPixel(ctx, 15, 27, s, white);
        // Keyboard
        for (let x = 9; x <= 22; x++) drawPixel(ctx, x, 28, s, laptop);

        // Coffee mug
        drawPixel(ctx, 25, 26, s, white); drawPixel(ctx, 26, 26, s, white);
        drawPixel(ctx, 25, 27, s, white); drawPixel(ctx, 26, 27, s, white);
        drawPixel(ctx, 27, 26, s, '#DDDDDD'); drawPixel(ctx, 27, 27, s, '#DDDDDD');
        // 김 (위로 올라가는 애니메이션)
        const steamY1 = 25 - (avatarFrame % 40 < 20 ? 0 : 1);
        const steamY2 = 24 - (avatarFrame % 60 < 30 ? 0 : 1);
        drawPixel(ctx, 25, steamY1, s, 'rgba(200,200,255,0.5)');
        drawPixel(ctx, 26, steamY2, s, 'rgba(200,200,255,0.3)');
        if (avatarFrame % 80 < 40) drawPixel(ctx, 25, steamY1 - 1, s, 'rgba(200,200,255,0.15)');

        // Plant
        drawPixel(ctx, 4, 26, s, '#886633'); drawPixel(ctx, 5, 26, s, '#886633');
        drawPixel(ctx, 4, 27, s, '#886633'); drawPixel(ctx, 5, 27, s, '#886633');
        const leafSway = Math.sin(avatarFrame * 0.03) > 0 ? 0 : 1;
        drawPixel(ctx, 4, 25, s, '#00CC00'); drawPixel(ctx, 5, 25, s, '#00CC00');
        drawPixel(ctx, 3 + leafSway, 24, s, '#00AA00'); drawPixel(ctx, 5 + leafSway, 24, s, '#00AA00');
        drawPixel(ctx, 4, 23, s, '#00BB00');

        // Pants + Shoes (스탑모션 걷기!)
        const legFrame = getWalkLegFrame();
        // 프레임별 다리 오프셋: [왼다리X오프셋, 오른다리X오프셋]
        const legOffsets = [
            [0, 0],   // 프레임0: 기본 자세
            [-1, 1],  // 프레임1: 왼발 앞, 오른발 뒤
            [0, 0],   // 프레임2: 기본 자세
            [1, -1],  // 프레임3: 오른발 앞, 왼발 뒤
        ];
        const [leftLegOff, rightLegOff] = legOffsets[legFrame];

        // 왼쪽 다리
        for (let y = 30; y <= 33; y++) {
            for (let x = 10; x <= 14; x++) drawPixel(ctx, x + leftLegOff, y, s, pants);
        }
        // 오른쪽 다리
        for (let y = 30; y <= 33; y++) {
            for (let x = 17; x <= 21; x++) drawPixel(ctx, x + rightLegOff, y, s, pants);
        }
        // 왼쪽 신발
        for (let x = 9; x <= 14; x++) drawPixel(ctx, x + leftLegOff, 34, s, shoes);
        // 오른쪽 신발
        for (let x = 17; x <= 22; x++) drawPixel(ctx, x + rightLegOff, 34, s, shoes);

        requestAnimationFrame(drawFrame);
    }
    drawFrame();
}

// ── 마리오풍 픽셀 배경 ──
function drawPixelBackground(canvas) {
    if (!canvas) return;
    const parent = canvas.parentElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
    const ctx = canvas.getContext('2d');
    const s = 6; // 픽셀 크기
    const cols = Math.ceil(canvas.width / s);
    const rows = Math.ceil(canvas.height / s);

    let bgFrame = 0;

    function drawBgFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bgFrame++;

        // 하늘 그라데이션
        ctx.fillStyle = '#000044';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 별 (반짝임)
        const stars = [
            [5,3],[15,2],[25,5],[40,4],[55,3],[70,6],[85,2],[95,5],
            [10,8],[30,7],[50,9],[65,4],[80,8],[20,1],[45,7],[75,3]
        ];
        stars.forEach(([sx, sy]) => {
            const flicker = Math.sin(bgFrame * 0.05 + sx) > 0;
            if (flicker) {
                const px = sx % cols;
                const py = sy % (rows / 3);
                drawPixel(ctx, px, py, s, '#FFFFFF');
                // 십자 반짝임
                if (Math.sin(bgFrame * 0.03 + sx * 2) > 0.5) {
                    drawPixel(ctx, px-1, py, s, 'rgba(255,255,255,0.3)');
                    drawPixel(ctx, px+1, py, s, 'rgba(255,255,255,0.3)');
                    drawPixel(ctx, px, py-1, s, 'rgba(255,255,255,0.3)');
                    drawPixel(ctx, px, py+1, s, 'rgba(255,255,255,0.3)');
                }
            }
        });

        // 구름 (느리게 이동)
        function drawCloud(baseX, baseY) {
            const cx = (baseX + Math.floor(bgFrame * 0.15)) % (cols + 15) - 5;
            const c = 'rgba(100,100,180,0.4)';
            for (let dx = 0; dx < 6; dx++) drawPixel(ctx, cx+dx, baseY, s, c);
            for (let dx = -1; dx < 7; dx++) drawPixel(ctx, cx+dx, baseY+1, s, c);
            for (let dx = 0; dx < 6; dx++) drawPixel(ctx, cx+dx, baseY+2, s, c);
        }
        drawCloud(10, 4);
        drawCloud(50, 7);
        drawCloud(80, 3);

        // 바닥 (잔디 + 흙)
        const groundY = rows - 6;
        // 흙 레이어
        for (let y = groundY + 1; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                drawPixel(ctx, x, y, s, y === groundY + 1 ? '#553311' : '#442200');
            }
        }
        // 잔디 레이어
        for (let x = 0; x < cols; x++) {
            drawPixel(ctx, x, groundY, s, '#00AA00');
            // 잔디 윗부분 밝은 픽셀
            if (x % 3 === 0) drawPixel(ctx, x, groundY - 1, s, '#00CC00');
        }

        // ? 블록
        function drawQuestionBlock(bx, by) {
            const blockColor = '#DDAA00';
            const blockDark = '#AA7700';
            for (let dy = 0; dy < 3; dy++) {
                for (let dx = 0; dx < 3; dx++) {
                    drawPixel(ctx, bx+dx, by+dy, s, blockColor);
                }
            }
            drawPixel(ctx, bx, by, s, blockDark);
            drawPixel(ctx, bx+2, by, s, blockDark);
            drawPixel(ctx, bx, by+2, s, blockDark);
            drawPixel(ctx, bx+2, by+2, s, blockDark);
            // ? 마크
            const bounce = Math.sin(bgFrame * 0.05) > 0.3 ? 0 : 0;
            drawPixel(ctx, bx+1, by + bounce, s, '#FFFFFF');
        }
        drawQuestionBlock(12, groundY - 10);
        drawQuestionBlock(18, groundY - 14);
        drawQuestionBlock(cols - 15, groundY - 12);

        // 파이프
        function drawPipe(px, py, h) {
            const pipeGreen = '#00AA00';
            const pipeDark = '#008800';
            const pipeLight = '#00CC00';
            // 파이프 몸체
            for (let dy = 0; dy < h; dy++) {
                drawPixel(ctx, px, py + dy, s, pipeDark);
                drawPixel(ctx, px+1, py + dy, s, pipeGreen);
                drawPixel(ctx, px+2, py + dy, s, pipeGreen);
                drawPixel(ctx, px+3, py + dy, s, pipeLight);
                drawPixel(ctx, px+4, py + dy, s, pipeDark);
            }
            // 파이프 입구 (넓게)
            drawPixel(ctx, px-1, py, s, pipeDark);
            drawPixel(ctx, px+5, py, s, pipeDark);
            drawPixel(ctx, px-1, py+1, s, pipeDark);
            drawPixel(ctx, px+5, py+1, s, pipeDark);
            for (let dx = 0; dx <= 4; dx++) {
                drawPixel(ctx, px+dx, py, s, pipeLight);
                drawPixel(ctx, px+dx, py+1, s, pipeGreen);
            }
        }
        drawPipe(6, groundY - 5, 5);
        drawPipe(cols - 10, groundY - 7, 7);

        requestAnimationFrame(drawBgFrame);
    }
    drawBgFrame();
}

// ── Pixel Icons ──
function drawPixelIcon(canvasId, type) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = 3;
    ctx.clearRect(0, 0, 24, 24);

    if (type === 'career') {
        const c = '#00FFFF';
        [2,3,4,5].forEach(x => [2,3,4,5,6].forEach(y => drawPixel(ctx, x, y, s, c)));
        [3,4].forEach(x => drawPixel(ctx, x, 1, s, c));
        ctx.fillStyle = '#0000AA';
        ctx.fillRect(3*s, 3*s, 2*s, s);
    } else if (type === 'skills') {
        const c = '#FFFF00';
        drawPixel(ctx, 1, 1, s, c); drawPixel(ctx, 2, 1, s, c);
        drawPixel(ctx, 2, 2, s, c); drawPixel(ctx, 3, 3, s, c);
        drawPixel(ctx, 4, 4, s, c); drawPixel(ctx, 5, 5, s, c);
        drawPixel(ctx, 6, 6, s, c); drawPixel(ctx, 5, 6, s, c);
        drawPixel(ctx, 6, 5, s, c);
    } else if (type === 'projects') {
        const c = '#FFFF00';
        [1,2,3].forEach(x => drawPixel(ctx, x, 1, s, c));
        [0,1,2,3,4,5,6].forEach(x => [2,3,4,5,6].forEach(y => drawPixel(ctx, x, y, s, c)));
        ctx.fillStyle = '#CCCC00';
        ctx.fillRect(s, 3*s, 5*s, 3*s);
    } else if (type === 'awards') {
        const c = '#FFFF00';
        [2,3,4,5].forEach(x => drawPixel(ctx, x, 0, s, c));
        [1,2,3,4,5,6].forEach(x => drawPixel(ctx, x, 1, s, c));
        [2,3,4,5].forEach(x => drawPixel(ctx, x, 2, s, c));
        [3,4].forEach(x => drawPixel(ctx, x, 3, s, c));
        [3,4].forEach(x => drawPixel(ctx, x, 4, s, c));
        [2,3,4,5].forEach(x => drawPixel(ctx, x, 5, s, c));
    } else if (type === 'talks') {
        const c = '#FF00FF';
        [3,4].forEach(x => [0,1,2].forEach(y => drawPixel(ctx, x, y, s, c)));
        [2,3,4,5].forEach(x => drawPixel(ctx, x, 3, s, c));
        drawPixel(ctx, 3, 4, s, c); drawPixel(ctx, 4, 4, s, c);
        drawPixel(ctx, 3, 5, s, c); drawPixel(ctx, 4, 5, s, c);
        [2,3,4,5].forEach(x => drawPixel(ctx, x, 6, s, c));
    } else if (type === 'gallery') {
        const c = '#00FF88';
        // 프레임
        [0,1,2,3,4,5,6].forEach(x => drawPixel(ctx, x, 0, s, c));
        [0,1,2,3,4,5,6].forEach(x => drawPixel(ctx, x, 6, s, c));
        [0,1,2,3,4,5,6].forEach(y => { drawPixel(ctx, 0, y, s, c); drawPixel(ctx, 6, y, s, c); });
        // 산 모양
        drawPixel(ctx, 2, 4, s, '#00FFFF'); drawPixel(ctx, 3, 3, s, '#00FFFF');
        drawPixel(ctx, 4, 4, s, '#00FFFF'); drawPixel(ctx, 5, 3, s, '#00FFFF');
        drawPixel(ctx, 5, 2, s, '#00FFFF');
        // 해
        drawPixel(ctx, 2, 2, s, '#FFFF00');
    }
}

// ── Pixel Decoration (animated star) ──
function drawPixelDecoration() {
    const canvas = document.getElementById('pixelDecoration');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = 4;
    let frame = 0;

    function animate() {
        ctx.clearRect(0, 0, 64, 64);
        const colors = ['#00FFFF', '#FFFF00', '#FF00FF', '#00FF00'];
        const c = colors[Math.floor(frame / 30) % colors.length];
        const cx = 8, cy = 8;

        drawPixel(ctx, cx, cy-3, s, c);
        drawPixel(ctx, cx, cy-2, s, c);
        drawPixel(ctx, cx-1, cy-1, s, c);
        drawPixel(ctx, cx, cy-1, s, c);
        drawPixel(ctx, cx+1, cy-1, s, c);
        for (let x = cx-3; x <= cx+3; x++) drawPixel(ctx, x, cy, s, c);
        drawPixel(ctx, cx-1, cy+1, s, c);
        drawPixel(ctx, cx, cy+1, s, c);
        drawPixel(ctx, cx+1, cy+1, s, c);
        drawPixel(ctx, cx, cy+2, s, c);
        drawPixel(ctx, cx, cy+3, s, c);

        const sparkleOffset = Math.sin(frame * 0.1) * 2;
        drawPixel(ctx, cx-4, cy-3 + Math.round(sparkleOffset), s, c);
        drawPixel(ctx, cx+4, cy+3 - Math.round(sparkleOffset), s, c);

        frame++;
        requestAnimationFrame(animate);
    }
    animate();
}

// ── Scroll Pixel Glitch Effect ──
function initGlitchOnScroll() {
    const glitchTargets = document.querySelectorAll('.section-title, .project-name, .hero-name, .project-year-label');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                // 글리치 애니메이션 트리거
                el.classList.add('glitch-active');
                // 애니메이션 끝나면 클래스 제거 (재트리거 가능)
                el.addEventListener('animationend', () => {
                    el.classList.remove('glitch-active');
                }, { once: true });
            }
        });
    }, { threshold: 0.5 });

    glitchTargets.forEach(el => observer.observe(el));

    // 섹션 디바이더에 glitch-line 클래스 추가
    document.querySelectorAll('.section-divider').forEach(el => {
        el.classList.add('glitch-line');
    });

    const lineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.glitch-line').forEach(el => lineObserver.observe(el));
}

// ── Scroll Fade-in Observer ──
function initScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ── Skill Bars Animation ──
function initSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.skill-bar-fill');
                bars.forEach((bar, i) => {
                    const w = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = w + '%';
                    }, i * 150);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const skillsSection = document.getElementById('skills');
    if (skillsSection) observer.observe(skillsSection);
}

// ── Boot Loading Screen (터미널 타이핑 효과 ~3초) ──
function showBootScreen() {
    return new Promise((resolve) => {
        const overlay = document.getElementById('bootOverlay');
        const log = document.getElementById('bootLog');
        if (!overlay || !log) { resolve(); return; }

        const lines = [
            { text: '> Initializing system...', delay: 0 },
            { text: '> Loading portfolio modules... [OK]', delay: 200 },
            { text: '> Loading profile: minjun.han [OK]', delay: 200 },
            { text: '> ████████████████████████████ 100%', delay: 300 },
            { text: '> System ready. Welcome, Minjun.', delay: 200 },
        ];

        function typeLine(lineObj) {
            return new Promise((res) => {
                const lineEl = document.createElement('div');
                lineEl.className = 'boot-line';
                log.appendChild(lineEl);
                const text = lineObj.text;

                if (text.includes('████')) {
                    lineEl.textContent = text;
                    lineEl.style.color = '#00FF00';
                    setTimeout(res, 80);
                    return;
                }

                let charIndex = 0;
                const typeInterval = setInterval(() => {
                    charIndex += 2;
                    lineEl.textContent = text.substring(0, charIndex);
                    if (text.includes('[OK]') && charIndex >= text.length) {
                        lineEl.innerHTML = text.replace('[OK]', '<span style="color:#00FF00">[OK]</span>');
                    }
                    if (charIndex >= text.length) {
                        clearInterval(typeInterval);
                        log.scrollTop = log.scrollHeight;
                        setTimeout(res, 30);
                    }
                }, 15);
            });
        }

        async function runBoot() {
            for (const line of lines) {
                await new Promise(r => setTimeout(r, line.delay));
                await typeLine(line);
            }
            await new Promise(r => setTimeout(r, 200));
            overlay.style.transition = 'opacity 0.5s ease';
            overlay.style.opacity = '0';
            await new Promise(r => setTimeout(r, 500));
            overlay.style.display = 'none';
            resolve();
        }
        runBoot();
    });
}

// ── Boot Sequence ──
function bootSequence() {
    const prompt = document.querySelector('.hero-section .terminal-prompt');
    if (!prompt) return;
    prompt.style.opacity = '0';
    setTimeout(() => {
        prompt.style.opacity = '1';
        prompt.style.transition = 'opacity 0.3s';
    }, 300);
}

// ── Konami Code Easter Egg ──
let konamiCode = [];
const konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    if (konamiCode.length > 10) konamiCode.shift();
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.setProperty('--scanline-opacity', '0.08');
        document.querySelectorAll('.glow-text').forEach(el => {
            el.style.textShadow = '0 0 20px #00FFFF, 0 0 40px #00FFFF';
        });
        konamiCode = [];
    }
});

// ── Initialize ──
document.addEventListener('DOMContentLoaded', async () => {
    // 부트 로딩 화면 표시
    await showBootScreen();

    // 픽셀 배경 + 캐릭터 애니메이션 시작
    drawPixelBackground(document.getElementById('pixelBackground'));
    startAvatarAnimation(document.getElementById('pixelAvatar'));
    drawPixelIcon('iconCareer', 'career');
    drawPixelIcon('iconSkills', 'skills');
    drawPixelIcon('iconProjects', 'projects');
    drawPixelIcon('iconAwards', 'awards');
    drawPixelIcon('iconTalks', 'talks');
    drawPixelIcon('iconGallery', 'gallery');
    drawPixelDecoration();

    // 테마 스위처 + 언어 전환 초기화
    initThemeSwitcher();
    initLanguageToggle();

    // 애니메이션 초기화
    initScrollObserver();
    initSkillBars();
    initGlitchOnScroll();
    initRandomCRTGlitch();
    bootSequence();

    // 모바일 터치 지원
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('touchstart', () => {
            card.style.borderColor = '#00FFFF';
            card.style.boxShadow = '0 0 12px rgba(0, 255, 255, 0.15)';
        }, { passive: true });
        card.addEventListener('touchend', () => {
            setTimeout(() => {
                card.style.borderColor = '';
                card.style.boxShadow = '';
            }, 300);
        }, { passive: true });
    });
});

// ── 랜덤 CRT 지지직 글리치 ──
function initRandomCRTGlitch() {
    const overlay = document.getElementById('crtGlitchOverlay');
    if (!overlay) return;

    function triggerGlitch() {
        overlay.classList.add('active');
        overlay.addEventListener('animationend', () => {
            overlay.classList.remove('active');
        }, { once: true });

        // 다음 글리치까지 5~12초 랜덤 대기
        const nextDelay = 5000 + Math.random() * 7000;
        setTimeout(triggerGlitch, nextDelay);
    }

    // 첫 글리치는 3~6초 후
    setTimeout(triggerGlitch, 3000 + Math.random() * 3000);
}

// ── 테마 스위처 ──
function initThemeSwitcher() {
    const buttons = document.querySelectorAll('.theme-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            document.documentElement.setAttribute('data-theme', theme);
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.body.style.transition = 'background-color 0.5s, color 0.3s';
        });
    });
}

// ── 한/영 전환 시스템 ──
const translations = {
    // 섹션 타이틀 (canvas 아이콘 뒤 텍스트만)
    sectionTitles: {
        'career': { ko: ' 경력사항', en: ' Career' },
        'skills': { ko: ' 핵심 역량 & 도구', en: ' Core Skills & Tools' },
        'projects': { ko: ' 주요 프로젝트', en: ' Key Projects' },
        'awards': { ko: ' 수상실적', en: ' Awards' },
        'talks': { ko: ' 강연 및 활동', en: ' Talks & Activities' },
        'gallery': { ko: ' 작업 갤러리', en: ' Work Gallery' },
    },
    // 경력사항
    careers: [
        { ko: '현재', en: 'Present' },
        { ko: '라인 (LINE)', en: 'LINE Corp.' },
        { ko: '당근마켓', en: 'Karrot (Danggeun Market)' },
        { ko: '삼성전자 무선사업부', en: 'Samsung Mobile Division' },
        { ko: '스튜디오좋', en: 'Studio Joh' },
        { ko: '주니어 디자이너', en: 'Junior Designer' },
        { ko: '국민대학교', en: 'Kookmin University' },
        { ko: '시각디자인학과', en: 'Visual Communication Design' },
    ],
    // 스킬 카테고리
    skills: {
        titles: [
            { ko: '⚡ 디자인 역량', en: '⚡ Design Skills' },
            { ko: '🔧 사용 도구', en: '🔧 Tools' },
        ],
        names: [
            { ko: 'UI/UX 디자인', en: 'UI/UX Design' },
            { ko: '디자인 시스템', en: 'Design System' },
            { ko: '프로토타이핑', en: 'Prototyping' },
            { ko: '사용자 리서치', en: 'User Research' },
            { ko: '모션/인터랙션', en: 'Motion/Interaction' },
        ],
    },
    // 프로젝트
    projects: [
        { ko: '라인 메신저 채팅 UX 리디자인', en: 'LINE Messenger Chat UX Redesign' },
        { ko: '대화방 정보 구조 재설계 및 새로운 인터랙션 패턴 도입', en: 'Restructured chatroom IA and introduced new interaction patterns' },
        { ko: '일본/태국/대만 3개국 사용성 테스트 진행', en: 'Conducted usability testing across Japan, Thailand, and Taiwan' },
        { ko: '📊 메시지 탐색 시간 40% 단축', en: '📊 40% reduction in message navigation time' },
        { ko: '라인 디자인 시스템 3.0 구축 리드', en: 'LINE Design System 3.0 Build Lead' },
        { ko: '컴포넌트 240개 체계화, 다크모드 전면 지원', en: '240 components systematized, full dark mode support' },
        { ko: '사내 디자인 시스템 컨퍼런스 기획 및 발표', en: 'Organized and presented at internal design system conference' },
        { ko: '📊 디자인-개발 핸드오프 시간 50% 단축', en: '📊 50% reduction in design-dev handoff time' },
        { ko: '라인 VOOM (숏폼) 크리에이터 스튜디오', en: 'LINE VOOM (Short-form) Creator Studio' },
        { ko: '영상 편집 도구 UI 설계 및 프로토타이핑', en: 'Video editing tool UI design and prototyping' },
        { ko: '크리에이터 온보딩 플로우 디자인', en: 'Creator onboarding flow design' },
        { ko: '📊 콘텐츠 업로드 완료율 35% 향상', en: '📊 35% increase in content upload completion rate' },
        { ko: '라인 AI 어시스턴트 UI 디자인', en: 'LINE AI Assistant UI Design' },
        { ko: '대화형 AI 인터페이스 디자인 가이드라인 수립', en: 'Established conversational AI interface design guidelines' },
        { ko: '멀티모달 입출력 UI 패턴 설계', en: 'Multimodal I/O UI pattern design' },
        { ko: '라인 선물하기 서비스 글로벌 런칭', en: 'LINE Gift Service Global Launch' },
        { ko: '일본/태국 현지화 UI 설계', en: 'Japan/Thailand localized UI design' },
        { ko: '📊 구매 전환율 22% 향상', en: '📊 22% increase in purchase conversion rate' },
        { ko: '라인 Pay 결제 UX 간소화', en: 'LINE Pay Checkout UX Simplification' },
        { ko: '결제 플로우 5단계 → 3단계 축소', en: 'Payment flow reduced from 5 to 3 steps' },
        { ko: '생체 인증 연동 UI 설계', en: 'Biometric authentication UI design' },
        { ko: '당근마켓 채팅 거래 경험 개선', en: 'Karrot Chat Trading Experience Improvement' },
        { ko: '가격 제안/약속 잡기 인터랙션 디자인', en: 'Price suggestion/appointment interaction design' },
        { ko: '📊 거래 성사율 18% 향상', en: '📊 18% increase in transaction completion rate' },
        { ko: '당근마켓 동네생활 피드 리디자인', en: 'Karrot Community Feed Redesign' },
        { ko: '카드형 피드 UI 및 이미지 뷰어 설계', en: 'Card-style feed UI and image viewer design' },
        { ko: '📊 게시글 조회율 25% 증가', en: '📊 25% increase in post view rate' },
        { ko: '당근마켓 비즈프로필 사장님 페이지', en: 'Karrot Business Profile Owner Page' },
        { ko: '소상공인 프로필 빌더 UI 설계', en: 'Small business profile builder UI design' },
        { ko: '📊 사장님 가입 전환율 30% 향상', en: '📊 30% increase in owner signup conversion' },
        { ko: '당근마켓 디자인 시스템 "당근 씨앗" 초기 구축', en: 'Karrot Design System "Karrot Seeds" Initial Build' },
        { ko: 'Figma 컴포넌트 라이브러리 120개 구축', en: 'Built 120 Figma component library' },
        { ko: '디자인 토큰 체계 설계', en: 'Design token system architecture' },
        { ko: '당근마켓 검색 경험 리디자인', en: 'Karrot Search Experience Redesign' },
        { ko: '필터 UI 및 검색 결과 레이아웃 개선', en: 'Filter UI and search results layout improvement' },
        { ko: '📊 검색 후 상세 조회율 20% 향상', en: '📊 20% increase in post-search detail view rate' },
        { ko: '당근마켓 앱 전면 리디자인', en: 'Karrot App Full Redesign' },
        { ko: '홈 피드 카드 UI 및 하단 네비게이션 설계', en: 'Home feed card UI and bottom navigation design' },
        { ko: '신규 브랜드 아이덴티티 적용', en: 'New brand identity implementation' },
        { ko: '삼성 갤럭시 S8 Always On Display UI', en: 'Samsung Galaxy S8 Always On Display UI' },
        { ko: '시계/알림 위젯 비주얼 디자인', en: 'Clock/notification widget visual design' },
        { ko: '저전력 디스플레이 환경 제약 내 디자인 최적화', en: 'Design optimization within low-power display constraints' },
        { ko: '삼성 갤럭시 테마스토어 UI 개편', en: 'Samsung Galaxy Theme Store UI Revamp' },
        { ko: '테마 미리보기 및 적용 플로우 개선', en: 'Theme preview and application flow improvement' },
        { ko: '삼성 갤럭시 S7 Edge Panel UI', en: 'Samsung Galaxy S7 Edge Panel UI' },
        { ko: '엣지 패널 앱 바로가기/연락처 UI 설계', en: 'Edge panel app shortcuts/contacts UI design' },
        { ko: '한 손 조작 인터랙션 패턴 연구', en: 'One-handed interaction pattern research' },
        { ko: '삼성페이 카드 등록 UX 개선', en: 'Samsung Pay Card Registration UX Improvement' },
        { ko: 'OCR 스캔 연동 UI 및 에러 핸들링 설계', en: 'OCR scan integration UI and error handling design' },
        { ko: '삼성 갤럭시 S6 기본 앱 아이콘 리디자인', en: 'Samsung Galaxy S6 Default App Icon Redesign' },
        { ko: '플랫 디자인 전환 가이드라인 수립', en: 'Flat design transition guidelines' },
        { ko: '아이콘 200개 리디자인', en: 'Redesigned 200 icons' },
        { ko: '현대카드 뮤직 라이브러리 공간 그래픽', en: 'Hyundai Card Music Library Spatial Graphics' },
        { ko: '사이니지 및 공간 안내 시스템 디자인', en: 'Signage and wayfinding system design' },
        { ko: '아모레퍼시픽 이니스프리 패키지 디자인', en: 'Amorepacific Innisfree Package Design' },
        { ko: '시즌 한정판 패키지 일러스트레이션', en: 'Seasonal limited edition package illustration' },
        { ko: '서울시 공공 캠페인 "서울은 꽃이다" 포스터', en: 'Seoul City Public Campaign "Seoul is a Flower" Poster' },
        { ko: '타이포그래피 기반 시리즈 포스터 4종 디자인', en: 'Typography-based series poster design (4 types)' },
    ],
    // 수상
    awards: [
        { ko: 'Good Design Award (일본)', en: 'Good Design Award (Japan)' },
        { ko: '라인 디자인 시스템', en: 'LINE Design System' },
        { ko: '라인 VOOM', en: 'LINE VOOM' },
        { ko: '라인 선물하기', en: 'LINE Gift' },
        { ko: 'Google Play Best App Design 후보', en: 'Google Play Best App Design Nominee' },
        { ko: '당근마켓', en: 'Karrot' },
        { ko: '당근마켓 앱', en: 'Karrot App' },
    ],
    // 강연
    talks: [
        { ko: '한국 커뮤니티 세션 연사', en: 'Korea Community Session Speaker' },
        { ko: '디자인 스펙트럼', en: 'Design Spectrum' },
        { ko: '연사 — "디자인 시스템, 만들기보다 지키기가 어렵다"', en: 'Speaker — "Design Systems: Harder to maintain than to build"' },
        { ko: '연사 — "디자이너가 코드를 읽으면 생기는 일"', en: 'Speaker — "What happens when designers read code"' },
        { ko: '연사 — "당근마켓 로컬 서비스 디자인"', en: 'Speaker — "Karrot Local Service Design"' },
        { ko: '디자인 나침반', en: 'Design Compass' },
        { ko: '멘토 (주니어 디자이너 멘토링)', en: 'Mentor (Junior Designer Mentoring)' },
        { ko: '노트폴리오', en: 'Notefolio' },
        { ko: '인터뷰 — "프로덕트 디자이너로 성장하기"', en: 'Interview — "Growing as a Product Designer"' },
    ],
    // 푸터
    footer: { ko: '© 2024 한민준. Built with pure HTML/CSS/JS.', en: '© 2024 Minjun Han. Built with pure HTML/CSS/JS.' },
    tagline: { ko: '$ echo "10+ years of crafting digital experiences"', en: '$ echo "10+ years of crafting digital experiences"' },
};

let currentLang = 'ko';

function initLanguageToggle() {
    const btn = document.getElementById('langToggle');
    if (!btn) return;

    btn.addEventListener('click', () => {
        currentLang = currentLang === 'ko' ? 'en' : 'ko';
        btn.textContent = currentLang === 'ko' ? 'EN' : '한';
        applyTranslations();
    });
}

function applyTranslations() {
    const lang = currentLang;

    // 섹션 타이틀
    document.querySelectorAll('.section-title').forEach(el => {
        const section = el.closest('.section') || el.closest('section');
        if (!section) return;
        const id = section.id;
        if (translations.sectionTitles[id]) {
            // canvas 아이콘 유지
            const canvas = el.querySelector('canvas');
            const txt = translations.sectionTitles[id][lang];
            el.textContent = '';
            if (canvas) el.appendChild(canvas);
            el.append(txt);
        }
    });

    // 텍스트 치환 함수
    function replaceTexts(items) {
        items.forEach(item => {
            const src = lang === 'en' ? item.ko : item.en;
            const dst = lang === 'en' ? item.en : item.ko;
            // 모든 텍스트 노드 검색
            const walker = document.createTreeWalker(
                document.querySelector('.terminal-window'),
                NodeFilter.SHOW_TEXT,
                null, false
            );
            let node;
            while (node = walker.nextNode()) {
                if (node.textContent.includes(src)) {
                    node.textContent = node.textContent.replace(src, dst);
                }
            }
        });
    }

    replaceTexts(translations.careers);
    replaceTexts(translations.skills.titles);
    replaceTexts(translations.skills.names);
    replaceTexts(translations.projects);
    replaceTexts(translations.awards);
    replaceTexts(translations.talks);

    // 푸터
    const footerText = document.querySelector('.footer-text');
    if (footerText) footerText.textContent = translations.footer[lang];
}
